import async from '@/base/components/Async';
import IRouteItem from './IRouteItem';

const layout: string = '';

const tabLayout = async(() => import('@/layout/TabLayout'));
const basicLayout = async(() => import('@/layout/BasicLayout'));

const routeConfig: IRouteItem[] = [
  {
    name: '登录',
    path: '/Login',
    component: async(() => import('@/pages/Login')),
    hideInMenu: true,
  },
  {
    name: '主页',
    path: '/',
    component: layout === 'tab' ? tabLayout : basicLayout,
    children: [
      {
        path: '/',
        redirect: '/List',
      },
      {
        name: '用户列表',
        path: '/List',
        component: async(() => import('@/pages/List')),
      },
    ],
  },
];

export const MENU_LIST: IRouteItem[] = routeConfig[1].children || [];

export default routeConfig;
