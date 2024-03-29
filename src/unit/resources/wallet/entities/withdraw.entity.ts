import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Account } from './account.entity';
import { Wallet } from './unit.entity';
import { User } from '../../../../auth/schema/auth.schema';

export type WalletWithdrawDocument = HydratedDocument<WalletWithdraw>;

@Schema({ timestamps: true })
export class WalletWithdraw {
  @Prop({ type: String })
  key: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: Types.ObjectId, ref: 'Account', required: [true, 'Account must be specified'] })
  // @Prop({ type: String, required: [true, 'account is required '] })
  account: Account;

  @Prop({
    type: Types.ObjectId,
    ref: 'Wallet',
    required: [true, 'Wallet must be specified'],
  })
  wallet: Wallet;

  @Prop({ type: Number, required: [true, 'Amount is required '] })
  amount: number;

  @Prop({ type: Number })
  toReceive: number;

  @Prop({ type: Boolean, default: false })
  approved: string;

  @Prop({
    type: String,
    default: 'pending',
    enum: ['successful', 'pending', 'paid', 'failed', 'Sent',  'Cancled', 'Rejected'],
  })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  agent: User;
}

export const WalletWithdrawSchema =
  SchemaFactory.createForClass(WalletWithdraw);
