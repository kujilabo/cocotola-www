import React, { useState } from 'react';
import { Button, Modal } from 'semantic-ui-react';

type DangerModalProps = {
  triggerValue: string;
  content: string;
  standardValue: string;
  dangerValue: string;
  standardFunc: () => any;
  dangerFunc: () => any;
};

export const DangerModal: React.FC<DangerModalProps> = (
  props: DangerModalProps
) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Modal
        size="mini"
        trigger={<Button negative>{props.triggerValue}</Button>}
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
      >
        <Modal.Content>{props.content}</Modal.Content>
        <Modal.Actions>
          <Button
            negative
            onClick={() => {
              props.dangerFunc();
              setOpen(false);
            }}
          >
            {props.dangerValue}
          </Button>
          <Button
            positive
            onClick={() => {
              props.standardFunc();
              setOpen(false);
            }}
          >
            {props.standardValue}
          </Button>
        </Modal.Actions>
      </Modal>
    </div>
  );
};
