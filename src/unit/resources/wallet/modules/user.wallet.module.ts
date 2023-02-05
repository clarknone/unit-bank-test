import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/schema/auth.schema';
import { UnitProvider } from 'src/unit/config/unit.provider';
import { UnitService } from 'src/unit/unit.service';
import { UnitWalletController } from '../controllers/user.wallet.controller';
import { Account, AccountSchema } from '../entities/account.entity';
import { Application, ApplicationSchema } from '../entities/application.entity';
import {
  WalletTransfer,
  WalletTransferSchema,
} from '../entities/transfer.entity';
import { Wallet, WalletSchema } from '../entities/unit.entity';
import {
  WalletWithdraw,
  WalletWithdrawSchema,
} from '../entities/withdraw.entity';
import { UnitWalletTransferService } from '../services/transfer.wallet.service';
import { UnitApplicationService } from '../services/user.application.service';
import { UnitWalletService } from '../services/user.wallet.service';
import { UnitWalletWithdrawService } from '../services/withdraw.wallet.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: WalletTransfer.name, schema: WalletTransferSchema },
      { name: Application.name, schema: ApplicationSchema },
      { name: WalletWithdraw.name, schema: WalletWithdrawSchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: Account.name, schema: AccountSchema },
    ]),
  ],
  controllers: [UnitWalletController],
  providers: [
    UnitProvider,
    UnitWalletService,
    UnitApplicationService,
    UnitWalletTransferService,
    UnitWalletWithdrawService,
  ],
})
export class WalletModule {}
