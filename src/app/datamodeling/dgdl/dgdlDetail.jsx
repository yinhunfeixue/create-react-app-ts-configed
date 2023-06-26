import ExpandTable from '@/app/dama/component/expandTable'
import EmptyLabel from '@/component/EmptyLabel'
import IconFont from '@/component/IconFont'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { CheckCircleOutlined, ClockCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Button, Form, Input, message, Select, Tooltip } from 'antd'
import { auditRecord, datamodelingTableDetail, dataTypeFilters, governColumns, governPartitionColumns, governTableDetail, partitionColumns, tableColumns } from 'app_api/dataModeling'
import { tableDdl, tableDgdl } from 'app_api/metadataApi'
import React, { Component } from 'react'
import RootDetailDrawer from '../dgdl/comonpent/rootDetailDrawer'
import RootWindow from '../dgdl/comonpent/rootWindow'
import '../index.less'
import DdlDrawer from './comonpent/DdlCodeDrawer'

export default class DgdlDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            detailInfo: {},
            queryInfo: {
                keyword: '',
            },
            dataTypeList: [],
            auditRecordList: [],
            btnLoading: false,
            columnData: [],
            partionTableData: [],
            allColumnData: [],
        }
        this.columns = [
            {
                title: '字段中文名',
                dataIndex: 'columnNameCn',
                key: 'columnNameCn',
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
                title: '字段英文名',
                dataIndex: 'columnNameEn',
                key: 'columnNameEn',
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
                title: (
                    <span>
                        字段类型
                        <Tooltip
                            overlayStyle={{ maxWidth: 266 }}
                            title={
                                <div>
                                    被括起来的内容依次为长度，精度。例如：
                                    <ul style={{ paddingLeft: 12 }}>
                                        <li style={{ listStyle: 'initial' }}>DOUBLE(11,2)</li>
                                        <li style={{ listStyle: 'initial' }}>字段类型为DOUBLE，长度11，精度2</li>
                                    </ul>
                                </div>
                            }
                        >
                            <InfoCircleOutlined style={{ color: '#5E6266', marginLeft: '5px' }} />
                        </Tooltip>
                    </span>
                ),
                dataIndex: 'dataType',
                key: 'dataType',
                width: 130,
                render: (text, record) =>
                    text ? (
                        <span className='LineClamp'>{text + (record.dataLength !== undefined ? '(' + record.dataLength + (record.dataPrecision ? ',' + record.dataPrecision : '') + ')' : '')}</span>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '非空',
                dataIndex: 'nullable',
                key: 'nullable',
                width: 120,
                render: (text) => {
                    return <span>{!text ? '非空' : <EmptyLabel />}</span>
                },
            },
            {
                title: '主键',
                dataIndex: 'primaryKey',
                key: 'primaryKey',
                width: 120,
                render: (text) => {
                    return <span>{text ? '主键' : <EmptyLabel />}</span>
                },
            },
            {
                title: '外键',
                dataIndex: 'foreignKey',
                key: 'foreignKey',
                width: 120,
                render: (text, record) => {
                    if (text) {
                        return (
                            <div>
                                <Tooltip title={'外键：' + record.foreignColumnName}>
                                    <IconFont className='foreignKey' type='icon-waijian' />
                                </Tooltip>
                            </div>
                        )
                    } else {
                        return <EmptyLabel />
                    }
                },
            },
            {
                dataIndex: 'codeItemName',
                key: 'codeItemName',
                title: '引用代码',
                width: 100,
                render: (text, record, index) => {
                    if (text) {
                        return (
                            <div>
                                <Tooltip title={'引用代码：' + text}>{text ? <IconFont className='foreignKey' type='icon-code' /> : null}</Tooltip>
                            </div>
                        )
                    } else {
                        return <EmptyLabel />
                    }
                },
            },
        ]
    }
    componentDidMount = () => {
        this.getGovernTableDetail()
        this.getDatatypeList()
        this.getAuditRecord()
        this.getPartionTableList()
        this.getAllColumnData()
    }
    getAllColumnData = async () => {
        let query = {
            page: 1,
            pageSize: 999999,
            tableId: this.pageParam.id,
        }
        let res = {}
        if (this.pageParam.showEditBtn) {
            res = await tableColumns(query)
        } else {
            res = await governColumns(query)
        }
        if (res.code == 200) {
            this.setState({
                allColumnData: res.data,
            })
        }
    }
    getAuditRecord = async () => {
        let res = await auditRecord({ tableId: this.pageParam.id, needAll: true, audit: true })
        if (res.code == 200) {
            this.setState({
                auditRecordList: res.data,
            })
        }
    }
    getGovernTableDetail = async () => {
        let res = {}
        if (this.pageParam.showEditBtn) {
            res = await datamodelingTableDetail({ tableId: this.pageParam.id })
        } else {
            res = await governTableDetail({ id: this.pageParam.id })
        }
        if (res.code == 200) {
            await this.setState({
                detailInfo: res.data,
            })
        }
    }
    getDatatypeList = async () => {
        let res = await dataTypeFilters({ tableId: this.pageParam.id })
        if (res.code == 200) {
            this.setState({
                dataTypeList: res.data,
            })
        }
    }
    get pageParam() {
        return ProjectUtil.getPageParam(this.props)
    }
    getTableList = async (params = {}) => {
        let { queryInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 10,
            tableId: this.pageParam.id,
            ...queryInfo,
        }
        let res = {}
        if (this.pageParam.showEditBtn) {
            res = await tableColumns(query)
        } else {
            res = await governColumns(query)
        }
        if (res.code == 200) {
            this.setState({
                columnData: res.data,
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
    getPartionTableList = async (params = {}) => {
        let { queryInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: 999999,
            tableId: this.pageParam.id,
            ...queryInfo,
        }
        let res = {}
        if (this.pageParam.showEditBtn) {
            res = await partitionColumns(query)
        } else {
            res = await governPartitionColumns(query)
        }
        if (res.code == 200) {
            this.setState({
                partionTableData: res.data,
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
    changeStatus = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    search = () => {
        this.expandTable && this.expandTable.reset()
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            keyword: '',
        }
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    generateDgdl = async () => {
        let { detailInfo, partionTableData, allColumnData } = this.state
        detailInfo.columnList = [...partionTableData, ...allColumnData]
        // 去掉detailInfo里的dataTypeInfo参数
        detailInfo.columnList.forEach((v) => {
            if (v.dataTypeInfo) {
                v.dataTypeInfo = null
            }
        })
        this.setState({ btnLoading: true })
        let res = {}
        if (detailInfo.status == 2 && !this.pageParam.showEditBtn) {
            detailInfo.dgdlComment = false
            res = await tableDgdl(detailInfo)
        } else {
            res = await tableDdl(detailInfo)
        }
        this.setState({ btnLoading: false })
        if (res.code == 200) {
            this.ddlDrawer && this.ddlDrawer.openModal(res.data, detailInfo.status == 2 && !this.pageParam.showEditBtn ? 'DGDL' : 'DDL', detailInfo)
        }
    }
    renderTitle = () => {
        let { detailInfo } = this.state
        return (
            <React.Fragment>
                {detailInfo.tableNameCn}（{detailInfo.tableNameEn}）
                {!this.pageParam.showEditBtn ? (
                    <span>
                        {detailInfo.status == 2 ? (
                            <span className='manageStatus'>
                                <CheckCircleOutlined />
                                治理完成
                            </span>
                        ) : (
                            <span style={{ color: '#FF7114' }} className='manageStatus'>
                                <ClockCircleOutlined style={{ color: '#FF7114' }} />
                                待治理人员完善
                            </span>
                        )}
                    </span>
                ) : null}
            </React.Fragment>
        )
    }
    openRootDetailModal = () => {
        let { detailInfo, auditRecordList } = this.state
        this.rootDetailDrawer && this.rootDetailDrawer.openModal(auditRecordList)
    }
    openEditPage = () => {
        let data = {
            ...this.pageParam,
            pageType: 'edit',
        }
        this.props.addTab('DDL编辑表', data)
    }
    render() {
        let { detailInfo, queryInfo, dataTypeList, auditRecordList, btnLoading, partionTableData } = this.state
        return (
            <div className='dgdlDetail'>
                <TableLayout
                    disabledDefaultFooter
                    title={this.renderTitle()}
                    renderHeaderExtra={() => {
                        return (
                            <div>
                                {this.pageParam.showEditBtn ? (
                                    <Button style={{ marginRight: 8 }} type='primary' ghost onClick={this.openEditPage}>
                                        修改
                                    </Button>
                                ) : null}
                                <Button type='primary' loading={btnLoading} onClick={this.generateDgdl}>
                                    {detailInfo.status == 2 && !this.pageParam.showEditBtn ? '生成DGDL' : '生成DDL'}
                                </Button>
                            </div>
                        )
                    }}
                    renderDetail={() => {
                        return (
                            <Module title='基本信息'>
                                <Form className='MiniForm Grid4'>
                                    {RenderUtil.renderFormItems([
                                        {
                                            label: '所属数据源',
                                            content: detailInfo.datasourceName,
                                        },
                                        {
                                            label: '表分组',
                                            content: this.pageParam.showEditBtn ? detailInfo.groupName : detailInfo.groupCodeName,
                                        },
                                        {
                                            label: '创建人',
                                            content: detailInfo.createUser,
                                        },
                                        {
                                            label: '创建时间',
                                            content: detailInfo.createTime,
                                        },
                                    ])}
                                </Form>
                            </Module>
                        )
                    }}
                />
                {detailInfo.status == 2 && !this.pageParam.showEditBtn ? (
                    <Module title='表治理信息' style={{ marginTop: 16 }}>
                        <Form className='MiniForm Grid4'>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '分类路径',
                                    content: detailInfo.classPath,
                                },
                                {
                                    label: '业务归属部门',
                                    content: detailInfo.bizDepartmentName,
                                },
                                {
                                    label: '业务负责人',
                                    content: detailInfo.bizManagerName,
                                },
                                {
                                    label: '技术归属部门',
                                    content: detailInfo.techDepartmentName,
                                },
                                {
                                    label: '技术负责人',
                                    content: detailInfo.techManagerName,
                                },
                                // {
                                //     label: '表安全等级',
                                //     content: detailInfo.securityLevelName
                                // },
                            ])}
                        </Form>
                    </Module>
                ) : null}
                <Module title='字段信息' style={{ marginTop: 16 }}>
                    <ExpandTable
                        ref={(dom) => (this.expandTable = dom)}
                        expandable={detailInfo.status == 2 && !this.pageParam.showEditBtn ? true : false}
                        defaultExpandAll={detailInfo.status == 2 && !this.pageParam.showEditBtn ? true : false}
                        tableProps={{
                            rowKey: 'id',
                            columns: this.columns,
                        }}
                        renderSearch={() => {
                            return (
                                <div style={{ display: 'flex', marginBottom: 20 }}>
                                    <Input.Search
                                        value={queryInfo.keyword}
                                        onChange={this.changeKeyword}
                                        onSearch={this.search}
                                        placeholder='请输入字段中文名或英文名'
                                        style={{ width: 280, marginRight: 8 }}
                                    />
                                    <Select allowClear onChange={this.changeStatus.bind(this, 'dataType')} value={queryInfo.dataType} placeholder='字段类型' style={{ width: 160, marginRight: 8 }}>
                                        {dataTypeList.map((item) => {
                                            return (
                                                <Option key={item} value={item}>
                                                    {item}
                                                </Option>
                                            )
                                        })}
                                    </Select>
                                    <Button onClick={this.reset}>重置</Button>
                                </div>
                            )
                        }}
                        expandedRowRenderDetail={(record, index) => {
                            return (
                                <div className='expandArea'>
                                    <span className='manageIcon'>治理信息</span>
                                    {RenderUtil.renderFormItems([
                                        {
                                            label: '数据标准',
                                            content: record.standardName,
                                        },
                                        // {
                                        //     label: '安全等级',
                                        //     content: record.securityLevelName
                                        // },
                                        // {
                                        //     label: '敏感标签',
                                        //     content: record.desensitiseTagName,
                                        // },
                                        {
                                            label: '质量规则',
                                            content: (
                                                <div>
                                                    {record.qaRuleNameList &&
                                                        record.qaRuleNameList.map((item, index1) => {
                                                            return (
                                                                <span>
                                                                    {item.ruleName}
                                                                    {index1 + 1 == record.qaRuleNameList.length ? '' : '，'}
                                                                </span>
                                                            )
                                                        })}
                                                </div>
                                            ),
                                        },
                                    ])}
                                </div>
                            )
                        }}
                        requestListFunction={(page, pageSize) => {
                            return this.getTableList({
                                pagination: {
                                    page,
                                    page_size: pageSize,
                                },
                            })
                        }}
                    />
                </Module>
                {partionTableData.length ? (
                    <Module title='分区字段' style={{ marginTop: 16 }}>
                        <ExpandTable
                            ref={(dom) => (this.expandTable1 = dom)}
                            expandable={detailInfo.status == 2 && !this.pageParam.showEditBtn ? true : false}
                            defaultExpandAll={detailInfo.status == 2 && !this.pageParam.showEditBtn ? true : false}
                            tableProps={{
                                rowKey: 'id',
                                columns: this.columns,
                                pagination: false,
                            }}
                            renderSearch={() => {
                                return null
                            }}
                            expandedRowRenderDetail={(record, index) => {
                                return (
                                    <div className='expandArea'>
                                        <span className='manageIcon'>治理信息</span>
                                        {RenderUtil.renderFormItems([
                                            {
                                                label: '数据标准',
                                                content: record.standardName,
                                            },
                                            // {
                                            //     label: '安全等级',
                                            //     content: record.securityLevelName
                                            // },
                                            // {
                                            //     label: '敏感标签',
                                            //     content: record.desensitiseTagName,
                                            // },
                                            {
                                                label: '质量规则',
                                                content: (
                                                    <div>
                                                        {record.qaRuleNameList &&
                                                            record.qaRuleNameList.map((item, index1) => {
                                                                return (
                                                                    <span>
                                                                        {item.ruleName}
                                                                        {index1 + 1 == record.qaRuleNameList.length ? '' : '，'}
                                                                    </span>
                                                                )
                                                            })}
                                                    </div>
                                                ),
                                            },
                                        ])}
                                    </div>
                                )
                            }}
                            requestListFunction={(page, pageSize) => {
                                return this.getPartionTableList({
                                    pagination: {
                                        page,
                                        page_size: pageSize,
                                    },
                                })
                            }}
                        />
                    </Module>
                ) : null}
                <DdlDrawer ref={(dom) => (this.ddlDrawer = dom)} />
                <RootDetailDrawer ref={(dom) => (this.rootDetailDrawer = dom)} />
                <RootWindow
                    openModal={this.openRootDetailModal}
                    renderNumber={() => {
                        return <span>{auditRecordList.length}</span>
                    }}
                />
                <div className='dopTitle'>- DOP数据运营平台 -</div>
            </div>
        )
    }
}
