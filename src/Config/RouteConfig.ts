import async from 'Base/Components/Async';
import IRouteItem from './IRouteItem';
import Login from 'Pages/Login';

const routeConfig: IRouteItem[] = [
  {
    name: '登录',
    path: '/Login',
    component: Login,
  },
  {
    name: '主页',
    path: '/',
    component: async(() => import('Pages/BasicLayout')),
    children: [
      {
        name: '页面一',
        path: '/Page1',
        component: async(() => import('Pages/Page1')),
      },
      {
        name: '页面二',
        path: '/Page2',
        component: async(() => import('Pages/Page2')),
      },
    ],
  }
];


export default routeConfig;