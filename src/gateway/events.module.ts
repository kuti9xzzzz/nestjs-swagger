import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { ConversationModule } from 'src/conversations/conversation.module';

@Module({
  imports: [ConversationModule],
  providers: [EventsGateway],
})
export class EventsModule {}
