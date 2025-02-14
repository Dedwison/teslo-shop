import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  constructor(private readonly messagesWsService: MessagesWsService) {}
  handleConnection(client: Socket) {
    const token = client.handshake.headers.authentication as string;
    console.log({ token });

    this.messagesWsService.registerClient(client);

    // console.log({ conectados: this.messagesWsService.getConnectedClients() });

    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }
  handleDisconnect(client: Socket) {
    // console.log('client disconected', client.id);

    this.messagesWsService.removeClient(client.id);

    console.log({ conectados: this.messagesWsService.getConnectedClients() });

    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  //message-from-clent
  @SubscribeMessage('message-from-clent')
  onMessageFromVlient(client: Socket, payload: NewMessageDto) {
    //! Emite únicamente al cliente inicial
    // client.emit('message-from-server', {
    //   fullName: 'Soy Yo!',
    //   message: payload.message || 'no-message!',
    // });

    //! Emitir a todos MENOS, al cliente inicial
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy Yo!',
    //   message: payload.message || 'no-message!',
    // });

    //! Emitir a todos, incluso al cliente inicial
    this.wss.emit('message-from-server', {
      fullName: 'Soy Yo!',
      message: payload.message || 'no-message!',
    });
  }
}
