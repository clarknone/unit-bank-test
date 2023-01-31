import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/schema/auth.schema';
import { UnitProvider } from 'src/unit/config/unit.provider';
import { UnitService } from 'src/unit/unit.service';
import { UnitWalletController } from '../controllers/user.wallet.controller';
import { WalletTransfer, WalletTransferSchema } from '../entities/transfer.entity';
import { Wallet, WalletSchema } from '../entities/unit.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
    MongooseModule.forFeature([{ name: WalletTransfer.name, schema: WalletTransferSchema }]),
  ],
  controllers: [UnitWalletController],
  providers: [ UnitService],
})
export class UnitModule {}
