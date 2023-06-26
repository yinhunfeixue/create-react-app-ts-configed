// 业务规则
import TableLayout from '@/component/layout/TableLayout'
import EmptyLabel from '@/component/EmptyLabel'
import ProjectUtil from '@/utils/ProjectUtil'
import Cache from 'app_utils/cache'
import { Button, Cascader, Input, List, Modal, Spin, Table, Tooltip, Tree } from 'antd'
import { dwappStandard } from 'app_api/standardApi'
import { getTree } from 'app_api/systemManage'
import React, { Component } from 'react'
import classNames from 'classnames'
import '../../index.less'
import { bizRuleSearch, checkRuleTree, queryBizRuleGroup } from 'app_api/examinationApi'

export default class RuleTableModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedId: '',
            hoverId: '',
            ruleLevel: 0,
            ruleTypeList: [],
            typeList: [],
            tableTypeList: [],
            modalVisible: false,
            detailInfo: {},
            btnLoading: false,
            loading: false,
            treeData: [], // 树数据
            defaultTreeSelectedKeys: [], // 树默认选中项
            currentKey: '1',
            currentSelectedKey: '',
            queryInfo: {
                page: 1,
                pageSize: 10,
                keyword: '',
                ruleTypeId: [],
            },
            tableData: [],
            total: 0,
            treeLoading: false,
            selectedRadio: [],
            selectedRow: [],
        }
        this.columns = [
            {
                title: '规则名称',
                dataIndex: 'ruleName',
                key: 'ruleName',
                width: 200,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '规则描述',
                dataIndex: 'ruleDesc',
                key: 'ruleDesc',
                width: 200,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '规则类型',
                dataIndex: 'ruleTypeName',
                key: 'ruleTypeName',
                width: 120,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]
    }
    openModal = async (ruleLevel, ruleId, bizRuleGroupId) => {
        await this.setState({
            modalVisible: true,
            ruleLevel,
        })
        await this.getRuleTypeList(bizRuleGroupId)
        this.getRuleTree()
        console.log(ruleId,'ruleId++')
        this.setState({
            selectedRadio: ruleId ? [ruleId] : [],
            selectedRow: ruleId ? [{id: ruleId}] : []
        })
    }
    getRuleTypeList = async (bizRuleGroupId) => {
        this.setState({ loading: true })
        let res = await queryBizRuleGroup()
        this.setState({ loading: false })
        if (res.code == 200) {
            this.setState({
                ruleTypeList: res.data,
            })
          if (Cache.get('bizRuleGroupId')) {
            this.onSelect(Cache.get('bizRuleGroupId'))
          } else {
            this.onSelect(res.data.length ? res.data[0].id : '')
          }
        }
    }
    getRuleTree = async () => {
        let res = await checkRuleTree({ code: 'ZT004' })
        if (res.code == 200) {
            let data = this.deleteSubList(res.data.children)
            this.setState({
                typeList: this.getTypeList(data, 1),
                tableTypeList: this.getTypeList(data, 2),
            })
        }
    }
    getTypeList = (data, type) => {
        let newTree = data.filter(x => x.type == type)
        newTree.forEach(x => x.children&&(x.chlidren = this.getTypeList(x.children, type)))
        return newTree
    }
    deleteSubList = (data) => {
        data.map((item) => {
            if (!item.children.length) {
                delete item.children
            } else {
                this.deleteSubList(item.children)
            }
        })
        return data
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            page: 1,
            pageSize: 10,
            keyword: '',
            ruleTypeId: [],
        }
        await this.setState({
            queryInfo,
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
    getTableList = async () => {
        const { queryInfo, selectedId, ruleLevel } = this.state
        this.setState({loading: true})
        let res = await bizRuleSearch({
            page: queryInfo.page,
            page_size: queryInfo.pageSize,
            keyword: queryInfo.keyword,
            ruleTypeIdList: queryInfo.ruleTypeId.length ? [queryInfo.ruleTypeId[queryInfo.ruleTypeId.length - 1]] : [],
            bizRuleGroupId: selectedId,
            ruleLevel: ruleLevel
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
        queryInfo.page = 1
        await this.setState({
            queryInfo,
            // selectedRadio: []
        })
        this.getTableList()
    }
    cancel = () => {
        this.setState({
            modalVisible: false
        })
    }
    onSelect = async (id) => {
        await this.setState({ selectedId: id })
        await this.reset()
        document.querySelector('.ruleSelectTable').scrollTop = 0
    }
    changeRadio = async (selectedRowKey, selectedRow) => {
        await this.setState({
            selectedRadio: selectedRowKey,
            selectedRow
        })
        Cache.set('bizRuleGroupId', this.state.selectedId)
        this.postData()
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
    changeType = async (value, selectedOptions) => {
        console.log(value, selectedOptions)
        let { queryInfo } = this.state
        queryInfo.ruleTypeId = value ? value : []
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    postData = () => {
        let { selectedRow } = this.state
        this.props.getRuleData(selectedRow[0])
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
            loading,
            ruleLevel,
            tableTypeList,
            typeList,
            ruleTypeList,
            selectedId,
            hoverId
        } = this.state
        const rowSelection = {
            type: 'radio',
            selectedRowKeys: selectedRadio,
            onChange: this.changeRadio,
            columnWidth: 28,
        }
        return (
            <Modal
                className="standardMapDrawer ruleSelectModal"
                title='规则选择'
                width={960}
                visible={modalVisible}
                onCancel={this.cancel}
                maskClosable={false}
                footer={null}
            >
                {modalVisible && (
                    <React.Fragment>
                        <div style={{ display: 'flex', height: '540px' }}>
                            <div className='treeArea HideScroll' style={{ width: 160 }}>
                                <Spin spinning={treeLoading}>
                                    <List
                                        split={false}
                                        dataSource={ruleTypeList}
                                        renderItem={(item) => {
                                            const selected = item.id === selectedId
                                            const hover = item.id === hoverId

                                            return (
                                                <List.Item
                                                    onClick={() => this.onSelect(item.id)}
                                                    className={classNames('RoleItem', selected ? 'SelectedRoleItem' : '', hover ? 'HoveredRoleItem' : '')}
                                                >
                                                    <List.Item.Meta title={<span>{item.name}</span>} />
                                                </List.Item>
                                            )
                                        }}
                                    />
                                </Spin>
                            </div>
                            <div className='tableArea commonScroll ruleSelectTable' style={{ padding: '16px', width: 'calc(100% - 160px)' }}>
                                <TableLayout
                                    disabledDefaultFooter
                                    smallLayout
                                    renderDetail={() => {
                                        return (
                                            <div>
                                                <div style={{ marginBottom: 16 }}>
                                                    <Input.Search
                                                        allowClear
                                                        style={{ width: 280, marginRight: 8 }}
                                                        value={queryInfo.keyword}
                                                        onChange={this.changeKeyword}
                                                        onSearch={this.search}
                                                        placeholder='请输入规则名称'
                                                    />
                                                    <Cascader
                                                        allowClear
                                                        expandTrigger='hover'
                                                        fieldNames={{ label: 'name', value: 'id' }}
                                                        value={queryInfo.ruleTypeId}
                                                        options={ruleLevel == 0 ? typeList : tableTypeList}
                                                        style={{ width: 160, marginRight: 8 }}
                                                        onChange={this.changeType}
                                                        displayRender={(label) => label[label.length - 1]}
                                                        popupClassName='searchCascader'
                                                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                                                        placeholder='规则类型'
                                                    />
                                                    <Button onClick={this.reset}>重置</Button>
                                                </div>
                                                <Table
                                                    loading={loading}
                                                    columns={this.columns}
                                                    rowSelection={rowSelection}
                                                    dataSource={tableData}
                                                    rowKey='id'
                                                    onChange={this.changePage}
                                                    onRow={record => {
                                                        return {
                                                            onClick: async (e) => {
                                                                await this.setState({
                                                                    selectedRadio: [record.id],
                                                                    selectedRow: [record]
                                                                })
                                                                this.postData()
                                                            },
                                                        };
                                                    }}
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