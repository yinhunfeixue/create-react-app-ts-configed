import async from '@/base/components/Async';
import Login from '@/pages/Login';
import { SnippetsOutlined } from '@ant-design/icons';
import React from 'react';
import IRouteItem from './IRouteItem';

const routeConfig: IRouteItem[] = [
  {
    name: '登录',
    path: '/Login',
    component: Login,
    hideInMenu: true,
  },
  {
    name: '主页',
    path: '/',
    component: async(() => import('@/pages/BasicLayout')),
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
            component: async(() => import('@/pages/Page2')),
          },
        ],
      },
    ],
  },
];

export const MENU_LIST: IRouteItem[] = routeConfig[1].children || [];

export default routeConfig;
