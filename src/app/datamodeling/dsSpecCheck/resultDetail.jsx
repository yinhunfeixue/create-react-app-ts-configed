import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RichTableLayout from '@/component/layout/RichTableLayout'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Divider, Form, Input, message, Progress, Select, Tabs, Tooltip } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { downloadTaskResultItem, filterTable, getResultDetailByTaskResultId, listTaskResultItem } from 'app_api/metadataApi'
import Cache from 'app_utils/cache'
import classNames from 'classnames'
import React, { Component } from 'react'
import './resultDetail.less'

const { TabPane } = Tabs

export default class sourceAnalysis extends Component {
    constructor(props) {
        super(props)
        this.state = {
            partitionDetailModal: false,
            tableType: '1',
            loading: false,
            tableData: [],
            deviationOutrangeTableCount: 0,
            missingPartitionTableCount: 0,
            partitionedTableCount: 0,
            tableId: '',
            needIgnorance: false,
            sqlContent: '',
            detailInfo: {
                edmSpecsTaskDTO: {
                    databaseIdNameList: [],
                },
                edmSpecsTaskResultDTO: {},
            },
            queryInfo: {},

            tableQuery: {},
            fieldQuery: {},
        }
        this.tableColumns = [
            {
                title: '表英文名',
                dataIndex: 'tableNameEn',
                key: 'tableNameEn',
                operateType: 'serach',
                render: (text, record) =>
                    text ? (
                        <Tooltip title={this.renderTooltip(record.nameView)}>
                            <span dangerouslySetInnerHTML={{ __html: record.nameView }}></span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '规范表名',
                dataIndex: 'specsName',
                key: 'specsName',
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: '所属表中文名',
                dataIndex: 'tableNameCn',
                key: 'tableNameCn',
                operateType: 'serach',
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: '所属库',
                dataIndex: 'databaseNameEn',
                key: 'databaseNameEn',
                operateType: 'serach',
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: '不规范原因',
                dataIndex: 'failTypeList',
                key: 'failTypeList',
                operateType: 'serachSelect',
                render: (text, record) => (
                    <Tooltip title={record.failType == 1 ? '格式错误' : record.failType == 2 ? '缺少词根' : <EmptyLabel />}>
                        {record.failType == 1 ? '格式错误' : record.failType == 2 ? '缺少词根' : <EmptyLabel />}
                    </Tooltip>
                ),
            },
            {
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                width: 100,
                render: (text, record) => {
                    return (
                        <span>
                            {record.failType == 1 ? <a onClick={this.openDetailModal.bind(this, record)}>查看DDL</a> : null}
                            {record.failType == 2 ? <a onClick={this.openAddRootPage.bind(this, record)}>新增词根</a> : null}
                        </span>
                    )
                },
            },
        ]
        this.columns = [
            {
                title: '字段英文名',
                dataIndex: 'columnNameEn',
                key: 'columnNameEn',
                operateType: 'serach',
                render: (text, record) =>
                    text ? (
                        <Tooltip title={this.renderTooltip(record.nameView)}>
                            <span dangerouslySetInnerHTML={{ __html: record.nameView }}></span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '规范字段名',
                dataIndex: 'specsName',
                key: 'specsName',
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: '字段中文名',
                dataIndex: 'columnNameCn',
                key: 'columnNameCn',
                operateType: 'serach',
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: '所属表英文名',
                dataIndex: 'tableNameEn',
                key: 'tableNameEn',
                operateType: 'serach',
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: '所属表中文名',
                dataIndex: 'tableNameCn',
                key: 'tableNameCn',
                operateType: 'serach',
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: '所属库',
                dataIndex: 'databaseNameEn',
                key: 'databaseNameEn',
                operateType: 'serach',
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
                // width: '30%',
            },
            {
                title: '不规范原因',
                dataIndex: 'failTypeList',
                key: 'failTypeList',
                operateType: 'serachSelect',
                render: (text, record) => (
                    <Tooltip title={record.failType == 1 ? '格式错误' : record.failType == 2 ? '缺少词根' : <EmptyLabel />}>
                        {record.failType == 1 ? '格式错误' : record.failType == 2 ? '缺少词根' : <EmptyLabel />}
                    </Tooltip>
                ),
            },
            {
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                width: 100,
                render: (text, record) => {
                    return (
                        <span>
                            {record.failType == 1 ? <a onClick={this.openDetailModal.bind(this, record)}>查看DDL</a> : null}
                            {record.failType == 2 ? <a onClick={this.openAddRootPage.bind(this, record)}>新增词根</a> : null}
                        </span>
                    )
                },
            },
        ]
    }
    componentWillMount = () => {
        this.getDetailInfo()
    }
    openDetailModal = (data) => {
        this.setState({
            partitionDetailModal: true,
            sqlContent: data.ddl,
        })
    }
    renderTooltip = (value) => {
        return <a style={{ color: '#fff' }} dangerouslySetInnerHTML={{ __html: value }}></a>
    }
    stopCheck = async (data) => {
        let res = await filterTable({ tableId: data.tableId })
        if (res.code == 200) {
            this.getTableList({})
            message.success('设置成功，下次执行时不再检查')
        }
    }
    openAddRootPage = (data) => {
        this.props.addTab('批量新增词根', { rootCategory: data.rootCategory, lackedRootsArr: data.lackedRootsArr }, true)
    }
    getDetailInfo = async () => {
        console.log(this.props.location.state)
        let res = await getResultDetailByTaskResultId({ taskResultId: this.props.location.state.taskResultId })
        if (res.code == 200) {
            this.setState({
                detailInfo: res.data,
            })
        }
    }
    copy = () => {
        var input = document.getElementById('textarea')
        input.value = this.state.sqlContent
        input.select()
        document.execCommand('copy')
        message.success('复制成功')
    }
    tableTypeChange = (e) => {
        this.setTableType(e)
    }
    setTableType = async (value) => {
        await this.setState({
            tableType: value,
        })
        this.getTableList({})
    }
    getTableList = async (params = {}) => {
        let query = {
            failTypeList: [1, 2],
            ...params.query,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 10,
            checkType: params.tableType || 2,
            taskResultId: this.props.location.state.taskResultId,
        }
        this.setState({ loading: true })
        let res = await listTaskResultItem(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            let param = {
                ...params.filterSelectedList,
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 10,
                // dataIndex
            }
            let data = {
                data: res.data,
                total: res.total,
            }
            this.setState({
                tableData: res.data,
                queryInfo: query,
            })
            this.lzTableDom && this.lzTableDom.setTableData(data, param)
            return {
                dataSource: res.data,
                total: res.total,
            }
        }
    }
    onFilterSearch = async (params) => {
        let array = []
        if (params.dataIndex == 'failTypeList') {
            array = [
                { id: 1, name: '格式错误' },
                { id: 2, name: '缺少词根' },
            ]
        }
        return array
    }
    getToFixedNum = (value) => {
        if (value) {
            return value.toFixed(2).replace(/[.]?0+$/g, '') + '%'
        } else {
            return '0%'
        }
    }
    cancelModal = () => {
        this.setState({
            partitionDetailModal: false,
        })
    }
    openChartPage = async () => {
        this.dmChart.showModal(true, { taskResultId: this.props.location.state.taskResultId })
    }
    openSettingPage = () => {
        this.props.addTab('检查过滤设置')
    }
    download = async () => {
        const { queryInfo } = this.state
        queryInfo.needAll = true
        delete queryInfo.page
        let res = await downloadTaskResultItem(queryInfo)
    }
    getToFixedNum = (value) => {
        if (value) {
            return value.toFixed(2).replace(/[.]?0+$/g, '') + '%'
        } else {
            return '0%'
        }
    }

    resetTable() {
        if (this.tableController) {
            this.tableController.reset()
        }
    }

    resetFieldTable() {
        if (this.fieldController) {
            this.fieldController.reset()
        }
    }

    render() {
        const { tableType, tableData, loading, deviationOutrangeTableCount, missingPartitionTableCount, partitionedTableCount, partitionDetailModal, detailInfo, sqlContent, tableQuery, fieldQuery } =
            this.state
        let tableNums = Cache.get('dataWareTableNum')
        let databaseName = ''
        detailInfo.edmSpecsTaskDTO.databaseIdNameList &&
            detailInfo.edmSpecsTaskDTO.databaseIdNameList.map((item, index) => {
                databaseName += item.name + (index < detailInfo.edmSpecsTaskDTO.databaseIdNameList.length - 1 ? '、' : '')
            })

        return (
            <div className='VControlGroup resultDetail'>
                <TableLayout
                    title='结果详情'
                    disabledDefaultFooter
                    renderDetail={() => {
                        return (
                            <Module title='任务配置信息'>
                                <Form className='MiniForm Grid4'>
                                    {RenderUtil.renderFormItems([
                                        {
                                            label: '数据源',
                                            content: detailInfo.edmSpecsTaskDTO.datasourceNameEn,
                                        },
                                        {
                                            label: '数据库',
                                            content: databaseName,
                                        },
                                        {
                                            label: '词根类别',
                                            content:
                                                detailInfo.edmSpecsTaskDTO.rootCategory == 'abbr' ? (
                                                    '英文缩写'
                                                ) : detailInfo.edmSpecsTaskDTO.rootCategory == 'firstpinyin' ? (
                                                    '拼音首字母'
                                                ) : detailInfo.edmSpecsTaskDTO.rootCategory == 'prefixsuffix' ? (
                                                    '前缀后缀'
                                                ) : (
                                                    <EmptyLabel />
                                                ),
                                        },
                                        {
                                            label: '拼写方式',
                                            content:
                                                detailInfo.edmSpecsTaskDTO.spellType == 'camel' ? (
                                                    '驼峰'
                                                ) : detailInfo.edmSpecsTaskDTO.spellType == 'alllower' ? (
                                                    '全小写'
                                                ) : detailInfo.edmSpecsTaskDTO.spellType == 'allupper' ? (
                                                    '全大写'
                                                ) : detailInfo.edmSpecsTaskDTO.spellType == 'firstupper' ? (
                                                    '首字母大写'
                                                ) : (
                                                    <EmptyLabel />
                                                ),
                                        },
                                        {
                                            label: '连接方式',
                                            content:
                                                detailInfo.edmSpecsTaskDTO.joinType == 'underline' ? '下划线连接' : detailInfo.edmSpecsTaskDTO.joinType == 'noconnectors' ? '无连接符' : <EmptyLabel />,
                                        },
                                        {
                                            label: '创建人',
                                            content: detailInfo.edmSpecsTaskDTO.createUser,
                                        },
                                        {
                                            label: '创建时间',
                                            content: detailInfo.edmSpecsTaskDTO.createTime,
                                        },
                                    ])}
                                </Form>
                            </Module>
                        )
                    }}
                />
                <Module
                    title='检查结果'
                    renderHeaderExtra={() => {
                        return (
                            <Button onClick={this.download} type='primary' ghost>
                                下载明细
                            </Button>
                        )
                    }}
                >
                    <div className='HControlGroup'>
                        {(() => {
                            switch (detailInfo.edmSpecsTaskResultDTO.result) {
                                case 1:
                                    return <StatusLabel message='检查中' type='loading' />
                                case 2:
                                    return <StatusLabel message='检查完成' type='success' />
                                case 3:
                                    return <StatusLabel message='检查失败' type='error' />

                                default:
                                    return <EmptyLabel />
                            }
                        })()}
                        <span>
                            <span>检查时间：</span>
                            {detailInfo.edmSpecsTaskResultDTO.time}
                        </span>
                    </div>
                    {/* 卡片 */}
                    <div className='CardGroup'>
                        {[
                            {
                                icon: require('app_images/paper.png'),
                                title: '表规范率',
                                rate: detailInfo.edmSpecsTaskResultDTO.tablePassRate,
                                desList: [
                                    {
                                        label: '不规范表',
                                        value: detailInfo.edmSpecsTaskResultDTO.tableProblemNums,
                                        light: true,
                                    },
                                    {
                                        label: '检查表数',
                                        value: detailInfo.edmSpecsTaskResultDTO.tableNums,
                                    },
                                ],
                            },
                            {
                                icon: require('app_images/fold.png'),
                                title: '字段规范率',
                                rate: detailInfo.edmSpecsTaskResultDTO.columnPassRate,
                                desList: [
                                    {
                                        label: '不规范字段',
                                        value: detailInfo.edmSpecsTaskResultDTO.columnProblemNums,
                                        light: true,
                                    },
                                    {
                                        label: '检查字段数',
                                        value: detailInfo.edmSpecsTaskResultDTO.columnNums,
                                    },
                                ],
                            },
                        ].map((item) => {
                            return (
                                <div className='CardItem' key={item.title}>
                                    <img src={item.icon} className='Icon' />
                                    <div>
                                        <h3>{item.title}</h3>
                                        <h1>{this.getToFixedNum(item.rate * 100)}</h1>
                                    </div>
                                    <Divider type='vertical' className='Divider' />
                                    <main>
                                        <Form className='MiniForm' layout='inline'>
                                            {item.desList.map((desItem) => {
                                                return (
                                                    <FormItem key={desItem.label} label={<span className={classNames('DesItemLabel', desItem.light ? 'DesItemLabelLight' : '')}>{desItem.label}</span>}>
                                                        {desItem.value}
                                                    </FormItem>
                                                )
                                            })}
                                        </Form>
                                        <Progress percent={item.rate * 100} showInfo={false} strokeColor='#FF9900' strokeLinecap='square' />
                                    </main>
                                </div>
                            )
                        })}
                    </div>
                    {/* tab表格 */}
                    <Tabs value={tableType} onChange={this.tableTypeChange} animated={false}>
                        <Tabs.TabPane key='1' tab='表明细'>
                            <RichTableLayout
                                smallLayout
                                editColumnProps={{
                                    hidden: true,
                                }}
                                renderSearch={(controller) => {
                                    this.tableController = controller
                                    return (
                                        <React.Fragment>
                                            <Input.Search
                                                placeholder='表名（中/英）'
                                                allowClear
                                                onSearch={(value) => {
                                                    tableQuery.columnName = value
                                                    this.resetTable()
                                                }}
                                            />
                                            <Input.Search
                                                placeholder='所属库'
                                                allowClear
                                                onSearch={(value) => {
                                                    tableQuery.databaseNameEn = value
                                                    this.resetTable()
                                                }}
                                            />
                                            <Select
                                                placeholder='不规范原因'
                                                mode='multiple'
                                                style={{ width: 240 }}
                                                showArrow
                                                onChange={(value) => {
                                                    tableQuery.failTypeList = value
                                                    this.resetTable()
                                                }}
                                            >
                                                {RenderUtil.renderSelectOptionList(
                                                    [
                                                        {
                                                            value: 1,
                                                            label: '格式错误',
                                                        },
                                                        {
                                                            value: 2,
                                                            label: '缺少词根',
                                                        },
                                                    ],
                                                    (item) => item.label,
                                                    (item) => item.value
                                                )}
                                            </Select>
                                        </React.Fragment>
                                    )
                                }}
                                tableProps={{
                                    columns: this.tableColumns,
                                }}
                                requestListFunction={(page, pageSize) => {
                                    return this.getTableList({
                                        pagination: {
                                            page,
                                            page_size: pageSize,
                                        },
                                        tableType: 1,
                                        query: tableQuery,
                                    })
                                }}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane key='2' tab='字段明细'>
                            <RichTableLayout
                                smallLayout
                                editColumnProps={{
                                    hidden: true,
                                }}
                                renderSearch={(controller) => {
                                    this.fieldController = controller
                                    return (
                                        <React.Fragment>
                                            {[
                                                {
                                                    label: '字段名（中/英）',
                                                    field: 'columnName',
                                                },
                                                // {
                                                //     label: '字段中文名',
                                                //     field: 'columnNameCn',
                                                // },
                                                {
                                                    label: '所属表名（中/英）',
                                                    field: 'tableName',
                                                },
                                                // {
                                                //     label: '所属表中文名',
                                                //     field: 'tableNameCn',
                                                // },
                                                {
                                                    label: '所属库',
                                                    field: 'databaseNameEn',
                                                },
                                            ].map((item) => {
                                                return (
                                                    <Input.Search
                                                        style={{ width: 200 }}
                                                        placeholder={item.label}
                                                        allowClear
                                                        onSearch={(value) => {
                                                            fieldQuery[item.field] = value
                                                            this.resetFieldTable()
                                                        }}
                                                    />
                                                )
                                            })}

                                            <Select
                                                placeholder='不规范原因'
                                                mode='multiple'
                                                style={{ width: 240 }}
                                                showArrow
                                                onChange={(value) => {
                                                    fieldQuery.failTypeList = value
                                                    this.resetFieldTable()
                                                }}
                                            >
                                                {RenderUtil.renderSelectOptionList(
                                                    [
                                                        {
                                                            value: 1,
                                                            label: '格式错误',
                                                        },
                                                        {
                                                            value: 2,
                                                            label: '缺少词根',
                                                        },
                                                    ],
                                                    (item) => item.label,
                                                    (item) => item.value
                                                )}
                                            </Select>
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
                                        tableType: 2,
                                        query: fieldQuery,
                                    })
                                }}
                            />
                        </Tabs.TabPane>
                    </Tabs>
                </Module>

                <DrawerLayout
                    drawerProps={{
                        title: 'DDL',
                        visible: partitionDetailModal,
                        onClose: this.cancelModal,
                    }}
                    renderFooter={() => {
                        return (
                            <Button onClick={this.copy} type='primary'>
                                复制
                            </Button>
                        )
                    }}
                >
                    {partitionDetailModal ? (
                        <div className='tableCell commonScroll' style={{ position: 'relative', height: '300px', border: '1px solid #D3D3D3', padding: '8px' }}>
                            <textarea style={{ width: '100%', height: '270px', resize: 'none', outline: 'none', border: 'none' }} readonly='readonly'>
                                {sqlContent}
                            </textarea>
                        </div>
                    ) : null}
                    <textarea id='textarea' style={{ opacity: '0', height: '0px' }}>
                        {sqlContent}
                    </textarea>
                </DrawerLayout>
            </div>
        )
    }
}
