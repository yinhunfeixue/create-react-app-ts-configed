import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ContentLayout, LzTable, Wrap, SectionTitle, ListHorizontal, DrawerWrap, Empty } from 'cps'
import { Button, Space, Divider, Dropdown, Menu, Form, Select, Switch, Modal, Checkbox, message, Progress, Alert, Spin } from 'antd'
import {
    createBloodMap,
    readBloodMap,
    updateBloodMap,
    deleteBloodMap,
    readTargetDataSource,
    readEditDetail,
    readTargetDataSourceDetail,
    TreadTargetDataSourceDetail,
    readSTDataSource,
    readDatabaseByCas,
} from '@/api/bloodMap'
import { useNavigate } from 'react-router-dom'
import { InfoCircleOutlined, PlusOutlined, ExclamationCircleFilled } from '@ant-design/icons'
import { formatPercent, Time, addDou } from 'utils'
import EmptyLabel from '@/component/EmptyLabel'

import style from './index.lees'
import DOWN from './down@2x.png'
import EMPTY from './empty-category.png'
import AutoTip from '@/component/AutoTip'
import PermissionWrap from '@/component/PermissionWrap'

/* 
  新增映射
  1、同名互斥
  2、不能同数仓
  3、不能已有映射关系（后端判断）
  来源数据源层级只能选ADS
  目标数据源层级只能选ODS
*/

const ADS = 'ADS'
const ODS = 'ODS'
const Right = (
    <svg width='1em' height='1em' viewBox='0 0 1024 1024'>
        <path fill='currentColor' d='M386.844444 170.666667l-45.511111 39.822222L597.333333 512 341.333333 813.511111l39.822223 39.822222L682.666667 512z'></path>
    </svg>
)

