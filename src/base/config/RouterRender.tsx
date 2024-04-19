import ModelInit from '@/hooks/ModelInit';
import { ReactElement } from 'react';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import IRouteItem from './IRouteItem';
import routeConfig from './RouteConfig';

/**
 * 路由配置文件
 */
function RouterRender(props: any) {
  ModelInit();
  const renderRoutes = (data?: IRouteItem[]): ReactElement[] => {
    if (!data) {
      return [];
    }
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
      const createElement = (props: any) => {
        if (item.redirect) {
          return <Navigate key={index} to={item.redirect} />;
        }
        let ClassType: any = item.component;
        if (ClassType) {
          return <ClassType {...props}></ClassType>;
        }
        return null;
      };

      return (
        <Route key={item.path} path={item.path} element={createElement(props)}>
          {renderRoutes(item.children)}
        </Route>
      );
    });
    return result;
  };

  return (
    <HashRouter>
      <Routes>{renderRoutes(routeConfig)}</Routes>
    </HashRouter>
  );
}

export default RouterRender;
