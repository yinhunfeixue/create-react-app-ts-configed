import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import ProjectUtil from '@/utils/ProjectUtil'
import { Pagination, Table, Tooltip } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { clusterColumn } from 'app_api/standardApi'
import React, { Component } from 'react'
export default class ColumnDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            tableData: [],
            loading: false,
            current: 1,
        }
        this.columns = [
            {
                title: '字段名称',
                dataIndex: 'chineseName',
                key: 'chineseName',
                width: 100,
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
                title: '字段英文',
                dataIndex: 'englishName',
                key: 'englishName',
                width: 100,
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
                title: '数据表',
                dataIndex: 'tableEnglishName',
                key: 'tableEnglishName',
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
                title: '数据库',
                dataIndex: 'databaseEnglishName',
                key: 'databaseEnglishName',
                width: 100,
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
                title: '数据源中文名',
                dataIndex: 'datasourceChineseName',
                key: 'datasourceChineseName',
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
                title: '映射标准',
                dataIndex: 'name',
                key: 'name',
                width: 100,
                render: (text, record) => (
                    <Tooltip title={record.standard ? record.standard.entityDesc : ''}>
                        {record.standard ? record.standard.entityDesc ? record.standard.entityDesc : <EmptyLabel /> : <EmptyLabel />}
                    </Tooltip>
                ),
            },
        ]
    }
    setTableData = (data, param) => {
        this.lzTableDom && this.lzTableDom.setTableData(data, param)
    }
    showModal = () => {}
    onClose = () => {
        const { onClose } = this.props
        onClose()
    }

    componentDidMount() {
        this.getColumnList()
    }

    getColumnList = async (params = {}) => {
        const { current } = this.state
        const { data } = this.props
        let query = {
            ...params.filterSelectedList,
            page: current,
            pageSize: 10,
            //clusterId: data.id,
            groupId: data.groupId,
        }
        this.setState({ loading: true })
        let res = await clusterColumn(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
                total: res.total,
            })
        }
    }

    render() {
        const { loading, tableData, total, current } = this.state
        const { visible } = this.props

        return (
            <DrawerLayout
                drawerProps={{
                    title: '包含字段',
                    width: 960,
                    onClose: this.onClose,
                    visible,
                }}
                renderFooter={() => {
                    return (
                        <Pagination
                            total={total}
                            current={current}
                            onChange={(page) => {
                                this.setState({ current: page }, () => {
                                    this.getColumnList()
                                })
                            }}
                            showTotal={(total, range) => {
                                const totalPageNum = Math.ceil(total / 10)
                                return (
                                    <span>
                                        总数 <b>{ProjectUtil.formNumber(total)}</b> 条
                                    </span>
                                )
                            }}
                        />
                    )
                }}
            >
                {visible ? (
                    <div>
                        <div className='FormPart MiniForm Grid3' style={{ marginBottom: 15, marginTop: 0 }}>
                            <FormItem label='簇id'>{this.props.data.code}</FormItem>
                            <FormItem label='簇中文名'>{this.props.data.chineseName}</FormItem>
                            <FormItem label='簇英文名'>{this.props.data.englishName}</FormItem>
                        </div>
                        <Table loading={loading} columns={this.columns} dataSource={tableData} pagination={false} />
                    </div>
                ) : null}
            </DrawerLayout>
        )
    }
}
