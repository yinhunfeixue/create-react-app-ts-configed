import IComponentProps from '@/base/interfaces/IComponentProps'
import IconFont from '@/component/IconFont'
import { Input } from 'antd'
import classNames from 'classnames'
import React, { Component } from 'react'
import './SearchPanel.less'

interface ISearchPanelState {
    value: string
}
interface ISearchPanelProps extends IComponentProps {
    onSearch: (value: string) => void
    placeholder?: string
    visible: boolean
    onVisibleChange: (visible: boolean) => void
}

/**
 * 搜索面板
 */
class SearchPanel extends Component<ISearchPanelProps, ISearchPanelState> {
    private input!: Input
    private searchContainer: HTMLDivElement | null = null

    constructor(props: ISearchPanelProps) {
        super(props)
        this.state = {
            value: '',
        }
    }

    componentDidMount() {
        window.addEventListener('resize', this.resizeHandler)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeHandler)
    }

    private resizeHandler = () => {
        this.forceUpdate()
    }

    private close() {
        const { onVisibleChange } = this.props
        onVisibleChange(false)

        this.input.blur()
    }

    private open() {
        const { onVisibleChange } = this.props
        onVisibleChange(true)
        this.input.focus()
    }

    private getDropDownHeight() {
        if (this.searchContainer) {
            const bound = this.searchContainer.getBoundingClientRect()
            return document.body.offsetHeight - bound.height - bound.y
        }
        return 500
    }

    render() {
        const { onSearch, children, placeholder, visible, className, style } = this.props
        const { value } = this.state
        return (
            <div className={classNames('SearchPanel', className)} style={style}>
                <div className={classNames('SearchPanelMask', visible ? '' : 'SearchPanelMaskHide')} onClick={() => this.close()} />
                <div className='SearchPanelBody'>
                    {/* 搜索区 */}
                    <div
                        className={classNames('SearchContainer', visible ? '' : 'SearchContainerHide')}
                        ref={(target) => {
                            if (target) {
                                this.searchContainer = target
                            }
                        }}
                    >
                        <Input
                            ref={(target) => {
                                if (target) {
                                    this.input = target
                                }
                            }}
                            placeholder={visible ? placeholder : '搜索'}
                            onChange={(event) => {
                                const value = event.target.value
                                this.setState({ value })
                                onSearch(value)
                            }}
                            value={value}
                            size='large'
                        />
                        <span
                            className='IconSearch'
                            onClick={() => {
                                this.open()
                            }}
                        >
                            <IconFont type='icon-a-searchall' />
                            {!visible && <span>搜索</span>}
                        </span>
                        {visible && <IconFont type='icon-shanchu' onClick={() => this.close()} />}
                    </div>
                    {/* 下拉面板区 */}
                    {visible ? (
                        <div className='SearchPanelDropDown commonScroll' style={{ height: `${this.getDropDownHeight()}px` }}>
                            {children}
                        </div>
                    ) : null}
                </div>
            </div>
        )
    }
}

export default SearchPanel
