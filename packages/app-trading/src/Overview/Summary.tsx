// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps as Props } from '@polkadot/react-components/types';

import React from 'react';
import { CardSummary, SummaryBox } from '@polkadot/react-components';

import { BestFinalized, BestNumber, TimeNow, TimePeriod, EstimateBlockNumber } from '@polkadot/react-query';

import { useTranslation } from '../translate';

export default function Summary (): React.ReactElement<Props> {
  const { t } = useTranslation();
  return (
    <SummaryBox>
      <section>
        <CardSummary label={t('last block')}>
          <TimeNow />
        </CardSummary>
        <CardSummary
          className='ui--media-small'
          label={t('target')}
        >
          <TimePeriod />
        </CardSummary>
        <CardSummary label={t('+1 days block')}>
          <EstimateBlockNumber later={1 * 24 * 60 * 60 * 1000} />
        </CardSummary>
        <CardSummary label={t('+30 days block')}>
          <EstimateBlockNumber later={30 * 24 * 60 * 60 * 1000} />
        </CardSummary>
        <CardSummary label={t('+100 days block')}>
          <EstimateBlockNumber later={100 * 24 * 60 * 60 * 1000} />
        </CardSummary>
      </section>
      <section>
        <CardSummary label={t('finalized')}>
          <BestFinalized />
        </CardSummary>
        <CardSummary label={t('best')}>
          <BestNumber />
        </CardSummary>
      </section>
    </SummaryBox>
  );
}