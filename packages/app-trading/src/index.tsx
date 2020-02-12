// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps as Props } from '@polkadot/react-components/types';
import { AccountId } from '@polkadot/types/interfaces';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Vec } from '@polkadot/types';
import { ITuple } from '@polkadot/types/types';
import { Button, HelpOverlay } from '@polkadot/react-components';
import Tabs from '@polkadot/react-components/Tabs';
import { useCall, useAccounts, useApi } from '@polkadot/react-hooks';

import basicMd from './md/basic.md';
import Overview from './Overview';
import { useTranslation } from './translate';

import Offer from '@polkadot/app-accounts/modals/Offer';
import { OfferOf } from '@plasm/utils';

const EMPY_OFFERS: OfferOf[] = [];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function transformOffers ([_, offers]: ITuple<[Vec<AccountId>, Vec<OfferOf>]>): OfferOf[] {
  return offers.map((offer): OfferOf => offer);
}

function TradingApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const allOffers = (useCall<OfferOf[]>(api.query.trading.offers, [], {
    defaultValue: EMPY_OFFERS,
    transform: transformOffers
  }) as OfferOf[]);
  const hasQueries = hasAccounts && !!(api.query.imOnline?.authoredBlocks);

  console.log('allOffers', allOffers);

  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const _toggleOffer = (): void => setIsOfferOpen(!isOfferOpen);

  return (
    <main className={`staking--App ${className}`}>
      <HelpOverlay md={basicMd} />
      <header>
        <Tabs
          basePath={basePath}
          hidden={
            hasAccounts
              ? hasQueries
                ? []
                : ['query']
              : ['actions', 'query']
          }
          items={[
            {
              isRoot: true,
              name: 'overview',
              text: t('Trading overview')
            }
          ]}
        />
      </header>
      <Button.Group>
        <Button
          isPrimary
          key='new-offer'
          label={t('New offer')}
          icon='add'
          onClick={_toggleOffer}
        />
      </Button.Group>
      {isOfferOpen && (
        <Offer onClose={_toggleOffer} />
      )}
      <Overview
        allOffers={allOffers}
      />
    </main>
  );
}

export default styled(TradingApp)`
  .staking--hidden {
    display: none;
  }

  .staking--queryInput {
    margin-bottom: 1.5rem;
  }

  .staking--Chart h1 {
    margin-bottom: 0.5rem;
  }

  .staking--Chart+.staking--Chart {
    margin-top: 1.5rem;
  }
`;
