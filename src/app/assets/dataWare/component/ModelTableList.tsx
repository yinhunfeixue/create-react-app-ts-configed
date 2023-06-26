// 模型的表列表
import DataArchitectApi from '@/api/DataArchitectApi'
import { requestFieldList } from '@/api/graphApi'
import AddTable from '@/app/dataArchitect/component/modelDetail/AddTable'
import EmptyLabel from '@/component/EmptyLabel'
import IconFont from '@/component/IconFont'
import RichTableLayout, { IRichTableLayoutContoler } from '@/component/layout/RichTableLayout'
import PageUtil from '@/utils/PageUtil'
import { Input, Table } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import classNames from 'classnames'
import React, { Key, useState } from 'react'
import styles from './ModelTableList.module.less'

interface IModelTableListProps {
    modelId: Key
}
/**
 * ModelTableList
 */
const ModelTableList: React.FC<IModelTableListProps> = (props) => {
    const { modelId } = props
    const [keyword, setKeyword] = useState('')
    const [visibleAddTable, setVisibleAddTable] = useState(false)
    const [expandAll, setExpandAll] = useState(false)

    let tableController: IRichTableLayoutContoler<any>

    const columns: ColumnProps<any>[] = [
        {
            title: '表英文名',
            dataIndex: 'tableEnglishName',
        },
        {
            title: '表中文名',
            dataIndex: 'tableChineseName',
        },
        {
            title: '映射实体',
            dataIndex: 'mapEntityName',
            render(value, record, index) {
                return (
                    <span>
                        <span>{record.mapEntityName}</span>
                        {record.isMainEntity && (
                            <span style={{ display: 'inline-block', color: 'white', backgroundColor: 'rgba(255, 153, 0, 1)', width: 16, lineHeight: '16px', textAlign: 'center', marginLeft: 6 }}>
                                主
                            </span>
                        )}
                    </span>
                )
            },
        },
        {
            title: '实体类型',
            dataIndex: 'entityTypeDesc',
        },
        {
            title: '关联关系（模型内/外）',
            render(value, record, index) {
                return (
                    <a>
                        {record.relationInModel}/{record.relationOutModel}
                    </a>
                )
            },
        },
    ]

    return (
        <>
            <RichTableLayout<any>
                disabledDefaultFooter
                editColumnProps={{
                    hidden: true,
                }}
                smallLayout
                renderSearch={(controller) => {
                    tableController = controller
                    return (
                        <>
                            <Input.Search
                                placeholder='表名'
                                style={{ width: 400 }}
                                onSearch={(value) => {
                                    setKeyword(value)
                                    tableController.reset()
                                }}
                            />
                        </>
                    )
                }}
                requestListFunction={async () => {
                    const res = await DataArchitectApi.requestModelInfoTableList({
                        modelId,
                        tableName: keyword || undefined,
                    })
                    const modelTableList = res.data || []
                    // 异表请求字段列表
                    for (const item of modelTableList) {
                        const { tableId } = item
                        item.fieldList = []
                        requestFieldList(tableId).then((fieldListRes) => {
                            item.fieldList = fieldListRes.data
                        })
                    }
                    return {
                        total: modelTableList.length,
                        dataSource: modelTableList,
                    }
                }}
                tableProps={{
                    key: 'tableId',
                    columns,
                    extraTableProps: {
                        key: expandAll,
                        expandable: {
                            defaultExpandAllRows: expandAll,
                            columnTitle: <IconFont type={expandAll ? 'icon-zhankai3' : 'icon-shouqi3'} onClick={() => setExpandAll(!expandAll)} />,
                            rowExpandable: (record) => Boolean(record.fieldList),
                            expandedRowRender: (record) => {
                                const { fieldList } = record
                                return (
                                    <Table
                                        rowKey='columnId'
                                        dataSource={fieldList}
                                        pagination={false}
                                        columns={[
                                            {
                                                title: '字段英文名',
                                                dataIndex: 'physicalField',
                                            },
                                            {
                                                title: '字段中文名',
                                                dataIndex: 'physicalFieldDesc',
                                            },
                                            {
                                                title: '字段类型',
                                                dataIndex: 'dataType',
                                            },
                                            {
                                                title: '数据标准',
                                                dataIndex: 'columnStandardCname',
                                                render(value, record, index) {
                                                    return value ? (
                                                        <a
                                                            onClick={() => {
                                                                let query = {
                                                                    entityId: record.columnStandardCode,
                                                                    id: record.columnStandardCode,
                                                                }
                                                                PageUtil.addTab('标准详情', query, true)
                                                            }}
                                                        >
                                                            {value}
                                                        </a>
                                                    ) : (
                                                        <EmptyLabel />
                                                    )
                                                },
                                            },
                                            {
                                                title: '安全等级',
                                                dataIndex: 'securityLevel',
                                            },
                                            {
                                                title: '安全分类',
                                                dataIndex: 'securityClassPath',
                                            },
                                            {
                                                title: '其他信息',
                                                dataIndex: 'columnStandardEname',
                                                render: (text: string, record: any) => {
                                                    return (
                                                        <div className={styles.otherInfo}>
                                                            {[
                                                                {
                                                                    label: '敏感',
                                                                    selected: record.desensitiseTag,
                                                                },
                                                                {
                                                                    label: '质量',
                                                                    selected: record.qaRuleList,
                                                                },
                                                                {
                                                                    label: '代码项',
                                                                    selected: record.codeItem,
                                                                },
                                                            ].map((item, index) => {
                                                                return <div className={classNames(styles.otherInfoItem, item.selected ? styles.otherInfoItemSelected : '')}>{item.label}</div>
                                                            })}
                                                        </div>
                                                    )
                                                },
                                            },
                                        ].map((item) => {
                                            const defaultRender = (_: string, record: any) => {
                                                return record[item.dataIndex] || <EmptyLabel />
                                            }
                                            return {
                                                ...item,
                                                render: item.render || defaultRender,
                                            }
                                        })}
                                    />
                                )
                            },
                        },
                    },
                }}
            />
            <AddTable
                modelId={modelId}
                visible={visibleAddTable}
                onSuccess={() => {
                    setVisibleAddTable(false)
                    tableController.reset()
                }}
                onCancel={() => setVisibleAddTable(false)}
            />
        </>
    )
}
export default ModelTableList
