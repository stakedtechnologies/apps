// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import Trading from '@polkadot/app-trading';

export default ([
  {
    Component: Trading,
    display: {
      isHidden: false,
      needsAccounts: true,
      needsApi: [
        'tx.trading.offer'
      ]
    },
    i18n: {
      defaultValue: 'Trading'
    },
    icon: 'gem',
    name: 'trading'
  }
] as Routes);
