import PageFooter from '@/component/layout/PageFooter'
import TableLayoutHeader, { ITableLayoutHeaderProps } from '@/component/layout/TableLayoutHeader'
import classnames from 'classnames'
import React, { Component, CSSProperties, ReactNode } from 'react'
import './TableLayout.less'

interface ITableLayoutState {}
interface ITableLayoutProps extends ITableLayoutHeaderProps {
    className?: string

    style?: CSSProperties

    /**
     * 头部下面的详情区，此区完全自定义
     * @param controler 表格控制器
     */
    renderDetail?: () => ReactNode

    renderTable?: () => ReactNode

    renderFooter?: () => ReactNode

    showFooterControl?: boolean

    disabledDefaultFooter?: boolean

    /**
     * 使用小布局，小布局没有padding
     */
    smallLayout?: boolean

    mainStyle?: CSSProperties
}

/**
 * TableLayout
 */
class TableLayout extends Component<ITableLayoutProps, ITableLayoutState> {
    constructor(props: ITableLayoutProps) {
        super(props)
        this.state = {}
    }

    render() {
        const { renderDetail, renderTable, className, style, smallLayout, disabledDefaultFooter, mainStyle } = this.props

        const footer = this.renderFooter()
        return (
            <div className={classnames('TableLayout', smallLayout ? 'TableLayoutSmall' : '', disabledDefaultFooter ? 'TableLayoutWithOutFooter' : '', className)} style={style}>
                {this.renderHeader()}
                <main style={mainStyle}>
                    {renderDetail && renderDetail()}
                    {renderTable && renderTable()}
                </main>
                {footer}
            </div>
        )
    }

    private renderHeader() {
        const { title, renderHeaderExtra, enableBack, onBack } = this.props
        return <TableLayoutHeader title={title} renderHeaderExtra={renderHeaderExtra} enableBack={enableBack} onBack={onBack} />
    }

    private renderFooter() {
        const { renderFooter, showFooterControl, disabledDefaultFooter } = this.props
        if (!renderFooter && disabledDefaultFooter) {
            return null
        }

        const footerElement = renderFooter ? renderFooter() : null
        return (
            <>
                {!disabledDefaultFooter && <PageFooter />}
                {footerElement && <div className={classnames('TableLayout_FloatFooter', showFooterControl ? 'TableLayout_FloatFooterShow' : '')}>{footerElement}</div>}
            </>
        )
    }
}

export default TableLayout
