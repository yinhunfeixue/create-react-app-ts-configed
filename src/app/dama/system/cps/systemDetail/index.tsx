import { Button, Divider, Empty, message, Popconfirm, Space, Typography } from 'antd';
import { AppTree, IconLink, ListVertical, LzTable, SectionTitle } from 'cps';
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { queryLinkedDataSource, queryReport, querySystemDirectoryList, TdataSource, Treport, TsystemDetail, TsystemDirectory, unbindLinkedDataSource } from '../../Service';
import DataSource from '../dataSource';
import EMPTY from './empty.png';

import { CheckCircleFilled } from '@ant-design/icons';

import PermissionWrap from '@/component/PermissionWrap'
import { useNavigate } from 'react-router';
import style from './index.lees';

const Section: React.FC<{
  children: ReactNode
  title: string,
  titleBottom: number
  subTitle?: ReactNode,
  extra?: ReactNode
}> = props => {
  return (
    <div className={style.section}>
      <SectionTitle title={props.title} style={{marginBottom: props.titleBottom}} subTitle={props.subTitle} extra={props.extra} />
      {props.children}
    </div>
  )
}

const EmptyPage = (props: React.PropsWithChildren<{
  link: ReactNode,
}>) => {
  const { link } = props;
  return (
    <Empty className={style.emptyPage} image={EMPTY} imageStyle={{height: 52}} description={<span>暂无数据，请点击 {link}</span>}>
    </Empty>
  )
}

