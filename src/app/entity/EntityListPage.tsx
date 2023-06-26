import { sortNodes } from '@/api/dataSecurity'
import EntityApi from '@/api/EntityApi'
import DataWareDetailDrawer from '@/app/dama/dataSecurity/dataCategory/component/detailDrawer'
import EntityType from '@/app/dataArchitect/enum/EntityType'
import IEntity from '@/app/dataArchitect/interface/IEntity'
import TopicFieldEdit from '@/app/entity/component/TopicFieldEdit'
import EntityEditModal from '@/app/entity/EntityEditModal'
import ITopicField from '@/app/entity/interface/ITopicField'
import RichTableLayout, { IRichTableLayoutContoler } from '@/component/layout/RichTableLayout'
import SliderLayout from '@/component/layout/SliderLayout'
import { SearchTree } from '@/components'
import { defaultTitleRender } from '@/components/trees/SearchTree'
import TreeControl from '@/utils/TreeControl'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Input, Modal, Select, Tooltip } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import styles from './EntityListPage.module.less'

interface IEntityListPageProps {}

const useDwTheme = () => {
    const [dwThemeData, setDwThemeData] = useState<any>({})

    const request = () => {
        EntityApi.requestTopicTree().then((res) => {
            const { data = {} } = res
            setDwThemeData(data)
        })
    }

    useEffect(() => {
        request()
    }, [])

    return [dwThemeData, request]
}
/**
 * EntityListPage
 */
