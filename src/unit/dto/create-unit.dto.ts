import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUnitDto {}

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
