import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IAuthUser } from 'src/auth/interfaces/auth.interface';
import { User, UserDocument } from 'src/auth/schema/auth.schema';
import { ServiceException } from 'src/helper/exceptions/exceptions/service.layer.exception';
import { UnitProvider } from 'src/unit/config/unit.provider';
import { CreateWalletTransferDto } from 'src/unit/dto/create-unit.dto';
import {
  WalletTransferDocument,
  WalletTransfer,
} from '../entities/transfer.entity';
import { Wallet, WalletDocument } from '../entities/unit.entity';

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

  private async getUserWallet(user: string): Promise<WalletDocument> {
    return this.UserModel.findOne({ email: user }).then(async (receiver) => {
      if (!receiver) return null;
      return this.WalletModel.findOne({ user: receiver._id });
    });
  }
}
