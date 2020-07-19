// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export default {
  Keys: 'SessionKeys2',
  ClaimId: 'H256',
  Lockdrop: {
    type: 'u8',
    transaction_hash: 'H256',
    public_key: '[u8; 33]',
    duration: 'u64',
    value: 'u128'
  },
  TickerRate: {
    authority: 'u16',
    btc: 'u128',
    eth: 'u128'
  },
  AuthorityId: 'AccountId',
  AuthorityVote: 'u32',
  DollarRate: 'u128',
  ClaimVote: {
    claim_id: 'ClaimId',
    approve: 'bool',
    authority: 'u16'
  },
  Claim: {
    params: 'Lockdrop',
    approve: 'BTreeSet<AuthorityId>',
    decline: 'BTreeSet<AuthorityId>',
    amount: 'u128',
    complete: 'bool'
  }
};
