
import StatusLabel from '@/component/statusLabel/StatusLabel';
import { DownloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ContentLayout, Empty, LzTable } from 'cps';
import moment from 'moment';
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { queryCollectionTaskList } from '../Service';

import EMPTY from './empty.png';

import style from './index.lees';

const mapStatus = {
  0: '待采集',
  1: '采集中...',
  2: '采集成功',
  3: '采集部分成功',
  4: '采集失败'
}

const icon = {
  0: <StatusLabel type="minus" message='待采集' />,
  1: <StatusLabel type="info" message='采集中...' />,
  2: <StatusLabel type="success" message='采集成功' />,
  3: <StatusLabel type="success" message='采集部分成功' />,
  4: <StatusLabel type="error" message='采集失败' />
}



export default function Collection(props: React.PropsWithChildren<{

}>) {

  const navigate = useNavigate();

  const columns = useMemo(() => {
    return [
      { title: '任务名称', dataIndex: 'taskNumber' },
      { title: '采集时间', dataIndex: 'updateTime', render: (text: string) => moment(text).format('YYYY-MM-DD HH:mm:ss') },
      { title: '报表数量', dataIndex: 'finishRecordNum' },
      { title: '状态', dataIndex: 'collectResultStatus', width: 300,
        render: (text: any, record: any) => {
          return (
            <span className={style.status}>
              {icon[text]}
              {
                text ==2 || text == 3 && (
                  <span className={style.text}>
                    ({record.finishRecordNum}/{record.recordNum})
                  </span>
                )
              }
            </span>
          )
        }
      },
      { title: '操作', fixed:'right', width: 80, render: (record: any) => <a onClick={() => navigate(`/reportNew/collection/${record.id}`)}>详情</a> }
    ]
  }, []);

  return (
    <ContentLayout
      title="报表采集"
      footer
    >
      <LzTable
        rowKey={"id"}
        searchDataSource={[
          {
            type: "dateRange",
            placeholder: ['开始时间', '结束时间'],
            name: 'timeRange',
            width: 360,
          }, {
            type: 'select',
            placeholder: '状态',
            name: 'status',
            width: 180,
            selectOption: [
              {label: '待采集', value: '0'},
              /* {label: '采集中...', value: '1'}, */
              {label: '采集成功', value: '2'},
              {label: '采集部分成功', value: '3'},
              {label: '采集失败', value: '4'},
            ]
          }
        ]}
        columns={columns}
        request={async (params = {}) => {
          const res = await queryCollectionTaskList({
            status: params.status,
            startTime: (params.timeRange || [])[0] ? moment(params.timeRange[0]).format('YYYY-MM-DD') + ' 00:00:00' : '',
            endTime: (params.timeRange || [])[1] ? moment(params.timeRange[1]).format('YYYY-MM-DD') + ' 23:59:59' : '',
            page: params.current,
            page_size: params.pageSize
          });
          return {
            data: res.data.list,
            total: res.data.total,
          }
        }}
        pagination={{
          pageSize: 10,
        }}
        empty={
          <Empty
            height={460}
            image={EMPTY}
            desc="暂无采集信息，通过浏览器插件采集"
          ><Button type="primary"><DownloadOutlined /><a style={{ color: '#fff' }} href="/quantchiAPI/file/popup.zip" download="采集器">插件下载</a></Button></Empty>
        }
      />
    </ContentLayout>
  )
}
