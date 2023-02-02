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
import { UnitWalletTransferService } from '../services/transfer.wallet.service';
import {
  CreateWalletTransferDto,
  CreateWalletWithdrawDto,
} from 'src/unit/dto/create-unit.dto';
import { UnitWalletWithdrawService } from '../services/withdraw.wallet.service';

@UseGuards(JwtAuthGuard)
@Controller()
export class UnitWalletController {
  constructor(
    private readonly unitWalletService: UnitWalletService,
    private readonly walletTransferService: UnitWalletTransferService,
    private readonly walletWithdrawService: UnitWalletWithdrawService,
  ) {}

  @Post()
  create(@GetAuthUser() user: IAuthUser) {
    return this.unitWalletService.create(user);
  }

  @Post('transfer')
  transfer(
    @GetAuthUser() user: IAuthUser,
    @Body() data: CreateWalletTransferDto,
  ) {
    return this.walletTransferService.walletTransfer(user, data);
  }

  @Post('withdraw')
  withdraw(
    @GetAuthUser() user: IAuthUser,
    @Body() data: CreateWalletWithdrawDto,
  ) {
    return this.walletWithdrawService.walletWithdraw(user, data);
  }

  @Get()
  findAll(@GetAuthUser() user: IAuthUser) {
    return this.unitWalletService.getWallet(user);
  }
}
