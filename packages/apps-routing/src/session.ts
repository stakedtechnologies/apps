// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import SessionKeyModal from '@polkadot/app-accounts/Accounts/modals/SessionKey';

export default function create (t: <T = string> (key: string, text: string, options: { ns: string }) => T): Route {
  return {
    Component: SessionKeyModal,
    Modal: SessionKeyModal,
    display: {
      isHidden: false,
      needsAccounts: true,
      needsApi: [
        'tx.session.setKeys' // current set_keys API
      ]
    },
    text: t<string>('nav.session', 'Session Key', { ns: 'apps-routing' }),
    icon: 'certificate',
    name: 'session'
  };
}
