import IComponentProps from '@/base/interfaces/IComponentProps'
import IconFont from '@/component/IconFont'
import { DownOutlined } from '@ant-design/icons'
import { Graph } from '@antv/g6'
import { Dropdown, Menu } from 'antd'
import classNames from 'classnames'
import React, { Component } from 'react'
import './GraphControl.less'

interface IGraphControlState {
    reloading: boolean
    scaleValue: number
}
interface IGraphControlProps extends IComponentProps {
    getGraph: () => Graph
    onReload: () => Promise<void>
    isFull: boolean
    fullFunction: () => void
}

/**
 * GraphControl
 */
class GraphControl extends Component<IGraphControlProps, IGraphControlState> {
    constructor(props: IGraphControlProps) {
        super(props)
        this.state = {
            reloading: false,
            scaleValue: 1,
        }
    }

    public setZoomValue(value: number) {
        this.setState({ scaleValue: value })
    }

    private get graph() {
        const { getGraph } = this.props
        return getGraph()
    }
    private zoom(ratio: number) {
        const graph = this.graph
        const x = graph.getWidth() / 2
        const y = graph.getHeight() / 2
        const value = graph.getZoom() * ratio
        graph.zoomTo(value, { x, y })
        this.setState({ scaleValue: value })
    }

    private zoomTo(value: number) {
        const graph = this.graph
        const x = graph.getWidth() / 2
        const y = graph.getHeight() / 2
        graph.zoomTo(value, { x, y })
        this.setState({ scaleValue: value })
    }

    render() {
        const { onReload, children, isFull, fullFunction } = this.props
        const { reloading, scaleValue } = this.state
        return (
            <div className='GraphControl'>
                {children}
                <div className='hr' />
                {/* 下拉缩放 */}
                <Dropdown
                    overlay={
                        <Menu
                            onClick={(info) => {
                                if (info.key === 'fit') {
                                    this.graph.fitView()
                                    this.setState({ scaleValue: 0 })
                                } else {
                                    this.zoomTo(Number(info.key))
                                }
                            }}
                        >
                            {[
                                {
                                    label: '全览',
                                    value: 'fit',
                                },
                                {
                                    label: '200%',
                                    value: 2,
                                },
                                {
                                    label: '100%',
                                    value: 1,
                                },
                                {
                                    label: '50%',
                                    value: 0.5,
                                },
                                {
                                    label: '25%',
                                    value: 0.25,
                                },
                            ].map((item) => {
                                return <Menu.Item key={item.value}>{item.label}</Menu.Item>
                            })}
                        </Menu>
                    }
                >
                    <div style={{ cursor: 'pointer' }}>
                        <span style={{ marginRight: 6 }}>{scaleValue ? `${Math.round(100 * scaleValue)}%` : '全览'}</span>
                        <DownOutlined />
                    </div>
                </Dropdown>
                {/* 刷新 */}
                <IconFont
                    type='icon-shuaxin'
                    className={classNames('IconButton', reloading ? 'Rotateing' : '')}
                    onClick={() => {
                        if (!reloading) {
                            this.setState({ reloading: true })
                            onReload().finally(() => {
                                this.setState({ reloading: false })
                            })
                        }
                    }}
                />

                {/* 缩放图标 */}
                <IconFont
                    className='IconButton'
                    type='icon-fangda'
                    onClick={() => {
                        this.zoom(1.1)
                    }}
                />

                <IconFont
                    className='IconButton'
                    type='icon-suoxiao'
                    onClick={() => {
                        this.zoom(0.9)
                    }}
                />

                <div className='hr' />
                {/* 全屏 */}
                <IconFont className='IconButton' type={isFull ? 'icon-feiquanping' : 'icon-quanping'} onClick={() => fullFunction()} />
            </div>
        )
    }
}

export default GraphControl
