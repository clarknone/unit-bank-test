import { Module } from '@nestjs/common';
import { UnitService } from './unit.service';
import { UnitProvider } from './config/unit.provider';
import { MongooseModule } from '@nestjs/mongoose';
import { RouterModule } from '@nestjs/core';
import { UnitRoutes } from './routes';
import { WalletModule } from './resources/wallet/modules/user.wallet.module';
import { WebhookModule } from './resources/webhook/webhook.module';
import { AdminWalletModule } from './resources/wallet/modules/admin.wallet.module';
import { User, UserSchema } from '../auth/schema/auth.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    WalletModule,
    AdminWalletModule,
    WebhookModule,
    RouterModule.register(UnitRoutes),
  ],
  providers: [UnitProvider, UnitService],
})
export class UnitModule {}
