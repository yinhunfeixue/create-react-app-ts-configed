import React, { useEffect, useMemo, useState } from 'react';
import { ContentLayout, Wrap, SectionTitle, LzTable } from 'cps';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import style from './index.lees';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { Tooltip } from 'antd';
import StatusLabel from '@/component/statusLabel/StatusLabel';

import { queryCollectionDetail, TcollectionDetail, queryCollectionTaskReport } from '../../Service';

const mapStatus = {
  0: '失败',
  1: '成功',
}

const icon = {
  0: <StatusLabel type="error" message='失败' />,
  1: <StatusLabel type="success" message='成功' />,
}

export default function (props: React.PropsWithChildren<{ addTab: any }>) {

  const params = useParams();
  const navigate = useNavigate();

  const [detail, setDetail] = useState<TcollectionDetail>({} as TcollectionDetail);

  const columns = useMemo(() => (
    [
      {title: '报表名称', dataIndex: 'menuName'},
      {title: '路径', dataIndex: 'menuPath'},
      { title: '状态', dataIndex: 'collectStatus', width: 400,
        render: (text: any, record: any) => {
          return (
            <span className={style.status}>
              {icon[text]}
              {
                record.failReason && (
                  <Tooltip title={record.failReason}>
                    <span className={style.reason}>({record.failReason})</span>
                  </Tooltip>
                )
              }
            </span>
          )
        }
      },
      /* {title: '操作', dataIndex: '', render: (_: any, record: any) => <a href={`/reportNew/detail/${record.taskId}`} target="_blank">详情</a>} */
    ]
  ), [])

  useEffect(() => {
    if(params.id) {
      queryCollectionDetail({taskId: params.id}).then(res => {
        setDetail(res.data);
      })
    }
  }, [params.id])

  return (
    <ContentLayout
      title={detail.taskNumber}
      back
      init
      footer
    >
      <Wrap marginBottom={16}>
        <SectionTitle title="基本信息" style={{ marginBottom: 20 }} />
        <div className={style.list}>所属系统<span>{detail.systemName}</span></div>
        <div className={style.list}>采集时间<span>{moment(detail.updateTime).format('YYYY-MM-DD HH:mm')}</span></div>
      </Wrap>
      <Wrap>
        <SectionTitle title="报表详情" style={{ marginBottom: 16 }} />
        <LzTable
          columns={columns}
          request={async (param = {}) => {
            const res = await queryCollectionTaskReport({
              reportName: param.reportName,
              status: param.status,
              page: param.current,
              pageSize: param.pageSize || 10,
              taskId: params.id
            });
            return {
              data: (res.data || {}).list || [],
              total: (res.data || {}).total || 0,
            }
          }}
          searchDataSource={[
            {
              type: 'inputSearch',
              name: 'reportName',
              placeholder: '报表名称',
              width: 280,
            }, {
              type: 'select',
              name: 'status',
              placeholder: '状态',
              selectOption: [
                {label: '失败', value: '0'},
                {label: '成功', value: '1'}
              ],
              width: 180
            }
          ]}
        />
      </Wrap>
    </ContentLayout>
  )
}
