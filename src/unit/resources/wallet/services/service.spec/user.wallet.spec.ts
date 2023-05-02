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
import { UserSeederService } from '../../../../../helper/test/seeder';
import { IAuthUser } from '../../../../../auth/interfaces/auth.interface';
import { CreateAccountDto } from '../../../../dto/create-unit.dto';

describe('Unit Wallet Service Test', () => {
  let service: UnitWalletService;
  let testUser: IAuthUser;

  beforeAll(async () => {
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
          useValue: new UnitTestProvider('tokne', 'dsfd'),
        },
        UserSeederService,
        UnitWalletService,
        UnitApplicationService,
        UnitWalletTransferService,
        UnitWalletWithdrawService,
      ],
    }).compile();

    const seader = module.get<UserSeederService>(UserSeederService);
    await seader.seed();
    testUser = await seader.getAuthUser();
    service = module.get<UnitWalletService>(UnitWalletService);
  });

  it('should create an account', async () => {
    const accountData: CreateAccountDto = {
      currency: 'NGN',
      accountName: 'Fane Me',
      accountNo: '01929323',
      bank: 'First Bank',
    };
    const account = await service.createAccount(testUser, accountData);
    expect(account).toBeDefined();
  });

  it('should get created account', async () => {
    const accounts = await service.getUserAccounts(testUser);
    expect(accounts).toHaveLength(1);
  });

  it('should get user wallet', async () => {
    const wallets = await service.getWallet(testUser);
    expect(wallets).toBeDefined();
  });

  afterAll(async () => {
    await disconnect();
    await closeInMongodConnection();
  });
});
