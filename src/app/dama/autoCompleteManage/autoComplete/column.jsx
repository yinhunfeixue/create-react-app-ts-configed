import EmptyLabel from '@/component/EmptyLabel'
import { InfoCircleFilled } from '@ant-design/icons'
import { Col, Input, message, Modal, Radio, Row, Select, Table, Tag } from 'antd'
import { getManualTableDetail, saveManualData } from 'app_api/standardApi'
import { Button, Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import './index.less'
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
            pageSize: 20,
            current: 1,
        }
        this.columns = [
            {
                dataIndex: 'key',
                key: 'key',
                title: '序号',
                width: 48,
                render: (text, record, index) => <span>{text}</span>,
            },
            {
                title: '字段英文名',
                dataIndex: 'columnNameEn',
                key: 'columnNameEn',
                width: 160,
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '字段类型',
                dataIndex: 'dataType',
                key: 'dataType',
                width: 100,
                render: (text, record) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '中文名称',
                dataIndex: 'columnNameCn',
                key: 'columnNameCn',
                width: 260,
                render: (text, record, index) => {
                    if (record.editable && record.editable == 1) {
                        return (
                            <div>
                                <Input
                                    value={text}
                                    ref={(input) => {
                                        if (input) {
                                            input.focus()
                                        }
                                    }}
                                    onChange={this.changeColumnName.bind(this, record.key - 1)}
                                    style={{ height: '28px' }}
                                    placeHolder='请输入中文名称'
                                />
                            </div>
                        )
                    } else {
                        return (
                            <div className='editable-cell-value-wrap' onClick={this.showSelect.bind(this, record, record.key - 1, '0')}>
                                {text ? text : <EmptyLabel />}
                            </div>
                        )
                    }
                },
            },
            {
                title: (
                    <div>
                        <span>中文推荐</span>
                        <Tooltip placement='topLeft' title='中文推荐：字段英文词根对应的中文描述词'>
                            <InfoCircleFilled
                                style={{
                                    color: 'rgb(119,181,227)',
                                    position: 'absolute',
                                    left: '60px',
                                    bottom: '13px',
                                }}
                            />
                        </Tooltip>
                    </div>
                ),
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
                            {!record.recommandList.length ? (
                                <span
                                    style={{
                                        color: '#b3b3b3',
                                        fontSize: '12px',
                                    }}
                                >
                                    没有推荐的中文内容
                                </span>
                            ) : null}
                        </div>
                    )
                },
            },
        ]
    }
    componentWillMount = () => {
        this.getTableDetail()
    }
    getShowShadow = () => {
        const { columnInfo } = this.state
        let tableHeight = (columnInfo.columnDataVoList.length + 1) * 40
        let pageHeight = document.querySelector('.exam_container_right').clientHeight - 240
        console.log(tableHeight, pageHeight, 'pageHeight')
        if (tableHeight > pageHeight) {
            this.setState({
                showShadow: true,
            })
        } else {
            this.setState({
                showShadow: false,
            })
        }
    }
    getTableDetail = async () => {
        let res = await getManualTableDetail({
            tableId: this.props.location.state.tableId,
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
            this.showWrap()
            this.getShowShadow()
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
    //  显示展开或收起
    showWrap = () => {
        let ele = document.querySelector('.columnTagContent')
        let tableWidth = parseInt(window.getComputedStyle(ele).width) - 50
        let tagList = document.querySelectorAll('.tagItemContent')
        const { tableData } = this.state
        tableData.map((item, index) => {
            item.showMore = false
            item.showMoreBtn = false
            if (item.tagList.length) {
                console.log(parseInt(window.getComputedStyle(tagList[index]).width), 'showWrap')
                if (parseInt(window.getComputedStyle(tagList[index]).width) > tableWidth) {
                    item.showMoreBtn = true
                }
            }
        })
        console.log(tableWidth, 'tableWidth')
        this.setState({ tableData })
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
        const { columnInfo } = this.state
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
        let res = await saveManualData(query)
        if (res.code == 200) {
            message.success('操作成功')
            // this.props.removeTab('编辑中文信息')
            this.props.addTab('手动添加')
        }
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
    render() {
        const { tableData, loading, columnInfo, showShadow, pageSize, current } = this.state
        return (
            <div className='commonTablePage autoComplete_column'>
                <Row gutter={80} style={{ color: '#333' }}>
                    <Col
                        style={{
                            width: 'auto',
                            fontSize: '14px',
                            color: '#333',
                        }}
                        span={6}
                        title={columnInfo.tableNameEn}
                    >
                        <span style={{ color: '#666' }}>表英文名：</span>
                        {columnInfo.tableNameEn}
                    </Col>
                    <Col
                        style={{
                            width: 'auto',
                            fontSize: '14px',
                            color: '#333',
                        }}
                        span={6}
                        title={columnInfo.databaseNameEn}
                    >
                        <span style={{ color: '#666' }}>数据库：</span>
                        {columnInfo.databaseNameEn}
                    </Col>
                    <Col span={6} style={{ fontSize: '14px', color: '#333' }}>
                        <span style={{ color: '#666' }}>数仓层级：</span>
                        {columnInfo.dwLevelName}
                    </Col>
                    <Col style={{ fontSize: '14px', color: '#333' }} span={24}>
                        <span style={{ color: '#666' }}>表中文名：</span>
                        <Input onChange={this.changeCname} value={columnInfo.tableNameCn} style={{ width: '400px' }} placeHolder='请输入表中文名' />
                        <div style={{ margin: '8px 0px 8px 70px' }}>
                            <span style={{ color: '#b3b3b3', fontSize: '12px' }}>
                                中文推荐：
                                {!columnInfo.tableNameCnRecommandList.length ? '没有推荐的中文内容' : null}
                            </span>
                            {columnInfo.tableNameCnRecommandList.map((item, index) => {
                                return (
                                    <Tooltip title={item.rootName}>
                                        <Tag onClick={this.selectedTableName.bind(this, index)} color='blue'>
                                            {item.rootDesc}
                                        </Tag>
                                    </Tooltip>
                                )
                            })}
                        </div>
                    </Col>
                </Row>
                <Row gutter={40} style={{ color: '#666' }}>
                    <Col style={{ width: 'auto' }} span={6}>
                        中文化比率：
                        {this.getToFixedNum(columnInfo.nameCnRate * 100)}
                    </Col>
                    <Col style={{ width: 'auto' }} span={6}>
                        字段总数：{columnInfo.columnNums}
                    </Col>
                    <Col span={6}>
                        待补充中文字段数：
                        {columnInfo.columnNums - columnInfo.columnNameCnNums}
                    </Col>
                </Row>
                <div style={{ paddingBottom: '40px' }}>
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
                        bordered
                        rowClassName={() => 'editable-row'}
                        dataSource={columnInfo.columnDataVoList}
                    />
                </div>
                <div
                    className='saveBtn'
                    style={{
                        boxShadow: showShadow ? '0px 2px 14px 1px rgba(0, 0, 0, 0.1)' : 'none',
                    }}
                >
                    <Button onClick={this.postData} type='primary'>
                        提交保存
                    </Button>
                </div>
            </div>
        )
    }
}
