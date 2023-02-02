import { RouteTree } from '@nestjs/core';
import { WalletModule } from '../resources/wallet/modules/user.wallet.module';
import { WebhookModule } from '../resources/webhook/webhook.module';

export const UnitRoutes: RouteTree[] = [
  { path: 'wallet', module: WalletModule },
  { path: 'webhook', module: WebhookModule },
];
