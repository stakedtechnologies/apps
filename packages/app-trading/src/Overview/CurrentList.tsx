// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { OfferFilter } from '../types';

import React, { useEffect, useMemo, useState } from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Dropdown, FilterOverlay, Input, Table } from '@polkadot/react-components';
import { BlockNumber } from '@polkadot/types/interfaces';

import { useFavorites } from '@polkadot/react-hooks';

import { STORE_FAVS_BASE } from '../constants';
import { useTranslation } from '../translate';
import Address from './Address';

import { OfferOf } from '@plasm/utils';

interface Props {
  allOffers: OfferOf[];
}

function isFiltered(a: OfferOf, filter: OfferFilter, currentNumber: BlockNumber) {
  return filter == 'all' ? true :
    (a.expired > currentNumber && a.state.isWaiting && filter == 'waiting') ||
    (a.expired <= currentNumber && a.state.isWaiting && filter == 'expired') ||
    (a.state.isReject && filter == 'reject') ||
    (a.state.isAccept && filter == 'accept');
}

function filterOffers(allOffers: OfferOf[] = [], filter: OfferFilter, nameFilter: string, favorites: string[], currentNumber: BlockNumber): OfferOf[] {
  console.log('prev filter: ', allOffers)
  console.log('filter', filter);
  const sortedOffers = allOffers
    .filter((a: OfferOf): boolean => isFiltered(a, filter, currentNumber) )
    .filter((a: OfferOf): boolean => nameFilter == '' ? true :
     a.buyer.toString().includes(nameFilter) || a.sender.toString().includes(nameFilter))
    .sort((a: OfferOf,b: OfferOf): number => a.expired - b.expired );
  return sortedOffers.sort((a,b): number =>  {
      const isFavA = favorites.includes(a.buyer);
      const isFavB = favorites.includes(b.buyer);
      return isFavA == isFavB? 0 : (isFavA ? -1 : 1);
    });
}

export default function CurrentList ({ allOffers }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const currentNumber = useCall<BlockNumber>(api.query.system.number, []);
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS_BASE);
  const [filter, setFilter] = useState<OfferFilter>('all');
  const [nameFilter, setNameFilter] = useState<string>('');
  const [offers, setOffers] = useState<OfferOf[]>([]);
  
  const filterOpts = useMemo(() => [
    { text: t('Show all offers and intentions'), value: 'all' },
    { text: t('Show only waiting'), value: 'waiting' },
    { text: t('Show only accept'), value: 'accept' },
    { text: t('Show only reject'), value: 'reject' },
    { text: t('Show only expired'), value: 'expired' }
  ], [t]);

  useEffect((): void => {
    if (allOffers) {
      const offers = filterOffers(allOffers, filter, nameFilter, favorites, currentNumber);
      setOffers(offers);
    }
  }, [allOffers, filter, favorites, nameFilter, currentNumber]);

  const _renderRows = (offers: OfferOf[], defaultName: string): React.ReactNode =>
    offers.map((offer): React.ReactNode => (
      <Address
        offer={offer}
        defaultName={defaultName}
        isFavorite={favorites.includes(offer.buyer)}
        toggleFavorite={toggleFavorite}
      />
    ));

  return (
    <div>
      <FilterOverlay>
        <Dropdown
          onChange={setFilter}
          options={filterOpts}
          value={filter}
          withLabel={false}
        />
      </FilterOverlay>
      <Input
        autoFocus
        isFull
        label={t('filter by name or address')}
        onChange={setNameFilter}
        value={nameFilter}
      />
      <Table>
        <Table.Body>
          {_renderRows(offers, t('offers'))}
        </Table.Body>
      </Table>
    </div>
  );
}