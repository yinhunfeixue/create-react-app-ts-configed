// 新检核任务
import EmptyLabel from '@/component/EmptyLabel'
import TableLayout from '@/component/layout/TableLayout'
import { Button, Empty, Input, message, Modal, Select, Switch, Pagination, Menu, Dropdown, Spin, Row, Col } from 'antd'
import { taskGroupList, deleteTaskGroup, changeTaskGroupStatus } from 'app_api/examinationApi'
import { getTaskJobList, postChangeTaskJobStatus, postDeleteTaskJob, postRunTaskJob } from 'app_api/metadataApi'
import { requestUserList } from '@/api/systemApi'
import EmptyIcon from '@/component/EmptyIcon'
import Cache from 'app_utils/cache'
import ProjectUtil from '@/utils/ProjectUtil'
import { Tooltip } from 'lz_antd'
import moment from 'moment'
import React, { Component } from 'react'
import _ from 'underscore'
import './index.less'
import AddTaskDrawer from './component/addTaskDrawer'
import PermissionWrap from '@/component/PermissionWrap'
import PermissionManage from '@/utils/PermissionManage'

const { Option } = Select
export default class CheckTask extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                page: 1,
                pageSize: 12,
                groupName: '',
            },
            isSearch: false,
            userList: [],
            tableData: [],
            total: 0,
            loading: false,
        }
    }
    componentWillMount = () => {
        this.getTableList()
        this.getUserData()
    }
    getUserData = async () => {
        let res = await requestUserList({ needAll: true })
        if (res.code == 200) {
            this.setState({
                userList: res.data,
            })
        }
    }
    changeStatusSwitch = async (data, index) => {
        let { tableData } = this.state
        let query = {
            taskGroupId: data.taskGroupId,
            status: data.status == 1 ? 0 : 1,
        }
        let res = await changeTaskGroupStatus(query)
        if (res.code == 200) {
            message.success(query.status == 1 ? '任务激活成功' : '任务挂起成功')
            tableData[index].status = query.status
            tableData[index].statusDesc = query.status == 1 ? '激活' : '挂起'
            this.setState({
                tableData,
            })
        }
    }
    openDetailPage = async (data) => {
        this.props.addTab('检核任务详情', { ...data }, true)
    }
    getTableList = async () => {
        let { queryInfo } = this.state
        let query = {
            ...queryInfo,
        }
        this.setState({ loading: true })
        let res = await taskGroupList(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
                total: res.total,
            })
        }
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            page: 1,
            pageSize: 12,
            groupName: '',
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
            isSearch: true,
        })
        this.search()
    }
    changeKeyword = (e) => {
        let { queryInfo } = this.state
        queryInfo.groupName = e.target.value
        this.setState({
            queryInfo,
            isSearch: true,
        })
    }
    search = async () => {
        let { queryInfo } = this.state
        queryInfo.page = 1
        await this.setState({
            queryInfo,
        })
        this.getTableList()
    }
    deleteData = (data) => {
        let that = this
        Modal.confirm({
            title: '删除任务',
            content: '删除任务，同时删除该任务下所有检核信息，确定删除吗？',
            okText: '删除',
            okButtonProps: {
                danger: true,
            },
            cancelText: '取消',
            async onOk() {
                let res = await deleteTaskGroup({ id: data.taskGroupId })
                if (res.code == 200) {
                    message.success('操作成功')
                    that.search()
                }
            },
        })
    }
    openAddPage = (data, type) => {
        this.addTaskDrawer && this.addTaskDrawer.openModal(data, type)
    }
    onShowSizeChange = async (current, pageSize) => {
        const { queryInfo } = this.state
        queryInfo.page = 1
        queryInfo.pageSize = pageSize
        await this.setState({
            queryInfo,
        })
        this.getTableList()
    }
    changePage = async (page) => {
        const { queryInfo } = this.state
        queryInfo.page = page
        await this.setState({
            queryInfo,
        })
        this.getTableList()
    }
    onClickMenu = (data, e) => {
        if (e.key == 1) {
            this.openDetailPage(data)
        } else if (e.key == 2) {
            this.openAddPage(data, 'edit')
        } else if (e.key == 3) {
            this.deleteData(data)
        }
    }
    render() {
        const { queryInfo, tableData, total, loading, userList, isSearch } = this.state
        const menu = (data) => (
            <Menu style={{ width: 132 }} onClick={this.onClickMenu.bind(this, data)}>
                <Menu.Item key='1'>详情</Menu.Item>
                {PermissionManage.hasFuncPermission('/dqm/task/manage/edit') && <Menu.Item key='2'>编辑</Menu.Item>}
                {PermissionManage.hasFuncPermission('/dqm/task/manage/delete') && (
                    <Menu.Item key='3'>
                        <span style={{ color: '#CC0000' }}>删除</span>
                    </Menu.Item>
                )}
            </Menu>
        )
        return (
            <React.Fragment>
                <div className='checkTask'>
                    <TableLayout
                        title='检核任务'
                        disabledDefaultFooter
                        renderHeaderExtra={() => {
                            return (
                                <PermissionWrap funcCode='/md/compare/manage/add'>
                                    <Button type='primary' onClick={this.openAddPage.bind(this, {}, 'add')}>
                                        新增任务
                                    </Button>
                                </PermissionWrap>
                            )
                        }}
                        renderDetail={() => {
                            return (
                                <React.Fragment>
                                    {total || isSearch ? (
                                        <div>
                                            <div className='searchGroup'>
                                                <Input.Search
                                                    allowClear
                                                    style={{ width: 280, marginRight: 8 }}
                                                    value={queryInfo.groupName}
                                                    onChange={this.changeKeyword}
                                                    onSearch={this.search}
                                                    placeholder='请输入任务名称'
                                                />
                                                <Select
                                                    allowClear
                                                    onChange={this.changeStatus.bind(this, 'taskType')}
                                                    value={queryInfo.taskType}
                                                    placeholder='任务类型'
                                                    style={{ width: 160, marginRight: 8 }}
                                                >
                                                    <Option value={1} key={1}>
                                                        常规任务
                                                    </Option>
                                                    <Option value={2} key={2}>
                                                        质量提升
                                                    </Option>
                                                </Select>
                                                <Select
                                                    allowClear
                                                    showSearch
                                                    optionFilterProp='title'
                                                    placeholder='负责人'
                                                    value={queryInfo.managerId}
                                                    onChange={this.changeStatus.bind(this, 'managerId')}
                                                    style={{ width: 160, marginRight: 8 }}
                                                >
                                                    {userList &&
                                                        userList.map((item) => {
                                                            return (
                                                                <Select.Option title={item.name + item.account} key={item.id} value={item.id}>
                                                                    {item.name}（{item.account}）
                                                                </Select.Option>
                                                            )
                                                        })}
                                                </Select>
                                                <Button onClick={this.reset}>重置</Button>
                                            </div>
                                            <Spin spinning={loading}>
                                                {total ? (
                                                    <Row className='taskArea' gutter={[16, 16]}>
                                                        {tableData.map((item, index) => {
                                                            return (
                                                                <Col span={6}>
                                                                    <div className='taskItem' onClick={this.openDetailPage.bind(this, item)}>
                                                                        <div style={{ display: 'flex' }}>
                                                                            <div className='taskName'>{item.name}</div>
                                                                            <PermissionWrap funcCode='/dqm/task/manage/switch'>
                                                                                <span onClick={(e) => e.stopPropagation()}>
                                                                                    <Switch size='small' onChange={this.changeStatusSwitch.bind(this, item, index)} checked={item.status == 1} />
                                                                                </span>
                                                                            </PermissionWrap>
                                                                        </div>
                                                                        <div>
                                                                            <div className={item.taskType == 1 ? 'normalType taskType' : 'taskType'}>
                                                                                {item.taskType == 1 ? '常规任务' : '质量提升'}
                                                                            </div>
                                                                            <div className='taskInfo'>
                                                                                检核表数：<span className='number'>{item.tableCount || 0}</span>
                                                                            </div>
                                                                            <div className='taskInfo'>执行时间：{ProjectUtil.formDate(item.lastCheckTime) || <EmptyLabel />}</div>
                                                                        </div>
                                                                        <div className='taskFooter'>
                                                                            <div className='taskInfo'>
                                                                                负责人：{item.managerName || <EmptyLabel />}
                                                                                <span onClick={(e) => e.stopPropagation()}>
                                                                                    <Dropdown trigger='click' overlay={menu(item)} placement='bottomLeft' overlayClassName='categoryMenuDropdown'>
                                                                                        <span className='iconfont icon-more'></span>
                                                                                    </Dropdown>
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </Col>
                                                            )
                                                        })}
                                                    </Row>
                                                ) : (
                                                    <div style={{ marginTop: 100 }}>
                                                        <EmptyIcon description='暂无搜索数据' />
                                                    </div>
                                                )}
                                            </Spin>
                                            {total > queryInfo.pageSize ? (
                                                <Pagination
                                                    style={{ marginTop: 16 }}
                                                    pageSize={queryInfo.pageSize}
                                                    current={queryInfo.page}
                                                    total={total}
                                                    showSizeChanger
                                                    showQuickJumper
                                                    showTotal={(total) => (
                                                        <span>
                                                            总数 <b>{ProjectUtil.formNumber(total)}</b> 条
                                                        </span>
                                                    )}
                                                    onChange={this.changePage}
                                                    onShowSizeChange={this.onShowSizeChange}
                                                    pageSizeOptions={[12, 24, 48, 96]}
                                                />
                                            ) : null}
                                        </div>
                                    ) : (
                                        <Spin spinning={loading}>
                                            <Empty
                                                style={{ padding: '80px 0 80px 0', background: '#fff' }}
                                                image={<img src={require('app_images/dataCompare/empty_icon.png')} />}
                                                description={<span style={{ fontFamily: 'PingFangSC-Medium, PingFang SC', fontWeight: '500' }}>暂无数据</span>}
                                                imageStyle={{
                                                    height: 120,
                                                }}
                                            >
                                                <div style={{ color: '#5E6266' }}>
                                                    方便数据有效管理，你可以 <a onClick={this.openAddPage.bind(this, {}, 'add')}>添加任务</a>
                                                </div>
                                            </Empty>
                                        </Spin>
                                    )}
                                </React.Fragment>
                            )
                        }}
                    />
                    <AddTaskDrawer {...this.props} search={this.search} ref={(dom) => (this.addTaskDrawer = dom)} />
                </div>
            </React.Fragment>
        )
    }
}
