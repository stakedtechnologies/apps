// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import DappsStaking from '@polkadot/app-dapps-staking';

export default ([
  {
    Component: DappsStaking,
    display: {
      isHidden: false,
      needsApi: [
        [
          'tx.plasmStaking.bond' // substrate 2.x
        ]
      ]
    },
    i18n: {
      defaultValue: 'DappsStaking'
    },
    icon: 'certificate',
    name: 'dapps-staking'
  }
] as Routes);
