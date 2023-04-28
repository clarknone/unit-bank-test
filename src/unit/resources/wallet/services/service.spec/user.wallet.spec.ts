import { Test, TestingModule } from '@nestjs/testing';
import { UnitWalletService } from '../user.wallet.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  WalletTransfer,
  WalletTransferSchema,
} from '../../entities/transfer.entity';
import {
  Application,
  ApplicationSchema,
} from '../../entities/application.entity';
import {
  WalletWithdraw,
  WalletWithdrawSchema,
} from '../../entities/withdraw.entity';
import { Wallet, WalletSchema } from '../../entities/unit.entity';
import { Account, AccountSchema } from '../../entities/account.entity';
import { UnitApplicationService } from '../user.application.service';
import { UnitWalletTransferService } from '../transfer.wallet.service';
import { UnitWalletWithdrawService } from '../withdraw.wallet.service';
import { User, UserSchema } from '../../../../../auth/schema/auth.schema';
import { UnitProvider } from '../../../../config/unit.provider';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../../../../../helper/test/connection';
import { disconnect } from 'mongoose';
import { UnitTestProvider } from '../../../../config/unit.test.provider';

describe('UnitWalletService', () => {
  let service: UnitWalletService;

  beforeEach(async () => {
    // const mockUser
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: User.name, schema: UserSchema },
          { name: WalletTransfer.name, schema: WalletTransferSchema },
          { name: Application.name, schema: ApplicationSchema },
          { name: WalletWithdraw.name, schema: WalletWithdrawSchema },
          { name: Wallet.name, schema: WalletSchema },
          { name: Account.name, schema: AccountSchema },
        ]),
      ],
      providers: [
        {
          provide: UnitProvider,
          useValue: new UnitTestProvider('tokne', 'dsfd') ,
        },
        UnitWalletService,
        UnitApplicationService,
        UnitWalletTransferService,
        UnitWalletWithdrawService,
      ],
    }).compile();

    service = module.get<UnitWalletService>(UnitWalletService);
  });

  it('should be defined', async () => {
    const wallets = service.getUnitTest();
    expect(wallets).toBe('Test');
  });

  afterAll(async () => {
    await disconnect();
    await closeInMongodConnection();
  });
});
