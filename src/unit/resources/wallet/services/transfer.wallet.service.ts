import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  WalletTransferDocument,
  WalletTransfer,
} from '../entities/transfer.entity';
import { Wallet, WalletDocument } from '../entities/unit.entity';
import { UnitProvider } from '../../../config/unit.provider';
import { User, UserDocument } from '../../../../auth/schema/auth.schema';
import { IAuthUser } from '../../../../auth/interfaces/auth.interface';
import { CreateWalletTransferDto, WalletTransferFilterDto } from '../../../dto/create-unit.dto';
import { ServiceException } from '../../../../helper/exceptions/exceptions/service.layer.exception';

// const unit = new Unit(process.env.UNIT_API_KEY, 'https://api.s.unit.sh/');
// console.log('token', process.env.UNIT_API_KEY);

@Injectable()
export class UnitWalletTransferService {
  constructor(
    private unit: UnitProvider,
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,

    @InjectModel(Wallet.name)
    private WalletModel: Model<WalletDocument>,

    @InjectModel(WalletTransfer.name)
    private WalletTransferModel: Model<WalletTransferDocument>,
  ) {}

  async walletTransfer(authUser: IAuthUser, data: CreateWalletTransferDto) {
    return this.WalletModel.findById(data.sendWallet).then(
      async (userWallet) => {
        if (!userWallet || userWallet.status != 'Open') {
          throw new ServiceException({
            error: 'cannot perform transaction on wallet',
          });
        }
        if (userWallet.balance < data.amount) {
          throw new ServiceException({ error: 'insufficent funds' });
        }
        return this.getUserWallet(data.user).then(async (receiveWallet) => {
          if (!receiveWallet) {
            throw new ServiceException({ error: 'invalid receiver account' });
          }
          return this.unit
            .bookTransfer(userWallet.eid, receiveWallet.eid, data.amount)
            .then((result) => {
              return this.WalletTransferModel.create({
                user: authUser.id,
                sendWallet: userWallet._id,
                amount: result.data.attributes.amount,
                receiveWallet: receiveWallet._id,
                status: result.data.attributes.status,
                eid: result.data.id,
                txid: result.data.relationships?.transaction?.data?.id,
              });
            });
        });
      },
    );
  }


  async getAllTransfer(filter:WalletTransferFilterDto){
    return this.WalletTransferModel.findOne({...filter})
  }

  private async getUserWallet(user: string): Promise<WalletDocument> {
    return this.UserModel.findOne({ email: user }).then(async (receiver) => {
      if (!receiver) return null;
      return this.WalletModel.findOne({ user: receiver._id });
    });
  }
}
