// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import acala from './acala';
import centrifugeChain from './centrifuge-chain';
import dusty3 from './dusty3';
import crab from './crab';
import darwiniaParachain from './darwinia-parachain';
import testPara from './cumulus-test-parachain';
import encointerNodeNotee from './encointer-node-notee';
import encointerNodeTeeproxy from './encointer-node-teeproxy';
import kilt from './kilt';
import kulupu from './kulupu';
import laminar from './laminar';
import nodeTemplate from './node-template';
import plasm from './plasm';
import nodle from './nodle';
import stablePoc from './stable-poc';
import subsocialNode from './subsocial';

export default {
  Crab: crab,
  acala,
  'centrifuge-chain': centrifugeChain,
  dusty3,
  'cumulus-test-parachain': testPara,
  'darwinia-parachain': darwiniaParachain,
  'encointer-node': encointerNodeNotee,
  'encointer-node-notee': encointerNodeNotee,
  'encointer-node-teeproxy': encointerNodeTeeproxy,
  kulupu,
  laminar,
  'mashnet-node': kilt,
  'node-template': nodeTemplate,
  'nodle-chain': nodle,
  plasm,
  'stable-poc': stablePoc,
  stable_poc: stablePoc,
  subsocial: subsocialNode
};
