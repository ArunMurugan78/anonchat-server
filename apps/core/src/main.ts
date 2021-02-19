import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from 'fastify-cookie';
import { AppModule } from './modules/app.module';
import { TransformOutputInterceptor } from './common/interceptors/transform-output.interceptor';
import { ALLOWED_ORIGINS } from './config';

const PORT = process.env.PORT || 8000;
const HOST = process.env.YOUR_HOST || '0.0.0.0';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: false,
    }),
  );
  app.enableCors({
    credentials: true,
    origin: ALLOWED_ORIGINS,
  });
  await app.register(fastifyCookie);

  app.useGlobalInterceptors(new TransformOutputInterceptor());
  await app.listen(PORT, HOST);
}

bootstrap().then(() => {
  console.log(`Server Listening at port: ${PORT}`);
});
