import IPageProps from '@/base/interfaces/IPageProps';
import IRouteItem from '@/config/IRouteItem';
import { MENU_LIST } from '@/config/RouteConfig';
import UrlUtil from '@/utils/UrlUtil';
import { GlobalOutlined } from '@ant-design/icons';
import { Card, PageHeader } from 'antd';
import MenuItem from 'antd/lib/menu/MenuItem';
import SubMenu from 'antd/lib/menu/SubMenu';
import TreeControl from 'fb-project-component/es/utils/TreeControl';
import { pathToRegexp } from 'path-to-regexp';
import React, { Component, ReactText } from 'react';
import styles from './BasicLayout.less';

interface IBasicLayoutState {
  openMenuKeys: ReactText[];
  selectedMenuKeys: ReactText[];
  columnsCount: number;
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
      columnsCount: 4,
    };
  }

  componentDidMount() {
    this.updateSelectedKeys();
    this.updateColumnCount();
    window.addEventListener('resize', this.windowResizeHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.windowResizeHandler);
  }

  componentDidUpdate(prevProps: IPageProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.updateSelectedKeys();
    }
  }

  private windowResizeHandler = () => {
    this.updateColumnCount();
  };

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

  private renderMenu(data: IRouteItem[]) {
    return data.map((item) => {
      const href = item.href || item.path;
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
            <a onClick={() => UrlUtil.toUrl(href)}>{item.name}</a>
          </MenuItem>
        );
      }
    });
  }

  private updateColumnCount() {
    const { offsetWidth } = document.body;
    const columnsCount = Math.max(1, Math.floor(offsetWidth / 330));
    this.setState({ columnsCount });
  }

  private renderContent() {
    const { columnsCount } = this.state;
    const groups = [
      {
        groupTitle: '运维管理',
        dataSource: [
          {
            title: '索引同步',
          },
          {
            title: '治理过滤推理',
          },
          {
            title: '字段类型推理',
          },
          {
            title: '同义簇推理',
          },
        ],
      },
      {
        groupTitle: '工具组件',
        dataSource: [
          {
            title: 'Solr管理',
          },
          {
            title: 'ActiveMQ管理',
          },
        ],
      },
    ];

    return (
      <div>
        {groups.map((item) => {
          const { groupTitle, dataSource } = item;
          return (
            <Card className={styles.Group} key={groupTitle} title={groupTitle}>
              <div
                className={styles.FunGroup}
                style={{
                  gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
                }}
              >
                {dataSource.map((item) => {
                  return (
                    <div className={styles.FunItem} key={item.title}>
                      {item.title}
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    );
  }

  render() {
    return (
      <div className={styles.BasicLayout}>
        <PageHeader
          className={styles.Header}
          title="DOP运维管理"
          subTitle=""
          avatar={{
            icon: <GlobalOutlined />,
          }}
        />
        <main>{this.renderContent()}</main>
      </div>
    );
  }
}
export default BasicLayout;
