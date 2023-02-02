import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { WebhookService } from 'src/unit/resources/webhook/webhook.service';
import { WebhookException } from '../exceptions/webhook.layer.exception';

@Catch(WebhookException)
export class WebhookExceptionFilter extends BaseExceptionFilter {
  constructor(private webhookService: WebhookService) {
    super();
  }

  catch(exception: WebhookException, host: ArgumentsHost): void {
    console.log(this.webhookService);
    const message = exception.message;
    const code = message.toLowerCase().includes('no')
      ? HttpStatus.UNAUTHORIZED
      : HttpStatus.FORBIDDEN;
    // super.catch(new HttpException(message, code), host);
  }
}
