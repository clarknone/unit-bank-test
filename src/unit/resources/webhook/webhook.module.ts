import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { UnitProvider } from 'src/unit/config/unit.provider';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/schema/auth.schema';
import { WebhookExceptionFilter } from 'src/helper/exceptions/filters/webhook.exception';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [WebhookController],
  providers: [
    WebhookService,
    UnitProvider,
    { provide: APP_FILTER, useClass: WebhookExceptionFilter },
  ],
})
export class WebhookModule {}
