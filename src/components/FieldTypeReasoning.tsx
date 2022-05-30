import IComponentProps from '@/base/interfaces/IComponentProps';
import DOPService from '@/services/DOPService';
import AntdUtil from '@/utils/AntdUtil';
import { Button, Form, Input } from 'antd';
import React, { Component } from 'react';

interface IFieldTypeReasoningState {
  dataSource: any[];
  loading: boolean;
}
interface IFieldTypeReasoningProps extends IComponentProps {}

/**
 * FieldTypeReasoning
 */
class FieldTypeReasoning extends Component<
  IFieldTypeReasoningProps,
  IFieldTypeReasoningState
> {
  constructor(props: IFieldTypeReasoningProps) {
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
            label: '请输入字段ID，逗号分隔',
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
              <Button type="primary" loading={loading}>
                开始推理
              </Button>
            ),
          },
        ])}
      </Form>
    );
  }
}

export default FieldTypeReasoning;
