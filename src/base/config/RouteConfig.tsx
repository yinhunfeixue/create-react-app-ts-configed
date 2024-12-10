import async from '@/base/components/Async';
import { SnippetsOutlined } from '@ant-design/icons';
import IRouteItem from './IRouteItem';

const layout: string = '';

const tabLayout = async(() => import('@/base/layout/TabLayout'));
const basicLayout = async(() => import('@/base/layout/BasicLayout'));

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
        redirect: '/Page1',
      },
      {
        name: '页面一',
        path: '/Page1',
        component: async(() => import('@/pages/Page1')),
        icon: <SnippetsOutlined />,
      },
      {
        name: '页面二',
        path: '/Page2',
        component: async(() => import('@/pages/Page2')),
        children: [
          {
            name: '页面二一',
            path: '/Page2/page21',
            component: async(() => import('@/pages/Page21')),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    component: async(() => import('@/pages/Page404')),
  },
];

export const MENU_LIST: IRouteItem[] = routeConfig[1].children || [];

export default routeConfig;
