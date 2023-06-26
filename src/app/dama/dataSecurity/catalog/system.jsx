import { Button, Input, Select, Tooltip, message, Divider, Tabs, Alert, Cascader } from 'antd';
import React, { Component } from 'react'
import EmptyLabel from '@/component/EmptyLabel'
import TextMore from '@/component/textmore/TextMore'
import RichTableLayout from '@/component/layout/RichTableLayout'
import ModuleTitle from '@/component/module/ModuleTitle'
import IconFont from '@/component/IconFont'
import Module from '@/component/Module'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import './index.less'
import CatalogEdit from './catalogEdit'
import BizSearchDrawer from './searchDrawer'
import { catalogNondwTable,
    catalogNondwTableFilter,
    catalogNondwBizTree,
    sysLevelConfig,
    catalogDwTable,
    catalogDwTableFilter,
    catalogDwTree,
    dwAnalysisThemeTree
} from 'app_api/dataSecurity'

const { TabPane } = Tabs

export default class CatalogSystem extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                keyword: '',
            },
            isDataWarehouse: false,
            classifyIds: [],
            systemId: '',
            bizTree: [],
            businessDeptFilters: [],
            businessManagerFilters: [],
            databaseFilters: [],
            technicalDeptFilters: [],
            technicalManagerFilters: [],
            tabValue: 'ods',
            showMoreSearch: false,
            errorMsg: '',
            showEmptyIcon: true,
            warningInfos: [],
            hasDwSetting: false,
            bizModuleTree: [],
            alysisThemeList: [],
        }
        this.selectedRows = []
        this.columns = [
            {
                title: '表英文名',
                dataIndex: 'tableEname',
                key: 'tableEname',
                width: 240,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text + '/' + record.databaseEname}>
                            <div className='tableLabel'>
                                <a onClick={this.openTablePage.bind(this, record)}><span className=' tableIcon iconfont icon-biaodanzujian-biaoge'></span>{text}</a>
                                <br/>
                                <div><span className='tableIcon iconfont icon-ku'></span>/{record.databaseEname}</div>
                            </div>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '表中文名',
                dataIndex: 'tableCname',
                key: 'tableCname',
                width: 200,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '业务分类',
                dataIndex: 'classifyPath',
                key: 'classifyPath',
                width: 200,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '数据分类',
                dataIndex: 'dataClassifyPath',
                key: 'dataClassifyPath',
                width: 200,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '状态',
                dataIndex: 'catalog',
                key: 'catalog',
                width: 100,
                render: (text) => {
                    return text ? <StatusLabel type='success' message='已编目' /> : <StatusLabel type='minus' message='未编目' />
                },
            },
            {
                title: '业务负责人',
                dataIndex: 'businessManagerName',
                key: 'businessManagerName',
                width: 120,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={record.businessDepartName + ' ' + text}>
                            <div className='LineClamp'>{record.businessDepartName}</div>
                            <div className='LineClamp'>{text}</div>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '技术负责人',
                dataIndex: 'technicalManagerName',
                key: 'technicalManagerName',
                width: 120,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={record.technicalDepartName + ' ' + text}>
                            <div className='LineClamp'>{record.technicalDepartName}</div>
                            <div className='LineClamp'>{text}</div>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
        this.wareColumns = [
            {
                title: '表英文名',
                dataIndex: 'tableEname',
                key: 'tableEname',
                width: 240,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text + '/' + record.databaseEname}>
                            <div className='tableLabel'>
                                <a onClick={this.openTablePage.bind(this, record)}><span className=' tableIcon iconfont icon-biaodanzujian-biaoge'></span>{text}</a>
                                <br/>
                                <div><span className=' tableIcon iconfont icon-ku'></span>/{record.databaseEname}</div>
                            </div>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '表中文名',
                dataIndex: 'tableCname',
                key: 'tableCname',
                width: 200,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '业务板块',
                dataIndex: 'classifyPath',
                key: 'classifyPath',
                width: 200,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '主题域',
                dataIndex: 'dataClassifyPath',
                key: 'dataClassifyPath',
                width: 200,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '状态',
                dataIndex: 'catalog',
                key: 'catalog',
                width: 100,
                render: (text) => {
                    return text ? <StatusLabel type='success' message='已编目' /> : <StatusLabel type='minus' message='未编目' />
                },
            },
            {
                title: '业务负责人',
                dataIndex: 'businessManagerName',
                key: 'businessManagerName',
                width: 120,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={record.businessDepartName + ' ' + text}>
                            <div className='LineClamp'>{record.businessDepartName}</div>
                            <div className='LineClamp'>{text}</div>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '技术负责人',
                dataIndex: 'technicalManagerName',
                key: 'technicalManagerName',
                width: 120,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={record.technicalDepartName + ' ' + text}>
                            <div className='LineClamp'>{record.technicalDepartName}</div>
                            <div className='LineClamp'>{text}</div>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
        this.applyColumns = [
            {
                title: '表英文名',
                dataIndex: 'tableEname',
                key: 'tableEname',
                width: 240,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text + '/' + record.databaseEname}>
                            <div className='tableLabel'>
                                <a onClick={this.openTablePage.bind(this, record)}><span className=' tableIcon iconfont icon-biao1'></span>{text}</a>
                                <br/>
                                <div><span className=' tableIcon iconfont icon-ku'></span>/{record.databaseEname}</div>
                            </div>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '表中文名',
                dataIndex: 'tableCname',
                key: 'tableCname',
                width: 200,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '分析主题',
                dataIndex: 'classifyPath',
                key: 'classifyPath',
                width: 200,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '状态',
                dataIndex: 'catalog',
                key: 'catalog',
                width: 100,
                render: (text) => {
                    return text ? <StatusLabel type='success' message='已编目' /> : <StatusLabel type='minus' message='未编目' />
                },
            },
            {
                title: '业务负责人',
                dataIndex: 'businessManagerName',
                key: 'businessManagerName',
                width: 120,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={record.businessDepartName + ' ' + text}>
                            <div className='LineClamp'>{record.businessDepartName}</div>
                            <div className='LineClamp'>{text}</div>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '技术负责人',
                dataIndex: 'technicalManagerName',
                key: 'technicalManagerName',
                width: 120,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={record.technicalDepartName + ' ' + text}>
                            <div className='LineClamp'>{record.technicalDepartName}</div>
                            <div className='LineClamp'>{text}</div>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
    }
    openTablePage = (data) => {
        this.props.addTab('sysDetail', { id: data.tableId }, true)
    }
    getSystemId = async (systemId, isDataWarehouse) => {
        let { queryInfo } = this.state
        queryInfo = {
            keyword: '',
        }
        await this.setState({
            systemId,
            queryInfo,
            classifyIds: [],
            isDataWarehouse,
            showEmptyIcon: false,
            tabValue: 'ods'
        })
        if (isDataWarehouse) {
            this.getSysLevelConfig()
        }
        this.getCatalogNondwTableFilter()
        this.getCatalogNondwBizTree()
    }
    getSysLevelConfig = async () => {
        let { errorMsg } = this.state
        let res = await sysLevelConfig({systemId: this.state.systemId})
        if (res.code == 200) {
            errorMsg = (res.data.warningInfos || []).join('，')
            this.setState({
                hasDwSetting: res.data.hasDwSetting,
                warningInfos: res.data.warningInfos,
                errorMsg
            })
        }
    }
    getCatalogNondwBizTree = async () => {
        let { tabValue } = this.state
        if (tabValue == 'ods') {
            let res = await catalogNondwBizTree({systemId: this.state.systemId})
            if (res.code == 200) {
                this.setState({
                    bizTree: this.deleteSubList(res.data)
                })
            }
        } else if (tabValue == 'dw') {
            let res = await catalogDwTree({systemId: this.state.systemId})
            if (res.code == 200) {
                this.setState({
                    bizModuleTree: this.deleteSubList(res.data)
                })
            }
        } else if (tabValue == 'app') {
            let res = await dwAnalysisThemeTree({systemId: this.state.systemId})
            if (res.code == 200) {
                this.setState({
                    alysisThemeList: res.data
                })
            }
        }
    }
    deleteSubList = (data) => {
        data.map((item) => {
            if (!item.children.length) {
                delete item.children
            } else {
                this.deleteSubList(item.children)
            }
        })
        return data
    }
    getCatalogNondwTableFilter = async () => {
        let { tabValue, isDataWarehouse } = this.state
        let res = {}
        if (isDataWarehouse) {
            res = await catalogDwTableFilter({systemId: this.state.systemId, dwLevel: tabValue})
        } else {
            res = await catalogNondwTableFilter({systemId: this.state.systemId})
        }
        if (res.code == 200) {
            this.setState({
                businessDeptFilters: res.data.businessDeptFilters,
                businessManagerFilters: res.data.businessManagerFilters,
                databaseFilters: res.data.databaseFilters,
                technicalDeptFilters: res.data.technicalDeptFilters,
                technicalManagerFilters: res.data.technicalManagerFilters,
            })
        }
    }
    changeKeyword = (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        this.setState({
            queryInfo
        })
    }
    changeStatus = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo
        })
        this.search()
    }
    changeClassify = async (value) => {
        console.log(value)
        let { queryInfo } = this.state
        queryInfo.classifyId = value[value.length - 1]
        await this.setState({
            queryInfo,
            classifyIds: value
        })
        this.search()
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            keyword: '',
        }
        await this.setState({
            queryInfo,
            classifyIds: []
        })
        this.search()
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    reload = () => {
        this.selectedRows = []
        this.selectController.updateSelectedKeys([])
        this.search()
        this.getCatalogNondwTableFilter()
        this.getCatalogNondwBizTree()
    }
    getTableList = async (params = {}) => {
        console.log(params)
        let { queryInfo, systemId, tabValue, isDataWarehouse } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            systemId,
            dwLevel: isDataWarehouse ? tabValue : undefined
        }
        let res = {}
        if (isDataWarehouse) {
            res = await catalogDwTable(query)
        } else {
            res = await catalogNondwTable(query)
        }
        if (res.code == 200) {
            this.setState({
                // showEmptyIcon: res.total ? false : this.state.showEmptyIcon
            })
            return {
                total: res.total,
                dataSource: res.data,
            }
        }
        return {
            total: 0,
            dataSource: [],
        }
    }
    openCatalogModal = (data, type) => {
        this.catalogEdit&&this.catalogEdit.openModal(data, type, this.state.systemId, this.state.isDataWarehouse, this.state.tabValue)
    }
    openSuperiorSearch = () => {
        this.bizSearchDrawer&&this.bizSearchDrawer.openModal(this.state.systemId, this.state.isDataWarehouse, this.state.tabValue)
    }
    changeTab = async (e) => {
        await this.setState({
            tabValue: e
        })
        this.selectedRows = []
        this.selectController.updateSelectedKeys([])
        this.reset()
        this.getCatalogNondwTableFilter()
        this.getCatalogNondwBizTree()
    }
    toggle = () => {
        this.setState({
            showMoreSearch: !this.state.showMoreSearch
        })
    }
    clearSelectRow = () => {
        this.setState({
            systemId: ''
        })
    }
    changePage = (name) => {
        this.props.addTab(name)
    }
    render() {
        const {
            queryInfo,
            tabValue,
            showMoreSearch,
            systemId,
            errorMsg,
            showEmptyIcon,
            businessDeptFilters,
            businessManagerFilters,
            databaseFilters,
            technicalDeptFilters,
            technicalManagerFilters,
            bizTree,
            classifyIds,
            isDataWarehouse,
            hasDwSetting,
            warningInfos,
            bizModuleTree,
            alysisThemeList
        } = this.state
        let dataLevel = false
        let dataMap = false
        if ((warningInfos || '').includes('数仓分层 待完善')) {
            dataLevel = true
        }
        if ((warningInfos || '').includes('数仓映射 待完善')) {
            dataMap = true
        }
        return (
            <div className='catalogSystem'>
                {
                    showEmptyIcon && isDataWarehouse ?
                        <div className='emptyIcon'>
                            <IconFont type='icon-kongzhuangtai'/>
                            { dataLevel&&!dataMap ? <div>暂无数据，缺少数仓分层 <a onClick={this.changePage.bind(this, '数仓分层')}> 立即配置</a></div> : null}
                            { dataMap&&!dataLevel ? <div>暂无数据，缺少数仓映射 <a onClick={this.changePage.bind(this, '数仓分层管理')}> 立即配置</a></div> : null}
                            { dataMap&&dataLevel ? <div>暂无数据，缺少数仓分层 <a onClick={this.changePage.bind(this, '数仓层级')}> 立即配置</a>；缺少数仓映射 <a onClick={this.changePage.bind(this, '数仓分层管理')}> 立即配置</a></div> : null}
                        </div>
                        :
                        <div>
                            {
                                systemId ?
                                    <RichTableLayout
                                        disabledDefaultFooter
                                        renderDetail={() => {
                                            return (
                                                <Module title='数据表'>
                                                    {
                                                        isDataWarehouse ? <div>
                                                            {
                                                                hasDwSetting&&errorMsg ? <Alert showIcon closable className='ErrorMsg'
                                                                                                      message={<div><span style={{color: '#FF9800'}}>温馨提示：</span>{errorMsg}
                                                                                                      </div>} type='warning'/> : null
                                                            }
                                                            <Tabs activeKey={tabValue} tabPosition='top' onChange={this.changeTab}>
                                                                <TabPane tab='贴源层' key='ods'>
                                                                    <div></div>
                                                                </TabPane>
                                                                <TabPane tab='数据仓库层' key='dw'>
                                                                    <div></div>
                                                                </TabPane>
                                                                <TabPane tab='应用层' key='app'>
                                                                    <div></div>
                                                                </TabPane>
                                                            </Tabs>
                                                        </div> : null
                                                    }
                                                </Module>
                                            )
                                        }}
                                        editColumnProps={{
                                            width: 80,
                                            createEditColumnElements: (_, record) => {
                                                return [
                                                    <a
                                                        onClick={this.openCatalogModal.bind(
                                                            this,
                                                            [record],
                                                            'single'
                                                        )}
                                                        key='detail'
                                                    >
                                                        {record.catalog ? '修改' : '编目'}
                                                    </a>
                                                ]
                                            },
                                        }}
                                        tableProps={{
                                            columns: tabValue == 'ods' ? this.columns : (tabValue == 'dw' ? this.wareColumns : this.applyColumns),
                                            key: 'tableId',
                                            selectedEnable: true,
                                            extraTableProps: {
                                                scroll: {
                                                    x: 1200,
                                                },
                                                key: tabValue,
                                            },
                                        }}
                                        renderSearch={(controller) => {
                                            this.controller = controller
                                            return (
                                                <React.Fragment>
                                                    <TextMore maxLine={1.6}>
                                                        <div className='searchGroup'>
                                                            <Input.Search
                                                                value={queryInfo.keyword}
                                                                onChange={this.changeKeyword}
                                                                onSearch={this.search}
                                                                placeholder='请输入表名'
                                                                suffix={<span>
                                        <span onClick={this.openSuperiorSearch} className="superiorSearch" >高级搜索</span>
                                        <Divider style={{ margin: '0 8px' }} type='vertical' />
                                    </span>}
                                                            />
                                                            <Select
                                                                allowClear
                                                                showSearch
                                                                optionFilterProp='title'
                                                                onChange={this.changeStatus.bind(
                                                                    this,
                                                                    'databaseId'
                                                                )}
                                                                value={queryInfo.databaseId}
                                                                placeholder='数据库'
                                                                getPopupContainer={triggerNode => triggerNode.parentNode}
                                                            >
                                                                {(databaseFilters || []).map((item) => {
                                                                    return (
                                                                        <Select.Option title={item.name} key={item.id} value={item.id}>
                                                                            {item.name}
                                                                        </Select.Option>
                                                                    )
                                                                })}
                                                            </Select>
                                                            {
                                                                tabValue == 'ods' ?
                                                                    <Cascader
                                                                        allowClear
                                                                        style={{ width: 160 }}
                                                                        fieldNames={{ label: 'name', value: 'id' }}
                                                                        options={bizTree}
                                                                        value={classifyIds}
                                                                        displayRender={(e) => e.join('-')}
                                                                        onChange={this.changeClassify}
                                                                        popupClassName='searchCascader'
                                                                        placeholder='业务／数据分类'
                                                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                                                    />
                                                                    : null
                                                            }
                                                            {
                                                                tabValue == 'dw' ?
                                                                    <Cascader
                                                                        allowClear
                                                                        style={{ width: 160 }}
                                                                        fieldNames={{ label: 'name', value: 'id' }}
                                                                        options={bizModuleTree}
                                                                        value={classifyIds}
                                                                        displayRender={(e) => e.join('-')}
                                                                        onChange={this.changeClassify}
                                                                        popupClassName='searchCascader'
                                                                        placeholder='业务板块／主题域'
                                                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                                                    />
                                                                    : null
                                                            }
                                                            {
                                                                tabValue == 'app' ?
                                                                    <Select
                                                                        allowClear
                                                                        onChange={this.changeStatus.bind(
                                                                            this,
                                                                            'classifyId'
                                                                        )}
                                                                        value={queryInfo.classifyId}
                                                                        placeholder='分析主题'
                                                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                                                    >
                                                                        {alysisThemeList.map((item) => {
                                                                            return (
                                                                                <Select.Option title={item.name} key={item.id} value={item.id}>
                                                                                    {item.name}
                                                                                </Select.Option>
                                                                            )
                                                                        })}
                                                                    </Select>
                                                                    : null
                                                            }
                                                            <Select
                                                                allowClear
                                                                onChange={this.changeStatus.bind(
                                                                    this,
                                                                    'catalog'
                                                                )}
                                                                value={queryInfo.catalog}
                                                                placeholder='状态'
                                                                getPopupContainer={triggerNode => triggerNode.parentNode}
                                                            >
                                                                <Select.Option key={1} value={true}>已编目</Select.Option>
                                                                <Select.Option key={2} value={false}>未编目</Select.Option>
                                                            </Select>
                                                            {/*<div className='secondSearchGroup' style={{ marginTop: 8 }}></div>*/}
                                                            <Select
                                                                allowClear
                                                                onChange={this.changeStatus.bind(
                                                                    this,
                                                                    'businessDepartId'
                                                                )}
                                                                value={queryInfo.businessDepartId}
                                                                placeholder='业务归属部门'
                                                                getPopupContainer={triggerNode => triggerNode.parentNode}
                                                            >
                                                                {businessDeptFilters.map((item) => {
                                                                    return (
                                                                        <Select.Option title={item.name} key={item.id} value={item.id}>
                                                                            {item.name}
                                                                        </Select.Option>
                                                                    )
                                                                })}
                                                            </Select>
                                                            <Select
                                                                allowClear
                                                                onChange={this.changeStatus.bind(
                                                                    this,
                                                                    'businessManagerId'
                                                                )}
                                                                value={queryInfo.businessManagerId}
                                                                placeholder='业务负责人'
                                                                getPopupContainer={triggerNode => triggerNode.parentNode}
                                                            >
                                                                {businessManagerFilters.map((item) => {
                                                                    return (
                                                                        <Select.Option title={item.name} key={item.id} value={item.id}>
                                                                            {item.name}
                                                                        </Select.Option>
                                                                    )
                                                                })}
                                                            </Select>
                                                            <Select
                                                                allowClear
                                                                onChange={this.changeStatus.bind(
                                                                    this,
                                                                    'technicalDepartId'
                                                                )}
                                                                value={queryInfo.technicalDepartId}
                                                                placeholder='技术归属部门'
                                                                getPopupContainer={triggerNode => triggerNode.parentNode}
                                                            >
                                                                {technicalDeptFilters.map((item) => {
                                                                    return (
                                                                        <Select.Option title={item.name} key={item.id} value={item.id}>
                                                                            {item.name}
                                                                        </Select.Option>
                                                                    )
                                                                })}
                                                            </Select>
                                                            <Select
                                                                allowClear
                                                                onChange={this.changeStatus.bind(
                                                                    this,
                                                                    'technicalManagerId'
                                                                )}
                                                                value={queryInfo.technicalManagerId}
                                                                placeholder='技术负责人'
                                                                getPopupContainer={triggerNode => triggerNode.parentNode}
                                                            >
                                                                {technicalManagerFilters.map((item) => {
                                                                    return (
                                                                        <Select.Option title={item.name} key={item.id} value={item.id}>
                                                                            {item.name}
                                                                        </Select.Option>
                                                                    )
                                                                })}
                                                            </Select>
                                                            <Button onClick={this.reset}>重置</Button>
                                                        </div>
                                                    </TextMore>
                                                    {/*{*/}
                                                        {/*showMoreSearch ? <a onClick={this.toggle}>收起<span style={{ marginLeft: 8 }} className='iconfont icon-shang'></span></a>*/}
                                                            {/*: <a onClick={this.toggle}>更多<span style={{ marginLeft: 8 }} className='iconfont icon-xiangxia'></span></a>*/}
                                                    {/*}*/}
                                                </React.Fragment>
                                            )
                                        }}
                                        requestListFunction={(page, pageSize, filter, sorter) => {
                                            return this.getTableList({
                                                pagination: {
                                                    page,
                                                    page_size: pageSize,
                                                }
                                            })
                                        }}
                                        renderFooter={(controller, defaultRender) => {
                                            let { selectedRows, selectedKeys } = controller
                                            this.selectController = controller
                                            //当前选择行和之前的合并
                                            this.selectedRows = this.selectedRows.concat(selectedRows)
                                            let obj = new Set(selectedKeys)
                                            //在这里去重
                                            var result = []
                                            for (var i = 0; i < this.selectedRows.length; i++) {
                                                //rowKey表格行 key 的取值（唯一,每行不同）
                                                if (obj.has(this.selectedRows[i].tableId)) {
                                                    result.push(this.selectedRows[i]);
                                                    obj.delete(this.selectedRows[i].tableId);
                                                }
                                            }
                                            //根据selectedRowseKeys去选出对应的selectedRows
                                            let rows = []
                                            result.map(v => {
                                                selectedKeys.map(m => {
                                                    if (m && m == v.tableId) {
                                                        rows.push(v)
                                                    }
                                                })
                                            })
                                            this.selectedRows = rows
                                            return (
                                                <div>
                                                    <Button style={{ marginRight: 16 }} type='primary' ghost onClick={this.openCatalogModal.bind(this, rows, 'batch')}>
                                                        编目配置
                                                    </Button>
                                                    {defaultRender()}
                                                </div>
                                            )
                                        }}
                                    />
                                    : null
                            }
                        </div>
                }
                <CatalogEdit search={this.reload} ref={(dom) => this.catalogEdit = dom} />
                <BizSearchDrawer reload={this.reload} {...this.props} ref={(dom) => this.bizSearchDrawer = dom}/>
            </div>
        )
    }
}