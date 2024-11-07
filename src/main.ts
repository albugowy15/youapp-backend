import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import { AppModule } from './modules/app/app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(compression());
  app.useGlobalInterceptors(new TransformInterceptor());
  const config = new DocumentBuilder()
    .setTitle('YouApp Backend')
    .setDescription('YouApp backend rest api openapi documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
