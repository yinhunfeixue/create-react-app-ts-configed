// 执行任务自定义
import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RichTableLayout from '@/component/layout/RichTableLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import RenderUtil from '@/utils/RenderUtil'
import ModuleTitle from '@/component/module/ModuleTitle'
import { Alert, Button, Form, Input, message, Radio, Select, Tooltip, Cascader } from 'antd'
import { addDgdlGen } from 'app_api/autoManage'
import { requestUserList } from '@/api/systemApi'
import { postRunTaskJob, datasourceListForQuery } from 'app_api/metadataApi'
import { resultList, searchTables, queryCheckRangeList, queryTableSource, runJobNow } from 'app_api/examinationApi'
import React, { Component } from 'react'
import store from '../../store'
import { observer } from 'mobx-react'
import '../../index.less'
import moment from 'moment'

const { TextArea } = Input
const lastStatusMap = {
    // 0: '新创建',
    // 1: '等待执行',
    // 2: '正在执行',
    3: '执行成功',
    4: '执行失败',
    // 5: '系统中止',
}
@observer
export default class ExcuteTaskDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            addInfo: {
                tableIdList: [],
            },
            btnLoading: false,
            timeList: [],
            treeData: [],
            datasourceIds: [],
            queryInfo: {
                tableName: '',
            },
        }
        this.selectedKeys = []
        this.columns = [
            {
                title: '表名称',
                dataIndex: 'tableName',
                key: 'tableName',
                width: 150,
                render: (text, record) => (
                    <Tooltip placement='topLeft' title={text}>
                        <span className=' tableIcon iconfont icon-biaodanzujian-biaoge'></span>
                        {text}
                    </Tooltip>
                ),
            },
            {
                title: '路径',
                dataIndex: 'tablePath',
                key: 'tablePath',
                width: 210, // 数据源中文名 / 库英文名
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '检核时间',
                dataIndex: 'checkTime',
                key: 'checkTime',
                width: 180,
                sorter: true,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={moment(text).format('YYYY-MM-DD HH:mm:ss')}>
                            {moment(text).format('YYYY-MM-DD HH:mm:ss')}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '执行结果',
                dataIndex: 'status',
                key: 'status',
                width: 150,
                render: (text, record) => {
                    if (text == 0) {
                        return <StatusLabel type='info' message='新创建' />
                    } else if (text == 1) {
                        return <StatusLabel type='warning' message='等待执行' />
                    } else if (text == 2) {
                        return <StatusLabel type='loading' message='正在执行' />
                    } else if (text == 3) {
                        return <StatusLabel type='success' message='执行成功' />
                    } else if (text == 4) {
                        return <StatusLabel type='error' message='执行失败' />
                    } else if (text == 5) {
                        return <StatusLabel type='info' message='系统中止' />
                    } else {
                        return <EmptyLabel />
                    }
                },
            },
            {
                title: '规则通过率',
                dataIndex: 'passRate',
                key: 'passRate',
                width: 150,
                sorter: true,
                render: (text, record) => (text !== undefined ? <Tooltip title={text + '%'}>{text}%</Tooltip> : <EmptyLabel />),
            },
        ]
    }

    openModal = async (query) => {
        let { addInfo } = this.state
        addInfo = { ...query }
        await this.setState({
            modalVisible: true,
            addInfo,
        })
        this.selectController.updateSelectedKeys([])
        this.getTimeList()
        this.getSearchCondition()
    }
    getSearchCondition = async () => {
        const { selectedTaskInfo } = store
        console.log(selectedTaskInfo.name, 'getSearchCondition')
        let res = await queryTableSource({ taskGroupId: selectedTaskInfo.taskGroupId })
        if (res.code == 200) {
            this.setState({
                treeData: res.data,
            })
        }
    }
    getTimeList = async () => {
        const { selectedTaskInfo } = store
        let res = await queryCheckRangeList({ jobId: selectedTaskInfo.jobId })
        if (res.code == 200) {
            this.setState({
                timeList: res.data,
            })
        }
    }
    postData = async () => {
        let { addInfo } = this.state
        let { selectedTaskInfo } = store
        let query = {
            ...addInfo,
            tableIdList: this.selectedKeys,
        }
        if (selectedTaskInfo.taskType == 2 && !addInfo.checkRange) {
            message.info('请选择时间参数')
            return
        }
        if (!this.selectedKeys.length) {
            message.info('请选择表')
            return
        }
        this.setState({ btnLoading: true })
        let res = await runJobNow(query)
        this.setState({ btnLoading: false })
        if (res.code == 200) {
            message.info(res.msg ? res.msg : '检核中，请稍等...')
            this.cancel()
            this.props.refresh()
        }
    }
    changeDatasource = (e) => {
        let { addInfo } = this.state
        addInfo.checkRange = e
        this.setState({
            addInfo,
        })
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    getTableList = async (params = {}) => {
        let { queryInfo, datasourceIds, addInfo } = this.state
        const { selectedTaskInfo } = store
        let query = {
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            ...queryInfo,
            datasourceId: datasourceIds[0],
            databaseId: datasourceIds[1],
            taskGroupId: addInfo.taskGroupId,
            orderByCheckTime: params.sorter.field == 'checkTime' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
            orderByPassRate: params.sorter.field == 'passRate' ? (params.sorter.order == 'ascend' ? 1 : params.sorter.order == 'descend' ? 2 : undefined) : undefined,
        }
        let res = await searchTables(query)
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
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            tableName: '',
        }
        await this.setState({
            queryInfo,
            datasourceIds: [],
        })
        this.search()
    }
    changeStatus = async (name, e) => {
        let { queryInfo } = this.state
        if (name == 'datasourceIds') {
            await this.setState({
                datasourceIds: e,
            })
        } else {
            queryInfo[name] = e
            await this.setState({
                queryInfo,
            })
        }
        this.search()
    }
    changeKeyword = async (e) => {
        let { queryInfo } = this.state
        queryInfo.tableName = e.target.value
        await this.setState({
            queryInfo,
        })
        if (!e) {
            this.search()
        }
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    render() {
        const { modalVisible, addInfo, btnLoading, timeList, queryInfo, treeData, datasourceIds } = this.state
        const { selectedTaskInfo, taskDetail } = store
        return (
            <DrawerLayout
                drawerProps={{
                    title: '执行任务自定义',
                    className: 'excuteTaskDrawer',
                    width: 960,
                    visible: modalVisible,
                    onClose: this.cancel,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button loading={btnLoading} onClick={this.postData} type='primary'>
                                确定
                            </Button>
                            <Button disabled={btnLoading} onClick={this.cancel}>
                                取消
                            </Button>
                        </React.Fragment>
                    )
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        {selectedTaskInfo.taskType == 2 ? ( // 常规任务隐藏
                            <div style={{ marginBottom: 32 }}>
                                <ModuleTitle style={{ marginBottom: 15 }} title='检核范围' />
                                <Form className='MiniForm InlineForm' style={{ columnGap: 8 }}>
                                    {RenderUtil.renderFormItems([
                                        {
                                            label: '时间选择',
                                            content: (
                                                <Select style={{ width: 472 }} showSearch optionFilterProp='title' placeholder='请选择' value={addInfo.checkRange} onChange={this.changeDatasource}>
                                                    {timeList.map((item) => {
                                                        return (
                                                            <Select.Option title={item.checkRangeTimeView} key={item.checkRangeTimeView} value={item.checkRangeTimeView}>
                                                                {item.checkRangeTimeView}
                                                            </Select.Option>
                                                        )
                                                    })}
                                                </Select>
                                            ),
                                        },
                                    ])}
                                </Form>
                            </div>
                        ) : null}
                        <ModuleTitle
                            style={{ margin: '0px 0 15px 0' }}
                            title={
                                <div>
                                    表选择
                                    {selectedTaskInfo.taskType == 1 ? (
                                        <span style={{ marginLeft: 32, fontFamily: 'PingFangSC-Regular, PingFang SC', fontWeight: '400' }}>
                                            检核时间范围：{taskDetail.checkRangeTimeView || <EmptyLabel />}
                                        </span>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            }
                        />
                        <RichTableLayout
                            disabledDefaultFooter
                            editColumnProps={{
                                hidden: true,
                            }}
                            tableProps={{
                                columns: this.columns,
                                key: 'tableId',
                                selectedEnable: true,
                                extraTableProps: { scroll: undefined },
                            }}
                            renderSearch={(controller) => {
                                this.controller = controller
                                return (
                                    <React.Fragment>
                                        <Input.Search value={queryInfo.tableName} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入表名' />
                                        <Cascader
                                            allowClear
                                            changeOnSelect
                                            fieldNames={{ label: 'name', value: 'id' }}
                                            options={treeData}
                                            value={datasourceIds}
                                            onChange={this.changeStatus.bind(this, 'datasourceIds')}
                                            popupClassName='searchCascader'
                                            placeholder='路径选择'
                                            getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                        />
                                        <Select allowClear onChange={this.changeStatus.bind(this, 'status')} value={queryInfo.status} placeholder='执行结果'>
                                            {_.map(lastStatusMap, (node, index) => {
                                                return (
                                                    <Select.Option key={index} value={index}>
                                                        {node}
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
                                    sorter: sorter || {},
                                })
                            }}
                            renderFooter={(controller, defaultRender) => {
                                let { selectedRows, selectedKeys } = controller
                                this.selectedKeys = selectedKeys
                                this.selectController = controller
                                console.log(this.selectedKeys.length, 'this.selectedKeys.length+++')
                            }}
                        />
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}
