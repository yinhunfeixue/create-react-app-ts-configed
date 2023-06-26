import DrawerLayout from '@/component/layout/DrawerLayout';
import RenderUtil from '@/utils/RenderUtil';
import { Form } from 'antd';
import React, { Component } from 'react';


export default class CheckRecordDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            detailInfo: {},
        }
    }
    openModal = (data) => {
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
    render() {
        const {
            modalVisible,
            detailInfo,
        } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'categoryDetailDrawer',
                    title: '审核详情',
                    width: 640,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: true
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <Form className='MiniForm DetailPart FormPart' layout='inline'>
                            <h3>审核对象</h3>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '数据源名称',
                                    content: detailInfo.dsCnName,
                                },
                                {
                                    label: '对象类型',
                                    content: detailInfo.type ? '字段' : '表',
                                },
                                {
                                    label: '字段中文名',
                                    hide: !detailInfo.type,
                                    content: detailInfo.columnCnName,
                                },
                                {
                                    label: '字段英文名',
                                    hide: !detailInfo.type,
                                    content: detailInfo.columnName,
                                },
                                {
                                    label: '表中文名',
                                    hide: detailInfo.type,
                                    content: detailInfo.tableCnName,
                                },
                                {
                                    label: '表英文名',
                                    hide: detailInfo.type,
                                    content: detailInfo.tableName,
                                },
                                {
                                    label: '来源库',
                                    content: detailInfo.dbName,
                                }
                            ])}
                        </Form>
                        <Form className='MiniForm DetailPart FormPart' layout='inline'>
                            <h3>治理信息</h3>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '审核内容',
                                    content: detailInfo.content,
                                },
                                {
                                    label: '审核时间',
                                    content: detailInfo.createTime,
                                },
                                {
                                    label: '审核人',
                                    content: detailInfo.userName,
                                }
                            ])}
                        </Form>
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}