import { requestDeleteTopic, requestSortTopic } from '@/api/kpiChartApi'
import ITopic from '@/app/kpiCharts/interface/ITopic'
import IComponentProps from '@/base/interfaces/IComponentProps'
import IconFont from '@/component/IconFont'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { message, Modal } from 'antd'
import React, { Component, ReactNode, useRef } from 'react'
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import './TopicList.less'

interface ITopicListState {}
interface ITopicListProps extends IComponentProps {
    topicList: ITopic[]
    onDelete: (id: string) => void
    onEdit: (topic?: ITopic) => void

    onSortChange: (list: ITopic[]) => void
}
const maxTopic = 5
/**
 * TopicList
 */
class TopicList extends Component<ITopicListProps, ITopicListState> {
    private renderTopicItem(data: ITopic) {
        const { id, name, panelNum, defaultTheme } = data
        const isDefault = defaultTheme === 1
        const { onEdit } = this.props
        return (
            <div key={id} className='TopicItem'>
                <div className='NameContainer'>
                    <div className='IconWrap'>
                        <IconFont type='icon-zhuti' style={{ fontSize: 20 }} />
                    </div>

                    <span>
                        {name}（{panelNum}）
                    </span>
                    {isDefault && <span className='IconDefault'>默认</span>}
                </div>
                <div className='TopicItemExtraGroup'>
                    <a onClick={() => onEdit(data)}>编辑</a>
                    {!isDefault && <a onClick={() => this.deleteItem(data)}>删除</a>}
                </div>
            </div>
        )
    }

    private DraggableTopicItem(props: { data: ITopic; index: number; children: ReactNode; dropHandler: (dragId: string, dropId: string) => void }) {
        const type = 'boardItem'
        const { data, dropHandler, index, children } = props

        const [, drag] = useDrag({
            item: { data, type, index },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        })

        const [{ isOver, dropClassName }, drop] = useDrop({
            accept: type,
            drop: (item, monitor) => {
                dropHandler((item as any).data.id, data.id)
            },
            collect(monitor) {
                const { index: dragIndex } = monitor.getItem() || {}
                if (index === dragIndex) {
                    return {}
                }
                return {
                    isOver: monitor.isOver(),
                    dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
                }
            },
        })

        const ref = useRef<HTMLDivElement>(null)

        drag(drop(ref))

        return (
            <div ref={ref} className={isOver ? dropClassName : ''}>
                {children}
            </div>
        )
    }

    private deleteItem(data: ITopic) {
        const { id, name } = data
        const { onDelete } = this.props
        Modal.confirm({
            title: `删除主题“${name}”`,
            icon: <ExclamationCircleFilled />,
            okText: '删除',
            okButtonProps: {
                danger: true,
            },
            content: `删除包括主题下的所有统计看板，您确定删除该主题吗？`,
            onOk: () => {
                requestDeleteTopic(id).then((res) => {
                    const { code, msg } = res
                    if (code === 200) {
                        message.success(msg)
                        onDelete(id)
                    } else {
                        message.error(msg)
                    }
                })
            },
        })
    }

    private moveTopic = (topicId: string, toId: string) => {
        const { topicList: oldTopicList, onSortChange } = this.props
        const topicList = oldTopicList.concat()
        const topicIndex = topicList.findIndex((item) => item.id === topicId)
        const toIndex = topicList.findIndex((item) => item.id === toId)
        if (topicIndex >= 0 && toIndex >= 0) {
            // 先请求保存，保存成功后再修改本地数据

            const board = topicList[topicIndex]
            topicList.splice(topicIndex, 1)
            topicList.splice(toIndex, 0, board)
            requestSortTopic(topicList.map((item) => item.id)).then((res) => {
                const { code, msg } = res
                if (code === 200) {
                    onSortChange(topicList)
                    message.success(msg)
                } else {
                    message.error(msg)
                }
            })
        }
    }

    render() {
        const { topicList, onEdit } = this.props
        const addEnable = topicList.length < maxTopic
        return (
            <DndProvider backend={HTML5Backend}>
                <div className='TopicList'>
                    <header>
                        <div className='HControlGroup'>
                            <span>主题管理</span>
                            <em>拖动可调整主题顺序</em>
                        </div>
                        <a
                            onClick={() => {
                                if (addEnable) {
                                    onEdit()
                                } else {
                                    message.warn(`最多添加 ${maxTopic} 个主题`)
                                }
                            }}
                        >
                            + 新增（{topicList.length}/{maxTopic}）
                        </a>
                    </header>
                    <div className='TopicGroup'>
                        {topicList.map((item, index) => {
                            return (
                                <this.DraggableTopicItem index={index} data={item} dropHandler={this.moveTopic}>
                                    {this.renderTopicItem(item)}
                                </this.DraggableTopicItem>
                            )
                        })}
                    </div>
                </div>
            </DndProvider>
        )
    }
}

export default TopicList
