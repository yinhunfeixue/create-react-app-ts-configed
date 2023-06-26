import CollapseLabel from '@/component/collapseLabel/CollapseLabel';
import DrawerLayout from '@/component/layout/DrawerLayout';
import RenderUtil from '@/utils/RenderUtil';
import { Form, Divider } from "antd";
import React, { Component } from 'react';
import './index.less';
import moment from 'moment'

export default class ModelDetailDrawer extends Component {
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
                    className: 'metaModelDetailDrawer',
                    title: '属性详情',
                    width: 480,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: true
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <div className='titleArea'>
                            <div className='titleValue'>{detailInfo.nameCn} {detailInfo.source === 1? <span className='detailTag insideTag'>内置</span> : <span className='detailTag customTag'>自定义</span>}</div>
                        </div>
                        <Divider style={{ marginTop: 16 }} />
                        <Form className='HMiniForm' colon={false}>
                            <h3 style={{fontSize: 14}}>基本信息</h3>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '状态',
                                    content: detailInfo.isEnable ? <span><span style={{ background: '#28AE52' }} className='statusDot'></span>启用</span> : <span><span style={{ background: '#CC0000' }} className='statusDot'></span>禁用</span>,
                                },
                                {
                                    label: '英文名',
                                    content: <span style={{whiteSpace: 'normal'}}>{detailInfo.nameEn}</span> ,
                                },
                                {
                                    label: '是否必填',
                                    content: detailInfo.isRequiredField? '是': '否',
                                },
                                {
                                    label: '所属分组',
                                    content: detailInfo.appBaseConfigGroup,
                                },
                                {
                                    label: '类型',
                                    content: detailInfo.typeName.replace("(", "【").replace(")", "】"),
                                },
                                {
                                    label: ' ',
                                    hide: detailInfo.type !== 2,
                                    content: <div className='tagArea'>
                                    {detailInfo.subTypeList &&
                                        detailInfo.subTypeList.map((item) => {
                                            return <span>{item}</span>
                                        })}
                                </div>
                                }
                            ])}
                        </Form>
                        <Divider style={{ marginTop: 16 }} />
                        <Form className='HMiniForm' colon={false}>
                            <h3 style={{fontSize: 14}}>其他信息</h3>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '创建人',
                                    content:  detailInfo.createUser + (detailInfo.source !== 1? ` (${detailInfo.createUserAccount})` : ""),
                                },
                                {
                                    label: '创建时间',
                                    content: moment(detailInfo.createTime).format('YYYY-MM-DD HH:mm:ss'),
                                }
                            ])}
                        </Form>
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}