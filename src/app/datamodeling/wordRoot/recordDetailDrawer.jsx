import DrawerLayout from '@/component/layout/DrawerLayout';
import ModuleTitle from '@/component/module/ModuleTitle';
import EmptyLabel from '@/component/EmptyLabel'
import { Collapse, Divider, Form, Timeline, Tooltip } from 'antd';
import React, { Component } from 'react';
import './index.less';


const { Panel } = Collapse;
export default class RecordDetailDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            detailInfo: {
                correctRootInfo: {}
            },
            logList: ['1','2'],
        }
    }

    openModal = (data) => {
        data.correctRootInfo = data.correctRootInfo ? data.correctRootInfo : {}
        this.setState({
            modalVisible: true,
            detailInfo: data,
        })
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    render() {
        const { modalVisible, logList, detailInfo } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    title: '审批详情',
                    className: 'recordDetailDrawer',
                    width: 640,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: true,
                }}
            >
                {modalVisible && (
                    <React.Fragment>
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
                                <Tooltip title={detailInfo.rootName}>
                                    <div className='title'>
                                        {detailInfo.rootName}
                                        <span className='checkStatus'><span style={{ background: detailInfo.passed ? '#28AE52' : '#FF4D4F'}}></span>{detailInfo.passed ? '已通过' : '已拒绝'}</span>
                                    </div>
                                </Tooltip>
                                <Form className='MiniForm'>
                                    <div className='HControlGroup'>
                                        {[
                                            {
                                                label: '词根类别',
                                                content: detailInfo.rootCategoryName,
                                            },
                                            {
                                                label: '词根类型',
                                                content: detailInfo.rootTypeName,
                                            },
                                            {
                                                label: '词根备注',
                                                content: detailInfo.remarks,
                                            },
                                        ].map((item) => {
                                            return (
                                                <div key={item.label} className='detailInfo'>
                                                    <label>{item.label}</label>
                                                    <span>{item.content || <EmptyLabel/>}</span>
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
                                                index == 1 ? <div className='timelineTitle'><span>审批人</span>{detailInfo.auditorName}（{detailInfo.auditorDeptName}）</div>
                                                    : <div className='timelineTitle'><span>申请人</span>{detailInfo.applicantName}（{detailInfo.applicantDeptName}）</div>
                                            }
                                            {
                                                index == 1 ? <div className='timeValue'>{detailInfo.auditTime}</div>
                                                    : <div className='timeValue'>{detailInfo.applicantTime}</div>
                                            }
                                            {
                                                index == 1 && !detailInfo.passed ?
                                                    <div className='DetailPart'>
                                                        <div style={{ color: '#1A1A1A' }}>拒绝原因【{detailInfo.refuseType ? '词根错误' : '词根已存在'}】</div>
                                                        <div style={{ color: '#5E6266' }}>
                                                            正确词根：{detailInfo.correctRootInfo.rootName || <EmptyLabel/>}
                                                            <br/>
                                                            词根类别：{detailInfo.correctRootInfo.rootCategoryName || <EmptyLabel/>}；词根类型：{detailInfo.correctRootInfo.rootTypeName || <EmptyLabel/>}；词根备注：{detailInfo.correctRootInfo.remarks || <EmptyLabel/>}
                                                        </div>
                                                    </div>
                                                    : null
                                            }
                                        </Timeline.Item>
                                    )
                                })
                            }
                        </Timeline>
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}