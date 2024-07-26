import { OnModuleInit } from '@nestjs/common';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import {
  ConversationService,
  TSendMessage,
} from 'src/conversations/services/conversation.service';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway(3006, {
  cors: {
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization', 'x-xsrf-token'],
    exposedHeaders: ['Content-Type'],
  },
})
export class EventsGateway implements OnModuleInit {
  constructor(private conversationService: ConversationService) {}
  @WebSocketServer()
  server: Server;

  token: string;

  onModuleInit() {
    this.server?.on('connection', (socket) => {
      this.token = socket.handshake.auth.access_token;
      console.log('user connected with id: ' + socket.id);

      socket.on('disconnect', () => {
        console.log('user disconnect');
      });
    });
  }

  @SubscribeMessage('send')
  async login(@MessageBody() body: any) {
    const id = await this.verify_token();
    if (!id) {
      this.server.emit(
        `send-error-${+body.id}`,
        this.response_data(401, 'Unauthorized!'),
      );
    } else {
      const currentConversation =
        await this.conversationService.findBySenderAndReciverId(
          id,
          +body.receiver_id,
        );

      const messageData: TSendMessage = {
        sender_id: id,
        receiver_id: +body.receiver_id,
        content: body.content,
      };
      const newMessage =
        await this.conversationService.sendMessage(messageData);
      this.server.emit(
        `message-${currentConversation.id}`,
        this.response_data(200, 'ok!', { message: newMessage }),
      );
    }
  }

  async verify_token() {
    if (!this.token) {
      return false;
    }
    try {
      const token = this.token;
      const SECRET_KEY = process.env.SECRET_KEY;
      const payload = jwt.verify(token, SECRET_KEY);
      return +payload['id'];
    } catch (error) {
      return false;
    }
  }

  response_data(status: number, message = 'ok', data = null) {
    return {
      status,
      message,
      data,
    };
  }
}
