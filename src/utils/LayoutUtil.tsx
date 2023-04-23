import IRouteItem from '@/config/IRouteItem';
import UrlUtil from '@/utils/UrlUtil';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import React, { ReactNode } from 'react';

/**
 * LayoutUtil
 */
class LayoutUtil {
  static createMenuItems(
    data: IRouteItem[],
    renderTitle?: (item: IRouteItem) => ReactNode
  ): ItemType[] {
    const titleFun = (item: IRouteItem) => {
      if (renderTitle) {
        return renderTitle(item);
      }
      const href = item.href || item.path;
      return <a onClick={() => UrlUtil.toUrl(href)}>{item.name}</a>;
    };
    return data
      .filter((item) => {
        return !(item.hideInMenu || item.redirect);
      })
      .map((item) => {
        if (item.children && item.children.length) {
          return {
            key: item.path,
            label: item.name,
            icon: item.icon,
            children: this.createMenuItems(item.children, renderTitle),
          };
        } else {
          return {
            key: item.path,
            icon: item.icon,
            label: titleFun(item),
          };
        }
      });
  }
}
export default LayoutUtil;
