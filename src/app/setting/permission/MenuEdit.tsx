import { requestMenuTree, saveMenuTree } from '@/api/systemApi'
import IMenu from '@/interface/IMenu'
import TreeControl from '@/utils/TreeControl'
import { DownloadOutlined, MinusCircleOutlined, PlusOutlined, RedoOutlined, SaveOutlined, VerticalLeftOutlined, VerticalRightOutlined } from '@ant-design/icons'
import { AutoComplete, Avatar, Button, Card, Input, message, Spin, Tooltip, Tree } from 'antd'
import { EventDataNode } from 'antd/lib/tree'
import Lodash from 'lodash'
import { NodeDragEventParams } from 'rc-tree/lib/contextTypes'
import React, { Component, Key, ReactText } from 'react'
import './MenuEdit.less'

interface IMenuEditSate {
    dataSource: IMenu[]
    historyList: IMenu[][]
    historyIndex: number
    selectedNodeKey?: ReactText

    loadingSave: boolean
}

let tempId = 1

/**
 * MenuEdit
 */
class MenuEdit extends Component<any, IMenuEditSate> {
    constructor(props: any) {
        super(props)
        this.state = {
            dataSource: [],
            historyList: [],
            historyIndex: 0,
            loadingSave: false,
        }
    }

    componentDidMount() {
        this.requestData()
    }

    private requestData() {
        requestMenuTree().then((res) => {
            const dataSource: IMenu[] = res

            const treeControl = new TreeControl<IMenu>()
            treeControl.forEach(dataSource, (item) => (item.tempId = item.column_url))
            this.setState(
                {
                    dataSource,
                },
                () => {
                    this.saveHistory()
                }
            )
        })
    }

    private renderTreeNodeList(dataSource: IMenu[], level: number = 0, parent?: IMenu) {
        return dataSource.map((item) => {
            return (
                <Tree.TreeNode key={item.tempId} title={this.renderNodeTitle(item, level, parent)}>
                    {item.children && this.renderTreeNodeList(item.children, level + 1, item)}
                </Tree.TreeNode>
            )
        })
    }

    private createTempMenu(level: number) {
        const id = ++tempId
        return {
            tempId: id.toString(),
            column_class: '图标',
            column_name: '临时名称',
            column_url: `/临时路径${id}`,
            type: level + 1 < 3 ? 'menu' : 'button',
            rw_type: 0,
        }
    }

    private addNode(targetList: IMenu[], level: number) {
        const newNode = this.createTempMenu(level)
        targetList.push(newNode)
        this.setState({ selectedNodeKey: newNode.tempId })
        this.saveHistory()
    }

