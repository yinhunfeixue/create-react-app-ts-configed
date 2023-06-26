import DrawerLayout from '@/component/layout/DrawerLayout'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import RenderUtil from '@/utils/RenderUtil'
import { Collapse, Form, message, Spin } from 'antd'
import { getDGDLJobLog } from 'app_api/autoManage'
import React, { Component } from 'react'
import '../index.less'

const { Panel } = Collapse
export default class LogDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            detailInfo: {
                logMessage: [],
            },
            status: 2,
            loading: false,
        }
    }

    openModal = (data) => {
        this.setState({
            modalVisible: true,
            status: data.status,
        })
        this.getLogList(data.id)
    }
    getLogList = async (value) => {
        this.setState({ loading: true })
        let res = await getDGDLJobLog({ jobId: value })
        this.setState({ loading: false })
        if (res.code == 200) {
            res.data.logMessage = res.data.logMessage ? res.data.logMessage : []
            this.setState({
                detailInfo: res.data,
            })
        }
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    render() {
        const { modalVisible, loading, detailInfo, status } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    title: '日志详情',
                    className: 'logDrawer',
                    width: 640,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: true,
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <Spin spinning={loading}>
                            <Collapse className='DetailPart detailCollapse' bordered={false} defaultActiveKey={['1']}>
                                <Panel header='汇总信息' key='1'>
                                    <Form className='MiniForm DetailPart FormPart' layout='inline'>
                                        {RenderUtil.renderFormItems([
                                            {
                                                label: '上传状态',
                                                content: (
                                                    <div>
                                                        {status == 2 ? <StatusLabel type='success' message='上传成功' /> : null}
                                                        {status == 3 ? <StatusLabel type='error' message='上传失败' /> : null}
                                                    </div>
                                                ),
                                            },
                                            {
                                                label: '对应系统',
                                                content: detailInfo.sys,
                                            },
                                            {
                                                label: '表数量',
                                                content: detailInfo.tableCount,
                                            },
                                            {
                                                label: '字段数量',
                                                content: detailInfo.columnCount,
                                            },
                                            {
                                                label: '字段标准映射关系',
                                                content: detailInfo.stdCount,
                                            },
                                            {
                                                label: '质量检核技术规则',
                                                content: detailInfo.qltyCount,
                                            },
                                            {
                                                label: '敏感数据',
                                                content: detailInfo.senCount,
                                            },
                                            {
                                                label: '分类',
                                                content: detailInfo.clzCount,
                                            },
                                            {
                                                label: '安全等级',
                                                content: detailInfo.lvlCount,
                                            },
                                            // {
                                            //     label: '安全等级',
                                            //     content: detailInfo.securityLevel ? <Tag color={detailInfo.securityLevel == 1 ? 'blue' : (detailInfo.securityLevel == 2 ? 'geekblue' : (detailInfo.securityLevel == 3 ? 'purple' : (detailInfo.securityLevel == 4 ? 'orange' : 'red')))}>
                                            //         {detailInfo.securityLevelName}
                                            //     </Tag> : '',
                                            // },
                                        ])}
                                    </Form>
                                </Panel>
                            </Collapse>
                            <div className='logArea'>
                                {detailInfo.logMessage.map((item) => {
                                    return (
                                        <div className='logItem'>
                                            <div className='logContent'>
                                                {item.time}
                                                <span style={{ marginLeft: 16 }}>
                                                    [{item.logLvl}]{item.message}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </Spin>
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}
