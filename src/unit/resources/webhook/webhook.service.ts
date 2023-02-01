import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/auth/schema/auth.schema';
import { UnitProvider } from 'src/unit/config/unit.provider';
import {
  CreateWebhookDto,
  EventDto,
  WebhookEventDto,
} from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';

@Injectable()
export class WebhookService {
  constructor(
    private unit: UnitProvider,
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
  ) {}

  async customerCreated(item: EventDto, data: WebhookEventDto) {
    const userUuid = item.attributes?.tags?.uuid;
    this.UserModel.findOneAndUpdate({uuid:userUuid},{unitId:item.attributes}).then(user=>{

    })
  }
}
