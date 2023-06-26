import classNames from 'classnames'
import React, { CSSProperties } from 'react'
import './PageFooter.less'
interface IPageFooterProps {
    className?: string
    style?: CSSProperties
}
/**
 * PageFooter
 */
const PageFooter: React.FC<IPageFooterProps> = (props) => {
    const { className, style } = props
    return (
        <footer className={classNames('PageFooter', className)} style={style}>
            - DOP数据运营平台 -
        </footer>
    )
}
export default PageFooter
