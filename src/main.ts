import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as serveStatic from 'serve-static';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  });

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Swagger')
    .setDescription('description')
    .setVersion('1.0')
    .addTag('Users')
    .addTag('Cats')
    .addTag('Conversations')
    .addOAuth2({
      type: 'oauth2',
      flows: {
        password: {
          tokenUrl: 'http://localhost:3005/api/v1/users/login',
          authorizationUrl: 'http://localhost:3005/api/v1/users/login',
          scopes: {},
        },
      },
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  app.use('/images', serveStatic(path.join(__dirname, '../public/images')));
  const PORT = process.env.PORT || 3005;
  await app.listen(+PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
  });
}
bootstrap();
