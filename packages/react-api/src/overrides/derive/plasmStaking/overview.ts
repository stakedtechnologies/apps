// import { AccountId, Nominations, Vec, ITuple, ApiInterfaceRx } from '@polkadot/api/types';
// import { DerivedDappsStakingQuery, DerivedDappsStakingOverview } from '../types';

// import { Observable, combineLatest, of } from 'rxjs';
// import { switchMap, map } from 'rxjs/operators';
// import { createType } from '@polkadot/types';

// import { memo } from '@polkadot/api-derive/util/memo';

// /**
//  * @description Retrieve the staking overview, including elected and points earned
//  */
// export function overview (api: ApiInterfaceRx): () => Observable<DerivedDappsStakingOverview> {
//   return memo((): Observable<DerivedDappsStakingOverview> =>
//     api.query.plasmStaking.dappsNominations<ITuple<[Vec<AccountId>, Vec<Nominations>]>>().pipe(
//       switchMap(([stashIds, nominations]): Observable<DerivedDappsStakingOverview> => {
//         console.log('stashIds, nominations', stashIds, nominations)
//         const contracts = nominations.reduce((array, nomination) => array.concat(nomination.targets), []);
//         console.log('contracts', contracts.toString())
//         combineLatest(contracts.map((accountId): Observable<DerivedDappsStakingQuery> => {
//           console.log('contrac query:', accountId.toString())
//           console.log('query',api.derive.plasmStaking.query)
//           return api.derive.plasmStaking.query([accountId.toString()])
//         }
//         ))
//       }),
//       map(([queryResults]): DerivedDappsStakingOverview => {
//         console.log('queryResults', queryResults);
//         return {contracts: queryResults};
//       })
//     ));
// }
