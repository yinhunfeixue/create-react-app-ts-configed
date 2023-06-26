import IComponentProps from '@/base/interfaces/IComponentProps'
import { CloseOutlined } from '@ant-design/icons'
import { Divider, Drawer } from 'antd'
import { DrawerProps } from 'antd/lib/drawer'
import classNames from 'classnames'
import React, { Component, CSSProperties, ReactElement, ReactNode } from 'react'
import './DrawerLayout.less'

interface IDrawerLayoutState {}
interface IDrawerLayoutProps extends IComponentProps {
    drawerProps: DrawerProps
    renderFooter?: () => ReactElement
    createExtraElement?: () => ReactNode[]
    mainBodyStyle?: CSSProperties
}

/**
 * DrawerLayout
 */
class DrawerLayout extends Component<IDrawerLayoutProps, IDrawerLayoutState> {
    renderExtra() {
        const { createExtraElement, drawerProps } = this.props
        const { onClose } = drawerProps
        const closable = Boolean(onClose)

        let elementList: ReactNode[] = closable ? [<CloseOutlined onClick={(event) => onClose && onClose(event as any)} />] : []
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

    render() {
        const { drawerProps, renderFooter, children, mainBodyStyle } = this.props
        const { title, visible, className } = drawerProps

        const footerElement = renderFooter ? renderFooter() : null
        return (
            <Drawer
                width={480}
                maskClosable={false}
                {...drawerProps}
                className={classNames('DrawerLayout', className)}
                closable={false}
                title={
                    <div className='TitleGroup'>
                        <div className='Title'>{title}</div>
                        {this.renderExtra()}
                    </div>
                }
            >
                <main className='commonScroll' style={mainBodyStyle}>
                    {visible && <div id='drawerLayoutDropContainer' />}
                    {visible && children}
                </main>
                {footerElement && <footer>{footerElement}</footer>}
            </Drawer>
        )
    }
}

export default DrawerLayout
