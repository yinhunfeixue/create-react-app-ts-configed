import React from 'react';
import style from './errorPage.lees';
import { Button } from 'antd';

import { CloseCircleFilled } from '@ant-design/icons';

export default function ErrorPage(props: React.PropsWithChildren<{
  name: string,
  onClick: () => void
}>) {
  const { name = '', onClick } = props;
  return (
    <div className={style.wrap}>
      <div className={style.icon}><CloseCircleFilled style={{ color: '#FF4D4F' }} /></div>
      <h3>认证失败</h3>
      <p>“{name}”认证失败，<br/>数据<span style={{ color: '#F54B45' }}>未被使用，</span>不符合可信数据条件</p>
      <Button type="primary" onClick={onClick}>继续添加</Button>
    </div>
  )
}