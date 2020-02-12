// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { Exposure, Balance } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SummarySession from '@polkadot/app-explorer/SummarySession';
import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { formatBalance } from '@polkadot/util';
import { SessionRewards } from '../types';
import translate from '../translate';

interface Props extends I18nProps {
  className?: string;
  isVisible: boolean;
  allContracts: string[];
  stakedContracts: string[];
  stakedExposures: Exposure[];
  sessionRewards: SessionRewards[];
}

interface StakeInfo {
  percentage: string;
  staked: string | null;
}

function extractInfo (stakedExposures: Exposure[]): BN {
  let totalStaked = new BN(0);
  stakedExposures.map((exp) => {
    totalStaked = totalStaked.add(exp.total.unwrap());
  });
  return totalStaked;
}

function Summary ({ className, isVisible, allContracts, stakedContracts, stakedExposures, sessionRewards, style, t }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const totalInsurance = useCall<Balance>(api.query.balances.totalIssuance, []);
  const [lastReward, setLastReward] = useState(new BN(0));
  const [{ percentage, staked }, setStakeInfo] = useState<StakeInfo>({ percentage: '-', staked: null });
  const [total, setTotal] = useState<string | null>(null);

  useEffect((): void => {
    if (sessionRewards && sessionRewards.length) {
      const lastRewardSession = sessionRewards.filter(({ reward }): boolean => reward.gtn(0));

      setLastReward(
        lastRewardSession.length
          ? lastRewardSession[lastRewardSession.length - 1].reward
          : new BN(0)
      );
    }
  }, [sessionRewards]);

  useEffect((): void => {
    if (totalInsurance) {
      setTotal(
        `${formatBalance(totalInsurance, { forceUnit: '-', withSi: false })}${formatBalance.calcSi(totalInsurance.toString()).value}`
      );
    }
  }, [totalInsurance]);

  useEffect((): void => {
    const totalStaked = extractInfo(stakedExposures);
    if (totalInsurance && totalStaked?.gtn(0)) {
      setStakeInfo({
        percentage: `${(totalStaked.muln(10000).div(totalInsurance).toNumber() / 100).toFixed(2)}%`,
        staked: `${formatBalance(totalStaked, { forceUnit: '-', withSi: false })}${formatBalance.calcSi(totalStaked.toString()).value}`
      });
    }
  }, [totalInsurance, stakedExposures]);

  return (
    <SummaryBox
      className={`${className} ${!isVisible && 'staking--hidden'}`}
      style={style}
    >
      <section className='ui--media-small'>
        <CardSummary label={t('total staked')}>
          {staked || '-'}
        </CardSummary>
        <CardSummary label=''>/</CardSummary>
        <CardSummary label={t('total issuance')}>
          {total || '-'}
        </CardSummary>
      </section>
      <CardSummary label={t('staked')}>
        {percentage}
      </CardSummary>
      <section>
        <CardSummary label={t('staked contracts')}>
          {stakedContracts.length}{`/${allContracts.length.toString()}`}
        </CardSummary>
      </section>
      <section>
        <SummarySession />
      </section>
      <CardSummary label={t('last reward')}>
        {
          lastReward.gtn(0)
            ? `${formatBalance(lastReward, { forceUnit: '-', withSi: false })}`
            : '-'
        }
      </CardSummary>
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
