import { Controller, Logger } from '@nestjs/common';
import {
  MessagePattern,
  Payload,
  Ctx,
  MqttContext,
} from '@nestjs/microservices';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { IoTMessage } from './iot.types';
import { isDhtMessage, isSoundMessage } from './iot.guards';

@Controller()
export class MqttController {
  private readonly logger = new Logger(MqttController.name);
  private readonly backendUrl: string;

  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {
    this.backendUrl = this.config.getOrThrow<string>('CLOUD_BACKEND_URL');
  }

  @MessagePattern('esp32/sensors/#')
  async handleSensorData(@Payload() message: unknown, @Ctx() ctx: MqttContext) {
    const topic = ctx.getTopic();

    if (isDhtMessage(message)) {
      await this.forward({ topic, data: message });
    } else if (isSoundMessage(message)) {
      await this.forward({ topic, data: message });
    } else {
      this.logger.warn(
        `Ignoring unknown payload on ${topic}: ${JSON.stringify(message)}`,
      );
    }
  }

  private async forward(envelope: { topic: string; data: IoTMessage }) {
    try {
      await firstValueFrom(this.http.post(this.backendUrl, envelope));
      this.logger.log(
        `📤 Forwarded ${envelope.data.device_id} from ${envelope.topic}`,
      );
    } catch (err: unknown) {
      if (err instanceof Error)
        this.logger.error(`Forward error: ${err.message}`);
      else this.logger.error('Forward error', err);
    }
  }
}
