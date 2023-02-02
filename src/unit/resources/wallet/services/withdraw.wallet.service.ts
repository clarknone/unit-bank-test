import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IAuthUser } from 'src/auth/interfaces/auth.interface';
import { ServiceException } from 'src/helper/exceptions/exceptions/service.layer.exception';
import { UnitProvider } from 'src/unit/config/unit.provider';
import { CreateWalletWithdrawDto } from 'src/unit/dto/create-unit.dto';
import { Wallet, WalletDocument } from '../entities/unit.entity';
import {
  WalletWithdraw,
  WalletWithdrawDocument,
} from '../entities/withdraw.entity';

@Injectable()
export class UnitWalletWithdrawService {
  constructor(
    private unit: UnitProvider,

    @InjectModel(Wallet.name)
    private WalletModel: Model<WalletDocument>,

    @InjectModel(WalletWithdraw.name)
    private WalletWithdrawModel: Model<WalletWithdrawDocument>,
  ) {}

  async walletWithdraw(authUser: IAuthUser, data: CreateWalletWithdrawDto) {
    return this.WalletModel.findById(data.wallet).then(async (userWallet) => {
      if (!userWallet || userWallet.status != 'Open') {
        throw new ServiceException({
          error: 'cannot perform transaction on wallet',
        });
      }
      if (userWallet.balance < data.amount) {
        throw new ServiceException({ error: 'insufficent funds' });
      }
      return this.getReservedWallet().then(async (receiveWallet) => {
        if (!receiveWallet) {
          throw new ServiceException({
            error:
              'cannot withdraw at the moment, failed to get resolving account ',
          });
        }
        return this.unit
          .bookTransfer(userWallet.eid, receiveWallet.eid, data.amount)
          .then((result) => {
            return this.WalletWithdrawModel.create({
              user: authUser.id,
              wallet: userWallet._id,
              amount: result.data.attributes.amount,
              account: data.account,
              status: result.data.attributes.status,
              eid: result.data.id,
              txid: result.data.relationships?.transaction?.data?.id,
            });
          });
      });
    });
  }

  private async getReservedWallet(): Promise<WalletDocument> {
    return this.WalletModel.findOne({ type: 'reserved' });
  }
}
