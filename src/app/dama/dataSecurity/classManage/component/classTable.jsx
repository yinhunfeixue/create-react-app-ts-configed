import React, { Component } from 'react'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { Popover, Input, Modal, Switch, Radio, Tooltip, Select, Button, Tag, message, Divider } from 'antd'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import EmptyLabel from '@/component/EmptyLabel'
import RenderUtil from '@/utils/RenderUtil'
import {
    datasecurityLevelSearch,
    datasecurityLevelSearchFilter,
    desensitizerule,
    saveTableBatchConfigForLevel,
    levelSearchConfirm,
    saveColumnBatchConfig,
    saveColumnTagBatch,
    dataSecurityLevelList,
    desensitiseTag,
    levelDatasourceFilter,
    levelDatabaseFilter,
    levelTableFilter,
    securityLevelFilter,
    desensitizeTagFilter,
} from 'app_api/dataSecurity'
import { sensitiveTagRule } from 'app_api/dataModeling'
import '../index.less'
import Cache from 'app_utils/cache'

export default class ClassTable extends React.Component {
    constructor() {
        super()
        this.state = {
            selectedTagCategory: {},
            tabValue: '1',
            tableData: [],
            loading: false,
            queryInfo: {
                confirm: false,
                filterNodes: [],
            },
            filterInfo: {},
            levelList: [],
            editInfo: {
                isSensitive: false,
            },
            databaseFilters: [],
            datasourceFilters: [],
            desensitizeRuleFilters: [],
            securityLevelFilters: [],
            tableFilters: [],
            levelOriginList: [
                { id: 0, name: '继承表' },
                { id: 1, name: '人工指定' },
                { id: 2, name: '敏感标签' },
            ],
            dataMaskList: [],
            tagList: [],
        }
        this.selectedRows = []
        this.columns = [
            {
                dataIndex: 'ename',
                key: 'ename',
                title: '表英文名',
                width: 220,
                fixed: 'left',
                render: (text, record) => (
                    <Tooltip
                        placement='topLeft'
                        title={
                            <span>
                                <span dangerouslySetInnerHTML={{ __html: text }}></span>
                                <br />
                                {record.path}
                            </span>
                        }
                    >
                        <div className='tableLabel' style={{ maxWidth: 200 }}>
                            <span>
                                {record.hasDesensitizeRules ? <p>敏</p> : null}
                                <span className=' tableIcon iconfont icon-biaodanzujian-biaoge'></span>
                                <span dangerouslySetInnerHTML={{ __html: text }}></span>
                            </span>
                            <div>
                                <span className=' tableIcon iconfont icon-ku'></span>
                                {record.path}
                            </div>
                        </div>
                    </Tooltip>
                ),
            },
            {
                dataIndex: 'cname',
                key: 'cname',
                title: '表中文名',
                width: 200,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={<span dangerouslySetInnerHTML={{ __html: text }}></span>}>
                            <span dangerouslySetInnerHTML={{ __html: text }}></span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'classifyPath',
                key: 'classifyPath',
                title: '分类',
                width: 220,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'confirm',
                key: 'confirm',
                title: '状态',
                width: 100,
                render: (text) => (text ? <StatusLabel type='success' message='已确认' /> : <StatusLabel type='minus' message='未确认' />),
            },
            {
                dataIndex: 'securityLevel',
                key: 'securityLevel',
                title: '安全等级',
                width: 100,
                render: (text, record) =>
                    text ? <Tag color={text == 1 ? 'blue' : text == 2 ? 'geekblue' : text == 3 ? 'purple' : text == 4 ? 'orange' : 'red'}>{record.securityLevelName}</Tag> : <EmptyLabel />,
            },
            {
                dataIndex: 'x',
                key: 'x',
                title: '操作',
                fixed: 'right',
                width: 120,
                render: (text, record, index) => {
                    if (!record.confirm) {
                        // 未确认
                        return (
                            <span>
                                <a onClick={this.openDetailPage.bind(this, record)}>详情</a>
                                <Divider style={{ margin: '0 8px' }} type='vertical' />
                                <a onClick={this.batchConfirm.bind(this, [record])}>确认</a>
                            </span>
                        )
                    } else {
                        return (
                            <span>
                                <a onClick={this.openDetailPage.bind(this, record)}>详情</a>
                                <Divider style={{ margin: '0 8px' }} type='vertical' />
                                <a onClick={this.openConfigPage.bind(this, record)}>安全</a>
                            </span>
                        )
                    }
                },
            },
        ]
        this.fieldColumns = [
            {
                dataIndex: 'ename',
                key: 'ename',
                title: '字段英文名',
                width: 220,
                fixed: 'left',
                render: (text, record) => (
                    <Tooltip
                        placement='topLeft'
                        title={
                            <span>
                                <span dangerouslySetInnerHTML={{ __html: text }}></span>
                                <br />
                                {record.parentEname}
                            </span>
                        }
                    >
                        <div className='tableLabel' style={{ maxWidth: 200 }}>
                            <span>
                                <span className=' tableIcon iconfont icon-ziduan1'></span>
                                <span dangerouslySetInnerHTML={{ __html: text }}></span>
                            </span>
                            <div>
                                <span className=' tableIcon iconfont icon-biaodanzujian-biaoge'></span>
                                {record.parentEname}
                            </div>
                        </div>
                    </Tooltip>
                ),
            },
            {
                dataIndex: 'cname',
                key: 'cname',
                title: '字段中文名',
                width: 200,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={<span dangerouslySetInnerHTML={{ __html: text }}></span>}>
                            <span dangerouslySetInnerHTML={{ __html: text }}></span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'path',
                key: 'path',
                title: '路径',
                width: 130,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'securityLevel',
                key: 'securityLevel',
                title: '安全等级',
                width: 100,
                render: (text, record) =>
                    text ? <Tag color={text == 1 ? 'blue' : text == 2 ? 'geekblue' : text == 3 ? 'purple' : text == 4 ? 'orange' : 'red'}>{record.securityLevelName}</Tag> : <EmptyLabel />,
            },
            {
                dataIndex: 'desensitizeTag',
                key: 'desensitizeTag',
                title: '敏感标签',
                width: 100,
                render: (text, record) => (
                    <span>
                        {record.desensitizeTag ? (
                            <Tooltip placement='topLeft' title={record.desensitizeTag.name}>
                                <span>{record.desensitizeTag.name}</span>
                            </Tooltip>
                        ) : (
                            <EmptyLabel />
                        )}
                    </span>
                ),
            },
            {
                dataIndex: 'classifyPath',
                key: 'classifyPath',
                title: '分类信息',
                width: 200,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'x',
                key: 'x',
                title: '操作',
                fixed: 'right',
                width: 156,
                render: (text, record, index) => {
                    if (!record.confirm) {
                        // 未确认
                        return (
                            <span>
                                <Tooltip title='无法配置字段安全等级，该字段所属表的安全等级还未确认'>
                                    <span>
                                        <a disabled>分级</a>
                                    </span>
                                </Tooltip>
                                <Divider style={{ margin: '0 8px' }} type='vertical' />
                                <Popover visible={record.tagVisible} content={this.renderColumnSensitive(record, index)} title='敏感配置' placement='leftBottom'>
                                    <a onClick={this.changeLevelVisible.bind(this, index, 'tagVisible', true)}>敏感</a>
                                </Popover>
                            </span>
                        )
                    } else {
                        return (
                            <span>
                                <a onClick={this.openDetailPage.bind(this, record)}>详情</a>
                                <Divider style={{ margin: '0 8px' }} type='vertical' />
                                <Popover visible={record.levelVisible} placement='leftBottom' content={this.renderColumnLevel(record, index)} title='分级配置'>
                                    <a onClick={this.changeLevelVisible.bind(this, index, 'levelVisible', true)}>分级</a>
                                </Popover>
                                <Divider style={{ margin: '0 8px' }} type='vertical' />
                                <Popover visible={record.tagVisible} placement='leftBottom' content={this.renderColumnSensitive(record, index)} title='敏感配置'>
                                    <a onClick={this.changeLevelVisible.bind(this, index, 'tagVisible', true)}>敏感</a>
                                </Popover>
                            </span>
                        )
                    }
                },
            },
        ]
    }

