export class Webhook {}

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type WebhookLogDocument = HydratedDocument<WebhookLog>;

@Schema({ timestamps: true })
export class WebhookLog {
  @Prop({ type: String })
  eid: string;

  @Prop({ type: String })
  type: string;

  @Prop({ type: String })
  error: string;

  @Prop({ type: String })
  data: string;

  @Prop({ type: String, default: 'sucess', enum: ['failed', 'success'] })
  status: string;
}

export const WebhookLogSchema = SchemaFactory.createForClass(WebhookLog);
