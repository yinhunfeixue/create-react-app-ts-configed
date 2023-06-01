import Config from '@/Config';
import IPageProps from '@/base/interfaces/IPageProps';
import Model from '@/model/Model';
import KeyInputModal from '@/pages/KeyInputModal';
import Setting from '@/pages/component/Setting';
import KeyService from '@/services/KeyService';
import { Button, Card, Result, Table, message } from 'antd';
import { HtmlUtil } from 'fb-project-component';
import moment from 'moment';
import React, { Component } from 'react';

interface IListSate {
  visibleSetting: boolean;
  visibleKeyInput: boolean;
  dataSource: any[];

  error: boolean;
}

const URL = Config.SOCKET_SERVER;

let index = 0;

/**
 * List
 */
class List extends Component<IPageProps, IListSate> {
  private socket?: WebSocket;
  constructor(props: any) {
    super(props);
    this.state = {
      visibleSetting: false,
      visibleKeyInput: false,
      error: false,
      dataSource: [],
    };
  }

  componentDidMount() {
    this.init();
  }

  private init() {
    this.checkToken();
  }

  private async checkToken() {
    const maxDate = moment(`2023-06-11`);
    if (moment() > maxDate) {
      this.setState({ error: true });
    }
    const token = Model.token;
    if (!token) {
      this.setState({ visibleKeyInput: true });
    } else {
      await KeyService.getStatus(token)
        .then(() => {
          this.setState({ visibleSetting: true });
        })
        .catch(() => {
          this.setState({ visibleKeyInput: true });
        });
    }
  }

  private paramsChangeHandler(params: any) {
    if (this.socket) {
      this.socket.close();
    }
    this.socket = this.connect(params);
  }

  private connect(params: any) {
    const temp: WebSocket = new WebSocket(URL + `?key=${Model.token}`);
    temp.onopen = () => {
      const postData = {
        action: 'spy',
        ...params,
        keywords_list: params.keyword?.split(' '),
      };
      temp.send(JSON.stringify(postData));
    };
    temp.onmessage = (event) => {
      const { dataSource } = this.state;
      const { data } = event;
      const obj = JSON.parse(data);
      const { code, msg } = obj;
      if (code !== undefined) {
        if (code === 0) {
          message.success(msg);
        } else {
          message.error(msg);
        }
      } else {
        this.setState({
          dataSource: [{ ...obj, index: index++ }, ...dataSource].slice(0, 300),
        });
      }
    };

    return temp;
  }

  render() {
    const { visibleSetting, dataSource, visibleKeyInput, error } = this.state;
    if (error) {
      return <Result />;
    }
    return (
      <>
        <Card
          title="用户列表"
          extra={
            <Button
              type="primary"
              onClick={() => this.setState({ visibleSetting: true })}
            >
              修改配置
            </Button>
          }
        >
          <Table
            rowKey="index"
            dataSource={dataSource}
            onRow={(record) => {
              return {
                onClick: () => {
                  HtmlUtil.copyText(record.display_id);
                  message.success(`已复制`);
                },
              };
            }}
            columns={[
              {
                title: '昵称',
                dataIndex: 'nickname',
                ellipsis: true,
              },
              {
                title: '用户行为',
                dataIndex: 'act',
                ellipsis: true,
              },
              {
                title: '时间',
                dataIndex: 'datetime',
                ellipsis: true,
              },
            ]}
            pagination={{
              pageSize: 20,
              size: 'small',
            }}
          />
        </Card>

        <Setting
          visible={visibleSetting}
          onCancel={() => this.setState({ visibleSetting: false })}
          onSave={(value) => {
            this.setState({ visibleSetting: false, dataSource: [] });
            this.paramsChangeHandler(value);
          }}
        />

        <KeyInputModal
          visible={visibleKeyInput}
          onSuccess={() => {
            this.setState({ visibleKeyInput: false });
            this.init();
          }}
        />
      </>
    );
  }
}

export default List;
