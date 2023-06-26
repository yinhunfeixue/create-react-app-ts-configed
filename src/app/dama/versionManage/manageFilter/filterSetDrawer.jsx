import DrawerLayout from '@/component/layout/DrawerLayout';
import RenderUtil from '@/utils/RenderUtil';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Form, Radio, Table, Tooltip } from 'antd';
import React, { Component } from 'react';
import './index.less';


export default class FilterSetDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            detailInfo: {},
            tableData: [],
            loading: false,
        }
        this.columns = [
            {
                title: '规则名称',
                dataIndex: 'fileName',
                key: 'fileName',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '规则描述',
                dataIndex: 'fileName',
                key: 'fileName',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                width: 110,
                render: (text, record, index) => {
                    return (
                        <div>
                            <a onClick={this.openDetailPage.bind(this, record)}>详情</a>
                            <Divider style={{ margin: '0 8px' }} type='vertical' />
                            <a onClick={this.deleteColumn.bind(this, index)}>移除</a>
                        </div>
                    )
                }
            },
        ]
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
    handleInputChange = (name, e) => {
        let { detailInfo } = this.state
        detailInfo[name] = e.target.value
        this.setState({
            detailInfo
        })
    }
    openDetailPage = (data) => {

    }
    deleteColumn = (index) => {
        let { tableData } = this.state
        tableData.splice(index, 1)
        this.setState({
            tableData
        })
    }
    addData = () => {

    }
    postData = () => {

    }
    render() {
        const {
            modalVisible,
            detailInfo,
            tableData,
            loading
        } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'filterSetDrawer',
                    title: '过滤设置',
                    width: 480,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: false
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button type='primary' loading={loading} onClick={this.postData}>
                                确定
                            </Button>
                            <Button onClick={this.cancel}>取消</Button>
                        </React.Fragment>
                    )
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <div style={{ marginBottom: 24 }}>源数据名称：{detailInfo.name}</div>
                        <Form className='MiniForm postForm Grid1' style={{ columnGap: 8 }}>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '过滤策略',
                                    content: <Radio.Group value={detailInfo.way} onChange={this.handleInputChange.bind(this, 'way')}>
                                        <Radio value={1}>不过滤</Radio>
                                        <Radio value={2}>按规则过滤</Radio>
                                    </Radio.Group>,
                                },
                                {
                                    label: '过滤规则',
                                    hide: detailInfo.way == 1,
                                    content: <div>
                                        <Table
                                            rowKey='id'
                                            columns={this.columns}
                                            dataSource={tableData}
                                            pagination={false}
                                        />
                                        <Button icon={<PlusOutlined />} block onClick={this.addData} ghost type='link'>
                                            添加
                                        </Button>
                                    </div>,
                                },
                            ])}
                        </Form>
                    </React.Fragment>
                )}
            </DrawerLayout>
        );
    }
}