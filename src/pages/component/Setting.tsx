import IComponentProps from '@/base/interfaces/IComponentProps';
import { Button, Checkbox, Drawer, Form, Input, InputNumber } from 'antd';
import { FormInstance } from 'antd/es/form/Form';
import FormItem from 'antd/es/form/FormItem';
import { Component, default as React } from 'react';

interface ISettingState {}
interface ISettingProps extends IComponentProps {
  visible: boolean;
  onSave: (data: any) => void;
  onCancel: () => void;
}

/**
 * Setting
 */
class Setting extends Component<ISettingProps, ISettingState> {
  private formRef = React.createRef<FormInstance>();

  private submit() {
    const { onSave } = this.props;
    if (this.formRef.current) {
      this.formRef.current.validateFields().then((values) => {
        onSave(values);
      });
    }
  }

  componentDidMount() {
    this.reset();
  }

  private reset() {
    const initData = {
      gender_list: [0, 1, 2],
      age: [1, 100],
      WebcastMemberMessage: true,
    };
    if (this.formRef.current) {
      this.formRef.current.setFieldsValue(initData);
    }
  }

  render() {
    const { visible, onCancel } = this.props;
    return (
      <Drawer
        onClose={onCancel}
        visible={visible}
        title="采集设置"
        extra={
          <Button type="primary" onClick={() => this.submit()}>
            确定
          </Button>
        }
        forceRender
      >
        <Form ref={this.formRef} layout="vertical">
          {[
            {
              label: '监听设置',
              content: (
                <div className="VGroup">
                  {[
                    {
                      label: '是否监听进入直播间消息',
                      name: 'WebcastMemberMessage',
                    },
                    {
                      label: '是否监听礼物消息',
                      name: 'WebcastGiftMessage',
                    },
                    {
                      label: '是否监听关注消息',
                      name: 'WebcastSocialMessage',
                    },
                    {
                      label: '是否监听点赞消息',
                      name: 'WebcastLikeMessage',
                    },
                    {
                      label: '是否监听弹幕消息',
                      name: 'WebcastChatMessage',
                    },
                  ].map((item, index) => {
                    return (
                      <FormItem
                        key={index}
                        noStyle
                        name={item.name}
                        valuePropName="checked"
                      >
                        <Checkbox style={{ marginLeft: 0 }}>
                          {item.label}
                        </Checkbox>
                      </FormItem>
                    );
                  })}
                </div>
              ),
            },
            {
              label: '性别',
              name: 'gender_list',
              content: (
                <Checkbox.Group
                  options={[
                    {
                      value: 1,
                      label: '男',
                    },
                    {
                      value: 2,
                      label: '女',
                    },
                    {
                      value: 0,
                      label: '未知',
                    },
                  ]}
                />
              ),
            },
            {
              label: '年龄',
              content: (
                <div className="HGroup">
                  <FormItem name="age_min" noStyle>
                    <InputNumber
                      placeholder="最小值"
                      step={1}
                      max={9999999}
                      min={0}
                    />
                  </FormItem>
                  -
                  <FormItem name="age_max" noStyle>
                    <InputNumber
                      placeholder="最大值"
                      step={1}
                      max={150}
                      min={0}
                    />
                  </FormItem>
                </div>
              ),
            },
            {
              label: '弹幕关键词（空格分隔）',
              name: 'keyword',
              content: <Input />,
            },
            {
              label: '礼物金额',
              content: (
                <div className="HGroup">
                  <FormItem name="gift_diamond_count_min" noStyle>
                    <InputNumber
                      placeholder="最小值"
                      step={0.01}
                      max={9999999}
                      min={0}
                    />
                  </FormItem>
                  -
                  <FormItem name="gift_diamond_count_max" noStyle>
                    <InputNumber
                      placeholder="最大值"
                      step={0.01}
                      max={9999999}
                      min={0}
                    />
                  </FormItem>
                </div>
              ),
            },
            {
              label: '粉丝数量',
              content: (
                <div className="HGroup">
                  <FormItem name="follower_fans_max" noStyle>
                    <InputNumber
                      placeholder="最小值"
                      step={1}
                      max={9999999}
                      min={0}
                    />
                  </FormItem>
                  -
                  <FormItem name="follower_fans_min" noStyle>
                    <InputNumber
                      placeholder="最大值"
                      step={1}
                      max={9999999}
                      min={0}
                    />
                  </FormItem>
                </div>
              ),
            },
            {
              label: '关注数量',
              content: (
                <div className="HGroup">
                  <FormItem name="following_fans_max" noStyle>
                    <InputNumber
                      placeholder="最小值"
                      step={1}
                      max={9999999}
                      min={0}
                    />
                  </FormItem>
                  -
                  <FormItem name="following_fans_min" noStyle>
                    <InputNumber
                      placeholder="最大值"
                      step={1}
                      max={9999999}
                      min={0}
                    />
                  </FormItem>
                </div>
              ),
            },
            {
              label: '直播间地址',
              name: 'user_url',
              content: <Input.TextArea />,
              rules: [
                {
                  required: true,
                },
              ],
            },
          ].map((item, index) => {
            return (
              <FormItem
                rules={item.rules}
                name={item.name}
                key={index}
                label={item.label}
              >
                {item.content}
              </FormItem>
            );
          })}
        </Form>
      </Drawer>
    );
  }
}

export default Setting;
