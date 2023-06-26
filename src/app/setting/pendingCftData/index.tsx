import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ContentLayout, LzTable, DrawerWrap, FormTool } from 'cps'
import { Space, Divider, Button, message, Input, Popconfirm } from 'antd'
import TrustDetail from '../trustedData/cps/trustDetail'
import RichTableLayout from '@/component/layout/RichTableLayout'
import AutoTip from '@/component/AutoTip'

import { readTrustData, deleteTrustData, TreadTrustData, createTrustTable, readTableSourcePath, reVerify } from '@/api/trustData'

import style from './index.lees'
import EmptyLabel from '@/component/EmptyLabel'
import PermissionWrap from '@/component/PermissionWrap'

const TABLE = (
    <svg viewBox='0 0 1024 1024' p-id='7174' width='1em' height='1em'>
        <path
            fill='currentColor'
            d='M96 160v704h832V160H96z m309.344 400.192v-160h192v160h-192z m192 64V800h-192v-175.808h192zM160 400.192h181.344v160H160v-160z m501.344 0H864v160h-202.656v-160zM864 224v112.192H160V224h704zM160 624.192h181.344V800H160v-175.808zM661.344 800v-175.808H864V800h-202.656z'
            p-id='7175'
        ></path>
    </svg>
)

const SUCCESS = (
    <svg viewBox='0 0 1024 1024' p-id='10890' width='18'>
        <path
            d='M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m203.776 274.24L471.424 582.592l-131.2-131.2-72.448 72.32 203.648 203.712 316.8-316.8-72.448-72.384z'
            fill='#2AC75E'
            p-id='10891'
        ></path>
    </svg>
)
const WARN = (
    <svg viewBox='0 0 1024 1024' p-id='11040' width='18'>
        <path d='M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m56 616h-112v112h112v-112z m0-448h-112v336h112v-336z' fill='#FF9900' p-id='11041'></path>
    </svg>
)
const ERROR = (
    <svg viewBox='0 0 1024 1024' p-id='11190' width='18'>
        <path
            d='M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m122.24 253.44L512 439.424 389.76 317.44 317.44 389.824l122.24 122.112-122.24 122.24 72.32 72.448L512 584.32l122.24 122.24 72.32-72.448L584.512 512l122.176-122.112-72.448-72.448z'
            fill='#FF4D4F'
            p-id='11191'
        ></path>
    </svg>
)

