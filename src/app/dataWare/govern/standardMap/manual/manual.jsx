import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import SliderLayout from '@/component/layout/SliderLayout'
import { SearchTree } from '@/components'
import { defaultTitleRender } from '@/components/trees/SearchTree'
import TreeControl from '@/utils/TreeControl'
import { Input, Modal, Radio, Select } from 'antd'
import { dwappStandard, dwappStandardStatistic } from 'app_api/standardApi'
import { getStandardTree } from 'app_api/systemManage'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'
// import './index.less'
import './manual.less'

const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input
const confirm = Modal.confirm

const treeControl = new TreeControl()

export default class eastReport extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            tableData: [],
            keyword: '',
            treeData: [], // 树数据
            treeNodeId: '',
            drawerVisible: true,
            mapColumnRatio: 0,
        }
        this.columns = [
            {
                title: '标准编码',
                dataIndex: 'entityIdDesc',
                key: 'entityIdDesc',
                width: 150,
                render: (_, record) => (
                    <Tooltip title={this.renderTooltip.bind(this, _)}>
                        {_ ? <a style={{ maxWidth: 150 }} className='LineClamp1' onClick={() => this.onView(record)} dangerouslySetInnerHTML={{ __html: _ }} /> : <EmptyLabel />}
                    </Tooltip>
                ),
            },
            {
                title: '标准英文名',
                dataIndex: 'entityName',
                key: 'entityName',
                width: 150,
                render: (_, record) => <Tooltip title={this.renderTooltip.bind(this, _)}>{_ ? <span className='LineClamp1' dangerouslySetInnerHTML={{ __html: _ }} /> : <EmptyLabel />}</Tooltip>,
            },
            {
                title: '标准中文名',
                dataIndex: 'entityDesc',
                key: 'entityDesc',
                width: 150,
                render: (_, record) => <Tooltip title={this.renderTooltip.bind(this, _)}>{_ ? <span className='LineClamp1' dangerouslySetInnerHTML={{ __html: _ }} /> : <EmptyLabel />}</Tooltip>,
            },
            {
                title: '业务定义',
                dataIndex: 'businessDefinition',
                key: 'businessDefinition',
                width: 150,
                render: (_, record) => (
                    <Tooltip placement='topLeft' title={this.renderTooltip.bind(this, _)}>
                        {_ ? <span className='LineClamp1' dangerouslySetInnerHTML={{ __html: _ }} /> : <EmptyLabel />}
                    </Tooltip>
                ),
            },
            {
                title: '已映射字段',
                dataIndex: 'columnNum',
                key: 'columnNum',
                width: 120,
                render: (text, record) => <Tooltip title={text}>{text}</Tooltip>,
            },
        ]
    }
    componentWillMount = () => {
        this.getStandardCategory()
        this.getTableList({})
        this.getDwappStandardStatistic()
    }
    onView = (params) => {
        this.props.addTab('标准详情', params, true)
    }
    renderTooltip = (value) => {
        return <span style={{ color: '#fff' }} dangerouslySetInnerHTML={{ __html: value }}></span>
    }
    getDwappStandardStatistic = async () => {
        let res = await dwappStandardStatistic({ treeNodeId: this.state.treeNodeId })
        if (res.code == 200) {
            this.setState({
                mapColumnRatio: res.data.mapColumnRatio,
            })
        }
    }
    getTableList = async (params = {}) => {
        let query = {
            ...params,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            keyword: this.state.keyword,
            treeNodeId: this.state.treeNodeId,
            entityStatus: '已发布',
        }
        this.setState({ loading: true })
        let res = await dwappStandard(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            res.data.map((item) => {
                item.entityIdDesc = item.entityIdDesc ? item.entityIdDesc : item.entityId
            })
            return {
                dataSource: res.data,
                total: res.total,
            }
        }
        return {
            dataSource: [],
            total: 0,
        }
    }
    reset = async () => {
        await this.setState({
            keyword: '',
        })
        this.search()
    }
    changeKeyword = (e) => {
        this.setState({
            keyword: e.target.value,
        })
    }
    search = () => {
        // this.getTableList({})
        if (this.controller) {
            this.controller.reset()
        }
    }
    openAddModal = (data) => {
        this.props.addTab('映射管理', data)
    }
    onTreeSelect = async (selectedKeys, e) => {
        if (!/^[0-9]*$/.test(selectedKeys[0])) {
            // 如果不是数字
            await this.setState({
                treeNodeId: selectedKeys[0] == '5394c2b7fe794702bc54fcf5f3323235' ? '' : selectedKeys[0],
            })
            this.search()
            this.getDwappStandardStatistic()
        } else {
            await this.setState({
                treeNodeId: '',
            })
            // this.getTableList()
            this.search()
            this.getDwappStandardStatistic()
        }
    }
    getStandardCategory = async () => {
        const res = await getStandardTree({ code: 'ZT002', status: 1 })
        if (res.code == '200') {
            this.setState({
                treeData: res.data.children || [],
            })
        }
    }
    showDrawer = async () => {
        await this.setState({
            drawerVisible: !this.state.drawerVisible,
        })
        if (this.state.drawerVisible) {
            this.getStandardCategory()
        }
    }
    getToFixedNum = (value) => {
        if (value) {
            return value.toFixed(2).replace(/[.]?0+$/g, '') + '%'
        } else {
            return '0%'
        }
    }

    render() {
        const { treeNodeId, tableData, loading, keyword, treeData, drawerVisible, mapColumnRatio, selectedNodes } = this.state
        let expandedKeys = []
        treeData.map((item) => {
            expandedKeys.push(item.id)
        })

        const treeChain = treeControl.searchChain(treeData, (node) => node.id === treeNodeId)
        const tableTitle = treeChain && treeChain.length ? treeChain.map((item) => item.name).join(' / ') : '标准列表'

        const getIcon = (data) => {
            switch (data.level) {
                case 1:
                    return <img style={{ width: 16, height: 16, borderRadius: 1 }} src={data.description} />
                case 2:
                    return <span className='iconfont icon-shujuyu'></span>
                default:
                    return <span className='iconfont icon-fenlei'></span>
            }
        }
        return (
            <SliderLayout
                className='standardMapList'
                renderSliderHeader={() => {
                    return '数据标准目录'
                }}
                sliderBodyStyle={{ padding: 0 }}
                renderSliderBody={() => {
                    return (
                        <SearchTree
                            treeProps={{ treeData, fieldNames: { key: 'id', title: 'name' }, onSelect: this.onTreeSelect }}
                            defaultSelectedEqual={(node) => {
                                return node.id === treeData[0].id
                            }}
                            treeTitleRender={(node, searchKey) => {
                                return defaultTitleRender(
                                    node,
                                    (data) => {
                                        return {
                                            icon: getIcon(data),
                                            title: data.name,
                                        }
                                    },
                                    searchKey
                                )
                            }}
                        />
                    )
                }}
                renderContentHeader={() => {
                    return tableTitle
                }}
                renderContentBody={() => {
                    return (
                        <RichTableLayout
                            renderSearch={(controller) => {
                                this.controller = controller
                                return <Input.Search allowClear value={keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入标准编码，中文名，英文名' />
                            }}
                            disabledDefaultFooter
                            tableProps={{
                                columns: this.columns,
                                key: 'id',
                                extraTableProps: {
                                    scroll: {
                                        x: 1300,
                                    },
                                },
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
                                width: 100,
                                createEditColumnElements: (index, record) => {
                                    return RichTableLayout.renderEditElements([
                                        {
                                            label: '映射管理',
                                            funcCode: '/dtstd/mapping/manage/edit',
                                            onClick: this.openAddModal.bind(this, record),
                                        },
                                    ])
                                },
                            }}
                        />
                    )
                }}
            />
        )
    }
}
