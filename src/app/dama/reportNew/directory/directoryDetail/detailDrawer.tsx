import React from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Drawer, Form, Input, Radio, Select, Cascader, Row, Col, Space, Button } from 'antd';

import { Select as LocalSelect, DrawerWrap } from 'cps';


const sysList = [
  {id: 1, name: '报表系统'},
  {id: 2, name: '数据仓库'},
  {id: 3, name: '其他'}
]

export default function AddCate(
  props: React.PropsWithChildren<{
    visible: boolean,
    onClose: () => void
  }>
) {

  const { visible, onClose } = props;

  const [form] = Form.useForm();

  const submit = () => {}

  return (
    <DrawerWrap
      title="报表编辑"
      onClose={onClose} 
      visible={visible}
      onOk={submit}
    >
      <Form
        layout={"vertical"}
      >
        <Form.Item label="报表名称" name="" rules={[{ required: true }]} >
          <Input maxLength={16} showCount placeholder="请输入" disabled />
        </Form.Item>
        <Form.Item label="报表描述" name="" >
          <Input.TextArea placeholder="请输入" />
        </Form.Item>
        <Form.Item label="报表分类" name="">
          <Cascader placeholder='' />
        </Form.Item>
        <Form.Item label="报表等级" name="">
          <LocalSelect.LevelSelect/>
        </Form.Item>
        <Form.Item label="报表周期" name="">
        <LocalSelect.LevelSelect/>
        </Form.Item>
        <Form.Item label="技术归属方" name="tech" >
          <LocalSelect.DepartUser placeholder={['技术部门', '技术负责人']}/>
        </Form.Item>
        <Form.Item label="业务归属方" name="business" >
          <LocalSelect.DepartUser placeholder={['业务部门', '业务负责人']}/>
        </Form.Item>
      </Form>
    </DrawerWrap>
  )
}
