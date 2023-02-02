import { Relationship, RelationshipsArray } from '@unit-finance/unit-node-sdk';

export class CreateWebhookDto {}

export class EventDto {
  id: string;
  type: string;
  attributes?: {
    createdAt: Date;
    [index: string]: any;
    tags?: {
      [index: string]: any;
    };
  };
  relationships?: {
    org?: Relationship;
    customer?: Relationship;
    account?: Relationship;
    transaction?: Relationship;
    [index: string]: Relationship | RelationshipsArray;
  };
  [index: string]: any;
}

export class WebhookEventDto {
  data: EventDto[];
  included?: any[];
}

export class CreateEventLogDto {
  event: EventDto;

  error?: string;

  data?: WebhookEventDto;

  status?: 'failed' | 'success';
}
