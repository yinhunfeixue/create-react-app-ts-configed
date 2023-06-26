import AutoTip from '@/component/AutoTip'
import SimpleEmpty from '@/component/empty/SimpleEmpty'
import IconFont from '@/component/IconFont'
import TreeControl from '@/utils/TreeControl'
import { Dropdown, Input, InputProps, Menu, Tree, TreeProps } from 'antd'
import classNames from 'classnames'
import { ItemType } from 'rc-menu/lib/interface'
import { BasicDataNode, DataNode } from 'rc-tree/lib/interface'
import React, { CSSProperties, forwardRef, Key, ReactNode, useEffect, useImperativeHandle, useState } from 'react'
import './SearchTree.less'

type BasicDataNodeWithChildren = BasicDataNode & { children?: (BasicDataNode & DataNode)[] }
interface ISearchTreeProps<T extends BasicDataNodeWithChildren = DataNode> {
    className?: string
    style?: CSSProperties

    /**
     * 是否禁用搜索
     */
    disabledSearch?: boolean

    /**
     * 搜索时，判断结点和搜索词是否匹配的方法
     */
    equalNode?: (searchKey: string, data: T) => boolean

    /**
     * 搜索词变化的事件，通常用于获取新数据（如果需要)
     */
    onSearch?: (value: string) => void

    /**
     * 树的渲染方法
     */
    treeTitleRender?: (node: T, searchKey: string) => ReactNode

    /**
     * 树组件的Props
     */
    treeProps: TreeProps<T>
    inputProps?: InputProps

    /**
     * 检查结点是否可选中。 如结点显式设置了selectable属性，则对于此结点，会忽略此方法
     * @params node 结点数据
     */
    disableNodeSelect?: (node: T) => boolean

    /**
     * 默认选中结点的判断方法，设置了此方法，则treeProps.defaultSelectedKeys, treeProps.defaultExpandedKeys无效
     */
    defaultSelectedEqual?: (node: T) => boolean
}

export interface ISearchTreeRef {
    /**
     * 选中并展开到指点的结点
     *
     * 注意：此方法不会触发 onSelect
     */
    selectedAndOpenKey: (value: Key) => void

    /**
     * 展开指定结点
     *
     * 注意：此方法不会触发onExpand
     * @param value
     * @returns
     */
    expand: (value: Key[]) => void

    /**
     * 展开所有结点
     *
     * 注意：此方法不会触发onExpand
     * @returns
     */
    expandAll: () => void
}

