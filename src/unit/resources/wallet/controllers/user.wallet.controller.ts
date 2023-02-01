import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/helper/guard/auth.guard';
import { IAuthUser } from 'src/auth/interfaces/auth.interface';
import { GetAuthUser } from 'src/auth/decorators/user.decorators';
import { UnitWalletService } from '../services/user.wallet.service';

@UseGuards(JwtAuthGuard)
@Controller('wallet')
export class UnitWalletController {
  constructor(private readonly unitService: UnitWalletService) {}

  @Post()
  create(@GetAuthUser() user: IAuthUser) {
    return this.unitService.create(user);
  }

  @Get()
  findAll(@GetAuthUser() user: IAuthUser) {
    return this.unitService.getWallet(user);
  }
}
