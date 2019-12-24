import { ApiInterfaceRx } from '@polkadot/api/types';
import { AccountId, Exposure } from '@polkadot/types/interfaces';
import { ITuple } from '@polkadot/types/types';

import { Observable, combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Option, Vec } from '@polkadot/types';

import { memo } from '@polkadot/api-derive/util/memo';
import { DeriveOperators } from '../types';

/**
 * @description From the list of stash accounts, retrieve the list of controllers
 */
export function stakedOperators (api: ApiInterfaceRx): () => Observable<DeriveOperators> {
  return memo((): Observable<[AccountId[], Option<AccountId>[]]> => 
    api.query.plasmStaking.stakedContracts<ITuple<[Vec<AccountId>, Vec<Exposure>]>>().pipe(
      switchMap(([contractIds]): Observable<DeriveOperators> =>
        combineLatest([
          of(contractIds),
          api.query.operator.contractHasOperator.multi<Option<AccountId>>(contractIds)
        ])
      )));
}
