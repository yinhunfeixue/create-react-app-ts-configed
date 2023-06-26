import React from 'react';
import { Button, message } from 'antd';

import DOPService from '@/api/DOPService';

export default function () {

  const refresh = async () => {
    const res = await DOPService.initTask();
    console.log('res', res);
    if(res.code == 200) {
      message.success(res.msg || '操作成功');
    } 
  }

  return (
    <div>
      <Button type="primary" onClick={refresh}>初始化任务</Button>
    </div>
  )
}
