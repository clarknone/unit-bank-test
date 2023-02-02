import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { UnitProvider } from 'src/unit/config/unit.provider';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/schema/auth.schema';
import { WebhookExceptionFilter } from 'src/helper/exceptions/filters/webhook.exception';
import { APP_FILTER } from '@nestjs/core';
import { WebhookLog, WebhookLogSchema } from './entities/webhook.entity';
import { Wallet, WalletSchema } from '../wallet/entities/unit.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Wallet.name, schema: WalletSchema },
      { name: WebhookLog.name, schema: WebhookLogSchema },
    ]),
  ],
  controllers: [WebhookController],
  providers: [
    UnitProvider,
    WebhookService,
    { provide: APP_FILTER, useClass: WebhookExceptionFilter },
  ],
})
export class WebhookModule {}
