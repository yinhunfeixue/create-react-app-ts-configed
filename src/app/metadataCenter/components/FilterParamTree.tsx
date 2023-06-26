import IFilterParam, { IFilterParamTree } from '@/app/metadataCenter/interface/FilterParam'
import AutoTip from '@/component/AutoTip'
import IconFont from '@/component/IconFont'
import ProjectUtil from '@/utils/ProjectUtil'
import { Button, Checkbox, Input, Popover, Tree } from 'antd'
import classNames from 'classnames'
import Lodash from 'lodash'
import React, { Component } from 'react'
import './FilterParamTree.less'

const imgType = require('app_images/metadata/filterType.png')

interface IFilterParamTreeState {
    visiblePoper: boolean
    selectedDic: { [key: string]: IFilterParam }
    searchKey: string
    visibleContent: boolean
}

interface IFilterParamTreeProps {
    data: IFilterParamTree
    onChange: (value: string[], items: IFilterParam[]) => Promise<void>
    value: string[]
}

/**
 * FilterParamTree
 */
class FilterParamTree extends Component<IFilterParamTreeProps, IFilterParamTreeState> {
    constructor(props: IFilterParamTreeProps) {
        super(props)
        this.state = {
            visiblePoper: false,
            selectedDic: {},
            searchKey: '',
            visibleContent: true,
        }
    }

    componentDidMount() {
        this.updateSelectedDic()
    }

    componentDidUpdate(prevProps: IFilterParamTreeProps) {
        if (!Lodash.isEqual(this.props.value, prevProps.value)) {
            this.updateSelectedDic()
        }
    }

    private updateSelectedDic() {
        const { value, data } = this.props
        const { filterNodes } = data
        const selectedDic = {}

        if (value && filterNodes) {
            filterNodes.forEach((item) => {
                if (value.includes(item.id)) {
                    selectedDic[item.id] = item
                }
            })
        }
        this.setState({ selectedDic })
    }

    private triggerChange() {
        const { selectedDic } = this.state
        const { onChange } = this.props
        console.log('trigger', selectedDic)

        onChange(Object.keys(selectedDic), Object.values(selectedDic))
    }

    private contains(key: string) {
        const { selectedDic } = this.state
        return Boolean(selectedDic[key])
    }

    private renderItemTitle(item: IFilterParam) {
        const { id } = item
        const mul = this.isMul
        const selected = this.contains(id)

        const renderContent = () => {
            return (
                <div className='FilterTitle'>
                    {mul ? (
                        <Checkbox checked={selected} disabled>
                            <AutoTip content={item.name} />
                        </Checkbox>
                    ) : (
                        <AutoTip
                            title={item.name}
                            content={
                                <span className={classNames('FilterTitleName', selected ? 'FilterTitleNameSelected' : '')}>
                                    <span>{item.name}</span>
                                    <IconFont type='e672' useCss className='FilterTitleIconClose' />
                                </span>
                            }
                            className={classNames('Name')}
                        />
                    )}
                    <em>{ProjectUtil.numberFormatWithK(item.count)}</em>
                </div>
            )
        }

        return renderContent()
    }

    private get isMul() {
        const { choiceType } = this.props.data
        return choiceType === 1
    }

    private renderTree(list: IFilterParam[]) {
        const { data } = this.props
        const isTree = data.isTree
        return (
            <Tree
                onSelect={(value, info) => {
                    console.log('value', value, info)
                    const { selectedNodes } = info
                    const dic = {}
                    selectedNodes.forEach((item) => {
                        dic[item.id] = item
                    })
                    this.setState({ selectedDic: dic }, () => {
                        if (!this.isMul) {
                            this.triggerChange()
                        }
                    })
                }}
                multiple={this.isMul}
                className={classNames('FilterTree', isTree ? '' : 'FilterSingleTree')}
                blockNode
                showLine={false}
                treeData={list}
                fieldNames={{ key: 'id', title: 'name' }}
                titleRender={(node) => this.renderItemTitle(node)}
            />
        )
    }

    render() {
        const { data } = this.props
        const { visiblePoper, selectedDic, searchKey, visibleContent } = this.state
        const { filterName, icon = imgType, filterNodes } = data

        const maxDisplayItem = 5
        const showFilter = filterNodes.length > maxDisplayItem
        const firstList = filterNodes.slice(0, maxDisplayItem) // 第1段数据，直接显示
        const secondList = filterNodes.filter((item) => !searchKey || item.name.includes(searchKey)) // 第2段列表，显示在弹窗中
        const selectedCount = Object.keys(selectedDic).length
        const isMul = this.isMul

        return (
            <div className='FilterParamTree'>
                <header>
                    <div className='FilterParamTitleWrap'>
                        <img src={icon} style={{ width: 14 }} />
                        <AutoTip className='Title' content={filterName}></AutoTip>
                        {selectedCount ? <div className='SelectedCount'>{selectedCount}</div> : null}
                    </div>
                    {isMul && (
                        <Button size='small' type='primary' ghost onClick={() => this.triggerChange()}>
                            确定
                        </Button>
                    )}
                    <IconFont
                        type='icon-xiangxia'
                        style={{ transform: visibleContent ? 'none' : 'scaleY(-1)', transition: 'all 0.6s' }}
                        onClick={() => this.setState({ visibleContent: !visibleContent })}
                    />
                </header>
                {visibleContent && (
                    <>
                        <main className='FilterItemGroup'>{this.renderTree(firstList)}</main>
                        <footer>
                            {showFilter && (
                                <Popover
                                    open={visiblePoper}
                                    trigger='click'
                                    placement='right'
                                    showArrow={false}
                                    overlayClassName='FilterOverlay'
                                    onOpenChange={(value) => this.setState({ visiblePoper: value })}
                                    content={
                                        <>
                                            <header>
                                                <div className='FilterParamTitleWrap Title'>
                                                    {selectedCount ? <div className='SelectedCount'>{selectedCount}</div> : null}
                                                    <AutoTip content={filterName} />
                                                </div>
                                                <Input.Search placeholder={`搜索${filterName}`} value={searchKey} onChange={(event) => this.setState({ searchKey: event.target.value })} />
                                            </header>
                                            {secondList.length ? <div className='FilterItemGroup'>{this.renderTree(secondList)}</div> : <div className='FilterEmptyLabel'>- 暂无搜索结果 -</div>}
                                        </>
                                    }
                                >
                                    <a>查看更多 {'>'}</a>
                                </Popover>
                            )}
                        </footer>
                    </>
                )}
            </div>
        )
    }
}

export default FilterParamTree
