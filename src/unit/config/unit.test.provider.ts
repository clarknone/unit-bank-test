import { CreateBookPaymentRequest, Unit } from '@unit-finance/unit-node-sdk';
import { ApplicationMock } from './mock/application.mock';

// new Unit().payments

export class UnitTestProvider extends Unit {
  applications: ApplicationMock = new ApplicationMock('tokne', 'pthe');
  async bookTransfer(sender: string, receiver: string, amount: number) {
    const transfer: CreateBookPaymentRequest = {
      type: 'bookPayment',
      attributes: {
        amount: amount,
        description: 'function',
      },
      relationships: {
        account: { data: { type: 'depositAccount', id: sender } },
        counterpartyAccount: { data: { type: 'depositAccount', id: receiver } },
      },
    };
    console.log({ receiver, sender });
    return this.payments.create(transfer);
  }

  getTest():string {
    return "Test"
  }
}
