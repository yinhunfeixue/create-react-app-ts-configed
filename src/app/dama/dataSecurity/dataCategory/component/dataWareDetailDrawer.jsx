import CollapseLabel from '@/component/collapseLabel/CollapseLabel';
import DrawerLayout from '@/component/layout/DrawerLayout';
import RenderUtil from '@/utils/RenderUtil';
import { Form, Tag } from 'antd';
import { dataSecurityLevelList } from 'app_api/dataSecurity';
import React, { Component } from 'react';
import '../index.less';


export default class DataWareDetailDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            detailInfo: {
            },
            levelList: [],
        }
    }
    openModal = (data) => {
        this.setState({
            modalVisible: true,
            detailInfo: data
        })
        this.getDataSecurityLevelList()
        // this.modalCollapseLabel&&this.modalCollapseLabel.getVisibleBtn()
    }
    cancel = () => {
        this.setState({
            modalVisible: false
        })
    }
    getDataSecurityLevelList = async () => {
        let res = await dataSecurityLevelList()
        if (res.code == 200) {
            res.data.map((item) => {
                item.id = parseInt(item.id)
            })
            this.setState({
                levelList: res.data
            })
        }
    }
    renderDesc = (value, name) => {
        return <CollapseLabel ref={(dom) => (this[name] = dom)} value={value}/>
    }
    getLevelDesc = (value) => {
        let { levelList } = this.state
        for (let i=0;i<levelList.length;i++) {
            if (levelList[i].id == value) {
                return levelList[i].name
            }
        }
    }
    render() {
        const {
            modalVisible,
            detailInfo,
        } = this.state
        let businessTagDesc = detailInfo.businessTag == 1 ? '业务板块' : (detailInfo.businessTag == 2 ? '主题域' : '业务过程')
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'categoryDetailDrawer',
                    title: businessTagDesc + '详情',
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
                                    label: businessTagDesc + '名称',
                                    content: detailInfo.name,
                                },
                                {
                                    label: '英文名称',
                                    content: detailInfo.englishName,
                                },
                                {
                                    label: '英文缩写',
                                    content: detailInfo.code,
                                },
                                {
                                    label: '分类结构',
                                    content: businessTagDesc,
                                },
                                {
                                    label: businessTagDesc + '描述',
                                    content: detailInfo.description,
                                },
                            ])}
                        </Form>
                        {
                            detailInfo.businessTag == 2 ?
                                <Form className='MiniForm DetailPart FormPart' layout='inline'>
                                    <h3>业务信息</h3>
                                    {RenderUtil.renderFormItems([
                                        {
                                            label: '业务归属部门',
                                            content: detailInfo.businessDepartment,
                                        },
                                        {
                                            label: '业务负责人',
                                            content: detailInfo.businessManager,
                                        },
                                        // {
                                        //     label: '安全等级',
                                        //     content: detailInfo.securityLevel ? <Tag color={detailInfo.securityLevel == 1 ? 'blue' : (detailInfo.securityLevel == 2 ? 'geekblue' : (detailInfo.securityLevel == 3 ? 'purple' : (detailInfo.securityLevel == 4 ? 'orange' : 'red')))}>
                                        //         {this.getLevelDesc(detailInfo.securityLevel)}
                                        //     </Tag> : null,
                                        // },
                                    ])}
                                </Form>
                                : null
                        }
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}