// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import React, { useEffect, useState } from 'react';
import { Button, InputAddress, Input, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import translate from '../translate';

interface Props extends I18nProps {
  senderId?: string;
  onClose: () => void;
}

const EMPTY_PROOF = new Uint8Array();

function SetSessionKey ({ className, senderId: propSenderId, onClose, t }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic | null>(null);
  const [senderId, setSenderId] = useState<string | null>(propSenderId || null);
  const [keys, setKeys] = useState<string | null>(null);

  useEffect((): void => {
    if (keys) {
      setExtrinsic(api.tx.session.setKeys(keys, EMPTY_PROOF));
    }
  }, [keys]);

  return (
    <Modal
      className='session--SetSessionAccount'
      dimmer='inverted'
      open
      size='small'
    >
      <Modal.Header>
        {t('Set Session Key')}
      </Modal.Header>
      <Modal.Content className='ui--signer-Signer-Content'>
        <div className={className}>
          <InputAddress
            className='medium'
            defaultValue={senderId}
            label={t('account')}
            onChange={setSenderId}
          />
          <Input
            className='medium'
            help={t('Changing the key only takes effect at the start of the next session. The input here is generates from the author_rotateKeys command')}
            isError={!keys}
            label={t('Keys from rotateKeys')}
            onChange={setKeys}
          />
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={onClose}
            label={t('Cancel')}
            icon='cancel'
          />
          <Button.Or />
          <TxButton
            accountId={senderId}
            extrinsic={extrinsic}
            isDisabled={!keys}
            isPrimary
            label={t('Set Session Key')}
            icon='sign-in'
            onStart={onClose}
          />
        </Button.Group>
      </Modal.Actions>
    </Modal>
  );
}

export default translate(SetSessionKey);
