import { AccountId, Nominations, Vec, ITuple, ApiInterfaceRx } from '@polkadot/api/types';
import { DerivedDappsStakingOverview } from '../types';

import { Observable, combineLatest, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { createType } from '@polkadot/types';

import { memo } from '@polkadot/api-derive/util/memo';

/**
 * @description Retrieve the staking overview, including elected and points earned
 */
export function overview (api: ApiInterfaceRx): () => Observable<DerivedDappsStakingOverview> {
  return memo((): Observable<DerivedDappsStakingOverview> =>
    api.query.plasmStaking.dappsNomiantions<ITuple<[Vec<AccountId>, Vec<Nominations>]>>().pipe(
      switchMap(([stashIds], [nominations]) => {
        const contracts = nominations.reduce((array, nomination) => array.concat(nomination.targets), []);
        combineLatest([
          of(contracts),
          api.derive.plasmStaking.operators(),
          api.derive.plasmStaking.query.multi(contracts)
        ])
      })      
    ));
}
