import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Address, DepositAccount } from '@unit-finance/unit-node-sdk';
import { Model } from 'mongoose';
import { IAuthUser } from 'src/auth/interfaces/auth.interface';
import { User, UserDocument } from 'src/auth/schema/auth.schema';
import { ServiceException } from 'src/helper/exceptions/exceptions/service.layer.exception';
import { UnitProvider } from 'src/unit/config/unit.provider';
import {
  ApplicationApproveDto,
  CreateApplicationDto,
  WalletFilterDto,
} from 'src/unit/dto/create-unit.dto';
import {
  Application,
  ApplicationDocument,
} from '../entities/application.entity';

// const unit = new Unit(process.env.UNIT_API_KEY, 'https://api.s.unit.sh/');
// console.log('token', process.env.UNIT_API_KEY);

@Injectable()
export class UnitApplicationService {
  constructor(
    private unit: UnitProvider,
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
    @InjectModel(Application.name)
    private ApplicationModel: Model<ApplicationDocument>,
  ) {}

  async createApplication(authUser: IAuthUser, data: CreateApplicationDto) {
    if (authUser.isVerified) {
      throw new ServiceException({ error: 'cannot have two applications' });
    }
    return this.UserModel.findById(authUser.id).then(async (user) => {
      const address: Address = {
        street: data.address.street,
        city: data.address.city,
        state: data.address.state,
        country: data.address.country,
        postalCode: data.address.postalCode,
      };
      const [first, last] = user.fullname.split(' ');
      return this.unit.applications
        .create({
          type: 'individualApplication',
          attributes: {
            tags: {
              uid: user.uuid,
            },
            passport: data.passport,
            nationality: address.country,
            address: address,
            fullName: { first, last },
            dateOfBirth: data.dateOfBirth,
            email: user.email,
            phone: { countryCode: '234', number: user.phone },
          },
        })
        .then((response) => {
          const application = response.data;
          this.ApplicationModel.create({
            eid: application.id,
            status: 'pending',
            user: user._id,
          });
        })
        .catch((e) => {
          throw new ServiceException({
            error: e.message,
            status: 400,
          });
        });
    });
  }

  async getAllApplication(filter: WalletFilterDto) {
    return this.ApplicationModel.find({ ...filter }).populate([
      { path: 'user', select: ['fullname', 'email'] },
    ]);
  }

  async approveApplication(user: IAuthUser, data: ApplicationApproveDto) {
    // perform extra validation

    return this.ApplicationModel.findById(data.application).then(
      async (application) => {
        if (!application) {
          throw new ServiceException({ error: 'invalid Application' });
        }
        return this.unit.simulations
          .approveApplication(application.eid, {
            type: 'applicationApprove',
            attributes: { reason: 'Testing' },
          })
          .then(() => {
            application.status = data.status;
            return application.save();
          })
          .catch((e) => {
            throw new ServiceException({
              error: e.message,
              status: 400,
            });
          });
      },
    );
  }
}
