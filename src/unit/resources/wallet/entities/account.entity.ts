import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { User } from '../../../../auth/schema/auth.schema';

export type AccountDocument = HydratedDocument<Account>;

@Schema({ timestamps: true })
export class Account {
  @Prop({ type: Types.ObjectId, ref: 'User', require: true })
  user: User;

  @Prop({ type: String, required: [true, ' Currency is required'] })
  currency: string;

  @Prop({ type: String, required: [true, 'Account Name is required '] })
  accountName: string;

  @Prop({ type: String, required: [true, 'Account Number is required '] })
  accountNo: string;

  @Prop({ type: String, required: [true, 'Bank Name is required '] })
  bank: string;
}

const AccountSchema = SchemaFactory.createForClass(Account);
// AccountSchema.plugin(PaginatePlugin);
export { AccountSchema };
