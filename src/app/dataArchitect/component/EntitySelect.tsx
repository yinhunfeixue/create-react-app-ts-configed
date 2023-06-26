import DataArchitectApi from '@/api/DataArchitectApi'
import EntityApi from '@/api/EntityApi'
import EntityType from '@/app/dataArchitect/enum/EntityType'
import IEntity from '@/app/dataArchitect/interface/IEntity'
import IconFont from '@/component/IconFont'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { useDwTheme } from '@/hooks/select'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Cascader, Input, message, Modal, Radio, Select } from 'antd'
import { ValueType } from 'rc-cascader/lib/Cascader'
import React, { Key, useEffect, useState } from 'react'
interface IEntitySelectProps {
    onChange: (value: Key, item: IEntity) => void
    value?: Partial<IEntity>
    tableId: Key
}
/**
 * EntitySelect
 */
const EntitySelect: React.FC<IEntitySelectProps> = (props) => {
    const { onChange, value, tableId } = props
    const [visible, setVisible] = useState(false)
    const [selectItem, setSelectItem] = useState<IEntity | undefined>(undefined)

    const [searchType, setSearchType] = useState(undefined)
    const [inputValue, setInputValue] = useState('')
    const [topicValue, setTopicValue] = useState<ValueType>([])

    const [loadingSave, setLoadingSave] = useState(false)

    const themeList = useDwTheme(false)

    useEffect(() => {
        setSelectItem(value as IEntity)
    }, [value])

    useEffect(() => {
        if (visible) {
            reset()
        }
    }, [visible])

    const reset = () => {
        setSearchType(undefined)
        setInputValue('')
        setTopicValue([])
    }

    const save = () => {
        if (selectItem) {
            setLoadingSave(true)
            DataArchitectApi.requestLinkEntityAndTable({
                entityId: selectItem.entityId,
                tableId,
                oldEntityId: value ? value.entityId : undefined,
            })
                .then((res) => {
                    if (res.code === 200) {
                        setVisible(false)
                        onChange(selectItem.entityId, selectItem)
                    } else {
                        setSelectItem(value as IEntity)
                    }
                })
                .finally(() => {
                    setLoadingSave(false)
                })
        }
    }

    return (
        <>
            <a onClick={() => setVisible(true)}>{value ? value.entityName : <PlusOutlined />}</a>
            <Modal
                title='映射实体'
                visible={visible}
                width={800}
                destroyOnClose
                onCancel={() => setVisible(false)}
                footer={
                    <div className='HControlGroup' style={{ justifyContent: 'space-between' }}>
                        {selectItem ? (
                            <span className='HControlGroup'>
                                <span>已选：{selectItem.entityName}</span>
                                <IconFont onClick={() => setSelectItem(undefined)} type='e67f' useCss style={{ cursor: 'pointer', color: 'rgba(204, 0, 0, 1)' }} />
                            </span>
                        ) : (
                            <span />
                        )}
                        <div>
                            <Button disabled={loadingSave} onClick={() => setVisible(false)}>
                                取消
                            </Button>
                            <Button
                                loading={loadingSave}
                                type='primary'
                                onClick={() => {
                                    if (!selectItem) {
                                        message.info(`请选择`)
                                        return
                                    }

                                    save()
                                }}
                            >
                                确定
                            </Button>
                        </div>
                    </div>
                }
            >
                {visible && (
                    <RichTableLayout<IEntity>
                        disabledDefaultFooter
                        smallLayout
                        editColumnProps={{
                            hidden: true,
                        }}
                        renderSearch={(controller) => {
                            return (
                                <>
                                    <Input.Search
                                        placeholder='实体名称'
                                        value={inputValue}
                                        onChange={(event) => setInputValue(event.target.value)}
                                        onSearch={() => {
                                            controller.reset()
                                        }}
                                    />
                                    <Select
                                        placeholder='实体类型'
                                        allowClear
                                        options={EntityType.ALL.map((item) => {
                                            return {
                                                value: item,
                                                label: EntityType.toString(item),
                                            }
                                        })}
                                        value={searchType}
                                        onChange={(value) => {
                                            setSearchType(value)
                                            controller.reset()
                                        }}
                                    />
                                    <Cascader
                                        value={topicValue}
                                        fieldNames={{ label: 'name', value: 'id' }}
                                        placeholder='主题域'
                                        options={themeList.children || []}
                                        onChange={(value) => {
                                            setTopicValue(value)
                                            controller.reset()
                                        }}
                                    />
                                    <Button
                                        onClick={() => {
                                            setInputValue('')
                                            setSearchType(undefined)
                                            setTopicValue([])
                                            controller.reset()
                                        }}
                                    >
                                        重置
                                    </Button>
                                </>
                            )
                        }}
                        tableProps={{
                            columns: [
                                {
                                    width: 40,
                                    render(value, record, index) {
                                        const selected = selectItem && selectItem.entityId === record.entityId
                                        return <Radio checked={selected} onClick={() => setSelectItem(record)} />
                                    },
                                },
                                {
                                    title: '实体',
                                    render(value, record, index) {
                                        return record.entityName
                                    },
                                },
                                {
                                    title: '类型',
                                    render(value, record, index) {
                                        const color = EntityType.toColor(record.type)
                                        return <div style={{ color, border: `1px solid ${color}`, padding: '0 8px', display: 'inline-block' }}>{EntityType.toString(record.type)}</div>
                                    },
                                },
                                {
                                    title: '所属主题域',
                                    render(value, record, index) {
                                        return record.topicPath
                                    },
                                },
                            ],
                        }}
                        requestListFunction={(page, pageSize) => {
                            return EntityApi.requestEntityList({
                                page,
                                pageSize,
                                entityName: inputValue,
                                type: searchType,
                                topicId: topicValue && topicValue.length ? (topicValue[topicValue.length - 1] as string) : undefined,
                            }).then((res) => {
                                return {
                                    total: res.total,
                                    dataSource: res.data,
                                }
                            })
                        }}
                    />
                )}
            </Modal>
        </>
    )
}
export default EntitySelect
