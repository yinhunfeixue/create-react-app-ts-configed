import IComponentProps from '@/base/interfaces/IComponentProps'
import IconFont from '@/component/IconFont'
import { IPermission } from '@/interface/IPermission'
import TreeControl from '@/utils/TreeControl'
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons'
import { Checkbox, Input, Tooltip } from 'antd'
import { CheckboxValueType } from 'antd/lib/checkbox/Group'
import classNames from 'classnames'
import React, { Component, ReactNode } from 'react'
import './PermissionTree.less'

interface IPermissionTreeState {
    openKeys: { [key: string]: true }

    searchKey?: string
}
interface IPermissionTreeProps extends IComponentProps {
    dataSource: IPermission[]
    renderTitle?: (item: IPermission, markStr?: string) => ReactNode
    hideBorder?: boolean
    enableChecked?: boolean
    onCheckChange?: (value: CheckboxValueType[]) => void
    checkedKeys?: CheckboxValueType[]
    disabledLock?: boolean
}

/**
 * PermissionTree
 */
class PermissionTree extends Component<IPermissionTreeProps, IPermissionTreeState> {
    private treeControl = new TreeControl<IPermission>()

    constructor(props: IPermissionTreeProps) {
        super(props)
        this.state = {
            openKeys: {},
        }
    }

    private openFirstLevel() {
        const { dataSource } = this.props
        const keys = {}
        if (!dataSource) {
            return
        }

        dataSource.forEach((node) => {
            keys[node.id] = true
        })
        this.setState({ openKeys: keys })
    }

    componentDidMount() {
        this.openFirstLevel()
    }

    componentDidUpdate(prevProps: IPermissionTreeProps) {
        if (!prevProps.dataSource && this.props.dataSource) {
            this.openFirstLevel()
        }
    }

    private renderPermissionList(data: IPermission[] | undefined, isRoot = false, checkedCache: ReturnType<typeof this.createCheckCache>): ReactNode {
        // 循环列表
        // 1. 把无子结点的放到一个父容器，其它结点一个容器
        if (!data) {
            return null
        }
        const { openKeys } = this.state
        const { hideBorder } = this.props
        const { renderContent } = this

        const result = []
        const leafElements: ReactNode[] = []
        for (let item of data) {
            const hasChildren = item.children && item.children
            if (!hasChildren) {
                leafElements.push(renderContent(item, isRoot, checkedCache))
            } else {
                const opened = openKeys[item.id]
                result.push(
                    <li className='PermissionNode'>
                        {renderContent(item, isRoot, checkedCache)}
                        {opened && this.renderPermissionList(item.children, false, checkedCache)}
                        {}
                    </li>
                )
            }
        }
        if (leafElements.length) {
            result.unshift(<li className='PermissionNode PermissionLeafGroup'>{leafElements}</li>)
        }
        return <ul className={classNames('PermissionTree', hideBorder ? 'PermissionTreeNoBorder' : '', isRoot ? 'PermissionTreeRoot' : '')}>{result}</ul>
    }

    private renderContent = (nodeData: IPermission, isRoot: boolean, checkedCache: ReturnType<typeof this.createCheckCache>) => {
        // 根结点显示文件夹图标；其它显示文件图标
        const { renderTitle, enableChecked, checkedKeys = [], disabledLock } = this.props
        const { openKeys } = this.state
        const hasChildren = nodeData.children && nodeData.children.length
        const icon = isRoot ? <IconFont type='icon-wenjian' /> : <IconFont type='icon-wenjian2' />
        const { id, selected, islock } = nodeData
        const opened = openKeys[id]
        const arrowIcon = opened ? <CaretDownOutlined /> : <CaretRightOutlined />
        const checked = checkedKeys.includes(id)
        const indeterminate = checked && checkedCache && checkedCache[id] === 'some'

        const showLock = islock && !disabledLock
        return (
            <div className={classNames('PermissionContent', selected ? 'PermissionContentSelected' : 'PermissionContentUnSelected', isRoot ? 'PermissionContentRoot' : '')}>
                {hasChildren ? (
                    <React.Fragment>
                        {React.cloneElement(arrowIcon, {
                            className: 'ArrowIcon',
                            onClick: () => {
                                if (opened) {
                                    delete openKeys[id]
                                } else {
                                    openKeys[id] = true
                                }
                                this.forceUpdate()
                            },
                        })}
                    </React.Fragment>
                ) : null}
                {enableChecked ? <Checkbox checked={checked} indeterminate={indeterminate} onChange={(event) => this.switchValue(nodeData, event.target.checked)} /> : null}
                {hasChildren ? icon : null}
                <div className='TitleWrap'>
                    {this.renderTitle(nodeData)}
                    <Tooltip
                        title={
                            <div className='LockTip'>
                                <div>锁定该权限，不跟随部门、角色变化</div>
                            </div>
                        }
                    >
                        <span className='Lock'>{showLock ? <IconFont type='icon-suo' /> : ''}</span>
                    </Tooltip>
                </div>
            </div>
        )
    }

