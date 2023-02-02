import { CreateBookPaymentRequest, Unit } from '@unit-finance/unit-node-sdk';

// new Unit().payments

export class UnitProvider extends Unit {
  constructor() {
    super(process.env.UNIT_API_KEY, 'https://api.s.unit.sh/');
  }

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
}