export default function (props: Component.CompoentProps) {
    /* value */
    const ref = useRef<{ ignoreData: any[]; detailId: any; controller: any; _searchOptions: any }>({ ignoreData: [], detailId: '', controller: {}, _searchOptions: {} })
    const columns = useMemo(
        () => [
            {
                title: '表名',
                fixed: 'left',
                dataIndex: 'tableName',
                render: (text: any, record: any) => {
                    return text ? (
                        <a onClick={() => linkToTableDetail(record)} className={style.tableName}>
                            {TABLE}
                            <AutoTip content={text} />
                        </a>
                    ) : (
                        <EmptyLabel />
                    )
                },
            },
            {
                title: '来源路径',
                dataIndex: 'tablePath',
                render: (text: any) => {
                    return text ? <AutoTip content={text} /> : <EmptyLabel />
                },
            },
            {
                title: '认证审核概括',
                dataIndex: '',
                render: (text: any, record: TreadTrustData) => {
                    return (
                        <div>
                            {!!record.unstandardNum && (
                                <div className={style.errorDesc}>
                                    <span className={style.iconStatus}>{ERROR}</span>
                                    {record.unstandardNum}项未达标：
                                    <AutoTip content={(record.unstandardDesc || []).join('、')} />
                                </div>
                            )}
                            {!!record.noticeNum && (
                                <div className={style.noticeDesc}>
                                    <span className={style.iconStatus}>{WARN}</span>
                                    {record.noticeNum}项需关注：
                                    <AutoTip content={(record.noticeDesc || []).join('、')} />
                                </div>
                            )}
                        </div>
                    )
                },
            },
            /* { title: '操作', width: 150, dataIndex: 'operation', render: (text: any, record: any) => {
      return (
        <Space size={'small'} split={<Divider type="vertical" />}>
          <a onClick={() => { openDetailDrawer(record) }}>信息完善</a>
          <Popconfirm
            placement="topRight"
            title="忽略后，系统将不再推荐该表为认证数据"
            okText="忽略"
            cancelText="取消"
            onConfirm={() => { ignore(record) }}
          >
            <a>忽略</a>
          </Popconfirm>
        </Space>
      )
    } }, */
        ],
        []
    )
    const ignoreColumns = useMemo(
        () => [
            {
                title: '表名',
                dataIndex: 'tableName',
                render: (text: any, record: any) => {
                    return text ? (
                        <a onClick={() => linkToTableDetail(record)} className={style.tableName}>
                            {text}
                        </a>
                    ) : null
                },
            },
            { title: '来源路径', width: 200, dataIndex: 'tablePath' },
            {
                title: '操作',
                width: 120,
                dataIndex: 'operation',
                render: (text: any, record: any) => (
                    <PermissionWrap funcCode='/data_cert/check/remove'>
                        <Popconfirm placement='topRight' title='是否确认移出忽略' okText='移出' cancelText='取消' onConfirm={() => removeIgnore(record)}>
                            <a>移出忽略</a>
                        </Popconfirm>
                    </PermissionWrap>
                ),
            },
        ],
        []
    )

    /* state */
    const [ignoreData, setIgnoreData] = useState<any[]>([])

    const [visible, setVisible] = useState(false)
    const [detailVisible, setDetailVisible] = useState(false)

    const [sourcePath, setSourcePath] = useState<any[]>([])
    // update
    const [updateList, setUpdateList] = useState(false)
    const [updateIgnore, setUpdateIgnore] = useState(false)
    // 详情数据
    const [detailData, setDetailData] = useState<Record<string, any>>({})
    // detail key
    const [detailKey, setDetailKey] = useState<number>(1)

    const [submitLoading, setSubmitLoading] = useState<boolean>(false)

    /* effect */
    useEffect(() => {
        readTrustData({ status: 3, needAll: true }).then((res) => {
            if (res.code == 200) {
                const data = res.data || []
                setIgnoreData(data)
                // 将源数据拷贝一份
                ref.current.ignoreData = [...data]
            } else {
                message.error(res.msg || '获取忽略数据异常')
            }
        })
    }, [updateIgnore])

    /* effect */
    useEffect(() => {
        readTableSourcePath({ status: 2 }).then((res) => {
            setSourcePath(res.data || [])
        })
    }, [])

    /* action */
    const ignore = (record: TreadTrustData) => {
        deleteTrustData({ tableId: record.tableId }).then((res) => {
            if (res.code == 200) {
                message.success('忽略成功')
                // update table
                ref.current.controller.reset()
                //setUpdateList(v => !v);
                setUpdateIgnore((v) => !v)
            } else {
                message.error(res.msg || '操作失败')
            }
        })
    }
    const openDrawer = () => {
        setVisible(true)
    }
    const closeDrawer = () => {
        setVisible(false)
    }
    const searchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        // 过滤
        let res = ref.current.ignoreData.filter((v) => v.tableName.toLocaleLowerCase().includes((value || '').toLocaleLowerCase()))
        setIgnoreData([...res])
    }
    const removeIgnore = (record: TreadTrustData) => {
        createTrustTable({ tableId: record.tableId }).then((res) => {
            if (res.code == 200) {
                message.success(
                    <>
                        移出成功，<span style={{ fontWeight: 500 }}>待认证数据</span>列表中查看
                    </>
                )
                // 本地数据更新
                setIgnoreData((data) => data.filter((v) => v.tableId !== record.tableId))
                ref.current.ignoreData = ref.current.ignoreData.filter((v) => v.tableId !== record.tableId)
                setUpdateList((v) => !v)
            } else {
                message.error(res.msg || '移出失败')
            }
        })
    }

    // detail drawer
    const openDetailDrawer = (record: any) => {
        setDetailVisible(true)
        ref.current.detailId = record.tableId
    }
    const closeDetailDrawer = () => {
        setDetailVisible(false)
        ref.current.detailId = ''
    }

    const linkToTableDetail = (data: any) => {
        props.addTab('sysDetail', { id: data.tableId }, true)
    }

    const getDetailData = (data: any) => {
        console.log('data', data)
        setDetailData(data)
    }

    /* pure tool */
    const isNotPass = (data: any) => {
        const _list = [...((data || {}).itemList || [])]
        const tmp1 = _list.filter((v) => v.authResult == 2)
        return tmp1.length > 0
    }

    const detailSubmit = () => {
        console.log('detailSubmit')
        setSubmitLoading(true)
        reVerify({ tableId: ref.current.detailId as unknown as number }).then((res) => {
            setSubmitLoading(false)
            if (res.code == 200) {
                const { data = {} } = res || {}
                if (data.code == 3) {
                    message.success('认证成功添加至 可信数据列表')
                    setDetailVisible(false)
                    setUpdateList((v) => !v)
                } else {
                    message.error('认证失败，数据未达标')
                    setDetailKey((v) => v + 1)
                }
            } else {
                message.error(res.msg || '认证失败')
            }
        })
    }

    const getTableData = async (page: any, size: any) => {
        const params = { ...ref.current._searchOptions }
        const res = await readTrustData({
            keyword: params.keyword,
            //tablePath: params.tablePath,
            datasourceId: (params.tablePath || [])[0],
            databaseId: (params.tablePath || [])[1],
            page,
            pageSize: size,
            status: 2,
        })
        return {
            data: res.data || [],
            dataSource: res.data || [],
            total: res.total,
        }
    }

    const formChange = (values: any = {}, reset?: boolean) => {
        console.log('formChange', values)
        const data = reset
            ? { ...values }
            : {
                  ...ref.current._searchOptions,
                  ...values,
              }
        ref.current._searchOptions = { ...data }
        ref.current.controller.reset()
    }
    const resetChange = () => {
        formChange({}, true)
    }

    const updateDependencies = useMemo(() => [updateList], [updateList])
    console.log('loading', submitLoading)
    return (
        <ContentLayout
            className={style.layout}
            title='待认证数据'
            titleExtra={
                ignoreData.length > 0 ? (
                    <span onClick={() => openDrawer()} className={style.extraTitle}>
                        <a> {ignoreData.length} </a>条忽略数据
                    </span>
                ) : null
            }
            footer
        >
            <RichTableLayout
                disabledDefaultFooter
                tableProps={{
                    columns: columns,
                }}
                renderSearch={(controller) => {
                    ref.current.controller = controller
                    return (
                        <FormTool
                            bottom={0}
                            resetChange={resetChange}
                            onChange={formChange}
                            dataSource={[
                                {
                                    type: 'inputSearch',
                                    placeholder: '表名搜索',
                                    name: 'keyword',
                                    width: 280,
                                    autoComplete: 'off',
                                },
                                {
                                    type: 'cascader',
                                    placeholder: '路径',
                                    name: 'tablePath',
                                    width: 180,
                                    options: sourcePath,
                                    fieldNames: { label: 'name', value: 'id' },
                                    changeOnSelect: true,
                                },
                            ]}
                        />
                    )
                }}
                requestListFunction={(page, size) => {
                    return getTableData(page, size)
                }}
                editColumnProps={{
                    width: 150,
                    createEditColumnElements: (index, record: any) => {
                        return RichTableLayout.renderEditElements([
                            {
                                label: '信息完善',
                                onClick: () => {
                                    openDetailDrawer(record)
                                },
                                funcCode: '/data_cert/check/edit',
                            },
                            {
                                label: (
                                    <Popconfirm
                                        placement='topRight'
                                        title='忽略后，系统将不再推荐该表为认证数据'
                                        okText='忽略'
                                        cancelText='取消'
                                        onConfirm={() => {
                                            ignore(record)
                                        }}
                                    >
                                        <a>忽略</a>
                                    </Popconfirm>
                                ),
                                funcCode: '/data_cert/check/delete',
                            },
                        ])
                    },
                }}
            />
            {/* <LzTable
        columns={columns}
        searchDataSource={[
          {
            type: 'inputSearch',
            placeholder: '表名搜索',
            name: 'keyword',
            width: 280,
            autoComplete: "off"
          }, {
            type: 'cascader',
            placeholder: '路径',
            name: 'tablePath',
            width: 180,
            options: sourcePath,
            fieldNames: { label: 'name', value: 'id' },
            changeOnSelect: true
          }
        ]}
        request={async (params = {}) => {
          const res = await readTrustData({
            keyword: params.keyword,
            //tablePath: params.tablePath,
            datasourceId: (params.tablePath || [])[0],
            databaseId: (params.tablePath || [])[1],
            page: params.current,
            pageSize: params.pageSize,
            status: 2,
          })
          return {
            data: res.data || [],
            total: res.total,
          }
        }}
        updateDependencies={updateDependencies}
      /> */}
            <DrawerWrap title='忽略数据查看' visible={visible} onClose={closeDrawer} footer={null}>
                <Input.Search style={{ marginBottom: 16 }} placeholder='表名搜索' onChange={searchChange} />
                <LzTable columns={ignoreColumns} dataSource={ignoreData} pagination={false} />
            </DrawerWrap>
            <DrawerWrap
                visible={detailVisible}
                title='表认证详情'
                onClose={closeDetailDrawer}
                footer={
                    true || isNotPass(detailData) ? (
                        <Space>
                            <Button onClick={detailSubmit} type='primary'>
                                提交认证
                            </Button>
                            <Button
                                onClick={() => {
                                    setDetailVisible(false)
                                }}
                            >
                                取消
                            </Button>
                        </Space>
                    ) : null
                }
                className={style.drawerWrap}
            >
                <TrustDetail loading={submitLoading} tableId={ref.current.detailId} otherAlert addTab={props.addTab} getDetailData={getDetailData} updateKey={detailKey} />
            </DrawerWrap>
        </ContentLayout>
    )
}
