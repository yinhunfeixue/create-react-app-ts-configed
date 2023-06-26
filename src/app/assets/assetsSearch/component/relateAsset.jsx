import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { Button, Cascader, Input, Select, Tabs, Tooltip } from 'antd'
import { belongFacts, belongFactsBizModuleAndTheme, belongFactsBizProcess, belongFactsClassifyFilters } from 'app_api/metadataApi'
import DeriveDetailDrawer from 'app_page/dama/newIndexma/deriveDetailDrawer'
import React, { Component } from 'react'
const TabPane = Tabs.TabPane
export default class RelateAsset extends Component {
    constructor(props) {
        super(props)
        this.state = {
            changeTableData: [],
            loading: false,
            type: 1,
            queryInfo: {
                classifyNodeIds: [],
                keyword: '',
            },
            processList: [],
            themeDefList: [],
            bizClassifyDefList: [],
        }
        this.columns = [
            {
                title: '事实资产名称',
                dataIndex: 'name',
                key: 'name',
                width: 200,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp1'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '事实资产英文名',
                dataIndex: 'englishName',
                key: 'englishName',
                width: 200,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp1'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '业务板块',
                dataIndex: 'bizModuleName',
                key: 'bizModuleName',
                minWidth: 120,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '主题域',
                dataIndex: 'themeName',
                key: 'themeName',
                minWidth: 120,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '业务过程',
                dataIndex: 'bizProcessName',
                key: 'bizProcessName',
                minWidth: 120,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
    }
    componentWillMount = () => {
        this.getSearchConditionBizModuleAndTheme()
        this.getTableList()
    }
    openAtomDetail = (data) => {
        this.deriveDrawer.openAtomDetail(data.id)
    }
    openEditModal = (data, type) => {
        data.pageType = type
        data.from = 'dimension'
        this.props.addTab('事实资产详情', data)
    }
    openIndexma = (data) => {
        this.deriveDrawer.openDetailModal(data)
    }
    getFunction = (value) => {
        if (value == 'sum') {
            return '求和'
        } else if (value == 'average') {
            return '平均值'
        } else if (value == 'accumulate') {
            return '累计值'
        } else if (value == 'count') {
            return '不去重计数'
        } else if (value == 'dist_count') {
            return '去重计数'
        } else if (value == 'max') {
            return '最大值'
        } else if (value == 'min') {
            return '最小值'
        }
    }
    getTableList = async (params = {}) => {
        let { queryInfo } = this.state
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            dimAssetsId: this.props.param.id,
        }
        this.setState({ loading: true })
        let res = await belongFacts(query)
        if (res.code == 200) {
            let param = {
                ...params.filterSelectedList,
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 20,
                // dataIndex
            }
            let data = {
                data: res.data,
                total: res.total,
            }
            return {
                dataSource: res.data,
                total: res.total,
            }
        }
    }
    getSearchConditionBizModuleAndTheme = async () => {
        let res = await belongFactsClassifyFilters({ dimAssetsId: this.props.param.id })
        if (res.code == 200) {
            this.setState({
                bizClassifyDefList: this.deleteSubList(res.data),
            })
        }
    }
    deleteSubList = (data) => {
        data.map((item) => {
            if (!item.subList.length) {
                delete item.subList
            } else {
                this.deleteSubList(item.subList)
            }
        })
        console.log(data, 'deleteSubList')
        return data
    }
    changeBusi = async (value, selectedOptions) => {
        console.log(value, selectedOptions)
        let { queryInfo } = this.state
        queryInfo.classifyNodeIds = value
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeType = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            keyword: '',
            classifyNodeIds: [],
        }
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    changeKeyword = async (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        await this.setState({
            queryInfo,
        })
        if (!e.target.value) {
            this.search()
        }
    }
    search = () => {
        this.controller.reset()
    }

    render() {
        const { loading, changeTableData, type, queryInfo, processList, themeDefList, bizClassifyDefList } = this.state

        return (
            <React.Fragment>
                <RichTableLayout
                    smallLayout
                    disabledDefaultFooter
                    renderSearch={(controller) => {
                        this.controller = controller
                        return (
                            <React.Fragment>
                                <Input.Search allowClear value={queryInfo.keyword} onSearch={this.search} onChange={this.changeKeyword} placeholder='搜索事实资产名称' />
                                <Cascader
                                    allowClear
                                    fieldNames={{ label: 'name', value: 'id', children: 'subList' }}
                                    options={bizClassifyDefList}
                                    value={queryInfo.classifyNodeIds}
                                    displayRender={(e) => e.join('-')}
                                    onChange={this.changeBusi}
                                    popupClassName='searchCascader'
                                    placeholder='业务分类'
                                />
                                <Button onClick={this.reset}>重置</Button>
                            </React.Fragment>
                        )
                    }}
                    tableProps={{
                        columns: this.columns,
                    }}
                    requestListFunction={(page, pageSize) => {
                        return this.getTableList({
                            pagination: {
                                page,
                                page_size: pageSize,
                            },
                        })
                    }}
                    editColumnProps={{
                        width: 60,
                        createEditColumnElements: (index, record) => {
                            return RichTableLayout.renderEditElements([
                                {
                                    label: '详情',
                                    onClick: this.openEditModal.bind(this, record, 'look'),
                                },
                            ])
                        },
                    }}
                />
                <DeriveDetailDrawer
                    ref={(dom) => {
                        this.deriveDrawer = dom
                    }}
                    {...this.props}
                />
            </React.Fragment>
        )
    }
}
