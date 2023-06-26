import EmptyLabel from '@/component/EmptyLabel';
import RichTableLayout from '@/component/layout/RichTableLayout';
import { Button, Select, Modal } from 'antd';
import { getManualJob } from 'app_api/autoManage';
import { Tooltip } from 'lz_antd';
import React, { Component } from 'react';
import '../index.less';
import AddNameRuleDrawer from './addDrawer';


const { Option } = Select

export default class NameRule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableData: [],
        }
        this.columns = [
            {
                title: '规则名',
                dataIndex: 'jobName',
                key: 'jobName',
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
                title: '规则内容',
                dataIndex: 'datasourceName',
                key: 'datasourceName',
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
                title: '描述',
                dataIndex: 'datasourceName',
                key: 'datasourceName',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            }
        ]
    }
    getTableList = async (params = {}) => {
        let query = {
            pageNo: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
        }
        let res = await getManualJob(query)
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
            })
            return {
                total: res.total,
                dataSource: res.data,
            }
        }
        return {
            total: 0,
            dataSource: [],
        }
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    openEditPage = (data) => {
        this.addNameRuleDrawer&&this.addNameRuleDrawer.openEditModal(data)
    }
    openAddPage = () => {
        this.addNameRuleDrawer&&this.addNameRuleDrawer.openAddModal()
    }
    deleteData = (data) => {
        let that = this
        Modal.confirm({
            title: '你确定要删除该规则吗？',
            content: '',
            okText: '确定',
            cancelText: '取消',
            onOk() {
                // DelAnalysisThemeTree({id: data.id}).then((res) => {
                //     if (res.code == 200) {
                //         message.success('删除成功')
                //         that.search()
                //     } else {
                //         message.error('删除失败')
                //     }
                // })
            },
        })
    }
    render() {
        const {
            queryInfo,
            tableData,
            sourceList
        } = this.state
        return (
            <React.Fragment>
                <div className='nameRule'>
                    <RichTableLayout
                        title='表命名规则'
                        renderHeaderExtra={() => {
                            return (
                                <Button type='primary' onClick={this.openAddPage}>
                                    新增规则
                                </Button>
                            )
                        }}
                        editColumnProps={{
                            width: 120,
                            createEditColumnElements: (_, record) => {
                                return [
                                    <a
                                        onClick={this.openEditPage.bind(
                                            this,
                                            record
                                        )}
                                        key='edit'
                                    >
                                        编辑
                                    </a>,
                                    <a
                                        onClick={this.deleteData.bind(
                                            this,
                                            record
                                        )}
                                        key='edit'
                                    >
                                        删除
                                    </a>,
                                ]
                            },
                        }}
                        tableProps={{
                            columns: this.columns,
                            key: 'id',
                            dataSource: tableData
                        }}
                        renderSearch={(controller) => {
                            this.controller = controller
                            return null
                        }}
                        requestListFunction={(page, pageSize, filter, sorter) => {
                            return this.getTableList({
                                pagination: {
                                    page,
                                    page_size: pageSize,
                                },
                            })
                        }}
                    />
                </div>
                <AddNameRuleDrawer search={this.search} ref={(dom) => this.addNameRuleDrawer = dom}/>
            </React.Fragment>
        )
    }
}
