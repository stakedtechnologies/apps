// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps as Props } from '@polkadot/react-components/types';
import { AccountId } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
// import { Route, Switch } from 'react-router';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Option } from '@polkadot/types';
import { HelpOverlay } from '@polkadot/react-components';
import Tabs from '@polkadot/react-components/Tabs';
import { useCall, useAccounts, useApi } from '@polkadot/react-hooks';

import basicMd from './md/basic.md';
// import Actions from './Actions';
import Overview from './Overview';
// import Summary from './Overview/Summary';
// import Targets from './Targets';
import { MAX_SESSIONS } from './constants';
import { useTranslation } from './translate';
import useSessionRewards from './useSessionRewards';

const EMPY_ACCOUNTS: string[] = [];
const EMPTY_ALL: [string[], string[]] = [EMPY_ACCOUNTS, EMPY_ACCOUNTS];

function transformStakedContracts ([contracts, operators]: [AccountId[], Option<AccountId>[]]): [string[], string[]] {
  console.log('transformStakedContracts', contracts, operators);
  return [
    contracts.map((accountId): string => accountId.toString()),
    operators
      .filter((optId): boolean => optId.isSome)
      .map((accountId): string => accountId.unwrap().toString())
  ];
}

function StakingApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const { pathname } = useLocation();
  const [next, setNext] = useState<string[]>([]);
  const [allContracts, allOperators] = (useCall<[string[], string[]]>(api.derive.plasmStaking.operators, [], {
    defaultValue: EMPTY_ALL,
    transform: transformStakedContracts
  }) as [string[], string[]]);
  const [stakedContracts, stakedOperators] = (useCall<[string[], string[]]>(api.derive.plasmStaking.stakedOperators, [], {
    defaultValue: EMPTY_ALL,
    transform: transformStakedContracts
  }) as [string[], string[]]);
  const sessionRewards = useSessionRewards(MAX_SESSIONS);
  const hasQueries = hasAccounts && !!(api.query.imOnline?.authoredBlocks);
  
  // unique, all = all + staked
  const allContractIds: string[] = Array.from(allContracts.concat(stakedContracts).reduce((s, c) => s.add(c), new Set()))
  const allOperatorIds: string[] = Array.from(allOperators.concat(stakedOperators).reduce((s, c) => s.add(c), new Set()))

  console.log('allContracts:', allContracts);
  console.log('stakedContracts:', stakedContracts);

  useEffect((): void => {
    allContracts && setNext(allContracts);
  }, [allContracts]);

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
              text: t('Staking overview')
            },
            {
              name: 'returns',
              text: t('Returns')
            },
            {
              name: 'actions',
              text: t('Account actions')
            }
          ]}
        />
      </header>
      {/* <Summary
        isVisible={pathname === basePath}
        next={next}
        stakingOverview={stakingOverview}
      />
      <Switch>
        <Route path={`${basePath}/returns`}>
          <Targets sessionRewards={sessionRewards} />
        </Route>
      </Switch>
      <Actions
        allStashes={allStashes}
        isVisible={pathname === `${basePath}/actions`}
        recentlyOnline={recentlyOnline}
        next={next}
        stakingOverview={stakingOverview}
      /> */}
      <Overview
        hasQueries={hasQueries}
        isVisible={[basePath, `${basePath}/waiting`].includes(pathname)}
        next={next}
        allContracts={allContractIds}
        allOperators={allOperatorIds}
        electedContracts={stakedContracts}
        electedOperators={stakedOperators}
      />
    </main>
  );
}

export default styled(StakingApp)`
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
