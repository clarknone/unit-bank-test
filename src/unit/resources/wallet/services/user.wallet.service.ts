import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Account,
  Address,
  DepositAccount,
  Unit,
} from '@unit-finance/unit-node-sdk';
import { Model } from 'mongoose';
import { IAuthUser } from 'src/auth/interfaces/auth.interface';
import { User, UserDocument } from 'src/auth/schema/auth.schema';
import { ServiceException } from 'src/helper/exceptions/exceptions/service.layer.exception';
import { UnitProvider } from 'src/unit/config/unit.provider';
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
  ) {}

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
    return this.WalletModel.find({ user: authUser.id });
  }
}
