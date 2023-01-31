import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';
import { Wallet } from './unit.entity';

export type WalletTransferDocument = HydratedDocument<WalletTransfer>;

@Schema({ timestamps: true })
export class WalletTransfer {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({
    type: Types.ObjectId,
    ref: 'Wallet',
    required: [true, 'Wallet must be specified'],
  })
  sendWallet: Wallet;

  // @Prop({ type: Types.ObjectId, ref: 'Currency', required: [true, 'Currency must be specified'] })
  // currency: Currency;

  @Prop({ type: Types.ObjectId, ref: 'Wallet' })
  receiveWallet: Wallet;

  @Prop({ type: Number, required: [true, 'Amount is required '] })
  amount: number;

  @Prop({ type: Number })
  toReceive: number;

  @Prop({ type: String })
  eid: string;

  @Prop({ type: String })
  txid: string;

  @Prop({
    type: String,
    default: 'pending',
    enum: ['successful', 'pending', 'paid', 'failed', 'Sent', 'Rejected'],
  })
  status: string;
}

export const WalletTransferSchema =
  SchemaFactory.createForClass(WalletTransfer);
