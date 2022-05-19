import IPageProps from '@/base/interfaces/IPageProps';
import IMenu from '@/interfaces/IMenu';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import {
  AutoComplete,
  Avatar,
  Button,
  Card,
  Input,
  Spin,
  Tooltip,
  Tree,
} from 'antd';
import Lodash from 'lodash';
import React, { Component } from 'react';
import styles from './MenuEdit.less';

interface IMenuEditSate {
  dataSource: IMenu[];
  historyList: IMenu[][];
  historyIndex: number;
}

let tempId = 1;

/**
 * MenuEdit
 */
class MenuEdit extends Component<IPageProps, IMenuEditSate> {
  constructor(props: IPageProps) {
    super(props);
    this.state = {
      dataSource: [],
      historyList: [],
      historyIndex: 0,
    };
  }

  componentDidMount() {
    this.requestData();
  }

  private requestData() {
    const res: IMenu[] = [
      {
        code: '图标',
        title: '根结点',
        columnClass: 'root',
        id: 'root',
        children: [
          {
            id: 'p1',
            code: '/p1',
            title: '页面1',
            columnClass: 'a',
          },
        ],
      },
    ];
    this.setState(
      {
        dataSource: res,
      },
      () => {
        this.saveHistory();
      }
    );
  }

  private renderTreeNodeList(
    dataSource: IMenu[],
    level: number = 0,
    parent?: IMenu
  ) {
    return dataSource.map((item) => {
      return (
        <Tree.TreeNode
          key={item.id}
          title={this.renderMenuNode(item, level, parent)}
        >
          {item.children &&
            this.renderTreeNodeList(item.children, level + 1, item)}
        </Tree.TreeNode>
      );
    });
  }

  private renderMenuNode(item: IMenu, level: number, parent?: IMenu) {
    return (
      <div className={'HGroup ' + styles.ItemWrap}>
        <Avatar>{level + 1}</Avatar>
        <Tooltip title="图标">
          <Input
            value={item.columnClass}
            onChange={(event) => {
              item.columnClass = event.target.value;
              this.saveHistory();
            }}
            style={{ width: 70 }}
          />
        </Tooltip>
        <Tooltip title="名称">
          <Input
            value={item.title}
            onChange={(event) => {
              item.title = event.target.value;
              this.saveHistory();
            }}
            style={{ width: 140 }}
          />
        </Tooltip>
        <Tooltip title="路径">
          <Input
            value={item.code}
            onChange={(event) => {
              item.code = event.target.value;
              this.saveHistory();
            }}
            style={{ width: 400 }}
          />
        </Tooltip>
        <Tooltip title="类型">
          <AutoComplete
            value={item.type}
            onChange={(value) => {
              item.type = value;
              this.saveHistory();
            }}
            style={{ width: 100 }}
            options={[
              {
                value: 'button',
              },
              {
                value: 'menu',
              },
            ]}
          />
        </Tooltip>
        <Tooltip title="rwType（权限类型）">
          <AutoComplete
            value={item.rwType}
            onChange={(value) => {
              item.rwType = value;
              this.saveHistory();
            }}
            style={{ width: 100 }}
            options={[
              {
                label: '1-view',
                value: '1',
              },
              {
                label: '2-edit',
                value: '2',
              },
            ]}
          />
        </Tooltip>
        <Button
          icon={<PlusOutlined />}
          type="text"
          onClick={() => {
            if (!item.children) {
              item.children = [];
            }
            item.children.push({
              columnClass: '图标',
              title: '临时名称',
              code: '/临时路径',
              id: `temp${++tempId}`,
              type: level + 1 < 3 ? 'menu' : 'button',
            });
            this.saveHistory();
          }}
        />
        {parent && (
          <Button
            icon={<MinusCircleOutlined />}
            type="text"
            onClick={() => {
              if (parent.children) {
                const index = parent.children.indexOf(item);
                parent.children.splice(index, 1);
                this.saveHistory();
              }
            }}
          />
        )}
      </div>
    );
  }

  private saveHistory() {
    const { historyList, historyIndex, dataSource } = this.state;

    // 截取到当前步骤之前的数据
    let newHistory = historyList.slice(0, historyIndex + 1);
    if (historyList.length > 15) {
      newHistory = historyList.slice(historyList.length - 15);
    }

    // 添加当前数据
    const cloneData = Lodash.cloneDeep(dataSource);
    newHistory.push(cloneData);

    this.setState({
      historyList: newHistory,
      historyIndex: newHistory.length - 1,
    });
  }

  private goto(index: number) {
    const { historyList } = this.state;
    const useIndex = Math.max(0, Math.min(historyList.length - 1, index));

    const useData = Lodash.cloneDeep(historyList[useIndex]);
    this.setState({
      dataSource: useData,
      historyIndex: useIndex,
    });
  }

  private back() {
    const { historyIndex } = this.state;
    if (this.canBack()) {
      this.goto(historyIndex - 1);
    }
  }

  private next() {
    const { historyIndex } = this.state;
    if (this.canNext()) {
      this.goto(historyIndex + 1);
    }
  }

  private canBack() {
    const { historyList, historyIndex } = this.state;

    return historyList && historyList.length && historyIndex > 0;
  }

  private canNext() {
    const { historyList, historyIndex } = this.state;
    return (
      historyList && historyList.length && historyIndex < historyList.length - 1
    );
  }

  render() {
    const { dataSource } = this.state;
    const canBack = this.canBack();
    if (!dataSource || !dataSource.length) {
      return <Spin spinning />;
    }
    return (
      <Card
        className={styles.MenuEdit}
        title="菜单设置"
        extra={
          <div className="HGroup">
            <Button disabled={!canBack} onClick={() => this.back()}>
              回退
            </Button>
            <Button disabled={!this.canNext()} onClick={() => this.next()}>
              前进
            </Button>
            <Button type="primary">保存</Button>
            <Button danger>丢弃</Button>
          </div>
        }
      >
        <Tree defaultExpandAll>{this.renderTreeNodeList(dataSource)}</Tree>
      </Card>
    );
  }
}

export default MenuEdit;
