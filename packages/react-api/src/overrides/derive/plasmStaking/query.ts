// Copyright 2017-2020 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiInterfaceRx } from '@polkadot/api/types';
import { AccountId, Exposure, IndividualExposure } from '@polkadot/types/interfaces';
import { Parameters } from '@plasm/utils';

import { DerivedDappsStakingQuery } from '../types';

import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { createType, Option } from '@polkadot/types';

import { memo } from '@polkadot/api-derive/util/memo';

interface ParseInput {
  operatorId: Option<AccountId>;
  nominators?: AccountId[];
  stakers?: Exposure;
  contractId: AccountId;
  contractParameters: Option<Parameters>;
}

function parseResult ({ operatorId, nominators, stakers, contractId, contractParameters }: ParseInput): DerivedDappsStakingQuery {
  const _operatorId = operatorId.unwrapOr(undefined);
  const _contractParameters = contractParameters.unwrapOr(undefined);
  return {
    operatorId: _operatorId ? (_operatorId as any)[0] : undefined,
    nominators,
    stakers,
    contractId,
    contractParameters: _contractParameters
  };
}

function retrieve (api: ApiInterfaceRx, contractId: AccountId): Observable<DerivedDappsStakingQuery> {
  return combineLatest([
    api.query.plasmStaking.stakedContracts<Exposure>(contractId),
    api.query.operator.contractHasOperator<Option<AccountId>>(contractId),
    api.query.operator.contractParameters<Option<Parameters>>(contractId)
  ]).pipe(map(([stakers, operatorId, contractParameters]): DerivedDappsStakingQuery => {
    const staker: Exposure = (stakers as any)[0];
    const nominators: AccountId[] = staker ? staker.others.map<AccountId>((indv: IndividualExposure) => indv.who) : [];
    return parseResult({
      operatorId,
      nominators,
      stakers: staker || undefined,
      contractId,
      contractParameters
    });
  }));
}

/**
 * @description From a stash, retrieve the controllerId and fill in all the relevant staking details
 */
export function query (api: ApiInterfaceRx): (_accountId: Uint8Array | string) => Observable<DerivedDappsStakingQuery> {
  return memo((accountId: Uint8Array | string): Observable<DerivedDappsStakingQuery> => {
    return retrieve(api, createType(api.registry, 'AccountId', accountId));
  });
}
