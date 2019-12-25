// Copyright 2017-2019 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiInterfaceRx } from '@polkadot/api/types';
import { StakingLedger, AccountId, Nominations, RewardDestination } from '@polkadot/types/interfaces';
import { Option, createType } from '@polkadot/types';

import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { memo } from '@polkadot/api-derive/util/memo';
import { DerivedDappsStakingAccount } from '../types';

interface ParseInput {
  stashId: Uint8Array | string;
  controllerId: Option<AccountId>;
  payee: RewardDestination;
  ledger: Option<StakingLedger> | undefined;
  nominations: Option<Nominations>;
}

function parseResult (api: ApiInterfaceRx, { stashId, controllerId, payee, ledger, nominations }: ParseInput): DerivedDappsStakingAccount {
  const _controllerId = controllerId.unwrapOr(undefined);
  const _ledger = ledger ? ledger.unwrapOr(undefined) : undefined;
  const _nominations = nominations.unwrapOr(undefined);
  return {
    stashId: createType(api.registry, 'AccountId', stashId),
    controllerId: _controllerId,
    payee,
    ledger: _ledger,
    nominations: _nominations ? (_nominations as any)[0] : undefined
  };
}

/**
 * @description From a stash, retrieve the controllerId and fill in all the relevant staking details
 */
export function account (api: ApiInterfaceRx): (stashId: Uint8Array | string) => Observable<DerivedDappsStakingAccount> {
  return memo((stashId: Uint8Array | string): Observable<DerivedDappsStakingAccount> =>
    combineLatest([
      api.query.plasmStaking.bonded<Option<AccountId>>(stashId),
      api.query.plasmStaking.payee<RewardDestination>(stashId),
      api.query.plasmStaking.dappsNominations<Option<Nominations>>(stashId)
    ]).pipe(
      switchMap(([controllerId, payee, nominations]): Observable<DerivedDappsStakingAccount> =>
        combineLatest([
          of(controllerId),
          of(payee),
          controllerId.isSome
            ? api.query.plasmStaking.ledger<Option<StakingLedger>>(controllerId.unwrap())
            : of(undefined),
          of(nominations)
        ]).pipe(
          map(([controllerId, payee, ledger, nominations]): DerivedDappsStakingAccount =>
            parseResult(api, { stashId, controllerId, payee, ledger, nominations })
          ))
      )));
}
