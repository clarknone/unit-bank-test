import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
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

export class ApplicationApproveDto {
  @IsNotEmpty()
  @IsString()
  application: string;

  @IsNotEmpty()
  @IsString()
  status: 'paid' | 'failed' | 'rejected';
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

class Address {
  @IsNotEmpty()
  street: string;
  @IsNotEmpty()
  state: string;
  @IsNotEmpty()
  city: string;
  @IsNotEmpty()
  postalCode: string;
  @IsNotEmpty()
  country: string;
}

export class CreateApplicationDto {
  @IsNotEmpty()
  passport: string;

  @IsNotEmpty()
  @IsDateString()
  dateOfBirth: string;

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Address)
  address: {
    street: string;
    state: string;
    city: string;
    postalCode: string;
    country: string;
  };
}
