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
            <Route path="/" render={(props) => {
              let children = <Switch>
                <Route path='/page1' component={async(() => import('Pages/Page1'))} />
              </Switch>;
              let Result = async(() => import('Pages/BasicLayout'), children);
              return <Result {...props} />
            }}>
            </Route>
          </Switch>
        </HashRouter>
      </div>
    );
  }
}

export default RouterConfig;