const EntityListPage: React.FC<IEntityListPageProps> = (props) => {
    const [visibleEdit, setVisibleEdit] = useState(false)
    const [editingItem, setEditingItem] = useState<IEntity | undefined>()
    const [selectTopic, setSelectTopic] = useState<any>(undefined)

    const [inputValue, setInputValue] = useState('')
    const [entityType, setEntityType] = useState<EntityType | undefined>(undefined)

    const [dwThemeData, updateDwThemeData] = useDwTheme()

    // 主题域start
    const [visileTopicFieldEdit, setVisileTopicFieldEdit] = useState(false)
    const [editingTopic, setEditingTopic] = useState<ITopicField>()
    const [editingParentTopic, setEditingParentTopic] = useState<ITopicField>()
    // 主题域end

    const treeData = dwThemeData ? dwThemeData.children : []

    const editItem = (item?: IEntity) => {
        setEditingItem(item)
        setVisibleEdit(true)
    }

    const editTopicField = (item?: ITopicField, parentTarget?: ITopicField) => {
        setVisileTopicFieldEdit(true)
        setEditingTopic(item)
        setEditingParentTopic(parentTarget)
    }

    const selectedChain = selectTopic ? new TreeControl().searchChain(treeData, (node) => node.id === selectTopic.id) : []
    let tableController: IRichTableLayoutContoler<IEntity>

    useEffect(() => {
        tableController.reset()
    }, [entityType, selectTopic])

    const dwDetailRef = useRef<any>(null)

    return (
        <React.Fragment>
            <SliderLayout
                className={styles.EntityListPage}
                style={{ height: '100%' }}
                sliderBodyStyle={{ padding: 0 }}
                renderSliderHeader={() => {
                    return (
                        <div className={styles.SliderHeader}>
                            <span>
                                <span>主题域</span>
                                <em>拖拽可排序</em>
                            </span>
                            <Tooltip title='添加主题域'>
                                <Button type='text' icon={<PlusOutlined />} onClick={() => editTopicField()} />
                            </Tooltip>
                        </div>
                    )
                }}
                renderSliderBody={() => {
                    return (
                        <SearchTree
                            treeProps={{
                                treeData,
                                fieldNames: { key: 'id', title: 'name' },
                                onSelect: (_, info: any) => setSelectTopic(info.node),
                                draggable: {
                                    icon: false,
                                },
                                className: 'draggable-tree',
                                allowDrop: (option) => {
                                    const { dropPosition, dragNode, dropNode } = option
                                    //   只能在同级之间拖动（拖到同组结点的上（position=-1)、下(position=1)，或者拖到父结点的第0个)
                                    return (dragNode.parentId === dropNode.parentId && dropPosition !== 0) || (dragNode.parentId === dropNode.id && dropPosition === 0)
                                },
                                onDrop: (info) => {
                                    const { dropPosition, dragNode } = info
                                    // 找到被拖动节点所在的结点列表
                                    let list: any[] = treeData
                                    if (dragNode.parentId !== '0') {
                                        const parentNode = new TreeControl().search(treeData, (node) => node.id === dragNode.parentId)
                                        if (parentNode) {
                                            list = parentNode.children
                                        } else {
                                            list = []
                                        }
                                    }

                                    // 如果list有值，整理顺序，并保存到服务器
                                    const idList: string[] = list.map((item) => item.id)
                                    idList.splice(dropPosition, 0, dragNode.id)

                                    const oldIndex = idList.findIndex((item, index) => item === dragNode.id && index !== dropPosition)
                                    idList.splice(oldIndex, 1)

                                    sortNodes(idList).then(() => {
                                        updateDwThemeData()
                                    })
                                },
                            }}
                            treeTitleRender={(node: any, keywords) => {
                                return defaultTitleRender(node, (data) => {
                                    return {
                                        title: data.name,
                                        menuList: [
                                            {
                                                key: 'edit',
                                                label: '详情',
                                                onClick: () => {
                                                    if (dwDetailRef.current) {
                                                        dwDetailRef.current.openModal(data)
                                                    }
                                                },
                                            },
                                            {
                                                key: 'detail',
                                                label: '编辑',
                                                onClick: () => editTopicField(data),
                                            },
                                            {
                                                key: 'addChild',
                                                label: '添加子主题',
                                                onClick: () => editTopicField(undefined, data),
                                            },
                                            {
                                                key: 'delete',
                                                label: (
                                                    <span
                                                        className='ErrorColor'
                                                        onClick={() => {
                                                            Modal.confirm({
                                                                title: `删除“${data.name || ''}”`,
                                                                content: '是否确认删除分类',
                                                                okText: '删除',
                                                                okButtonProps: {
                                                                    danger: true,
                                                                },
                                                                onOk: () => {
                                                                    EntityApi.deleteTopic(data.id).then((res) => {
                                                                        if (res.code === 200) {
                                                                            updateDwThemeData()
                                                                        }
                                                                    })
                                                                },
                                                            })
                                                        }}
                                                    >
                                                        删除
                                                    </span>
                                                ),
                                            },
                                        ],
                                    }
                                })
                            }}
                        />
                    )
                }}
                renderContentHeaderExtra={() => {
                    return (
                        <React.Fragment>
                            <Button type='primary' onClick={() => editItem()}>
                                新增实体
                            </Button>
                        </React.Fragment>
                    )
                }}
                renderContentHeader={() => {
                    return selectedChain ? selectedChain.map((item) => item.name).join(' / ') : ''
                }}
                renderContentBody={() => {
                    return (
                        <RichTableLayout<IEntity>
                            smallLayout
                            disabledDefaultFooter
                            tableProps={{
                                key: 'entityId',
                                columns: [
                                    {
                                        title: '实体',
                                        width: 120,
                                        render(value, record, index) {
                                            return record.entityName
                                        },
                                    },
                                    {
                                        title: '类型',
                                        width: 120,
                                        render(value, record, index) {
                                            const { type } = record
                                            const color = EntityType.toColor(type)
                                            return (
                                                <div style={{ border: `1px solid ${color}`, color, padding: `0 8px`, display: 'inline-block', fontSize: 12 }}>{EntityType.toString(record.type)}</div>
                                            )
                                        },
                                    },
                                    {
                                        title: '描述',
                                        render(value, record, index) {
                                            return record.desc
                                        },
                                    },
                                    {
                                        title: '所属主题域',
                                        width: 120,
                                        render(value, record, index) {
                                            return record.topicPath
                                        },
                                    },
                                ],
                            }}
                            deleteFunction={async (keys) => {
                                const res = await EntityApi.deleteEntity(keys[0])
                                return res.code === 200
                            }}
                            renderSearch={(controller) => {
                                tableController = controller
                                return (
                                    <>
                                        <Input.Search placeholder='搜索实体' value={inputValue} onChange={(event) => setInputValue(event.target.value)} onSearch={() => tableController.reset()} />
                                        <Select
                                            allowClear
                                            placeholder='实体类型'
                                            options={EntityType.ALL.map((item) => {
                                                return {
                                                    value: item,
                                                    label: EntityType.toString(item),
                                                }
                                            })}
                                            value={entityType}
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
                                    </>
                                )
                            }}
                            deleteTitle='删除实体'
                            deleteContent='是否确认删除实体'
                            editColumnProps={{
                                width: 120,
                                createEditColumnElements(index, item, defaultElement) {
                                    return RichTableLayout.renderEditElements([
                                        {
                                            label: '编辑',
                                            onClick: () => editItem(item),
                                        },
                                    ]).concat(defaultElement)
                                },
                            }}
                            requestListFunction={async (page, pageSize) => {
                                const res = await EntityApi.requestEntityList({ page, pageSize, entityName: inputValue, type: entityType, topicId: selectTopic ? selectTopic.id : '' })
                                const { total, data } = res
                                return { total, dataSource: data }
                            }}
                        />
                    )
                }}
            />
            <EntityEditModal
                target={editingItem}
                visible={visibleEdit}
                onCancel={() => setVisibleEdit(false)}
                onOk={() => {
                    setVisibleEdit(false)
                    tableController.reset()
                }}
            />

            <TopicFieldEdit
                treeId={dwThemeData.id}
                visible={visileTopicFieldEdit}
                target={editingTopic}
                parentTarget={editingParentTopic}
                onClose={() => setVisileTopicFieldEdit(false)}
                onSuccess={() => {
                    setVisileTopicFieldEdit(false)
                    updateDwThemeData()
                }}
            />

            <DataWareDetailDrawer type='dataWare' ref={dwDetailRef} />
        </React.Fragment>
    )
}
export default EntityListPage
