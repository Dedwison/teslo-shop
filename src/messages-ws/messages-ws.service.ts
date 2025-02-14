import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ConnectClients {
  [id: string]: Socket;
}

@Injectable()
export class MessagesWsService {
  private connectClients: ConnectClients = {};

  registerClient(client: Socket) {
    this.connectClients[client.id] = client;
  }

  removeClient(clientId: string) {
    delete this.connectClients[clientId];
  }

  getConnectedClients(): string[] {
    return Object.keys(this.connectClients);
  }
}
