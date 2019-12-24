// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedHeartbeats, DerivedStakingOverview } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';
import { AccountId, EraPoints, Points } from '@polkadot/types/interfaces';
import { ContractFilter } from '../types';

import React, { useEffect, useState } from 'react';
import { Dropdown, FilterOverlay, Table } from '@polkadot/react-components';
import { useAccounts, useApi, useFavorites } from '@polkadot/react-hooks';

import { STORE_FAVS_BASE } from '../constants';
import translate from '../translate';
import Address from './Address';

interface Props extends I18nProps {
  authorsMap: Record<string, string>;
  hasQueries: boolean;
  isIntentions: boolean;
  isVisible: boolean;
  lastAuthors?: string[];
  next: string[];
  allContracts: string[];
  allOperators: string[];
  electedContracts: string[];
  electedOperators: string[];
}

// ContractId, OperatorId, isElected, isFav
type AccountExtend = [string, string, boolean, boolean];

function filterAccounts (allContracts: string[] = [], allOperators: string[] = [], electedContracts: string[] = [], favorites: string[]): AccountExtend[] {
  return allContracts
    .map((a, i) => [a, allOperators[i]])
    .sort((a, b): number => {
      const isFavA = favorites.includes(a[0]);
      const isFavB = favorites.includes(b[0]);
      const isElectedA = electedContracts.includes(a[0]);
      return isFavA === isFavB 
        ? (isElectedA ? -1 : 1)
        : (isFavA ? -1 : 1)
    })
    .map((contract): AccountExtend => {
      return [
        contract[0],
        contract[1],
        electedContracts.includes(contract[0]),
        favorites.includes(contract[0])
      ]
    });
}

function accountsToString (accounts: AccountId[]): string[] {
  return accounts.map((accountId): string => accountId.toString());
}

function CurrentList ({ authorsMap, hasQueries, isIntentions, isVisible, lastAuthors, next, allContracts, allOperators, electedContracts, electedOperators, t }: Props): React.ReactElement<Props> | null {
  const { allAccounts } = useAccounts();
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS_BASE);
  const [filter, setFilter] = useState<ContractFilter>('all');
  const [contracts, setFiltered] = useState<AccountExtend[]>([]);

  // operatorId: undefined | AccountId;
  // nominators?: AccountId[];
  // stakers?: Exposure;
  // contractId: AccountId;
  // contractParameters: undefined | Parameters;
  console.log('isIntentions', isIntentions)

  useEffect((): void => {
    if (isVisible && allContracts) {
      const contracts = filterAccounts(allContracts, allOperators, electedContracts, favorites);

      setFiltered(contracts);
    }
  }, [allContracts, allOperators, electedContracts, favorites, isVisible, next]);

  const _renderRows = (addresses: AccountExtend[], defaultName: string): React.ReactNode =>
    addresses.map(([contract, operator, isElected, isFavorite]): React.ReactNode => (
      <Address
        address={contract}
        operator={operator}
        authorsMap={authorsMap}
        defaultName={defaultName}
        filter={filter}
        hasQueries={hasQueries}
        isElected={isElected}
        isFavorite={isFavorite}
        lastAuthors={lastAuthors}
        key={contract}
        myAccounts={allAccounts}
        toggleFavorite={toggleFavorite}
      />
    ));

  return (
    <div className={`${!isVisible && 'staking--hidden'}`}>
      <FilterOverlay>
        <Dropdown
          onChange={setFilter}
          options={[
            { text: t('Show all contracts and intentions'), value: 'all' },
            { text: t('Show only my nominations'), value: 'iNominated' },
            { text: t('Show only with nominators'), value: 'hasNominators' },
            { text: t('Show only without nominators'), value: 'noNominators' },
            { text: t('Show only with warnings'), value: 'hasWarnings' },
            { text: t('Show only without warnings'), value: 'noWarnings' },
          ]}
          value={filter}
          withLabel={false}
        />
      </FilterOverlay>
      <Table className={isIntentions ? 'staking--hidden' : ''}>
        <Table.Body>
          {_renderRows(contracts, t('contracts'))}
        </Table.Body>
      </Table>
    </div>
  );
}

export default translate(CurrentList);
