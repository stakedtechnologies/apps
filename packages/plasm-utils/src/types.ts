/* eslint new-cap: ["error", { "newIsCap": false }] */
// @ts-check
// Import the API
import { Struct, u128, bool, u32, Enum, Vec } from '@polkadot/types';
import { AccountId, Balance, BlockNumber } from '@polkadot/types/interfaces';
import { registry } from '@polkadot/react-api';

export class Parameters extends Struct {
  constructor (value?: any) {
    super(registry, {
      canBeNominated: 'bool',
      optionExpired: 'u128',
      optionP: 'u32'
    }, value);
  }

  static default (): Parameters {
    return new Parameters({
      canBeNominated: new bool(registry, true),
      optionExpired: new u128(registry, 0),
      optionP: new u32(registry, 0)
    });
  }

  public isError (): boolean {
    return false;
  }
}

/** @name OfferState */
export interface OfferState extends Enum {
  readonly isWaiting: boolean;
  readonly isReject: boolean;
  readonly isAccept: boolean;
}

/** @name Offer */
export interface OfferOf extends Struct {
  readonly buyer: AccountId;
  readonly sender: AccountId;
  readonly contracts: Vec<AccountId>;
  readonly amount: Balance;
  readonly expired: BlockNumber;
  readonly state: OfferState;
}

export const types = {
  Parameters: {
    canBeNominated: 'bool',
    optionExpired: 'u128',
    optionP: 'u32'
  },
  OfferState: {
    _enum: [
      'Waiting',
      'Reject',
      'Accept'
    ]
  },
  OfferOf: {
    buyer: 'AccountId',
    sender: 'AccountId',
    contracts: 'Vec<AccountId>',
    amount: 'Balance',
    expired: 'BlockNumber',
    state: 'OfferState'
  }
};
