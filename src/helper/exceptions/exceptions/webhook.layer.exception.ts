import { IWebHookError } from "../../../auth/interfaces/response.interface";


export class WebhookException extends Error {
  public data: IWebHookError;
  constructor(error: IWebHookError) {
    super(error.error);
    this.name = 'Webhook Exception';
    this.data = error;
  }
}