const SearchTree = <T extends BasicDataNodeWithChildren = DataNode>(props: ISearchTreeProps<T>, ref: any) => {
    useImperativeHandle(ref, (): ISearchTreeRef => {
        return {
            selectedAndOpenKey: (value) => {
                selectedAndOpenKey(value)
            },
            expand(value) {
                setStateExpandKeys(value)
            },
            expandAll() {
                const t1 = Date.now()
                const keys: Key[] = []
                new TreeControl<T>().forEach(treeData, (node) => {
                    keys.push(getNodeKey(node))
                })
                setStateExpandKeys(keys)
                console.log('time', Date.now() - t1)
            },
        }
    })

    const getNodeKey = (node: T) => {
        if (fieldNames && fieldNames.key) {
            return node[fieldNames.key]
        }
        return (node as unknown as DataNode).key
    }

    const getNodeTitle = (node: T) => {
        if (fieldNames && fieldNames.title) {
            return node[fieldNames.title]
        }
        return (node as unknown as DataNode).title
    }

    const defaultEqualNode = (searchKey: string, node: T) => {
        const title = getNodeTitle(node)
        return Boolean(title && title.toString().toLowerCase().includes(searchKey.toLowerCase()))
    }

    const updateExpandKeys: typeof treeProps.onExpand = (value, info) => {
        setStateExpandKeys(value)
        if (treeProps.onExpand) {
            treeProps.onExpand(value, info)
        }
    }

    const updateSelectedKeys: typeof treeProps.onSelect = (keys, info) => {
        setStateSelectedKeys(keys)
        if (treeProps.onSelect) {
            treeProps.onSelect(keys, info)
        }
    }

    const { treeProps, equalNode, onSearch, disabledSearch, className, style, inputProps = {}, treeTitleRender, disableNodeSelect, defaultSelectedEqual } = props
    let { treeData = [], defaultExpandAll, fieldNames, expandedKeys, selectedKeys, defaultExpandedKeys, defaultSelectedKeys } = treeProps
    const { placeholder } = inputProps

    const [searchKey, setSearchKey] = useState('')

    useEffect(() => {
        const keys = getExpandKeys()
        setStateExpandKeys(keys)
    }, [searchKey])

    useEffect(() => {
        if (!treeData || !treeData.length) {
            return
        }
        // 设置默认选中/默认展开的结点
        let expandedKeys = defaultExpandedKeys
        let selectedKeys = defaultSelectedKeys
        const childrenName = fieldNames ? fieldNames.children : undefined

        // 如果设置了默认选中的匹配方法，则使用此方法；否则，使用treeProps中设置的值
        if (defaultSelectedEqual && (!stateSelectedKeys || !stateSelectedKeys.length)) {
            const chain = new TreeControl<T>(undefined, childrenName).searchChain(treeData, (node) => defaultSelectedEqual(node))
            if (chain && chain.length) {
                const lastNode = chain[chain.length - 1]
                expandedKeys = chain.slice(0, chain.length - 1).map((item) => getNodeKey(item))
                selectedKeys = [getNodeKey(lastNode)]
                if (treeProps.onSelect) {
                    treeProps.onSelect(selectedKeys, {
                        event: 'select',
                        selected: true,
                        selectedNodes: [lastNode],
                        node: lastNode as any,
                        nativeEvent: new MouseEvent('click'),
                    })
                }
            } else {
                expandedKeys = undefined
                selectedKeys = undefined
            }

            setStateExpandKeys(expandedKeys)
            setStateSelectedKeys(selectedKeys)
        }
    }, [treeData])

    const selectedAndOpenKey = (value: Key) => {
        const chain = new TreeControl<T>().searchChain(treeData, (node) => getNodeKey(node) === value)
        if (chain && chain.length) {
            const lastNode = chain[chain.length - 1]
            expandedKeys = chain.map((item) => getNodeKey(item))
            selectedKeys = [getNodeKey(lastNode)]
            setStateExpandKeys(expandedKeys)
            setStateSelectedKeys(selectedKeys)
        }
    }

    const [stateExpandKeys, setStateExpandKeys] = useState<Key[] | undefined>(defaultExpandedKeys)
    const [stateSelectedKeys, setStateSelectedKeys] = useState<Key[] | undefined>(defaultSelectedKeys)

    if (searchKey) {
        const equal = equalNode || defaultEqualNode
        const childrenName = fieldNames ? fieldNames.children : undefined
        treeData = new TreeControl<T>(undefined, childrenName, childrenName).filter(treeData, (node) => equal(searchKey, node))
    }

    if (disableNodeSelect) {
        treeData =
            new TreeControl<T>().map(treeData, (node, index, parent, newChildren) => {
                const disableSelect = node.selectable === false || disableNodeSelect(node) || undefined
                return {
                    ...node,
                    selectable: !disableSelect,
                    children: newChildren,
                }
            }) || []
    }

    const getExpandKeys = () => {
        // 如果有搜索词，全部展开；
        // 否则，有选中的key，展开选中的key及其父结点
        // 否则，使用外部传入的默认值

        if (searchKey) {
            const keys: Key[] = []
            new TreeControl<T>().forEach(treeData, (node) => {
                keys.push(getNodeKey(node))
            })
            return keys
        }

        if (stateSelectedKeys && stateSelectedKeys.length) {
            const chain = new TreeControl<T>().searchChain(treeData, (node) => getNodeKey(node) === stateSelectedKeys[0])
            if (chain) {
                return chain.map((item) => getNodeKey(item))
            }
        }
        return defaultExpandedKeys
    }

    const renderSearch = () => {
        return (
            <div className='SearchWrap'>
                <Input
                    allowClear
                    {...inputProps}
                    prefix={<IconFont type='icon-search' />}
                    className={classNames('InputSearch', inputProps ? inputProps.className : '')}
                    onChange={(event) => {
                        const value = event.target.value
                        setSearchKey(value)
                    }}
                    onPressEnter={(event) => {
                        if (onSearch) {
                            onSearch(searchKey)
                        }
                    }}
                    placeholder={placeholder || '请输入'}
                />
            </div>
        )
    }

    const renderTree = () => {
        const hasData = Boolean(treeData && treeData.length)

        const extraProps: TreeProps<T> = {
            defaultExpandAll,
            showLine: treeProps.showLine || false,
        }
        if (expandedKeys || stateExpandKeys) {
            extraProps.expandedKeys = expandedKeys || stateExpandKeys
        }
        if (selectedKeys || stateSelectedKeys) {
            extraProps.selectedKeys = selectedKeys || stateSelectedKeys
        }

        const titleRender = (node: T) => {
            let result: ReactNode
            if (treeTitleRender) {
                result = treeTitleRender(node, searchKey)
            } else {
                if (fieldNames && fieldNames.title) {
                    result = node[fieldNames.title]
                } else {
                    result = (node as unknown as DataNode).title as ReactNode
                }
                result = searchTreeMarkWord(result, searchKey)
            }

            const key = getNodeKey(node)

            return (
                <AutoTip
                    content={result}
                    toolTipProps={{ placement: 'right' }}
                    onClick={(event) => {
                        // 如果不可选中，处理展开/关闭
                        const { selectable } = node
                        if (selectable === false) {
                            const expanded = stateExpandKeys && stateExpandKeys.includes(key)
                            let expandedKeys = (stateExpandKeys || []).concat()
                            const info = { node: node as any, expanded: !expanded, nativeEvent: event.nativeEvent }
                            if (expanded) {
                                expandedKeys = expandedKeys.filter((item) => item !== key)
                                updateExpandKeys(expandedKeys, info)
                            } else if (node.children) {
                                expandedKeys.push(key)
                                updateExpandKeys(expandedKeys, info)
                            }
                        }

                        // 处理选中, 禁止取消选中
                        const selected = stateSelectedKeys && stateSelectedKeys.includes(key)
                        if (selected) {
                            event.preventDefault()
                            event.stopPropagation()
                            return
                        }
                    }}
                />
            )
        }

        return hasData ? (
            <Tree
                {...treeProps}
                {...extraProps}
                blockNode
                treeData={treeData}
                titleRender={titleRender}
                onExpand={(keys, info) => {
                    updateExpandKeys(keys, info)
                }}
                onSelect={(keys, info) => {
                    updateSelectedKeys(keys, info)
                }}
            />
        ) : (
            <SimpleEmpty style={{ marginTop: 20 }} />
        )
    }

    return (
        <div className={classNames('SearchTree', className)} style={style}>
            {!disabledSearch && renderSearch()}
            {renderTree()}
        </div>
    )
}

