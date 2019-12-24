// Copyright 2017-2019 @polkadot/api-derive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiInterfaceRx } from '@polkadot/api/types';
import { AccountId, Exposure, IndividualExposure, Keys, Nominations, RewardDestination, StakingLedger } from '@polkadot/types/interfaces';
import { Parameters } from '@plasm/utils';

import { ITuple } from '@polkadot/types/types';
import { DerivedDappsStakingQuery } from '../types';

import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { createType, Option, Vec } from '@polkadot/types';

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
  console.log('operatorId', _operatorId)
  console.log('parameters', _contractParameters)
  console.log('staker', stakers);
  return {
    operatorId: _operatorId,
    nominators,
    stakers,
    contractId,
    contractParameters: _contractParameters
  };
}

function retrieve (api: ApiInterfaceRx, contractId: AccountId): Observable<DerivedDappsStakingQuery> {
  console.log('retrive')
  console.log('retrive', contractId.toString());
  return combineLatest([
    api.query.plasmStaking.stakedContracts<Exposure>(contractId),
    api.query.operator.contractHasOperator<Option<AccountId>>(contractId),
    api.query.operator.contractParameters<Option<Parameters>>(contractId)
  ]).pipe(map(([stakers, operatorId, contractParameters]): DerivedDappsStakingQuery => {
    console.log('stakers', stakers[0]);
    const nominators: AccountId[] = stakers[0] ? stakers[0].others.map<AccountId>((indv: IndividualExposure) => indv.who) : [];
    return parseResult({
      operatorId,
      nominators,
      stakers: stakers[0] ? stakers[0] : undefined,
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
    console.log('query in ', accountId)
    return retrieve(api, createType(api.registry, 'AccountId', accountId))});
}
