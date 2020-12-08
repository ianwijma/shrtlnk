import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV === 'development') app.enableCors();

  const options = new DocumentBuilder()
    .setTitle('shrtlnk.dev Api')
    .setDescription('The shrtlnk.online api')
    .setVersion('0.1')
    .addTag('shrtlnk')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('documentation', app, document);

  const port = process.env.PORT || config.get('server.port');
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
