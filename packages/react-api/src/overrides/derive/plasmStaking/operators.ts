import { ApiInterfaceRx } from '@polkadot/api/types';
import { AccountId, Exposure } from '@polkadot/types/interfaces';
import { ITuple } from '@polkadot/types/types';

import { Observable, combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Option, Vec } from '@polkadot/types';

import { memo } from '@polkadot/api-derive/util/memo';

type DeriveOperators = [AccountId[], Option<AccountId>[]];

/**
 * @description From the list of stash accounts, retrieve the list of controllers
 */
export function operators (api: ApiInterfaceRx): () => Observable<DeriveOperators> {
  return memo((): Observable<[AccountId[], Option<AccountId>[]]> => {
      console.log('call operators')
    return api.query.plasmStaking.StakedContracts<ITuple<[Vec<AccountId>, Vec<Exposure>]>>().pipe(
      switchMap(([contractIds]): Observable<DeriveOperators> => {
          console.log('contractIds on derive: ',contractIds)
        return combineLatest([
          of(contractIds),
          // for V2, don't return all the controllers, we call bonded at a later point
          api.consts.session
            ? of([])
            : api.query.operator.contractHasOperator.multi<Option<AccountId>>(contractIds)
        ])
    })
    )});
}
