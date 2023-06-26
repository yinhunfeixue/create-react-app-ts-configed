import { CloseOutlined, DownOutlined, InboxOutlined, LeftOutlined, UpOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Input, Radio, Row, Spin, Tooltip } from 'antd';
import dataBaseSvg from 'app_images/dataMap/dataBase.svg'
import dataFieldSvg from 'app_images/dataMap/field.svg'
import homeSvg from 'app_images/dataMap/home.svg'
import reportSvg from 'app_images/dataMap/report.svg'
import dataTableSvg from 'app_images/dataMap/table.svg'
import indexSvg from 'app_images/dataMap/指标.svg'
import emptySvg from 'app_images/dataMap/空.svg'
import React, { Component } from 'react'
import _ from 'underscore'
import SearchTableAutoComplete from '../metadata/searchTableAutoComplete'
import './index.less'
import FieldRelationChart from './relation'
import RelationChart from './relationChart'
const { Search } = Input

// import LinkAnalysisService from 'app_page/services/metaData/linkAnalysisService'

export default class LinkAnalysis extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showErrorPic: false,
            errorTip: '暂无数据',
            indexmaNodeData: {},
            loading: true,
            hiddenTempTable: false,
            nodeData: {},
            optionsList: [],
            selectValue: '',
            selectedId: this.props.selectedId || null,
            searchTableValue: this.props.searchTableValue || '',
            selectedIds: [],
            helpDisplay: false,
            helpHistoryDisplay: true,
            helpDrillDisplay: true,
            drillList: [],
            drillNode: {},
            drillParam: {},
            drillType: 'table', // table 单选， column 多选
            component: null,
            drillTypeVisible: 'table',
            graphTitle: '全量数据地图',
            pageCurrent: 1,
            historyList: [
                // {
                //     name: '全量数据地图',
                //     req: {
                //         type: '',
                //         param: {}
                //     }
                // }
            ],
        }

        this.subScopeType = {
            database: 'table',
            table: 'column',
            report_cate: 'report',
            report: 'report_field',
        }

        this.typeConfig = {
            select: {
                color: '#F26D6D',
                visible: false,
            },
            report: {
                color: '#F2B06D',
                visible: false,
            },
            physical: {
                color: '#8CBF73',
                visible: true,
            },
        }
    }

    componentDidMount = async () => {
        this.init()
    }

    init = async () => {
        console.log(this.props.location.state, '---------componentDidMount-------------')
        let params = {}
        let selectedId = this.state.selectedId
        if (selectedId) {
            params = {
                selectedId,
                // tableId: selectedId,
                ids: [selectedId],
            }
        }
        let dataType = ''
        if (this.props.location.state && this.props.location.state.graphTitle) {
            params = { ...params, ...this.props.location.state.params }
            dataType = this.props.location.state.dataType
            await this.setState({
                graphTitle: this.props.location.state.graphTitle || '',
            })
            this.handleSaveHistoryList({
                name: this.props.location.state.graphTitle,
                // ...node.data,
                domain: dataType,
                req: {
                    type: dataType,
                    param: params,
                },
            })
        } else {
            if (this.props.graphTitle) {
                await this.setState({
                    graphTitle: this.props.graphTitle || '',
                })
            }

            this.handleSaveHistoryList({
                name: this.props.graphTitle || '全量数据地图',
                domain: this.props.dataType || 'home',
                contextPath: this.props.contextPath || '',
                req: {
                    type: '',
                    param: params,
                },
            })
        }
        this.getChartData(params, dataType)
    }

    // 页面全链图数据获取
    getChartData = async (params = {}, dataType = '') => {
        await this.setState({
            loading: true,
            drillTypeVisible: dataType,
            selectedId: params.selectedId,
            selectedIds: params.ids,
            nodeData: {},
            showErrorPic: false,
        })
        if (this.props.location.state && this.props.location.state.apiParam) {
            params = {
                ...params,
                ...this.props.location.state.apiParam,
            }
        }
        console.log(Date.now())
        let res = await this.props.linkAnalysisService.getGrapDataList(dataType, params)
        console.log(Date.now())
        if (res.code === 200) {
            if (this.props.from == 'dataAsset') {
                res.data.nodes &&
                    res.data.nodes.map((item) => {
                        item.contextPath = item.name
                    })
            }
            let nodeData = res.data

            this.setState(
                {
                    nodeData,
                },
                () => {
                    this.chart.bindNodeData(nodeData)
                }
            )
        } else {
            this.setState({
                showErrorPic: true,
                errorTip: res.msg,
            })
        }
        this.setState({
            loading: false,
        })
    }

    // 中心点切换
    handleNodeClick = async (e, node) => {
        await this.setState({
            // selectedId: node.key,
            pageCurrent: 1,
            searchTableValue: node.data.label || '',
            drillNode: {},
            drillList: [],
            graphTitle: node.data.label,
        })

        console.log(node.data, '--------handleNodeClick--------')
        this.handleSaveHistoryList({
            name: node.data.label,
            ...node.data,
            req: {
                type: node.data.domain,
                param: {
                    selectedId: node.key,
                    ids: [node.key],
                },
            },
        })

        this.getChartData(
            {
                selectedId: node.key,
                ids: [node.key],
            },
            node.data.domain
        )
    }
    onMenuClick = () => {}

    changeCollapse = (key) => {}

    helpDisplayShow = () => {
        this.setState(
            {
                helpDisplay: !this.state.helpDisplay,
            },
            () => {
                this.chart.resize()
                // if (this.state.helpDisplay) {
                //     this.chart.resize()
                // }
            }
        )
    }

    helpHistoryDisplayShow = () => {
        this.setState({
            helpHistoryDisplay: !this.state.helpHistoryDisplay,
        })
    }

    helpDrillDisplayShow = () => {
        this.setState({
            helpDrillDisplay: !this.state.helpDrillDisplay,
        })
    }

    handleSaveHistoryList = (data) => {
        let historyList = this.state.historyList

        let currentKey = data.name + '_' + data.domain

        let exists = false
        // _.map(historyList, (h, k) => {

        // })

        for (let h of historyList) {
            let existStringKey = h.name + '_' + h.domain
            if (currentKey == existStringKey) {
                exists = true
                break
            }
        }

        if (!exists) {
            historyList.unshift({
                // searchTableValue: this.state.searchTableValue || '',
                ...data,
            })
            console.log(historyList, '-------historyList-----')
            this.setState({
                historyList,
            })
        }
    }

    // 节点单击事件，显示用于下钻的数据选项
    handleDrillNode = async (node) => {
        console.log(node, '=============handleDrillNodehandleDrillNode===============')
        this.setState(
            {
                drillNode: node,
                helpDisplay: true,
                pageCurrent: 1,
                // drillList: res.data,
                helpDrillDisplay: true,
            },
            () => {
                this.chart.resize()
            }
        )

        if (!this.subScopeType[node.domain]) {
            return
        }

        console.log(node, '-------handleDrillNode------')
        let param = {
            scope: this.subScopeType[node.domain],
            parentId: node.key,
            page: 1,
            page_size: 50,
        }

        if (this.props.location.state && this.props.location.state.apiParam) {
            param = {
                ...param,
                ...this.props.location.state.apiParam,
                page_size: 50,
            }
        }

        let res = await this.props.linkAnalysisService.getLineageBidirectionData(param)
        if (res.code == 200) {
            // this.handleSaveHistoryList(node)
            this.setState(
                {
                    drillParam: param,
                    helpDisplay: true,
                    drillList: res.data,
                    helpDrillDisplay: true,
                },
                () => {
                    this.chart.resize()
                }
            )
        }
    }

    getDrillListByPage = async (page) => {
        let drillParam = this.state.drillParam
        let param = {
            ...drillParam,
            page,
            page_size: 50,
        }

        if (this.props.location.state && this.props.location.state.apiParam) {
            param = {
                ...param,
                ...this.props.location.state.apiParam,
                page_size: 50,
            }
        }
        let res = await this.props.linkAnalysisService.getLineageBidirectionData(param)
        if (res.code == 200) {
            // this.handleSaveHistoryList(node)
            this.setState(
                {
                    // drillNode: node,
                    helpDisplay: true,
                    drillList: res.data,
                    helpDrillDisplay: true,
                },
                () => {
                    this.chart.resize()
                }
            )
        }
    }

    //  下钻选择 onChange 事件
    onDrillChange = (type, e) => {
        console.log(this.state.drillNode, type, e)

        let params = {}
        let historyListDrill = []
        if (type == 'table') {
            params = {
                ids: [e.target.value],
                selectedId: e.target.value,
                // limit: 50,
                _fids_: [e.target.value],
            }
            // historyListDrill.push(drillListObjKey[e.target.value])
        } else {
            params = {
                ids: e,
                selectedId: this.state.drillNode.key,
                // limit: 50,
                _fids_: e,
            }
        }

        this.setState({
            drillType: type,
            drillParam: params,
        })
    }

    // 下钻模块的搜索功能
    searchDrill = async (v) => {
        let node = this.state.drillNode
        if (!this.subScopeType[node.domain]) {
            return
        }

        let param = {
            scope: this.subScopeType[node.domain],
            parentId: node.key,
            keyword: v,
            page: 1,
            page_size: 50,
        }

        if (this.props.location.state && this.props.location.state.apiParam) {
            param = {
                ...param,
                ...this.props.location.state.apiParam,
                page_size: 50,
            }
        }

        let res = await this.props.linkAnalysisService.getLineageBidirectionData(param)
        if (res.code == 200) {
            this.setState({
                // drillNode: node,
                // helpDisplay: true,
                drillList: res.data,
                // helpDrillDisplay: true
            })
        }
    }

    // 下钻 全链分析按钮点击事件
    drillGraphAnalysis = () => {
        if (!_.isEmpty(this.state.drillParam)) {
            let drillList = this.state.drillList
            let drillListObjKey = {}
            let groupTitleList = []
            _.map(drillList, (n, k) => {
                drillListObjKey[n.id] = n
            })
            // console.log()

            let historyListDrill = []
            _.map(this.state.drillParam._fids_, (nd, ky) => {
                historyListDrill.push(drillListObjKey[nd])
                groupTitleList.push(drillListObjKey[nd]['enName'])
            })

            let groupTitleStr = groupTitleList.join(',')

            this.handleSaveHistoryList({
                name: groupTitleStr,
                ...this.state.drillNode,
                domain: this.subScopeType[this.state.drillNode.domain],
                selectedList: historyListDrill,
                req: {
                    type: this.state.drillType,
                    param: this.state.drillParam,
                },
            })

            this.setState(
                {
                    drillNode: {},
                    helpDisplay: false,
                    drillList: [],
                    graphTitle: groupTitleStr,
                    // helpDrillDisplay: true
                },
                async () => {
                    // this.chart.resize()
                    await this.getChartData(this.state.drillParam, this.state.drillType)
                    this.setState({
                        drillParam: {},
                        drillType: 'table',
                    })
                }
            )
        }
    }

    /**
     * 重现历史浏览
     * @param {*} data
     */
    historyReappeared = (data) => {
        let param = data.req.param || {}
        let type = data.req.type || ''
        let searchTableValue = ''
        let contextPath = data.contextPath || ''

        if (data.domain == 'table') {
            searchTableValue = data.name
        } else if (data.domain == 'column') {
            let contextPathArr = contextPath.split('/')
            if (contextPathArr.length > 0) {
                searchTableValue = contextPathArr[contextPathArr.length - 1]
            }
        }
        this.setState({
            graphTitle: data.name,
            searchTableValue: data.searchTableValue || '',
            searchTableValue,
        })
        console.log(data, '---------historyReappeared-----------')
        this.getChartData(param, type)
    }

    getIconByDomain = (data) => {
        let domain = data.domain
        let img = null
        switch (domain) {
            case 'database':
                img = <img src={dataBaseSvg} />
                break

            case 'table':
                img = <img src={dataTableSvg} />
                break

            case 'column':
                img = <img src={dataFieldSvg} />
                break

            case 'report':
                img = <img src={reportSvg} />
                break

            case 'report_field':
                img = <img src={indexSvg} />
                break

            case 'home':
                img = <img src={homeSvg} />
                break

            default:
                img = null
                break
        }
        return img
    }

    handleSearchSelect = (selectedId, selectValue, item) => {
        console.log(selectedId, selectValue, item, '--------selectedId, selectValue---------')
        this.setState(
            {
                selectedId,
                selectValue,
                searchTableValue: selectValue,
                graphTitle: selectValue,
            },
            () => {
                let params = {}
                if (selectedId) {
                    params = {
                        selectedId,
                        // tableId: selectedId,
                        ids: [selectedId],
                    }
                }

                this.handleSaveHistoryList({
                    name: selectValue,
                    domain: 'table',
                    contextPath: `${item.datasource}/${item.database}`,
                    req: {
                        type: 'table',
                        param: params,
                    },
                })

                this.getChartData(params, '')
            }
        )
    }

    onChangePage = (page) => {
        console.log(page)
        this.setState(
            {
                pageCurrent: page,
            },
            () => {
                this.getDrillListByPage(page)
            }
        )
    }
    getIndexmaNodeData = (data) => {
        this.setState({
            indexmaNodeData: data,
        })
    }
    getCheckRulesPage = (data) => {
        this.props.addTab('规则管理', { columnId: data.columnId })
    }
    createCheckRules = (data) => {
        this.props.addTab('addRulePage', { ...data, from: 'indexma' })
    }

    render() {
        const {
            loading,
            nodeData,
            optionsList,
            selectValue,
            selectedId,
            hiddenTempTable,
            helpDisplay,
            helpHistoryDisplay,
            helpDrillDisplay,
            drillNode,
            drillList,
            drillType,
            drillTypeVisible,
            historyList,
            graphTitle,
            selectedIds,
            searchTableValue,
            indexmaNodeData,
            showErrorPic,
            errorTip,
        } = this.state
        console.log(nodeData, '---nodeDatanodeDatanodeDatanodeData')
        return (
            <div className='diagramPage'>
                {/* <Row gutter={[8, 16]}>
                    <Col span='24' > */}
                {
                    <Spin tip='Loading...' spinning={loading}>
                        {showErrorPic ? (
                            <div style={{ textAlign: 'center', paddingTop: '144px' }}>
                                <img style={{ width: '300px' }} src={require('app_images/dataAssetEmpty.png')} />
                                <div style={{ textAlign: 'center', marginTop: '16px' }}>{errorTip ? errorTip : '暂无数据'}</div>
                            </div>
                        ) : (
                            <div className='dataChartMap'>
                                <div className='graphChart'>
                                    <div className='graphHeader' style={{ display: this.props.from == 'dataAsset' ? 'none' : 'block' }}>
                                        {this.props.from == 'indexma' ? null : (
                                            <div className='graphTitle'>
                                                {/* {graphTitle.length > 50 ? graphTitle.slice(0, 47) + '...' : graphTitle} */}
                                                <Tooltip placement='topLeft' title={graphTitle}>
                                                    {graphTitle}
                                                </Tooltip>
                                            </div>
                                        )}

                                        <div className='graphExpendIcon'>
                                            {this.props.searchTableAutoCompleteVisible ? (
                                                <span>
                                                    数据表：
                                                    <SearchTableAutoComplete searchTableValue={searchTableValue} style={{ width: '430px' }} handleSearchSelect={this.handleSearchSelect} />
                                                </span>
                                            ) : null}
                                            {helpDisplay ? null : (
                                                <span
                                                    style={{ cursor: 'pointer', width: '20px' }}
                                                    onClick={() => {
                                                        this.helpDisplayShow()
                                                    }}
                                                >
                                                    <LeftOutlined />
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className='graphBody'>
                                        {drillTypeVisible == 'column' ? (
                                            <FieldRelationChart
                                                ref={(dom) => {
                                                    this.chart = dom
                                                }}
                                                typeConfig={this.typeConfig}
                                                centerId={selectedId}
                                                selectedIds={selectedIds}
                                                drillNode={this.handleDrillNode}
                                                getIndexmaNodeData={this.getIndexmaNodeData}
                                                from={this.props.from}
                                            />
                                        ) : (
                                            <RelationChart
                                                ref={(dom) => {
                                                    this.chart = dom
                                                }}
                                                data={this.state.nodeData}
                                                nodeClick={this.handleNodeClick}
                                                selectedId={selectedId}
                                                drillNode={this.handleDrillNode}
                                                from={this.props.from}
                                            />
                                        )}
                                    </div>
                                </div>
                                {this.props.from == 'indexma' ? (
                                    <div className='helpBlock blockVer2' style={{ display: helpDisplay ? 'block' : 'none' }}>
                                        {indexmaNodeData.key ? (
                                            <div style={{ width: '100%', height: '100%' }}>
                                                <div>
                                                    数据源：
                                                    <Tooltip title={indexmaNodeData.datasourceName}>
                                                        <span style={{ width: '130px' }}>{indexmaNodeData.datasourceName}</span>
                                                    </Tooltip>
                                                    <div
                                                        className='helpCloseBtn'
                                                        onClick={() => {
                                                            this.helpDisplayShow()
                                                        }}
                                                    >
                                                        <CloseOutlined />
                                                    </div>
                                                </div>
                                                <div>
                                                    数据库：
                                                    <Tooltip title={indexmaNodeData.databaseName}>
                                                        <span>{indexmaNodeData.databaseName}</span>
                                                    </Tooltip>
                                                </div>
                                                <div>
                                                    数据表：
                                                    <Tooltip title={indexmaNodeData.tableName}>
                                                        <span>{indexmaNodeData.tableName}</span>
                                                    </Tooltip>
                                                </div>
                                                <div>
                                                    数据字段：
                                                    <Tooltip title={indexmaNodeData.columnName}>
                                                        <span>{indexmaNodeData.columnName}</span>
                                                    </Tooltip>
                                                </div>
                                                <div>指标绑定：{indexmaNodeData.metricsBind}</div>
                                                <div>指标依赖：{indexmaNodeData.metricsDepend}</div>
                                                <div>指标依赖源：{indexmaNodeData.metricsDependSource}</div>
                                                <div>
                                                    检核规则：
                                                    <span onClick={this.getCheckRulesPage.bind(this, indexmaNodeData)} style={{ color: '#1890ff', cursor: 'pointer', width: '70px' }}>
                                                        {indexmaNodeData.checkRules}
                                                    </span>{' '}
                                                    <div onClick={this.createCheckRules.bind(this, indexmaNodeData)} className='createBtn'>
                                                        创建规则
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div style={{ width: '100%', height: '100%' }}>
                                                <div
                                                    style={{ float: 'right' }}
                                                    className='helpCloseBtn'
                                                    onClick={() => {
                                                        this.helpDisplayShow()
                                                    }}
                                                >
                                                    <CloseOutlined />
                                                </div>
                                                <div style={{ transform: 'translate(0px, 100px)', textAlign: 'center' }}>
                                                    <InboxOutlined style={{ fontSize: '34px', color: '#f2f2f2' }} />
                                                    <div style={{ color: '#f2f2f2', fontSize: '8px', marginBottom: '16px' }}>暂无数据</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className='helpBlock' style={{ display: helpDisplay ? 'block' : 'none' }}>
                                        <div className='helpHeader'>
                                            <div className='helpTitle'>
                                                <span>辅助信息</span>
                                            </div>
                                            <div
                                                className='helpCloseBtn'
                                                onClick={() => {
                                                    this.helpDisplayShow()
                                                }}
                                            >
                                                <CloseOutlined />
                                            </div>
                                        </div>
                                        <div className='helpBody'>
                                            <div className='bodyItem'>
                                                <div className='itemHeader'>
                                                    <div className='itemTitle'>历史路径</div>
                                                    <div
                                                        className='itemExpendBtn'
                                                        onClick={() => {
                                                            this.helpHistoryDisplayShow()
                                                        }}
                                                    >
                                                        {helpHistoryDisplay ? <UpOutlined style={{ color: '#B3B3B3' }} /> : <DownOutlined style={{ color: '#B3B3B3' }} />}
                                                    </div>
                                                </div>
                                                <div className='itemContent' style={{ display: helpHistoryDisplay ? 'block' : 'none' }}>
                                                    <div>
                                                        {_.map(historyList, (h, k) => {
                                                            return (
                                                                <div
                                                                    className='contentHistoryPath'
                                                                    onClick={() => {
                                                                        this.historyReappeared(h)
                                                                    }}
                                                                >
                                                                    <div style={{ lineHeight: '12px' }}>
                                                                        {/* {
                                                                                     h.domain == 'database' ? <img src={dataBaseSvg} /> : h.domain == 'table' ? <img src={dataTableSvg} /> : h.domain == 'column' ? <img src={dataFieldSvg} /> : <img src={homeSvg} />
                                                                                     } */}
                                                                        {this.getIconByDomain(h)}
                                                                        {/* <span> */}
                                                                        <Tooltip placement='topLeft' title={h.name}>
                                                                            {h.name.length > 20 ? h.name.slice(0, 17) + '...' : h.name}
                                                                        </Tooltip>
                                                                        {/* </span> */}
                                                                    </div>
                                                                    {h.contextPath ? <div className='contentPathDesc'>{h.contextPath}</div> : null}
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='bodyItem'>
                                                <div className='itemHeader'>
                                                    <div className='itemTitle'>节点下钻</div>
                                                    <div
                                                        className='itemExpendBtn'
                                                        onClick={() => {
                                                            this.helpDrillDisplayShow()
                                                        }}
                                                    >
                                                        {helpDrillDisplay ? <UpOutlined style={{ color: '#B3B3B3' }} /> : <DownOutlined style={{ color: '#B3B3B3' }} />}
                                                    </div>
                                                </div>
                                                <div className='itemContent' style={{ display: helpDrillDisplay ? 'block' : 'none' }}>
                                                    {!_.isEmpty(drillNode) ? (
                                                        <div>
                                                            <div className='contentHeader'>
                                                                <div className='contentLabel'>
                                                                    {/* {
                                                                             drillNode.domain == 'database' ? <img src={dataBaseSvg} /> : drillNode.domain == 'table' ? <img src={dataTableSvg} /> : drillNode.domain == 'column' ? <img src={dataFieldSvg} /> : drillNode.domain == 'report' ? <img src={reportSvg} /> : null
                                                                             } */}
                                                                    {this.getIconByDomain(drillNode)}
                                                                    <span>
                                                                        <Tooltip placement='topLeft' title={drillNode.label}>
                                                                            {drillNode.label ? (drillNode.label.length > 20 ? drillNode.label.slice(0, 17) + '...' : drillNode.label) : null}
                                                                        </Tooltip>
                                                                    </span>
                                                                </div>
                                                                <div className='contentLabelDesc'>{drillNode.contextPath}</div>
                                                            </div>
                                                            {!_.isEmpty(drillNode) ? (
                                                                <div className='contentSearch'>
                                                                    <Search placeholder='请输入关键词按enter搜索' onSearch={(value) => this.searchDrill(value)} style={{ width: '100%' }} />
                                                                </div>
                                                            ) : null}
                                                            {drillList.length > 0 ? (
                                                                <div>
                                                                    <div className='contentList commonScroll' style={{ maxHeight: 'calc(100vh - 450px)' }}>
                                                                        {drillNode.domain == 'database' || drillNode.domain == 'report_cate' ? (
                                                                            <Radio.Group onChange={this.onDrillChange.bind(this, 'table')}>
                                                                                {_.map(drillList, (n, k) => {
                                                                                    return (
                                                                                        <Row>
                                                                                            <Col span='24'>
                                                                                                <Radio
                                                                                                    value={n.id}
                                                                                                    style={{
                                                                                                        fontSize: '12px',
                                                                                                        fontFamily: 'PingFangSC-Regular, PingFang SC',
                                                                                                        fontWeight: '400',
                                                                                                        color: '#333333',
                                                                                                    }}
                                                                                                >
                                                                                                    <Tooltip placement='topLeft' title={n.enName}>
                                                                                                        <span
                                                                                                            style={{
                                                                                                                display: 'inline-block',
                                                                                                                maxWidth: '120px',
                                                                                                                overflow: 'hidden',
                                                                                                                textOverflow: 'ellipsis',
                                                                                                                whiteSpace: 'nowrap',
                                                                                                            }}
                                                                                                        >
                                                                                                            {n.enName}
                                                                                                        </span>
                                                                                                    </Tooltip>
                                                                                                </Radio>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    )
                                                                                })}
                                                                            </Radio.Group>
                                                                        ) : (
                                                                            <Checkbox.Group
                                                                                // style={{ width: '100%' }}
                                                                                onChange={this.onDrillChange.bind(this, 'column')}
                                                                            >
                                                                                {_.map(drillList, (n, k) => {
                                                                                    return (
                                                                                        <Row>
                                                                                            <Col span='24'>
                                                                                                <Checkbox
                                                                                                    value={n.id}
                                                                                                    style={{
                                                                                                        fontSize: '12px',
                                                                                                        fontFamily: 'PingFangSC-Regular, PingFang SC',
                                                                                                        fontWeight: '400',
                                                                                                        color: '#333333',
                                                                                                    }}
                                                                                                >
                                                                                                    <Tooltip placement='topLeft' title={n.enName}>
                                                                                                        <span
                                                                                                            style={{
                                                                                                                display: 'inline-block',
                                                                                                                maxWidth: '120px',
                                                                                                                overflow: 'hidden',
                                                                                                                textOverflow: 'ellipsis',
                                                                                                                whiteSpace: 'nowrap',
                                                                                                            }}
                                                                                                        >
                                                                                                            {n.enName}
                                                                                                        </span>
                                                                                                        {/*{.length > 20 ? n.enName.slice(0, 17) + '...' : n.enName}*/}
                                                                                                    </Tooltip>
                                                                                                </Checkbox>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    )
                                                                                })}
                                                                            </Checkbox.Group>
                                                                        )}
                                                                    </div>
                                                                    {/* <div>
                                                                             <Pagination
                                                                             size="small"
                                                                             total={drillList.length}
                                                                             current={this.state.pageCurrent}
                                                                             onChange={this.onChangePage}
                                                                             />
                                                                             </div> */}
                                                                    <div>
                                                                        <Button onClick={this.drillGraphAnalysis}>全链分析</Button>
                                                                    </div>
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    ) : (
                                                        <div style={{ minHeight: '300px' }}>
                                                            <div className='promptInitTooltip'>
                                                                <img src={emptySvg} />
                                                                <span>请点击选择节点</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </Spin>
                }
                {/* </Col>
                </Row> */}
            </div>
        );
    }
}
