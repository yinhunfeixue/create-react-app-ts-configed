import EmptyLabel from '@/component/EmptyLabel'
import IconFont from '@/component/IconFont'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import TipLabel from '@/component/tipLabel/TipLabel'
import ProjectUtil from '@/utils/ProjectUtil'
import { Button, Divider, Input, message, Modal, Radio, Select, Table, Tag, Tooltip } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { getManualTableDetail, saveManualData } from 'app_api/standardApi'
import React, { Component } from 'react'
import './smartAdd_column.less'

const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input
const confirm = Modal.confirm

export default class AutoCompleteColumn extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            tableData: [],
            columnInfo: {
                columnDataVoList: [],
                tableNameCnRecommandList: [],
            },
            showShadow: false,
            pageSize: 10,
            current: 1,
            showCnameInput: false,
        }
        this.columns = [
            {
                title: '字段英文名',
                dataIndex: 'columnNameEn',
                key: 'columnNameEn',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '字段类型',
                dataIndex: 'dataType',
                key: 'dataType',
                render: (text, record) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '中文名称',
                dataIndex: 'columnNameCn',
                key: 'columnNameCn',
                width: 260,
                render: (text, record, index) => {
                    return <Input value={text} onChange={this.changeColumnName.bind(this, record.key - 1)} placeHolder='请输入中文名称' />
                },
            },
            {
                title: <TipLabel label='中文推荐' tip='中文推荐：字段英文词根对应的中文描述词' />,
                dataIndex: 'way',
                key: 'way',
                className: 'columnTagContent',
                render: (text, record, index) => {
                    return (
                        <div
                            className='tagItemContent'
                            style={{
                                height: !record.showMore ? '27px' : 'auto',
                                overflowY: !record.showMore ? 'hidden' : 'auto',
                            }}
                        >
                            {record.recommandList &&
                                record.recommandList.map((item, index1) => {
                                    return (
                                        <Tooltip title={item.rootName}>
                                            <Tag onClick={this.selectedColumnName.bind(this, record.key - 1, index1)} color='blue'>
                                                {item.rootDesc}
                                            </Tag>
                                        </Tooltip>
                                    )
                                })}
                            {record.showMoreBtn ? (
                                <span
                                    style={{
                                        position: 'absolute',
                                        right: '0px',
                                        top: '3px',
                                    }}
                                >
                                    {!record.showMore ? (
                                        <Button onClick={this.toggleMoreBtn.bind(this, record.key - 1)}>更多</Button>
                                    ) : (
                                        <Button onClick={this.toggleMoreBtn.bind(this, record.key - 1)}>收起</Button>
                                    )}
                                </span>
                            ) : null}
                            {!record.recommandList.length ? <span className='EmptyLabel'>没有推荐的中文内容</span> : null}
                        </div>
                    )
                },
            },
        ]
    }
    componentWillMount = () => {
        this.getTableDetail()
    }

    get pageParam() {
        return ProjectUtil.getPageParam(this.props)
    }

    getTableDetail = async () => {
        let res = await getManualTableDetail({
            tableId: this.pageParam.tableId,
        })
        if (res.code == 200) {
            res.data.tableNameCnRecommandList = res.data.tableNameCnRecommandList ? res.data.tableNameCnRecommandList : []
            res.data.tableNameCn = res.data.tableNameCn ? res.data.tableNameCn : ''
            // recommandList
            res.data.columnDataVoList = this.filteredProjects(res.data.columnDataVoList)
            res.data.columnDataVoList.map((item) => {
                item.columnNameCn = item.columnNameCn ? item.columnNameCn : ''
                item.recommandList = item.recommandList ? item.recommandList : []
            })
            await this.setState({
                columnInfo: res.data,
            })
        }
    }
    // 给数据加上序号
    filteredProjects(data) {
        let newData = []
        this.orderNumber = 0
        _.map(data, (node) => {
            node.key = ++this.orderNumber
            newData.push(node)
        })
        return newData
    }
    toggleMoreBtn = (index) => {
        const { tableData } = this.state
        tableData[index].showMore = !tableData[index].showMore
        this.setState({ tableData })
    }
    showSelect = (record, index, num) => {
        let { columnInfo } = this.state
        let params = { ...record }
        if (params.editable) {
            delete params.editable
        }
        let tableData = [...columnInfo.columnDataVoList]
        tableData = tableData.map((value) => {
            if (value.editable) {
                delete value.editable
            }
            return value
        })
        switch (num) {
            case '0':
                params.editable = 1
                break
            default:
                break
        }
        tableData[index].editable = params.editable
        columnInfo.columnDataVoList = [...tableData]
        this.setState({ columnInfo })
    }

    getToFixedNum = (value) => {
        if (value) {
            return value.toFixed(2).replace(/[.]?0+$/g, '') + '%'
        } else {
            return '0%'
        }
    }
    changeCname = (e) => {
        const { columnInfo } = this.state
        columnInfo.tableNameCn = e.target.value
        this.setState({
            columnInfo,
        })
    }
    changeColumnName = (index, e) => {
        const { columnInfo } = this.state
        columnInfo.columnDataVoList[index].columnNameCn = e.target.value
        this.setState({
            columnInfo,
        })
    }
    selectedTableName = (index) => {
        const { columnInfo, showCnameInput } = this.state
        if (!showCnameInput) {
            return
        }
        columnInfo.tableNameCn = columnInfo.tableNameCn + columnInfo.tableNameCnRecommandList[index].rootDesc
        this.setState({
            columnInfo,
        })
    }
    selectedColumnName = (index, index1) => {
        const { columnInfo } = this.state
        columnInfo.columnDataVoList[index].columnNameCn = columnInfo.columnDataVoList[index].columnNameCn + columnInfo.columnDataVoList[index].recommandList[index1].rootDesc
        this.setState({
            columnInfo,
        })
    }
    postData = async () => {
        const { columnInfo } = this.state
        let query = {
            from: 1,
            columnIdNameCnPairList: columnInfo.columnDataVoList,
            tableId: columnInfo.tableId,
            tableNameCn: columnInfo.tableNameCn,
        }
        this.setState({ saveLoading: true })
        let res = await saveManualData(query)
        if (res.code == 200) {
            message.success('操作成功')
            this.back()
        }
        this.setState({ saveLoading: false })
    }

    back() {
        ProjectUtil.historyBack().catch(() => {
            this.props.addTab('中文信息管理')
        })
    }
    onShowSizeChange = (page, pageSize) => {
        this.setState({
            current: 1,
            pageSize: pageSize,
        })
    }
    changePage = (page) => {
        this.setState({
            current: page,
        })
    }
    showTotal = (total) => {
        const totalPageNum = Math.ceil(total / this.state.pageSize)
        return `共${totalPageNum}页，${total}条数据`
    }
    openCnameInput = () => {
        this.setState({
            showCnameInput: true,
        })
    }
    render() {
        const { tableData, loading, columnInfo, showShadow, pageSize, current, saveLoading, showCnameInput } = this.state
        console.log('props', this.props)
        return (
            <TableLayout
                className='smartAdd_column'
                showFooterControl
                title={`编辑中文信息`}
                renderDetail={() => {
                    return (
                        <React.Fragment>
                            <Module title='基础信息'>
                                <div className='BaseInfo MiniForm'>
                                    <FormItem label='表英文名'>
                                        <span>{columnInfo.tableNameEn}</span>
                                    </FormItem>
                                    <FormItem
                                        label='表中文名'
                                        extra={
                                            columnInfo.tableNameCnRecommandList.length ? (
                                                <div>
                                                    <IconFont type='icon-tuijian' />
                                                    {columnInfo.tableNameCnRecommandList.map((item, index) => {
                                                        return (
                                                            <Tooltip title={item.rootDesc}>
                                                                <Tag onClick={this.selectedTableName.bind(this, index)} color='blue'>
                                                                    {item.rootDesc}
                                                                </Tag>
                                                            </Tooltip>
                                                        )
                                                    })}
                                                </div>
                                            ) : null
                                        }
                                    >
                                        {showCnameInput ? (
                                            <Input value={columnInfo.tableNameCn} onChange={this.changeCname} />
                                        ) : (
                                            <span>
                                                {columnInfo.tableNameCn ? (
                                                    <span>
                                                        {columnInfo.tableNameCn}
                                                        <a style={{ margin: '0px 8px 0px 16px' }} onClick={this.openCnameInput}>
                                                            修改
                                                        </a>
                                                        <a className='iconfont icon-bianjifill'></a>
                                                    </span>
                                                ) : (
                                                    <a onClick={this.openCnameInput}>点击补充</a>
                                                )}
                                            </span>
                                        )}
                                    </FormItem>
                                    <FormItem label='数据库'>
                                        <span>{columnInfo.databaseNameEn}</span>
                                    </FormItem>
                                    <FormItem label='数仓层级'>
                                        <span>{columnInfo.dwLevelName}</span>
                                    </FormItem>
                                </div>
                            </Module>
                            <Divider />
                            <Module title='字段信息'>
                                <div className='BaseInfo MiniForm'>
                                    <FormItem label='中文化比率'>{this.getToFixedNum(columnInfo.nameCnRate * 100)}</FormItem>
                                    <FormItem label='字段总数'>{columnInfo.columnNums}</FormItem>
                                    <FormItem label='待补充中文字段数'>{columnInfo.columnNums - columnInfo.columnNameCnNums}</FormItem>
                                </div>
                                <Table
                                    loading={loading}
                                    columns={this.columns}
                                    pagination={{
                                        showQuickJumper: true,
                                        showSizeChanger: true,
                                        pageSize: this.state.pageSize,
                                        current: this.state.current,
                                        onShowSizeChange: this.onShowSizeChange,
                                        onChange: this.changePage,
                                        showTotal: this.showTotal,
                                        pageSizeOptions: ['10', '20', '30', '40', '50'],
                                    }}
                                    rowClassName={() => 'editable-row'}
                                    dataSource={columnInfo.columnDataVoList}
                                />
                            </Module>
                        </React.Fragment>
                    )
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button type='primary' onClick={this.postData} loading={saveLoading}>
                                {saveLoading ? '保存中' : '保存'}
                            </Button>
                            <Button onClick={() => this.back()} disabled={saveLoading}>
                                取消
                            </Button>
                        </React.Fragment>
                    )
                }}
            />
        )
    }
}