export default function (props: Component.CompoentProps) {
    /* value */
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const ref = useRef<{ delId: string; stDataSource: any[]; formDsId: any; form: Record<string, any>; isEdit?: boolean; editData: Record<string, any>; loadCount: number }>({
        loadCount: 0,
        editData: {},
        delId: '',
        stDataSource: [],
        formDsId: '',
        form: {},
        isEdit: false,
    })
    /* state */

    const [drawerVisible, setDrawerVisible] = useState(false)
    // 删除
    const [delVisible, setDelVisible] = useState(false)
    const [delChecked, setDelChecked] = useState(false)

    // 数据源统计
    const [dataSourceList, setDataSourceList] = useState<any[]>([])
    const [selectDataSource, setSelectDataSource] = useState<Record<string, any>>({})
    const [dataSourceDetail, setDataSourceDetail] = useState<TreadTargetDataSourceDetail>({})

    // 来源数据源-目标数据源
    const [sDataSource, setSDataSource] = useState<any[]>([])
    const [tDataSource, setTDataSource] = useState<any[]>([])
    const [casData, setCasData] = useState<any[]>([])
    const [databaseData, setDatabaseData] = useState<any[]>([])
    const [casBelong, setCasBelong] = useState<'source' | 'target' | any>('')

    const [formDatabase, setFormDatabase] = useState<any>(undefined)
    const [formCas, setFormCas] = useState<any>(undefined)

    // update
    const [updateTable, setUpdateTable] = useState<boolean>(false)
    const [updateStatis, setUpdateStatis] = useState<boolean>(false)
    // empty
    const [empty, setEmpty] = useState<boolean>(false)
    // loading
    const [statisLoading, setStatisLoading] = useState<boolean>(false)
    // switchValue
    const [switchValue, setSwitchValue] = useState<boolean>(false)

    const columns = useMemo(
        () => [
            {
                title: '数据源（来源）',
                dataIndex: 'srcDsName',
                fixed: 'left',
                width: 220,
                render: (text: any, record: any) => (
                    <span className={style.listDwWrap}>
                        {record.srcDw && <span className={style.dw}>DW</span>}
                        <span className={style[record.srcDw ? 'text' : '']}>{text}</span>
                    </span>
                ),
            },
            {
                title: '数据源（目标）',
                dataIndex: 'tgtDsName',
                width: 220,
                render: (text: any, record: any) => (
                    <span className={style.listDwWrap}>
                        {record.tgtDw && <span className={style.dw}>DW</span>}
                        <span className={style[record.tgtDw ? 'text' : '']}>{text}</span>
                    </span>
                ),
            },
            { title: '血缘关系/条', dataIndex: 'confirmedCount', sorter: true, render: (text: any) => (text ? addDou(text) : <EmptyLabel />) },
            { title: '待确认/条', dataIndex: 'notConfirmedCount', sorter: true, render: (text: any) => (text ? addDou(text) : <EmptyLabel />) },
            { title: '上次执行时间', dataIndex: 'updateTime', sorter: true, render: (text: any, record: any) => Time.formatTimeDetail(text) },
            {
                title: '操作',
                dataIndex: 'operation',
                fixed: 'right',
                width: 230,
                render: (text: any, record: any) => (
                    <Space size={'small'} className='EditColumnSpace' split={<Divider type='vertical' />}>
                        <a
                            onClick={() => {
                                navigate(`/lineage/sys_mapping/detail/${record.srcDsId}_${record.tgtDsId}`)
                            }}
                        >
                            管理
                        </a>
                        <PermissionWrap funcCode='/lineage/sys_mapping/list/edit' onClick={() => openDrawer(record)}>
                            <a>编辑</a>
                        </PermissionWrap>
                        <PermissionWrap
                            funcCode='/lineage/sys_mapping/list/delete'
                            onClick={() => {
                                del(record)
                            }}
                        >
                            <a>删除映射</a>
                        </PermissionWrap>
                    </Space>
                ),
            },
        ],
        []
    )

    /* effect */

    useEffect(() => {
        // 统计查询数据源
        readTargetDataSource().then((res) => {
            const data = res.data || []
            setDataSourceList(data)
            // 如果还没有选中id || 选中id被删除了, 默认选中第一个
            const isDel = data.filter((v) => v.id === selectDataSource.id).length <= 0
            if (!selectDataSource.id || isDel) {
                setSelectDataSource({ ...data[0] })
            }
        })
    }, [updateStatis])

    // 根据数据源id查询数据源详情
    useEffect(() => {
        if (!selectDataSource.id) return
        setStatisLoading(true)
        readTargetDataSourceDetail({ datasourceId: selectDataSource.id as number }).then((res) => {
            if (res.code !== 200) {
                message.error(res.msg || '获取数据源详情异常')
            }
            setDataSourceDetail(res.data || {})
            setStatisLoading(false)
        })
    }, [selectDataSource.id])

    // 来源-目标数据源
    useEffect(() => {
        readSTDataSource().then((res) => {
            if (res.code !== 200) {
                message.error(res.msg || '获取来源-目标数据源异常')
                return
            }
            // 保存元数据
            ref.current.stDataSource = res.data || []
            setSDataSource([...(res.data || [])])
            setTDataSource([...(res.data || [])])
        })
    }, [])
    // 查询库
    useEffect(() => {
        if (!formCas || !ref.current.formDsId) return
        if (formCas) {
            readDatabaseByCas({ dwLvl: formCas, dsId: ref.current.formDsId }).then((res) => {
                console.log('res', res)
                setDatabaseData(res.data || [])
            })
        }
    }, [formCas])

    /* action */
    // 删除相关
    const del = (data: any) => {
        console.log('del', data)
        ref.current.delId = `${data.srcDsId}_${data.tgtDsId}`
        setDelVisible(true)
    }

    const delOk = () => {
        const ids = ref.current.delId.split('_')
        console.log('ids', ids)
        deleteBloodMap({ srcDsId: ids[0], tgtDsId: ids[1] }).then((res) => {
            if (res.code == 200) {
                message.success('删除成功')
                setUpdateTable((v) => !v)
                setUpdateStatis((v) => !v)
                setDelVisible(false)
            } else {
                message.error(res.msg || '删除失败')
            }
            setDelChecked(false)
        })
    }

    const cancelDel = () => {
        setDelVisible(false)
        setDelChecked(false)
    }

    // dropdown
    const dropdownChange = (open: boolean) => {
        console.log('open', open)
    }

    const dropdownItemChange = (data: any) => {
        setSelectDataSource({ ...data })
    }

    const drawerOk = () => {
        form.validateFields().then((values) => {
            //console.log('values', values);
            const postData = {
                dwTypeId: formCas,
                ...values,
            }
            if (casBelong) {
                postData.databaseIds = formDatabase ? formDatabase.join(',') : ''
            }
            /* if(ref.current.isEdit) {
        postData.srcDsId = ref.current.editData.srcDsId;
        postData.tgtDsId = ref.current.editData.tgtDsId;
      } */
            //console.log('postData', postData, casBelong, formCas, formDatabase, casData);
            if (casBelong) {
                // 是数仓、没有层级
                if (!casData.length) {
                    message.warn('选择的数据源数仓分层不完善，请先配置')
                    return
                }
                // 是数仓、有层级、没有选择库
                if (!formDatabase || formDatabase.length <= 0) {
                    message.warn('请选择数据库')
                    return
                }
            }
            ;(ref.current.isEdit ? updateBloodMap(postData) : createBloodMap(postData)).then((res) => {
                if (res.code == 200) {
                    message.success(`${ref.current.isEdit ? '更新' : '新增'}成功，数据加载预计30s，可手动刷新页面`)
                    setUpdateTable((v) => !v)
                    setUpdateStatis((v) => !v)
                    closeDrawer()
                } else {
                    message.error(res.msg || '操作失败')
                }
            })
        })
    }

    const openDrawer = (data?: any) => {
        // 编辑时回填数据
        if (data) {
            readEditDetail({
                srcDsId: data.srcDsId,
                tgtDsId: data.tgtDsId,
            }).then((res) => {
                if (res.code !== 200) {
                    message.error(res.msg || '获取详情失败')
                }
                const editData = res.data
                form.setFieldsValue({
                    auto: editData.autoConfirm == 1,
                    srcDsId: data.srcDsId,
                    tgtDsId: data.tgtDsId,
                })
                setSwitchValue(editData.autoConfirm == 1)
                // 联动层级、库
                const map = {
                    source: 'srcDsId',
                    target: 'tgtDsId',
                }
                const belong = ['', 'source', 'target'][editData.dwOwner]
                const dwTypeId = editData.dwLvl
                const databaseIds = editData.databaseIdList ? (editData.databaseIdList || '').split(',') : []
                // 获取层级数据
                let casData = (ref.current.stDataSource.filter((v) => v.dsId == data[map[belong]])[0] || {}).dwLvl || []
                // 过滤层级
                casData = casData.filter((v: any) => v.name === { source: ADS, target: ODS }[belong])
                // 渲染层级
                setCasData([...casData])
                setCasBelong(belong)
                setFormCas(dwTypeId)
                // 获取库数据
                console.log('databaseIds', databaseIds)
                if (databaseIds.length > 0) {
                    if (!data[map[belong]] || !dwTypeId) return
                    readDatabaseByCas({ dsId: data[map[belong]], dwLvl: dwTypeId }).then((res) => {
                        if (res.code == 200) {
                            setDatabaseData(res.data || [])
                            setFormDatabase(databaseIds)
                        } else {
                            message.error(res.msg || '获取数据库异常')
                        }
                    })
                }
            })
        } else {
            setSwitchValue(true)
        }
        setDrawerVisible(true)
        ref.current.isEdit = !!data
        ref.current.editData = data
    }
    const closeDrawer = () => {
        // 重置状态
        form.resetFields()
        setCasData([])
        setCasBelong('')
        setFormCas(undefined)
        setDatabaseData([])
        setFormDatabase([])
        // 数据源也要重置
        setSDataSource([...ref.current.stDataSource])
        setTDataSource([...ref.current.stDataSource])
        setDrawerVisible(false)
    }
    // form
    const sChange = (value: any, option: any) => {
        console.log('value', value, option)
        if (!value) {
            setTDataSource([...ref.current.stDataSource])
            const _casBelong = casBelong === 'source' ? '' : casBelong
            !_casBelong && setFormCas(undefined)
            !_casBelong && setCasData([])
            setCasBelong(_casBelong)
            ref.current.formDsId = ''
            return
        }
        let { node: { dsIsDw = false, dwLvl = [] } = {} } = option
        // 过滤
        const _res = ref.current.stDataSource.filter((v) => {
            if (!dsIsDw) {
                return v.dsId != value
            } else {
                return !v.dsIsDw && v.dsId != value
            }
        })
        setTDataSource([..._res])
        if (dsIsDw) {
            dwLvl = dwLvl.filter((v: any) => v.name === ADS)
            setCasData([...dwLvl])
            setCasBelong('source')
            ref.current.formDsId = value
            // 默认选中数仓层级
            setFormCas((dwLvl[0] || {}).id)
            //setFormCas(undefined);
            // 清空上一次的数据库
            setFormDatabase(undefined)
            setDatabaseData([])
        } else {
            // 只有一份formCas 不能直接置空, 没有选中数仓时才置空
            const _casBelong = casBelong === 'source' ? '' : casBelong
            !_casBelong && setFormCas(undefined)
            !_casBelong && setCasData([])
            setCasBelong(_casBelong)
            ref.current.formDsId = ''
        }
    }
    const tChange = (value: any, option: any) => {
        console.log('value', value, option)
        if (!value) {
            setSDataSource([...ref.current.stDataSource])
            const _casBelong = casBelong === 'target' ? '' : casBelong
            !_casBelong && setFormCas(undefined)
            !_casBelong && setCasData([])
            setCasBelong(_casBelong)
            ref.current.formDsId = ''
            return
        }
        let { node: { dsIsDw = false, dwLvl = [] } = {} } = option
        // 过滤
        const _res = ref.current.stDataSource.filter((v) => {
            if (!dsIsDw) {
                return v.dsId != value
            } else {
                return !v.dsIsDw && v.dsId != value
            }
        })
        setSDataSource([..._res])
        if (dsIsDw) {
            dwLvl = dwLvl.filter((v: any) => v.name === ODS)
            setCasData([...dwLvl])
            setCasBelong('target')
            ref.current.formDsId = value
            // 清空上一次的数仓层级
            setFormCas((dwLvl[0] || {}).id)
            //setFormCas(undefined);
            // 清空上一次的数据库
            setFormDatabase(undefined)
            setDatabaseData([])
        } else {
            // 只有一份formCas 不能直接置空, 没有选中数仓时才置空
            const _casBelong = casBelong === 'target' ? '' : casBelong
            !_casBelong && setFormCas(undefined)
            !_casBelong && setCasData([])
            setCasBelong(_casBelong)
            ref.current.formDsId = ''
        }
    }
    const casChange = (value: any, option: any) => {
        setFormCas(value)
    }
    const databaseChange = (value: any, option: any) => {
        console.log('databaseChange', value)
        setFormDatabase(value)
    }

    /* render */
    const renderOption = (data: any[]) => {
        //return data.map((v, i) => <Select.Option key={v.dsId} node={v}>{v.dsName}</Select.Option>)

        return data.map((v, i) => (
            <Select.Option key={v.dsId} node={v}>
                <span className={style.dwWrap}>
                    {v.dsIsDw && <span className={style.dw}>DW</span>}
                    <label className={v.dsIsDw ? style.text : ''}>{v.dsName}</label>
                </span>
            </Select.Option>
        ))
    }
    const renderCas = (data: any[]) => {
        return data.map((v, i) => (
            <Select.Option key={v.id} node={v}>
                {v.name}
            </Select.Option>
        ))
    }
    const renderDatabase = (data: any[]) => {
        return data.map((v, i) => (
            <Select.Option key={v.id} node={v}>
                {v.name}
            </Select.Option>
        ))
    }

    const filterOption = (inputValue: string, option: any) => {
        return ((option.node || {}).dsName || '').toLowerCase().includes(inputValue.toLocaleLowerCase())
    }

    const updateDependencies = useMemo(() => [updateTable], [updateTable])

    const linkToConfig = () => {
        // 由casBelong拿数据源id，由数据源id拿数据源数据
        const values = form.getFieldsValue()
        let sourceId = casBelong === 'source' ? values.srcDsId : values.tgtDsId
        let sourceItem = ref.current.stDataSource.filter((v) => v.dsId === sourceId)[0]
        props.addTab &&
            props.addTab(
                '数仓分层管理',
                {
                    //databaseCount: 32,
                    id: sourceItem.dsId,
                    //identifier: "shucang",
                    name: sourceItem.dsName,
                },
                true
            )
    }

    const renderTips = (show: boolean) => {
        return show ? (
            <Alert
                icon={<ExclamationCircleFilled style={{ color: '#FF4D4F' }} />}
                message={
                    <p className={style.emptyTip}>
                        选择的数据源数仓分层不完善，请先配置。<span onClick={() => linkToConfig()}>配置{Right}</span>
                    </p>
                }
                type='error'
                showIcon
            />
        ) : (
            ''
        )
    }

    const formChange = (changeValues: any, allValues: any) => {
        console.log(changeValues, allValues)
        setSwitchValue(allValues.auto)
    }

    console.log('selectDataSource', selectDataSource)

    return (
        <ContentLayout
            title='血缘映射'
            titleExtra={
                empty ? (
                    ''
                ) : (
                    <PermissionWrap funcCode='/lineage/sys_mapping/list/add' onClick={() => openDrawer()}>
                        <Button type='primary'>新增映射</Button>
                    </PermissionWrap>
                )
            }
            footer
            init
        >
            <Empty style={{ display: empty ? 'block' : 'none' }} image={EMPTY} desc='暂无映射信息，你可以新增血缘映射'>
                <PermissionWrap funcCode='/lineage/sys_mapping/list/add' onClick={() => openDrawer()}>
                    <Button type='primary'>
                        <PlusOutlined />
                        新增映射
                    </Button>
                </PermissionWrap>
            </Empty>

            <div style={{ display: !empty ? 'block' : 'none' }}>
                <Wrap marginBottom={16}>
                    <SectionTitle title='数据统计（目标）' />
                    <ListHorizontal.Wrap className={style.listWrap}>
                        {
                            <Select
                                className={style.customSelect}
                                onChange={(value) => dropdownItemChange({ id: value })}
                                defaultValue={selectDataSource.id}
                                value={selectDataSource.id}
                                getPopupContainer={(node) => node.parentElement}
                            >
                                {dataSourceList.map((v, index) => (
                                    <Select.Option key={index} value={v.id}>
                                        <span className={style.menuItem} /* onClick={() => { dropdownItemChange(v) }} */>
                                            {v.name}
                                            {v.dwTypeDesc ? `(${v.dwTypeDesc || ''})` : ''}
                                        </span>
                                    </Select.Option>
                                ))}
                            </Select>
                        }
                        {/* <Dropdown
              overlayClassName={style.dropdown}
              onVisibleChange={dropdownChange}
              trigger={['click']} 
              getPopupContainer={() => document.getElementById('dropdownContainer') as HTMLElement}
              overlay={
                <Menu
                  items={dataSourceList.map((v, index) => ({
                    key: index,
                    label: <span className={style.menuItem} onClick={() => { dropdownItemChange(v) }}>{v.name}{v.dwTypeDesc ? `(${v.dwTypeDesc || ''})` : ''}</span>
                  }))}
                />
              }
              >
              <Space className={style.dropdown}>
                <span>{selectDataSource.name}{selectDataSource.dwTypeDesc ? `(${selectDataSource.dwTypeDesc || ''})` : ''}</span>
                <img width={14} src={DOWN} />
              </Space>
            </Dropdown> */}
                        <Divider className={style.divider} type='vertical' />
                        <ListHorizontal style={{ marginBottom: 0 }} label='表总数' value={<span className={style.percent}>{addDou(dataSourceDetail.tableTotal)}</span>} />
                        {/* dataSourceDetail.tableConfirmed */}
                        <ListHorizontal
                            style={{ marginBottom: 0 }}
                            label='已映射表'
                            value={(() => {
                                const percentValue = formatPercent(dataSourceDetail.tableConfirmed as number, dataSourceDetail.tableTotal as number).value
                                return (
                                    <span className={style.percent}>
                                        <span>{percentValue ? percentValue + '%' : '0'}</span>
                                        <Progress type='circle' width={16} percent={percentValue as unknown as number} showInfo={false} strokeWidth={15} />
                                    </span>
                                )
                            })()}
                        />
                        <ListHorizontal
                            style={{ marginBottom: 0 }}
                            label='未映射表'
                            value={(() => {
                                const percentValue = formatPercent(dataSourceDetail.tableNotConfirmed as number, dataSourceDetail.tableTotal as number).value
                                return (
                                    <span className={style.percent}>
                                        {percentValue ? <span>{percentValue + '%'}</span> : <span>0</span>}
                                        <Progress type='circle' width={16} percent={percentValue as unknown as number} showInfo={false} strokeWidth={15} />
                                    </span>
                                )
                            })()}
                        />
                    </ListHorizontal.Wrap>
                </Wrap>

                <Wrap>
                    <SectionTitle title='基本信息' style={{ marginBottom: 20 }} />
                    <LzTable
                        columns={columns}
                        searchDataSource={[
                            {
                                width: 360,
                                type: 'inputSearch',
                                placeholder: '搜索数据源',
                                name: 'keyword',
                            },
                        ]}
                        request={async (params = {}) => {
                            const res = await readBloodMap({
                                keyword: params.keyword,
                                page: params.current,
                                pageSize: params.pageSize,
                                page_size: params.pageSize,
                                confirmedOrder: params.confirmedCount_order ? (params.confirmedCount_order === 'ascend' ? 0 : 1) : undefined,
                                toBeConfirmedOrder: params.notConfirmedCount_order ? (params.notConfirmedCount_order === 'ascend' ? 0 : 1) : undefined,
                                updateTimeOrder: params.updateTime_order ? (params.updateTime_order === 'ascend' ? 0 : 1) : undefined,
                            })
                            const { data: { list = [], total = 0 } = {} } = res || {}
                            ref.current.loadCount++
                            console.log('empty', list)
                            if (!params.keyword && params.current === 1 && list.length <= 0) {
                                setEmpty(true)
                            }
                            if (list.length > 0) {
                                setEmpty(false)
                            }
                            return {
                                data: list,
                                total,
                            }
                        }}
                        updateDependencies={updateDependencies}
                        /* scroll={{
              x: 500
            }} */
                    />
                </Wrap>
            </div>

            <DrawerWrap className={style.drawer} title={`${ref.current.isEdit? '编辑': '新增'}血缘映射`} visible={drawerVisible} onClose={closeDrawer} onOk={drawerOk}>
                <Form
                    form={form}
                    layout='vertical'
                    initialValues={{
                        auto: true,
                    }}
                    onValuesChange={formChange}
                >
                    <p className={style.formTip}>
                        <InfoCircleOutlined />
                        保存后，数据自动在每日零点更新
                    </p>
                    <Form.Item label='来源数据源' rules={[{ required: true }]} name='srcDsId'>
                        <Select allowClear disabled={ref.current.isEdit} onChange={sChange} placeholder='请输入选择' showSearch filterOption={filterOption}>
                            {renderOption(sDataSource)}
                        </Select>
                    </Form.Item>
                    {renderTips(casBelong === 'source' && casData.length <= 0 && !formCas)}
                    {casBelong === 'source' && (
                        <Form.Item label={<span className={style.required}>数据库选择</span>} rules={[{ required: true }]}>
                            <Space className={style.space}>
                                <Select defaultActiveFirstOption disabled={ref.current.isEdit || (casData.length <= 0 && !formCas)} value={formCas} onChange={casChange} placeholder='选择数仓层级'>
                                    {renderCas(casData)}
                                </Select>
                                <Select disabled={(casData.length <= 0 && !formDatabase) || ref.current.isEdit} value={formDatabase} onChange={databaseChange} placeholder='选择数据库' mode='multiple'>
                                    {renderDatabase(databaseData)}
                                </Select>
                            </Space>
                        </Form.Item>
                    )}
                    <Form.Item label='目标数据源' rules={[{ required: true }]} name='tgtDsId'>
                        <Select allowClear disabled={ref.current.isEdit} onChange={tChange} placeholder='请输入选择' showSearch filterOption={filterOption}>
                            {renderOption(tDataSource)}
                        </Select>
                    </Form.Item>
                    {renderTips(casBelong === 'target' && casData.length <= 0 && !formCas)}
                    {casBelong === 'target' && (
                        <Form.Item label={<span className={style.required}>数据库选择</span>} rules={[{ required: true }]}>
                            <Space className={style.space}>
                                <Select disabled={ref.current.isEdit || (casData.length <= 0 && !formCas)} value={formCas} onChange={casChange} placeholder='选择数仓层级'>
                                    {renderCas(casData)}
                                </Select>
                                <Select disabled={(casData.length <= 0 && !formDatabase) || ref.current.isEdit} value={formDatabase} onChange={databaseChange} placeholder='选择数据库' mode='multiple'>
                                    {renderDatabase(databaseData)}
                                </Select>
                            </Space>
                        </Form.Item>
                    )}

                    <Form.Item label='自动确认' name='auto' valuePropName='checked'>
                        <Switch />
                    </Form.Item>
                    {switchValue && (
                        <p className={style.formTip} style={{ marginTop: -16 }}>
                            开启自动确认：映射的血缘关系将由系统自动审核，不再进入人工审核列表
                        </p>
                    )}
                </Form>
            </DrawerWrap>

            <Modal
                wrapClassName={style.modal}
                visible={delVisible}
                title='删除映射'
                onCancel={cancelDel}
                destroyOnClose
                footer={
                    <>
                        <span>
                            <Checkbox value={delChecked} onChange={(e) => setDelChecked(e.target.checked)}>
                                {' '}
                                <span className={style.confirmText}>我已充分了解提示信息</span>
                            </Checkbox>
                        </span>
                        <Space>
                            <Button onClick={cancelDel} type='default'>
                                取消
                            </Button>
                            <Button disabled={!delChecked} onClick={delOk} danger type='primary'>
                                删除
                            </Button>
                        </Space>
                    </>
                }
            >
                <div>
                    <p>1. 删除数据源映射，包括已确认的表、字段映射一同删除 </p>
                    <p>2. 删除是不可逆的操作，建议你谨慎操作</p>
                </div>
            </Modal>
        </ContentLayout>
    )
}
