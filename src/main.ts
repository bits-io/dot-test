import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { StorageDriver, initializeTransactionalContext } from 'typeorm-transactional';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { redisOptions } from './configs/redis-options';
import * as bodyParser from 'body-parser';
import { AllExceptionsFilter } from './helpers/all-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.setGlobalPrefix('api/');

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); 

  // this part has responsibility to hide all entity fields with decorator `@Exclude()` from response
  // see user.entity.ts
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.useStaticAssets(join(__dirname, '../..', 'storage'), { prefix: '/storage/' });  
  app.connectMicroservice(redisOptions());

  app.use(bodyParser.json({ limit: '1GB' }));
  app.use(bodyParser.urlencoded({ limit: '1GB', extended: true }));
  // const cors = require("cors")
  // app.use(cors());
  app.enableCors();
  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
