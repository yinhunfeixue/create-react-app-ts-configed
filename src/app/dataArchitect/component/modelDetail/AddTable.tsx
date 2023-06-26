import DataArchitectApi from '@/api/DataArchitectApi'
import EmptyIcon from '@/component/EmptyIcon'
import IconFont from '@/component/IconFont'
import DrawerLayout from '@/component/layout/DrawerLayout'
import { Button, Input, List, message, Select } from 'antd'
import { DefaultOptionType } from 'antd/lib/select'
import classNames from 'classnames'
import React, { Key, useEffect, useState } from 'react'
import styles from './AddTable.module.less'

interface IAddTableProps {
    visible: boolean
    onSuccess: () => void
    onCancel: () => void
    modelId: Key
}

interface IFieldValue {
    tableId: Key
    fieldId: Key
    datasourceId: Key
    databaseId: Key
}
/**
 * AddTable
 */
const AddTable: React.FC<IAddTableProps> = (props) => {
    const { visible, onSuccess, onCancel, modelId } = props
    const [inModelValue, setInModelValue] = useState<IFieldValue>()
    const [outModelValue, setOutModelValue] = useState<IFieldValue>()

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (visible) {
            reset()
        }
    }, [visible])

    const requestInModelTableList = async () => {
        return requestTableList(true)
    }

    const requestOutModelTableList = async () => {
        return requestTableList(false)
    }

    const requestTableList = (inModel: boolean) => {
        return DataArchitectApi.requestTableList(modelId, inModel)
            .then((res) => {
                return (res.data || []).map((item: any) => {
                    return {
                        value: item.tableId,
                        label: item.tableName,
                        data: item,
                    }
                })
            })
            .catch(() => {
                return []
            })
    }

    const requestFieldList = async (tableId: Key) => {
        return DataArchitectApi.requestFieldList(tableId)
            .then((res) => {
                return (res.data || []).map((item: any) => {
                    return {
                        value: item.columnId,
                        name: item.columnEnglishName,
                        label: (
                            <>
                                {item.fkType > 1 && <IconFont type='icon-waijian2' />}
                                {item.pkType > 1 && <IconFont type='icon-zhujian2' />}
                                <label>{item.columnEnglishName}</label>
                            </>
                        ),
                    }
                })
            })
            .catch(() => {
                return []
            })
    }

    const reset = () => {
        setInModelValue(undefined)
        setOutModelValue(undefined)
    }

    const validateValue = () => {
        if (!inModelValue) {
            message.error(`请设置“模型内”表和字段`)
            return false
        } else if (!outModelValue) {
            message.error(`请设置“模型外”表和字段`)
            return false
        }

        return true
    }

    const save = () => {
        if (validateValue() && inModelValue && outModelValue) {
            setLoading(true)
            DataArchitectApi.addTableToModel({
                modelId,
                relationTable: {
                    datasourceId: inModelValue.datasourceId,
                    databaseId: inModelValue.databaseId,
                    tableId: inModelValue.tableId,
                    columnId: inModelValue.fieldId,

                    relationDatasourceId: outModelValue.datasourceId,
                    relationDatabaseId: outModelValue.databaseId,
                    relationTableId: outModelValue.tableId,
                    relationColumnId: outModelValue.fieldId,
                },
            })
                .then((res) => {
                    if (res.code === 200) {
                        message.success('添加成功')
                        onSuccess()
                    }
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }

    const cancel = () => {
        onCancel()
    }

    return (
        <DrawerLayout
            drawerProps={{
                visible,
                title: '添加关联关系',
                width: 640,
                onClose: () => cancel(),
            }}
            renderFooter={() => {
                return (
                    <>
                        <Button type='primary' loading={loading} onClick={() => save()}>
                            添加
                        </Button>
                        <Button disabled={loading} onClick={() => cancel()}>
                            取消
                        </Button>
                    </>
                )
            }}
        >
            {visible && (
                <div className={styles.AddTable}>
                    <FieldSelect title='表选择（模型内）' requestTableFun={requestInModelTableList} requestFieldFun={requestFieldList} onChange={(value) => setInModelValue(value)} />
                    <IconFont className={styles.IconLink} type='e734' useCss />
                    <FieldSelect title='关联表选择（模型外）' requestTableFun={requestOutModelTableList} requestFieldFun={requestFieldList} onChange={(value) => setOutModelValue(value)} />
                </div>
            )}
        </DrawerLayout>
    )
}

const FieldSelect = (props: {
    title: string
    requestTableFun: () => Promise<DefaultOptionType[]>
    requestFieldFun: (tableId: Key) => Promise<(DefaultOptionType & { name: string })[]>
    onChange: (value?: IFieldValue) => void
}) => {
    const { title, requestTableFun, requestFieldFun, onChange } = props
    const [tableList, setTableList] = useState<DefaultOptionType[]>([])
    const [selectedTableKey, setSelectedTableKey] = useState<Key>()
    const [keyword, setKeyword] = useState('')

    const [loadingTable, setLoadingTable] = useState(false)
    const [loadingField, setLoadingField] = useState(false)

    const [fieldList, setFieldList] = useState<DefaultOptionType[]>([])
    const [selectedFieldKey, setSelectedFieldKey] = useState<Key>()

    useEffect(() => {
        updateTable()
    }, [])

    useEffect(() => {
        updateFieldList()
    }, [selectedTableKey])

    useEffect(() => {
        triggerChange()
    }, [selectedTableKey, selectedFieldKey])

    const updateTable = () => {
        setLoadingTable(true)
        requestTableFun()
            .then((data) => {
                setTableList(data)
            })
            .finally(() => {
                setLoadingTable(false)
            })
    }

    const updateFieldList = async () => {
        let fieldList: DefaultOptionType[] = []
        if (selectedTableKey) {
            setLoadingField(true)
            fieldList = await requestFieldFun(selectedTableKey)
            setLoadingField(false)
        }
        setFieldList(fieldList)
        setSelectedFieldKey(undefined)
    }

    const triggerChange = () => {
        if (selectedTableKey && selectedFieldKey) {
            const table = tableList.find((item) => item.value == selectedTableKey)
            if (table) {
                onChange({
                    tableId: selectedTableKey,
                    fieldId: selectedFieldKey,
                    ...table.data,
                })
            }
        } else {
            onChange()
        }
    }

    const displayFieldList = keyword ? fieldList.filter((item) => item.name.toLowerCase().includes(keyword.toLowerCase())) : fieldList

    return (
        <div className={styles.FieldSelect}>
            <h4>{title}</h4>
            <Select
                placeholder='数据表'
                allowClear
                loading={loadingTable}
                className={styles.SelectTable}
                options={tableList}
                value={selectedTableKey}
                onChange={(value) => setSelectedTableKey(value)}
            />
            <div className={styles.Body}>
                <header>字段选择</header>
                <main>
                    {/* 未选择表，提示选择表；否则，显示字段 */}
                    {selectedTableKey ? (
                        <>
                            <Input.Search placeholder='字段名' className={styles.InputSearch} loading={loadingField} value={keyword} onChange={(event) => setKeyword(event.target.value)} />
                            <List
                                loading={loadingField}
                                dataSource={displayFieldList}
                                renderItem={(item) => {
                                    const selected = selectedFieldKey === item.value
                                    return (
                                        <div className={classNames(styles.FieldItem, selected ? styles.FieldItemSelected : '')} onClick={() => setSelectedFieldKey(item.value as Key)}>
                                            {item.label}
                                        </div>
                                    )
                                }}
                            />
                        </>
                    ) : (
                        <EmptyIcon description='请先在上方选择表' icon={<img src={require('app_images/dataArchitect/handUp.svg')} />} />
                    )}
                </main>
            </div>
        </div>
    )
}

export default AddTable
