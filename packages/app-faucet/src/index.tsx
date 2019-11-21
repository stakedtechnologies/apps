/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/faucet authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';

import React from 'react';
import { Trans } from 'react-i18next';
import { withApi, withMulti, api } from '@polkadot/react-api';
import { Button, Card, Columar, Column, InputAddress, TxButton, AddressInfo, Label } from '@polkadot/react-components';
import { TokenUnit } from '@polkadot/react-components/InputNumber';
import TxModal, { TxModalProps, TxModalState } from '@polkadot/react-components/TxModal';

import translate from './translate';
import { FaucetLog } from 'packages/plasm-utils/src';
import { Vec } from '@polkadot/types';
import { Moment } from '@polkadot/types/interfaces';

interface Props extends AppProps, ApiProps, I18nProps, TxModalProps {}
interface State extends TxModalState {
  accountId?: string;
  now?: Moment;
  logs?: FaucetLog[];
}

class App extends TxModal<Props, State> {
  constructor (props: Props) {
    super(props);

    this.defaultState = {
      ...this.defaultState,
    };
    this.state = this.defaultState;
  }

  public componentDidMount (): void {
    setInterval((): void => {
      this.fetchNow();
    }, 10000);
  }

  public render (): React.ReactNode {
    const { t } = this.props;
    const logs = this.state.logs ? this.state.logs.map((log: any) => {
      return (
        <Column>
        <Card>
          <Label label={t('amount')} />
          <div className='result'>{log.get('amount').toString()}</div>
          <Label label={t('time')} />
          <div className='result'>{log.get('time').toString()}</div>
        </Card></Column>);
    }): <></>;
    var waitingTime = BigInt(0);
    if (!!this.state.now && !!this.state.logs && this.state.logs.length) {
      const prTime = this.state.logs[this.state.logs.length - 1].get('time');
      if(prTime){
        waitingTime = (BigInt(1000 * 60 * 60 * 24) - BigInt(this.state.now.toString()) + BigInt(prTime.toString()));
      } 
    }
    var isValid = false;
    if( waitingTime <= 0 ) {
      waitingTime = BigInt(0);
      isValid = true;
    }
    return (
      <main>
        <header />
        <h1>
          <Trans> Faucet <em>{TokenUnit.abbr}</em> tokens</Trans>
        </h1>
        <hr />
        <InputAddress
            defaultValue={this.state.accountId}
            help={t('The account you want to claim to.')}
            label={t('faucet to account')}
            onChange={this.onChangeAccount}
            type='all'
        />
        <AddressInfo
          address={this.state.accountId}
          withBalance
          withExtended
        />
        <Button.Group>
          <TxButton
            accountId={this.state.accountId}
            icon='star'
            isDisabled={!isValid}
            isPrimary
            label={t('Claims')}
            onClick={this.toggleBusy(true)}
            onSuccess={this.onSuccess}
            onFailed={this.toggleBusy(false)}
            params={[]}
            tx='faucet.claims'
            ref={this.button}
          />
        </Button.Group>
        <hr />
        <h1><Trans>Faucet History</Trans></h1>
        <h2><Trans>Now: {this.state.now?this.state.now.toString():'0'}, waitingTime: {waitingTime.toString()}</Trans></h2>
        <Columar>
        {logs}
        </Columar>
      </main>
    );
  }

  protected isDisabled = (): boolean => {
    const { accountId } = this.state;

    return !accountId;
  }

  protected isUnsigned = (): boolean => true;

  protected submitLabel = (): React.ReactNode => this.props.t('Redeem');

  protected txMethod = (): string => 'faucet.claims';

  protected onChangeAccount = (accountId: string | null): void => {
    accountId?this.fetchClaims(accountId):false;
    this.fetchNow();
    this.setState((): Pick<State, never> => {
      return {
        accountId
      };
    });
  }

  protected fetchNow = (): void => {
    api.query.timestamp.now((now): void => {
      this.setState((): Pick<State, never> => {
        console.log('now',now)
        return {
          now
        };
      })
    })
  }

  protected fetchClaims = (accountId: string): void => {
    api.query.faucet
      .faucetHistory<Vec<FaucetLog>>(accountId)
      .then((logs: FaucetLog[]): void => {
        this.setState((): Pick<State, never> => {
          return {
            logs
          };
        })
    });
  }
}

export default withMulti(
  App,
  translate,
  withApi
);
