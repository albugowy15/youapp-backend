import { Module } from '@nestjs/common';
import { MessagesGateway } from './messages.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '../../common/schemas/message.schema';
import { MessagesRepository } from './messages.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
  providers: [MessagesGateway, MessagesRepository],
})
export class MessagesModule {}
