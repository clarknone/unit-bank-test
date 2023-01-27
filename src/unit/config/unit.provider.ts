import { Unit } from '@unit-finance/unit-node-sdk';

export class UnitProvider extends Unit {
  constructor() {
    super(process.env.UNIT_API_KEY, 'https://api.s.unit.sh/');
  }
}
