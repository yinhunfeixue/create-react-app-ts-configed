// 备选词根查看
import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import ModuleTitle from '@/component/module/ModuleTitle'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import { Divider, Form, Spin, Table, Timeline, Tooltip } from 'antd'
import { auditRecordDetail } from 'app_api/dataModeling'
import React, { Component } from 'react'

export default class RootDetailDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            tableData: [],
            checkModalVisible:false,
            checkInfo: {
                correctRootInfo: {}
            },
            logList: ['1','2'],
            showCheckDetail: false,
            loading: false,
        }
        this.columns = [
            {
                title: '词根',
                dataIndex: 'rootName',
                key: 'rootName',
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
                title: '描述',
                dataIndex: 'descWord',
                key: 'descWord',
                render: (text, record) => (text.length ? <Tooltip title={this.renderDescWord(text, '#fff')}>{this.renderDescWord(text, '#2D3033')}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '审批状态',
                dataIndex: 'passed',
                key: 'passed',
                width: 100,
                render: (text) => {
                    return text ? <StatusLabel type='success' message='已通过' /> : <StatusLabel type='error' message='已拒绝' />
                },
            },
            {
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                width: 100,
                render: (text, record) => {
                    return (
                        <a
                            onClick={this.openDetail.bind(
                                this,
                                record,
                                true
                            )}
                            key='edit'
                        >
                            详情
                        </a>
                    )
                }
            }
        ]
    }
    openModal = async (data) => {
        await this.setState({
            modalVisible: true,
            tableData: data,
            showCheckDetail: false
        })
    }
    cancel = () => {
        this.setState({
            modalVisible: false
        })
    }
    renderDescWord = (data, color) => {
        let html = ''
        data.map((item, index) => {
            html += item + (index < data.length - 1 ? '、' : '')
        })
        return <span style={{ color: color }} dangerouslySetInnerHTML={{ __html: html }}></span>
    }
    openDetail = async (data) => {
        this.setState({
            showCheckDetail: true,
            loading: true
        })
        let res = await auditRecordDetail({id: data.id})
        this.setState({loading: false})
        if (res.code == 200) {
            res.data.correctRootInfo = res.data.correctRootInfo ? res.data.correctRootInfo : {}
            this.setState({
                checkInfo: res.data
            })
        }
    }
    hideCheckDetail = () => {
        this.setState({
            showCheckDetail: false,
        })
    }
    render() {
        const {
            modalVisible,
            tableData,
            loading,
            showCheckDetail,
            logList,
            checkInfo,
        } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'rootCheckDrawer',
                    title: showCheckDetail ? <div><span onClick={this.hideCheckDetail} className='iconfont icon-zuo'></span>审批详情</div> : '备选词根',
                    width: 640,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: true
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        {
                            showCheckDetail ?
                                <div>
                                    <Spin spinning={loading}>
                                        <div className='assetTitle'>
                                            <div
                                                className='assetIcon'
                                                style={{
                                                    background: '#95A1A8',
                                                }}
                                            >
                                                <span className='iconfont icon-yichuli'></span>
                                            </div>
                                            <div className='OverView'>
                                                <Tooltip title={checkInfo.rootName}>
                                                    <div className='title'>
                                                        {checkInfo.rootName}
                                                        <span className='checkStatus'><span style={{ background: checkInfo.passed ? '#28AE52' : '#FF4D4F'}}></span>{checkInfo.passed ? '已通过' : '已拒绝'}</span>
                                                    </div>
                                                </Tooltip>
                                                <Form className='MiniForm'>
                                                    <div className='HControlGroup'>
                                                        {[
                                                            {
                                                                label: '词根类别',
                                                                content: checkInfo.rootCategoryName,
                                                            },
                                                            {
                                                                label: '词根类型',
                                                                content: checkInfo.rootTypeName,
                                                            },
                                                            {
                                                                label: '词根备注',
                                                                content: checkInfo.remarks,
                                                            },
                                                        ].map((item) => {
                                                            return (
                                                                <div key={item.label} className='detailInfo'>
                                                                    <label style={{ width: 'auto' }}>{item.label}</label>
                                                                    <span style={{ color: '#2D3033' }}>{item.content || <EmptyLabel/>}</span>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </Form>
                                            </div>
                                        </div>
                                        <Divider/>
                                        <ModuleTitle style={{ margin: '24px 0' }} title='审核信息'/>
                                        <Timeline className='timeline'>
                                            {
                                                logList.map((item, index) => {
                                                    return (
                                                        <Timeline.Item>
                                                            {
                                                                index == 1 ? <div className='timelineTitle'><span>审批人</span>{checkInfo.auditorName}（{checkInfo.auditorDeptName}）</div>
                                                                    : <div className='timelineTitle'><span>申请人</span>{checkInfo.applicantName}（{checkInfo.applicantDeptName}）</div>
                                                            }
                                                            {
                                                                index == 1 ? <div className='timeValue'>{checkInfo.auditTime}</div>
                                                                    : <div className='timeValue'>{checkInfo.applicantTime}</div>
                                                            }
                                                            {
                                                                index == 1 && !checkInfo.passed ?
                                                                    <div className='DetailPart'>
                                                                        <div style={{ color: '#1A1A1A' }}>拒绝原因【{checkInfo.refuseType ? '词根错误' : '词根已存在'}】</div>
                                                                        <div style={{ color: '#5E6266' }}>
                                                                            正确词根：{checkInfo.correctRootInfo.rootName || <EmptyLabel/>}
                                                                            <br/>
                                                                            词根类别：{checkInfo.correctRootInfo.rootCategoryName || <EmptyLabel/>}；词根类型：{checkInfo.correctRootInfo.rootTypeName || <EmptyLabel/>}；词根备注：{checkInfo.correctRootInfo.remarks || <EmptyLabel/>}
                                                                        </div>
                                                                    </div>
                                                                    : null
                                                            }
                                                        </Timeline.Item>
                                                    )
                                                })
                                            }
                                        </Timeline>
                                    </Spin>
                                </div>
                                :
                                <Table
                                    // loading={loading}
                                    columns={this.columns}
                                    dataSource={tableData}
                                    rowKey="id"
                                    pagination={false}
                                />
                        }
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}