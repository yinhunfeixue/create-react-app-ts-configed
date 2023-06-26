import DrawerLayout from '@/component/layout/DrawerLayout'
import RenderUtil from '@/utils/RenderUtil'
import { Form, Tag } from 'antd'
import { desensitiseTagDetail } from 'app_api/dataSecurity'
import React, { Component } from 'react'
import '../index.less'

export default class TagDetailDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            detailInfo: {
                ruleList: [],
            },
        }
    }
    openModal = (data) => {
        this.setState({
            modalVisible: true,
        })
        this.getDesensitiseTagDetail(data.id)
    }
    getDesensitiseTagDetail = async (id) => {
        let res = await desensitiseTagDetail({ id })
        if (res.code == 200) {
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
        const { modalVisible, detailInfo } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'tagDetailDrawer',
                    title: '敏感标签详情',
                    width: 640,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: true,
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <Form className='MiniForm DetailPart FormPart' layout='inline'>
                            <h3>基本信息</h3>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '标签名称',
                                    content: detailInfo.name,
                                },
                                {
                                    label: '标签英文名',
                                    content: detailInfo.englishName,
                                },
                                {
                                    label: '标签类别',
                                    content: detailInfo.categoryName,
                                },
                                {
                                    label: '敏感级别',
                                    content: detailInfo.sensitivityLevelName,
                                },
                                {
                                    label: '安全等级',
                                    content: detailInfo.securityLevel ? (
                                        <Tag
                                            color={
                                                detailInfo.securityLevel == 1
                                                    ? 'blue'
                                                    : detailInfo.securityLevel == 2
                                                    ? 'geekblue'
                                                    : detailInfo.securityLevel == 3
                                                    ? 'purple'
                                                    : detailInfo.securityLevel == 4
                                                    ? 'orange'
                                                    : 'red'
                                            }
                                        >
                                            {detailInfo.securityLevelName}
                                        </Tag>
                                    ) : (
                                        ''
                                    ),
                                },
                                {
                                    label: '状态',
                                    content: <span style={{ color: detailInfo.status == 1 ? '#339933' : '#cc0000' }}>{detailInfo.status == 1 ? '开启' : '禁用'}</span>,
                                },
                            ])}
                        </Form>
                        <Form className='MiniForm DetailPart FormPart' layout='inline'>
                            <h3>脱敏规则</h3>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '规则名称',
                                    content: (
                                        <div>
                                            {detailInfo.ruleList.map((item, index) => {
                                                return (
                                                    <div style={{ lineHeight: '22px' }}>
                                                        {index + 1}.{item.name}
                                                        {item.isDefault ? <span>（默认）</span> : null}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    ),
                                },
                            ])}
                        </Form>
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}
