import { createTrustTable, deleteTrustData, mapAuthMethod, readTableSourcePath, readTrustData, TreadTrustData } from '@/api/trustData'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { Button, message, Modal, Space, Spin, Tooltip } from 'antd'
import { DrawerWrap, FormTool, Select } from 'cps'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Time } from 'utils'
import ErrorPage from './cps/errorPage'
import TrustForm from './cps/form'
import TrustDetail from './cps/trustDetail'
import style from './index.lees'
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

export default function (props: Component.CompoentProps) {
    /* state */
    const [detailVisible, setDetailVisible] = useState(false)
    const [detailId, setDetailId] = useState()

    const [formVisible, setFormVisible] = useState(false)

    const [createVisible, setCreateVisible] = useState(false)
    const [createCode, setCreateCode] = useState<string>('')
    const [createLoading, setCreateLoading] = useState<boolean>(false)

    const [sourcePath, setSourcePath] = useState<any[]>([])
    // update
    const [updateList, setUpdateList] = useState<boolean>(false)

    /* value */
    const columns = useMemo(
        () => [
            {
                title: '表名',
                dataIndex: 'tableName',
                fixed: 'left',
                width: 260,
                render: (text: any, record: any) => {
                    return (
                        <>
                            <a className={style.tableName}>
                                <label onClick={() => linkToTableDetail(record)}>
                                    {TABLE} {text}
                                </label>
                                {record.invalidSoon && (
                                    <Tooltip title='前往认证详情，完善数据信息'>
                                        <span className={style.invalid} onClick={() => openDetailDrawer(record)}>
                                            即将失效
                                        </span>
                                    </Tooltip>
                                )}
                            </a>
                            <span>{record.tablePath || ''}</span>
                        </>
                    )
                },
            },
            { title: '认证方式', dataIndex: 'authMethod', width: 160, render: (text: any) => mapAuthMethod[text] },
            { title: '操作人', dataIndex: 'operator', width: 160 },
            { title: '认证时间', dataIndex: 'authTime', sorter: true, render: (text: any) => Time.formatTimeDetail(text) },
            /* { title: '操作', width: 150, dataIndex: 'operation', fixed: 'right', render: (text: any, record: any) => {
      return (
        <Space size={'small'} split={<Divider style={{ margin: 0 }} type="vertical" />}>
          <a onClick={() => openDetailDrawer(record)}>认证详情</a>
          <a onClick={() => del(record)}>删除</a>
        </Space>
      )
    } }, */
        ],
        []
    )
    const ref = useRef<{
        createTrustTableId: number | undefined
        createRes: Record<string, any>
        form: { submit: () => Promise<string> }
        controller?: any
        _searchOptions?: any
    }>({ createTrustTableId: undefined, controller: {}, _searchOptions: {}, createRes: {}, form: { submit: () => Promise.resolve('') } })

    /* effect */
    useEffect(() => {
        readTableSourcePath({ status: 1 }).then((res) => {
            if (res.code !== 200) {
                message.error(res.msg || '获取路径异常')
            }
            setSourcePath(res.data || [])
        })
    }, [])

    /* action */
    const del = (data: TreadTrustData) => {
        Modal.confirm({
            title: '删除可信认证表',
            content: '删除后系统将不再自动发现，是否确认删除',
            okText: '删除',
            okType: 'danger',
            okButtonProps: { type: 'primary' },
            cancelText: '取消',
            onOk: () => {
                deleteTrustData({ tableId: data.tableId }).then((res) => {
                    if (res.code == 200) {
                        message.success('删除成功')
                        //setUpdateList(v => !v);
                        ref.current.controller.reset()
                        return Promise.resolve()
                    } else {
                        message.error(res.msg || '删除失败')
                    }
                })
            },
        })
    }
    // 详情弹窗
    const openDetailDrawer = (data: any) => {
        setDetailVisible(true)
        setDetailId(data.tableId)
    }
    // 添加表弹窗
    const closeCreateDrawer = () => {
        setCreateVisible(false)
        // 重置状态
        setCreateCode('')
        ref.current.createRes = {}
    }
    const tableSelectChange = (data: any[]) => {
        console.log('tableChange', data)
        let tableId = (data[2] || {}).id
        ref.current.createTrustTableId = tableId
    }
    const confirmCreateDrawer = () => {
        const tableId = ref.current.createTrustTableId
        if (!tableId) {
            message.warn('请选择可信表')
            return
        }
        setCreateLoading(true)
        createTrustTable({ tableId }).then((res) => {
            if (res.code == 200) {
                const { data = {} } = res || {}
                if (data.code == 1) {
                } else {
                    message.success('添加成功')
                    //setUpdateList(v => !v);
                    ref.current.controller.reset()
                }
                ref.current.createRes = data
                setCreateCode(data.code)
            } else {
                message.error(res.msg || '添加失败')
            }
            setCreateLoading(false)
        })
    }
    const errorClick = () => {
        setCreateCode('')
        ref.current.createRes = {}
    }
    // 可信数据配置
    const openFormDrawer = () => {
        setFormVisible(true)
    }
    const closeForm = () => {
        setFormVisible(false)
    }
    const formOk = () => {
        ref.current.form.submit().then((res) => {
            console.log('after submit')
            if (res === 'success') {
                setFormVisible(false)
            } else {
            }
        })
    }

    const linkToTableDetail = (data: any) => {
        props.addTab('sysDetail', { id: data.tableId }, true)
    }

    const getTableData = async (page: any, size: any, filter: any, sorter: any = {}) => {
        console.log('sorter', sorter)
        const params = { ...ref.current._searchOptions }
        const res = await readTrustData({
            page,
            pageSize: size,
            keyword: params.keyword,
            //tablePath: params.tablePath,
            datasourceId: (params.tablePath || [])[0],
            databaseId: (params.tablePath || [])[1],
            authMethod: params.authMethod,
            status: 1,
            orderByTime: sorter.order ? (sorter.order === 'ascend' ? 1 : 2) : undefined,
        })
        return {
            data: res.data || [],
            total: res.total || 0,
            dataSource: res.data || [],
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

    return (
        <React.Fragment>
            <RichTableLayout
                title='可信数据'
                renderHeaderExtra={() => {
                    return (
                        <Space>
                            <PermissionWrap funcCode='/data_cert/list/edit'>
                                <Button type='primary' ghost style={{ position: 'relative', top: -1 }} onClick={openFormDrawer}>
                                    可信数据配置
                                </Button>
                            </PermissionWrap>
                            <PermissionWrap funcCode='/data_cert/list/add'>
                                <Button style={{ position: 'relative', top: -1 }} onClick={() => setCreateVisible(true)} type='primary'>
                                    添加可信表
                                </Button>
                            </PermissionWrap>
                        </Space>
                    )
                }}
                tableProps={{
                    columns: columns,
                }}
                renderSearch={(controller) => {
                    ref.current.controller = controller
                    return (
                        <FormTool
                            resetChange={resetChange}
                            onChange={formChange}
                            bottom={0}
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
                                },
                                {
                                    type: 'select',
                                    placeholder: '认证方式',
                                    width: 180,
                                    name: 'authMethod',
                                    selectOption: [
                                        { label: '自动发现', value: '0' },
                                        { label: '人工添加', value: '1' },
                                    ],
                                },
                            ]}
                        />
                    )
                }}
                requestListFunction={(page, size, filter, sorter) => {
                    return getTableData(page, size, filter, sorter)
                }}
                editColumnProps={{
                    width: 150,
                    createEditColumnElements: (index, record: any) => {
                        return RichTableLayout.renderEditElements([
                            {
                                label: <a onClick={() => openDetailDrawer(record)}>认证详情</a>,
                            },
                            {
                                label: <a onClick={() => del(record)}>删除</a>,
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
            fieldNames: { label: 'name', value: 'id' }
          }, {
            type: 'select',
            placeholder: '认证方式',
            width: 180,
            name: 'authMethod',
            selectOption: [
              { label: '自动发现', value: '0' },
              { label: '人工添加', value: '1' }
            ]
          }
        ]}
        request={async (params = {}) => {
          console.log('params', params);
          const res = await readTrustData({
            page: params.current,
            pageSize: params.pageSize,
            keyword: params.keyword,
            //tablePath: params.tablePath,
            datasourceId: (params.tablePath || [])[0],
            databaseId: (params.tablePath || [])[1],
            authMethod: params.authMethod,
            status: 1,
            orderByTime:  params.authTime_order ? params.authTime_order === 'ascend' ? 1 : 2 : undefined
          })
          return {
            data: res.data || [],
            total: res.total || 0,
          }
        }}
        updateDependencies={updateDependencies}
      /> */}
            {/* 详情弹窗 */}
            <DrawerWrap
                title='表认证详情'
                visible={detailVisible}
                onClose={() => {
                    setDetailVisible(false)
                }}
                footer={null}
                className={style.drawerWrap}
            >
                <TrustDetail tableId={detailId} addTab={props.addTab} />
            </DrawerWrap>
            {/* 添加可信表 */}
            <DrawerWrap
                title='添加可信表'
                visible={createVisible}
                onClose={closeCreateDrawer}
                onOk={confirmCreateDrawer}
                okLoading={createLoading}
                {...(!createCode ? {} : { footer: null })}
                className={style.drawerWrap}
            >
                <Spin spinning={createLoading}>
                    {!createCode && (
                        <div style={{ padding: '16px 24px 24px 24px' }}>
                            <Select.TableSelect onChange={tableSelectChange} />
                        </div>
                    )}
                    {createCode == '1' && (
                        <div style={{ padding: '16px 24px 24px 24px' }}>
                            <ErrorPage name={ref.current.createRes.tableName} onClick={errorClick} />
                        </div>
                    )}
                    {(createCode == '2' || createCode == '3') && <TrustDetail tableId={ref.current.createRes.tableId} addTab={props.addTab} otherAlert />}
                </Spin>
            </DrawerWrap>
            {/* 可信数据配置 */}
            <DrawerWrap visible={formVisible} title='可信数据认证要求' onClose={closeForm} onOk={formOk}>
                <TrustForm form={ref.current.form} />
            </DrawerWrap>
        </React.Fragment>
    )
}
