// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance } from '@polkadot/types/interfaces';
import { DerivedDappsStakingQuery, DerivedHeartbeats } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';
import { ContractFilter } from '../types';
import { Parameters } from '@plasm/utils';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AddressMini, AddressSmall, Badge, Icon } from '@polkadot/react-components';
import { useCall, useApi } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  address: AccountId | string;
  operator: AccountId | string;
  authorsMap: Record<string, string>;
  className?: string;
  defaultName: string;
  filter: ContractFilter;
  hasQueries: boolean;
  isElected: boolean;
  isFavorite: boolean;
  lastAuthors?: string[];
  myAccounts: string[];
  onFavorite?: (accountId: string) => void;
  toggleFavorite: (accountId: string) => void;
  withNominations?: boolean;
}

interface StakingState {
  operatorId?: string;
  hasNominators: boolean;
  nominators: [AccountId, Balance][];
  stakeTotal?: BN;
  contractId: string;
  contractPayment?: BN;
  contractParameters?: Parameters;
}

// operatorId: undefined | AccountId;
// nominators?: AccountId[];
// stakers?: Exposure;
// contractId: AccountId;
// contractParameters: undefined | Parameters;


function Address ({ address, operator, authorsMap, className, filter, hasQueries, isElected, isFavorite, lastAuthors, myAccounts, t, toggleFavorite, withNominations = true }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  // FIXME Any horrors, caused by derive type mismatches
  const stakingInfo = useCall<DerivedDappsStakingQuery>(api.derive.plasmStaking.query as any, [address]);
  const [{ hasNominators, nominators, contractId, stakeTotal, contractParameters }, setStakingState] = useState<StakingState>({
    hasNominators: false,
    nominators: [],
    contractId: address.toString()
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect((): void => {
    if (stakingInfo) {
      const { operatorId, stakers, contractId, contractParameters } = stakingInfo;
      const nominators = withNominations && stakers
        ? stakers.others.map(({ who, value }): [AccountId, Balance] => [who, value.unwrap()])
        : [];
      const stakeTotal = (stakers && !stakers.total.isEmpty && stakers.total.unwrap()) || undefined;
      console.log(contractParameters)

      setStakingState({
        hasNominators: nominators.length !== 0,
        operatorId,
        nominators,
        stakeTotal,
        contractId,
        contractParameters
      });
    }
  }, [stakingInfo]);

  if ((filter === 'hasNominators' && !hasNominators) ||
    (filter === 'noNominators' && hasNominators) ||
    (filter === 'hasWarnings' /* TODO */) ||
    (filter === 'iNominated'/* TODO Erase */)) {
    return null;
  }

  const lastBlockNumber = authorsMap[contractId];
  const _onFavorite = (): void => toggleFavorite(contractId);
  const _onQueryStats = (): void => {
    window.location.hash = `/staking/query/${contractId}`;
  };
  const _toggleNominators = (event: React.SyntheticEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    setIsExpanded(!isExpanded);
  };
  console.log('Address!')
  console.log('isFavorite', isFavorite)

  return (
    <tr className={`${className}`}>
      <td className='favorite'>
        <Icon
          className={`${isFavorite && 'isSelected'}`}
          name={isFavorite ? 'star' : 'star outline'}
          onClick={_onFavorite}
        />
      </td>
      <td className='together'>
        <Badge
          hover={t('Staked next/this session.')}
          info={<Icon name='chevron right' />}
          isInline
          isTooltip
          type='next'
        />
        {isElected && (
          <Badge
            hover={t('Already staked this session.')}
            info={<Icon name='check' />}
            isInline
            isTooltip
            type='online'
          />
        )}
      </td>
      <td>
        <AddressSmall value={contractId} />
      </td>
      {/* <td className='number'>
        {stakeOwn && <FormatBalance label={<label>{t('own stake')}</label>} value={stakeOwn} />}
      </td> */}
      <td className={'toggle number'} colSpan={isExpanded ? 5 : 1} onClick={_toggleNominators}>
        {nominators && (
          isExpanded
            ? (
              <div>
                {nominators.map(([who, bonded]): React.ReactNode =>
                  <AddressMini
                    bonded={bonded}
                    key={who.toString()}
                    value={who}
                    withBonded
                  />
                )}
              </div>
            )
            : <FormatBalance label={<label>{t('other stake')}</label>} value={stakeTotal}>&nbsp;({formatNumber(nominators.length)})&nbsp;<Icon name='angle double right' /></FormatBalance>
        )}
      </td>
      {!isExpanded && (
        <>
          <td className='number'>
            {contractParameters && (
              <><label>{t('option expired')}</label>{formatNumber(contractParameters.optionExpired)}</>
            )}
          </td>
          <td className='number'>
            {contractParameters && (
<><label>{t('option parcent')}</label>{formatNumber(contractParameters.optionP/10000000)}{'%'}</>
            )}
          </td>
          <td className='number'>
            {lastBlockNumber && <><label>{t('last #')}</label>{lastBlockNumber}</>}
          </td>
          {/* <td> TODO
            {hasQueries && api.query.imOnline?.authoredBlocks && (
              <Icon
                name='line graph'
                onClick={_onQueryStats}
              />
            )}
          </td> */}
        </>
      )}
    </tr>
  );
}

export default translate(
  styled(Address)`
    .extras {
      display: inline-block;
      margin-bottom: 0.75rem;

      .favorite {
        cursor: pointer;
        display: inline-block;
        margin-left: 0.5rem;
        margin-right: -0.25rem;

        &.isSelected {
          color: darkorange;
        }
      }
    }

    .blockNumberV1,
    .blockNumberV2 {
      border-radius: 0.25rem;
      font-size: 1.5rem;
      font-weight: 100;
      line-height: 1.5rem;
      opacity: 0.5;
      vertical-align: middle;
      z-index: 1;

      &.isCurrent {
        background: #3f3f3f;
        box-shadow: 0 3px 3px rgba(0,0,0,.2);
        color: #eee;
        opacity: 1;
      }
    }

    .blockNumberV2 {
      display: inline-block;
      padding: 0.25rem 0;

      &.isCurrent {
        margin-right: -0.25rem;
        padding: 0.25rem 0.75rem;
      }
    }

    .blockNumberV1 {
      padding: 0.25rem 0.5rem;
      position: absolute;
      right: 0;
    }

    .staking--Address-info {
      margin-right: 0.25rem;
      text-align: right;

      .staking--label {
        margin: 0 2.25rem -0.75rem 0;
      }
    }

    .staking--label.controllerSpacer {
      margin-top: 0.5rem;
    }

    .staking--stats {
      bottom: 0.75rem;
      cursor: pointer;
      position: absolute;
      right: 0.5rem;
    }
  `
);
