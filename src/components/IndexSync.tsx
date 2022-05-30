import IComponentProps from '@/base/interfaces/IComponentProps';
import DOPService from '@/services/DOPService';
import AntdUtil from '@/utils/AntdUtil';
import { Button, Form, Select } from 'antd';
import React, { Component } from 'react';

interface IIndexSyncState {
  dataSource: any[];
  loading: boolean;
}
interface IIndexSyncProps extends IComponentProps {}

/**
 * IndexSync
 */
class IndexSync extends Component<IIndexSyncProps, IIndexSyncState> {
  constructor(props: IIndexSyncProps) {
    super(props);
    this.state = {
      dataSource: [],
      loading: true,
    };
  }
  componentDidMount() {
    DOPService.requestSyncTypeList();
  }
  render() {
    const { loading } = this.state;
    return (
      <Form layout="vertical">
        {AntdUtil.renderFormItems([
          {
            label: '类型',
            content: <Select />,
            name: 'type',
            rules: [
              {
                required: true,
              },
            ],
          },
          {
            content: (
              <Button type="primary" loading={loading}>
                开始同步
              </Button>
            ),
          },
        ])}
      </Form>
    );
  }
}

export default IndexSync;
