import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Address, Unit } from '@unit-finance/unit-node-sdk';
import { Model } from 'mongoose';
import { UnitProvider } from './config/unit.provider';
import { CreateApplicationDto, CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { User, UserDocument } from '../auth/schema/auth.schema';
import { IAuthUser } from '../auth/interfaces/auth.interface';

// const unit = new Unit(process.env.UNIT_API_KEY, 'https://api.s.unit.sh/');
// console.log('token', process.env.UNIT_API_KEY);

@Injectable()
export class UnitService {
  constructor(
    private unit: UnitProvider,
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
  ) {}

  apply(authUser: IAuthUser) {
    return this.UserModel.findById(authUser.id).then((user) => {
      const address: Address = {
        street: '18 Maryland avenue',
        city: 'Ikeja',
        postalCode: '234',
        state: 'LA',
        country: 'NG',
      };
      const [first, last] = user.fullname.split(' ');
      return this.unit.applicationForms
        .create({
          type: 'applicationForm',
          attributes: {
            tags: {
              uid: user.uuid,
            },
            applicantDetails: {
              nationality: address.country,
              address: address,
              fullName: { first, last },
              dateOfBirth: '1999-02-23',
              email: user.email,
              phone: { countryCode: '234', number: '8153353131' },
            },
          },
        })
        .catch((e) => {
          console.log('eerror', e);
          console.log('eerror', e.message);
        });
    });
  }
  

  findAll() {
    return this.unit.applications.list();
    // return `This action returns all unit`;
  }

  findOne(id: number) {
    return `This action returns a #${id} unit`;
  }

  update(id: number, updateUnitDto: UpdateUnitDto) {
    return `This action updates a #${id} unit`;
  }

  remove(id: number) {
    return `This action removes a #${id} unit`;
  }
}
