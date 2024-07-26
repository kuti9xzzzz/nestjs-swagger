import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetUsersController } from './controllers/users.get.controller';
import { UsersService } from './services/users.service';
import { PostUsersController } from './controllers/users.post.controller';
import { PutUsersController } from './controllers/users.put.controller';

@Module({
  imports: [],
  controllers: [GetUsersController, PostUsersController, PutUsersController],
  providers: [UsersService, PrismaService],
})
export class UsersModule {}
