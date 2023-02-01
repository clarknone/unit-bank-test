export class CreateWebhookDto {}

export class EventDto {
  id: string;
  type: string;
  attributes?: {
    createdAt: Date;
    tags?: {
      [index: string]: any;
    };
  };
  [index: string]: any;
}

export class WebhookEventDto {
  data: EventDto[];
  included?: any[];
}
