// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import styled from 'styled-components';
import SummarySession from '@polkadot/app-explorer/SummarySession';
import { CardSummary, SummaryBox } from '@polkadot/react-components';

import translate from '../translate';

interface Props extends I18nProps {
  className?: string;
  isVisible: boolean;
  next: string[];
  allContracts: string[];
  stakedContracts: string[];
}

function Summary ({ className, isVisible, next, allContracts, stakedContracts, style, t }: Props): React.ReactElement<Props> {
  return (
    <SummaryBox
      className={`${className} ${!isVisible && 'staking--hidden'}`}
      style={style}
    >
      <section>
        <CardSummary label={t('staked contracts')}>
          {stakedContracts.length}{`/${allContracts.length.toString()}`}
        </CardSummary>
      </section>
      <section>
        <SummarySession />
      </section>
    </SummaryBox>
  );
}

export default translate(
  styled(Summary)`
    .validator--Account-block-icon {
      margin-right: 0.75rem;
      margin-top: -0.25rem;
      vertical-align: middle;
    }

    .validator--Summary-authors {
      .validator--Account-block-icon+.validator--Account-block-icon {
        margin-left: -1.5rem;
      }
    }
  `
);
