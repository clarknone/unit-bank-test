import { Module } from '@nestjs/common';
import { UnitService } from './unit.service';
import { UnitProvider } from './config/unit.provider';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/schema/auth.schema';
import { RouterModule } from '@nestjs/core';
import { UnitRoutes } from './routes';
import { WalletModule } from './resources/wallet/modules/user.wallet.module';
import { WebhookModule } from './resources/webhook/webhook.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    WalletModule,
    WebhookModule,
    RouterModule.register(UnitRoutes),
  ],
  providers: [UnitProvider, UnitService],
})
export class UnitModule {}
