import React, { Component, ReactElement } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import IRouteItem from './IRouteItem';
import routeConfig from './RouteConfig';

/**
 * 路由配置文件
 */
class RouterRender extends Component<any, any> {
  renderRoutes(data: IRouteItem[]): ReactElement[] {
    let result: ReactElement[] = data.map(item => {
      return (
        <Route
          key={item.path}
          path={item.path}
          exact={!(item.children && item.children.length)}
          render={props => {
            let children = null;
            let ClassType: any = item.component;
            if (item.children) {
              children = this.renderRoutes(item.children);
            }

            if (ClassType) {
              return (
                <ClassType {...props}>
                  <Switch>{children}</Switch>
                </ClassType>
              );
            }
            return (
              <React.Fragment>
                <Switch>{children}</Switch>
              </React.Fragment>
            );
          }}
        />
      );
    });

    return result;
  }

  render() {
    return (
      <React.Fragment>
        <HashRouter>
          <Switch>{this.renderRoutes(routeConfig)}</Switch>
        </HashRouter>
      </React.Fragment>
    );
  }
}

export default RouterRender;
