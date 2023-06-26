import { readTrustDataSourceDetail } from '@/api/trustData';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Alert, Divider, message, Tooltip, Spin } from 'antd';
import classnames from 'classnames';
import { IconLink } from 'cps';
import React, { ReactNode, useEffect, useState } from 'react';
import style from './trustDetail.lees';

const SUCCESS = <svg viewBox="0 0 1024 1024" p-id="10890" width="18"><path d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m203.776 274.24L471.424 582.592l-131.2-131.2-72.448 72.32 203.648 203.712 316.8-316.8-72.448-72.384z" fill="#2AC75E" p-id="10891"></path></svg>;
const WARN = <svg viewBox="0 0 1024 1024" p-id="11040" width="18"><path d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m56 616h-112v112h112v-112z m0-448h-112v336h112v-336z" fill="#FF9900" p-id="11041"></path></svg>;
const ERROR = <svg viewBox="0 0 1024 1024" p-id="11190" width="18"><path d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m122.24 253.44L512 439.424 389.76 317.44 317.44 389.824l122.24 122.112-122.24 122.24 72.32 72.448L512 584.32l122.24 122.24 72.32-72.448L584.512 512l122.176-122.112-72.448-72.448z" fill="#FF4D4F" p-id="11191"></path></svg>;

const mapIcon = {
  /* 'success': <CheckCircleFilled style={{ color: '#2AC75E', fontSize: 18 }} />, */
  'success': <span className={style.iconStatus}>{SUCCESS}</span>,
  'warn': <span className={style.iconStatus}>{WARN}</span>,
  'error': <span className={style.iconStatus}>{ERROR}</span>,
  'warnLink':<span className={style.iconStatus}>{WARN}</span>,
}

const Right = <svg width="1em" height="1em" viewBox="0 0 1024 1024"><path fill="currentColor" d="M386.844444 170.666667l-45.511111 39.822222L597.333333 512 341.333333 813.511111l39.822223 39.822222L682.666667 512z"></path></svg>

const ContentItem: React.FC<{
  typeCode: 'dataQuality' | 'metadataQuality' | 'dataSecurity' | 'dataUsed',
  data: any[],
  tableId?: string,
  addTab: any
}> = props => {
  const { typeCode, tableId, addTab } = props;
  const linkToTableDetail = (tab: any) => {
    addTab('sysDetail', { id: tableId, tabValue: tab || '' }, true)
  }
  const cps1 = (
    <div className={style[typeCode]}>
      {
        (props.data || []).map((v, i) => (
          <div>
            <span>{v.subTypeName}：</span>
            <Tooltip title={v.context}><span className={classnames({ [style.empty]: !v.context })}>{v.context || '-'}</span></Tooltip>
          </div>
        ))
      }
    </div>
  )
  const cps2 = (
    <div className={style[typeCode]}>
      {
        (props.data || []).map((v, i) => {
          return v.context ? (
            <>
              {/* 关联报表数 */}
              {v.subTypeCode === 'dataUsedReport' && <div>该表关联了<a onClick={() => linkToTableDetail('associatedApps')}>{v.context}</a>张报表</div>}
              {/* 下游血缘表数 */}
              {v.subTypeCode === 'dataUsedLineage' && <div>该表关联了<a onClick={() => linkToTableDetail('graph')}>{v.context}</a>张血缘表</div>}
            </>
          ) : null
        })
      }
    </div>
  )
  return typeCode === 'dataUsed' ? cps2 : cps1;
}

const DetailItem: React.FC<{
  title: ReactNode,
  titleStatus?: 'warn' | 'error' | 'success' | 'none' | 'warnLink' | any,
  /* desc?: ReactNode, */
  desc?: any[],
  children?: ReactNode,
  typeCode?: 'dataQuality' | 'metadataQuality' | 'dataSecurity' | 'dataConfirm'
  linkTo?: (type: 'dataQuality' | 'metadataQuality' | 'dataSecurity' | 'dataConfirm', data: Record<string, any>) => void
  jumpParam?: any,
  tableId?: string
}> = props => (
  <div className={classnames(style.detailItem, { [style.first]: !props.titleStatus, [style[props.titleStatus]]: !!props.titleStatus })}>
    <div className={style.header}>
      {mapIcon[props.titleStatus]}
      <label>{props.title} {(props.typeCode == 'dataSecurity' && (props.titleStatus === 'warn' || props.titleStatus === 'warnLink') ) && <span className={style.advice}>建议</span>}</label>
    </div>
    {props.desc && props.desc.length > 0 && (
      <div className={style.descWrap}>
        {
          props.desc.map((v, i) => (
            <div className={style.desc}>
              {v}
            </div>
          ))
        }
        {
          props.typeCode === 'dataQuality' && props.titleStatus === 'error' && <a onClick={() => props.linkTo('dataQuality', props.jumpParam)}>去完善{Right}</a>
        }
        {
          props.typeCode === 'metadataQuality' && props.titleStatus === 'error' && <a onClick={() => props.linkTo('metadataQuality', props.jumpParam)}>去完善{Right}</a>
        }
        {
          props.typeCode === 'dataSecurity' && props.titleStatus === 'warnLink' && <a onClick={() => props.linkTo('dataSecurity', {... props.jumpParam, tableId: props.tableId})}>去确认{Right}</a>
        }
        {
          props.typeCode === 'dataConfirm' && props.titleStatus === 'error' && <a onClick={() => props.linkTo('dataConfirm', props.jumpParam)}>去完善{Right}</a>
        }
      </div>
    )}
    {props.children && (
      <div className={style.content}>
        {props.children}
      </div>
    )}
  </div>
)

