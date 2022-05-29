import IPageProps from '@/base/interfaces/IPageProps';
import IndexSync from '@/components/IndexSync';
import IRouteItem from '@/config/IRouteItem';
import { GlobalOutlined } from '@ant-design/icons';
import { Card, Drawer, DrawerProps, PageHeader } from 'antd';
import TreeControl from 'fb-project-component/es/utils/TreeControl';
import React, { Component, ReactNode, ReactText } from 'react';
import styles from './BasicLayout.less';

interface IFunction {
  title: string;
  url?: string;
  component?: ReactNode;
}

interface IBasicLayoutState {
  openMenuKeys: ReactText[];
  selectedMenuKeys: ReactText[];
  columnsCount: number;
  selectedFunction?: IFunction;
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
    this.updateColumnCount();
    window.addEventListener('resize', this.windowResizeHandler);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.windowResizeHandler);
  }

  private windowResizeHandler = () => {
    this.updateColumnCount();
  };

  private updateColumnCount() {
    const { offsetWidth } = document.body;
    const columnsCount = Math.max(1, Math.floor(offsetWidth / 330));
    this.setState({ columnsCount });
  }

  private renderContent() {
    const { columnsCount } = this.state;
    const groups: { groupTitle: string; dataSource: IFunction[] }[] = [
      {
        groupTitle: '运维管理',
        dataSource: [
          {
            title: '索引同步',
            component: <IndexSync />,
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
            url: 'http://www.baidu.com',
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
                  const { title } = item;
                  return (
                    <div
                      className={styles.FunItem}
                      key={title}
                      onClick={() => this.setState({ selectedFunction: item })}
                    >
                      {title}
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

  private renderDrawer() {
    const { selectedFunction } = this.state;
    const visible = Boolean(selectedFunction);
    let props: DrawerProps = {};
    if (selectedFunction) {
      const { title } = selectedFunction;
      props = {
        title,
      };
    }
    return (
      <Drawer
        visible={visible}
        destroyOnClose
        width={400}
        onClose={() => {
          this.setState({ selectedFunction: undefined });
        }}
        {...props}
      >
        {selectedFunction ? selectedFunction.component : undefined}
      </Drawer>
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
        {this.renderDrawer()}
      </div>
    );
  }
}
export default BasicLayout;
