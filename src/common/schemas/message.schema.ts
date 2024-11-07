import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Message {
  @Prop()
  from_user_id: string;

  @Prop()
  to_user_id: string;

  @Prop()
  message: string;

  @Prop({ default: Date.now })
  timestamp: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);

export type MessageDocument = HydratedDocument<Message>;
