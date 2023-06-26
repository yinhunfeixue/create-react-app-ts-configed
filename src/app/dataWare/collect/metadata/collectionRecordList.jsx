import DrawerLayout from '@/component/layout/DrawerLayout'
import LogItem from '@/component/logItem/LogItem'
import ProjectUtil from '@/utils/ProjectUtil'
import { ReloadOutlined } from '@ant-design/icons'
import { Pagination, Spin } from 'antd'
import { observer } from 'mobx-react'
import moment from 'moment'
import React, { Component } from 'react'
import store from './store'

@observer
export default class CollectionRecordList extends Component {
    constructor(props) {
        super(props)
        // console.log(this.props)
        this.modalTitle = (
            <div className='HControlGrou'>
                <span>日志详情</span>
                <span className='modalRefresh' onClick={this.refreshList}>
                    <ReloadOutlined />
                </span>
            </div>
        )
    }

    refreshList = () => {
        store.getExtractLog(1, 10, this.props.selectRowFlag)
    }

    showTotalRecord = (total, range) => {
        const totalPageNum = Math.ceil(total / store.pageSize)
        return `共${totalPageNum}页，${total}条数据`
    }

    handlePaginationOnChangeRecord = (page, pageSize) => {
        store.handlePaginationOnChangeRecord(page, pageSize)
    }
    getProcess = (value) => {
        if (value) {
            if (value.length > 9) {
                return value.substr(0, 8) + '...'
            } else {
                return value
            }
        } else {
            return '无节点'
        }
    }

    render() {
        const { modalVisible, listLoading, recordData, recordStatus, tableCurrentPageRecord, reportDataSourcesTotalRecord } = store

        return (
            <DrawerLayout
                drawerProps={{
                    title: '日志详情',
                    width: 800,
                    visible: modalVisible,
                    onClose: store.hideModal,
                }}
                createExtraElement={() => {
                    return [<ReloadOutlined onClick={this.refreshList} />]
                }}
                renderFooter={() => {
                    return (
                        <Pagination
                            current={tableCurrentPageRecord}
                            total={reportDataSourcesTotalRecord}
                            onChange={this.handlePaginationOnChangeRecord}
                            showTotal={(total) => (
                                <span>
                                    总数 <b>{ProjectUtil.formNumber(total)}</b> 条
                                </span>
                            )}
                        />
                    )
                }}
            >
                <Spin spinning={listLoading}>
                    {recordData.map((record, index) => {
                        return <LogItem key={index} time={moment(record.time).format('YYYY-MM-DD HH:mm:ss')} type={record.level} des={this.getProcess(record.process)} />
                    })}
                </Spin>
            </DrawerLayout>
        )
    }
}
