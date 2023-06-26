// 任务展示栏
import EmptyLabel from '@/component/EmptyLabel'
import { Spin, Drawer, Row, Col } from 'antd'
import { bizTypeList, taskGroupList } from 'app_api/examinationApi'
import { getTaskJobList } from 'app_api/metadataApi'
import EmptyIcon from '@/component/EmptyIcon'
import { Tooltip } from 'lz_antd'
import moment from 'moment'
import ProjectUtil from '@/utils/ProjectUtil'
import SvgIcon from 'app_component_main/SvgIcon/index.tsx';
import React, { Component } from 'react'
import '../index.less'
import { observer } from 'mobx-react'
import store from '../store'

@observer
export default class TaskDisplayDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                page: 1,
                pageSize: 999999,
            },
            tableData: [],
            loading: false,
        }
    }
    componentWillMount = () => {
        this.getTableList()
    }
    cancel = () => {
        store.changeTaskDisplayModal(false)
    }
    onSelect = async (data) => {
        await store.onSelectTask(data)
        await store.onSelectedTable({})
        this.cancel()
        await store.changeTab('1')
        this.props.refresh()
    }
    getTableList = async () => {
        let { queryInfo } = this.state
        let query = {
            ...queryInfo,
        }
        this.setState({loading: true})
        let res = await taskGroupList(query)
        this.setState({loading: false})
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
            })
        }
    }
    render() {
        const { tableData, loading } = this.state
        const { selectedTaskInfo, taskDisplayModal } = store
        return (
            <React.Fragment>
                <Drawer
                    className='taskDisplayDrawer'
                    style={{ top: taskDisplayModal ? '53px' : '0px'}}
                    placement='top'
                    closable={false}
                    onClose={this.cancel}
                    visible={taskDisplayModal}
                >
                    <div className='checkTask'>
                        <Spin spinning={loading}>
                            {
                                tableData.length ?
                                    <Row className='taskArea' gutter={[16, 16]}>
                                        {
                                            tableData.map((item, index) => {
                                                return (
                                                    <Col span={6}>
                                                        <div onClick={this.onSelect.bind(this, item)} className={selectedTaskInfo.taskGroupId == item.taskGroupId ? 'taskItem taskItemSelected' : 'taskItem'}>
                                                            <div style={{ display: 'flex' }}>
                                                                <Tooltip placement="topLeft" title={item.name}><div className='taskName'>{item.name}</div></Tooltip>
                                                                {
                                                                    selectedTaskInfo.taskGroupId == item.taskGroupId ? <SvgIcon name="icon_tag_top" /> : null
                                                                }
                                                            </div>
                                                            <div>
                                                                <div className={item.taskType == 1 ? 'normalType taskType' : 'taskType'}>{item.taskType == 1 ? '常规任务' : '质量提升'}</div>
                                                                <div className='taskInfo'>检核表数：<span className='number'>{item.tableCount || 0}</span></div>
                                                                <div className='taskInfo'>执行时间：{ProjectUtil.formDate(item.lastCheckTime) || <EmptyLabel />}</div>
                                                            </div>
                                                            <div className='taskFooter'>
                                                                <div className='taskInfo'>
                                                                    负责人：{item.managerName || <EmptyLabel />}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                )
                                            })
                                        }
                                    </Row>
                                    :
                                    <EmptyIcon />
                            }
                        </Spin>
                    </div>
                </Drawer>
            </React.Fragment>
        )
    }
}
