import {
  EventDto,
  WebhookEventDto,
} from 'src/unit/resources/webhook/dto/create-webhook.dto';

export class IErrorResponse {
  status?: number = 400;
  error: string;
}

export class IWebHookError {
  data?: WebhookEventDto;
  event?: EventDto;
  error: string;
}
