/* eslint-disable @typescript-eslint/camelcase */
// @ts-check
// Import the API
import { Struct, u128, bool, Bool, U128 } from '@polkadot/types';

export class Parameters extends Struct {
	constructor (value?: any) {
    super({
      canBeNominated: bool,
      optionExpired: u128,
      optionP: u128
    })
  }
  static default(): Parameters {
    return new Parameters({
      canBeNominated: new Bool(true),
      optionExpired: new U128(0),
      optionP: new U128(0)
    });
  }
  public isErr(): boolean {
    return false;
  }
}

const types = {
  Parameters: {
    canBeNominated: 'bool',
    optionExpired: 'u128',
    optionP: 'u128'
  },
};

export default types;