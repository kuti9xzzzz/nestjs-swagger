import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { conversations, messages } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export type ConversationMessages = conversations & {
  messages: messages[];
};

export type TSendMessage = {
  sender_id: number;
  receiver_id: number;
  content: string;
};

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  async findById(id: number, sender_id: number): Promise<ConversationMessages> {
    const conversation = await this.prisma.conversations.findUnique({
      where: {
        id,
        OR: [
          {
            sender_id,
          },
          {
            receiver_id: sender_id,
          },
        ],
        deleted_at: null,
      },
      include: {
        messages: {
          where: { deleted_at: null },
          orderBy: {
            created_at: 'desc',
          },
        },
      },
    });
    if (!conversation) {
      throw new NotFoundException('Conversation not found!');
    }
    return conversation;
  }

  async findBySenderAndReciverId(
    sender_id: number,
    receiver_id: number,
  ): Promise<ConversationMessages> {
    const conversation = await this.prisma.conversations.findFirst({
      where: {
        OR: [
          {
            sender_id,
            receiver_id,
          },
          {
            sender_id: receiver_id,
            receiver_id: sender_id,
          },
        ],
        deleted_at: null,
      },
      include: {
        messages: true,
      },
    });
    if (!conversation) {
      const newConversation = await this.create(sender_id, receiver_id);
      return newConversation;
    }
    return conversation;
  }

  async findReceivers(sender_id: number) {
    const receiverConversations = await this.prisma.conversations.findMany({
      where: {
        OR: [
          {
            sender_id,
          },
          {
            receiver_id: sender_id,
          },
        ],
      },
      include: {
        receiver: true,
        sender: true,
        messages: {
          where: { deleted_at: null },
          orderBy: {
            created_at: 'desc',
          },
        },
      },
      take: 20,
    });
    const sender_user = await this.prisma.users.findUnique({
      where: { id: sender_id },
    });
    const receivers = receiverConversations.map((item) => {
      const data = {
        receiver: {
          id: item.receiver.id == sender_id ? item.sender_id : item.receiver.id,
          user_id:
            item.receiver.user_id == sender_user.user_id
              ? item.sender.user_id
              : item.receiver.user_id,
          email:
            item.receiver.email == sender_user.email
              ? item.sender.email
              : item.receiver.email,
          name:
            item.receiver.name == sender_user.name
              ? item.sender.name
              : item.receiver.name,
          avatar:
            item.receiver.avatar == sender_user.avatar
              ? item.sender.avatar
              : item.receiver.avatar,
        },
        firstMessage: item.messages[0] ?? 'Send some message!',
      };
      return data;
    });
    return receivers;
  }

  async create(
    sender_id: number,
    receiver_id: number,
  ): Promise<ConversationMessages> {
    try {
      const conversation = await this.prisma.conversations.create({
        data: {
          sender_id,
          receiver_id,
        },
        include: {
          messages: true,
        },
      });
      return conversation;
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async sendMessage(data: TSendMessage): Promise<messages> {
    try {
      const { sender_id, receiver_id, content } = data;
      const conversation = await this.findBySenderAndReciverId(
        sender_id,
        receiver_id,
      );
      const newMessage = await this.prisma.conversations.update({
        where: { id: conversation.id },
        data: {
          messages: {
            create: {
              content,
            },
          },
        },
        include: {
          messages: {
            orderBy: {
              created_at: 'desc',
            },
          },
        },
      });
      return newMessage.messages[0];
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
