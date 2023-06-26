import EmptyLabel from '@/component/EmptyLabel'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { Button, Input, Icon, Form, Tag, Tooltip, Radio, Table, Select, message } from 'antd'
import React, { Component } from 'react'
import '../index.less'
import RenderUtil from '@/utils/RenderUtil'
import DrawerLayout from '@/component/layout/DrawerLayout'
import ModuleTitle from '@/component/module/ModuleTitle'
import { subsUserList, saveSubsUserList } from 'app_api/autoManage'
import { departments } from 'app_api/manageApi'

export default class AddUserDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            detailInfo: {
                subStatus: true,
                triggerTime: '08:00',
                pushTypes: [0, 1],
            },
            tableData: [{ id: 1 }],
            baseList: [],
            queryInfo: {
                keyword: '',
            },
            showFilterTable: false,
            filterNumber: 2,
            loading: false,
            departmentList: [],
        }
        this.selectedKeys = []
        this.columns = [
            {
                title: '账号',
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
                title: '姓名',
                dataIndex: 'realName',
                key: 'realName',
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
                title: '部门',
                dataIndex: 'deptNameAll',
                key: 'deptNameAll',
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
        let { detailInfo } = this.state
        detailInfo.datasourceId = data.id
        detailInfo.datasourceName = data.name
        this.setState({
            modalVisible: true,
            detailInfo,
        })
        this.getFilter()
    }
    getFilter = async () => {
        let res = await departments({ page_size: 100000 })
        if (res.code == 200) {
            this.setState({
                departmentList: res.data,
            })
        }
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    getTableList = async (params = {}) => {
        let { queryInfo, detailInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            datasourceId: detailInfo.datasourceId,
        }
        let res = await subsUserList(query)
        if (res.code == 200) {
            // res.data.map((item) => {
            //     if (item.subscribed && !this.selectedKeys.includes(item.userId)) {
            //         this.selectedKeys.push(item.userId)
            //     }
            // })
            // this.selectController.updateSelectedKeys(this.selectedKeys)
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
    changeStatus = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo,
        })
        this.search()
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
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    postData = async () => {
        if (!this.selectedKeys.length) {
            message.info('请选择订阅人员')
            return
        }
        let { detailInfo } = this.state
        detailInfo.userIds = this.selectedKeys
        this.setState({ loading: true })
        let res = await saveSubsUserList(detailInfo)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel()
            this.props.search()
            this.props.getFilter()
        }
    }
    render() {
        const { modalVisible, detailInfo, tableData, loading, queryInfo, departmentList } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'addUserDrawer',
                    title: '添加订阅人员',
                    width: 640,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: false,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button loading={loading} onClick={this.postData} type='primary'>
                                确定
                            </Button>
                            <Button onClick={this.cancel}>取消</Button>
                        </React.Fragment>
                    )
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <ModuleTitle style={{ marginBottom: 15 }} title='订阅信息' />
                        <Form className='MiniForm Grid3'>
                            {RenderUtil.renderFormItems([
                                { label: '订阅数据源', content: detailInfo.datasourceName },
                                { label: '接收方式（默认）', content: '邮箱、短信' },
                                { label: '接收时间（默认）', content: '每日的 08:00' },
                            ])}
                        </Form>
                        <ModuleTitle style={{ margin: '32px 0 15px 0' }} title='添加订阅人员' />
                        {detailInfo.datasourceId ? (
                            <RichTableLayout
                                disabledDefaultFooter
                                editColumnProps={{
                                    hidden: true,
                                }}
                                tableProps={{
                                    columns: this.columns,
                                    key: 'userId',
                                    selectedEnable: true,
                                    getCheckboxProps: (record) => ({
                                        disabled: record.subscribed,
                                    }),
                                    extraTableProps: { scroll: undefined },
                                }}
                                renderSearch={(controller) => {
                                    this.controller = controller
                                    return (
                                        <React.Fragment>
                                            <Input.Search value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入账号／姓名' />
                                            <Select allowClear showSearch optionFilterProp='title' onChange={this.changeStatus.bind(this, 'deptId')} value={queryInfo.deptId} placeholder='部门'>
                                                {departmentList.map((item) => {
                                                    return (
                                                        <Select.Option title={item.departName} key={item.id} value={item.id}>
                                                            {item.departName}
                                                        </Select.Option>
                                                    )
                                                })}
                                            </Select>
                                            <Button onClick={this.reset}>重置</Button>
                                        </React.Fragment>
                                    )
                                }}
                                requestListFunction={(page, pageSize, filter, sorter) => {
                                    return this.getTableList({
                                        pagination: {
                                            page,
                                            page_size: pageSize,
                                        },
                                    })
                                }}
                                renderFooter={(controller, defaultRender) => {
                                    let { selectedRows, selectedKeys } = controller
                                    this.selectedKeys = selectedKeys
                                    console.log(this.selectedKeys, 'selectedKeys')
                                    this.selectController = controller
                                }}
                            />
                        ) : null}
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}
