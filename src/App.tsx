import React from 'react';
import './App.less';
import RouterRender from 'Config/RouterRender';

const App: React.FC = () => {
  return (
    <div className="App">
      <RouterRender />
    </div>
  );
}

export default App;
