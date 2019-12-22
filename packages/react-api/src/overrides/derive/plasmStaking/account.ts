// Copyright 2017-2019 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiInterfaceRx } from '@polkadot/api/types';
import { StakingLedger, Option, AccountId, Nominations, RewardDestination } from '@polkadot/types/interfaces';
import { DerivedStakingAccount } from '../types';
import { createType } from '@polkadot/types';

import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { memo } from '@polkadot/api-derive/util/memo';

interface ParseInput {
  stashId: Uint8Array | string;
  controllerId: Option<AccountId>;
  payee: Option<RewardDestination>;
  ledger: Option<StakingLedger>;
  nominations: Option<Nominations>;
}

function parseResult ({stashId, controllerId, payee, ledger, nominations}: ParseInput): DerivedDappsStakingAccount {
  const _controllerId = controllerId.unwrap_or(undefined)
  const _payee = payee.unwrap_or(undefined)
  const _ledger = ledger.unwrap_or(undefined)
  const _nominations = nominations.unwrap_or(undefined)
  return {
    stashId: createType(api.registry, 'AccountId', stashId),
    controllerId: _controllerId,
    payee: _payee,
    ledger: _ledger,
    nominations: _nominations
  };
}

/**
 * @description From a stash, retrieve the controllerId and fill in all the relevant staking details
 */
export function account (api: ApiInterfaceRx): (stashId: Uint8Array | string) => Observable<DerivedStakingAccount> {
  return memo((stashId: Uint8Array | string): Observable<DerivedStakingAccount> =>
    combineLatest([
      api.query.plasmStaking.bonded<Option<AccountId>>(stashId),
      api.query.plasmStaking.payee<Option<RewardDestination>>(stashId),
      api.query.plasmStaking.dappsNominations<Option<Nominations>>(stashId)
    ]).pipe(
      switchMap(([controllerId, payee, nominations]): Observable<DerivedStakingAccount> =>
        combineLatest([
          of(controllerId),
          of(payee),
          controllerId.isSome?
            api.query.plasmStaking.ledger<Option<StakingLedger>>(controllerId)
            :of(controllerId),          
          of(nominations)
        ]).pipe(
          map(([controllerId, payee, ledger, nominations]):DerivedStakingAccount => 
            parseResult({stashId, controllerId, payee, ledger, nominations})
          ))
        )));
}
