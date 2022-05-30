import IPageProps from '@/base/interfaces/IPageProps';
import FieldTypeReasoning from '@/components/FieldTypeReasoning';
import GoverningFilteringReasoning from '@/components/GoverningFilteringReasoning';
import IndexSync from '@/components/IndexSync';
import SynonymInferenceReasoning from '@/components/SynonymInferenceReasoning';
import IRouteItem from '@/config/IRouteItem';
import IFriendLink from '@/interfaces/IFriendLink';
import DOPService from '@/services/DOPService';
import { GlobalOutlined } from '@ant-design/icons';
import { Card, Drawer, DrawerProps, PageHeader } from 'antd';
import TreeControl from 'fb-project-component/es/utils/TreeControl';
import React, { Component, ReactNode, ReactText } from 'react';
import styles from './BasicLayout.less';

interface IFunction extends IFriendLink {
  component?: ReactNode;
}

interface IBasicLayoutState {
  openMenuKeys: ReactText[];
  selectedMenuKeys: ReactText[];
  columnsCount: number;
  selectedFunction?: IFunction;
  outSystemList?: IFriendLink[];
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
    this.requestOutSystemList();
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
    const { columnsCount, outSystemList } = this.state;

    const groups: {
      groupTitle: string;
      dataSource: (IFunction | IFriendLink)[];
    }[] = [
      {
        groupTitle: '运维管理',
        dataSource: [
          {
            name: '索引同步',
            component: <IndexSync />,
          },
          {
            name: '治理过滤推理',
            component: <GoverningFilteringReasoning />,
          },
          {
            name: '字段类型推理',
            component: <FieldTypeReasoning />,
          },
          {
            name: '同义簇推理',
            component: <SynonymInferenceReasoning />,
          },
        ],
      },
      {
        groupTitle: '工具组件',
        dataSource: outSystemList || [],
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
                  const { name } = item;
                  return (
                    <div
                      className={styles.FunItem}
                      key={name}
                      onClick={() => {
                        if (item.url) {
                          window.open(item.url);
                        } else {
                          this.setState({ selectedFunction: item });
                        }
                      }}
                    >
                      {name}
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

  private requestOutSystemList() {
    DOPService.requestOutSystemList().then((data) => {
      this.setState({ outSystemList: data });
    });
  }

  private renderDrawer() {
    const { selectedFunction } = this.state;
    const visible = Boolean(selectedFunction);
    let props: DrawerProps = {};
    if (selectedFunction) {
      const { name } = selectedFunction;
      props = {
        title: name,
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
