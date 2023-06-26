import CollapseLabel from '@/component/collapseLabel/CollapseLabel';
import DrawerLayout from '@/component/layout/DrawerLayout';
import RenderUtil from '@/utils/RenderUtil';
import { Form } from "antd";
import React, { Component } from 'react';
import './index.less';
import moment from 'moment'

export default class BizRuleDetailDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            detailInfo: {
                bizRuleDTO: {}
            }
        }
    }
    openModal = (data) => {
        if (data.bizRuleDTO == undefined) {
            data.bizRuleDTO = {}
        }
        this.setState({
            modalVisible: true,
            detailInfo: data
        })
    }
    cancel = () => {
        this.setState({
            modalVisible: false
        })
    }
    renderDesc = (value, name) => {
        return <CollapseLabel ref={(dom) => (this[name] = dom)} value={value}/>
    }
    render() {
        const {
            modalVisible,
            detailInfo
        } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'techRuleDetailDrawer',
                    title: '规则详情',
                    width: 640,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: true
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <Form className='MiniForm DetailPart FormPart' layout='inline'>
                            <h3>基本信息</h3>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '规则名称',
                                    content: detailInfo.ruleName,
                                },
                                {
                                    label: '规则描述',
                                    content: detailInfo.ruleDesc,
                                },
                                {
                                    label: '状态',
                                    content: detailInfo.status == 1 ? <span><span style={{ background: '#28AE52' }} className='statusDot'></span>启用</span> : <span><span style={{ background: '#CC0000' }} className='statusDot'></span>禁用</span>,
                                },
                                {
                                    label: '规则类型',
                                    content: detailInfo.ruleTypePath,
                                },
                            ])}
                        </Form>
                        <Form className='MiniForm DetailPart FormPart' layout='inline'>
                            <h3>其他信息</h3>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '创建人',
                                    content: detailInfo.createUser,
                                },
                                {
                                    label: '创建时间',
                                    content: moment(detailInfo.createTime).format('YYYY-MM-DD HH:mm:ss'),
                                },
                                {
                                    label: '修改人',
                                    content: detailInfo.updateUser,
                                },
                                {
                                    label: '修改时间',
                                    content: moment(detailInfo.updateTime).format('YYYY-MM-DD HH:mm:ss'),
                                },
                            ])}
                        </Form>
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}