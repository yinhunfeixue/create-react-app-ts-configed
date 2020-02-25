import React, { Component, ReactElement } from 'react';
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom';
import IRouteItem from './IRouteItem';
import routeConfig from './RouteConfig';

/**
 * 路由配置文件
 */
class RouterRender extends Component<any, any> {
  renderRoutes(data: IRouteItem[]): ReactElement[] {
    //按是否有redirect排序，有redirect的在后面
    data.sort((a, b) => {
      if (a.redirect && !b.redirect) {
        return 1;
      } else if (!a.redirect && b.redirect) {
        return -1;
      }
      return 0;
    });
    let result: ReactElement[] = data.map((item, index) => {
      if (item.redirect) {
        return <Redirect key={index} to={item.redirect} exact />;
      }
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
            return <Switch>{children}</Switch>;
          }}
        />
      );
    });

    return result;
  }

  render() {
    return (
      <HashRouter>
        <Switch>{this.renderRoutes(routeConfig)}</Switch>
      </HashRouter>
    );
  }
}

export default RouterRender;
