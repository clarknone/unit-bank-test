interface IEvent {
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

export interface IWebhookEvent {
  data: IEvent[];
  included?: any[];
}
