// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useState } from 'react';
import { Input, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import styled from 'styled-components';
import { Available } from '@polkadot/react-query';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  onClose: () => void;
  senderId?: string;
}

const EMPTY_PROOF = new Uint8Array();

function SetSessionKey ({ className, onClose, senderId: propSenderId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [keys, setKeys] = useState<string | null>(null);
  const [senderId, setSenderId] = useState<string | null>(propSenderId || null);
  const balance = <span className='label'>{t('balance')}</span>;

  return (
    <Modal
      className='app--accounts-Modal'
      header={t('Set Session Key')}
      size='small'
    >
      <Modal.Content>
        <div className={className}>
          <InputAddress
            defaultValue={senderId}
            help={t('The account you will set session keys.')}
            label={t('controller account')}
            labelExtra={
              <Available
                label={balance}
                params={senderId}
              />
            }
            onChange={setSenderId}
            type='account'
          />
          <Input
            autoFocus
            className='medium'
            help={t('Changing the key only takes effect at the start of the next session. The input here is generates from the author_rotateKeys command')}
            isError={!keys}
            label={t('Keys from rotateKeys')}
            onChange={setKeys}
          />
        </div>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={senderId}
          icon='paper-plane'
          isDisabled={!keys || !senderId}
          isPrimary
          label={t('Set Session Key')}
          onStart={onClose}
          params={[keys, EMPTY_PROOF]}
          tx='session.setKeys'
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(SetSessionKey)`
  .balance {
    margin-bottom: 0.5rem;
    text-align: right;
    padding-right: 1rem;

    .label {
      opacity: 0.7;
    }
  }

  label.with-help {
    flex-basis: 10rem;
  }
`);
