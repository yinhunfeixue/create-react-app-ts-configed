import { requestFilterList, requestMetaDataList } from '@/api/metadataIndex'
import FilterParamTree from '@/app/metadataCenter/components/FilterParamTree'
import MetaDataItem from '@/app/metadataCenter/components/MetaDataItem'
import MetaDataType from '@/app/metadataCenter/enum/MetaDataType'
import SearchMethod from '@/app/metadataCenter/enum/SearchMethod'
import IFilterParam, { IFilterParamTree } from '@/app/metadataCenter/interface/FilterParam'
import IMetaData from '@/app/metadataCenter/interface/IMetaData'
import IComponentProps from '@/base/interfaces/IComponentProps'
import EmptyIcon from '@/component/EmptyIcon'
import IconFont from '@/component/IconFont'
import ProjectUtil from '@/utils/ProjectUtil'
import TreeControl from '@/utils/TreeControl'
import { CloseCircleFilled } from '@ant-design/icons'
import { Cascader, Dropdown, Input, Menu, Pagination, Select, Spin } from 'antd'
import { DefaultOptionType } from 'antd/lib/cascader'
import React, { Component } from 'react'
import { Resizable } from 'react-resizable'
import './MetaDataCenterPage.less'

interface IMetaDataCenterPageState {
    // 搜索参数
    search: {
        key?: string
        searchMethod: SearchMethod
        domain: MetaDataType
    }

    loadingFilterParam: boolean
    loadingMetaData: boolean

    // 左侧参数列表
    leftFilterParamTrees: IFilterParamTree[]

    /**
     * 顶部参数列表
     */
    topFilterParamTrees: IFilterParamTree[]

    // 选中的参数值（包含左侧与顶部）
    filterParamValues: {
        [id: string]: IFilterParam[] | IFilterParam[][]
    }

    metaData: {
        dataSource: IMetaData[]
        total: number
        current: number
        pageSize: number
    }

    sliderWidth: number
}
interface IMetaDataCenterPageProps extends IComponentProps {}

/**
 * 元数据中心
 */
class MetaDataCenterPage extends Component<IMetaDataCenterPageProps, IMetaDataCenterPageState> {
    constructor(props: IMetaDataCenterPageProps) {
        super(props)
        this.state = {
            search: {
                key: '',
                searchMethod: SearchMethod.FUZZY,
                domain: MetaDataType.PHYSICAL_TABLE,
            },
            loadingFilterParam: false,
            loadingMetaData: false,
            leftFilterParamTrees: [],
            topFilterParamTrees: [],
            filterParamValues: {},
            sliderWidth: 252,

            metaData: {
                dataSource: [],
                total: 0,
                current: 1,
                pageSize: 10,
            },
        }
    }

    componentDidMount() {
        this.requestFilterTreeList()
        this.requestMetadataList()
    }

    private get filterNodes(): IFilterParam[] {
        const { filterParamValues } = this.state
        const filterNodes = Object.values(filterParamValues)
        return filterNodes.flat(3)
    }

    private requestMetadataList() {
        const { search, metaData } = this.state
        const { pageSize, current } = metaData
        const { key } = search

        this.setState({ loadingMetaData: true })
        requestMetaDataList({
            domain: search.domain,
            keyword: key,
            filterNodes: this.filterNodes,
            preciseSearch: search.searchMethod === SearchMethod.EXACT,
            pageSize,
            page: current,
        })
            .then((res) => {
                const { total = 0, list = [] } = res.data || {}
                this.setState({
                    metaData: {
                        ...metaData,
                        total,
                        dataSource: list || [],
                    },
                })
            })
            .finally(() => {
                this.setState({ loadingMetaData: false })
            })
    }

    private requestFilterTreeList() {
        const { search } = this.state
        this.setState({ loadingFilterParam: true })
        requestFilterList({
            domain: search.domain,
            preciseSearch: search.searchMethod === SearchMethod.EXACT,
            filterNodes: this.filterNodes,
            keyword: search.key,
        })
            .then((res) => {
                let data: IFilterParamTree[] = res.data || []
                data.sort((a, b) => {
                    return a.position - b.position
                })
                const leftFilterParamTrees = data.filter((item) => item.filterPosition === 1)
                const topFilterParamTrees = data.filter((item) => item.filterPosition === 2)
                this.setState({ leftFilterParamTrees, topFilterParamTrees })
            })
            .finally(() => {
                this.setState({ loadingFilterParam: false })
            })
    }

