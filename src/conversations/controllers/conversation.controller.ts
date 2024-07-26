import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiOAuth2, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ConversationService,
  TSendMessage,
} from '../services/conversation.service';

class Any {}
@ApiTags('Conversations')
@ApiOAuth2(['conversations'])
@Controller('/api/v1/conversations')
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @Get('/')
  @UseGuards(AuthGuard)
  async find_receivers(@Request() req: any) {
    return await this.conversationService.findReceivers(+req.user.id);
  }

  @Get('/:id')
  @ApiParam({
    name: 'id',
    description: 'Conversation ID',
    type: 'string',
  })
  @UseGuards(AuthGuard)
  async find_conversation_by_id(
    @Request() req: any,
    @Param() param: { id: string },
  ) {
    return await this.conversationService.findById(+param.id, +req.user.id);
  }

  @Post('/')
  @ApiBody({
    type: Any,
    examples: {
      example: { value: { receiver_id: 2, content: 'string' } },
    },
  })
  @UseGuards(AuthGuard)
  async send_message(
    @Request() req: any,
    @Body() body: { receiver_id: string; content: string },
  ) {
    const data: TSendMessage = {
      sender_id: +req.user.id,
      receiver_id: +body.receiver_id,
      content: body.content,
    };
    const newMessage = await this.conversationService.sendMessage(data);
    return newMessage;
  }
}
