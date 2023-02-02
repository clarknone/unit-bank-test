import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, RouterModule } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ServiceExceptionFilter } from './helper/exceptions/filters/service.exception';
import { WebhookExceptionFilter } from './helper/exceptions/filters/webhook.exception';
import { WebhookService } from './unit/resources/webhook/webhook.service';
import { UnitRoutes } from './unit/routes';
import { UnitModule } from './unit/unit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URL),
    AuthModule,
    UnitModule,
    RouterModule.register([
      { path: 'unit', module: UnitModule, children: UnitRoutes },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: ServiceExceptionFilter },
  ],
})
export class AppModule {}
