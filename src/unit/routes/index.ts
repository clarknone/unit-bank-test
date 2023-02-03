import { RouteTree } from '@nestjs/core';
import { AdminWalletModule } from '../resources/wallet/modules/admin.wallet.module';
import { WalletModule } from '../resources/wallet/modules/user.wallet.module';
import { WebhookModule } from '../resources/webhook/webhook.module';

export const UnitRoutes: RouteTree[] = [
  { path: 'wallet', module: WalletModule },
  { path: 'admin', module: AdminWalletModule },
  { path: 'webhook', module: WebhookModule },
];
