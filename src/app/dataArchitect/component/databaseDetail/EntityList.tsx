import DataArchitectApi from '@/api/DataArchitectApi'
import EntityType from '@/app/dataArchitect/enum/EntityType'
import IEntity from '@/app/dataArchitect/interface/IEntity'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { Button, Input, Select, Tooltip } from 'antd'
import { ColumnProps } from 'antd/lib/table'
import React, { Key, useState } from 'react'
interface IEntityListProps {
    databaseId: Key
}
/**
 * 实体列表
 */
const EntityList: React.FC<IEntityListProps> = (props) => {
    const columns: ColumnProps<IEntity>[] = [
        {
            title: '映射实体',
            render(value, record, index) {
                return record.entityName
            },
        },
        {
            title: '类型',
            render(value, record, index) {
                const color = EntityType.toColor(record.type)
                return <div style={{ display: 'inline-block', border: `1px solid ${color}`, color, padding: `0 8px` }}>{EntityType.toString(record.type)}</div>
            },
        },
        {
            title: '表名',
            render(value, record, index) {
                return record.tableName
            },
        },
        {
            title: '所属模型',
            render(value, record, index) {
                const { modelNames } = record
                return modelNames ? (
                    <Tooltip
                        title={
                            <div>
                                <div style={{ color: '#ccc' }}>所属模型（{modelNames.length}）</div>
                                {modelNames.map((item, index) => {
                                    return <div key={index}>{item}</div>
                                })}
                            </div>
                        }
                    >
                        （{modelNames.length}）{modelNames.join('，')}
                    </Tooltip>
                ) : (
                    ''
                )
            },
        },
    ]

    const { databaseId } = props
    const [inputValue, setInputValue] = useState('')
    const [entityType, setEntityType] = useState<EntityType | undefined>(undefined)

    return (
        <div>
            <RichTableLayout<IEntity>
                smallLayout
                disabledDefaultFooter
                editColumnProps={{
                    hidden: true,
                }}
                renderSearch={(controller) => {
                    return (
                        <React.Fragment>
                            <Input.Search placeholder='表名称' value={inputValue} onSearch={() => controller.reset()} onChange={(event) => setInputValue(event.target.value)} />
                            <Select
                                allowClear
                                placeholder='类型'
                                value={entityType}
                                options={EntityType.ALL.map((item) => {
                                    return {
                                        value: item,
                                        label: EntityType.toString(item),
                                    }
                                })}
                                onChange={(value) => {
                                    setEntityType(value)
                                    controller.reset()
                                }}
                            />
                            <Button
                                onClick={() => {
                                    setInputValue('')
                                    setEntityType(undefined)
                                    controller.reset()
                                }}
                            >
                                重置
                            </Button>
                        </React.Fragment>
                    )
                }}
                requestListFunction={async (page, pageSize) => {
                    const res = await DataArchitectApi.requestEntityListByDatabase({
                        databaseId,
                        page,
                        pageSize,
                        keyword: inputValue,
                        entityType,
                    })

                    const { data, total } = res
                    return {
                        total,
                        dataSource: data,
                    }
                }}
                tableProps={{
                    columns,
                }}
            />
        </div>
    )
}
export default EntityList