    private renderNodeTitle(item: IMenu, level: number, parent?: IMenu) {
        const colors = ['green', '#0fa60f', '#23ed23', 'red']
        const color = colors[level] || 'gray'
        const { dataSource, selectedNodeKey } = this.state
        return (
            <div className='HGroup ItemWrap'>
                <Avatar size='small' style={{ backgroundColor: color }}>
                    {level + 1}
                </Avatar>
                {[
                    {
                        tip: '图标',
                        name: 'column_class',
                        width: 100,
                    },
                    {
                        tip: '名称',
                        name: 'column_name',
                        width: 140,
                    },
                    {
                        tip: '路径',
                        name: 'column_url',
                        width: 400,
                    },
                    {
                        tip: '类型',
                        name: 'type',
                        width: 100,
                        editContent: (
                            <AutoComplete
                                value={item.type}
                                onChange={(value) => {
                                    item.type = value
                                    this.saveHistory()
                                }}
                                options={[
                                    {
                                        value: 'button',
                                    },
                                    {
                                        value: 'menu',
                                    },
                                ]}
                            />
                        ),
                    },
                    {
                        tip: 'rwType（权限类型）',
                        name: 'rw_type',
                        width: 100,
                        editContent: (
                            <AutoComplete
                                value={item.rw_type.toString()}
                                onChange={(value) => {
                                    item.rw_type = Number(value)
                                    this.saveHistory()
                                }}
                                options={[
                                    {
                                        label: '1-view',
                                        value: '1',
                                    },
                                    {
                                        label: '2-edit',
                                        value: '2',
                                    },
                                ]}
                            />
                        ),
                    },
                ].map((controlItem) => {
                    const { tip, name, width, editContent } = controlItem
                    const selected = selectedNodeKey === item.tempId
                    if (selected) {
                        return (
                            <Tooltip title={tip}>
                                {editContent ? (
                                    React.cloneElement(editContent, {
                                        style: { width },
                                    })
                                ) : (
                                    <Input
                                        value={item[name]}
                                        onChange={(event) => {
                                            item[name] = event.target.value.trim()
                                            this.saveHistory()
                                        }}
                                        style={{ width }}
                                    />
                                )}
                            </Tooltip>
                        )
                    }
                    return (
                        <div className='ReadOnlyTitle' style={{ width }}>
                            {item[name] || '-'}
                        </div>
                    )
                })}

                <Button
                    icon={<PlusOutlined />}
                    type='text'
                    onClick={(event) => {
                        event.stopPropagation()
                        if (!item.children) {
                            item.children = []
                        }
                        this.addNode(item.children, level)
                    }}
                />

                <Button
                    icon={<MinusCircleOutlined />}
                    type='text'
                    onClick={(event) => {
                        event.stopPropagation()
                        const list = parent ? parent.children : dataSource
                        if (list) {
                            const index = list.indexOf(item)
                            list.splice(index, 1)
                            this.saveHistory()
                        }
                    }}
                />
            </div>
        )
    }

    private saveHistory() {
        const { historyList, historyIndex, dataSource } = this.state
        const maxHistory = 30

        // 截取到当前步骤之前的数据
        let newHistory = historyList.slice(0, historyIndex + 1)
        if (historyList.length > maxHistory) {
            newHistory = historyList.slice(historyList.length - maxHistory)
        }

        // 添加当前数据
        const cloneData = Lodash.cloneDeep(dataSource)
        newHistory.push(cloneData)

        this.setState({
            historyList: newHistory,
            historyIndex: newHistory.length - 1,
        })
    }

    private goto(index: number) {
        const { historyList } = this.state
        const useIndex = Math.max(0, Math.min(historyList.length - 1, index))

        const useData = Lodash.cloneDeep(historyList[useIndex])
        this.setState({
            dataSource: useData,
            historyIndex: useIndex,
        })
    }

    private back() {
        const { historyIndex } = this.state
        if (this.canBack()) {
            this.goto(historyIndex - 1)
        }
    }

    private next() {
        const { historyIndex } = this.state
        if (this.canNext()) {
            this.goto(historyIndex + 1)
        }
    }

    private canBack() {
        const { historyList, historyIndex } = this.state

        return historyList && historyList.length && historyIndex > 0
    }

    private canNext() {
        const { historyList, historyIndex } = this.state
        return historyList && historyList.length && historyIndex < historyList.length - 1
    }

