import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Address, DepositAccount } from '@unit-finance/unit-node-sdk';
import { Model } from 'mongoose';
import { IAuthUser } from '../../../../auth/interfaces/auth.interface';
import { User, UserDocument } from '../../../../auth/schema/auth.schema';
import { ServiceException } from '../../../../helper/exceptions/exceptions/service.layer.exception';
import { UnitProvider } from '../../../../unit/config/unit.provider';
import {
  CreateAccountDto,
  CreateApplicationDto,
} from '../../../../unit/dto/create-unit.dto';
import { Account, AccountDocument } from '../entities/account.entity';
import { Wallet, WalletDocument } from '../entities/unit.entity';

// const unit = new Unit(process.env.UNIT_API_KEY, 'https://api.s.unit.sh/');
// console.log('token', process.env.UNIT_API_KEY);

@Injectable()
export class UnitWalletService {
  constructor(
    private unit: UnitProvider,
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
    @InjectModel(Wallet.name)
    private WalletModel: Model<WalletDocument>,
    @InjectModel(Account.name)
    private AccountModel: Model<AccountDocument>,
  ) {}

  async createAccount(user: IAuthUser, data: CreateAccountDto) {
    const account = new this.AccountModel({ ...data, user: user.id });
    return account.save();
  }

  async getUserAccounts(user: IAuthUser) {
    return this.AccountModel.find({ user: user.id });
  }

  async create(authUser: IAuthUser) {
    const user = await this.UserModel.findById(authUser.id);
    return this.WalletModel.findOne({ user: user._id }).then((wallet) => {
      if (wallet) {
        throw new ServiceException({
          error: 'Wallet already exist',
          status: 400,
        });
      }

      return this.unit.accounts
        .create({
          type: 'depositAccount',
          attributes: {
            depositProduct: 'checking',
            tags: {
              uid: user.uuid,
            },
          },
          relationships: {
            customer: {
              data: {
                type: 'customer',
                id: user.unitId,
              },
            },
          },
        })
        .then((account) => {
          return this.createWallet(
            account.data as DepositAccount,
            new this.WalletModel({ user: user }),
          );
        });
    });
  }

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
        .catch((e) => {
          throw new ServiceException({
            error: e.message,
            status: 400,
          });
        });
    });
  }

  async getAllWallet() {
    return this.WalletModel.find({});
  }

  private createWallet(account: DepositAccount, wallet: WalletDocument) {
    wallet.routingNumber = account.attributes.routingNumber;
    wallet.accountNumber = account.attributes.accountNumber;
    wallet.currency = account.attributes?.currency || '';
    wallet.balance = account.attributes.balance;
    wallet.eid = account.id;
    wallet.status = account.attributes.status || '';
    wallet.type = account.attributes.depositProduct || '';
    wallet.save();
    return wallet;
  }

  async getWallet(authUser: IAuthUser) {
    return this.WalletModel.findOne({ user: authUser.id });
  }

  async getUser(){
    return this.UserModel.find().then((data)=>{
      console.log({data})
      return data
    }).catch(e=>{
      throw new ServiceException({ error: 'cannot fetch users' });
    })
  }

  getUnitTest(){
    return this.unit.getTest()
  }
}
