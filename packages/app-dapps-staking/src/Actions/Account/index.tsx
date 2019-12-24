// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';
import { AccountId, Exposure, StakingLedger, ValidatorPrefs } from '@polkadot/types/interfaces';
import { Parameters } from '@plasm/utils';
import { DerivedDappsStakingAccount } from '@polkadot/react-api/overrides/derive/types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AddressInfo, AddressMini, AddressSmall, Button, Menu, Popup, TxButton } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';

import translate from '../../translate';
import BondExtra from './BondExtra';
import Nominate from './Nominate';
import SetControllerAccount from './SetControllerAccount';
import SetRewardDestination from './SetRewardDestination';
import Unbond from './Unbond';

interface Props extends I18nProps {
  allContracts?: string[];
  onUpdateType: (stashId: string, type: 'validator' | 'nominator' | 'started' | 'other') => void;
  stashId: string;
}

interface StakeState {
  controllerId: string | null;
  destination: number;
  isStashNominating: boolean;
  nominees?: string[];
  stakers?: Exposure;
  stakingLedger?: StakingLedger;
  contractParameters?: Parameters;
  validatorPrefs?: ValidatorPrefs;
}

function toIdString (id?: AccountId | null): string | null {
  return id
    ? id.toString()
    : null;
}

function getStakeState ({ stashId, controllerId, payee, ledger, nominations }: DerivedDappsStakingAccount): StakeState {
  const isStashNominating = !!nominations[0].targets;
  console.log('getStakeState:', stashId.toString(), controllerId?.toString())
  console.log('payee:', payee)
  console.log('ledger:', ledger)
  console.log('nominations', nominations[0])
  console.log('nominees:', nominations[0] ? nominations[0].targets.map(toIdString) as string[] : [])
  return {
    controllerId: toIdString(controllerId),
    destination: payee?.toNumber() || 0,
    isStashNominating,
    // we assume that all ids are non-null
    nominees: nominations[0] ? nominations[0].targets.map(toIdString) as string[] : [],
    stakingLedger: ledger,
  };
}

function Account ({ allContracts, className, onUpdateType, stashId, t }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const balancesAll = useCall<DerivedBalances>(api.derive.balances.all as any, [stashId]);
  const stakingAccount = useCall<DerivedDappsStakingAccount>(api.derive.plasmStaking.account as any, [stashId]);
  const [{ controllerId, destination, isStashNominating, nominees, contractParameters }, setStakeState] = useState<StakeState>({ controllerId: null, destination: 0, isStashNominating: false });
  const [isBondExtraOpen, toggleBondExtra] = useToggle();
  const [isNominateOpen, toggleNominate] = useToggle();
  const [isRewardDestinationOpen, toggleRewardDestination] = useToggle();
  const [isSetControllerOpen, toggleSetController] = useToggle();
  const [isSettingsOpen, toggleSettings] = useToggle();
  const [isUnbondOpen, toggleUnbond] = useToggle();
  
  console.log('stakingAccount', stakingAccount);

  useEffect((): void => {
    if (stakingAccount) {
      const state = getStakeState(stakingAccount);
      console.log('state',state)
      setStakeState(state);
      console.log('state',state)

      if (state.isStashNominating) {
        onUpdateType(stashId, 'nominator');
      } else {
        onUpdateType(stashId, 'other');
      }
    }
  }, [stakingAccount, stashId]);

  return (
    <tr className={className}>
      <td className='top'>
        <BondExtra
          controllerId={controllerId}
          isOpen={isBondExtraOpen}
          onClose={toggleBondExtra}
          stashId={stashId}
        />
        <Unbond
          controllerId={controllerId}
          isOpen={isUnbondOpen}
          onClose={toggleUnbond}
          stashId={stashId}
        />
        {isNominateOpen && controllerId && (
          <Nominate
            controllerId={controllerId}
            nominees={nominees}
            onClose={toggleNominate}
            allContracts={allContracts}
            stashId={stashId}
          />
        )}
        {isSetControllerOpen && (
          <SetControllerAccount
            defaultControllerId={controllerId}
            isValidating={false}
            onClose={toggleSetController}
            stashId={stashId}
          />
        )}
        {isRewardDestinationOpen && controllerId && (
          <SetRewardDestination
            controllerId={controllerId}
            defaultDestination={destination}
            onClose={toggleRewardDestination}
          />
        )}
        <AddressSmall value={stashId} />
      </td>
      <td className='top '>
        <AddressMini
          className='mini-nopad'
          label={t('controller')}
          value={controllerId}
        />
      </td>
      <td className='top'>
        <AddressInfo
          address={stashId}
          withBalance={{
            available: false,
            bonded: true,
            free: false,
            redeemable: true,
            unlocking: true
          }}
          withRewardDestination
        />
      </td>
      {
        <td>
          {isStashNominating && nominees && (
            <details>
              <summary>{t('Nominating ({{count}})', { replace: { count: nominees.length } })}</summary>
              {nominees.map((nomineeId, index): React.ReactNode => (
                <AddressMini
                  key={index}
                  value={nomineeId}
                  withBalance={false}
                  withBonded
                />
              ))}
            </details>
          )}
        </td>        
      }
      <td className='top number together'>
        <>
          {isStashNominating
            ? (
              <TxButton
                accountId={controllerId}
                isNegative
                label={t('Stop Nominating')}
                icon='stop'
                key='stop'
                tx='plasmStaking.chill'
              />
            )
            : (
              <Button.Group>
                <Button
                  isPrimary
                  key='unbond'
                  onClick={toggleUnbond}
                  label={t('Unbond')}
                  icon='unlock'
                />
                <Button.Or key='nominate.or' />
                <Button
                  isPrimary
                  key='nominate'
                  onClick={toggleNominate}
                  label={t('Nominate')}
                  icon='hand paper outline'
                />
              </Button.Group>
            )
          }
          <Popup
            key='settings'
            onClose={toggleSettings}
            open={isSettingsOpen}
            position='bottom right'
            trigger={
              <Button
                icon='setting'
                onClick={toggleSettings}
              />
            }
          >
            <Menu
              vertical
              text
              onClick={toggleSettings}
            >
              {balancesAll?.freeBalance.gtn(0) && (
                <Menu.Item
                  onClick={toggleBondExtra}
                >
                  {t('Bond more funds')}
                </Menu.Item>
              )}
              <Menu.Item onClick={toggleUnbond}>
                {t('Unbond funds')}
              </Menu.Item>
              <Menu.Item
                onClick={toggleSetController}
              >
                {t('Change controller account')}
              </Menu.Item>
              <Menu.Item onClick={toggleRewardDestination}>
                {t('Change reward destination')}
              </Menu.Item>
              {isStashNominating &&
                <Menu.Item onClick={toggleNominate}>
                  {t('Change nominee(s)')}
                </Menu.Item>
              }
            </Menu>
          </Popup>
        </>
      </td>
    </tr>
  );
}

export default translate(
  styled(Account)`
    .ui--Button-Group {
      display: inline-block;
      margin-right: 0.25rem;
      vertical-align: inherit;
    }

    .mini-nopad {
      padding: 0;
    }
  `
);