    private treeDragHandler = (
        info: NodeDragEventParams & {
            dragNode: EventDataNode
            dragNodesKeys: Key[]
            dropPosition: number
            dropToGap: boolean
        }
    ) => {
        const { dragNode, dropToGap, dropPosition, node } = info
        const { dataSource } = this.state

        const treeControl = new TreeControl<IMenu>()

        let target = treeControl.search(dataSource, (item) => item.tempId == dragNode.key)

        if (!target) {
            return
        }

        let newParent: IMenu | null
        let oldParent = treeControl.searchParent(dataSource, (item) => {
            return Boolean(target && item.tempId === target.tempId)
        })
        // 如果是拖到同级
        if (dropToGap) {
            newParent = treeControl.searchParent(dataSource, (item) => item.tempId === node.key)
        }
        // 如果是拖到子级
        else {
            newParent = treeControl.search(dataSource, (item) => item.tempId === node.key)
        }

        // 从旧的位置移除
        const oldList = oldParent ? oldParent.children : dataSource
        let oldIndex = -1
        if (oldList) {
            oldIndex = oldList.findIndex((item) => item === target)
            if (oldIndex >= 0) {
                oldList.splice(oldIndex, 1)
            }
        }

        // 添加到新位置
        const newList = newParent ? newParent.children : dataSource
        if (newList && target) {
            // 如果新旧列表是同一个，且旧位置小于新位置，新位置减1(示例：把第0项在同一列表拖到第2项，相当于要放到第1项)
            let newPostion = dropPosition
            if (oldList === newList && oldIndex < dropPosition) {
                newPostion -= 1
            }
            if (newPostion === -1) {
                newPostion = 0
            }
            newList.splice(newPostion, 0, target)
        }

        this.saveHistory()
    }

    private createSaveData() {
        const { dataSource } = this.state
        const treeControl = new TreeControl<IMenu>()
        const data = treeControl.map(dataSource, (item, index, oldParent, newChildren) => {
            const result: any = { ...item, children: newChildren || [] }
            delete result.tempId
            return result
        })

        return data
    }

    render() {
        const { dataSource, loadingSave } = this.state
        const canBack = this.canBack()
        if (!dataSource || !dataSource.length) {
            return <Spin spinning />
        }
        return (
            <Card
                className='MenuEdit'
                title='菜单设置'
                extra={
                    <div className='HGroup'>
                        <Button disabled={loadingSave || !canBack} type='text' icon={<VerticalRightOutlined />} onClick={() => this.back()}></Button>
                        <Button disabled={loadingSave || !this.canNext()} type='text' icon={<VerticalLeftOutlined />} onClick={() => this.next()}></Button>
                        <Button
                            icon={<SaveOutlined />}
                            loading={loadingSave}
                            type='primary'
                            onClick={() => {
                                const data = this.createSaveData()
                                this.setState({ loadingSave: true })
                                saveMenuTree(data)
                                    .then((res) => {
                                        const { code, msg } = res
                                        if (code === 200) {
                                            message.success(msg)
                                        }
                                    })
                                    .catch(() => {
                                        message.error('保存出错')
                                    })
                                    .finally(() => {
                                        this.setState({ loadingSave: false })
                                    })
                            }}
                        >
                            保存
                        </Button>
                        <Button
                            type='primary'
                            ghost
                            icon={<DownloadOutlined />}
                            onClick={() => {
                                const data = this.createSaveData()
                                const blob = new Blob([Buffer.from(JSON.stringify(data))])

                                const href = document.createElement('a')
                                href.href = URL.createObjectURL(blob)
                                href.download = 'menu.json'
                                href.click()
                            }}
                        >
                            导出JSON
                        </Button>
                        <Button
                            icon={<RedoOutlined />}
                            disabled={loadingSave}
                            danger
                            onClick={() => {
                                this.requestData()
                            }}
                        >
                            重置
                        </Button>
                        <Button
                            disabled={loadingSave}
                            icon={<PlusOutlined />}
                            onClick={() => {
                                this.addNode(dataSource, 0)
                            }}
                        >
                            添加一级菜单
                        </Button>
                    </div>
                }
            >
                <Tree
                    className='OrgStyleTree'
                    defaultExpandAll
                    blockNode
                    draggable
                    showLine={false}
                    onDrop={this.treeDragHandler}
                    onSelect={(keys) => {
                        if (keys.length) {
                            this.setState({ selectedNodeKey: keys[0] })
                        }
                    }}
                >
                    {this.renderTreeNodeList(dataSource)}
                </Tree>
            </Card>
        )
    }
}

export default MenuEdit
