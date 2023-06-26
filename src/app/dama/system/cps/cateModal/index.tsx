import React, { useEffect } from 'react';
import { Modal, Form, Input, message } from 'antd';

import { createSystemCategory, querySystemList, editSystemCategory } from '../../Service';

export default function CateModal(props: React.PropsWithChildren<{
  id?: string|number,
  visible: boolean,
  onCancel: () => void,
  submitChange: (type: 'create'|'edit'|'delete') => void,
  data?: Record<string, any>
}>) {
  const { visible, onCancel, submitChange, data = {} } = props;

  const [form] = Form.useForm();

  const submit = async () => {
    form.validateFields().then(async (values) => {

      /* const values = form.getFieldsValue(); */

      if (data.id) values.id = data.id;
    
      const res = data.id ? await editSystemCategory(values) : await createSystemCategory(values);

      if (res.code === 200) {
        submitChange && submitChange('create');
        onCancel();
        form.resetFields();
        message.success(data.id ? '编辑成功' : '添加成功')
      } 
      })
  }

  useEffect(() => {
    if(data.id) {
      form.setFieldsValue(data)
    } else {
      form.resetFields();
    }
  }, [data.id, visible])

  return (
    <Modal
      title={`${data.id ? '编辑' : '添加'}分类`}
      visible={visible}
      onCancel={onCancel}
      onOk={submit}
      maskClosable={false}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item label="分类名称" name="name" rules={[{ required: true }]}>
          <Input placeholder="请输入" maxLength={32} showCount />
        </Form.Item>
        <Form.Item label="分类描述" name="desc">
          <Input.TextArea placeholder="请输入" maxLength={128} showCount/>
        </Form.Item>
      </Form>
    </Modal>
  )
}
