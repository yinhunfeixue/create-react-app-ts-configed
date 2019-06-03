import React, { Component, ReactElement } from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';

import IRouteItem from './IRouteItem';
import routeConfig from './RouteConfig';

/**
 * 路由配置文件
 */
class RouterConfig extends Component {
  renderRoutes(data: IRouteItem[]): ReactElement[] {
    let result: ReactElement[] = data.map((item) => {
      return <Route
        key={item.path}
        path={item.path}
        exact={!(item.children && item.children.length)}
        render={(props) => {
          let children = null;
          let Result: any = item.component;
          if (item.children) {
            children = this.renderRoutes(item.children);
          }
          return (
            <Result {...props}>
              <Switch>
                {children}
              </Switch>
            </Result>
          );
        }}
      />
    });

    return result;
  }

  render() {
    return (
      <div>
        <HashRouter>
          <Switch>
            {
              this.renderRoutes(routeConfig)
            }
          </Switch>
        </HashRouter>
      </div>
    );
  }
}

export default RouterConfig;