import ProxySetting from '@/base/ProxySetting';
import Model from '@/Model/Model';
import RouterRender from 'config/RouterRender';
import React from 'react';
import './App.less';

ProxySetting.init();
Model.init();

const App: React.FC = () => {
  return (
    <div className="App">
      <RouterRender />
    </div>
  );
};

export default App;