    componentDidMount = () => {
        this.getDatasource()
        this.getFilters()
        this.getDataSecurityLevelList()
        this.getTagList()
    }
    getDatasource = async () => {
        let { queryInfo, tabValue } = this.state
        let query = {
            // confirm: queryInfo.confirm,
            domain: tabValue == 1 ? ['TABLE'] : ['COLUMN'],
        }
        let res = await levelDatasourceFilter(query)
        if (res.code == 200) {
            this.setState({
                datasourceFilters: res.data,
            })
        }
    }
    getDatabase = async () => {
        let { queryInfo, tabValue, filterInfo } = this.state
        if (!filterInfo.datasourceId) {
            return
        }
        let query = {
            // confirm: queryInfo.confirm,
            domain: tabValue == 1 ? 'TABLE' : 'COLUMN',
            datasourceId: filterInfo.datasourceId,
        }
        let res = await levelDatabaseFilter(query)
        if (res.code == 200) {
            this.setState({
                databaseFilters: res.data,
            })
        }
    }
    getTable = async () => {
        let { queryInfo, tabValue, filterInfo } = this.state
        if (!filterInfo.databaseId) {
            return
        }
        let query = {
            // confirm: queryInfo.confirm,
            domain: tabValue == 1 ? 'TABLE' : 'COLUMN',
            datasourceId: filterInfo.datasourceId,
            databaseId: filterInfo.databaseId,
        }
        let res = await levelTableFilter(query)
        if (res.code == 200) {
            this.setState({
                tableFilters: res.data,
            })
        }
    }
    getFilters = async () => {
        let { queryInfo, tabValue } = this.state
        let query = {
            // confirm: queryInfo.confirm,
            domain: tabValue == 1 ? ['TABLE'] : ['COLUMN'],
        }
        let res = await securityLevelFilter(query)
        if (res.code == 200) {
            this.setState({
                securityLevelFilters: res.data,
            })
        }
        let res1 = await desensitizeTagFilter(query)
        if (res1.code == 200) {
            this.setState({
                desensitizeRuleFilters: res1.data,
            })
        }
    }
    getTagList = async () => {
        let res = await desensitiseTag({ needAll: true })
        if (res.code == 200) {
            this.setState({
                tagList: res.data,
            })
        }
    }
    getSensitiveTagRule = async () => {
        if (this.state.editInfo.tagId == undefined) {
            return
        }
        let res = await sensitiveTagRule({ id: this.state.editInfo.tagId })
        if (res.code == 200) {
            this.setState({
                dataMaskList: res.data,
            })
        }
    }
    getTreeInfo = async (selectedTagCategory) => {
        await this.setState({
            selectedTagCategory,
        })
        this.search()
    }
    getKeyword = async (value) => {
        let { queryInfo } = this.state
        queryInfo.keyword = value
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    getTabValue = async (value) => {
        await this.setState({
            tabValue: value,
            selectedTagCategory: {},
        })
        Cache.set('selectedTagCategory', {})
        this.getFilters()
        this.reset()
        this.selectController.updateSelectedKeys([])
    }
    batchConfirm = (data) => {
        let { queryInfo } = this.state
        let that = this
        console.log(data, 'batchConfirm')
        Modal.confirm({
            title: '对已选择表进行确认操作吗？',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                levelSearchConfirm(data).then((res) => {
                    if (res.code == 200) {
                        message.success('操作成功')
                        that.search()
                        that.selectController.updateSelectedKeys([])
                        that.props.getTreeQuery({ filterNodes: queryInfo.filterNodes, confirm: queryInfo.confirm })
                    }
                })
            },
        })
    }
    changeStatus = async (name, e, node) => {
        let { filterInfo } = this.state
        filterInfo[name] = e
        filterInfo[name + 'Info'] = e ? node.props.dataRef : undefined
        if (name == 'datasourceId') {
            filterInfo.databaseId = undefined
            filterInfo.tableId = undefined
            filterInfo.databaseIdInfo = undefined
            filterInfo.tableIdInfo = undefined
            this.setState({
                databaseFilters: [],
                tableFilters: [],
            })
        }
        if (name == 'databaseId') {
            filterInfo.tableId = undefined
            filterInfo.tableIdInfo = undefined
            this.setState({
                tableFilters: [],
            })
        }
        await this.setState({
            filterInfo,
        })
        await this.getFilterNodes()
        this.search()
        if (name == 'datasourceId') {
            this.getDatabase()
        }
        if (name == 'databaseId') {
            this.getTable()
        }
    }
    getFilterNodes = async () => {
        let { filterInfo, queryInfo } = this.state
        queryInfo.filterNodes = []
        for (let k in filterInfo) {
            if (filterInfo[k + 'Info']) {
                queryInfo.filterNodes.push(filterInfo[k + 'Info'])
            }
        }
        console.log(queryInfo.filterNodes, 'queryInfo.filterNodes')
        await this.setState({
            queryInfo,
        })
        this.props.getTreeQuery({ filterNodes: queryInfo.filterNodes, confirm: queryInfo.confirm })
    }
    reset = async () => {
        let { filterInfo, queryInfo } = this.state
        filterInfo = {}
        queryInfo = {
            confirm: false,
            filterNodes: [],
            treeFilters: [],
        }
        await this.setState({
            filterInfo,
            queryInfo,
            databaseFilters: [],
            tableFilters: [],
        })
        this.props.getTreeQuery({ filterNodes: [], confirm: queryInfo.confirm })
        this.search()
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
        this.selectController.updateSelectedKeys([])
    }
    getTableList = async (params = {}) => {
        let { queryInfo, tabValue, selectedTagCategory } = this.state
        queryInfo.treeFilters = selectedTagCategory.id ? [selectedTagCategory] : []
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 10,
            ...queryInfo,
            domain: tabValue == 1 ? ['TABLE'] : ['COLUMN'],
        }
        let res = await datasecurityLevelSearch(query)
        if (res.code == 200) {
            res.data.map((item) => {
                item.levelVisible = false
                item.tagVisible = false
            })
            this.setState({
                tableData: res.data,
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
    toggleStatus = async (e) => {
        let { queryInfo } = this.state
        queryInfo.confirm = e.target.value
        await this.setState({
            queryInfo,
        })
        this.props.getTreeQuery({ filterNodes: queryInfo.filterNodes, confirm: queryInfo.confirm })
        this.search()
    }
    openDetailPage = (data) => {
        let { tabValue } = this.state
        let query = {
            ...data,
            tabValue,
        }
        if (tabValue == '2') {
            query.id = data.tableId
        }
        this.props.addTab('安全管理-详情', { ...query })
    }
    openConfigPage = (data) => {
        let query = {
            id: data.id,
            tabValue: this.state.tabValue,
        }
        this.props.addTab('安全配置', query)
    }
    openBatchConfigPage = (data, pageType) => {
        let query = {
            tableIdList: data,
            pageType,
            tabValue: this.state.tabValue,
        }
        this.props.addTab('批量安全配置', query)
    }
    changeTableSelect = async (name, e, node) => {
        let { editInfo } = this.state
        if (name == 'level') {
            if (editInfo.levelOrigin == 2) {
                if (parseInt(e) < parseInt(editInfo.tagLevel)) {
                    message.info('字段安全等级不能小于敏感数据建议安全等级')
                    return
                }
            } else {
                if (parseInt(e) < parseInt(editInfo.parentSecurityLevel)) {
                    message.info('字段安全等级不能小于表安全等级')
                    return
                }
            }
        }
        editInfo[name] = e
        if (name == 'tagId') {
            editInfo.sensitivityLevelName = node.props.title
            editInfo.ruleId = node.props.ruleId
            editInfo.ruleDefaultName = node.props.ruleName
            editInfo.tagName = node.props.children
            await this.setState({
                editInfo,
            })
            this.getSensitiveTagRule()
        }
        if (name == 'isSensitive' && !e) {
            editInfo.tagId = undefined
            editInfo.ruleId = undefined
        }
        this.setState({
            editInfo,
        })
    }
    saveConfigLevel = async (index) => {
        let { tableData, editInfo } = this.state
        let query = {
            level: editInfo.level,
            levelOrigin: editInfo.levelOrigin,
            columnIdList: [editInfo.id],
        }
        this.setState({ loading: true })
        let res = await saveColumnBatchConfig(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
            tableData[index].levelVisible = false
            await this.setState({
                tableData,
            })
            this.search()
            this.getFilters()
        }
    }
    saveConfigTag = async (index) => {
        let { tableData, editInfo } = this.state
        let query = [
            {
                ...editInfo,
                columnId: editInfo.id,
            },
        ]
        this.setState({ loading: true })
        let res = await saveColumnTagBatch(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
            tableData[index].tagVisible = false
            await this.setState({
                tableData,
            })
            this.search()
            this.getFilters()
        }
    }
    changeLevelVisible = async (index, name, e) => {
        let { tableData, editInfo } = this.state
        console.log(index, e, 'changeLevelVisible')
        tableData.map((item) => {
            item.levelVisible = false
            item.tagVisible = false
        })
        tableData[index][name] = e
        if (e) {
            editInfo = {}
            for (let k in tableData[index]) {
                editInfo[k] = tableData[index][k]
            }
            if (tableData[index].desensitizeTag) {
                editInfo.isSensitive = tableData[index].desensitizeTag.id ? true : false
                editInfo.tagId = tableData[index].desensitizeTag.id
                await this.setState({
                    editInfo,
                })
                this.getSensitiveTagRule()
            }
            if (tableData[index].desensitizeTagDefaultRule) {
                editInfo.ruleDefaultName = tableData[index].desensitizeTagDefaultRule.name
                editInfo.ruleId = tableData[index].desensitizeTagDefaultRule.id
            }
            if (tableData[index].desensitizeRules) {
                editInfo.ruleName = tableData[index].desensitizeRules.name
                editInfo.ruleId = tableData[index].desensitizeRules.id
            }
        }
        this.setState({
            tableData,
            editInfo,
        })
    }
    getDataSecurityLevelList = async () => {
        let res = await dataSecurityLevelList()
        if (res.code == 200) {
            this.setState({
                levelList: res.data,
            })
        }
    }
    renderColumnLevel = (data, index) => {
        let { levelList, editInfo, levelOriginList, loading } = this.state
        return (
            <div className='EditMiniForm Grid1' style={{ width: 320, columnGap: 8 }}>
                {RenderUtil.renderFormItems([
                    {
                        label: '安全等级',
                        content: (
                            <Select
                                style={{ width: '100%' }}
                                onChange={this.changeTableSelect.bind(this, 'level')}
                                value={editInfo.level}
                                placeholder='请选择'
                                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            >
                                {levelList.map((item) => {
                                    return (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    )
                                })}
                            </Select>
                        ),
                    },
                    {
                        label: '数据来源',
                        content: (
                            <Select
                                style={{ width: '100%' }}
                                onChange={this.changeTableSelect.bind(this, 'levelOrigin')}
                                value={editInfo.levelOrigin}
                                disabled={editInfo.levelOrigin == 2}
                                placeholder='请选择'
                                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            >
                                {levelOriginList.map((item) => {
                                    return (
                                        <Option disabled={item.id == 2} key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    )
                                })}
                            </Select>
                        ),
                    },
                ])}
                <div style={{ textAlign: 'right' }}>
                    <Button style={{ marginRight: 8 }} onClick={this.changeLevelVisible.bind(this, index, 'levelVisible', false)}>
                        取消
                    </Button>
                    <Button type='primary' disabled={!editInfo.level || editInfo.levelOrigin == undefined} loading={loading} onClick={this.saveConfigLevel.bind(this, index)}>
                        保存
                    </Button>
                </div>
            </div>
        )
    }
    renderColumnSensitive = (record, index) => {
        let { tagList, editInfo, dataMaskList, loading } = this.state
        return (
            <div className='EditMiniForm Grid1' style={{ width: 320, columnGap: 8 }}>
                {RenderUtil.renderFormItems([
                    {
                        label: '是否敏感标签',
                        content: <Switch onChange={this.changeTableSelect.bind(this, 'isSensitive')} checked={editInfo.isSensitive} />,
                    },
                    {
                        label: '敏感标签',
                        hide: !editInfo.isSensitive,
                        content: (
                            <div>
                                <Select
                                    style={{ width: '100%' }}
                                    onChange={this.changeTableSelect.bind(this, 'tagId')}
                                    value={editInfo.tagId}
                                    placeholder='请选择'
                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                >
                                    {tagList.map((item) => {
                                        return (
                                            <Select.Option ruleId={item.defaultRuleId} ruleName={item.defaultRuleName} title={item.sensitivityLevelName} key={item.id} value={item.id}>
                                                {item.name}
                                            </Select.Option>
                                        )
                                    })}
                                </Select>
                                {editInfo.tagId ? (
                                    <div style={{ marginTop: 8 }}>
                                        <span style={{ color: '#5E6266' }}>敏感等级：</span>
                                        {editInfo.sensitivityLevelName}
                                        <span style={{ color: '#5E6266', marginLeft: 24 }}>默认脱敏规则：</span>
                                        {editInfo.ruleDefaultName || '-'}
                                    </div>
                                ) : null}
                            </div>
                        ),
                    },
                    {
                        label: '脱敏规则',
                        hide: !editInfo.isSensitive,
                        content: (
                            <Select
                                style={{ width: '100%' }}
                                onChange={this.changeTableSelect.bind(this, 'ruleId')}
                                value={editInfo.ruleId}
                                placeholder='请选择'
                                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                            >
                                {dataMaskList.map((item) => {
                                    return (
                                        <Option key={item.id} value={item.id}>
                                            {item.name}
                                        </Option>
                                    )
                                })}
                            </Select>
                        ),
                    },
                ])}
                <div style={{ textAlign: 'right' }}>
                    <Button style={{ marginRight: 8 }} onClick={this.changeLevelVisible.bind(this, index, 'tagVisible', false)}>
                        取消
                    </Button>
                    <Button disabled={editInfo.isSensitive && !editInfo.tagId} loading={loading} onClick={this.saveConfigTag.bind(this, index)} type='primary'>
                        保存
                    </Button>
                </div>
            </div>
        )
    }
    render() {
        const { queryInfo, filterInfo, tabValue, tableData, selectedTagCategory, databaseFilters, datasourceFilters, desensitizeRuleFilters, securityLevelFilters, tableFilters } = this.state
        return (
            <div style={{ height: '100%' }}>
                <div className='treePath'>{selectedTagCategory.name || '全部数据'}</div>
                <RichTableLayout
                    enableDrag
                    renderDetail={() => {
                        return ''
                    }}
                    tableProps={{
                        columns: tabValue == 1 ? this.columns : this.fieldColumns,
                        key: 'id',
                        selectedEnable: true,
                        dataSource: tableData,
                    }}
                    disabledDefaultFooter
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
                            if (obj.has(this.selectedRows[i].id)) {
                                result.push(this.selectedRows[i])
                                obj.delete(this.selectedRows[i].id)
                            }
                        }
                        //根据selectedRowseKeys去选出对应的selectedRows
                        let rows = []
                        result.map((v) => {
                            selectedKeys.map((m) => {
                                if (m && m == v.id) {
                                    rows.push(v)
                                }
                            })
                        })
                        this.selectedRows = rows
                        return (
                            <React.Fragment>
                                {tabValue == '1' ? (
                                    <div>
                                        {!queryInfo.confirm ? (
                                            <Button ghost type='primary' onClick={this.batchConfirm.bind(this, rows)}>
                                                批量人工确认
                                            </Button>
                                        ) : (
                                            <Button ghost type='primary' onClick={this.openBatchConfigPage.bind(this, selectedKeys, 'level')}>
                                                分级配置
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <Button style={{ marginRight: 8 }} ghost type='primary' onClick={this.openBatchConfigPage.bind(this, selectedKeys, 'level')}>
                                            分级配置
                                        </Button>
                                        <Button ghost type='primary' onClick={this.openBatchConfigPage.bind(this, selectedKeys, 'tag')}>
                                            敏感配置
                                        </Button>
                                    </div>
                                )}
                                {defaultRender()}
                            </React.Fragment>
                        )
                    }}
                    editColumnProps={{
                        hidden: true,
                    }}
                    renderSearch={(controller) => {
                        this.controller = controller
                        return (
                            <React.Fragment>
                                <Select
                                    allowClear
                                    showSearch
                                    optionFilterProp='title'
                                    onChange={this.changeStatus.bind(this, 'datasourceId')}
                                    value={filterInfo['datasourceId']}
                                    placeholder='系统'
                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                >
                                    {datasourceFilters.map((item) => {
                                        return (
                                            <Option title={item.name} dataRef={item} key={item.id} value={item.id}>
                                                {item.name}
                                            </Option>
                                        )
                                    })}
                                </Select>
                                <Select
                                    allowClear
                                    showSearch
                                    optionFilterProp='title'
                                    onChange={this.changeStatus.bind(this, 'databaseId')}
                                    value={filterInfo['databaseId']}
                                    placeholder='数据库'
                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                >
                                    {databaseFilters.map((item) => {
                                        return (
                                            <Option title={item.name} dataRef={item} key={item.id} value={item.id}>
                                                {item.name}
                                            </Option>
                                        )
                                    })}
                                </Select>
                                {tabValue == 2 ? (
                                    <Select
                                        allowClear
                                        showSearch
                                        optionFilterProp='title'
                                        onChange={this.changeStatus.bind(this, 'tableId')}
                                        value={filterInfo['tableId']}
                                        placeholder='数据表'
                                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                    >
                                        {tableFilters.map((item) => {
                                            return (
                                                <Option title={item.name} dataRef={item} key={item.id} value={item.id}>
                                                    {item.name}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                ) : null}
                                <Select
                                    allowClear
                                    onChange={this.changeStatus.bind(this, 'securityLevelFilters')}
                                    value={filterInfo['securityLevelFilters']}
                                    placeholder='安全等级'
                                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                >
                                    {securityLevelFilters.map((item) => {
                                        return (
                                            <Option dataRef={item} key={item.id} value={item.id}>
                                                {item.name}
                                            </Option>
                                        )
                                    })}
                                </Select>
                                {tabValue == 2 ? (
                                    <Select
                                        allowClear
                                        showSearch
                                        optionFilterProp='title'
                                        onChange={this.changeStatus.bind(this, 'desensitizeRuleFilters')}
                                        value={filterInfo['desensitizeRuleFilters']}
                                        placeholder='敏感标签'
                                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                    >
                                        {desensitizeRuleFilters.map((item) => {
                                            return (
                                                <Option title={item.name} dataRef={item} key={item.id} value={item.id}>
                                                    {item.name}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                ) : null}
                                <Button onClick={this.reset}>重置</Button>
                                {tabValue == 1 ? (
                                    <Radio.Group value={queryInfo.confirm} buttonStyle='solid' onChange={this.toggleStatus}>
                                        <Tooltip title='人工未确认'>
                                            <Radio.Button value={false}>未确认</Radio.Button>
                                        </Tooltip>
                                        <Radio.Button value={true}>已确认</Radio.Button>
                                    </Radio.Group>
                                ) : null}
                            </React.Fragment>
                        )
                    }}
                    requestListFunction={(page, pageSize, filter, sorter) => {
                        return this.getTableList({
                            pagination: {
                                page,
                                page_size: pageSize,
                            },
                            sorter: sorter || {},
                        })
                    }}
                />
            </div>
        )
    }
}
