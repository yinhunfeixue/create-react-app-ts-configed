import ProxySetting from '@/base/ProxySetting';
import { ModelProvider } from '@/base/model/Model';
import { StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import './App.css';
import RouterRender from './base/config/RouterRender';

ProxySetting.init();

function App() {
  return (
    <ModelProvider>
      <StyleProvider hashPriority="low">
        <ConfigProvider locale={zhCN}>
          <RouterRender />
        </ConfigProvider>
      </StyleProvider>
    </ModelProvider>
  );
}

export default App;
