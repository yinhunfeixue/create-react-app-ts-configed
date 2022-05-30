import IComponentProps from '@/base/interfaces/IComponentProps';
import DOPService from '@/services/DOPService';
import AntdUtil from '@/utils/AntdUtil';
import { Button, Form, Radio } from 'antd';
import React, { Component } from 'react';

interface ISynonymInferenceReasoningState {
  dataSource: any[];
  loading: boolean;
}
interface ISynonymInferenceReasoningProps extends IComponentProps {}

/**
 * SynonymInferenceReasoning
 */
class SynonymInferenceReasoning extends Component<
  ISynonymInferenceReasoningProps,
  ISynonymInferenceReasoningState
> {
  constructor(props: ISynonymInferenceReasoningProps) {
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
            label: '推理类型',
            content: (
              <Radio.Group
                options={[
                  {
                    value: 1,
                    label: '全面推理（同义簇、名称、标准）',
                  },
                  {
                    value: 2,
                    label: '仅推理同义簇名称',
                  },
                  {
                    value: 3,
                    label: '仅推理同义簇标准',
                  },
                ]}
              />
            ),
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

export default SynonymInferenceReasoning;
