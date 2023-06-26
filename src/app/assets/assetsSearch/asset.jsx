import EmptyIcon from '@/component/EmptyIcon'
import IconFont from '@/component/IconFont'
import TextMore from '@/component/textmore/TextMore'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { CaretRightFilled, DownOutlined, ForkOutlined, HddOutlined } from '@ant-design/icons'
import { Collapse, Input, Pagination, Popover, Select, Spin, Tabs, Tag, Tooltip, Tree } from 'antd'
import { businessSearch, businessTree, metricsSearch, metricsTree } from 'app_api/termApi'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import './asset.less'
import IndexmaDrawer from './indexmaDrawer'

const { TreeNode } = Tree
const { Search } = Input
const { Panel } = Collapse
const TabPane = Tabs.TabPane

const assetTypeOptions = [
    { label: '系统表', value: '0' },
    { label: '数据集', value: '1' },
    { label: '报表', value: '2' },
]

@observer
export default class CreateETL extends Component {
    constructor(props) {
        super(props)
        this.state = {
            spinLoading: false,
            queryInfo: {
                page: 1,
                pageSize: 10,
                keyword: '',
                treeFilters: [],
            },
            total: 0,
            expandedKeys: [],
            checkedKeys: [],
            searchTree: [],
            singleSearchTree: [],
            singleExpandedKeys: [],
            singleCheckedKeys: [],
            assetList: [],
            treeLoading: false,
            tabValue: '0',
            detailInfo: {},
        }
    }
    componentWillMount = async () => {
        this.getDataAsset()
        this.getTree()
    }
    getTree = async () => {
        let { expandedKeys, queryInfo, singleExpandedKeys, tabValue } = this.state
        this.setState({ treeLoading: true, searchTree: [] })
        let res = {}
        if (tabValue == 0) {
            res = await businessTree(queryInfo)
        } else {
            res = await metricsTree(queryInfo)
        }
        this.setState({ treeLoading: false })
        if (res.code == 200) {
            res.data.map((item) => {
                item.level = 0
                // expandedKeys.push(item.id)
            })
            console.log(expandedKeys, 'expandedKeys')
            await this.setState({ singleExpandedKeys: [] })
            await this.getExpandedKeys([res.data[1]])
            this.setState({
                searchTree: [res.data[0]],
                singleSearchTree: this.addType([res.data[1]]),
                expandedKeys: [res.data[0].id],
                // singleExpandedKeys: [res.data[1].id]
            })
        }
    }
    getExpandedKeys = (data) => {
        let { singleExpandedKeys } = this.state
        data.map((item) => {
            singleExpandedKeys.push(item.id)
            if (item.children) {
                this.getExpandedKeys(item.children)
            }
        })
        this.setState({
            singleExpandedKeys,
        })
    }
    addType = (data) => {
        data.map((item) => {
            item.filterType = 'bizType'
            if (item.children) {
                this.addType(item.children)
            }
        })
        return data
    }
    numberFormat = (num) => {
        if (num) {
            if (num < 1000) {
                return num
            } else if (num >= 1000 && num < 1000000) {
                return (num / 1000).toFixed(2) + 'K'
            } else if (num >= 1000000) {
                return (num / 1000000).toFixed(2) + 'M'
            }
        } else {
            return '0'
        }
    }
    getDataAsset = async () => {
        let { queryInfo, tabValue } = this.state
        queryInfo.preciseSearch = this.state.preciseSearch
        this.setState({ spinLoading: true })
        let res = {}
        if (tabValue == 0) {
            res = await businessSearch(queryInfo)
        } else {
            res = await metricsSearch(queryInfo)
        }
        if (res.code == 200) {
            res.data.assetsList.map((item) => {
                item.relateMetricsList = item.relateMetricsList ? item.relateMetricsList : []
                item.relateFactAssets = item.relateFactAssets ? item.relateFactAssets : []
                item.relateBizLimitList = item.relateBizLimitList ? item.relateBizLimitList : []
                item.modelInfoList = item.modelInfoList ? item.modelInfoList : []
                item.columnInfoList = item.columnInfoList ? item.columnInfoList : []
                item.columnTip = ''
                item.columnInfoList.map((column, index) => {
                    item.columnTip += column.name + ' '
                })
            })
            console.log(res.data.assetsList, 'res.data.assetsList,')
            await this.setState({
                assetList: res.data.assetsList,
                total: res.total,
            })
        }
        this.setState({ spinLoading: false })
    }
    onShowSizeChange = async (current, pageSize) => {
        const { queryInfo } = this.state
        queryInfo.page = 1
        queryInfo.pageSize = pageSize
        await this.setState({
            queryInfo,
        })
        this.getDataAsset()
    }
    changePage = async (page) => {
        const { queryInfo } = this.state
        queryInfo.page = page
        await this.setState({
            queryInfo,
        })
        this.getDataAsset()
        document.querySelector('.dataAssetContent').scrollTop = 0
    }
    onSingleExpand = (expandedKeys) => {
        this.setState({
            singleExpandedKeys: expandedKeys,
        })
    }
    onSingleCheck = async (checkedKeys, e) => {
        let { queryInfo } = this.state
        console.log('onSingleCheck', checkedKeys)
        console.log(e, 'onSingleCheck')
        let dataRef = { ...e.node.props.dataRef }
        let hasData = false
        let index
        if (dataRef.children !== undefined) {
            delete dataRef.children
        }
        for (let i = 0; i < queryInfo.treeFilters.length; i++) {
            if (queryInfo.treeFilters[i].filterType == 'bizType') {
                hasData = true
                index = i
            }
        }
        if (hasData) {
            queryInfo.treeFilters.splice(index, 1)
            if (e.selected) {
                queryInfo.treeFilters.push(dataRef)
            }
        } else {
            if (e.selected) {
                queryInfo.treeFilters.push(dataRef)
            }
        }
        queryInfo.page = 1
        await this.setState({ singleCheckedKeys: checkedKeys, queryInfo })
        // this.getTree()
        this.getDataAsset()
    }
    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
        })
        console.log(expandedKeys, 'expandedKeys')
    }
    onCheck = async (checkedKeys, e) => {
        let { queryInfo } = this.state
        console.log('onCheck', checkedKeys)
        console.log(e, 'oncheck')
        let dataRef = { ...e.node.props.dataRef }
        // delete dataRef.children
        let hasData = false
        let index
        if (dataRef.children !== undefined) {
            if (queryInfo.treeFilters.length) {
                dataRef.children.map((item) => {
                    queryInfo.treeFilters.map((item1, i) => {
                        if (item.id == item1.id) {
                            queryInfo.treeFilters.splice(i, 1)
                        }
                    })
                })
                if (e.checked) {
                    queryInfo.treeFilters.push(...dataRef.children)
                    // queryInfo.treeFilters = Array.from(new Set(queryInfo.treeFilters))
                }
            } else {
                dataRef.children.map((item) => {
                    queryInfo.treeFilters.push(item)
                })
            }
        } else {
            if (queryInfo.treeFilters.length) {
                for (let i = 0; i < queryInfo.treeFilters.length; i++) {
                    if (queryInfo.treeFilters[i].id == dataRef.id) {
                        hasData = true
                        index = i
                    }
                }
                if (hasData) {
                    queryInfo.treeFilters.splice(index, 1)
                } else {
                    if (e.checked) {
                        queryInfo.treeFilters.push(dataRef)
                    }
                }
            } else {
                if (e.checked) {
                    queryInfo.treeFilters.push(dataRef)
                }
            }
        }
        console.log(queryInfo, 'queryInfo')
        queryInfo.page = 1
        await this.setState({ checkedKeys, queryInfo })
        // this.getTree()
        this.getDataAsset()
    }
    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info)
        this.setState({ selectedKeys })
    }
    changeKeyword = (e) => {
        console.log(e.target.value, 'changeKeyword')
        const { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        this.setState({
            queryInfo,
        })
    }
    closeTagFilter = async (data, index) => {
        let { queryInfo, checkedKeys, singleCheckedKeys, singleSearchTree } = this.state
        queryInfo.treeFilters.splice(index, 1)
        if (data.filterType == 'bizType') {
            singleCheckedKeys = []
            // singleSearchTree = []
        } else {
            let index1 = 0
            checkedKeys.map((item, i) => {
                if (item == data.id) {
                    index1 = i
                }
            })
            checkedKeys.splice(index1, 1)
        }
        await this.setState({ checkedKeys, singleSearchTree, singleCheckedKeys, queryInfo })
        this.getDataAsset()
    }
    getAssetDetail = (data, tab) => {
        console.log('dataaaa', data)
        if (this.state.tabValue == 0) {
            data.showVersion = false
            this.props.addTab(
                '模型资产详情',
                {
                    ...data,
                    columnInfoList: undefined,
                    relateBizLimitList: undefined,
                    columnTip: undefined,
                },
                true
            )
        } else {
            data.tabValue = tab
            this.setState({
                detailInfo: data,
            })
            this.indexmaDrawer.openDrawer(data)
        }
    }
    getShortName = (name) => {
        if (name) {
            if (name.length > 8) {
                return name.substr(0, 7) + '...'
            } else {
                return name
            }
        } else {
            return '空'
        }
    }
    // 展示多少页
    showTotal = (total) => {
        return (
            <span>
                总数 <b>{ProjectUtil.formNumber(total)}</b> 条
            </span>
        )
    }
    keywordSearch = async (value) => {
        const { queryInfo } = this.state
        queryInfo.keyword = value
        queryInfo.page = 1
        await this.setState({
            queryInfo,
        })
        // this.getTree()
        this.getDataAsset()
    }
    changeTab = async (e) => {
        let { queryInfo } = this.state
        queryInfo = {
            page: 1,
            pageSize: 10,
            keyword: '',
            treeFilters: [],
        }
        await this.setState({
            tabValue: e,
            queryInfo,
            singleCheckedKeys: [],
            checkedKeys: [],
        })
        this.getTree()
        this.getDataAsset()
    }
    renderTooltip = (value, style = { color: '#fff' }) => {
        return <a style={style} dangerouslySetInnerHTML={{ __html: value }}></a>
    }

    /**
     *
     * @param {{label:string, content:any}[]} list
     * @returns
     */
    renderItemList(list) {
        return RenderUtil.renderSplitList(list, 'assetLabel', this.renderTooltip)
    }

    componentDidMount() {
        RenderUtil.removeTypographyTitle()

        window.addEventListener('resize', this.resizeHandler)
        document.getElementById('assetWrap').addEventListener('scroll', this.resizeHandler)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeHandler)
        document.getElementById('assetWrap').removeEventListener('scroll', this.resizeHandler)
    }

    componentDidUpdate(prevProps, prevState) {
        RenderUtil.removeTypographyTitle()
        this.updateTreeWrapStyle()
    }

    resizeHandler = () => {
        this.updateTreeWrapStyle()
    }

    updateTreeWrapStyle() {
        const dataWare = document.getElementById('assetWrap')
        const dataWareHeader = document.getElementById('assetWrapHeader')
        const treeWrap = document.getElementById('treeWrap')
        // 如果滚动距离小于header高度，需减去header高度
        let height = dataWare.offsetHeight
        if (dataWare.scrollTop < dataWareHeader.offsetHeight) {
            height -= dataWareHeader.offsetHeight - dataWare.scrollTop + 15
        } else {
        }

        treeWrap.style.height = `${height}px`
    }

    render() {
        let {
            total,
            expandedKeys,
            checkedKeys,
            searchTree,
            singleSearchTree,
            singleExpandedKeys,
            singleCheckedKeys,
            assetList,
            queryInfo,
            spinLoading,
            treeLoading,
            tabValue,
            detailInfo,
            preciseSearch,
        } = this.state

        const delay = 1.5
        const treeTitle = (data) => {
            return (
                <span>
                    <Tooltip title={data.name}>{this.getShortName(data.name)}</Tooltip>
                    <span style={{ color: '#b3b3b3', display: data.level == 0 ? 'none' : 'inline-block' }}>（{this.numberFormat(data.statistic)}）</span>
                </span>
            )
        }
        const titleIcon = () => {
            return <DownOutlined />
        }
        const renderTreeNodes = (data, parentId) =>
            data.map((item) => {
                if (item.children) {
                    return (
                        <TreeNode
                            checkable={item.level == 0 ? false : true}
                            className={item.level == 0 ? 'treeTitle' : ''}
                            icon={<DownOutlined />}
                            title={treeTitle(item)}
                            key={item.id}
                            parentId={parentId}
                            dataRef={item}
                        >
                            {renderTreeNodes(item.children, item.id)}
                        </TreeNode>
                    )
                }
                return <TreeNode checkable={item.level == 0 ? false : true} className={item.level == 0 ? 'treeTitle' : ''} title={treeTitle(item)} key={item.id} parentId={parentId} dataRef={item} />
            })
        const renderTreeNodes1 = (data, parentId) =>
            data.map((item) => {
                if (item.children) {
                    return (
                        <TreeNode className={item.level == 0 ? 'treeTitle' : ''} icon={<DownOutlined />} title={treeTitle(item)} key={item.id} parentId={parentId} dataRef={item}>
                            {renderTreeNodes(item.children, item.id)}
                        </TreeNode>
                    )
                }
                return <TreeNode className={item.level == 0 ? 'treeTitle' : ''} title={treeTitle(item)} key={item.id} parentId={parentId} dataRef={item} />
            })

        return (
            <div id='assetWrap' className='assetsSearch'>
                <header id='assetWrapHeader'>
                    <div className='HeaderContent'>
                        <Select size='large' onChange={this.changeTab} value={tabValue}>
                            {RenderUtil.renderSelectOptionList(
                                [
                                    {
                                        value: '0',
                                        label: '模型资产',
                                    },
                                    {
                                        value: '1',
                                        label: '指标资产',
                                    },
                                ],
                                (item) => item.label,
                                (item) => item.value
                            )}
                        </Select>
                        <Search
                            allowClear
                            enterButton={<span className='iconfont icon-a-searchall'></span>}
                            value={queryInfo.keyword}
                            size='large'
                            onChange={this.changeKeyword}
                            placeholder='请输入内容'
                            onSearch={this.keywordSearch}
                        />
                        <span className='searchMode'>
                            <Spin spinning={spinLoading}>
                                <span
                                    onClick={() => {
                                        this.setState({ preciseSearch: !preciseSearch }, () => this.getDataAsset())
                                    }}
                                >
                                    <IconFont type='icon-qiehuan' /> {preciseSearch ? '精准搜索' : '模糊搜索'}
                                </span>
                            </Spin>
                        </span>
                    </div>
                </header>
                <div className='Body'>
                    {/* 左侧树 */}
                    <div className='Left' id='treeWrap'>
                        <header>指标类型</header>
                        <main>
                            <Spin spinning={treeLoading}>
                                <div>
                                    {searchTree.length ? (
                                        <Tree checkable onExpand={this.onExpand} expandedKeys={expandedKeys} onCheck={this.onCheck} checkedKeys={checkedKeys}>
                                            {renderTreeNodes(searchTree)}
                                        </Tree>
                                    ) : null}
                                    {singleSearchTree.length ? (
                                        <Tree defaultExpandAll={true} onSelect={this.onSingleCheck} selectedKeys={singleCheckedKeys}>
                                            {renderTreeNodes1(singleSearchTree)}
                                        </Tree>
                                    ) : null}
                                </div>
                            </Spin>
                        </main>
                    </div>
                    <div className='ShadowDecorate' />
                    {/* 右侧内容 */}
                    <div className='Content'>
                        <header className='HControlGroup'>
                            <span>相关资源: {total} 条</span>
                            {queryInfo.treeFilters.map((item, index) => {
                                return (
                                    <Tag onClose={this.closeTagFilter.bind(this, item, index)} className='ExtraTag' closable style={{ marginBottom: 0 }}>
                                        {item.name}
                                    </Tag>
                                )
                            })}
                        </header>
                        <main>
                            {/* 内容列表 */}
                            {total ? (
                                <div className='assetContent'>
                                    <Spin spinning={spinLoading}>
                                        {assetList.map((item) => {
                                            return (
                                                <div className='assetItem' onClick={this.getAssetDetail.bind(this, item, '0')}>
                                                    {/* 列表项标题 */}
                                                    <div className='assetTitle'>
                                                        <span
                                                            className='assetIcon'
                                                            style={{
                                                                background: item.type == 'atomic' || item.type == 11 ? '' : '#EA8137',
                                                            }}
                                                        >
                                                            {item.type == 'atomic' ? '原' : item.type == 'derivative' ? '衍' : item.type == 10 ? '维' : '事'}
                                                        </span>
                                                        <Tooltip title={this.renderTooltip(item.ename + ' ' + item.cname)}>
                                                            <span className='title'>
                                                                <span dangerouslySetInnerHTML={{ __html: item.ename }} style={{ marginRight: 8 }} />
                                                                <span dangerouslySetInnerHTML={{ __html: item.cname }} />
                                                            </span>
                                                        </Tooltip>
                                                    </div>
                                                    {item.description ? (
                                                        <Tooltip placement='topLeft' title={item.description}>
                                                            <div className='assetDetail'>{item.description}</div>
                                                        </Tooltip>
                                                    ) : null}
                                                    <div className='assetDetail'>
                                                        {this.renderItemList([
                                                            {
                                                                label: '业务板块：',
                                                                content: item.bizModuleName,
                                                            },
                                                            {
                                                                label: '主题域：',
                                                                content: item.themeName,
                                                            },
                                                            {
                                                                label: '业务过程：',
                                                                content: item.bizProcessName,
                                                            },
                                                            {
                                                                label: item.type == 10 || item.type == 11 ? '资产类型：' : '指标类型：',
                                                                content: item.typeDesc,
                                                            },
                                                        ])}
                                                    </div>
                                                    {item.type == 'derivative' ? (
                                                        <div className='assetDetail'>
                                                            {this.renderItemList([
                                                                {
                                                                    label: '原子指标：',
                                                                    content: item.atomicMetricsName,
                                                                },
                                                                {
                                                                    label: '统计粒度：',
                                                                    content: item.statisticalColumnNames,
                                                                },
                                                                {
                                                                    label: '统计周期：',
                                                                    content: item.statisticalPeriodName,
                                                                },
                                                                {
                                                                    label: '业务限定：',
                                                                    content: item.bizLimitName,
                                                                },
                                                            ])}
                                                        </div>
                                                    ) : null}
                                                    {item.type == 'atomic' ? (
                                                        <div className='assetDetail'>
                                                            <Tooltip title={this.renderTooltip(item.sourceFactAssetsName + ' ' + item.sourceFactAssetsEname)}>
                                                                <span className='assetLabel' style={{ maxWidth: '100%' }}>
                                                                    <label>事实来源：</label>
                                                                    <span style={{ marginRight: 8 }} dangerouslySetInnerHTML={{ __html: item.sourceFactAssetsName }}></span>
                                                                    <span dangerouslySetInnerHTML={{ __html: item.sourceFactAssetsEname }}></span>
                                                                </span>
                                                            </Tooltip>
                                                        </div>
                                                    ) : null}
                                                    {item.columnInfoList.length && (item.type == 10 || item.type == 11) ? (
                                                        <div
                                                            className='assetDetail assetLabel ellipsisText'
                                                            onClick={(event) => {
                                                                event.stopPropagation()
                                                            }}
                                                        >
                                                            <Popover
                                                                trigger='click'
                                                                content={this.renderTooltip(item.columnTip, { color: '#2D3033', display: 'block', maxWidth: 420 })}
                                                                title='字段信息'
                                                            >
                                                                {item.columnInfoList && (
                                                                    <span className='LineClamp1'>
                                                                        <label>字段信息（{item.columnInfoList.length}）：</label>
                                                                        {item.columnInfoList.map((field, index) => {
                                                                            return (
                                                                                <span className='relateMetrics'>
                                                                                    {field.columnStatus == 2 ? (
                                                                                        <Tooltip title='已引用标准字段'>
                                                                                            <img style={{ width: '16px', marginRight: '4px' }} src={require('app_images/standard_icon.png')} />
                                                                                        </Tooltip>
                                                                                    ) : null}
                                                                                    <span style={{ cursor: 'pointer' }} dangerouslySetInnerHTML={{ __html: field.name }} />
                                                                                </span>
                                                                            )
                                                                        })}
                                                                    </span>
                                                                )}
                                                            </Popover>
                                                        </div>
                                                    ) : null}
                                                    {item.modelInfoList.length && (item.type == 10 || item.type == 11) ? (
                                                        <div className='assetDetail assetLabel' onClick={(event) => event.stopPropagation()}>
                                                            <TextMore>
                                                                <label>模型信息（{item.modelInfoList.length}）：</label>
                                                                {item.modelInfoList &&
                                                                    item.modelInfoList.map((field, index) => {
                                                                        return (
                                                                            <span className='relateMetrics'>
                                                                                {field.type == 0 ? (
                                                                                    <Tooltip title='主表'>
                                                                                        <HddOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
                                                                                    </Tooltip>
                                                                                ) : null}
                                                                                {field.type == 1 ? (
                                                                                    <Tooltip title='关联表'>
                                                                                        <ForkOutlined style={{ fontSize: '16px', color: '#1890ff' }} />
                                                                                    </Tooltip>
                                                                                ) : null}
                                                                                <span dangerouslySetInnerHTML={{ __html: field.name }} />
                                                                            </span>
                                                                        )
                                                                    })}
                                                            </TextMore>
                                                        </div>
                                                    ) : null}
                                                    {item.relateMetricsList.length && item.type !== 10 ? (
                                                        <div className='assetDetail assetLabel' style={{ whiteSpace: 'normal', marginBottom: 8 }}>
                                                            <label>关联指标（{item.relateMetricsList.length}）：</label>
                                                            <span className='relateMetricsSpan'>
                                                                {item.relateMetricsList &&
                                                                    item.relateMetricsList.map((field, index) => {
                                                                        return (
                                                                            <span
                                                                                className={index > 1 ? '' : 'relateMetrics'}
                                                                                style={{ display: index > 2 ? 'none' : 'inline-block' }}
                                                                                onClick={(event) => {
                                                                                    event.stopPropagation()
                                                                                    this.getAssetDetail(item, '1')
                                                                                }}
                                                                            >
                                                                                <span dangerouslySetInnerHTML={{ __html: field.name }} />
                                                                            </span>
                                                                        )
                                                                    })}
                                                            </span>
                                                            {item.type == 10 || item.type == 11 ? null : (
                                                                <CaretRightFilled onClick={this.getAssetDetail.bind(this, item, '1')} style={{ cursor: 'pointer', color: '#4D73FF', marginLeft: 8 }} />
                                                            )}
                                                            {item.relateMetricsList.length > 3 && item.type == 11 ? <span>...</span> : null}
                                                        </div>
                                                    ) : null}
                                                    {item.relateFactAssets.length && item.type == 10 ? (
                                                        <div className='assetDetail assetLabel' style={{ whiteSpace: 'normal', marginBottom: 8 }}>
                                                            <label>关联事实（{item.relateFactAssets.length}）：</label>
                                                            {item.relateFactAssets &&
                                                                item.relateFactAssets.map((field, index) => {
                                                                    return (
                                                                        <span className={index > 1 ? '' : 'relateMetrics'} style={{ display: index > 2 ? 'none' : 'inline-block' }}>
                                                                            <span style={{ cursor: 'default' }} dangerouslySetInnerHTML={{ __html: field.name }} />
                                                                        </span>
                                                                    )
                                                                })}
                                                            {item.relateFactAssets.length > 3 ? <span>...</span> : null}
                                                        </div>
                                                    ) : null}
                                                    {item.relateBizLimitList.length && (item.type == 10 || item.type == 11) ? (
                                                        <div className='assetDetail assetLabel' style={{ whiteSpace: 'normal' }}>
                                                            <label>业务限定（{item.relateBizLimitList.length}）：</label>
                                                            {item.relateBizLimitList &&
                                                                item.relateBizLimitList.map((field, index) => {
                                                                    return (
                                                                        <span className={index > 1 ? '' : 'relateMetrics'} style={{ display: index > 2 ? 'none' : 'inline-block' }}>
                                                                            <span style={{ cursor: 'default' }} dangerouslySetInnerHTML={{ __html: field.name }} />
                                                                        </span>
                                                                    )
                                                                })}
                                                            {item.relateBizLimitList.length > 3 ? <span>...</span> : null}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            )
                                        })}
                                    </Spin>
                                </div>
                            ) : (
                                <EmptyIcon />
                            )}
                        </main>
                        {total ? (
                            <Pagination
                                style={{ marginTop: 16 }}
                                current={queryInfo.page}
                                pageSize={queryInfo.pageSize}
                                total={total}
                                showSizeChanger
                                showQuickJumper
                                showTotal={this.showTotal}
                                onChange={this.changePage}
                                onShowSizeChange={this.onShowSizeChange}
                            />
                        ) : null}
                    </div>
                </div>
                <IndexmaDrawer
                    ref={(dom) => {
                        this.indexmaDrawer = dom
                    }}
                    detailInfo={detailInfo}
                />
            </div>
        )
    }
}
