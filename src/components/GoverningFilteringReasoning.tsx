import IComponentProps from '@/base/interfaces/IComponentProps';
import DOPService from '@/services/DOPService';
import AntdUtil from '@/utils/AntdUtil';
import { Button, Form, Input, message } from 'antd';
import React, { Component } from 'react';

interface IGoverningFilteringReasoningState {
  loading: boolean;
}
interface IGoverningFilteringReasoningProps extends IComponentProps {}

/**
 * 治理过滤推理
 */
class GoverningFilteringReasoning extends Component<
  IGoverningFilteringReasoningProps,
  IGoverningFilteringReasoningState
> {
  constructor(props: IGoverningFilteringReasoningProps) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  render() {
    const { loading } = this.state;
    return (
      <Form
        layout="vertical"
        onFinish={(values) => {
          this.setState({ loading: true });
          DOPService.governingFilterReasoning(values.id)
            .then((msg) => {
              message.success(msg);
            })
            .finally(() => {
              this.setState({ loading: false });
            });
        }}
      >
        {AntdUtil.renderFormItems([
          {
            label: '数据源ID',
            content: <Input />,
            name: 'id',
            rules: [
              {
                required: true,
              },
            ],
          },
          {
            content: (
              <Button type="primary" loading={loading} htmlType="submit">
                开始推理
              </Button>
            ),
          },
        ])}
      </Form>
    );
  }
}

export default GoverningFilteringReasoning;
