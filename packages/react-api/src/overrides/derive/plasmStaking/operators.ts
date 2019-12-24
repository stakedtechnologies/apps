import { ApiInterfaceRx } from '@polkadot/api/types';
import { AccountId, Nominations } from '@polkadot/types/interfaces';
import { ITuple } from '@polkadot/types/types';
import registry from '../../../typeRegistry';

import { Observable, combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Option, Vec } from '@polkadot/types';

import { memo } from '@polkadot/api-derive/util/memo';
import { DeriveOperators } from '../types';

/**
 * @description From the list of stash accounts, retrieve the list of controllers
 */
export function operators (api: ApiInterfaceRx): () => Observable<DeriveOperators> {
  return memo((): Observable<[AccountId[], Option<AccountId>[]]> =>
    api.query.plasmStaking.dappsNominations<ITuple<[Vec<AccountId>, Vec<Nominations>]>>().pipe(
      switchMap(([stashIds, nominations]): Observable<DeriveOperators> => {
        const contracts: Set<AccountId> = nominations.reduce((set, nomination: Nominations) =>
          nomination.targets.reduce((s, target) => s.add(target), set), new Set<AccountId>());
        const contractIds = Array.from(contracts);
        return combineLatest([
          of(contractIds),
          api.query.operator.contractHasOperator.multi<Option<AccountId>>(contractIds)
        ]);
      })));
}
