// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';

import React from 'react';
import CurrentList from './CurrentList';
import Summary from './Summary';

import { OfferOf } from '@plasm/utils';

interface Props extends BareProps {
  allOffers: OfferOf[];
}

export default function Overview ({ className, allOffers }: Props): React.ReactElement<Props> {
  return (
    <div className={`staking--Overview ${className}`}>
      <Summary />
      <CurrentList
        allOffers={allOffers}        
      />
    </div>
  );
}
