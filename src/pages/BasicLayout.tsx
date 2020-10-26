import IPageProps from '@/base/interfaces/IPageProps';
import IRouteItem from '@/config/IRouteItem';
import routeConfig from '@/config/RouteConfig';
import UrlUtil from '@/utils/UrlUtil';
import { Menu } from 'antd';
import MenuItem from 'antd/lib/menu/MenuItem';
import SubMenu from 'antd/lib/menu/SubMenu';
import { TreeControl } from 'fb-project-component';
import { pathToRegexp } from 'path-to-regexp';
import React, { Component, ReactText } from 'react';

const styles = require('./BasicLayout.less');

interface IBasicLayoutState {
  openMenuKeys: ReactText[];
  selectedMenuKeys: ReactText[];
}

/**
 * 基础布局
 */
class BasicLayout extends Component<IPageProps, IBasicLayoutState> {
  private treeControl = new TreeControl<IRouteItem>();

  constructor(props: IPageProps) {
    super(props);
    this.state = {
      openMenuKeys: [],
      selectedMenuKeys: [],
    };
  }

  componentDidMount() {
    const keys = this.getSelectedKeys();
    this.setState({ openMenuKeys: keys, selectedMenuKeys: keys });
  }

  private getSelectedKeys() {
    const currentPath = window.location.hash.substr(1);
    const chain = this.treeControl.searchChain(routeConfig, (node) => {
      const reg = pathToRegexp(node.path);
      if (reg.test(currentPath)) {
        return true;
      }
      return false;
    });
    return chain ? chain.map((item) => item.path) : [];
  }

  renderMenu(data: IRouteItem[]) {
    return data.map((item) => {
      const href = item.href || item.path;
      if (item.hideInMenu || item.redirect) {
        return null;
      }
      if (item.children && item.children.length) {
        return (
          <SubMenu key={item.path} title={item.name}>
            {this.renderMenu(item.children)}
          </SubMenu>
        );
      } else {
        return (
          <MenuItem key={item.path}>
            <a onClick={() => UrlUtil.toUrl(href)}>{item.name}</a>
          </MenuItem>
        );
      }
    });
  }

  render() {
    const { openMenuKeys, selectedMenuKeys } = this.state;

    return (
      <div className={styles.BasicLayout}>
        <div className={styles.Left}>
          <div className={styles.Logo}>LOGO</div>
          <Menu
            theme="dark"
            mode="inline"
            openKeys={openMenuKeys as string[]}
            selectedKeys={selectedMenuKeys as string[]}
            onOpenChange={(keys) => {
              this.setState({ openMenuKeys: keys });
            }}
            onSelect={(option) => {
              this.setState({ selectedMenuKeys: option.selectedKeys || [] });
            }}
          >
            {this.renderMenu(routeConfig)}
          </Menu>
        </div>
        <div className={styles.Right}>
          <header>header</header>
          <main>{this.props.children}</main>
        </div>
      </div>
    );
  }
}

export default BasicLayout;