    private renderTitle(node: IPermission) {
        const { searchKey } = this.state
        const { renderTitle } = this.props

        if (renderTitle) {
            return renderTitle(node, searchKey)
        }

        const { title } = node
        const effectTitle = searchKey ? title.replaceAll(searchKey, `<span class='highlight'>${searchKey}</span>`) : title
        return <span className='PermissionNodeTitle' dangerouslySetInnerHTML={{ __html: effectTitle }} />
    }

    /**
     * 创建选中状态的缓存，有的节点选中了，但是子结点未全部选中，需要设置为半选中状态
     * 此方法的作用为：只循环一次树结构，检查所有结点的选中状态；true-全选中，false-未选中，some-部分选中
     * @param treeData
     * @returns
     */
    private createCheckCache(treeData: IPermission[]): { [key: string]: false | true | 'some' } {
        const { checkedKeys } = this.props
        let result: ReturnType<typeof this.createCheckCache> = {}
        if (!treeData) {
            return result
        }
        // 循环treeData
        // 如果结点是叶子结点，根据是否选中，返回0 / 1，并添加到result中
        //      否则，递归获取所有子结点的结果；如果所有子结点都是1，则此结点是1；否则是2
        for (let item of treeData) {
            const { id, children } = item
            const selected = checkedKeys && checkedKeys.includes(id)
            if (!selected) {
                result[id] = false
            } else {
                if (!children || !children.length) {
                    result[id] = selected ? true : false
                } else {
                    const childrenResult = this.createCheckCache(children)
                    let selectedAll = true
                    for (let child of children) {
                        const childId = child.id
                        if (childrenResult[childId] !== true) {
                            selectedAll = false
                            break
                        }
                    }
                    result[id] = selectedAll ? true : 'some'
                    result = { ...result, ...childrenResult }
                }
            }
        }
        return result
    }

    private switchValue(node: IPermission, checked: boolean) {
        // 如果选中，则选中所有父结点和所有子结点
        if (checked) {
            this.select(node)
        } else {
            // 如果未选中，删除当前结点及所有子结点
            this.unselected(node)
        }
    }

    private select(node: IPermission) {
        const { treeControl } = this
        const { dataSource, checkedKeys = [], onCheckChange } = this.props
        const { id } = node

        const idList: string[] = []
        // // 父结点
        const chain = treeControl.searchChain(dataSource, (node: IPermission) => node.id === id)
        if (chain) {
            chain.forEach((item) => {
                idList.push(item.id)
            })
        }
        // 子结点
        treeControl.forEach([node], (item: IPermission) => {
            idList.push(item.id)
        })

        // 新增选中项
        idList.push(id)
        const newKeys = Array.from(new Set(checkedKeys.concat(idList)))

        if (onCheckChange) {
            onCheckChange(newKeys)
        }
    }

    private unselected(node: IPermission) {
        const { checkedKeys = [], onCheckChange, dataSource } = this.props
        const newKeys = checkedKeys.concat()
        // 取消当前结点和所有子结点的选中
        this.treeControl.forEach([node], (item: IPermission) => {
            const { id } = item
            const index = newKeys.indexOf(id)
            if (index >= 0) {
                newKeys.splice(index, 1)
            }
        })
        // 检查所有父节点，判断是否需要取消选中
        // const chain = this.treeControl.searchChain(dataSource, (item: IPermission) => item.id === node.id)
        // const parents = chain ? chain.slice(0, chain.length - 1) : []
        // 从最近的父节点开始判断：对于任意父节点，如果它所有子结点都未选中，此父结点也取消选中
        // for (let i = parents.length - 1; i >= 0; i--) {
        //     const currentParentNode: IPermission = parents[i]
        //     const { children } = currentParentNode
        //     let hasSelectedChild = false
        //     if (children) {
        //         for (let child of children) {
        //             const selected = newKeys.includes(child.id)
        //             if (selected) {
        //                 hasSelectedChild = true
        //                 break
        //             }
        //         }
        //     }

        //     if (!hasSelectedChild) {
        //         const index = newKeys.indexOf(currentParentNode.id)
        //         if (index >= 0) {
        //             newKeys.splice(index, 1)
        //         }
        //     }
        // }
        if (onCheckChange) {
            onCheckChange(newKeys)
        }
    }

    private filterDataSource() {
        const { dataSource, enableChecked } = this.props
        const { searchKey } = this.state

        if (enableChecked && !searchKey) {
            return dataSource
        }

        return this.treeControl.filter(dataSource, (item) => {
            const { title } = item
            const result = Boolean(enableChecked ? true : item.selected) && (searchKey ? title.includes(searchKey) : true)
            return result
        })
    }

    render() {
        const { dataSource } = this.props
        const { searchKey } = this.state
        const useDataSource = this.filterDataSource()
        console.log('useDataSource', useDataSource)

        const cache = this.createCheckCache(dataSource)
        return (
            <div className='HControlGroup'>
                <Input placeholder='权限名称' allowClear value={searchKey} onChange={(event) => this.setState({ searchKey: event.target.value.trim() })} />
                {this.renderPermissionList(useDataSource, true, cache)}
            </div>
        )
    }
}

export default PermissionTree
