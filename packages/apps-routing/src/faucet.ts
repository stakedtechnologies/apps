// Copyright 2017-2019 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import Faucet from '@polkadot/app-faucet';

export default ([
  {
    Component: Faucet,
    display: {
      needsApi: [
        'query.faucet.claims'
      ]
    },
    i18n: {
      defaultValue: 'PLMs Faucet'
    },
    icon: 'star',
    name: 'faucet'
  }
] as Routes);
