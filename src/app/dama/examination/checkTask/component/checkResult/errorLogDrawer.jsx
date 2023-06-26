// 错误记录
import DrawerLayout from '@/component/layout/DrawerLayout'
import RenderUtil from '@/utils/RenderUtil'
import { Form, Tooltip, Divider, Table } from 'antd'
import React, { Component } from 'react'
import { getCheckResultById, getCheckResultItemList } from 'app_api/examinationApi'
import '../../index.less'

export default class ErrorLogDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            addInfo: {},
            modalVisible: false,
            btnLoading: false,
            errorQuery: {
                pageNo: 1,
                pageSize: 100,
            },
            errorTotal: 0,
            errorData: [],
            tableLoading: false,
        }
        this.errorColumn = []
    }
    openModal = async (data) => {
        let { addInfo, errorQuery } = this.state
        errorQuery.taskResultId = data.taskResultId
        errorQuery.pageNo = 1
        await this.setState({
            modalVisible: true,
            addInfo: { ...data },
            errorQuery,
        })
        this.getErrorList()
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    getErrorList = async () => {
        let { errorQuery, errorData, addInfo } = this.state
        let resp = await getCheckResultById({ taskResultId: addInfo.taskResultId })
        if (resp.code == 200) {
            this.setState({ tableLoading: true })
            let res = await getCheckResultItemList(errorQuery)
            this.setState({ tableLoading: false })
            if (res.code == 200) {
                let columns = [
                    {
                        dataIndex: 'key',
                        key: 'key',
                        title: '序号',
                        width: 60,
                        render: (text, record, index) => <span>{index + 1}</span>,
                    },
                ]
                resp.data.checkRowHead.map((item, index) => {
                    columns.push({
                        dataIndex: item,
                        key: item,
                        title: resp.data.checkLabelHead[index],
                        ellipsis: true,
                        render: (text, record) => (
                            <Tooltip title={<span dangerouslySetInnerHTML={{ __html: record.checkRowInfo ? record.checkRowInfo[item] : '' }} />}>
                                <span style={{ color: addInfo.columnName == item ? '#CC0000' : '' }} dangerouslySetInnerHTML={{ __html: record.checkRowInfo ? record.checkRowInfo[item] : '' }} />
                            </Tooltip>
                        ),
                    })
                })
                this.errorColumn = columns
                res.data.map((item, index) => {
                    item.id = index
                })
                this.setState({
                    errorData: res.data,
                    errorTotal: res.total,
                })
            }
        }
    }
    render() {
        const { addInfo, modalVisible, errorData, errorTotal, tableLoading } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'errorRecordDrawer',
                    title: '错误记录',
                    width: 480,
                    visible: modalVisible,
                    onClose: this.cancel,
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <h4>字段信息</h4>
                        <Form style={{ padding: 0, background: '#fff' }} className='MiniForm DetailPart FormPart' layout='inline'>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '检核字段',
                                    content: addInfo.columnName,
                                },
                                {
                                    label: '规则名称',
                                    content: addInfo.ruleName,
                                },
                                {
                                    label: '检核表',
                                    content: addInfo.tableName,
                                },
                            ])}
                        </Form>
                        <Divider />
                        <h4>
                            问题数据（{errorData.length}）{errorTotal > 100 ? <span style={{ float: 'right', color: '#5E6266', fontWeight: '400' }}>当前仅展示100条错误记录</span> : null}
                        </h4>
                        <Table loading={tableLoading} columns={this.errorColumn} dataSource={errorData} rowKey='id' pagination={false} />
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}
