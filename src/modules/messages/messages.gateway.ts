import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface UserSocket {
  userID: string;
  socketID: string;
}
@WebSocketGateway({
  cors: {
    origin: true,
  },
})
export class MessagesGateway {
  @WebSocketServer()
  server!: Server;

  private users: UserSocket[] = [];

  @SubscribeMessage('identify')
  identity(@MessageBody() userID: string, @ConnectedSocket() client: Socket) {
    this.users.push({ userID: userID, socketID: client.id });
    console.log(`User ${userID} connected with socket ${client.id}`);
  }

  @SubscribeMessage('send_message')
  sendMessage(
    @MessageBody()
    data: {
      senderID: string;
      receiverID: string;
      content: string;
    },
  ) {
    const { senderID, receiverID, content } = data;
    const receiver = this.users.find((user) => user.userID === receiverID);
    if (receiver) {
      this.server
        .to(receiver.socketID)
        .emit('receive_message', { senderID, content });
      console.log(`Message from ${senderID} to ${receiverID}: ${content}`);
    }
  }
}
