import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesRepository } from './messages.repository';
import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

const privateMessageBody = z
  .object({
    toUserID: z
      .string()
      .min(1)
      .refine((val) => isValidObjectId(val)),
    message: z.string().min(1).max(300),
  })
  .required();

const userIDSchema = z
  .string()
  .min(1)
  .refine((val) => isValidObjectId(val));

function parseUserID(val: unknown) {
  const parsedUserID = userIDSchema.safeParse(val);
  return parsedUserID;
}

@WebSocketGateway({
  cors: {
    origin: true,
  },
})
export class MessagesGateway implements OnGatewayConnection {
  constructor(private messagesRepository: MessagesRepository) {}
  @WebSocketServer()
  server!: Server;

  async handleConnection(client: Socket) {
    const parsedUserID = parseUserID(client.handshake.query.userID);
    if (parsedUserID.success) {
      client.join(parsedUserID.data);
      const messageHistory =
        await this.messagesRepository.findByFromUserIDOrToUserID(
          parsedUserID.data,
        );
      client.emit('history', messageHistory);
    } else {
      client.disconnect();
    }
  }

  @SubscribeMessage('private_message')
  async message(
    @MessageBody() payload: { toUserID: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const parsedFromUserID = parseUserID(client.handshake.query.userID);
    if (parsedFromUserID.success) {
      const parsedPayload = privateMessageBody.safeParse(payload);
      if (!parsedPayload.success) {
        return;
      }
      const savedMessage = await this.messagesRepository.create({
        to_user_id: parsedPayload.data.toUserID,
        from_user_id: parsedFromUserID.data,
        message: parsedPayload.data.message,
      });
      client.to(payload.toUserID).emit('receive_message', savedMessage);
      client.emit('receive_message', savedMessage);
    }
  }
}
