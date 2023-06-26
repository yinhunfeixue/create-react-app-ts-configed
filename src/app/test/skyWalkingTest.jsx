import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { systemmenuList, systemmenuDivide } from 'app_api/metadataApi'
import { message } from 'antd'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'

export default class SkyWalkingTest extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableData: [],
        }
        this.columns = [
            {
                dataIndex: 'fileId',
                key: 'fileId',
                title: '序号',
                width: 80,
                render: (text, record, index) => index + 1,
            },
            {
                title: '应用名',
                dataIndex: 'app',
                key: 'app',
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
                title: '菜单名',
                dataIndex: 'menu',
                key: 'menu',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '菜单路径',
                dataIndex: 'menuPath',
                key: 'menuPath',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
    }
    componentWillMount = () => {}
    getTableList = async (params = {}) => {
        let res = await systemmenuList()
        if (res.code == 200) {
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
    start = async (data) => {
        let res = await systemmenuDivide({ menuId: data.id, flag: 'start' })
        if (res.code == 200) {
            message.success(res.msg)
            this.search()
        }
    }
    stop = async (data) => {
        let res = await systemmenuDivide({ menuId: data.id, flag: 'end' })
        if (res.code == 200) {
            message.success(res.msg)
            this.search()
        }
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    render() {
        return (
            <React.Fragment>
                <RichTableLayout
                    title='系统菜单'
                    editColumnProps={{
                        width: 120,
                        createEditColumnElements: (_, record) => {
                            return [
                                <a onClick={this.start.bind(this, record)} key='edit'>
                                    发送
                                </a>,
                                <a onClick={this.stop.bind(this, record)} key='delete'>
                                    停止
                                </a>,
                            ]
                        },
                    }}
                    renderSearch={(controller) => {
                        this.controller = controller
                    }}
                    tableProps={{
                        columns: this.columns,
                        key: 'id',
                    }}
                    requestListFunction={(page, pageSize, filter, sorter) => {
                        return this.getTableList({
                            pagination: {
                                page,
                                page_size: pageSize,
                            },
                        })
                    }}
                />
            </React.Fragment>
        )
    }
}
