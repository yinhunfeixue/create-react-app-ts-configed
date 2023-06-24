import ProxySetting from '@/base/ProxySetting';
import Model from '@/base/model/Model';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { useEffect } from 'react';
import './App.css';
import RouterRender from './base/config/RouterRender';

ProxySetting.init();
Model.init();

function App() {
  useEffect(() => {
    console.log('app 1');
  }, []);

  return (
    <ConfigProvider locale={zhCN}>
      <RouterRender />
    </ConfigProvider>
  );
}

export default App;