    private resetFilterTreeValue(): Promise<void> {
        return new Promise((resolve) => {
            this.setState(
                {
                    filterParamValues: {},
                },
                () => resolve()
            )
        })
    }

    private async resetFilterTreeValueAndRequest() {
        await this.resetFilterTreeValue()
        await this.resetPage()
        this.requestFilterTreeList()
        this.requestMetadataList()
    }

    private resetPage(): Promise<void> {
        return new Promise((resolve) => {
            const { metaData } = this.state
            this.setState(
                {
                    metaData: {
                        ...metaData,
                        current: 1,
                    },
                },
                () => resolve()
            )
        })
    }

    private renderHeader() {
        const domainList = MetaDataType.ALL
        const searchMethodList = SearchMethod.ALL
        const { search } = this.state
        const { domain, searchMethod, key } = search
        return (
            <header>
                <div className='HeaderContent'>
                    <Select
                        className='SelectTarget'
                        value={domain}
                        size='large'
                        options={domainList.map((item) => ({ value: item, label: MetaDataType.toString(item) }))}
                        onChange={(value) => {
                            this.setState(
                                {
                                    search: {
                                        ...search,
                                        key: '',
                                        domain: value,
                                    },
                                },
                                () => this.resetFilterTreeValueAndRequest()
                            )
                        }}
                    />
                    <Input
                        className='InputSearch'
                        allowClear={{
                            clearIcon: (
                                <CloseCircleFilled
                                    onClick={() => {
                                        this.setState({ search: { ...search, key: '' } }, () => this.resetFilterTreeValueAndRequest())
                                    }}
                                />
                            ),
                        }}
                        value={key}
                        onChange={(event) => this.setState({ search: { ...search, key: event.target.value } })}
                        onPressEnter={() => this.resetFilterTreeValueAndRequest()}
                        size='large'
                        prefix={<IconFont type='icon-search' style={{ fontSize: 16 }} />}
                        placeholder='请输入搜索关键字'
                    />
                    <Dropdown.Button
                        size='large'
                        type='primary'
                        icon={<IconFont type='e645' useCss />}
                        onClick={() => this.resetFilterTreeValueAndRequest()}
                        overlay={
                            <Menu
                                selectedKeys={[searchMethod.toString()]}
                                items={searchMethodList.map((item) => ({ key: item, label: SearchMethod.toString(item) }))}
                                onClick={({ key }) => {
                                    this.setState({
                                        search: {
                                            ...search,
                                            searchMethod: key as unknown as SearchMethod,
                                        },
                                    })
                                }}
                            />
                        }
                    >
                        <span>{searchMethod === SearchMethod.EXACT ? '精确搜索' : '模糊搜索'}</span>
                    </Dropdown.Button>
                </div>
            </header>
        )
    }

    private getFilterItemValue(item: IFilterParam) {
        return item.id || item.name
    }

    private renderCondition() {
        const { topFilterParamTrees, filterParamValues } = this.state

        return (
            <>
                {topFilterParamTrees.map((groupItem) => {
                    const { filterName, choiceType, filterNodes } = groupItem
                    const isMul = choiceType === 1
                    const width = Math.max(100, filterName.length * 16 + (isMul ? 100 : 60))
                    const treeControl = new TreeControl<IFilterParam>()
                    const options: DefaultOptionType[] | undefined = treeControl.map(filterNodes, (node, index, _, newChildren) => {
                        return {
                            label: node.name,
                            value: this.getFilterItemValue(node),
                            children: newChildren && newChildren.length ? newChildren : undefined,
                            node,
                        }
                    })

                    const selectedItems = filterParamValues[filterName]
                    let value: any[] = []
                    if (selectedItems) {
                        value = selectedItems.map((item) => {
                            if (Array.isArray(item)) {
                                return item.map((item2) => this.getFilterItemValue(item2))
                            }
                            return this.getFilterItemValue(item)
                        })
                    }

                    return (
                        <Cascader
                            changeOnSelect
                            value={value}
                            allowClear
                            showCheckedStrategy={Cascader.SHOW_CHILD}
                            placeholder={filterName}
                            style={{ width }}
                            options={options}
                            onChange={(value, option) => {
                                // 提取option的数据，放到数据中
                                let items: IFilterParam[] | IFilterParam[][] = option
                                    ? option.map((item) => {
                                          if (Array.isArray(item)) {
                                              return item.map((item2) => ({ ...item2.node, children: undefined }))
                                          }
                                          return { ...item.node, children: undefined }
                                      })
                                    : []
                                filterParamValues[filterName] = items
                                this.resetPageAndRequest()
                                this.requestFilterTreeList()
                            }}
                            {...{ multiple: isMul }}
                        />
                    )
                })}
                {/* <Dropdown arrow={false} overlayClassName='OtherConditionWrap' overlay={renderOtherCondition()} placement='bottomLeft'>
                    <Button>其它筛选条件</Button>
                </Dropdown> */}
                <a className='BtnReset' onClick={() => this.reset()}>
                    <IconFont type='e6cc' useCss style={{ fontSize: 14 }} /> 重置全部
                </a>
            </>
        )
    }

