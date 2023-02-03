import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/helper/guard/auth.guard';
import { IAuthUser } from 'src/auth/interfaces/auth.interface';
import { GetAuthUser } from 'src/auth/decorators/user.decorators';
import { UnitWalletService } from '../services/user.wallet.service';
import { UnitWalletTransferService } from '../services/transfer.wallet.service';
import {
  CreateWalletTransferDto,
  CreateWalletWithdrawDto,
  WalletApproveDto,
  WalletTransferFilterDto,
  WalletFilterDto,
} from 'src/unit/dto/create-unit.dto';
import { UnitWalletWithdrawService } from '../services/withdraw.wallet.service';
import { clearNullField } from 'src/helper/main';

@UseGuards(JwtAuthGuard)
@Controller()
export class UnitAdminWalletController {
  constructor(
    private readonly unitWalletService: UnitWalletService,
    private readonly walletTransferService: UnitWalletTransferService,
    private readonly walletWithdrawService: UnitWalletWithdrawService,
  ) {}

  @Post('withdraw/approve')
  withdraw(@GetAuthUser() user: IAuthUser, @Body() data: WalletApproveDto) {
    return this.walletWithdrawService.approveWithdraw(user, data);
  }

  @Get('transfer')
  getAllTransfer(@Query() filter: WalletTransferFilterDto) {
    filter.status = filter.status || 'Sent';
    filter = clearNullField(filter);
    return this.walletTransferService.getAllTransfer(filter);
  }
  @Get('withdraw')
  getAllWithdraw(@Query() filter: WalletFilterDto) {
    filter.status = filter.status || 'Sent';
    filter = clearNullField(filter);
    return this.walletWithdrawService.getAllWithdraw(filter);
  }

  @Get('wallet')
  getAllWallet() {
    return this.unitWalletService.getAllWallet();
  }
}
