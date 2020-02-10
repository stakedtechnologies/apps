// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance } from '@polkadot/types/interfaces';

export type Offers = Record<string, string[]>;

export type OfferFilter = 'all' | 'waiting' | 'accept' | 'reject' | 'expired';

export interface Slash {
  accountId: AccountId;
  amount: Balance;
}
