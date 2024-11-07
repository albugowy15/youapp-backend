import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from '../../common/schemas/message.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessagesRepository {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
  ) {}

  async create(
    data: Omit<Message, 'timestamp'>,
  ): Promise<MessageDocument | null> {
    return await this.messageModel.create(data);
  }

  async findByFromUserIDOrToUserID(userID: string): Promise<MessageDocument[]> {
    return await this.messageModel
      .find({
        $or: [{ from_user_id: userID }, { to_user_id: userID }],
      })
      .sort({ timestamp: 1 });
  }
}
