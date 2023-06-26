// 系统订阅管理
import EmptyLabel from '@/component/EmptyLabel'
import RichTableLayout from '@/component/layout/RichTableLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import RenderUtil from '@/utils/RenderUtil'
import { Form } from '@ant-design/compatible'
import { Button, Checkbox, Input, message, Popover, Select, Switch, TimePicker } from 'antd'
import { pushTypes, saveSubscribe, subscribe } from 'app_api/autoManage'
import { Tooltip } from 'lz_antd'
import moment from 'moment'
import React, { Component } from 'react'
import PermissionWrap from '@/component/PermissionWrap'
import './index.less'

const { Option } = Select

export default class ManageFilter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                keyword: '',
            },
            tableData: [],
            typeList: [],
            detailInfo: {
                pushTypes: [],
                triggerTime: '08:00',
            },
            loading: false,
        }
        this.columns = [
            {
                title: '数据源',
                dataIndex: 'datasourceName',
                key: 'datasourceName',
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
                    text !== undefined && record.subStatus ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '接收时间',
                dataIndex: 'triggerTime',
                key: 'triggerTime',
                render: (text, record) =>
                    text !== undefined && record.subStatus ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '订阅状态',
                dataIndex: 'subStatus',
                key: 'subStatus',
                render: (text, record) => (text !== undefined ? <div>{text ? <StatusLabel type='success' message='订阅' /> : <StatusLabel type='uncheck' message='未订阅' />}</div> : <EmptyLabel />),
            },
            {
                title: '是否订阅',
                dataIndex: 'subStatus',
                key: 'subStatus',
                ellipsis: false,
                render: (text, record, index) => {
                    return (
                        <Popover
                            visible={record.popVisible}
                            content={record.popVisible ? this.renderPopContent(index) : null}
                            title='订阅设置'
                            getPopupContainer={() => document.getElementById('dropdownContainer') || document.body}
                            arrowPointAtCenter
                            placement='leftTop'
                        >
                            <PermissionWrap funcCode='/md/changes/subscribe/manage/switch'>
                                <Switch onChange={this.changePopVisible.bind(this, index)} checked={text} />
                            </PermissionWrap>
                        </Popover>
                    )
                },
            },
        ]
    }
    componentWillMount = () => {
        this.getPushTypes()
    }
    renderPopContent = (index) => {
        let { detailInfo, typeList, loading } = this.state
        return (
            <div style={{ width: 300 }}>
                <Form className='EditMiniForm postForm Grid1' style={{ columnGap: 8 }}>
                    {RenderUtil.renderFormItems([
                        {
                            label: '接收方式',
                            content: (
                                <Checkbox.Group value={detailInfo.pushTypes} onChange={this.changeSwitch.bind(this, 'pushTypes')}>
                                    {typeList.map((item) => {
                                        return <Checkbox value={item.id}>{item.name}</Checkbox>
                                    })}
                                </Checkbox.Group>
                            ),
                        },
                        {
                            label: '接收时间',
                            content: (
                                <div>
                                    <span style={{ color: '#5E6266', marginRight: 16 }}>每日的</span>
                                    <TimePicker
                                        allowClear={false}
                                        format='HH:mm'
                                        defaultValue={moment(detailInfo.triggerTime, 'HH:mm')}
                                        placeholder='请选择时间'
                                        onChange={this.changeSwitch.bind(this, 'triggerTime')}
                                    />
                                </div>
                            ),
                        },
                    ])}
                </Form>
                {detailInfo.triggerTime ? (
                    <div style={{ color: '#5E6266', marginTop: 24 }}>
                        {'说明：系统会在每天' + detailInfo.triggerTime + '发送前一日' + detailInfo.triggerTime + ' ~ 当天' + detailInfo.triggerTime + '前所有您订阅的数据源的变更信息。'}
                    </div>
                ) : null}
                <div style={{ textAlign: 'right', marginTop: 24 }}>
                    <Button style={{ marginRight: 8 }} size='small' onClick={this.cancel.bind(this, index)}>
                        取消
                    </Button>
                    <Button disabled={!detailInfo.pushTypes.length} size='small' type='primary' loading={loading} onClick={this.postData.bind(this, index)}>
                        开启
                    </Button>
                </div>
            </div>
        )
    }
    changePopVisible = async (index) => {
        let { tableData, detailInfo } = this.state
        if (tableData[index].subStatus) {
            let query = {
                ...tableData[index],
                subStatus: false,
            }
            let res = await saveSubscribe(query)
            if (res.code == 200) {
                message.success('操作成功')
                this.search()
            }
        } else {
            tableData.map((item) => {
                item.popVisible = false
            })
            tableData[index].popVisible = true
            tableData[index].pushTypes = tableData[index].pushTypes ? tableData[index].pushTypes : []
            tableData[index].triggerTime = tableData[index].triggerTime ? tableData[index].triggerTime : '08:00'
            for (let k in tableData[index]) {
                detailInfo[k] = tableData[index][k]
            }
            this.setState({
                tableData,
                detailInfo,
            })
        }
    }
    cancel = (index) => {
        let { tableData } = this.state
        tableData[index].popVisible = false
        this.setState({
            tableData,
        })
    }
    postData = async (index) => {
        let { detailInfo } = this.state
        detailInfo.subStatus = true
        this.setState({ loading: true })
        let res = await saveSubscribe(detailInfo)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel(index)
            this.search()
        }
    }
    changeSwitch = (name, e) => {
        console.log(e, 'changeSwitch')
        let { detailInfo } = this.state
        detailInfo[name] = name == 'triggerTime' ? moment(e).format('HH:mm') : e
        this.setState({
            detailInfo,
        })
    }
    getTableList = async (params = {}) => {
        let { queryInfo } = this.state
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
        }
        let res = await subscribe(query)
        if (res.code == 200) {
            res.data.map((item) => {
                item.popVisible = false
                item.pushTypes = item.pushTypes ? item.pushTypes : []
                item.pushTypesDesc = ''
                item.pushTypes.map((node, index) => {
                    item.pushTypesDesc += this.getPushTypesDesc(node) + (index + 1 == item.pushTypes.length ? '' : '、')
                })
            })
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
    getPushTypesDesc = (value) => {
        let { typeList } = this.state
        for (let i = 0; i < typeList.length; i++) {
            if (typeList[i].id == value) {
                return typeList[i].name
            }
        }
    }
    getPushTypes = async () => {
        let res = await pushTypes()
        if (res.code == 200) {
            this.setState({
                typeList: res.data,
            })
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
    render() {
        const { queryInfo, tableData } = this.state
        return (
            <React.Fragment>
                <div className='manageFilter'>
                    <RichTableLayout
                        title='订阅管理'
                        editColumnProps={{
                            hidden: true,
                        }}
                        tableProps={{
                            columns: this.columns,
                            key: 'id',
                            dataSource: tableData,
                            extraTableProps: {
                                scroll: { x: 'auto' },
                            },
                        }}
                        renderSearch={(controller) => {
                            this.controller = controller
                            return (
                                <React.Fragment>
                                    <Input.Search allowClear style={{ width: 380 }} value={queryInfo.keyword} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入数据源名称' />
                                    <Select allowClear onChange={this.changeStatus.bind(this, 'subStatus')} value={queryInfo.subStatus} placeholder='订阅状态'>
                                        <Select.Option key={1} value={true}>
                                            订阅
                                        </Select.Option>
                                        <Select.Option key={0} value={false}>
                                            未订阅
                                        </Select.Option>
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
                    />
                </div>
            </React.Fragment>
        )
    }
}
