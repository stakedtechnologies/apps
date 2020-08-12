// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import acala from './acala';
import centrifugeChain from './centrifuge-chain';
import dusty3 from './dusty3';
import testPara from './cumulus-test-parachain';
import encointerNodeNotee from './encointer-node-notee';
import encointerNodeTeeproxy from './encointer-node-teeproxy';
import kulupu from './kulupu';
import nodeTemplate from './node-template';
import plasm from './plasm';
import stablePoc from './stable-poc';

export default {
  acala,
  'centrifuge-chain': centrifugeChain,
  dusty3,
  'cumulus-test-parachain': testPara,
  'encointer-node': encointerNodeNotee,
  'encointer-node-notee': encointerNodeNotee,
  'encointer-node-teeproxy': encointerNodeTeeproxy,
  kulupu,
  'node-template': nodeTemplate,
  plasm,
  'stable-poc': stablePoc,
  stable_poc: stablePoc
};
