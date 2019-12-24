import { ApiInterfaceRx } from '@polkadot/api/types';
import { AccountId, Exposure } from '@polkadot/types/interfaces';
import { ITuple } from '@polkadot/types/types';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vec } from '@polkadot/types';

import { memo } from '@polkadot/api-derive/util/memo';
import { DerivedStakedOperators } from '../types';

/**
 * @description From the list of stash accounts, retrieve the list of controllers
 */
export function stakedOperators (api: ApiInterfaceRx): () => Observable<DerivedStakedOperators> {
  return memo((): Observable<[AccountId[], Exposure[]]> =>
    api.query.plasmStaking.stakedContracts<ITuple<[Vec<AccountId>, Vec<Exposure>]>>().pipe(
      map(([contractIds, exposures]): DerivedStakedOperators => [contractIds, exposures])
    )
  );
}
