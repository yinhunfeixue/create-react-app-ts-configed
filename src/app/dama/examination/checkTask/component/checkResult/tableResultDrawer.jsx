// 表检核结果
import DrawerLayout from '@/component/layout/DrawerLayout'
import RenderUtil from '@/utils/RenderUtil'
import { Form, Tooltip, Divider, Table } from 'antd'
import React, { Component } from 'react'
import { queryTableRecordsDetail } from 'app_api/examinationApi'
import '../../index.less'

export default class TableResultDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableInfo: {},
            modalVisible: false,
            btnLoading: false,
            tableLoading: false,
            tableData: []
        }
    }
    openModal = async (data) => {
        let { tableInfo } = this.state
        await this.setState({
            modalVisible: true,
            tableInfo: { ...data },
        })
        this.getTableList()
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    getTableList = async () => {
        let { tableInfo } = this.state
        let res = await queryTableRecordsDetail({ tableTaskResultId: tableInfo.taskResultId })
        if (res.code == 200) {
            res.data.map((node) => {
                node.itemMap = node.itemMap ? node.itemMap : {}
                node.itemList = []
                for (let k in node.itemMap) {
                    node.itemList.push({
                        name: k,
                        value: node.itemMap[k]
                    })
                }
            })
           this.setState({
               tableData: res.data
           })
        }
    }
    render() {
        const { tableInfo, modalVisible, tableData, tableLoading } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'errorRecordDrawer tableResultDrawer',
                    title: '检核结果',
                    width: 480,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: true,
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <h4>检核规则</h4>
                        <Form style={{ padding: 0, background: '#fff' }} className='MiniForm DetailPart FormPart' layout='inline'>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '规则名称',
                                    content: tableInfo.ruleName,
                                },
                                {
                                    label: '规则类型',
                                    content: tableInfo.ruleTypeName,
                                },
                            ])}
                        </Form>
                        <h4>检核结果</h4>
                        {
                            tableData.map((value, index) => {
                                return (
                                    <div className="tableResultItem">
                                        <div className={value.tableType == 1 ? 'tableType' : 'tableType tableTypeTwo'}>{value.tableType == 1 ? '检核表' : '参照表'}</div>
                                        <div className="tableName">{value.tableNameEn} [{value.tableNameCn}]</div>
                                        <div className="tableInfo">
                                            {
                                                value.itemList.map((item) => {
                                                    return (<div>{item.name}：<span>{item.value}</span></div>)
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}