    private reset() {
        const { search } = this.state

        this.setState(
            {
                // 清除搜索词和顶部选项
                search: {
                    searchMethod: search.searchMethod,
                    domain: search.domain,
                },

                // 清除左侧选项
                filterParamValues: {},
            },
            () => {
                this.requestFilterTreeList()
                this.requestMetadataList()
            }
        )
    }

    private async resetPageAndRequest() {
        await this.resetPage()
        this.requestMetadataList()
    }

    private renderBody() {
        const { leftFilterParamTrees, topFilterParamTrees, metaData, loadingMetaData } = this.state
        const empty = !loadingMetaData && !leftFilterParamTrees.length && !metaData.dataSource.length && !topFilterParamTrees.length
        if (empty) {
            return <EmptyIcon title='没有找到符合条件的结果' description='请试试其它条件' style={{ marginTop: 103 }} />
        }
        return (
            <div className='MetaDataCenterBody'>
                {this.renderLeft()}
                {this.renderRight()}
            </div>
        )
    }

    private renderRight() {
        const { loadingMetaData, metaData } = this.state
        const { total, pageSize, dataSource, current } = metaData
        return (
            <div className='Right' key={current}>
                <div className='ParamContainer'>{this.renderCondition()}</div>
                <main>
                    {dataSource && dataSource.length ? (
                        <>
                            <Spin spinning={loadingMetaData}>
                                {dataSource.map((item, index) => {
                                    return <MetaDataItem key={index} data={item} />
                                })}
                            </Spin>
                            <Pagination
                                className='Page'
                                showTotal={(total) => (
                                    <span>
                                        总数 <b>{ProjectUtil.formNumber(total)}</b> 条
                                    </span>
                                )}
                                pageSize={pageSize}
                                current={current}
                                total={total}
                                showSizeChanger
                                showQuickJumper
                                onChange={(page, pageSize) => {
                                    this.setState(
                                        {
                                            metaData: {
                                                ...metaData,
                                                current: page,
                                                pageSize,
                                            },
                                        },
                                        () => this.requestMetadataList()
                                    )
                                }}
                            />
                        </>
                    ) : (
                        <EmptyIcon style={{ marginTop: 80 }} />
                    )}
                </main>
            </div>
        )
    }

    private renderLeft() {
        const { leftFilterParamTrees, sliderWidth, filterParamValues, loadingFilterParam } = this.state
        return (
            <Resizable
                width={sliderWidth}
                height={0}
                onResize={(event, data) => {
                    const { width } = data.size
                    const max = 400
                    const min = 220
                    this.setState({ sliderWidth: Math.min(max, Math.max(min, width)) })
                }}
                draggableOpts={{ enableUserSelectHack: true }}
            >
                <div className='Left' style={{ width: sliderWidth }}>
                    <Spin spinning={loadingFilterParam}>
                        {leftFilterParamTrees.map((item, index) => {
                            const selectedItems = filterParamValues[item.filterName] || []
                            return (
                                <FilterParamTree
                                    key={index}
                                    data={item}
                                    value={selectedItems.map((item) => (item as IFilterParam).id)}
                                    onChange={async (value, items) => {
                                        filterParamValues[item.filterName] = items
                                        this.resetPageAndRequest()
                                        this.requestFilterTreeList()
                                    }}
                                />
                            )
                        })}
                    </Spin>
                </div>
            </Resizable>
        )
    }

    render() {
        return (
            <div className='MetaDataCenterPage'>
                {this.renderHeader()}
                {this.renderBody()}
            </div>
        )
    }
}

export default MetaDataCenterPage
