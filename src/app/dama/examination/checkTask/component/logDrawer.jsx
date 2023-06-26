// 错误记录
import DrawerLayout from '@/component/layout/DrawerLayout'
import LogItem from '@/component/logItem/LogItem'
import { Icon as LegacyIcon } from '@ant-design/compatible'
import { Alert, Pagination, Spin } from 'antd'
import { getTaskLogList } from 'app_api/metadataApi'
import moment from 'moment'
import React, { Component } from 'react'
import '../../index.less'

const lastStatusMap = {
    0: '新创建',
    1: '等待执行',
    2: '正在执行',
    3: '执行成功',
    4: '执行失败',
    5: '系统中止',
}
export default class LogDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            logList: [],
            logDetail: {},
            logInfo: {
                pageNo: 1,
                pageSize: 20,
            },
            totalLog: 0,
            loading: false,
        }
        this.errorColumn = []
    }
    openModal = async (data) => {
        let { logInfo } = this.state
        logInfo.pageNo = 1
        logInfo.taskId = data.tsTaskId
        await this.setState({
            modalVisible: true,
            logInfo,
            logDetail: data,
        })
        this.getLogList()
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    getLogList = async () => {
        let { logInfo } = this.state
        this.setState({ loading: true })
        let res = await getTaskLogList(logInfo)
        this.setState({ loading: false })
        if (res.code == 200) {
            this.setState({
                totalLog: res.total,
                logList: res.data,
            })
        }
    }
    changeLogPage = async (page, pageSize) => {
        let { logInfo } = this.state
        logInfo.pageNo = page
        logInfo.pageSize = pageSize
        await this.setState({
            logInfo,
        })
        this.getLogList()
    }
    getStatusLabel = (value) => {
        for (let k in lastStatusMap) {
            if (k == value) {
                return lastStatusMap[k]
            }
        }
        return '-'
    }
    render() {
        const { totalLog, modalVisible, logList, logInfo, logDetail, loading } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'logDrawer',
                    title: '日志详情',
                    width: 640,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: true,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Pagination
                                // showSizeChanger={true}
                                showQuickJumper={true}
                                onChange={this.changeLogPage}
                                showTotal={(total) => `总数 ${total} 条`}
                                current={logInfo.pageNo}
                                pageSize={logInfo.pageSize}
                                total={totalLog}
                            />
                        </React.Fragment>
                    )
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <div>
                            <Alert
                                message={this.getStatusLabel(logDetail.status)}
                                description={
                                    logDetail.status == 3 || logDetail.status == 4
                                        ? '执行时间：' +
                                          moment(logDetail.startTime).format('YYYY-MM-DD HH:mm:ss') +
                                          ' 至 ' +
                                          moment(logDetail.finishTime).format('YYYY-MM-DD HH:mm:ss') +
                                          '，耗时 ' +
                                          parseFloat((parseInt(logDetail.useTime) / 1000).toFixed(3)) +
                                          's'
                                        : ''
                                }
                                type={logDetail.status == 3 ? 'success' : logDetail.status == 4 ? 'error' : 'warning'}
                                showIcon
                                icon={
                                    <LegacyIcon
                                        type={logDetail.status == 3 ? 'check-circle' : 'info-circle'}
                                        theme='filled'
                                        style={{ color: logDetail.status == 3 ? '#339933' : logDetail.status == 4 ? '#CC0000' : '#faad14', width: 14, marginRight: 8 }}
                                    />
                                }
                            />
                            <div className='logArea'>
                                <Spin spinning={loading}>
                                    {logList.map((item, index) => {
                                        return <LogItem key={index} time={moment(item.time).format('YYYY-MM-DD HH:mm:ss')} type={item.level} des={item.description} />
                                        // return (
                                        //     <div className='logItem'>
                                        //         <div className='logTime'>{moment(item.time).format('YYYY-MM-DD HH:mm:ss')}</div>
                                        //         <div className='logContent'>{item.description}</div>
                                        //     </div>
                                        // )
                                    })}
                                </Spin>
                            </div>
                        </div>
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}
