// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-api/types';
import { BlockNumber } from '@polkadot/types/interfaces';

import React from 'react';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

interface Props extends BareProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
  later: number;
}

export default function EstimateBlockNumber ({ later, children, className, label, style }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const expectedBlockTime = api.consts.babe.expectedBlockTime.toNumber();
  const currentBlockNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []);
  const estimatedNumber = (currentBlockNumber? currentBlockNumber.toNumber() : 0) + later / expectedBlockTime;
  return (
    <div
      className={className}
      style={style}
    >
      {label || ''}{
        estimatedNumber
          ? formatNumber(estimatedNumber)
          : '-'
      }{children}
    </div>
  );
}