/**
 * 标记单词
 * @param value 句子
 * @param word 关键词
 * @param style 关键词的样式
 * @returns
 */
export function searchTreeMarkWord(value: ReactNode, word?: string, style: CSSProperties = { color: 'red' }): ReactNode {
    let result = value
    if (word && typeof result === 'string') {
        const index = result.toLowerCase().indexOf(word.toLowerCase())
        if (index >= 0) {
            result = (
                <span>
                    {result.substring(0, index)}
                    <span style={style}>{result.substring(index, index + word.length)}</span>
                    {result.substring(index + word.length)}
                </span>
            )
        }
    }
    return result
}

/**
 * 默认的标题渲染函数
 * @param data
 * @param titleParser
 */
export const defaultTitleRender = <T = any,>(data: T, titleParser: (data: T) => { icon?: ReactNode; title?: ReactNode; extra?: ReactNode; menuList?: ItemType[] }, searchKey?: string) => {
    const parseData = titleParser(data)
    const { icon, title, menuList, extra } = parseData
    let effectTitle: ReactNode = searchTreeMarkWord(title, searchKey)

    return (
        <div className='DefaultTitleWrap'>
            {icon}
            <AutoTip className='DefaultTitle' content={effectTitle} toolTipProps={{ placement: 'right' }} />
            {Boolean(menuList && menuList.length) && (
                <Dropdown overlay={<Menu items={menuList} onClick={(event) => event.domEvent.stopPropagation()} />}>
                    <IconFont className='IconMenu' type='e6e8' useCss />
                </Dropdown>
            )}
            <AutoTip className='SearchTreeNodeExtra' content={extra} toolTipProps={{ placement: 'right' }} />
        </div>
    )
}

export const searchTreeDisableNodeSelectIfHasChildren = <T extends BasicDataNodeWithChildren = DataNode>(node: T) => {
    return Boolean(node.children && node.children.length)
}

const refSearchTree = forwardRef<ISearchTreeRef, ISearchTreeProps>(SearchTree)

export default refSearchTree
