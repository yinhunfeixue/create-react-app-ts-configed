import DOPService from '@/api/DOPService';
import IComponentProps from '@/base/interfaces/IComponentProps';
import RenderUtil from '@/utils/RenderUtil';
import { Button, Form, message, Radio } from 'antd';
import React, { Component } from 'react';

interface ISynonymInferenceReasoningState {
  loading: boolean;
}
interface ISynonymInferenceReasoningProps extends IComponentProps {}

/**
 * 同义簇推理
 */
class SynonymInferenceReasoning extends Component<
  ISynonymInferenceReasoningProps,
  ISynonymInferenceReasoningState
> {
  constructor(props: ISynonymInferenceReasoningProps) {
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
          DOPService.synonymInferenceReasoning(values.type)
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
            label: '推理类型',
            content: (
              <Radio.Group
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
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

export default SynonymInferenceReasoning;
