import RichTableLayout from '@/component/layout/RichTableLayout'
import { DownloadOutlined } from '@ant-design/icons'
import { Button, Input, message, Select, Tooltip } from 'antd'
import { deleteManualJob, getManualJob } from 'app_api/metadataApi'
import React, { Component } from 'react'
import EditHandCollection from './editHandCollection'
import PermissionWrap from '@/component/PermissionWrap'
// import '../style.less'
// import store from './store'

const Option = Select.Option

const fillModalMap = {
    // "field":"数据字段属性采集模板",
    // "table":"数据表属性采集模板",
    metadata: '数据源采集模板',
    lineageRelation: '字段血缘关系采集模板',
    physicalCode: '源系统代码采集',
    relationData: '表间关系采集模板',
}

export default class HandCollection extends Component {
    constructor(props) {
        super(props)

        this.columns = [
            {
                dataIndex: 'jobName',
                key: 'jobName',
                title: '任务名称',
                width: '30%',
                render: (text) => (
                    <Tooltip title={text}>
                        <span className='LineClamp1'>{text}</span>
                    </Tooltip>
                ),
            },
            {
                dataIndex: 'fileTpl',
                key: 'fileTpl',
                title: '文件模板',
                width: '25%',
                render: (text, record, index) => {
                    if (record.fileTpl === 'metadata') {
                        return <Tooltip title='数据源采集模板'>数据源采集模板</Tooltip>
                    } else if (record.fileTpl === 'relationData') {
                        return '表间关系采集模板'
                    } else if (record.fileTpl === 'lineageRelation') {
                        return <Tooltip title='字段血缘关系采集模板'>字段血缘关系采集模板</Tooltip>
                    } else if (record.fileTpl === 'physicalCode') {
                        return <Tooltip title='源系统代码采集'>源系统代码采集</Tooltip>
                    }
                },
            },
            {
                dataIndex: 'strategy',
                key: 'strategy',
                width: '16%',
                title: '入库策略',
                render: (text, record, index) => {
                    if (record.strategy === '1') {
                        return '保守全量'
                    } else if (record.strategy === '2') {
                        return '激进全量'
                    } else {
                        return '增量'
                    }
                },
            },
            {
                dataIndex: 'collectTime',
                key: 'collectTime',
                width: '22%',
                title: '采集时间',
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
        ]

        this.selectedRows = [] // 表格里选择的项
        this.showQuickJumper = true // 是否显示跳转到多少页
        this.pageSizeOptions = ['10', '20', '30', '40', '50'] // 每页多少条数据的下拉框

        this.state = {
            keyword: undefined,
            fileTpl: ['metadata', 'lineageRelation', 'physicalCode', 'relationData'],

            visibleEdit: false,
        }
    }

    componentDidMount() {
        this.initData()
    }

    initData = () => {
        // this.currentTable.resetOrderNumber()
        // this.currentTable.setTableLoading()
        // store.resetCondition()
    }

    requestData = async (page, pageSize) => {
        let req = {
            page,
            page_size: pageSize,
            paginationDisplay: 'none',
        }
        req.keyword = this.state.keyword
        req.fileTpl = this.state.fileTpl

        const res = await getManualJob(req)
        if (res.code == 200) {
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

    onDownLoad = () => {
        const url = '../../../../../resources/template/metadataAcquisitionTemplate.zip'
        window.open(url, '_self')
    }

    collectRecord = (index, record) => {
        // Cache.remove('currentPage')
        // this.props.removeTab('采集日志')
        this.props.addTab('采集日志', {
            ...record,
            hasSim: false,
            from: 'handCollection',
            area: 'metadata',
        })
    }

    onAdd = () => {
        this.props.addTab('添加手动采集任务')
    }

    reset = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }

    rowSelection = (selectedRowKeys, selectedRows) => {
        // store.onSelectChange(selectedRowKeys, selectedRows)
    }

    resetSearchParams = () => {
        this.setState(
            {
                keyword: '',
                fileTpl: ['metadata', 'lineageRelation', 'physicalCode', 'relationData'],
            },
            () => {
                this.reset()
            }
        )
    }

    fileTplChange = (value) => {
        let fileTpl = ['metadata', 'lineageRelation', 'physicalCode', 'relationData']
        if (value) {
            fileTpl = [value]
        }

        this.setState({ fileTpl }, () => this.reset())
    }

    deleteRows = async (rows) => {
        let selectedRowsArr = []
        _.map(rows, (item, key) => {
            selectedRowsArr.push({ id: item.id, jobName: item.jobName })
        })

        const res = await deleteManualJob(selectedRowsArr)
        if (res.code == 200) {
            message.success(res.msg)
            this.reset()
        }
    }

    render() {
        const { fileTpl, keyword, visibleEdit } = this.state
        return (
            <React.Fragment>
                <RichTableLayout
                    title='模板采集'
                    renderHeaderExtra={() => {
                        return (
                            <React.Fragment>
                                <PermissionWrap funcCode='/sys/collect/import/manage/download' onClick={this.onDownLoad}>
                                    <Button icon={<DownloadOutlined />} type='primary' ghost>
                                        模板下载
                                    </Button>
                                </PermissionWrap>
                                <PermissionWrap funcCode='/sys/collect/import/manage/import' onClick={() => this.setState({ visibleEdit: true })}>
                                    <Button type='primary'>新增模板采集</Button>
                                </PermissionWrap>
                            </React.Fragment>
                        )
                    }}
                    renderSearch={(controller) => {
                        this.controller = controller
                        return (
                            <React.Fragment>
                                <Input.Search
                                    allowClear
                                    style={{ width: 280 }}
                                    onSearch={this.reset}
                                    placeholder='请输入任务名称'
                                    className='datasourceInput'
                                    value={keyword}
                                    onChange={(event) =>
                                        this.setState({
                                            keyword: event.target.value,
                                        })
                                    }
                                />
                                <Select
                                    style={{ width: 160 }}
                                    value={fileTpl.length === 1 ? fileTpl[0] : undefined}
                                    allowClear
                                    className='datasourceSelect'
                                    onChange={this.fileTplChange}
                                    placeholder='文件模板'
                                >
                                    {_.map(fillModalMap, (node, index) => {
                                        return (
                                            <Option key={index} value={index}>
                                                <Tooltip title={node}>{node}</Tooltip>
                                            </Option>
                                        )
                                    })}
                                </Select>
                                <Button onClick={this.resetSearchParams}>重置</Button>
                            </React.Fragment>
                        )
                    }}
                    tableProps={{
                        selectedEnable: true,
                        columns: this.columns,
                    }}
                    editColumnProps={{
                        width: '14%',
                        createEditColumnElements: (index, record, defaultElements) => {
                            return RichTableLayout.renderEditElements([
                                {
                                    label: '记录',
                                    funcCode: '/sys/collect/import/manage/log',
                                    onClick: () => {
                                        this.collectRecord(index, record)
                                    },
                                },
                            ]).concat(defaultElements)
                        },
                    }}
                    requestListFunction={this.requestData}
                    deleteFunction={(_, rows) => {
                        return this.deleteRows(rows)
                    }}
                    createDeletePermissionData={(record) => {
                        return {
                            funcCode: '/sys/collect/import/manage/delete',
                        }
                    }}
                    renderFooter={(controller, defaultRender) => {
                        return defaultRender()
                    }}
                />
                <EditHandCollection
                    visible={visibleEdit}
                    onClose={() => this.setState({ visibleEdit: false })}
                    onSuccess={() => {
                        this.setState({ visibleEdit: false })
                        this.reset()
                    }}
                />
            </React.Fragment>
        )
    }
}
