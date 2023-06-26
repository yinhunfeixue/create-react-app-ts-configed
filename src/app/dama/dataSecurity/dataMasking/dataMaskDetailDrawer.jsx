import DrawerLayout from '@/component/layout/DrawerLayout';
import RenderUtil from '@/utils/RenderUtil';
import { Form } from 'antd';
import React, { Component } from 'react';
import '../index.less';


export default class DataMaskDetailDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            ruleInfo: {}
        }
    }
    openModal = (data) => {
        this.setState({
            modalVisible: true,
            ruleInfo: data
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
            ruleInfo
        } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'addDataMaskDrawer',
                    title: '脱敏规则详情',
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
                                    content: ruleInfo.name,
                                },
                                {
                                    label: '规则描述',
                                    content: ruleInfo.description,
                                },
                                {
                                    label: '脱敏算法',
                                    content: <span>
                                        {ruleInfo.way == 1?'MD5':('内容掩盖（' + ruleInfo.maskContent + '）')}
                                    </span>,
                                },
                                {
                                    label: '脱敏策略',
                                    content: <span>
                                                    {ruleInfo.strategy == 1 ? '中间部分脱敏（前' + ruleInfo.headPosition + '后' + ruleInfo.tailPosition + '不脱敏）' : ''}
                                        {ruleInfo.strategy == 2 ? '首尾部分脱敏（前' + ruleInfo.headPosition + '后' + ruleInfo.tailPosition + '脱敏）' : ''}
                                        {ruleInfo.strategy == 3 ? '全部文字脱敏' : ''}
                                        {ruleInfo.strategy == 4 ? '自定义' : ''}
                                                </span>,
                                },
                                {
                                    label: '正则表达式',
                                    hide: ruleInfo.strategy !== 4,
                                    content: ruleInfo.expression,
                                },
                                {
                                    label: '状态',
                                    content: <span style={{ color: ruleInfo.status == 1 ? '#339933' : '#cc0000'}}>{ruleInfo.status == 1?'启用':'禁用'}</span>,
                                }
                            ])}
                        </Form>
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}