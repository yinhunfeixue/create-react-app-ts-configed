import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Radio, Form, Divider } from 'antd';

import DOPService from '@/api/DOPService';

export default function () {

  /* value */
  const ref = useRef<{ regexMatchData: Record<string, any>, autoLearningData: Record<string, any> }>({
    regexMatchData: {},
    autoLearningData: {},
  })

  /* state */

  const [form] = Form.useForm();

  useEffect(() => {
    DOPService.getClassificationConfig({ code: 'regexMatch' }).then(res => {
      form.setFieldValue('regexMatch', (res.data || {}).extra);
      ref.current.regexMatchData = res.data;
    })
    DOPService.getClassificationConfig({ code: 'autoLearning' }).then(res => {
      form.setFieldValue('autoLearning', (res.data || {}).extra);
      ref.current.autoLearningData = res.data;
    })
  }, [])

  const refresh = async () => {
    const res = await DOPService.classification();
    console.log('res', res);
    if(res.code == 200) {
      message.success(res.msg || '已刷新');
    } 
  }

  /* action */
  const fieldsChange = (changeFields: any, allFields: any) => {
    console.log(changeFields, allFields);
    const current = changeFields[0];
    DOPService.setClassificationConfig({
      ...(
        current.name[0] === 'regexMatch' ? ref.current.regexMatchData : ref.current.autoLearningData
      ),
      extra: current.value,
    }).then(res => {
      console.log('res', res);
      if(res.code == 200) {
        message.success('配置成功')
      } else {
        message.error(res.msg || '配置失败');
      }
    })
  }

  return (
    <div>
      <Button type="primary" onClick={refresh}>刷新</Button>
      <Divider/>
      <Form layout="vertical" title='配置' form={form} onFieldsChange={fieldsChange}>
        <Form.Item name="regexMatch" label="无抽样数据是否允许通过">
          <Radio.Group>
            <Radio value={'0'} >不允许</Radio>
            <Radio value={'1'}>允许</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="autoLearning" label="数据安全算法是否自主学习">
          <Radio.Group>
            <Radio value={'0'} >不允许</Radio>
            <Radio value={'1'}>允许</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </div>
  )
}
