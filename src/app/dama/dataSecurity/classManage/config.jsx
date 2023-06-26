import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import EmptyIcon from '@/component/EmptyIcon'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import ModuleTitle from '@/component/module/ModuleTitle'
import RenderUtil from '@/utils/RenderUtil'
import ProjectUtil from '@/utils/ProjectUtil'
import { Button, Checkbox, Divider, Input, Select, Tabs, Tooltip, Table, message, Tag } from 'antd'
import { getExternalList, getTaskDetail } from 'app_api/metadataApi'
import { getDsTagInfoList, getTableInfoWithDs, getDsColumnLevelList, getDsColumnLevelListFilters, saveLevelAndTagInfo, dataSecurityLevelList, desensitiseTag } from 'app_api/dataSecurity'
import { sensitiveTagRule } from 'app_api/dataModeling'
import React, { Component } from 'react'
import './index.less'

const { TabPane } = Tabs

export default class ClassManageConfig extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                keyword: '',
                page: 1,
                pageSize: 10,
            },
            levelQuery: {
                keyword: '',
                page: 1,
                pageSize: 10,
            },
            taskDetail: {},
            tabValue: '1',
            levelList: [],
            desensitizeTagFilters: [],
            levelFilters: [],
            levelOriginFilters: [],
            levelTable: [],
            tagTable: [],
            tagList: [],
            levelOriginList: [
                { id: 0, name: '继承表' },
                { id: 1, name: '人工指定' },
                { id: 2, name: '敏感标签' },
            ],
            loading: false,
            levelSearchTable: [],
            tagSearchTable: [],
        }
        this.levelColumns = [
            {
                title: '字段英文名',
                dataIndex: 'physicalField',
                key: 'physicalField',
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
                title: '字段中文名',
                dataIndex: 'physicalFieldDesc',
                key: 'physicalFieldDesc',
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
                title: '安全等级',
                dataIndex: 'level',
                key: 'level',
                render: (text, record, index) => (
                    <Select style={{ width: '100%' }} onChange={this.changeTableSelect.bind(this, index, 'level', 'levelTable', 'levelSearchTable')} value={text} placeholder='请选择'>
                        {this.state.levelList.map((item) => {
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
                title: '等级来源',
                dataIndex: 'levelOrigin',
                key: 'levelOrigin',
                render: (text, record, index) => (
                    <Select
                        style={{ width: '100%' }}
                        disabled={text == 2}
                        onChange={this.changeTableSelect.bind(this, index, 'levelOrigin', 'levelTable', 'levelSearchTable')}
                        value={text}
                        placeholder='请选择'
                    >
                        {this.state.levelOriginList.map((item) => {
                            return (
                                <Option disabled={item.id == 2} key={item.id} value={item.id}>
                                    {item.name}
                                </Option>
                            )
                        })}
                    </Select>
                ),
            },
        ]
        this.columns = [
            {
                title: '字段英文名',
                dataIndex: 'physicalField',
                key: 'physicalField',
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
                title: '字段中文名',
                dataIndex: 'physicalFieldDesc',
                key: 'physicalFieldDesc',
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
                title: '敏感标签',
                dataIndex: 'tagId',
                key: 'tagId',
                render: (text, record, index) => (
                    <Select style={{ width: '100%' }} onChange={this.changeTableSelect.bind(this, index, 'tagId', 'tagTable', 'tagSearchTable')} value={text} placeholder='请选择'>
                        {this.state.tagList.map((item) => {
                            return (
                                <Select.Option ruleId={item.defaultRuleId} ruleName={item.defaultRuleName} title={item.sensitivityLevelName} key={item.id} value={item.id}>
                                    {item.name}
                                </Select.Option>
                            )
                        })}
                    </Select>
                ),
            },
            {
                title: '脱敏规则',
                dataIndex: 'ruleId',
                key: 'ruleId',
                render: (text, record, index) => (
                    <Select
                        style={{ width: '100%' }}
                        onChange={this.changeTableSelect.bind(this, index, 'ruleId', 'tagTable', 'tagSearchTable')}
                        value={text}
                        disabled={!record.tagId}
                        placeholder={record.tagId ? '请选择' : '请先选择敏感标签'}
                    >
                        {record.dataMaskList &&
                            record.dataMaskList.map((item) => {
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
                title: '敏感等级',
                dataIndex: 'sensitivityLevelName',
                key: 'sensitivityLevelName',
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
    componentWillMount = async () => {
        this.getTaskDetailData()
        // this.getFilters()
        this.getDataSecurityLevelList()
        this.getLevelTable()
        this.getTagTable()
        this.getTagList()
    }
    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }
    getTaskDetailData = async () => {
        let res = await getTableInfoWithDs({ tableId: this.pageParams.id })
        if (res.code == 200) {
            res.data.tableLevel = res.data.level
            this.setState({
                taskDetail: res.data,
            })
        }
    }
    getFilters = async () => {
        let res = await getDsColumnLevelListFilters({ tableId: this.pageParams.id })
        if (res.code == 200) {
            this.setState({
                desensitizeTagFilters: res.data.desensitizeTagFilters ? res.data.desensitizeTagFilters : [],
                levelFilters: res.data.levelFilters ? res.data.levelFilters : [],
                levelOriginFilters: res.data.levelOriginFilters,
            })
        }
    }
    getDataSecurityLevelList = async () => {
        let res = await dataSecurityLevelList()
        if (res.code == 200) {
            this.setState({
                levelList: res.data,
            })
        }
    }
    getLevelTable = async () => {
        let res = await getDsColumnLevelList({ tableId: this.pageParams.id })
        if (res.code == 200) {
            this.setState({
                levelTable: res.data,
                levelSearchTable: res.data,
            })
        }
    }
    getTagTable = async () => {
        let res = await getDsTagInfoList({ tableId: this.pageParams.id })
        if (res.code == 200) {
            for (let i = 0; i < res.data.length; i++) {
                if (res.data[i].tagId) {
                    await this.getSensitiveTagRule(res.data[i].tagId).then((data) => {
                        res.data[i].dataMaskList = data
                    })
                }
            }
            this.setState({
                tagTable: res.data,
                tagSearchTable: res.data,
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
    getSensitiveTagRule = async (id) => {
        let res = await sensitiveTagRule({ id })
        if (res.code == 200) {
            return res.data
        }
        return []
    }
    changeKeyword = async (name, e) => {
        let { tabValue } = this.state
        this.state[name].keyword = e.target.value
        await this.setState({
            [name]: this.state[name],
        })
        if (!e.target.value) {
            if (tabValue == '1') {
                this.search()
            } else {
                this.tagSearch()
            }
        }
    }
    changeStatus = async (objName, name, e) => {
        let { tabValue } = this.state
        this.state[objName][name] = e
        await this.setState({
            [objName]: this.state[objName],
        })
        if (tabValue == '1') {
            this.search()
        } else {
            this.tagSearch()
        }
    }
    reset = async () => {
        let { levelQuery } = this.state
        levelQuery = {
            keyword: '',
            page: 1,
            pageSize: 10,
        }
        await this.setState({
            levelQuery,
        })
        this.search()
    }
    tagReset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            keyword: '',
            page: 1,
            pageSize: 10,
        }
        await this.setState({
            queryInfo,
        })
        this.tagSearch()
    }
    changeLevelPage = async (param) => {
        let { levelQuery } = this.state
        levelQuery.page = param.current
        levelQuery.pageSize = param.pageSize
        this.setState({
            levelQuery,
        })
    }
    changeTagPage = async (param) => {
        let { queryInfo } = this.state
        queryInfo.page = param.current
        queryInfo.pageSize = param.pageSize
        this.setState({
            queryInfo,
        })
    }
    search = () => {
        let { levelQuery, levelTable } = this.state
        levelQuery.page = 1
        let array = []
        levelTable.map((item) => {
            if ((item.physicalField + item.physicalFieldDesc).includes(levelQuery.keyword)) {
                array.push(item)
            }
        })
        console.log(array, 'array+++++')
        let array1 = []
        if (levelQuery.level) {
            array.map((item) => {
                if (levelQuery.level == item.level) {
                    array1.push(item)
                }
            })
        } else {
            array1 = [...array]
        }
        console.log(array1, 'array1+++++')
        let array2 = []
        if (levelQuery.levelOrigin !== undefined) {
            array1.map((item) => {
                if (levelQuery.levelOrigin == item.levelOrigin) {
                    array2.push(item)
                }
            })
        } else {
            array2 = [...array1]
        }
        console.log(array2, 'array2+++++')
        this.setState({
            levelSearchTable: array2,
            levelQuery,
        })
    }
    tagSearch = () => {
        let { queryInfo, tagTable } = this.state
        queryInfo.page = 1
        let array = []
        tagTable.map((item) => {
            if ((item.physicalField + item.physicalFieldDesc).includes(queryInfo.keyword)) {
                array.push(item)
            }
        })
        console.log(array, 'array+++++')
        let array1 = []
        if (queryInfo.tagId) {
            array.map((item) => {
                if (queryInfo.tagId == item.tagId) {
                    array1.push(item)
                }
            })
        } else {
            array1 = [...array]
        }
        console.log(array1, 'array1+++++')
        this.setState({
            queryInfo,
            tagSearchTable: array1,
        })
    }
    changeTableSelect = async (i, name, tableName, searchTableName, e, node) => {
        let { taskDetail, levelQuery, queryInfo, tabValue } = this.state
        let index = 0
        if (tabValue == 1) {
            index = i + (levelQuery.page - 1) * levelQuery.pageSize
        } else {
            index = i + (queryInfo.page - 1) * queryInfo.pageSize
        }
        if (name == 'tagId') {
            this.state[searchTableName][index].sensitivityLevelName = node.props.title
            this.state[searchTableName][index].ruleId = node.props.ruleId
            await this.getSensitiveTagRule(e).then((data) => {
                this.state[searchTableName][index].dataMaskList = data
            })
        }
        if (name == 'level') {
            this.state[searchTableName][index].levelOrigin = this.state[searchTableName][index].levelOrigin == 0 ? 1 : this.state[searchTableName][index].levelOrigin
            if (this.state[searchTableName][index].levelOrigin == 2) {
                if (this.state[searchTableName][index].tagLevel) {
                    if (parseInt(e) < parseInt(this.state[searchTableName][index].tagLevel)) {
                        message.info('字段安全等级不能小于敏感数据建议安全等级')
                        return
                    }
                }
            } else {
                if (taskDetail.tableLevel) {
                    if (parseInt(e) < parseInt(taskDetail.tableLevel)) {
                        message.info('字段安全等级不能小于表安全等级')
                        return
                    }
                }
            }
        }
        this.state[searchTableName][index][name] = e
        let k = 0
        this.state[tableName].map((item) => {
            if (item.columnId == this.state[searchTableName][index].columnId) {
                item = { ...this.state[searchTableName][index] }
            }
        })
        this.setState({
            [searchTableName]: this.state[searchTableName],
            [tableName]: this.state[tableName],
        })
    }
    changeTableLevel = (e) => {
        let { taskDetail, levelTable, levelSearchTable } = this.state
        if (parseInt(e) < parseInt(taskDetail.datasourceLevel)) {
            message.info('表安全等级不能低于系统安全等级')
            return
        }
        if (taskDetail.suggestLevel) {
            if (parseInt(e) < parseInt(taskDetail.suggestLevel)) {
                message.info('表安全等级不能低于建议安全等级')
                return
            }
        }
        taskDetail.tableLevel = e
        levelTable.map((item) => {
            if (item.levelOrigin == 0) {
                item.level = taskDetail.tableLevel
            }
            if (item.level) {
                if (parseInt(item.level) < parseInt(e)) {
                    item.level = taskDetail.tableLevel
                }
            }
        })
        levelSearchTable.map((item) => {
            if (item.levelOrigin == 0) {
                item.level = taskDetail.tableLevel
            }
            if (item.level) {
                if (parseInt(item.level) < parseInt(e)) {
                    item.level = taskDetail.tableLevel
                }
            }
        })
        this.setState({
            taskDetail,
            levelTable,
            levelSearchTable,
        })
    }
    tabKeyChange = (e) => {
        this.setState({
            tabValue: e,
        })
    }
    renderTitle = (data) => {
        return (
            <div>
                {data.physicalTable + (data.tableName ? '（' + data.tableName + '）' : '')}
                {data.hasDesensitizeRules ? (
                    <Tooltip title='含敏感标签'>
                        <span className='sensitiveLabel'>敏</span>
                    </Tooltip>
                ) : null}
            </div>
        )
    }
    cancel = () => {
        this.props.addTab('数据分级管理')
    }
    postData = async () => {
        let { levelTable, tagTable, taskDetail } = this.state
        let query = {
            columnLevelInfos: levelTable,
            columnTagInfos: tagTable,
            tableId: taskDetail.tableId,
            datasourceLevel: taskDetail.datasourceLevel,
            datasourceLevelName: taskDetail.datasourceLevelName,
            suggestLevel: taskDetail.suggestLevel,
            suggestLevelName: taskDetail.suggestLevelName,
            tableLevel: taskDetail.tableLevel,
        }
        this.setState({ loading: true })
        let res = await saveLevelAndTagInfo(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('保存成功')
            this.cancel()
        }
    }
    render() {
        const { queryInfo, levelQuery, taskDetail, tabValue, levelList, levelTable, tagTable, tagList, loading, levelOriginList, levelSearchTable, tagSearchTable } = this.state
        let { physicalTable, physicalDatabase, firstClassPath, datasourceIdentifier, suggestLevelName, suggestLevel, datasourceLevelName, datasourceLevel } = taskDetail
        return (
            <React.Fragment>
                <div className='classManageDetail'>
                    <TableLayout
                        title={this.renderTitle(taskDetail)}
                        disabledDefaultFooter
                        showFooterControl
                        renderFooter={() => {
                            return (
                                <React.Fragment>
                                    <Button disabled={!taskDetail.tableLevel} loading={loading} type='primary' onClick={this.postData}>
                                        保存
                                    </Button>
                                    <Button onClick={this.cancel}>取消</Button>
                                </React.Fragment>
                            )
                        }}
                        renderDetail={() => {
                            return (
                                <React.Fragment>
                                    <Module title='基本信息'>
                                        <div className='MiniForm Grid4'>
                                            {RenderUtil.renderFormItems([
                                                {
                                                    label: '表英文名',
                                                    content: physicalTable,
                                                },
                                                {
                                                    label: '所属库',
                                                    content: physicalDatabase,
                                                },
                                                {
                                                    label: '所属系统',
                                                    content: datasourceIdentifier,
                                                },
                                                {
                                                    label: '系统等级',
                                                    content: datasourceLevelName ? (
                                                        <Tag
                                                            color={
                                                                datasourceLevel == 1
                                                                    ? 'blue'
                                                                    : datasourceLevel == 2
                                                                    ? 'geekblue'
                                                                    : datasourceLevel == 3
                                                                    ? 'purple'
                                                                    : datasourceLevel == 4
                                                                    ? 'orange'
                                                                    : 'red'
                                                            }
                                                        >
                                                            {datasourceLevelName}
                                                        </Tag>
                                                    ) : (
                                                        ''
                                                    ),
                                                },
                                                {
                                                    label: '建议安全等级',
                                                    content: suggestLevelName ? (
                                                        <Tag color={suggestLevel == 1 ? 'blue' : suggestLevel == 2 ? 'geekblue' : suggestLevel == 3 ? 'purple' : suggestLevel == 4 ? 'orange' : 'red'}>
                                                            {suggestLevelName}
                                                        </Tag>
                                                    ) : (
                                                        ''
                                                    ),
                                                },
                                                {
                                                    label: '分类',
                                                    content: firstClassPath,
                                                },
                                            ])}
                                        </div>
                                    </Module>
                                </React.Fragment>
                            )
                        }}
                    />
                    <div style={{ background: '#fff', marginTop: 16 }}>
                        <Tabs animated={false} onChange={this.tabKeyChange} activeKey={tabValue}>
                            <TabPane tab='安全等级' key='1'>
                                <TableLayout
                                    disabledDefaultFooter
                                    renderDetail={() => {
                                        return (
                                            <div style={{ paddingBottom: 30 }}>
                                                <ModuleTitle style={{ display: 'inline-block', marginBottom: 15 }} title='表安全等级：' />
                                                <Select allowClear onChange={this.changeTableLevel} value={taskDetail.tableLevel} placeholder='请选择' style={{ width: 372 }}>
                                                    {levelList.map((item) => {
                                                        return (
                                                            <Option key={item.id} value={item.id}>
                                                                {item.name}
                                                            </Option>
                                                        )
                                                    })}
                                                </Select>
                                                <Divider />
                                                <ModuleTitle style={{ display: 'inline-block', marginBottom: 15 }} title='字段安全等级' />
                                                <span style={{ color: '#949799' }}>（字段安全等级>=表安全等级）</span>
                                                <div style={{ marginBottom: 16 }}>
                                                    <Input.Search
                                                        allowClear
                                                        style={{ width: 280, marginRight: 8 }}
                                                        value={levelQuery.keyword}
                                                        onChange={this.changeKeyword.bind(this, 'levelQuery')}
                                                        onSearch={this.search}
                                                        placeholder='请输入字段名'
                                                    />
                                                    <Select
                                                        allowClear
                                                        onChange={this.changeStatus.bind(this, 'levelQuery', 'level')}
                                                        value={levelQuery.level}
                                                        placeholder='安全等级'
                                                        style={{ width: 160, marginRight: 8 }}
                                                    >
                                                        {levelList.map((item) => {
                                                            return (
                                                                <Option key={item.id} value={item.id}>
                                                                    {item.name}
                                                                </Option>
                                                            )
                                                        })}
                                                    </Select>
                                                    <Select
                                                        allowClear
                                                        onChange={this.changeStatus.bind(this, 'levelQuery', 'levelOrigin')}
                                                        value={levelQuery.levelOrigin}
                                                        placeholder='等级来源'
                                                        style={{ width: 160, marginRight: 8 }}
                                                    >
                                                        {levelOriginList.map((item) => {
                                                            return (
                                                                <Option key={item.id} value={item.id}>
                                                                    {item.name}
                                                                </Option>
                                                            )
                                                        })}
                                                    </Select>
                                                    <Button onClick={this.reset}>重置</Button>
                                                </div>
                                                <Table
                                                    columns={this.levelColumns}
                                                    dataSource={levelSearchTable}
                                                    rowKey='columnId'
                                                    onChange={this.changeLevelPage}
                                                    pagination={{
                                                        pageSize: levelQuery.pageSize,
                                                        total: levelSearchTable.length,
                                                        current: levelQuery.page,
                                                        showSizeChanger: true,
                                                        showQuickJumper: true,
                                                        showTotal: (total) => (
                                                            <span>
                                                                总数 <b>{ProjectUtil.formNumber(total)}</b> 条
                                                            </span>
                                                        ),
                                                    }}
                                                />
                                            </div>
                                        )
                                    }}
                                />
                            </TabPane>
                            <TabPane tab='敏感数据' key='2'>
                                <TableLayout
                                    disabledDefaultFooter
                                    renderDetail={() => {
                                        return (
                                            <div style={{ paddingBottom: 30 }}>
                                                <div style={{ marginBottom: 16 }}>
                                                    <Input.Search
                                                        allowClear
                                                        style={{ width: 280, marginRight: 8 }}
                                                        value={queryInfo.keyword}
                                                        onChange={this.changeKeyword.bind(this, 'queryInfo')}
                                                        onSearch={this.tagSearch}
                                                        placeholder='请输入字段名'
                                                    />
                                                    <Select
                                                        allowClear
                                                        onChange={this.changeStatus.bind(this, 'queryInfo', 'tagId')}
                                                        value={queryInfo.tagId}
                                                        placeholder='敏感标签'
                                                        style={{ width: 160, marginRight: 8 }}
                                                    >
                                                        {tagList.map((item) => {
                                                            return (
                                                                <Select.Option
                                                                    ruleId={item.defaultRuleId}
                                                                    ruleName={item.defaultRuleName}
                                                                    title={item.sensitivityLevelName}
                                                                    key={item.id}
                                                                    value={item.id}
                                                                >
                                                                    {item.name}
                                                                </Select.Option>
                                                            )
                                                        })}
                                                    </Select>
                                                    <Button onClick={this.tagReset}>重置</Button>
                                                </div>
                                                <Table
                                                    columns={this.columns}
                                                    dataSource={tagSearchTable}
                                                    rowKey='columnId'
                                                    onChange={this.changeTagPage}
                                                    pagination={{
                                                        pageSize: queryInfo.pageSize,
                                                        total: tagSearchTable.length,
                                                        current: queryInfo.page,
                                                        showSizeChanger: true,
                                                        showQuickJumper: true,
                                                        showTotal: (total) => (
                                                            <span>
                                                                总数 <b>{ProjectUtil.formNumber(total)}</b> 条
                                                            </span>
                                                        ),
                                                    }}
                                                />
                                            </div>
                                        )
                                    }}
                                />
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
