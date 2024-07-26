import { Module } from '@nestjs/common';
import { GetCatsController } from './controllers/cats.get.controller';
import { CatsService } from './services/cats.service';
import { PrismaService } from '../prisma/prisma.service';
import { PostCatsController } from './controllers/cats.post.controller';
import { PutCatsController } from './controllers/cats.put.controller';

@Module({
  imports: [],
  controllers: [GetCatsController, PostCatsController, PutCatsController],
  providers: [CatsService, PrismaService],
})
export class CatsModule {}
