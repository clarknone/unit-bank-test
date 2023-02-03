import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUnitDto {}

export class WalletTransferFilterDto {
  @IsOptional()
  @IsString()
  status: string;
}

export class WalletFilterDto {
  @IsOptional()
  @IsString()
  status: string;
}

export class WalletApproveDto {
  @IsNotEmpty()
  @IsString()
  wallet: string;

  @IsNotEmpty()
  @IsString()
  status: 'paid' | 'failed' | 'Cancled' | 'Sent' | 'Rejected';
}

export class CreateWalletTransferDto {
  @IsOptional()
  @IsEmail()
  user: string;

  @IsNotEmpty()
  @IsString()
  sendWallet: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class CreateWalletWithdrawDto {
  @IsNotEmpty()
  @IsString()
  wallet: string;

  @IsNotEmpty()
  @IsString()
  account: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsNotEmpty()
  @IsString()
  accountName: string;

  @IsString()
  @IsNotEmpty()
  accountNo: string;

  @IsNotEmpty()
  @IsString()
  bank: string;
}
