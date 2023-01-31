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
