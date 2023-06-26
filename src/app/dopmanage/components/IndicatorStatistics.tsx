import React from 'react';
import { Button, message } from 'antd';

import DOPService from '@/api/DOPService';

export default function () {

  const refresh = async () => {
    const res = await DOPService.indicatorStatistics();
    console.log('res', res);
    if(res.code == 200) {
      message.success(res.msg || '已刷新');
    } 
  }

  return (
    <div>
      <Button type="primary" onClick={refresh}>刷新</Button>
    </div>
  )
}
