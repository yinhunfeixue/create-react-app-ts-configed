import IComponentProps from '@/base/interfaces/IComponentProps';
import PageView1 from '@/pages/mobile/PageView1';
import UrlUtil from '@/utils/UrlUtil';
import { Button, Drawer, Input, Table, Tooltip } from 'antd';
import Axios from 'axios';
import { PageItem, PageManager } from 'h5-webview';
import { Component } from 'react';

interface IPage1State {
  visibleDrawer: boolean;
}
interface IPage1Props extends IComponentProps {}

/**
 * Page1
 */
class Page1 extends Component<IPage1Props, IPage1State> {
  constructor(props: IPage1Props) {
    super(props);
    this.state = {
      visibleDrawer: false,
    };
  }
  componentDidMount() {
    Axios.get('baiduApi?wd=create-react-app');
  }

  render() {
    const { visibleDrawer } = this.state;
    return (
      <div>
        Page1
        <Button
          onClick={() => {
            PageManager.openPage(new PageItem(PageView1, { index: 1 }));
          }}
        >
          打开新手机页面
        </Button>
        <Button
          onClick={() => {
            UrlUtil.toUrl(`/Page2/page21`, { x: 1 });
          }}
        >
          打开页面二一
        </Button>
        <Button onClick={() => this.setState({ visibleDrawer: true })}>
          打开drawer
        </Button>
        <Input.Search />
        <Table
          columns={[
            {
              title: 'en',
              dataIndex: 'en',
            },
            {
              title: 'zh',
              dataIndex: 'zh',
              render: (text: string) => {
                return <span>1{text}</span>;
              },
            },
            {
              title: 'tootip_zh',
              dataIndex: 'zh',
              render: (text: string) => {
                return <Tooltip title={text}>2{text}</Tooltip>;
              },
            },
          ]}
          dataSource={[
            {
              en: 'abcdde',
              zh: '我爱北京天安门',
            },
          ]}
        />
        {visibleDrawer && (
          <Drawer
            title="drawer"
            visible={visibleDrawer}
            closable
            onClose={() => {
              this.setState({ visibleDrawer: false });
            }}
          >
            aa
          </Drawer>
        )}
      </div>
    );
  }
}

export default Page1;
