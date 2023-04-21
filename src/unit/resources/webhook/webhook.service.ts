import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wallet, WalletDocument } from '../wallet/entities/unit.entity';
import {
  CreateEventLogDto,
  CreateWebhookDto,
  EventDto,
  WebhookEventDto,
} from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { WebhookLog, WebhookLogDocument } from './entities/webhook.entity';
import { User, UserDocument } from '../../../auth/schema/auth.schema';
import { WebhookException } from '../../../helper/exceptions/exceptions/webhook.layer.exception';

@Injectable()
export class WebhookService {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
    @InjectModel(WebhookLog.name)
    private WebhookLogModel: Model<WebhookLogDocument>,
    @InjectModel(Wallet.name)
    private WalletModel: Model<WalletDocument>,
  ) {}

  async customerCreated(
    item: EventDto,
    data: WebhookEventDto,
    service: WebhookService,
  ) {
    const userUuid = item.attributes?.tags?.uid;
    if (!userUuid) {
      throw new WebhookException({
        error: 'unkown user id',
        event: item,
        data: data,
      });
    }
    service.UserModel.findOneAndUpdate(
      { uuid: userUuid },
      { unitId: item.relationships.customer.data.id },
    ).then((user) => {
      service.createLog({ event: item, data });
    });
  }

  async transactionCreated(
    item: EventDto,
    data: WebhookEventDto,
    service: WebhookService,
  ) {
    const walletId = item.relationships?.account?.data?.id;
    if (!walletId) {
      throw new WebhookException({
        error: 'unkown wallet id',
        event: item,
        data: data,
      });
    }
    service.validateIdempotency(item, service).then((result) => {
      if (result) return;
      service.WalletModel.findOneAndUpdate(
        { eid: walletId },
        {
          balance: item.attributes.available,
          ledgerBalance: item.attributes.balance,
        },
      ).then(() => {
        service.createLog({ event: item, data });
      });
    });
  }
  async validateIdempotency(
    item: EventDto,
    service: WebhookService,
  ): Promise<boolean> {
    return service.WebhookLogModel.findOne({ eid: item.id }).then((log) => {
      return !!log;
    });
  }

  async createLog(data: CreateEventLogDto) {
    const log = new this.WebhookLogModel({
      eid: data.event.id,
      type: data.event.type,
      error: data.error || '',
      status: data.error ? 'failed' : 'success',
      data: JSON.stringify(data.data),
    });
    log.save();
  }
}
