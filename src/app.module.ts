import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { WebhookExceptionFilter } from './helper/exceptions/filters/webhook.exception';
import { WebhookService } from './unit/resources/webhook/webhook.service';
import { UnitModule } from './unit/unit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    AuthModule,
    UnitModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    
  ],
})
export class AppModule {}
