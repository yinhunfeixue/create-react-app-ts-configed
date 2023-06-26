import { deleteTableBlood, readBloodMapDetail, readBloodMapDetailRealy, readFieldMap, readTableBloodMapDatabase, rebuildBloodMap, verifyTableBlood } from '@/api/bloodMap';
import PageUtil from '@/utils/PageUtil';
import { Button, Checkbox, Divider, FormInstance, message, Modal, Space, Tabs, Typography } from 'antd';
import { ContentLayout, DrawerWrap, ListHorizontal, LzTable, SectionTitle, Wrap } from 'cps';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import style from './index.lees';

const REFRESH = <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10733" width="16"><path d="M193.6 480A320.512 320.512 0 0 0 512 832c118.4 0 221.44-64.64 276.8-160.32l-0.192 0.32H672v-64H896V832h-64v-108.416A383.168 383.168 0 0 1 512 896c-212.16 0-384-171.84-384-384 0-10.88 0.64-21.44 1.6-32z m158.4-128v64H128V192h64v108.352A383.104 383.104 0 0 1 512 128c212.16 0 384 171.84 384 384 0 10.56-0.64 21.12-1.6 31.68h-64A320.512 320.512 0 0 0 512 192a320.704 320.704 0 0 0-276.8 160H352z" fill="#4D73FF" p-id="10734"></path></svg>;

const TABLE = <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10764" width="16"><path fill='#2D3033' d="M96 160v704h832V160H96z m309.344 400.192v-160h192v160h-192z m192 64V800h-192v-175.808h192zM160 400.192h181.344v160H160v-160z m501.344 0H864v160h-202.656v-160zM864 224v112.192H160V224h704zM160 624.192h181.344V800H160v-175.808zM661.344 800v-175.808H864V800h-202.656z" p-id="10765"></path></svg>
const BASE = <svg  viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10918" width="16"><path d="M512 64c206.208 0 374.4 67.776 383.616 152.704L896 224v576c0 88.32-171.904 160-384 160s-384-71.68-384-160v-576C128 135.68 299.904 64 512 64z m0 608c-133.568 0-251.2-28.416-320-71.552V800c0 52.992 143.296 96 320 96s320-43.008 320-96l0.064-199.616C763.264 643.52 645.632 672 512 672z m320.064-359.616C763.264 355.52 645.632 384 512 384c-133.568 0-251.2-28.416-320-71.552L191.936 512H192c0 52.992 143.296 96 320 96s320-43.008 320-96h0.064V312.384zM512 128c-176.704 0-320 43.008-320 96h-0.064H192v0.64l0.448 4.48C201.28 279.68 340.992 320 512 320c176.768 0 320-43.008 320-96S688.832 128 512 128z" fill="#9EA3A8" p-id="10919"></path></svg>

