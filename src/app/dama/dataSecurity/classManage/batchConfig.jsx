import EmptyLabel from '@/component/EmptyLabel'
import { Button, Select, Tooltip, message, Table, Popover } from 'antd'
import React, { Component } from 'react'
import { ExclamationOutlined, InfoCircleOutlined } from '@ant-design/icons'
import TableLayout from '@/component/layout/TableLayout'
import RenderUtil from '@/utils/RenderUtil'
import ProjectUtil from '@/utils/ProjectUtil'
import ModuleTitle from '@/component/module/ModuleTitle'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import {
    saveTableBatchConfigForLevel,
    dataSecurityLevelList,
    previewColumnBatchConfig,
    previewTableBatchConfig,
    saveColumnBatchConfig,
    saveColumnTagBatch,
    previewColumnTagBatch,
    desensitiseTag,
} from 'app_api/dataSecurity'
import { sensitiveTagRule } from 'app_api/dataModeling'
import './index.less'

export default class BatchConfig extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryParam: {
                tableIdList: [],
            },
            levelCode: undefined,
            levelList: [],
            showTable: false,
            staticInfo: {
                levelChangeStatisticsData: {},
                levelStatisticsData: {},
                lowerThanTableNums: 0,
            },
            columnData: [{ safeSource: 2 }],
            previewLoading: false,
            loading: false,
            tagList: [],
            dataMaskList: [],
            hasFail: false,
        }
        this.tagColumns = [
            {
                dataIndex: 'physicalField',
                key: 'physicalField',
                title: '字段英文名',
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
                dataIndex: 'physicalFieldDesc',
                key: 'physicalFieldDesc',
                title: '字段中文名',
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
                dataIndex: 'physicalTable',
                key: 'physicalTable',
                title: '来源表',
                width: 120,
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
                dataIndex: 'datasourceIdentifier',
                key: 'datasourceIdentifier',
                title: '路径',
                width: 150,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={'/' + text + '/' + record.physicalDatabase}>
                            <span className='LineClamp'>
                                /{text}/{record.physicalDatabase}
                            </span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'ruleId',
                key: 'ruleId',
                title: '脱敏规则',
                render: (text, record, index) => (
                    <Select style={{ width: '100%' }} onChange={this.changeTableSelect.bind(this, index)} value={text} placeholder='请选择'>
                        {this.state.dataMaskList.map((item) => {
                            return (
                                <Option key={item.id} value={item.id}>
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
                dataIndex: 'physicalField',
                key: 'physicalField',
                title: '字段英文名',
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
                dataIndex: 'physicalFieldDesc',
                key: 'physicalFieldDesc',
                title: '字段中文名',
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
                dataIndex: 'physicalTable',
                key: 'physicalTable',
                title: '来源表',
                width: 120,
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
                dataIndex: 'datasourceIdentifier',
                key: 'datasourceIdentifier',
                title: '路径',
                width: 150,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={'/' + text + '/' + record.physicalDatabase}>
                            <span className='LineClamp'>
                                /{text}/{record.physicalDatabase}
                            </span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'tagName',
                key: 'tagName',
                title: '敏感标签',
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
                dataIndex: 'levelBeforeName',
                key: 'levelBeforeName',
                title: '安全等级（旧）',
                width: 130,
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
                dataIndex: 'levelAfterName',
                key: 'levelAfterName',
                title: '安全等级（新）',
                width: 130,
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
                dataIndex: 'alterType',
                key: 'alterType',
                title: '变更提示',
                width: 120,
                render: (text, record) =>
                    text == 2 || text == 3 ? (
                        <div>
                            {record.alterInfo ? (
                                <StatusLabel
                                    type={text == '2' ? 'warning' : 'error'}
                                    message={
                                        <Popover placement='topLeft' content={this.renderTooltip(record)} trigger='hover'>
                                            <span>{text == 2 ? '降低等级' : '失败'}</span>
                                        </Popover>
                                    }
                                />
                            ) : (
                                <StatusLabel type={text == '2' ? 'warning' : 'error'} message={text == 2 ? '降低等级' : '失败'} />
                            )}
                        </div>
                    ) : (
                        <span>{text == 0 ? '新增' : text == 1 ? '提升等级' : '不变'}</span>
                    ),
            },
        ]
        this.tableColumns = [
            {
                dataIndex: 'physicalTable',
                key: 'physicalTable',
                title: '表英文名',
                render: (text, record) => (
                    <Tooltip
                        placement='topLeft'
                        title={
                            <span>
                                {text}
                                <br />
                                {record.datasourceIdentifier + '/' + record.physicalDatabase}
                            </span>
                        }
                    >
                        <div className='tableLabel'>
                            <span className='LineClamp1'>{text}</span>
                            <div className='LineClamp1' style={{ color: '#9EA3A8' }}>
                                /{record.datasourceIdentifier}/{record.physicalDatabase}
                            </div>
                        </div>
                    </Tooltip>
                ),
            },
            {
                dataIndex: 'tableName',
                key: 'tableName',
                title: '表中文名',
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
                dataIndex: 'firstClassPath',
                key: 'firstClassPath',
                title: '分类',
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
                dataIndex: 'levelBeforeName',
                key: 'levelBeforeName',
                title: '安全等级（旧）',
                width: 130,
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
                dataIndex: 'levelAfterName',
                key: 'levelAfterName',
                title: '安全等级（新）',
                width: 130,
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
                dataIndex: 'alterType',
                key: 'alterType',
                title: '变更提示',
                width: 120,
                render: (text, record) =>
                    text == 2 || text == 3 ? (
                        <div>
                            {record.alterInfo ? (
                                <StatusLabel
                                    type={text == '2' ? 'warning' : 'error'}
                                    message={
                                        <Popover placement='topLeft' content={this.renderTooltip(record)} trigger='hover'>
                                            <span>{text == 2 ? '降低等级' : '失败'}</span>
                                        </Popover>
                                    }
                                />
                            ) : (
                                <StatusLabel type={text == '2' ? 'warning' : 'error'} message={text == 2 ? '降低等级' : '失败'} />
                            )}
                        </div>
                    ) : (
                        <span>{text == 0 ? '新增' : text == 1 ? '提升等级' : '不变'}</span>
                    ),
            },
        ]
    }
    componentWillMount = () => {
        console.log(this.pageParams, 'pageParams')
        this.setState({
            queryParam: this.pageParams,
        })
        this.getDataSecurityLevelList()
        this.getTagList()
    }
    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }
    changeTableSelect = (index, e) => {
        const { columnData } = this.state
        columnData[index].ruleId = e
        this.setState({
            columnData,
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
    getTagList = async () => {
        let res = await desensitiseTag({ needAll: true })
        if (res.code == 200) {
            this.setState({
                tagList: res.data,
            })
        }
    }
    renderTooltip = (data) => {
        return (
            <div>
                <StatusLabel type={data.alterType == '2' ? 'warning' : 'error'} message={data.alterInfo} />
                <div>
                    <span style={{ color: '#9EA3A8' }}>{data.alterDescTitle}：</span>
                    {data.alterDescValue}
                </div>
            </div>
        )
    }
    changeSelect = async (name, e, node) => {
        let { queryParam } = this.state
        queryParam[name] = e
        if (name == 'tagId') {
            queryParam.sensitivityLevelName = node.props.title
            queryParam.ruleName = node.props.ruleName
            queryParam.tagName = node.props.children
        }
        this.setState({
            queryParam,
        })
    }
    getSensitiveTagRule = async () => {
        if (this.state.queryParam.tagId == undefined) {
            return
        }
        let res = await sensitiveTagRule({ id: this.state.queryParam.tagId })
        if (res.code == 200) {
            this.setState({
                dataMaskList: res.data,
            })
        }
    }
    previewData = async () => {
        let { queryParam, hasFail } = this.state
        hasFail = false
        let res = {}
        this.setState({ previewLoading: true })
        if (queryParam.tabValue == '1') {
            let query = {
                level: queryParam.level,
                tableIdList: queryParam.tableIdList,
            }
            res = await previewTableBatchConfig(query)
            if (res.code == 200) {
                res.data.dsTableBatchPreviewItemList.map((item) => {
                    if (item.alterType == 3) {
                        // 存在失败的情况
                        hasFail = true
                    }
                })
                this.setState({
                    columnData: res.data.dsTableBatchPreviewItemList,
                    hasFail,
                })
            }
        } else {
            if (queryParam.pageType == 'level') {
                let query = {
                    level: queryParam.level,
                    columnIdList: queryParam.tableIdList,
                }
                res = await previewColumnBatchConfig(query)
                if (res.code == 200) {
                    res.data.dsColumnBatchPreviewItemList.map((item) => {
                        if (item.alterType == 3) {
                            // 存在失败的情况
                            hasFail = true
                        }
                    })
                    this.setState({
                        columnData: res.data.dsColumnBatchPreviewItemList,
                        hasFail,
                    })
                }
            } else {
                let query = {
                    tagId: queryParam.tagId,
                    columnIdList: queryParam.tableIdList,
                }
                res = await previewColumnTagBatch(query)
                if (res.code == 200) {
                    this.getSensitiveTagRule()
                    this.setState({
                        columnData: res.data,
                    })
                }
            }
        }
        this.setState({ previewLoading: false })
        if (res.code == 200) {
            this.setState({
                showTable: true,
                staticInfo: res.data,
            })
        }
    }
    handleComplete = async () => {
        const { queryParam, columnData } = this.state
        let res = {}
        this.setState({ loading: true })
        if (queryParam.tabValue == '1') {
            let query = {
                level: queryParam.level,
                tableIdList: queryParam.tableIdList,
            }
            res = await saveTableBatchConfigForLevel(query)
        } else {
            if (queryParam.pageType == 'level') {
                let query = {
                    columnIdList: queryParam.tableIdList,
                    level: queryParam.level,
                }
                res = await saveColumnBatchConfig(query)
            } else {
                let query = [...columnData]
                res = await saveColumnTagBatch(query)
            }
        }
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel()
        }
    }
    cancel = () => {
        let data = {
            tabValue: this.pageParams.tabValue,
        }
        this.props.addTab('数据分级管理', data)
    }
    render() {
        let { queryParam, levelCode, levelList, showTable, columnData, staticInfo, previewLoading, loading, tagList, hasFail } = this.state
        let titleName = queryParam.tabValue == 1 ? '表' : '字段'
        return (
            <React.Fragment>
                <TableLayout
                    title={'批量配置' + (queryParam.pageType == 'level' ? '安全分级' : '敏感标签') + '（' + titleName + '）'}
                    disabledDefaultFooter
                    renderDetail={() => {
                        return (
                            <div className='batchConfig'>
                                <div style={{ marginBottom: 16 }}>
                                    您选择了{queryParam.tableIdList.length}个{titleName}，请{queryParam.pageType == 'level' ? '设置' + titleName + '的数据安全分级' : '添加敏感标签'}
                                </div>
                                <div className='EditMiniForm Grid1'>
                                    {RenderUtil.renderFormItems([
                                        {
                                            label: '安全等级',
                                            hide: queryParam.pageType !== 'level',
                                            content: (
                                                <div>
                                                    <Select style={{ width: 432 }} onChange={this.changeSelect.bind(this, 'level')} value={queryParam.level} placeholder='请选择'>
                                                        {levelList.map((item) => {
                                                            return (
                                                                <Option key={item.id} value={item.id}>
                                                                    {item.name}
                                                                </Option>
                                                            )
                                                        })}
                                                    </Select>
                                                    <Button loading={previewLoading} type='primary' disabled={!queryParam.level} style={{ marginLeft: 8 }} onClick={this.previewData}>
                                                        生成预览
                                                    </Button>
                                                </div>
                                            ),
                                        },
                                        {
                                            label: '敏感标签',
                                            hide: queryParam.pageType == 'level',
                                            content: (
                                                <div>
                                                    <Select style={{ width: 432 }} onChange={this.changeSelect.bind(this, 'tagId')} value={queryParam.tagId} placeholder='请选择'>
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
                                                    <Button loading={previewLoading} type='primary' disabled={!queryParam.tagId} style={{ marginLeft: 8 }} onClick={this.previewData}>
                                                        生成预览
                                                    </Button>
                                                    {queryParam.tagId ? (
                                                        <div style={{ marginTop: 8 }}>
                                                            <span style={{ color: '#5E6266' }}>敏感等级：</span>
                                                            {queryParam.sensitivityLevelName}
                                                            <span style={{ color: '#5E6266', marginLeft: 24 }}>默认脱敏规则：</span>
                                                            {queryParam.ruleName}
                                                        </div>
                                                    ) : null}
                                                </div>
                                            ),
                                        },
                                    ])}
                                </div>
                                {showTable ? (
                                    <div style={{ marginTop: 28, paddingBottom: 30 }}>
                                        <ModuleTitle style={{ marginBottom: 16 }} title='生成结果' />
                                        {queryParam.pageType == 'level' ? (
                                            <div style={{ marginBottom: 16 }}>
                                                <span style={{ color: '#5E6266' }}>安全等级变更统计：</span>
                                                新增{staticInfo.levelStatisticsData.insertCount}个，修改{staticInfo.levelStatisticsData.updateCount}个（上升
                                                {staticInfo.levelChangeStatisticsData.upCount}个，下降{staticInfo.levelChangeStatisticsData.downCount}个），
                                                <ExclamationOutlined style={{ color: '#CC0000', marginRight: 4 }} />
                                                失败{staticInfo.levelStatisticsData.failCount}个
                                            </div>
                                        ) : null}
                                        <Table
                                            columns={queryParam.tabValue == '1' ? this.tableColumns : queryParam.pageType == 'level' ? this.columns : this.tagColumns}
                                            dataSource={columnData}
                                            rowKey={queryParam.tabValue == '1' ? 'tableId' : 'columnId'}
                                            pagination={false}
                                        />
                                    </div>
                                ) : null}
                            </div>
                        )
                    }}
                    showFooterControl={showTable}
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Button loading={loading} type='primary' onClick={this.handleComplete}>
                                    {queryParam.tabValue == '1' ? '确定配置' : '保存变更'}
                                </Button>
                                <Button onClick={this.cancel}>取消</Button>
                                {queryParam.pageType == 'level' && hasFail ? (
                                    <div style={{ marginLeft: 8 }}>
                                        <InfoCircleOutlined style={{ color: '#CC0000', marginRight: 4 }} />
                                        <span style={{ color: '#2D3033' }}>失败的的变更记录，无法被保存</span>
                                    </div>
                                ) : null}
                            </React.Fragment>
                        )
                    }}
                />
            </React.Fragment>
        )
    }
}
