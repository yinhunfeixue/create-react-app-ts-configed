import { Button, Input, Icon, Form, Tag } from 'antd'
import React, { Component } from 'react'
import '../index.less'
import RenderUtil from '@/utils/RenderUtil'
import DrawerLayout from '@/component/layout/DrawerLayout'
import { filterRuleDetail, filterTypes, filterOpts } from 'app_api/autoManage'

export default class RuleDetailDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            detailInfo: {},
            typeList: [],
            optList: []
        }
    }
    openModal = (data) => {
        this.setState({
            modalVisible: true,
        })
        this.getFilter()
        this.getData(data.id)
    }
    getData = async (id) => {
        let res = await filterRuleDetail({id: id})
        if (res.code == 200) {
            this.setState({
                detailInfo: res.data
            })
        }
    }
    getFilter = async () => {
        let res = await filterTypes()
        if (res.code == 200) {
            this.setState({
                typeList: res.data
            })
        }
        let res1 = await filterOpts()
        if (res1.code == 200) {
            this.setState({
                optList: res1.data
            })
        }
    }
    getTypeName = (value) => {
        let { typeList } = this.state
        for (let i = 0;i<typeList.length;i++) {
            if (value == typeList[i].id) {
                return typeList[i].name
            }
        }
        return ''
    }
    getOptName = (value) => {
        let { optList } = this.state
        for (let i = 0;i<optList.length;i++) {
            if (value == optList[i].id) {
                return optList[i].name
            }
        }
        return ''
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
        } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'categoryDetailDrawer',
                    title: '过滤规则详情',
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
                                    label: '名称',
                                    content: detailInfo.name,
                                },
                                {
                                    label: '状态',
                                    content: <span style={{ color: detailInfo.enable ? '#339933' : '#cc0000'}}>{detailInfo.enable?'启用':'禁用'}</span>,
                                },
                                {
                                    label: '描述',
                                    content: detailInfo.description,
                                },
                                {
                                    label: '过滤规则',
                                    content: <span>
                                        {
                                            detailInfo.filterInfoList&&detailInfo.filterInfoList.map((item, index) => {
                                                return (
                                                    <span>
                                                        （{this.getTypeName(item.filterType)} {this.getOptName(item.filterOpt)} {item.content}）
                                                        {index + 1 == detailInfo.filterInfoList.length ? null : <span> {item.logicalOpt ? '或' : '且'} </span>}
                                                    </span>
                                                )
                                            })
                                        }
                                    </span>,
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
                                    content: detailInfo.createTime,
                                },
                                {
                                    label: '修改人',
                                    content: detailInfo.updateUser,
                                },
                                {
                                    label: '修改时间',
                                    content: detailInfo.updateTime,
                                },
                            ])}
                        </Form>
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}