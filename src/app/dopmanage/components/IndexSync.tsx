import DOPService from '@/api/DOPService';
import IComponentProps from '@/base/interfaces/IComponentProps';
import RenderUtil from '@/utils/RenderUtil';
import { Button, Form, message, Select } from 'antd';
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
      loading: false,
    };
  }
  componentDidMount() {
    DOPService.requestSyncTypeList().then((data) => {
      this.setState({ dataSource: data });
    });
  }
  render() {
    const { loading, dataSource = [] } = this.state;
    return (
      <Form
        layout="vertical"
        onFinish={(values) => {
          this.setState({ loading: true });
          DOPService.runIndexSync(values.type)
            .then((msg) => {
              message.success(msg);
            })
            .finally(() => {
              this.setState({ loading: false });
            });
        }}
      >
        {RenderUtil.renderFormItems([
          {
            label: '类型',
            content: (
              <Select
                allowClear
                options={dataSource.map((item) => {
                  return {
                    value: item,
                    label: item,
                  };
                })}
              />
            ),
            name: 'type',
            rules: [
              {
                required: true,
                message: '请选择类型',
              },
            ],
          },
          {
            content: (
              <Button type="primary" loading={loading} htmlType="submit">
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
