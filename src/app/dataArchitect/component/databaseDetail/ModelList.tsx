import DataArchitectApi from '@/api/DataArchitectApi'
import ModelItem from '@/app/dataArchitect/component/ModelItem'
import ModelStatus from '@/app/dataArchitect/enum/ModelStatus'
import IModel from '@/app/dataArchitect/interface/IModel'
import EmptyIcon from '@/component/EmptyIcon'
import { Alert, Button, Input, Pagination, Select, Spin } from 'antd'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import styles from './ModelList.module.less'

interface IModelListProps {
    databaseId: string
}
/**
 * 模型列表
 */
const ModelList: React.FC<IModelListProps> = (props) => {
    const { databaseId } = props
    const [offlineMsg, setOfflineMsg] = useState(0)
    const [modelList, setModelList] = useState<IModel[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(false)
    const [pageSize, setPageSize] = useState(12)
    const [inputValue, setInputValue] = useState('')

    const [searchParams, setSearchParams] = useState<{ keyword?: string; status?: ModelStatus }>({})

    const updateSearchParams = (value: typeof searchParams) => {
        setSearchParams({
            ...searchParams,
            ...value,
        })
    }

    useEffect(() => {
        requestOfflineMessage()
    }, [databaseId])

    useEffect(() => {
        requestModelList()
    }, [databaseId, currentPage, pageSize, searchParams])

    const requestOfflineMessage = async () => {
        DataArchitectApi.requestOfflineCount(databaseId).then((res) => {
            setOfflineMsg(res.msg)
        })
    }

    const requestModelList = async () => {
        setLoading(true)
        const res = await DataArchitectApi.requestModelListByDatabaseId({ databaseId, page: currentPage, pageSize, keyword: searchParams.keyword, modelStatus: searchParams.status })
        const { total, data } = res
        setLoading(false)
        setTotal(total)
        setModelList(data || [])
    }

    const hasData = modelList && modelList.length

    return (
        <div className={classNames('VControlGroup', styles.ModelList)}>
            {offlineMsg ? <Alert type='warning' message={offlineMsg} showIcon /> : null}
            <div className='HControlGroup'>
                <Input.Search
                    placeholder='模型名称'
                    loading={loading}
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onSearch={(value) => {
                        setCurrentPage(1)
                        updateSearchParams({ keyword: value })
                    }}
                />
                <Select
                    allowClear
                    options={ModelStatus.ALL.map((item) => ({
                        value: item,
                        label: ModelStatus.toString(item),
                    }))}
                    placeholder='状态'
                    loading={loading}
                    value={searchParams.status}
                    onChange={(value) => {
                        setCurrentPage(1)
                        updateSearchParams({ status: value })
                    }}
                />
                <Button
                    loading={loading}
                    onClick={() => {
                        setInputValue('')
                        updateSearchParams({
                            keyword: '',
                            status: undefined,
                        })
                        setCurrentPage(1)
                    }}
                >
                    重置
                </Button>
            </div>
            <Spin spinning={loading}>
                <div className='VControlGroup'>
                    {/* 模型列表 */}
                    {hasData ? (
                        <>
                            <div className={styles.ModelGroup}>
                                {modelList.map((item, index) => {
                                    return <ModelItem key={index} data={item} onUpdate={() => requestModelList()} />
                                })}
                            </div>
                            <Pagination
                                total={total}
                                showTotal={(total) => (
                                    <span>
                                        总数 <b>{total}</b> 条
                                    </span>
                                )}
                                pageSize={pageSize}
                                pageSizeOptions={[12, 24, 36]}
                                current={currentPage}
                                showQuickJumper
                                showSizeChanger={true}
                                onChange={(page, pageSize) => {
                                    setCurrentPage(page)
                                    setPageSize(pageSize)
                                }}
                            />
                        </>
                    ) : (
                        <EmptyIcon />
                    )}
                </div>
            </Spin>
        </div>
    )
}
export default ModelList
