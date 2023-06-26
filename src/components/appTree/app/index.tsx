import React, { ReactNode, useEffect, useState } from 'react'
import classnames from 'classnames'
import { Dropdown, Menu } from 'antd'
import SortDrawer from '../sortDrawer'
import { PlusOutlined, SwapOutlined } from '@ant-design/icons'

import './index.less'

import { Right, More } from '../config'

export interface ToverlayMenuItems {
    key: string | number
    label: ReactNode
}

const Overlay: React.FC<{ menuItems: ToverlayMenuItems[] }> = (props) => {
    return (
        <Menu>
            {props.menuItems.map((v) => (
                <Menu.Item key={v.key}>{v.label}</Menu.Item>
            ))}
        </Menu>
    )
}

function copyMap(map: Map<any, any>) {
    return new Map(Array.from(map.entries()))
}

export default function App(
    props: React.PropsWithChildren<{
        title?: ReactNode
        firstTitle?: ReactNode
        appIndex: number
        dataSource: any[]
        renderNode: (data?: any) => ReactNode
        renderNodeMore?: (data?: any) => ReactNode
        selectChange?: (data: any, index: number) => void
        moreOverlayMenuItem?: (data: any, parent: any) => ToverlayMenuItems[]
        renderEmpty?: (index: number, parent: Record<string, any>) => ReactNode
        selectedKey?: string
        footer?: boolean
        hideAdd?: boolean
        hideSort?: boolean
        onAdd?: (appIndex: number, parent: any) => void
        parent?: Record<string, any>
        sortConfirm?: (data: any) => void
    }>
) {
    const {
        title = '一级',
        firstTitle,
        dataSource = [{}],
        renderNode,
        renderNodeMore,
        selectChange,
        appIndex,
        moreOverlayMenuItem,
        selectedKey,
        footer,
        hideAdd,
        hideSort,
        renderEmpty,
        onAdd,
        parent,
        sortConfirm,
    } = props

    /* state */
    const [selectedNodes, setSelectedNodes] = useState<Map<string, any>>(new Map())
    const [sortVisible, setSortVisible] = useState<boolean>(false)

    /* effect */
    useEffect(() => {
        // 数据源发生变化，清除状态
        selectedNodes.clear()
        setSelectedNodes(copyMap(selectedNodes))
    }, [JSON.stringify(dataSource)])

    useEffect(() => {
        // props 传递进来的selectedKeys发生变化，则置空内部状态，使用外部传入值
        if (!selectedKey) {
            selectedNodes.clear()
            setSelectedNodes(copyMap(selectedNodes))
            return
        }
        for (let i = 0; i < dataSource.length; i++) {
            let item = dataSource[i]
            if (item.id == selectedKey) {
                console.log('hit select')
                selectedNodes.clear()
                selectedNodes.set(selectedKey as string, item)
                setSelectedNodes(copyMap(selectedNodes))
                return
            }
        }
    }, [selectedKey, JSON.stringify(dataSource)])

    /* event */
    const onSelect = (data: any) => {
        if (selectedNodes.has(data.id)) {
            return
        }
        selectedNodes.clear()
        selectedNodes.set(data.id, data)
        setSelectedNodes(copyMap(selectedNodes))
        selectChange && selectChange(data, appIndex)
    }

    const handleAdd = () => {
        onAdd && onAdd(appIndex, parent)
    }

    const sort = () => {
        if (dataSource.length <= 0) return
        setSortVisible(true)
    }

    //console.log('app', selectedKey, dataSource);

    return (
        <div className='lz-rc-appTree-item'>
            <p className='lz-rc-appTree-item-title'>
                <span>{!selectedKey ? (firstTitle && appIndex == 0 ? firstTitle : title) : (dataSource.filter((v) => v.id == selectedKey)[0] || {}).name}</span>
            </p>
            {dataSource.length > 0 && (
                <ul className='lz-rc-appTree-item-list' style={{ height: `calc(100% - ${footer ? 80 : 40}px)` }}>
                    {dataSource.map((v, i) => (
                        <li
                            key={i}
                            className={classnames({ 'lz-rc-appTree-item-list-select': selectedKey == v.id })}
                            onClick={() => {
                                onSelect(v)
                            }}
                        >
                            <div className='lz-rc-appTree-item-list-node'>
                                {renderNode(v)}
                                {moreOverlayMenuItem && (
                                    <Dropdown overlay={<Overlay menuItems={moreOverlayMenuItem(v, parent)} />}>
                                        <span
                                            onClick={(e) => {
                                                console.log('ss')
                                                e.preventDefault()
                                                e.stopPropagation()
                                            }}
                                            className='lz-rc-appTree-item-list-moreIcon'
                                        >
                                            {More}
                                        </span>
                                    </Dropdown>
                                )}
                                <span className='lz-rc-appTree-item-list-rightIcon'>{Right}</span>
                            </div>
                            {renderNodeMore && <div className='lz-rc-appTree-item-list-more'>{renderNodeMore(v)}</div>}
                        </li>
                    ))}
                </ul>
            )}
            {dataSource.length <= 0 && renderEmpty && renderEmpty(appIndex, parent)}
            {footer && (
                <div className='lz-rc-appTree-item-footer'>
                    {!hideAdd && (
                        <span onClick={handleAdd}>
                            <PlusOutlined />
                            添加
                        </span>
                    )}
                    {!hideSort && (
                        <span onClick={sort}>
                            <SwapOutlined /> 排序
                        </span>
                    )}
                </div>
            )}
            {sortVisible && footer && dataSource.length > 0 && <SortDrawer onOk={sortConfirm} dataSource={[...dataSource]} visible={sortVisible} onClose={() => setSortVisible(false)} />}
        </div>
    )
}
