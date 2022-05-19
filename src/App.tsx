import ProxySetting from '@/base/ProxySetting';
import Model from '@/model/Model';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import React from 'react';
import './App.less';
import RouterRender from './config/RouterRender';

ProxySetting.init();
Model.init();

const App: React.FC<any> = (props: any) => {
  return (
    <ConfigProvider locale={zhCN}>
      <RouterRender />
    </ConfigProvider>
  );
};

export default App;
