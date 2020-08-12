// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import typesChain from './chain';
import typesSpec from './spec';

export function getChainTypes (specName: string, chainName: string): Record<string, string | Record<string, unknown>> {
  return {
    ...(typesChain[chainName as 'Arcadia Nodle Network'] || {}),
    ...(typesSpec[specName as 'dusty3'] || {})
  };
}

export {
  typesChain,
  typesSpec
};
