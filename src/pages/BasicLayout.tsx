import IRouteItem from '@/config/IRouteItem';
import routeConfig from '@/config/RouteConfig';
import { Menu } from '@/pages/node_modules/antd';
import MenuItem from '@/pages/node_modules/antd/lib/menu/MenuItem';
import SubMenu from '@/pages/node_modules/antd/lib/menu/SubMenu';
import React, { Component } from '@/pages/node_modules/react';
import UrlUtil from '@/pages/node_modules/Utils/UrlUtil';

const styles = require('./BasicLayout.less');

/**
 * 基础布局
 */
class BasicLayout extends Component {
  renderMenu(data: IRouteItem[]) {
    return data.map((item) => {
      if (item.hideInMenu) {
        return null;
      }
      if (item.children && item.children.length) {
        return <SubMenu key={item.path} title={item.name}>{this.renderMenu(item.children)}</SubMenu>
      }
      else {
        return <MenuItem key={item.path}><a onClick={() => UrlUtil.toUrl(item.href || item.path)}>{item.name}</a></MenuItem>
      }
    });
  }

  render() {
    return (
      <div className={styles.BasicLayout}>
        <div className={styles.Left}>
          <div className={styles.Logo}>LOGO</div>
          <Menu theme="dark" mode="inline">
            {
              this.renderMenu(routeConfig)
            }
          </Menu>
        </div>
        <div className={styles.Right}>
          <header>header</header>
          <main>
            {
              this.props.children
            }
          </main>
        </div>
      </div>
    );
  }
}

export default BasicLayout;