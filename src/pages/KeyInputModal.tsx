import IComponentProps from '@/base/interfaces/IComponentProps';
import KeyService from '@/services/KeyService';
import { Input, Modal } from 'antd';
import React, { Component } from 'react';

interface IKeyInputModalState {
  key: string;
  loading: boolean;
}
interface IKeyInputModalProps extends IComponentProps {
  visible: boolean;
  onSuccess: () => void;
}

/**
 * KeyInputModal
 */
class KeyInputModal extends Component<
  IKeyInputModalProps,
  IKeyInputModalState
> {
  constructor(props: IKeyInputModalProps) {
    super(props);
    this.state = {
      key: '',
      loading: false,
    };
  }

  private submit() {
    const { key } = this.state;
    const { onSuccess } = this.props;

    this.setState({ loading: true });
    KeyService.activeKey(key)
      .then(() => {
        onSuccess();
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  render() {
    const { visible } = this.props;
    const { key, loading } = this.state;
    return (
      <Modal
        title="请输入Key"
        visible={visible}
        closable={false}
        cancelButtonProps={{ style: { display: 'none' } }}
        onOk={() => this.submit()}
        confirmLoading={loading}
      >
        <Input
          value={key}
          onChange={(event) => this.setState({ key: event.target.value })}
        />
      </Modal>
    );
  }
}

export default KeyInputModal;
