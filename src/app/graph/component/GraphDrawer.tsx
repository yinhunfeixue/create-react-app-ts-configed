import IconFont from '@/component/IconFont'
import { Divider } from 'antd'
import classNames from 'classnames'
import React, { Component, ReactNode } from 'react'
import './GraphDrawer.less'

interface IGraphDrawerState {
    visible?: boolean
}
interface IGraphDrawerProps {
    title: ReactNode
    extra?: ReactNode
    createExtraElement?: () => ReactNode[]
    visible?: boolean
    children?: ReactNode
    onClose: () => void
}

/**
 * GraphDrawer
 */
class GraphDrawer extends Component<IGraphDrawerProps, IGraphDrawerState> {
    constructor(props: IGraphDrawerProps) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        this.updateVisible()
    }

    componentDidUpdate() {
        this.updateVisible()
    }

    private renderExtra() {
        const { createExtraElement, onClose } = this.props

        let elementList: ReactNode[] = [
            <IconFont
                className='IconClose'
                onClick={() => {
                    onClose()
                }}
                type='e680'
                useCss
            />,
        ]
        if (createExtraElement) {
            elementList = createExtraElement().concat(elementList)
        }
        elementList = elementList
            .map((item, index) => {
                if (index < elementList.length - 1) {
                    return [item, <Divider type='vertical' />]
                }
                return [item]
            })
            .flat()
        return <div className='ExtraGroup'>{elementList}</div>
    }

    private updateVisible() {
        if (this.state.visible !== this.props.visible) {
            setTimeout(() => {
                this.setState({ visible: this.props.visible })
            }, 10)
        }
    }

    render() {
        const { title, children } = this.props
        const { visible } = this.state
        return (
            <div className={classNames('GraphDrawerWrap', visible ? 'GraphDrawerWrapVisible' : '')}>
                <div className='GraphDrawer'>
                    {/* 头部 */}
                    <header>
                        <span>{title}</span>
                        {this.renderExtra()}
                    </header>
                    <main>{children}</main>
                </div>
            </div>
        )
    }
}

export default GraphDrawer
