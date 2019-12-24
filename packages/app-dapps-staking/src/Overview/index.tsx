// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';

import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { BlockAuthorsContext } from '@polkadot/react-query';

import CurrentList from './CurrentList';
import { DerivedDappsStakingQuery } from '@polkadot/react-api/overrides/derive/types';

interface Props extends BareProps {
  hasQueries: boolean;
  isVisible: boolean;
  next: string[];
  allContracts: string[];
  allOperators: string[];
  electedContracts: string[];
  electedOperators: string[];
}

export default function Overview ({ hasQueries, isVisible, className, next, allContracts, allOperators, electedContracts, electedOperators }: Props): React.ReactElement<Props> {
  const { pathname } = useLocation();
  const { byAuthor, lastBlockAuthors } = useContext(BlockAuthorsContext);
  const isIntentions = pathname !== '/dapps-staking';

  return (
    <div className={`staking--Overview ${className} ${!isVisible && 'staking--hidden'}`}>
      <CurrentList
        authorsMap={byAuthor}
        hasQueries={hasQueries}
        isIntentions={isIntentions}
        isVisible={isVisible}
        lastAuthors={lastBlockAuthors}
        next={next}
        allContracts={allContracts}
        allOperators={allOperators}
        electedContracts={electedContracts}
        electedOperators={electedOperators}
      />
    </div>
  );
}
