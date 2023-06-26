import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Drawer, Form, Input, Radio, Upload, message, Space, Button } from 'antd';
import { Select as LocalSelect, DrawerWrap } from 'cps';

import { createSystem, querySystem, editSystem } from '../../Service';
import UploadImage from './Upload';

import UploadWrap from './UploadWrap';

const sysList = [
  {id: 1, name: '报表系统'},
  {id: 2, name: '数据仓库'},
  {id: 3, name: '其他'}
]

import style from './index.lees';

const randomImg = () => `/quantchiAPI/system-icon/${  Number((Math.random()*7).toFixed(0))*1 + 1}.png`

export default function AddCate(
  props: React.PropsWithChildren<{
    visible: boolean,
    onClose: () => void,
    data?: Record<string, any>,
    submitChange: (type: 'create'|'edit'|'delete') => void,
    submitType: 'create' | 'edit' | 'delete' | '',
  }>
) {

  const { visible, onClose, data = {}, submitChange, submitType } = props;
  const [imageUrl, setImageUrl] = useState(randomImg());
  const [otherDepartId, setOtherDepartId] = useState<string>('');
  
  const [form] = Form.useForm();

  useEffect(() => {
    if(submitType === 'edit') {
      querySystem({ sysId: data.id }).then(res => {
        const values = res.data;
        // 数据转换
        /* values.tech = [values.techniqueDepartment, values.techniqueManagerId]; */
        values.business = [values.businessDepartment, values.businessMangerId];
        values.otherBusiness = values.otherBusinessUsed ? (values.otherBusinessUsed || '').split(',').map(v => v || undefined) : undefined;
        
        if(values.icon) {
          setImageUrl(values.icon);
        } else {
          setImageUrl(randomImg())
        }

        console.log('values', values);
        setOtherDepartId(values.business[0]);
        form.setFieldsValue(values);
      })
    } else {
      form.resetFields();
    }
  }, [data.id, submitType, visible])

  useEffect(() => {
    if(!visible) {
      setImageUrl('');
      return;
    } else {
      if(submitType === 'create') {
        setImageUrl(randomImg());
      }
    }
  }, [visible])

  /* event */

  const submit = async () => {

    form.validateFields().then(async (value: any) => {
      const values = form.getFieldsValue();
      console.log('values', values, value);
      // 数据转换
      /* values.techniqueDepartment = (values.tech || [])[0];
      values.techniqueManagerId = (values.tech || [])[1]; */
      values.businessDepartment = (values.business || [])[0];
      values.businessMangerId = (values.business || [])[1];
      values.otherBusinessUsed = (values.otherBusiness || []).join(',');

      // 图片转换
      //values.icon = imageUrl;
      // 删除多余参数
      delete values.tech;
      delete values.business;
      delete values.otherBusiness;

      // 默认值处理
      values.systemType = values.systemType || 1;

      // 新增
      if(submitType === 'create') {
        values.sysCategoryId = data.id;
      }
      // 编辑
      if(submitType === 'edit') {
        values.id = data.id;
      }
      const res = submitType === 'edit' ? await editSystem(values) : await createSystem(values);
      if (res.code === 200) {
        message.success(submitType === 'edit' ? '编辑成功' : '添加成功');
        onClose();
        submitChange(submitType);
      } else {
        message.error(res.msg || '操作失败');
      }
    }).catch(err => {

    })

  }

  const uploadChange = (info: any) => {
    console.log('info', info);
    if (info.file.status === 'done') {
      setImageUrl((info.file.response || {}).url)
    }
  }

  const businessChange = (values: string[] = []) => {
    // 如果只是人员变化，不置空
    if (values[0] === otherDepartId) {
      return;
    }
    setOtherDepartId(values[0])
    form.setFieldsValue({ otherBusiness: undefined })
  }

  console.log('imageInfo', imageUrl);

  return (
    <DrawerWrap
      title={submitType === 'create' ? '添加系统' : '编辑系统'}
      onClose={onClose} 
      visible={visible}
      onOk={submit}
      destroyOnClose
      className={style.drawerWrap}
    >
      <Form
        form={form}
        layout={"vertical"}
      >
        <Form.Item label="系统图标（建议尺寸128*128px，JPG或PNG，最大 2M）" name="icon" >
          {/* <UploadImage
            listType="picture-card"
            showUploadList={false}
            maxCount={1}
            onChange={uploadChange}
          >
            {imageUrl ? <img src={imageUrl} style={{ width: '100%' }} /> : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </UploadImage> */}
          <UploadWrap />
        </Form.Item>
        <Form.Item label="系统名称" name="name" rules={[{ required: true }]} >
          <Input maxLength={16} showCount placeholder="请输入" />
        </Form.Item>
        <Form.Item label="系统描述" name="desc" >
          <Input.TextArea placeholder="请输入" maxLength={128} showCount />
        </Form.Item>
        <Form.Item label="系统类型" name="systemType">
          <Radio.Group disabled={submitType === 'edit'} defaultValue={1} >
            {
              sysList.map(v => <Radio key={v.id} value={v.id}>{v.name}</Radio>)
            }
          </Radio.Group>
        </Form.Item>
        {/* <Form.Item label="技术归属方" name="tech" >
          <LocalSelect.DepartUser placeholder={['技术部门', '技术负责人']} />
        </Form.Item> */}
        <Form.Item label="业务权威属主" name="business" >
          <LocalSelect.DepartUser onChange={businessChange} placeholder={['业务部门', '业务负责人']} />
        </Form.Item>
        <Form.Item label="其它业务使用方" name="otherBusiness" >
          <LocalSelect.DepartTreeSelect initEmpty placeholder='其它业务使用方' excludeId={otherDepartId} mode="tags" multiple />
        </Form.Item>
        <Form.Item label="系统供应商" name="systemSupplier" >
          <Input placeholder="请输入" maxLength={32} showCount />
        </Form.Item>
      </Form>
    </DrawerWrap>
  )
}
