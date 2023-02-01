import {
  ArgumentsHost,
  Catch,
  ForbiddenException,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { WebhookService } from 'src/unit/resources/webhook/webhook.service';

@Catch(UnauthorizedException)
export class WebhookExceptionFilter extends BaseExceptionFilter {
  constructor(private webhookService: WebhookService) {
    super();
  }

  catch(exception: UnauthorizedException, host: ArgumentsHost): void {
    console.log(this.webhookService)
    const message = exception.message;
    const code = message.toLowerCase().includes('no')
      ? HttpStatus.UNAUTHORIZED
      : HttpStatus.FORBIDDEN;
    super.catch(new HttpException(message, code), host);
  }
}

@Catch(ForbiddenException)
export class ForbiddenExceptionFilter extends BaseExceptionFilter {
  catch(exception: ForbiddenException, host: ArgumentsHost): void {
    super.catch(
      new HttpException('Permission Denied', HttpStatus.FORBIDDEN),
      host,
    );
  }
}
