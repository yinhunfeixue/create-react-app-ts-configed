import CollapseLabel from '@/component/collapseLabel/CollapseLabel';
import DrawerLayout from '@/component/layout/DrawerLayout';
import RenderUtil from '@/utils/RenderUtil';
import { Form } from "antd";
import React, { Component } from 'react';
import '../index.less';


export default class RuleDetailDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            detailInfo: {
                bizRuleDTO: {}
            },
            ruleLevel: 0
        }
    }
    openModal = (data, ruleLevel) => {
        if (data.bizRuleDTO == undefined) {
            data.bizRuleDTO = {}
        }
        this.setState({
            modalVisible: true,
            detailInfo: data,
            ruleLevel
        })
    }
    cancel = () => {
        this.setState({
            modalVisible: false
        })
    }
    render() {
        const {
            modalVisible,
            detailInfo,
            ruleLevel
        } = this.state
        let form = [
            {
                label: ruleLevel == 0 ? '来源表' : '检核表',
                content: detailInfo.tableName,
            },
            {
                label: '来源库',
                content: detailInfo.databaseName,
            },
            {
                label: '数据源',
                content: detailInfo.datasourceName,
            },
            {
                label: '问题级别',
                content: detailInfo.severityLevelDesc,
            },
        ]
        if (ruleLevel == 0) {
            form.unshift(
                {
                    label: '核验字段',
                    content: detailInfo.columnName,
                },
            )
            form.push(
                {
                    label: '阈值',
                    content: detailInfo.passRate + '%',
                }
            )
        }
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'techRuleDetailDrawer',
                    title: '技术规则',
                    width: 640,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: true
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <Form className='MiniForm DetailPart FormPart' layout='inline'>
                            <h3>核验字段</h3>
                            {RenderUtil.renderFormItems([
                                ...form
                            ])}
                        </Form>
                        <Form className='MiniForm DetailPart FormPart' layout='inline'>
                            <h3>业务规则</h3>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '规则名称',
                                    content: detailInfo.sqlSource ? detailInfo.bizRuleDTO.ruleName : detailInfo.name,
                                },
                                {
                                    label: '规则ID',
                                    content: detailInfo.ruleCode,
                                },
                                {
                                    label: '规则分组',
                                    content: detailInfo.sqlSource ? detailInfo.bizRuleDTO.bizRuleGroupName : detailInfo.bizRuleGroupName,
                                },
                                {
                                    label: '规则类型',
                                    content: detailInfo.sqlSource ? detailInfo.bizRuleDTO.ruleTypePath : detailInfo.ruleTypePath,
                                },
                                {
                                    label: '规则描述',
                                    content: detailInfo.sqlSource ? detailInfo.bizRuleDTO.ruleDesc : detailInfo.ruleDesc,
                                },
                            ])}
                        </Form>
                        <Form className='MiniForm DetailPart FormPart' layout='inline'>
                            <h3>检核SQL</h3>
                            {RenderUtil.renderFormItems([
                                {
                                    content: detailInfo.sqlText,
                                },
                            ])}
                        </Form>
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}