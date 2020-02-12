// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { OfferOf } from '@plasm/utils';

import React, { useState } from 'react';
import { AddressMini, AddressSmall, Badge, Button, Icon, TxButton } from '@polkadot/react-components';
import { useCall, useApi } from '@polkadot/react-hooks';
import { formatBalance, formatNumber } from '@polkadot/util';

import { BlockNumber, AccountId } from '@polkadot/types/interfaces';
import { useTranslation } from '../translate';

interface Props {
  offer: OfferOf;
  className?: string;
  defaultName: string;
  isFavorite: boolean;
  onFavorite?: (accountId: string) => void;
  toggleFavorite: (accountId: string) => void;
}

export default function Address ({ offer, className, isFavorite, toggleFavorite }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isExpanded, setIsExpanded] = useState(false);
  const blockNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []);
  const _onFavorite = (): void => toggleFavorite(offer.buyer);
  const _toggleContracts = (event: React.SyntheticEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    setIsExpanded(!isExpanded);
  };

  const isExpired = offer.expired <= (blockNumber? blockNumber : 0) && offer.state.isWaiting;

  return (
    <tr className={`${className}`}>
      <td className='top'>
      </td>
      <td className='favorite'>
        <Icon
          className={`${isFavorite && 'isSelected'}`}
          name={isFavorite ? 'star' : 'star outline'}
          onClick={_onFavorite}
        />
      </td>
      <td className='together'>
        {isExpired && (
          <Badge
            hover={t('Already expired offer.')}
            info={<Icon name='calendar times outline' color='red' />}
            isInline
            isTooltip
            type='gray'
          />
        )}
        {!isExpired && offer.state.isWaiting && (
          <Badge
            hover={t('Waiting offer.')}
            info={<Icon name='wait' color='orange' />}
            isInline
            isTooltip
            type='gray'
          />
        )}
        {offer.state.isAccept && (
          <Badge
            hover={t('Already accepted this offer.')}
            info={<Icon name='check' color='green' />}
            isInline
            isTooltip
            type='gray'
          />
        )}
        {offer.state.isReject && (
          <Badge
            hover={t('Already rejected this offer.')}
            info={<Icon name='times' color='red' />}
            isInline
            isTooltip
            type='gray'
          />
        )}
      </td>
      <td>
        <AddressSmall value={offer.buyer} />
      </td>
      <td className='top '>
        <AddressMini
          className='mini-nopad'
          label={t('sender')}
          value={offer.sender}
        />
      </td>
      <td className={'toggle number'} colSpan={isExpanded ? 5 : 1} onClick={_toggleContracts}>
        {offer.contracts && (
          isExpanded
            ? (
              <div>
                {offer.contracts.map((contract: AccountId): React.ReactNode =>
                  <AddressMini
                    label={t('contracts')}
                    key={offer.buyer.toString() + contract.toString()}
                    value={contract}
                  />
                )}
              </div>
            )
            : <AddressMini
              label={t('contracts')}
              key={offer.contracts[0].toString()}
              value={offer.contracts[0]}
            >
                &nbsp;({formatNumber(offer.contracts.length)})&nbsp;<Icon name='angle double right' />
            </AddressMini>
        )}
      </td>
      {!isExpanded && (
        <>
          <td className='number'>
            {offer.expired && (
              <><label>{t('expired')}</label>{formatNumber(offer.expired)}</>
            )}
          </td>
          <td className='number'>
            {offer.amount && (
              <><label>{t('amount')}</label>{formatBalance(offer.amount)}</>
            )}
          </td>
        </>
      )}
      <td className='top number together'>
        <Button.Group>
          <TxButton
            accountId={offer.sender.toString()}
            params={[offer.buyer]}
            isPositive
            key='accept'
            label={t('Accept')}
            icon='check circle'
            tx='trading.accept'
            isDisabled={!(offer.state.isWaiting && !isExpired)}
          />
          <Button.Or />
          <TxButton
            accountId={offer.sender.toString()}
            params={[offer.buyer]}
            isPrimary
            key='reject'
            label={t('Reject')}
            icon='times circle'
            tx='trading.reject'
            isDisabled={!offer.state.isWaiting}
          />
          <Button.Or />
          <TxButton
            accountId={offer.buyer.toString()}
            key='remove'
            isNegative
            label={t('Remove')}
            icon='trash alternate'
            tx='trading.remove'
            isDisabled={!(offer.state.isReject || offer.state.isAccept || isExpired)}
          />
        </Button.Group>
      </td>

    </tr>
  );
}
