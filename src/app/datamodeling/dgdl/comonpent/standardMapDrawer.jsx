// 标准映射
import TableLayout from '@/component/layout/TableLayout'
import ProjectUtil from '@/utils/ProjectUtil'
import { Button, Input, Modal, Spin, Table, Tooltip, Tree } from 'antd'
import { dwappStandard } from 'app_api/standardApi'
import { getTree } from 'app_api/systemManage'
import React, { Component } from 'react'



export default class StandardMapDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            detailInfo: {},
            btnLoading: false,
            laoding: false,
            treeData: [], // 树数据
            defaultTreeSelectedKeys: [], // 树默认选中项
            currentKey: '1',
            currentSelectedKey: '',
            queryInfo: {
                page: 1,
                pageSize: 10,
                keyword: '',
            },
            tableData: [],
            total: 0,
            treeLoading: false,
            selectedRadio: []
        }
        this.columns = [
            {
                title: '标准编码',
                dataIndex: 'entityId',
                key: 'entityId',
                width: 120,
                render: (_, record) => <a onClick={() => this.onView(record)} dangerouslySetInnerHTML={{ __html: `<Tooltip title=${_}>${record.entityId ? record.entityId : _}</Tooltip>` }} />,
            },
            {
                title: '标准英文名',
                dataIndex: 'entityName',
                key: 'entityName',
                render: (_, record) => (
                    <Tooltip title={<span dangerouslySetInnerHTML={{ __html: record.entityNameHL ? record.entityNameHL : _ }} />}>
                        <span dangerouslySetInnerHTML={{ __html: record.entityNameHL ? record.entityNameHL : _ }} />
                    </Tooltip>
                ),
                width: 180,
            },
            {
                title: '标准中文名',
                dataIndex: 'entityDesc',
                key: 'entityDesc',
                render: (_, record) => (
                    <Tooltip title={<span dangerouslySetInnerHTML={{ __html: record.entityDescHL ? record.entityDescHL : _ }} />}>
                        <span dangerouslySetInnerHTML={{ __html: record.entityDescHL ? record.entityDescHL : _ }} />
                    </Tooltip>
                ),
                width: 180,
            },
            {
                title: '业务定义',
                dataIndex: 'businessDefinition',
                key: 'businessDefinition',
                render: (_, record) => (
                    <Tooltip title={_}>
                        <span className='LineClamp1' dangerouslySetInnerHTML={{ __html: record.businessDefinitionHL ? record.businessDefinitionHL : _ }} />
                    </Tooltip>
                ),
            },
        ]
    }
    openModal = async () => {
        await this.setState({
            modalVisible: true,
            selectedRadio: []
        })
        this.getTreeData()
        this.getTableList()
    }
    getTreeData() {
        this.setState({treeLoading: true})
        getTree({ code: 'ZT002' }).then((res) => {
            this.setState({treeLoading: false})
            if (res.code == 200) {
                // treeId = res.data.id
                res.data.level = 0
                this.setState({
                    treeData: [res.data],
                    // defaultTreeSelectedKeys: [treeId.toString()],
                    // currentSelectedKey: treeId,
                })
            }
        })
    }
    onTreeSelect = async (selectedKeys, e) => {
        if (!selectedKeys[0]) {
            return
        }
        await this.setState({
            currentSelectedKey: selectedKeys[0]
        })
        this.search()
    }
    changeKeyword = async (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        await this.setState({
            queryInfo
        })
        if (!e.target.value) {
            this.search()
        }
    }
    renderTreeNode(treeData) {
        if (!treeData) {
            return []
        }

        return treeData.map((item) => {
            return (
                <Tree.TreeNode
                    disabled={item.level == 0}
                    title={
                        <Tooltip title={item.name}>
                            <span>{item.name}</span>
                        </Tooltip>
                    }
                    key={item.id}
                >
                    {this.renderTreeNode(item.children)}
                </Tree.TreeNode>
            )
        })
    }

    getTableList = async () => {
        const { queryInfo, currentSelectedKey } = this.state
        this.setState({loading: true})
        let res = await dwappStandard({
            page: queryInfo.page,
            page_size: queryInfo.pageSize,
            keyword: queryInfo.keyword,
            treeNodeId: currentSelectedKey
        })
        this.setState({loading: false})
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
                total: res.total
            })
        }
    }

    search = async () => {
        let { queryInfo } = this.state
        queryInfo.page =1
        await this.setState({
            queryInfo,
            selectedRadio: []
        })
        this.getTableList()
    }
    onView = (params) => {
        this.props.addTab('标准详情', params, true)
    }
    cancel = () => {
        this.setState({
            modalVisible: false
        })
    }
    changeRadio = (selectedRowKey, selectedRow) => {
        console.log(selectedRowKey, selectedRow, 'changeRadio')
        let div = document.createElement('div')
        div.innerHTML = selectedRow[0].entityDesc
        this.setState({
            selectedRadio: selectedRowKey,
            selectedName: div.innerText
        })
    }
    changePage = async (pagination) => {
        let { queryInfo } = this.state
        queryInfo.page = pagination.current || 1
        queryInfo.pageSize = pagination.pageSize || 10
        await this.setState({
            queryInfo
        })
        this.getTableList()
    }
    postData = () => {
        let { selectedRadio, selectedName } = this.state
        let data = {
            id: selectedRadio[0],
            name: selectedName
        }
        this.props.getColumnMapData(data)
        this.cancel()
    }
    render() {
        const {
            modalVisible,
            btnLoading,
            treeData,
            treeLoading,
            queryInfo,
            tableData,
            total,
            selectedRadio,
            loading
        } = this.state
        const rowSelection = {
            type: 'radio',
            selectedRowKeys: selectedRadio,
            onChange: this.changeRadio,
            columnWidth: 28,
        }
        return (
            <Modal
                className="standardMapDrawer"
                title='标准映射'
                width={960}
                visible={modalVisible}
                onCancel={this.cancel}
                maskClosable={false}
                footer={[
                    <Button
                        disabled={!selectedRadio.length}
                        onClick={this.postData} type='primary' loading={btnLoading}>
                        确定
                    </Button>,
                    <Button onClick={this.cancel}>
                        取消
                    </Button>,
                ]}
            >
                {modalVisible && (
                    <React.Fragment>
                        <div style={{ display: 'flex', height: '100%' }}>
                            <div className='treeArea commonScroll' style={{ width: 200 }}>
                                <Spin spinning={treeLoading}>
                                    {treeData.length ?
                                        <Tree defaultExpandAll={true} onSelect={this.onTreeSelect}>
                                            {this.renderTreeNode(treeData)}
                                        </Tree>
                                    : null}
                                </Spin>
                            </div>
                            <div className='tableArea commonScroll' style={{ width: 'calc(100% - 200px)' }}>
                                <TableLayout
                                    disabledDefaultFooter
                                    smallLayout
                                    renderDetail={() => {
                                        return (
                                            <div>
                                                <Input.Search style={{ marginBottom: 16 }} allowClear onSearch={() => this.search()} value={queryInfo.keyword} onChange={this.changeKeyword} placeholder='请输入标准编码或名称' />
                                                <Table
                                                    loading={loading}
                                                    columns={this.columns}
                                                    rowSelection={rowSelection}
                                                    dataSource={tableData}
                                                    rowKey='id'
                                                    onChange={this.changePage}
                                                    pagination={
                                                        {
                                                            total: total,
                                                            pageSize: queryInfo.pageSize,
                                                            current: queryInfo.page,
                                                            showSizeChanger: true,
                                                            showQuickJumper: true,
                                                            showTotal: (total) => (
                                                                <span>
                                                                    总数 <b>{ProjectUtil.formNumber(total)}</b> 条
                                                                </span>
                                                            ),
                                                        }
                                                    }
                                                />
                                            </div>
                                        )
                                    }}
                                />
                            </div>
                        </div>
                    </React.Fragment>
                )}
            </Modal>
        )
    }
}