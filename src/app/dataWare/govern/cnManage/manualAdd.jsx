import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { Button, Input, Modal, Radio, Select, Cascader } from 'antd'
import { getNameCnManualAddSearchCondition, listManualAddTableData } from 'app_api/standardApi'
import { datasourceListForQuery } from 'app_api/metadataApi'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'

const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input
const confirm = Modal.confirm

export default class eastReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableData: [],
            keyword: '',
            tableInfo: {},
            datasourceInfos: [],
            datasourceIds: [],
        }
        this.columns = [
            {
                title: '表英文名',
                dataIndex: 'tableNameEn',
                key: 'tableNameEn',
                width: '32%',
                render: (text) =>
                    text ? (
                        <Tooltip title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '表中文名',
                dataIndex: 'tableNameCn',
                key: 'tableNameCn',
                width: '22%',
                render: (text, record) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '数据库',
                dataIndex: 'databaseNameEn',
                key: 'databaseNameEn',
                width: '18%',
                render: (text, record) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '数据源中文名',
                dataIndex: 'datasourceChineseName',
                key: 'datasourceChineseName',
                width: '12%',
                render: (text) =>
                    text ? (
                        <Tooltip title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '中文信息比率',
                dataIndex: 'nameCnRate',
                key: 'nameCnRate',
                width: '12%',
                align: 'right',
                render: (text, record) => <Tooltip title={this.getToFixedNum(text * 100)}>{this.getToFixedNum(text * 100)}</Tooltip>,
            },
            {
                title: '字段数量',
                dataIndex: 'columnNums',
                key: 'columnNums',
                width: '12%',
                align: 'right',
                render: (text, record) => <Tooltip title={text}>{text}</Tooltip>,
            },
        ]
    }
    componentWillMount = () => {
        this.getSearchCondition()
    }
    openColumnDetail = (data) => {
        this.drawer.showModal()
    }
    openColumnPage = (id) => {
        this.props.addTab('脱敏字段', { id })
    }
    openStandardDetail = (data) => {}
    getSearchCondition = async () => {
        let res = await datasourceListForQuery()
        if (res.code == 200) {
            this.setState({
                datasourceInfos: res.data,
            })
        }
    }
    openEditModal = (data) => {
        this.props.addTab('编辑中文信息', { tableId: data.tableId }, true)
    }
    getTableList = async (params = {}) => {
        let { datasourceIds, keyword } = this.state
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            keyword: keyword,
            datasourceId: datasourceIds[0],
            databaseIdList: datasourceIds[1] ? [datasourceIds[1]] : [],
        }
        let res = await listManualAddTableData(query)
        if (res.code == 200) {
            let param = {
                ...params.filterSelectedList,
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 20,
            }
            let data = {
                data: res.data,
                total: res.total,
            }

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
    getToFixedNum = (value) => {
        if (value) {
            return value.toFixed(2).replace(/[.]?0+$/g, '') + '%'
        } else {
            return '0%'
        }
    }
    reset = async () => {
        await this.setState({
            keyword: '',
            datasourceIds: [],
        })
        this.search()
    }
    changeStatus = async (e) => {
        await this.setState({
            datasourceIds: e
        })
        this.search()
    }
    changeKeyword = (e) => {
        this.setState({
            keyword: e.target.value,
        })
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    render() {
        const { datasourceIds, keyword, datasourceInfos } = this.state
        return (
            <RichTableLayout
                title='中文信息管理'
                tableProps={{
                    key: 'tableId',
                    columns: this.columns,
                }}
                editColumnProps={{
                    width: '8%',
                    createEditColumnElements: (_, record) => {
                        return [
                            <a onClick={this.openEditModal.bind(this, record)} key='look'>
                                编辑
                            </a>,
                        ]
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
                renderSearch={(controller) => {
                    this.controller = controller
                    return (
                        <React.Fragment>
                            <Input.Search allowClear value={keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='表中文名或英文名' />
                            <Cascader
                                allowClear
                                changeOnSelect
                                fieldNames={{ label: 'name', value: 'id' }}
                                options={datasourceInfos}
                                value={datasourceIds}
                                // displayRender={(e) => e.join('-')}
                                onChange={this.changeStatus}
                                popupClassName='searchCascader'
                                placeholder='数据源／数据库'
                            />
                            <Button onClick={this.reset}>重置</Button>
                        </React.Fragment>
                    )
                }}
            />
        )
    }
}
