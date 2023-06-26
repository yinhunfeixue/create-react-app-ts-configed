
import React, { ReactNode, useCallback, useState } from 'react';
import { Input, Select, Button, Space, Form, DatePicker, Cascader } from 'antd';

import styles from './index.lees';
import { useEffect } from 'react';

export interface TFormToolItem extends Record<string, any> {
  type: 'inputSearch' | 'select' | 'cascader' | 'date' | 'dateRange' | 'custom',
  placeholder?: string | [string, string],
  name?: string,
  selectOption?: { label: string, value: string }[],
  showTime?: boolean,
  width?: number,
  render?: () => ReactNode
}

export default function FormTool(props: React.PropsWithChildren<{
  dataSource: TFormToolItem[],
  reset?: boolean,
  onChange?: (value: Record<string, any>) => void,
  bottom?: number,
  getForm?: (form: any) => void,
  resetChange?: () => void,
}>) {

  const { dataSource = [], reset = true, onChange, bottom = 8, getForm, resetChange } = props;
  const [form] = Form.useForm();

  /* effect */
  useEffect(() => {
    // 将form传递出去
    getForm && getForm(form);
  }, [])

  /* 根据数据源生成视图 */

  /* change */
  const formChange = useCallback((params?: Record<string, any>) => {
    const values = form.getFieldsValue();
    console.log('values', values);
    let _values = { ...values };
    if(params) {
      _values = { ...values, ...params }
    }
    onChange && onChange(_values);
  }, [])

  const onReset = () => {
    console.log('reset');
    form.resetFields();
    if(resetChange) {
      resetChange && resetChange();
    } else {
      onChange && onChange({});
    }
  }

  return dataSource.length <= 0 ? null :
  (
    <Space style={{ marginBottom: bottom }} className={styles.wrap} >
      <Form
        layout="inline"
        form={form}
      >
        {
          dataSource.map((v, i) => {
            const { type, name, placeholder, width, render, ...params } = v;
            return (
              <Form.Item {...name ? {name} : {}} key={i}>
                {
                  type === 'custom' ?
                    render ? render() : null :
                  type === 'inputSearch' ? 
                    <Input.Search {...params} placeholder={v.placeholder as string} onSearch={(value) => { formChange({ [name]: value }) }} allowClear style={{ width }} /> :
                  
                  type === 'select' ?
                    <Select {...params} fieldNames={{}} placeholder={v.placeholder} onChange={formChange} style={{ width }} allowClear>
                      {
                        v.selectOption && v.selectOption.length >= 0 && (
                          v.selectOption.map((v, k) => <Select.Option key={k} value={v[params.fieldNames ? (params.fieldNames).value : 'value']}>
                            { v[ params.fieldNames ? (params.fieldNames || {}).label : 'label'] }
                            </Select.Option>)
                        )
                      }
                    </Select> :
                  
                  type === 'date' ?
                    <DatePicker {...params} placeholder={v.placeholder as string} onChange={formChange} style={{ width }} /> :
                  
                  type === 'dateRange' ?
                    <DatePicker.RangePicker {...params} placeholder={v.placeholder as [string, string]} onChange={formChange} style={{ width }} /> :
                  
                  type === 'cascader' ?
                    <Cascader  {...params} placeholder={v.placeholder as string} onChange={formChange} style={{ width }} /> :
                    null
                }
              </Form.Item>
            )
          })
        }
        {
          // 搜索项只有一个时不展示充值按钮
          reset && dataSource.length > 1 && <Form.Item><Button onClick={onReset}>重置</Button></Form.Item>
        }
      </Form>
    </Space>
  )
}

