import DataDissectApi from '@/api/DataDissectApi'
import DataDissectSettingItem from '@/app/dataDissect/component/DataDissectSettingItem'
import DataDissectEdit from '@/app/dataDissect/DataDissectEdit'
import DataDissectUtil from '@/app/dataDissect/DataDissectUtil'
import DissectType from '@/app/dataDissect/enum/DissectType'
import IAnalysisResult from '@/app/dataDissect/interface/IAnalysisResult'
import EmptyIcon from '@/component/EmptyIcon'
import IconFont from '@/component/IconFont'
import TableLayout from '@/component/layout/TableLayout'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Cascader, Dropdown, Form, Input, Menu, Modal, Pagination, Select, Spin } from 'antd'
import React, { ReactNode, useEffect, useState } from 'react'
import styles from './DataDissectListPage.module.less'

interface IDataDissectListPageProps {}

interface ISearchParam {
    tableName: string
    dissectType?: DissectType
    databaseValue?: string[]
}
/**
 * DataDissectListPage
 */
const DataDissectListPage: React.FC<IDataDissectListPageProps> = (props) => {
    /**
     * 数据列表
     */
    const [dataSource, setDataSource] = useState<IAnalysisResult[]>([])
    /**
     * 数据总量
     */
    const [total, setTotal] = useState(0)
    /**
     * 当前页码
     */
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(12)
    const [loading, setLoading] = useState(false)
    const [visibleEdit, setVisibleEdit] = useState(false)
    const [editingItem, setEditingItem] = useState<IAnalysisResult | undefined>()
    const [inputValue, setInputValue] = useState('')
    const [loadingEditIcon, setLoadingEditIcon] = useState(false)
    const [databaseTree, setDatabaseTree] = useState([])

    const [searchParams, setSearchParams] = useState<ISearchParam>({
        tableName: '',
    })

    useEffect(() => {
        DataDissectApi.requestDatabaseTree().then((res) => {
            if (res.code === 200) {
                setDatabaseTree(res.data)
            }
        })
    }, [])

    useEffect(() => {
        requestData()
    }, [pageSize, currentPage, searchParams])

    const updateSearchParams = (value: Partial<ISearchParam>) => {
        setCurrentPage(1)
        setSearchParams({ ...searchParams, ...value })
    }

    const requestData = async () => {
        setLoading(true)
        const { tableName, dissectType, databaseValue } = searchParams
        const res = await DataDissectApi.requestResultList({
            page: currentPage,
            pageSize,
            keyword: tableName,
            analysisType: dissectType,
            datasourceId: databaseValue ? databaseValue[0] : undefined,
            databaseId: databaseValue ? databaseValue[1] : undefined,
        })
        setLoading(false)
        setTotal(res.total)
        setDataSource(res.data)
    }

    // 当前条件下无数据
    const isEmpty = !dataSource || !dataSource.length

    // 当前条件下无数据且无搜索条件（说明后台也无数据）
    const isNull = isEmpty && Object.values(searchParams).filter((item) => Boolean(item)).length === 0

    const editItem = (item?: IAnalysisResult) => {
        setEditingItem(item)
        setVisibleEdit(true)
    }

    const gotoDetail = (item: IAnalysisResult) => {
        DataDissectUtil.gotoDetail(item, () => editItem(item))
    }

    const removeItem = (item: IAnalysisResult) => {
        setLoadingEditIcon(true)
        return DataDissectApi.removeConfig(item.tableId)
            .then((res) => {
                if (res.code === 200) {
                    requestData()
                }
            })
            .finally(() => {
                setLoadingEditIcon(false)
            })
    }

    const deleteItem = (item: IAnalysisResult) => {
        Modal.confirm({
            title: '删除数据剖析',
            content: `“${item.tableName}”`,
            okButtonProps: { danger: true },
            okText: '删除',
            onOk: () => removeItem(item),
        })
    }

    const renderHeader = () => {
        // 如果无数据（为空数据且无搜索条件），不显示搜索区域
        if (isNull) {
            return null
        }
        return (
            <React.Fragment>
                <Form layout='inline' className='HControlGroup'>
                    {RenderUtil.renderFormItems([
                        {
                            content: (
                                <Input.Search
                                    value={inputValue}
                                    placeholder='数据表名'
                                    style={{ width: 360 }}
                                    loading={loading}
                                    onSearch={(value) => updateSearchParams({ tableName: value })}
                                    onChange={(event) => {
                                        setInputValue(event.target.value)
                                    }}
                                />
                            ),
                        },
                        {
                            content: (
                                <Cascader
                                    options={databaseTree}
                                    placeholder='系统路径'
                                    value={searchParams.databaseValue}
                                    changeOnSelect
                                    fieldNames={{
                                        value: 'id',
                                        label: 'name',
                                    }}
                                    style={{ width: 200 }}
                                    loading={loading}
                                    onChange={(value) => {
                                        updateSearchParams({
                                            databaseValue: value as string[],
                                        })
                                    }}
                                />
                            ),
                        },
                        {
                            content: (
                                <Select
                                    allowClear
                                    options={DissectType.ALL_LIST.map((item) => {
                                        return {
                                            value: item,
                                            label: DissectType.toString(item),
                                        }
                                    })}
                                    style={{ width: 200 }}
                                    value={searchParams.dissectType}
                                    placeholder='剖析方式'
                                    loading={loading}
                                    onChange={(value) => {
                                        updateSearchParams({ dissectType: value })
                                    }}
                                ></Select>
                            ),
                        },
                        {
                            content: (
                                <Button
                                    loading={loading}
                                    onClick={() => {
                                        updateSearchParams({ tableName: '', dissectType: undefined, databaseValue: undefined })
                                        setInputValue('')
                                    }}
                                >
                                    重置
                                </Button>
                            ),
                        },
                    ])}
                </Form>
            </React.Fragment>
        )
    }

    const renderItemFooterExtra = (item: IAnalysisResult) => {
        return (
            <Dropdown
                overlay={
                    <Menu
                        style={{ width: 120 }}
                        onClick={(info) => info.domEvent.stopPropagation()}
                        items={[
                            {
                                label: '详情',
                                key: 1,
                                onClick: (event) => gotoDetail(item),
                            },
                            {
                                label: '配置',
                                key: 2,
                                onClick: (info) => {
                                    editItem(item)
                                },
                            },
                            {
                                label: '删除',
                                style: {
                                    color: 'rgba(204, 0, 0, 1)',
                                },
                                key: 3,
                                onClick: () => deleteItem(item),
                            },
                        ]}
                    />
                }
                placement='bottomLeft'
            >
                <Spin spinning={loadingEditIcon}>
                    <IconFont className={styles.IconMenu} type='e6a6' useCss onClick={(event) => event.stopPropagation()} />
                </Spin>
            </Dropdown>
        )
    }

    const renderBody = () => {
        if (isEmpty) {
            return renderEmpty()
        }
        return (
            <Spin spinning={loading}>
                <div className='VControlGroup'>
                    <main className={styles.DissectList}>
                        {dataSource.map((item, index) => {
                            return <DataDissectSettingItem key={index} data={item} footerExtra={renderItemFooterExtra(item)} onClick={(event) => gotoDetail(item)} />
                        })}
                    </main>
                    <Pagination
                        showSizeChanger
                        showQuickJumper
                        showTotal={(total) => (
                            <span>
                                总数 <b>{ProjectUtil.formNumber(total)}</b> 条
                            </span>
                        )}
                        pageSize={pageSize}
                        pageSizeOptions={[12, 24, 36]}
                        total={total}
                        current={currentPage}
                        onChange={(page, pageSize) => {
                            setPageSize(pageSize)
                            setCurrentPage(page)
                        }}
                    />
                </div>
            </Spin>
        )
    }

    const renderEmpty = () => {
        let description: ReactNode = ''
        if (loading) {
            description = null
        } else if (isNull) {
            description = (
                <span>
                    方便了解数据真实情况，你可以<a onClick={() => editItem()}>添加剖析对象</a>
                </span>
            )
        } else {
            description = '暂无数据'
        }
        return (
            <Spin spinning={loading}>
                <EmptyIcon
                    style={{ backgroundColor: 'white', padding: `80px 0 150px 0`, margin: 0 }}
                    title={loading ? '数据加载中...' : '暂无剖析内容'}
                    icon={
                        <div className={styles.EmptyIcon}>
                            <img src={require('app_images/dataDissect/emptyIcon.png')} />
                        </div>
                    }
                    description={description}
                />
            </Spin>
        )
    }

    return (
        <React.Fragment>
            <TableLayout
                disabledDefaultFooter
                className={styles.DataDissectListPage}
                title='数据剖析'
                renderHeaderExtra={() => {
                    return (
                        <Button type='primary' onClick={() => editItem()}>
                            添加剖析
                        </Button>
                    )
                }}
                mainStyle={{ backgroundColor: 'transparent' }}
                renderDetail={renderHeader}
                renderTable={renderBody}
            />
            <DataDissectEdit
                visible={visibleEdit}
                onClose={() => setVisibleEdit(false)}
                onSuccess={() => {
                    setVisibleEdit(false)
                    requestData()
                }}
                data={editingItem}
            />
        </React.Fragment>
    )
}
export default DataDissectListPage