export default function SystemDetail(props: {
  detail: TsystemDetail,
  addTab?: (path: string, data: any, blank: boolean) => void
}) {
  /* value */
  const navigate = useNavigate();
  const state = useRef<{ props: Record<string, any>, detailId?: string }>({props: {}, detailId: ''});
  state.current = {
    props: props
  }
  const { detail } = props;

  /* state */
  const [dataSourceVisible, setDataSourceVisible] = useState(false);
  // 报表列表
  const [reportList, setReportList] = useState<Treport[]>([]);
  // 数据源列表
  const [dataSourceList, setDataSourceList] = useState<TdataSource[]>([]);
  // 系统目录
  const [systemDirectoryList, setSystemDirectoryList] = useState<TsystemDirectory[]>([]);
  const [updateDataSource, setUpdateDataSource] = useState<boolean>(false);

  const ref = React.useRef<{ reportRes: Record<string, any> }>({reportRes: {}});


  /* effect */
  useEffect(() => {
    if(!detail.id) return;
    // 报表
    if(detail.systemType === 1) {
      queryReport({ systemId: detail.id }).then(res => {
        setReportList((res.data || {}).list || []);
        ref.current.reportRes = res.data || {};
      })
    }
    // 系统目录
    querySystemDirectoryList({ systemId: detail.id }).then(res => {
      setSystemDirectoryList(res.data)
    })
  }, [detail.id])

  useEffect(() => {
    if(!detail.id) return;
    // 关联数据源
    queryLinkedDataSource({ sysId: detail.id }).then(res => {
      setDataSourceList(res.data)
    })
  }, [detail.id, updateDataSource])

  const unBind = async (record: any) => {
    const res = await unbindLinkedDataSource({ sysId: state.current.props.detail.id, dataSourceId: record.id });
    if(res.code === 200) {
      message.success('解绑成功');
      setUpdateDataSource(tag => !tag);
    } else {
      message.error(res.msg || '操作失败')
    }
  }

  const toDetail = (data: any) => {
    /* this.props.addTab('数据源详情', { ...record, type: 'look' }, false) */
    data.extra = JSON.stringify(data.extra);
    props.addTab && props.addTab('数据源详情', { ...data, type: 'look' }, true);
  }

  const toCollectList = (data: any) => {
    props.addTab && props.addTab('autoTask', { datasourceId: data.id, from: 'dataSourceManage' }, true)
  }

  const reportColumns = useMemo(() => ([
    {title: '报表名称', dataIndex: 'name'},
    {title: '分类路径', dataIndex: 'systemPath'},
  ]), [])

  const dataSourceColumns = useMemo(() => ([
    {title: '数据源', dataIndex: 'dsName', width: 200},
    {title: '数据库类型', dataIndex: 'product'},
    {title: '数据源负责人', dataIndex: 'manager'},
    {title: '数据源状态', dataIndex: 'validState', render: (text: any) => (<span><CheckCircleFilled style={{ color: ['#C4C8CC', '#29C45D'][text], marginRight: 10 }} /> {['未生效', '生效'][text]}</span>)},
    {title: '系统关系', dataIndex: 'relationType', render: (text: any) => ['', '关联', '直属'][text]},
    {title: '采集任务', dataIndex: 'taskTypeCount', render: (text: any, record: any) => <a onClick={() => { toCollectList(record) }}>{text}</a>},
    {
      title: '操作',
      dataIndex: '',
      fixed: 'right',
      width: 80,
      render: (_: any,record: Record<string, any>) => (
        <Space
          split={<Divider type="vertical" />}
        >
          <Typography.Link onClick={() => { toDetail(record) }} >详情</Typography.Link>
          {
            record.relationType != 2 && (
              <Popconfirm
                title="是否确认解除关联？"
                okText="确定"
                cancelText="取消"
                onConfirm={() => unBind(record)}
              >
                <Typography.Link>解绑</Typography.Link>
              </Popconfirm>
                )
          }
        </Space>
      )
    }
  ]), [])

  const dataSourceChange = () => {
    setUpdateDataSource(c => !c)
  }

  const renderTreeEmpty = (appIndex: number, parentId?: number) => {
    return (
      <div className={style.treeEmpty}>
        <p>暂无系统目录</p>
      </div>
    )
  }

  console.log('dataSourceList', dataSourceList);

  return (
    <div className={style.wrap}>
      <Section title="业务信息" titleBottom={16}>
        <div className={style.flex} style={{ marginBottom: 16 }}>
          {/* <ListVertical label="技术归属部门" value={detail.techniqueDepartmentName} />
          <ListVertical label="技术负责人" value={detail.techniqueManagerName}/> */}
          <ListVertical label="业务归属部门" value={detail.businessDepartmentName} />
          <ListVertical label="业务负责人" value={detail.businessMangerName} />
          <ListVertical label="其他业务使用方" value={detail.otherBusinessUsedNames} />
        </div>
        {/* <div className={style.flex}>
          <ListVertical label="其他业务使用方" value={detail.otherBusinessUsedNames} />
        </div> */}
      </Section>
      {
        detail.systemType == 1 && (
          <Section title="报表列表" titleBottom={25} extra={reportList.length > 0 ? <Button onClick={() => { navigate('/reportNew/collection') }} type="primary">采集列表</Button> : ''} >
            {
              reportList.length <= 0 ?
                <EmptyPage link={<a onClick={() => { navigate('/reportNew/collection') }}>采集报表</a>} /> :
                  <LzTable dataSource={reportList} columns={reportColumns} pagination={false} />
            }
            {
              ref.current.reportRes.total > 5 && (
                <p className={style.readMore}><a onClick={() => navigate(`/reportNew/directory/${detail.id}`)}>查看全部<IconLink style={{ marginLeft: 6 }} /></a></p>
              )
            }
          </Section>
        )
      }
      <Section title="关联数据源" titleBottom={20} extra={dataSourceList.length > 0 ? (<PermissionWrap funcCode='/md/compare/manage/delete/relation'>
                            <Button onClick={() => setDataSourceVisible(true)} type='primary'>
                                关联数据源
                            </Button>
                        </PermissionWrap>): ''}>
        {
          dataSourceList.length <= 0 ?
            <EmptyPage link={<a onClick={() => setDataSourceVisible(true)}>关联数据源</a>} /> :
              <LzTable scroll={{ y: 450 }} dataSource={dataSourceList} columns={dataSourceColumns} pagination={false} />
        }
      </Section>
      <Section title="系统目录" titleBottom={20} subTitle={systemDirectoryList.length > 0 ? <IconLink style={{ marginLeft: 6 }} onClick={() => {
        navigate({
          pathname:'/system/directory',
          search:`id=${detail.id}`
        })
      }} /> : null} >
        {
          systemDirectoryList.length <= 0 ?
            <EmptyPage link={<a onClick={() => navigate('/system/directory')}>目录管理</a>} /> :
              <AppTree
                width={'100%'}
                treeData={systemDirectoryList}
                renderTitle={(i) => `路径${i+1}`}
                renderNodeMore={(data) => (<div>描述：<span>{data.desc}</span></div>)}
                fieldNames={{ children: 'childList' }}
                footer={false}
                renderEmpty={renderTreeEmpty}
              />
        }
      </Section>
      <DataSource submitChange={dataSourceChange} sysId={detail.id} visible={dataSourceVisible} onCancel={() => setDataSourceVisible(false)} />
    </div>
  )
}