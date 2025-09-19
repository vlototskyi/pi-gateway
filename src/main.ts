// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

function readCert(p: string) {
  const full = path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);
  return fs.readFileSync(full);
}

async function bootstrap() {
  const ctx = await NestFactory.createApplicationContext(AppModule);

  const config = ctx.get(ConfigService);
  const url = config.getOrThrow<string>('MQTT_URL');
  const id = config.getOrThrow<string>('MQTT_CLIENT_ID');
  const rUa = config.getOrThrow<boolean>('MQTT_TLS_REJECT_UNAUTHORIZED');
  const caP = config.getOrThrow<string>('MQTT_CA_PATH');
  const crtP = config.getOrThrow<string>('MQTT_CERT_PATH');
  const keyP = config.getOrThrow<string>('MQTT_KEY_PATH');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.MQTT,
      options: {
        url,
        clientId: id,
        rejectUnauthorized: rUa,
        ca: [readCert(caP)],
        cert: readCert(crtP),
        key: readCert(keyP),
      },
    },
  );

  await app.listen();
}
bootstrap();