export default function TrustDetail(props: {
  tableId: any,
  addTab: any,
  otherAlert?: boolean,
  updateKey?: number,
  getDetailData?: (data: any) => void,
  loading?: boolean,
}) {
  const { tableId, otherAlert, getDetailData, updateKey, loading = false } = props;

  /* state */
  const [list, setList] = useState<any[]>([]);
  const [detail, setDetail] = useState<Record<string, any>>({});

  const [error, setError] = useState<{ status?: boolean, msg?: string }>({});
  const [alertClose, setAlertClose] = useState(false);

  useEffect(() => {
    setError({ status: false });
    readTrustDataSourceDetail({ tableId }).then(res => {

      if(res.code !== 200) {
        setError({ status: true, msg: res.msg || '获取表信息异常' });
        message.error(res.msg || '获取表信息异常');
      }

      getDetailData && getDetailData(res.data);

      const _list = [...((res.data || {}).itemList || [])];
      // 提取描述到顶层
      _list.forEach(v => {
        let desc: any[] = [];
        if(Array.isArray(v.subItemList)) {
          v.subItemList.forEach((k: any) => { k.description && (desc.push(k.description)) })
        }
        v.desc = desc;
      })
      // 排序：这个排序没有顺序规律！！逻辑规律  未达标>建议>达标
      let filterList: any[] = [];
      const tmp1 = _list.filter(v => v.authResult == 2);
      const tmp2 = _list.filter(v => v.authResult == 3 || v.authResult == 5);
      const tmp3 = _list.filter(v => v.authResult == 1);
      filterList = filterList.concat(tmp1).concat(tmp2).concat(tmp3);
      (res.data || {}).error = tmp1.map(v => v.typeName);
      console.log('filterList', filterList);
      setList([...filterList]);
      setDetail(res.data || {});
    })
  }, [updateKey])

  const linkToTableDetail = (id: any, tab?: any) => {
    props.addTab('sysDetail', { id, tab: tab || '' }, true)
  }

  const linkToDetail = (type: 'dataQuality' | 'metadataQuality' | 'dataSecurity' | 'dataConfirm', data: any) => {
    const linkMap = {
      'metadataQuality': '数据字典-表详情',
      'dataQuality': '检核任务',
      'dataQuality2': '检核任务详情',
      'dataSecurity': '数据发现表详情',
      'dataConfirm': 'calssification',
    }
    if(type === 'dataQuality') {
      props.addTab(linkMap[ !data ? type : 'dataQuality2'], data || {}, true)
    } else if(type === 'dataConfirm') {
      const params = {
        tableName: data.tableNameEn,
        tableBelongClassify: data.systemClassId,
        tableBelongSystemId: data.systemId,
        dwLevel: data.dwLevel,
      }
      props.addTab(linkMap[type], params, true)
    } else {
      props.addTab(linkMap[type], data, true)
    }
  }

  const closeAlert = () => {
    setAlertClose(true);
  }

  return !error.status ? (
    <Spin spinning={loading}>
      {
        (detail.invalidSoon || otherAlert) && (
          <Alert
            type="error"
            icon={<ExclamationCircleFilled />}
            message={
              otherAlert ? <span>当前表在认证数据审核中有{(detail.error || []).length}项要求未达标，请根据审核结果进行完善，达标后该表将成为<span style={{ fontWeight: 500 }}> 可信数据</span></span> :
              `认证即将失效（${(detail.error || []).join('、')}未达标），请尽快完善数据信息`
            }
            showIcon
            closable
            banner
            onClose={closeAlert}
          />
        )
      }
      <div className={style.wrap}>
        {/* {
          !alertClose && (detail.invalidSoon || otherAlert) && (
            <div style={{ height: otherAlert ? 58 : 38, width: 100 }}></div>
          )
        } */}
        <DetailItem
          title={<div>{detail.tableName}{detail.tableChnName && ` [${detail.tableChnName}]`}<IconLink onClick={() => linkToTableDetail(detail.tableId||'')} style={{ marginLeft: 10 }} /></div>}
          desc={[detail.tablePath]}
        />
        <Divider  />
        {
          (list).map((v: any, i: number) => (
            <DetailItem
              key={i}
              title={v.typeName}
              titleStatus={['success', 'error', 'warn', '', 'warnLink'][v.authResult-1]}
              desc={v.desc}
              typeCode={v.typeCode}
              linkTo={linkToDetail}
              jumpParam={v.jumpParam}
              tableId={tableId}
            >
              <ContentItem addTab={props.addTab} tableId={detail.tableId} data={v.subItemList || []} typeCode={v.typeCode} />
            </DetailItem>
          ))
        }
      </div>
    </Spin>
  ) : (
    <div>{error.msg}</div>
  )
}