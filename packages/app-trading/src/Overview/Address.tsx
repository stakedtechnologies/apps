// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { OfferOf } from '@plasm/utils';

import React, { useState } from 'react';
import { AddressMini, AddressSmall, Badge, Button, Icon, TxButton } from '@polkadot/react-components';
import { useCall, useApi, useToggle } from '@polkadot/react-hooks';
import { formatBalance, formatNumber } from '@polkadot/util';

import { BlockNumber, AccountId } from '@polkadot/types/interface';
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
  const blockNumber = useCall<BlockNumber>(api.query.system.number, []);
  const _onFavorite = (): void => toggleFavorite(offer.buyer);
  const _toggleContracts = (event: React.SyntheticEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    setIsExpanded(!isExpanded);
  };

  // const [isAcceptOpen, toggleAcceptOpen] = useToggle();
  // const [isRejectOpen, toggleRejectOpen] = useToggle();
  // const [isRemoveOpen, toggleRemoveOpen] = useToggle();

  const isExpired = offer.expired <= blockNumber && offer.state.isWaiting;

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
          type='online'
          />
        )}
        {!isExpired && offer.state.isWaiting && (
          <Badge
          hover={t('Waiting offer.')}
          info={<Icon name='wait' color='orange' />}
          isInline
          isTooltip
          type='online'
          />
        )}
        {offer.state.isAccept && (
          <Badge
          hover={t('Already accepted this offer.')}
          info={<Icon name='check' color='green' />}
          isInline
          isTooltip
          type='online'
          />
        )}
        {offer.state.isReject && (
          <Badge
          hover={t('Already rejected this offer.')}
          info={<Icon name='times' color='red' />}
          isInline
          isTooltip
          type='online'
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
      {/* <td className='number'>
        {stakeOwn && <FormatBalance label={<label>{t('own stake')}</label>} value={stakeOwn} />}
      </td> */}
      <td className={'toggle number'} colSpan={isExpanded ? 5 : 1} onClick={_toggleContracts}>
        {offer.contracts && (
          isExpanded
            ? (
              <div>
                {offer.contracts.map((contract: AccountId): React.ReactNode =>
                  <AddressMini
                    label={t('contracts')}
                    key={offer.buyer.toString()+contract.toString()}
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
          {// TODOmspeify extrinsict.
        }
          {offer.state.isWaiting && !isExpired && (
            <TxButton
              accountId={offer.sender}
              params={[offer.buyer]}
              isPrimary
              key='accept'
              label={t('Accept')}
              icon='check circle'
              tx='trading.accept'
            />
          )}
          <Button.Or />
          {offer.state.isWaiting &&(
            <TxButton
              accountId={offer.sender}
              params={[offer.buyer]}
              isPrimary
              key='reject'
              label={t('Reject')}
              icon='times circle'
              tx='trading.reject'
            />
          )}
          <Button.Or />
          {(offer.state.isReject || offer.state.isAccept || isExpired) && (
            <TxButton
              accountId={offer.sender}
              params={[offer.buyer]}
              isPrimary
              key='remove'
              label={t('Remove')}
              icon='trash alternate'
              tx='trading.remove'
            />
          )}
        </Button.Group>
      </td>

    </tr>
  );
}