import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/auth/schema/auth.schema';
import { UnitProvider } from 'src/unit/config/unit.provider';
import { UnitService } from 'src/unit/unit.service';
import { UnitWalletController } from '../controllers/user.wallet.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UnitWalletController],
  providers: [ UnitService],
})
export class UnitModule {}
