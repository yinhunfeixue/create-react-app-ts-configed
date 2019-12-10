import { ReactElement } from '@/config/node_modules/react';

export default interface IRouteItem {
  /**
   * 菜单名称
   */
  name: string;
  /**
   * route路径
   */
  path: string;

  /**
   * route组件
   */
  component: ReactElement | Function;

  /**
   * 子结点列表
   */
  children?: IRouteItem[];

  /**
   * 是否在菜单中隐藏
   */
  hideInMenu?: Boolean;

  /**
   * 点击菜单跳转的路径，如果不设置，则使用path
   */
  href?: string;
}
