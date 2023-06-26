import DrawerLayout from '@/component/layout/DrawerLayout'
import ProjectUtil from '@/utils/ProjectUtil'
import { ReloadOutlined } from '@ant-design/icons';
import { List, Pagination, Spin } from 'antd';
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import store from './hand_store'
// import '../style.less'

@observer
export default class HandCollectionRecordList extends Component {
    constructor(props) {
        super(props)
        // console.log(this.props)
        this.modalTitle = (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginRight: 50, alignItems: 'center' }}>
                <span>日志详情</span>
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
    render() {
        const { modalVisible, listLoading, recordData, recordStatus, tableCurrentPageRecord, reportDataSourcesTotalRecord } = store
        return (
            <DrawerLayout
                drawerProps={{
                    title: '日志详情',
                    width: 720,
                    visible: modalVisible,
                    onClose: store.hideModal,
                }}
                createExtraElement={() => {
                    return [<ReloadOutlined onClick={this.refreshList} />];
                }}
                renderFooter={() => {
                    return <Pagination current={tableCurrentPageRecord} total={reportDataSourcesTotalRecord} onChange={this.handlePaginationOnChangeRecord} showTotal={(total) => (<span>总数 <b>{ProjectUtil.formNumber(total)}</b> 条</span>)} />
                }}
            >
                <Spin spinning={listLoading}>
                    <List size='small' dataSource={recordData} renderItem={(item) => <List.Item className='modalList'>{item.content}</List.Item>} />
                </Spin>
            </DrawerLayout>
        );
    }
}
