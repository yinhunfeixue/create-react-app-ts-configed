import IComponentProps from '@/base/interfaces/IComponentProps';
import DraftDoc from '@/pages/component/DraftDoc';
import QuillDoc from '@/pages/component/QuillDoc';
import SlateDoc from '@/pages/component/slate/SlateDoc';
import SlateDoc2 from '@/pages/component/slateDoc/SlateDoc2';
import ElementWrap from '@/pages/component/slateDoc/component/ElementWrap';
import IDocController from '@/pages/component/slateDoc/interface/IDocController';
import IElement from '@/pages/component/slateDoc/interface/IElement';
import { Alert, Button, Card, Table } from 'antd';
import Axios from 'axios';
import React, { Component } from 'react';

interface IPage1State {}
interface IPage1Props extends IComponentProps {}

const defaultContent: IElement[] = [
  {
    type: 'h1',
    textAlign: 'center',
    children: [
      {
        text: '标题',
      },
    ],
  },
  {
    type: 'hr',
    children: [
      {
        text: '',
      },
    ],
  },
  {
    type: 'p',
    children: [
      {
        text: '正文春树暮云动态规划枯城 sga gasdg g gsdaf asgads f有东西地荆榛地一样大13234 34 35有6',
      },
    ],
  },
  {
    id: '12',
    type: 'antdTable',
    data: { title: '我是表格的标题' },
    children: [{ text: '' }],
  },
];

/**
 * Page1
 */
class Page1 extends Component<IPage1Props, IPage1State> {
  private docController!: IDocController;
  constructor(props: IPage1Props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    Axios.get('baiduApi?wd=create-react-app').catch((error) => {
    });
  }

  private insertTable() {
    this.docController.insertItem({
      id: 'tabl1',
      type: 'antdTable',
      data: {
        title: '我是表格携带的标题',
      },
    });
  }

  render() {
    return (
      <div>
        <Card title="slat2" style={{ marginBottom: 20 }}>
          <SlateDoc2
            initData={defaultContent}
            extraTools={
              <>
                <Button type="primary" onClick={() => this.insertTable()}>
                  插入表格
                </Button>
                <Button
                  onClick={() => {
                    console.log('save', this.docController.getValue());
                  }}
                >
                  导出
                </Button>
              </>
            }
            customElementRender={(props, controller) => {
              const { type, data, id } = props.element as IElement;
              this.docController = controller;
              switch (type) {
                case 'antdTable':
                  return (
                    <ElementWrap
                      onSettingClick={() => {
                        controller.updateItem(
                          (n) => {
                            return n.id === id;
                          },
                          { data: { title: 'aa' } }
                        );
                      }}
                      onDeleteClick={() => {
                        controller.removeItem((n) => {
                          return n.id === id;
                        });
                      }}
                    >
                      <Table title={() => <Alert message={data.title} />} />
                    </ElementWrap>
                  );
                default:
                  return;
              }
            }}
          />
        </Card>
        <Card title="slat">
          <SlateDoc />
        </Card>
        <Card title="draft">
          <DraftDoc />
        </Card>
        <Card title="quill">
          <QuillDoc />
        </Card>
      </div>
    );
  }
}

export default Page1;
