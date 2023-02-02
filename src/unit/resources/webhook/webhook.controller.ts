import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WebhookService } from './webhook.service';
import {
  CreateWebhookDto,
  EventDto,
  WebhookEventDto,
} from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { IWebhookEvent } from './interfaces/receive.interface';

@Controller()
export class WebhookController {
  private handlers: {
    [index: string]: (
      item: EventDto,
      data: WebhookEventDto,
      service?: WebhookService,
    ) => Promise<void> | void;
  } = {};
  constructor(private readonly webhookService: WebhookService) {
    this.handlers['customer.created'] = this.webhookService.customerCreated;
    this.handlers['transaction.created'] =
      this.webhookService.transactionCreated;
  }

  @Post()
  async create(@Body() data: WebhookEventDto) {
    const eventHandlers = [];
    data?.data?.forEach((item) => {
      if (this.handlers[item.type]) {
        eventHandlers.push(
          this.handlers[item.type](item, data, this.webhookService),
        );
      }
    });
    eventHandlers.length && Promise.all(eventHandlers);
  }
}
