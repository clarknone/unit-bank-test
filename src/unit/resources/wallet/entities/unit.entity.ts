import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';

export class Unit {}
export type WalletDocument = HydratedDocument<Wallet>;

@Schema({ timestamps: true })
export class Wallet {
  @Prop({ type: Types.ObjectId, ref: 'User', unique: false })
  user: User;

  @Prop({
    type: String,
    // type: Types.ObjectId,
    ref: 'Currency',
    required: [true, 'Wallet must specify a currency'],
    unique: false,
  })
  currency: string;

  @Prop({ type: Number, default: 0 })
  balance: number;

  @Prop({ type: Number, default: 0 })
  hold: number;

  @Prop({ type: String, default: '' })
  eid: string;

  @Prop({ type: String, default: '' })
  routingNumber: string;

  @Prop({ type: String, default: '' })
  accountNumber: string;

  @Prop({ type: Number, default: 0 })
  ledgerBalance: number;
}

const WalletSchema = SchemaFactory.createForClass(Wallet);

WalletSchema.index({ user: 1, currency: 1 }, { unique: true });

export { WalletSchema };
