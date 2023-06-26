import EmptyLabel from '@/component/EmptyLabel'
import { Button, Input, Icon, Form, Tag, Tooltip, Radio, Table, Select, Popconfirm } from 'antd'
import React, { Component } from 'react'
import '../index.less'
import RenderUtil from '@/utils/RenderUtil'
import DrawerLayout from '@/component/layout/DrawerLayout'
import ModuleTitle from '@/component/module/ModuleTitle'
import { pushRecordUsers, pushTypes } from 'app_api/autoManage'

export default class SendRecordLogDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            detailInfo: {},
            tableData: [{id: 1}],
            baseList: [],
            queryInfo: {
                keyword: ''
            },
            showFilterTable: false,
            filterNumber: 2,
            typeList: []
        }
        this.columns = [
            {
                title: '序号',
                dataIndex: 'key',
                key: 'key',
                width: 80,
                render: (text, record, index) => <span>{index + 1}</span>,
            },
            {
                title: '用户名',
                dataIndex: 'userName',
                key: 'userName',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '接收方式',
                dataIndex: 'pushTypesDesc',
                key: 'pushTypesDesc',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '推送时间',
                dataIndex: 'pushTime',
                key: 'pushTime',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
    }
    openModal = async (data) => {
        await this.setState({
            modalVisible: true,
            detailInfo: data
        })
        this.getTableList()
        this.getPushTypes()
    }
    cancel = () => {
        this.setState({
            modalVisible: false
        })
    }
    getTableList = async () => {
        let { detailInfo } = this.state
        let res = await pushRecordUsers({hash: detailInfo.hash})
        if (res.code == 200) {
            res.data.map((item) => {
                item.pushTypes = item.pushTypes ? item.pushTypes : []
                item.pushTypesDesc = ''
                item.pushTypes.map((node, index) => {
                    item.pushTypesDesc += this.getPushTypesDesc(node) + (index + 1 == item.pushTypes.length ? '' : '、')
                })
            })
            this.setState({
                tableData: res.data
            })
        }
    }
    getPushTypesDesc = (value) => {
        let { typeList } = this.state
        for (let i=0;i<typeList.length;i++) {
            if (typeList[i].id == value) {
                return typeList[i].name
            }
        }
    }
    getPushTypes = async () => {
        let res = await pushTypes()
        if (res.code == 200) {
            this.setState({
                typeList: res.data
            })
        }
    }
    render() {
        const {
            modalVisible,
            detailInfo,
            tableData,
        } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'filterTableDetail',
                    title: '推送日志',
                    width: 640,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: true
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <ModuleTitle
                            style={{ marginBottom: 15 }}
                            title='基本信息'
                        />
                        <Form className='MiniForm DetailPart' layout='inline' style={{ background: 'none', padding: '0px' }}>
                            {RenderUtil.renderFormItems([
                                { label: '数据源名称', content: detailInfo.datasourceName },
                                { label: '变更日志', content: detailInfo.alterTime },
                            ])}
                        </Form>
                        <ModuleTitle
                            style={{ margin: '32px 0 15px 0' }}
                            title='推送列表'
                        />
                        <Table
                            rowKey='userId'
                            columns={this.columns}
                            dataSource={tableData}
                            pagination={false}
                        />
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}