export default function () {

  /* value */
  const params = useParams();
  const ref = useRef<{
    sourceId: string, 
    targetId: string, 
    sourceTableId: any, 
    targetTableId: any, 
    tableData: any,
    // table1 form
    form1?: FormInstance,
    form1Data: Record<string, any>,
    // table1 form
    form2?: FormInstance,
    form2Data: Record<string, any>,
  }>({
      tableData: {},
      sourceTableId: '',
      targetTableId: '',
      sourceId: (params.id || '').split('_')[0],
      targetId: (params.id || '').split('_')[1],
      form1Data: {},
      form2Data: {},
    })

  /* state */
  const [rebuildVisible, setRebuildVisible] = useState(false);
  const [tabKey, setTabKey] = useState('1');
  const [showFooter, setShowFooter] = useState(false);
  const [rebuildChecked, setRebuildChecked] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [detail, setDetail] = useState<Record<string, any>>({});

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])

  const [sourceBase, setSourceBase] = useState<any[]>([]);
  const [sourceValue, setSourceValue] = useState<any>(undefined);
  const [targetBase, setTargetBase] = useState<any[]>([]);
  const [targetValue, setTargetValue] = useState<any>(undefined);
  // update
  const [updateTable1, setUpdateTable1] = useState<boolean>(false);
  const [updateTable2, setUpdateTable2] = useState<boolean>(false);
  const [updateDetail, setUpdateDetail] = useState<boolean>(false);

  const columns1 = useMemo(() => ([
    {title: '来源表', dataIndex: 'srcTableName', render: (text: any, record: any) => {
      return (
        <>
          <span className={style.iconTitle}>
            {TABLE}
            <span>{text}</span>
          </span>
          <span className={style.iconTitle}>
            {BASE}
            <span className={style.text}>/{record.srcDbName}</span>
          </span>
        </>
      )
    }},
    {title: '目标表', dataIndex: 'tgtTableName', render: (text: any, record: any) => {
      return (
        <>
          <span className={style.iconTitle}>
            {TABLE}
            <span>{text}</span>
          </span>
          <span className={style.iconTitle}>
            {BASE}
            <span className={style.text}>/{record.tgtDbName}</span>
          </span>
        </>
      )
    }},
    {title: '操作人/时间', dataIndex: 'tgtTableName', render: (text: any, record: any) => {
      return (
        <>
          <span>{record.userName}</span><br/>
          <span>{record.updateTime}</span>
        </>
      )
    }},
    {title: '字段血缘', dataIndex: 'lineageNum', render: (text: any, record: any) => <a onClick={() => openDrawer(record)}>{text}</a>},
    {title: '操作', dataIndex: '', width: 80, fixed:'right', render: (text: any, record: any) => {
      return (
        <a onClick={() => { del(record) }}>删除</a>
      )
    }},
  ]), [])
  const columns2 = useMemo(() => ([
    {title: '来源表', dataIndex: 'srcTableName',  render: (text: any, record: any) => {
      return (
        <>
          <span className={style.iconTitle}>
            {TABLE}
            <span>{text}</span>
          </span>
          <span className={style.iconTitle}>
            {BASE}
            <span className={style.text}>/{record.srcDbName}</span>
          </span>
        </>
      )
    }},
    {title: '目标表', dataIndex: 'tgtTableName', render: (text: any, record: any) => {
      return (
        <>
          <span className={style.iconTitle}>
            {TABLE}
            <span>{text}</span>
          </span>
          <span className={style.iconTitle}>
            {BASE}
            <span className={style.text}>/{record.tgtDbName}</span>
          </span>
        </>
      )
    }},
    {title: '操作人/时间', dataIndex: 'tgtTableName', render: (text: any, record: any) => {
      return (
        <>
          <span>{record.userName}</span><br/>
          <span>{record.updateTime}</span>
        </>
      )
    }},
    {title: '字段血缘', dataIndex: 'lineageNum', render: (text: any, record: any) => <a onClick={() => openDrawer(record)}>{text}</a>},
    {title: '操作', dataIndex: '', width: 160,fixed:'right', render: (text: any, record: any) => {
      return (
        <Space split={<Divider type="vertical" />}>
          <Typography.Link onClick={() => { pass(`${record.srcTableId}_${record.tgtTableId}`, true, false) }}>通过</Typography.Link>
          <Typography.Link onClick={() => { pass(`${record.srcTableId}_${record.tgtTableId}`, false, false) }} type="danger">不通过</Typography.Link>
        </Space>
      )
    }},
  ]), [])
  const compareColumns = useMemo(() => ([
    {title: '源头表字段', dataIndex: 'srcColumnName', render: (text: any) => <span className={style.moreText}>{text}</span>},
    {title: '类型', dataIndex: 'srcType', width: 100},
    {title: '目标表字段', dataIndex: 'tgtColumnName', render: (text: any) => <span className={style.moreText}>{text}</span>},
    {title: '类型', dataIndex: 'tgtType', width: 100}
  ]), [])

  /* state */
  useEffect(() => {
    readBloodMapDetailRealy({srcDsId: ref.current.sourceId, tgtDsId: ref.current.targetId  }).then(res => {
      if(res.code !== 200) {
        message.error(res.msg || '');
      }
      setDetail(res.data|| {})
    })
  }, [updateDetail])

  useEffect(() => {
    readTableBloodMapDatabase({
      srcDsId: ref.current.sourceId,
      tgtDsId: ref.current.targetId,
      dbId: targetValue,
      type: 0
    }).then(res => {
      setSourceBase(res.data || [])
    })
  }, [targetValue])

  useEffect(() => {
    readTableBloodMapDatabase({
      srcDsId: ref.current.sourceId,
      tgtDsId: ref.current.targetId,
      dbId: sourceValue,
      type: 1
    }).then(res => {
      setTargetBase(res.data || [])
    })
  }, [sourceValue])

  // tab change
  const tabChange = (tab: string) => {
    setTabKey(tab);
  }

  // 重建血缘
  const rebuild = () => {
    setRebuildVisible(true);
  }
  const cancelRebuild = () => {
    setRebuildChecked(false);
    setRebuildVisible(false);
  }

  const rebuildOk = () => {
    console.log('rebuild');
    rebuildBloodMap({ srcDsId: ref.current.sourceId, tgtDsId: ref.current.targetId }).then(res => {
      if(res.code == 200) {
        message.success('重建映射成功，数据加载预计30s');
        setRebuildVisible(false);
        // 重置选中状态
        setRebuildChecked(false);
        // 更新table
        setUpdateTable1(v => !v);
        setUpdateTable2(v => !v);
      } else {
        message.error(res.msg || '重建失败');
      }
    })
  }

  // 删除映射
  const del = (record: any) => {
    Modal.confirm({
      title: '删除表映射',
      content: '删除包括字段血缘映射，是否确定删除？',
      okType: 'danger',
      okText: '删除',
      cancelText: '取消',
      okButtonProps: { type: 'primary' },
      onOk() {
        deleteTableBlood({ srcTableId: record.srcTableId, tgtTableId: record.tgtTableId }).then(res => {
          if (res.code == 200) {
            message.success('删除成功');
            setUpdateTable1(v => !v);
          } else {
            message.error(res.msg || '删除失败');
          }
        })
      }
    })
  }

  // table rowkeys change
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setShowFooter(newSelectedRowKeys.length > 0);
    setSelectedRowKeys(newSelectedRowKeys);
  }

  // 取消多选
  const cancelRowKeys = () => {
    setShowFooter(false);
    setSelectedRowKeys([]);
  }
  // table rowselection 配置
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange
  }

  // 通过
  const pass = (ids: string | string[] , pass: boolean, batch?: boolean) => {

    console.log('ids', ids);

    const title = batch ? `批量${pass ? '' : '不'}通过“${ids.length}”项映射关系` : `${pass ? '' : '不'}通过此项映射关系`;

    const postData: any = {
      confirm: pass ? 1 : 0,
      srcSrcId: ref.current.sourceId,
      tgtSrcId: ref.current.targetId,
      params: []
    }

    if(Array.isArray(ids)) {
      postData.params = ids.map((v: string) => {
        let ids = v.split('_');
        return {
          srcTableId: ids[0],
          tgtTableId: ids[1]
        }
      })
    } else {
      let _ids = ids.split('_');
      postData.params = [
        {
          srcTableId: _ids[0],
          tgtTableId: _ids[1]
        }
      ]
    }

    Modal.confirm({
      title,
      content: `是否确认${pass ? '' : '不'}通过`,
      okText: pass ? '通过' : '不通过',
      cancelText: '取消',
      okType: pass ? 'primary' : 'danger',
      okButtonProps: { type: 'primary' },
      onOk() {
        verifyTableBlood(postData).then(res => {
          if(res.code == 200) {
            message.success('操作成功')
            setUpdateTable2(v => !v);
            setUpdateTable1(v => !v);
            setUpdateDetail(v => !v);
          } else {
            message.error(res.msg || '操作失败')
          }
        })
      }
    })

  }
  // drawer
  const openDrawer = (data: any) => {
    ref.current.sourceTableId = data.srcTableId;
    ref.current.targetTableId = data.tgtTableId;
    ref.current.tableData = data;
    setDrawerVisible(true);
  }

  const sourceTableChange = (value: any, index?: number, update?: boolean, params?: any) => {
    console.log('source value', value);
    if(update && ref.current.form1Data.srcDbId && params.srcDbId !== undefined) {
      // 置空目标源值
      ref.current.form1 && ref.current.form1.setFieldValue('tgtDbId', undefined);
    }
    ref.current.form1Data.srcDbId = value;
    setSourceValue(value);
  }
  const targetTableChange = (value: any, index?: number, update?: boolean, params?: any) => {
    console.log('target value', value);
    if(update && ref.current.form1Data.tgtDbId && params.tgtDbId !== undefined) {
      // 置空目标源值
      ref.current.form1 && ref.current.form1.setFieldValue('srcDbId', undefined);
    }
    ref.current.form1Data.tgtDbId = value;
    setTargetValue(value);
  }

  const updateDependencies1 = useMemo(() => [updateTable1], [updateTable1]);
  const updateDependencies2 = useMemo(() => [updateTable2], [updateTable2])

  return (
    <ContentLayout
      title="映射详情"
      back
      init
      onBack={()=>PageUtil.addTab('bloodMapping')}
      titleExtra={<a onClick={rebuild} className={style.rebuild}>{REFRESH}重建血缘</a>}
      showOutFooter={showFooter}
      renderOutFooter={
        <div className={style.outFooter}>
          <Space>
            <Button onClick={() => { pass(selectedRowKeys, true, true) }} type="primary">通过</Button>
            <Button onClick={() => { pass(selectedRowKeys, false, true) }} danger>不通过</Button>
          </Space>
          <span className={style.select}>已选 {selectedRowKeys.length} 项</span>
          <span onClick={cancelRowKeys} className={style.cancel}>取消选择</span>
        </div>
      }
    >
      <Wrap padding={'16px 20px 20px 20px'} marginBottom={16}>
        <SectionTitle style={{ marginBottom: 16 }} title="基本信息" />
        <ListHorizontal label='来源数据源' value={`${detail.srcDsName || ''} ${ detail.srcDsType ? ('（' + (detail.srcDsType || '') + '）') : ''}`} />
        <ListHorizontal style={{ marginBottom: 0 }} label='目标数据源' value={`${detail.tgtDsName || ''} ${ detail.tgtDsType ?  ('（' + (detail.tgtDsType || '') + '）') : '' }`} />
      </Wrap>

      <Wrap padding={'16px 20px 20px 20px'}>
        <SectionTitle style={{ marginBottom: (!detail.auto && detail.toBeConfirmedNum !== 0) ? 4 : 12}} title="表映射关系" />
        {
          (!detail.auto && detail.toBeConfirmedNum !== 0) && (
            <Tabs onChange={tabChange} defaultActiveKey='1'>
              <Tabs.TabPane tab="已确认" key="1" />
              <Tabs.TabPane tab={<span className={style.badge}>待确认 <sup>{detail.toBeConfirmedNum || 0}</sup></span>} key="2" />
            </Tabs>
          )
        }
        <LzTable
          wrapStyle={{ display: tabKey === '1' ? 'block' : 'none' }}
          columns={columns1}
          searchDataSource={[
            {
              type: 'inputSearch',
              placeholder: '表名搜索',
              name: 'keyword'
            }, {
              type: 'select',
              width: 180,
              placeholder: '数据库（来源）',
              name: 'srcDbId',
              selectOption: sourceBase,
              fieldNames: { label: 'name', value: 'id' }
            }, {
              type: 'select',
              width: 180,
              placeholder: '数据库（目标）',
              name: 'tgtDbId',
              selectOption: targetBase,
              fieldNames: { label: 'name', value: 'id' }
            }
          ]}
          request={async (params = {}) => {
            const srcUpdate = ref.current.form1Data.srcDbId != params.srcDbId;
            const tgtUpdate = ref.current.form1Data.tgtDbId != params.tgtDbId;
            console.log('params', params, ref.current.form1Data);
            console.log('update', srcUpdate, tgtUpdate);

            const postParams = {
              srcDsId: ref.current.sourceId,
              tgtDsId: ref.current.targetId,
              keyword: params.keyword,

              srcDbId: (tgtUpdate && ref.current.form1Data.tgtDbId && params.tgtDbId !== undefined) ? undefined : params.srcDbId,
              tgtDbId: (srcUpdate && ref.current.form1Data.srcDbId && params.srcDbId !== undefined) ? undefined : params.tgtDbId,

              page: params.current,
              pageSize: params.pageSize,
              status: 1,
            }

            tabKey === '1' && sourceTableChange(params.srcDbId,1, srcUpdate, params);
            tabKey === '1' && targetTableChange(params.tgtDbId,1, tgtUpdate, params);
            const res = await readBloodMapDetail(postParams);
            return {
              data: (res.data || {}).list || [],
              total: (res.data || {}).total || 0
            }
          }}
          updateDependencies={updateDependencies1}
          getForm={form => ref.current.form1 = form}
        />
        <LzTable
          rowKey={(record: any) => `${record.srcTableId}_${record.tgtTableId}`}
          wrapStyle={{ display: tabKey === '2' ? 'block' : 'none' }}
          columns={columns2}
          searchDataSource={[
            {
              type: 'inputSearch',
              placeholder: '表名搜索',
              name: 'keyword'
            }, {
              type: 'select',
              width: 180,
              placeholder: '数据库（来源）',
              name: 'srcDbId',
              selectOption: sourceBase,
              fieldNames: { label: 'name', value: 'id' }
            }, {
              type: 'select',
              width: 180,
              placeholder: '数据库（目标）',
              name: 'tgtDbId',
              selectOption: targetBase,
              fieldNames: { label: 'name', value: 'id' }
            }
          ]}
          request={async (params = {}) => {

            const srcUpdate = ref.current.form2Data.srcDbId != params.srcDbId;
            const tgtUpdate = ref.current.form2Data.tgtDbId != params.tgtDbId;

            const postParams = {
              srcDsId: ref.current.sourceId,
              tgtDsId: ref.current.targetId,
              keyword: params.keyword,

              srcDbId: (tgtUpdate && ref.current.form2Data.tgtDbId && params.tgtDbId !== undefined) ? undefined : params.srcDbId,
              tgtDbId: (srcUpdate && ref.current.form2Data.srcDbId && params.srcDbId !== undefined) ? undefined : params.tgtDbId,

              page: params.current,
              pageSize: params.pageSize,
              status: 0,
            }

            tabKey === '2' && sourceTableChange(params.srcDbId,2, srcUpdate, params);
            tabKey === '2' && targetTableChange(params.tgtDbId,2, tgtUpdate, params);
            
            const res = await readBloodMapDetail(postParams)
            // 更新时，重置多选
            setSelectedRowKeys([]);
            setShowFooter(false);
            return {
              data: (res.data || {}).list || [],
              total: (res.data || {}).total || 0
            }
          }}
          rowSelection={rowSelection}
          updateDependencies={updateDependencies2}
          getForm={form => ref.current.form2 = form}
        />
      </Wrap>
      <DrawerWrap
        title="对比表结构"
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        footer={null}
      >
        <Wrap padding={'0px'}>
          <SectionTitle style={{ marginBottom: 20 }} title="基本信息" />
          <ListHorizontal valueToolTip label='来源表' value={`${ref.current.tableData.srcTableName} （${ref.current.tableData.srcDsName}/${ref.current.tableData.srcDbName}）`} />
          <ListHorizontal valueToolTip style={{ marginBottom: 0 }} label='目标表' value={`${ref.current.tableData.tgtTableName} （${ref.current.tableData.tgtDsName}/${ref.current.tableData.tgtDbName}）`} />
        </Wrap>
        <Divider style={{ margin: '20px 0' }}/>
        <Wrap padding={'0px'}>
          <SectionTitle title='字段信息' style={{ marginBottom: 20 }} />
          <LzTable
            className={style.compareTable}
            columns={compareColumns}
            request={async (params = {}) => {
              const res = await readFieldMap({
                srcTableId: ref.current.sourceTableId,
                tgtTableId: ref.current.targetTableId,
              })
              return {
                data: (res.data || {}).list || [],
                total: res.data.total || 0,
              }
            }}
            enableDrag={false}
            pagination={false}
          />
        </Wrap>
      </DrawerWrap>
      <Modal
        wrapClassName={style.modal}
        visible={rebuildVisible}
        title="重建血缘"
        onCancel={cancelRebuild}
        destroyOnClose
        footer={
          <>
            <span><Checkbox value={rebuildChecked} onChange={e => setRebuildChecked(e.target.checked)}> <span className={style.confirmText}>我已充分了解提示信息</span></Checkbox></span>
            <Space>
              <Button onClick={cancelRebuild} type="default">取消</Button>
              <Button disabled={!rebuildChecked} onClick={rebuildOk} type="primary">重建血缘</Button>
            </Space>
          </>
        }
      >
        <div>
          <p>1. 重建血缘将清空已确认信息，重建映射关系</p>
          <p>2. 重建血缘是不可逆的操作，建议你谨慎操作</p>
        </div>
      </Modal>
    </ContentLayout>
  )
}
