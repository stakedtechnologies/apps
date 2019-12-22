import { AccountId, Nominations, Balance, BalanceLock, BlockNumber, EraIndex, Exposure, Keys, RewardDestination, SessionIndex, StakingLedger, ValidatorPrefs } from '@polkadot/types/interfaces';
import { Parameters } from '@plasm/utils';

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
  payee: undefined | RewardDestination;
  ledger: undefined | StakingLedger;
  nominations: undefined | Nominations;
}