import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { UsersService } from 'src/users/services/users.service';

const bootstrap = async () => {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get<UsersService>(UsersService);
  console.log('123');
};
bootstrap();
