import IPageProps from '@/base/interfaces/IPageProps';
import IRouteItem from '@/config/IRouteItem';
import { APP_NAME } from '@/config/ProjectConfig';
import routeConfig, { MENU_LIST } from '@/config/RouteConfig';
import { Menu, Tabs } from 'antd';
import MenuItem from 'antd/lib/menu/MenuItem';
import SubMenu from 'antd/lib/menu/SubMenu';
import TreeControl from 'fb-project-component/es/utils/TreeControl';
import React, { Component, ReactElement, ReactNode, ReactText } from 'react';

const pathToRegexp = require('path-to-regexp');

const styles = require('./TabLayout.less');

interface ITabItem {
  path: string;
}

interface ITabLayoutState {
  openMenuKeys: ReactText[];
  selectedMenuKeys: ReactText[];
  tabs: ITabItem[];
}

/**
 * tab布局
 */
class TabLayout extends Component<IPageProps, ITabLayoutState> {
  private treeControl = new TreeControl<IRouteItem>();

  private tabCache = new Map<string, ReactNode>();

  constructor(props: IPageProps) {
    super(props);
    this.state = {
      openMenuKeys: [],
      selectedMenuKeys: [],
      tabs: this.readTabs(),
    };
  }

  componentDidMount() {
    const selectedKeys: string[] = this.readSelectedKeys();
    if (selectedKeys) {
      this.updateSelectedKeys(selectedKeys[selectedKeys.length - 1]);
    }
  }

  private writeTabs() {
    const { tabs } = this.state;
    localStorage.setItem('tabs', JSON.stringify(tabs));
  }

  private readTabs() {
    const str = localStorage.getItem('tabs');
    if (!str) {
      return [];
    }
    try {
      return JSON.parse(str);
    } catch {
      return [];
    }
  }

  private writeSelectedKeys() {
    const { selectedMenuKeys } = this.state;
    localStorage.setItem('selectedKeys', JSON.stringify(selectedMenuKeys));
  }

  private readSelectedKeys() {
    const str = localStorage.getItem('selectedKeys');
    if (!str) {
      return [];
    }
    try {
      return JSON.parse(str);
    } catch {
      return [];
    }
  }

  private updateSelectedKeys(path?: string) {
    const keys = this.getSelectedKeys(path);
    this.setState(
      {
        openMenuKeys: keys,
        selectedMenuKeys: keys,
      },
      () => {
        this.writeSelectedKeys();
      }
    );
  }

  private getSelectedKeys(path?: string) {
    if (!path) {
      return [];
    }
    const currentPath = path;
    const chain = this.treeControl.searchChain(MENU_LIST, (node) => {
      const reg = pathToRegexp.pathToRegexp(node.path);
      if (reg.test(currentPath)) {
        return true;
      }
      return false;
    });
    return chain ? chain.map((item) => item.path) : [];
  }

  private addTab(routeItem: IRouteItem) {
    const { tabs } = this.state;
    const path = routeItem.href || routeItem.path;
    if (!this.containsTab(path)) {
      const tabItem: ITabItem = {
        path,
      };
      tabs.push(tabItem);
    }

    this.switchTab(path);

    this.writeTabs();
  }

  private getRouteItemByPath(path: string) {
    return this.treeControl.search(routeConfig, (item) => {
      const reg = pathToRegexp.pathToRegexp(item.path);
      return reg.test(path);
    });
  }

  private getRouteComponentByPath(path: string) {
    if (this.tabCache.has(path)) {
      return this.tabCache.get(path);
    }
    const item = this.treeControl.search(routeConfig, (item) => {
      const reg = pathToRegexp.pathToRegexp(item.path);
      return reg.test(path);
    });

    if (item) {
      const match = pathToRegexp.match(item.path)(path);
      const result = React.createElement(item.component as any, {
        match,
      });
      this.tabCache.set(path, result);
      return result;
    }
    return undefined;
  }

  private switchTab(path?: string) {
    this.updateSelectedKeys(path);
  }

