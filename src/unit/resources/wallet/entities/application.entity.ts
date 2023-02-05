import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';
import { User } from 'src/auth/schema/auth.schema';

export type ApplicationDocument = HydratedDocument<Application>;

@Schema({ timestamps: true })
export class Application {
  @Prop({ type: String })
  eid: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({
    type: String,
    default: 'pending',
    enum: ['successful', 'pending', 'failed', 'rejected'],
  })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  agent: User ;
}

const ApplicationSchema = SchemaFactory.createForClass(Application);
// ApplicationSchema.plugin(PaginatePlugin);
export { ApplicationSchema };
