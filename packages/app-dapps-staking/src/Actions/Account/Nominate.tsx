// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AddressMulti, Button, InputAddress, Modal, TxButton } from '@polkadot/react-components';
import { useFavorites } from '@polkadot/react-hooks';

import { STORE_FAVS_BASE } from '../../constants';
import translate from '../../translate';

interface Props extends I18nProps {
  controllerId: string;
  nominees?: string[];
  onClose: () => void;
  allContracts?: string[];
  stashId: string;
}

const MAX_NOMINEES = 16;

function Nominate ({ className, controllerId, nominees, onClose, allContracts, stashId, t }: Props): React.ReactElement<Props> | null {
  const [favorites] = useFavorites(STORE_FAVS_BASE);
  const [contracts, setContracts] = useState<string[]>([]);
  const [selection, setSelection] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>([]);

  useEffect((): void => {
    if (!selection.length && nominees) {
      setSelection(nominees);
    }
  }, [selection, nominees]);

  useEffect((): void => {
    if (allContracts) {
      setContracts((allContracts || []).map((acc): string => acc.toString()));
    }
  }, [allContracts]);

  useEffect((): void => {
    const shortlist = [
      // ensure that the favorite is included in the list of stashes
      ...favorites.filter((acc): boolean => contracts.includes(acc)),
      // make sure the nominee is not in our favorites already
      ...(nominees || []).filter((acc): boolean => !favorites.includes(acc))
    ];
    const available: string[] = Array.from([
      ...shortlist,
      ...contracts.filter((acc): boolean => !shortlist.includes(acc))
    ].reduce((s, c) => s.add(c), new Set<string>()));

    setAvailable(available);
  }, [favorites, nominees, contracts]);

  return (
    <Modal
      className={`staking--Nominating ${className}`}
      header={t('Nominate Contracts')}
      open
    >
      <Modal.Content className='ui--signer-Signer-Content'>
        <InputAddress
          className='medium'
          defaultValue={controllerId}
          isDisabled
          label={t('controller account')}
        />
        <InputAddress
          className='medium'
          defaultValue={stashId}
          isDisabled
          label={t('stash account')}
        />
        <AddressMulti
          available={available}
          className='medium'
          help={t('Filter available candidates based on name, address or short account index.')}
          label={t('filter candidates')}
          maxCount={MAX_NOMINEES}
          onChange={setSelection}
          value={selection}
        />
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
            accountId={controllerId}
            isDisabled={!selection.length}
            isPrimary
            onClick={onClose}
            params={[selection]}
            label={t('Nominate')}
            icon='hand paper outline'
            tx='plasmStaking.nominateContracts'
          />
        </Button.Group>
      </Modal.Actions>
    </Modal>
  );
}

export default translate(
  styled(Nominate)`
    .shortlist {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;

      .candidate {
        border: 1px solid #eee;
        border-radius: 0.25rem;
        margin: 0.25rem;
        padding-bottom: 0.25rem;
        padding-right: 0.5rem;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          border-color: transparent;
          border-style: solid;
          border-radius: 0.25em;
          border-width: 0.25em;
        }

        &.isAye {
          background: #fff;
          border-color: #ccc;
        }

        &.member::after {
          border-color: green;
        }

        &.runnerup::after {
          border-color: steelblue;
        }

        .ui--AddressMini-icon {
          z-index: 1;
        }

        .candidate-right {
          text-align: right;
        }
      }
    }
  `
);
