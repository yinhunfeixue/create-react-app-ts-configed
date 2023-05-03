import IPageProps from '@/base/interfaces/IPageProps';
import Setting from '@/pages/component/Setting';
import { Button, Card, Table, message } from 'antd';
import { HtmlUtil } from 'fb-project-component';
import React, { Component } from 'react';

interface IListSate {
  visibleSetting: boolean;
  dataSource: any[];
}

const URL = `ws://1.117.70.104:8000/`;

let index = 0;

/**
 * List
 */
class List extends Component<IPageProps, IListSate> {
  private socket?: WebSocket;
  constructor(props: any) {
    super(props);
    this.state = {
      visibleSetting: true,
      dataSource: [],
    };
  }

  private paramsChangeHandler(params: any) {
    if (this.socket) {
      this.socket.close();
    }
    this.socket = this.connect(params);
  }

  private connect(params: any) {
    const temp: WebSocket = new WebSocket(URL + '/get_data?key=12344123414124');
    temp.onopen = () => {
      const postData = {
        action: 'spy',
        gender_list: params.gender,
        user_url: params.roomUrl,
        gift_diamond_count_max: params.giftMoneyMax,
        gift_diamond_count_min: params.giftMoneyMin,
        age_max: params.ageMax,
        age_min: params.ageMin,
        keywords_list: params.keyword?.split(' '),
        WebcastMemberMessage: true,
        WebcastGiftMessage: true,
        WebcastSocialMessage: true,
        WebcastLikeMessage: true,
        WebcastChatMessage: true,
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
    const { visibleSetting, dataSource } = this.state;
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
      </>
    );
  }
}

export default List;
