import DrawerLayout from '@/component/layout/DrawerLayout';
import RenderUtil from '@/utils/RenderUtil';
import { Form } from '@ant-design/compatible';
import React, { Component } from 'react';
import '../index.less';


export default class MapDetailDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            detailInfo: {},
            drawerTitle: ''
        }
    }
    openModal = (data, title) => {
        this.setState({
            modalVisible: true,
            detailInfo: data,
            drawerTitle: title
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
            drawerTitle
        } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'categoryDetailDrawer',
                    title: drawerTitle,
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
                                    label: '来源数据源',
                                    hide: drawerTitle == '字段类型映射详情',
                                    content: detailInfo.sourceDatasourceIdentifier,
                                },
                                {
                                    label: '目标数据源',
                                    hide: drawerTitle == '字段类型映射详情',
                                    content: detailInfo.targetDatasourceIdentifier,
                                },
                                {
                                    label: '来源类型',
                                    hide: drawerTitle !== '字段类型映射详情',
                                    content: detailInfo.sourceDatasourceType,
                                },
                                {
                                    label: '目标类型',
                                    hide: drawerTitle !== '字段类型映射详情',
                                    content: detailInfo.targetDatasourceType,
                                },
                                {
                                    label: '映射内容',
                                    content: detailInfo.content,
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