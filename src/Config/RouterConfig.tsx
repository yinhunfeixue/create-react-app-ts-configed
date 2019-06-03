import React, { Component } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import async from 'Base/Components/Async';

/**
 * 路由配置文件
 */
class RouterConfig extends Component {
  render() {
    return (
      <div>
        <HashRouter>
          <Switch>
            <Route path="/Login" exact component={async(() => import('Pages/Login'))} />
            <Route path="/" exact component={async(() => import('Pages/BasicLayout'))} />
          </Switch>
        </HashRouter>
      </div>
    );
  }
}

export default RouterConfig;