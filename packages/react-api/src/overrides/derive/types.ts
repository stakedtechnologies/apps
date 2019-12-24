import { AccountId, Nominations, Exposure, RewardDestination, StakingLedger } from '@polkadot/types/interfaces';
import { Option } from '@polkadot/types';
import { Parameters } from '@plasm/utils';

export type DeriveOperators = [AccountId[], Option<AccountId>[]];
export type DerivedStakedOperators = [AccountId[], Exposure[]];

// export interface DerivedDappsStakingOverview {
//   currentElected: DeriveOperators;
//   contracts: DerivedDappsStakingQuery[];
// }

export interface DerivedDappsStakingQuery {
  operatorId: undefined | AccountId;
  nominators?: AccountId[];
  stakers?: Exposure;
  contractId: AccountId;
  contractParameters: undefined | Parameters;
}

export interface DerivedDappsStakingAccount {
  stashId: AccountId;
  controllerId: undefined | AccountId;
  payee: RewardDestination;
  ledger: undefined | StakingLedger;
  nominations: undefined | Nominations;
}
