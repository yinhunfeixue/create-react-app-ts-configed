import IPageProps from '@/base/interfaces/IPageProps';
import IRouteItem from '@/config/IRouteItem';
import { APP_NAME } from '@/config/ProjectConfig';
import { MENU_LIST } from '@/config/RouteConfig';
import LayoutUtil from '@/utils/LayoutUtil';
import PageUtil from '@/utils/PageUtil';
import { Button, Menu } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import TreeControl from 'fb-project-component/es/utils/TreeControl';
import { pathToRegexp } from 'path-to-regexp';
import { Component, ReactText } from 'react';
import styles from './BasicLayout.less';

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
    this.updateSelectedKeys();
  }

  componentDidUpdate(prevProps: IPageProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.updateSelectedKeys();
    }
  }

  private updateSelectedKeys() {
    const keys = this.getSelectedKeys();
    this.setState({
      openMenuKeys: keys,
      selectedMenuKeys: keys,
    });
  }

  private getSelectedKeys() {
    const currentPath = window.location.hash.substr(1);
    const chain = this.treeControl.searchChain(MENU_LIST, (node) => {
      const reg = pathToRegexp(node.path);
      if (reg.test(currentPath)) {
        return true;
      }
      return false;
    });
    return chain ? chain.map((item) => item.path) : [];
  }

  private createMenuItems(): ItemType[] {
    return LayoutUtil.createMenuItems(MENU_LIST);
  }

  render() {
    const { openMenuKeys, selectedMenuKeys } = this.state;
    return (
      <div className={styles.BasicLayout}>
        <div className={styles.Left}>
          <div className={styles.Logo}>{APP_NAME}</div>
          <Menu
            theme="dark"
            mode="inline"
            items={this.createMenuItems()}
            openKeys={openMenuKeys as string[]}
            selectedKeys={selectedMenuKeys as string[]}
            onOpenChange={(keys) => {
              this.setState({ openMenuKeys: keys });
            }}
            onSelect={(option) => {
              this.setState({ selectedMenuKeys: option.selectedKeys || [] });
            }}
          />
        </div>
        <div className={styles.Right}>
          <header>
            header
            <Button
              onClick={() => {
                PageUtil.openLoginPage(window.location.href);
              }}
            >
              退出
            </Button>
          </header>
          <main>{this.props.children}</main>
        </div>
      </div>
    );
  }
}
export default BasicLayout;