  private removeTab(path: string) {
    const { tabs } = this.state;
    const index = tabs.findIndex((item) => item.path === path);
    if (index >= 0) {
      tabs.splice(index, 1);
    }

    // 如果当前path是选中项，则进行选中项切换
    const selectedPath = this.selectedTab;

    if (selectedPath === path) {
      const selectedIndex = Math.min(index, tabs.length - 1);
      if (selectedIndex >= 0) {
        const selectPath = tabs[selectedIndex].path;
        this.switchTab(selectPath);
      } else {
        this.switchTab();
      }
    } else {
      this.forceUpdate();
    }

    this.writeTabs();
  }

  private containsTab(path: string) {
    const { tabs } = this.state;
    return tabs.find((item) => item.path === path) !== undefined;
  }

  private swapTab(key1: string, key2: string) {
    if (!key1 || !key2 || key1 === key2) {
      return;
    }
    const { tabs } = this.state;
    const index1 = tabs.findIndex((item) => item.path === key1);
    const index2 = tabs.findIndex((item) => item.path === key2);
    if (index1 >= 0 && index2 >= 0) {
      const temp = tabs[index1];
      tabs[index1] = tabs[index2];
      tabs[index2] = temp;
    }
    this.forceUpdate();
  }

  private get selectedTab() {
    const { selectedMenuKeys } = this.state;
    if (selectedMenuKeys && selectedMenuKeys.length) {
      return selectedMenuKeys[selectedMenuKeys.length - 1].toString();
    }
    return undefined;
  }

  private renderMenu(data: IRouteItem[]) {
    return data.map((item) => {
      if (item.hideInMenu || item.redirect) {
        return null;
      }
      if (item.children && item.children.length) {
        return (
          <SubMenu key={item.path} title={item.name} icon={item.icon}>
            {this.renderMenu(item.children)}
          </SubMenu>
        );
      } else {
        return (
          <MenuItem key={item.path} icon={item.icon}>
            <a onClick={() => this.addTab(item)}>{item.name}</a>
          </MenuItem>
        );
      }
    });
  }

  private renderHeader() {
    return <React.Fragment>header</React.Fragment>;
  }

  private renderBody() {
    const { tabs } = this.state;
    const activeKey = this.selectedTab;
    return (
      <Tabs
        activeKey={activeKey}
        onChange={(key) => {
          this.switchTab(key);
        }}
        hideAdd
        type="editable-card"
        onEdit={(key, action) => {
          if (action === 'remove') {
            this.removeTab(key as string);
          }
        }}
        renderTabBar={(props, DefaultTabBar) => {
          return (
            <DefaultTabBar {...props}>
              {(node: ReactElement) => {
                return (
                  <div
                    draggable
                    onDragOver={(event) => {
                      event.preventDefault();
                    }}
                    onDrop={(event) => {
                      if (node) {
                        const { key } = node;
                        const fromKey = event.dataTransfer.getData('path');
                        if (key && fromKey) {
                          this.swapTab(key.toString(), fromKey);
                        }
                      }
                    }}
                    onDragStart={(event) => {
                      if (node) {
                        const { key } = node;
                        if (key) {
                          event.dataTransfer.setData('path', key.toString());
                        }
                      }
                    }}
                  >
                    {node}
                  </div>
                );
              }}
            </DefaultTabBar>
          );
        }}
      >
        {tabs.map((item) => {
          const routeItem = this.getRouteItemByPath(item.path);
          const title = routeItem ? (
            <span>
              {routeItem.icon}
              {routeItem.name}
            </span>
          ) : (
            ''
          );
          return (
            <Tabs.TabPane key={item.path} tab={title} closable={true}>
              {this.getRouteComponentByPath(item.path)}
            </Tabs.TabPane>
          );
        })}
      </Tabs>
    );
  }

  render() {
    const { openMenuKeys, selectedMenuKeys } = this.state;

    return (
      <div className={styles.TabLayout}>
        <div className={styles.Left}>
          <div className={styles.Logo}>{APP_NAME}</div>
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
            {this.renderMenu(MENU_LIST)}
          </Menu>
        </div>
        <div className={styles.Right}>
          <header>{this.renderHeader()}</header>
          <main>{this.renderBody()}</main>
        </div>
      </div>
    );
  }
}

export default TabLayout;
