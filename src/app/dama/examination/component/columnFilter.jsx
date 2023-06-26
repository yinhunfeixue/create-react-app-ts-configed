import { Button, Col, Divider, Input, Modal, Row, Spin, Tooltip } from 'antd'
import { searchColumnField } from 'app_api/examinationApi'
import React, { Component } from 'react'
const { TextArea } = Input
const filterList = ['+', '-', 'x', '/', 'line', '(', ')', 'line', '<', '>', '>=', '<=', '!=', '=', 'line', 'NULL', 'and', 'or', 'in']

export default class ColumnFilter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            value: '',
            btnLoading: false,
            queryInfo: {
                query: '',
                page: 1,
                pageSize: 20,
            },
            dataSource: [],
            tableLoading: false,
            hasError: '',
            columnId: '',
        }
    }
    componentWillMount = () => {}
    openModal = async (value, tableId, columnId) => {
        let { queryInfo } = this.state
        queryInfo.page = 1
        queryInfo.tableId = tableId
        await this.setState({
            modalVisible: true,
            dataSource: [],
            value,
            queryInfo,
            columnId,
            hasError: '',
        })
        this.getColumnList()
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    checkSql = async () => {
        // let { columnId, value } = this.state
        // let query = {
        //     columnId: columnId,
        //     expression: value
        // }
        // let res = await checkExpression(query)
        // if (res.code == 200) {
        //     this.setState({
        //         hasError: ''
        //     })
        // } else {
        //     this.setState({
        //         hasError: res.msg
        //     })
        // }
    }
    postData = () => {
        this.cancel()
        this.props.getFilterParam(this.state.value)
    }
    changeKeyword = (e) => {
        let { queryInfo } = this.state
        queryInfo.query = e.target.value
        this.setState({
            queryInfo,
        })
    }
    getColumnList = async () => {
        let { queryInfo, dataSource } = this.state
        this.setState({ tableLoading: true })
        let res = await searchColumnField(queryInfo)
        this.setState({ tableLoading: false })
        if (res.code == 200) {
            dataSource = dataSource.concat(res.data)
            await this.setState({
                dataSource,
            })
        }
    }
    onScrollEvent = async () => {
        let { queryInfo } = this.state
        if (this.scrollRef.scrollTop + this.scrollRef.clientHeight === this.scrollRef.scrollHeight) {
            console.info('到底了！')
            queryInfo.page++
            await this.setState({ queryInfo })
            this.getColumnList()
        }
    }
    search = async () => {
        let { queryInfo } = this.state
        queryInfo.page = 1
        await this.setState({
            queryInfo,
            dataSource: [],
        })
        this.getColumnList()
    }
    addFilter = async (data) => {
        let { value } = this.state
        await this.setState({
            value: value + data,
        })
        this.checkSql()
    }
    addColumn = async (data) => {
        let { value } = this.state
        await this.setState({
            value: value + data.physical_field,
        })
        this.checkSql()
    }
    changeValue = async (e) => {
        await this.setState({
            value: e.target.value,
        })
        this.checkSql()
    }
    render() {
        const { value, btnLoading, modalVisible, queryInfo, dataSource, tableLoading, hasError } = this.state
        return (
            <Modal
                width={960}
                className='columnFilterModal'
                title='设置过滤条件'
                visible={modalVisible}
                onCancel={this.cancel}
                footer={[
                    <Button key='back' onClick={this.cancel}>
                        取消
                    </Button>,
                    <Button disabled={hasError} onClick={this.postData} key='submit' type='primary'>
                        确定
                    </Button>,
                ]}
            >
                {modalVisible ? (
                    <Row className='columnFilter'>
                        <Col span={7} style={{ borderRight: '1px solid #E6E8ED' }}>
                            <div className='filterTitle filterLeftTitle'>
                                <Input.Search allowClear value={queryInfo.query} onChange={this.changeKeyword} onSearch={this.search} placeholder='请输入关键词' />
                            </div>
                            {/* 字段列表 */}
                            <div className='filterLeft' ref={(dom) => (this.scrollRef = dom)} onScrollCapture={this.onScrollEvent}>
                                <Spin spinning={tableLoading}>
                                    {dataSource.map((item) => {
                                        return (
                                            <Tooltip placement='topLeft' title={item.physical_field + (item.physical_field_desc ? '（' + item.physical_field_desc + ')' : '')}>
                                                <div
                                                    onClick={this.addColumn.bind(this, item)}
                                                    className='columnItem'
                                                    dangerouslySetInnerHTML={{ __html: item.physical_field_highlight + (item.physical_field_desc ? '（' + item.physical_field_desc + ')' : '') }}
                                                ></div>
                                            </Tooltip>
                                        )
                                    })}
                                </Spin>
                            </div>
                        </Col>
                        {/* 右侧 */}
                        <Col span={17}>
                            {/* 顶部关键词 */}
                            <div className='filterTitle filterRightTitle'>
                                {filterList.map((item) => {
                                    if (item == 'line') {
                                        return <Divider style={{ margin: '6px 0px 6px 8px' }} type='vertical' />
                                    } else {
                                        return (
                                            <div onClick={this.addFilter.bind(this, item)} className='filter'>
                                                {item}
                                            </div>
                                        )
                                    }
                                })}
                            </div>
                            <div className={hasError ? 'filterRight hasError' : 'filterRight'}>
                                <TextArea onChange={this.changeValue} value={value} />
                            </div>
                        </Col>
                    </Row>
                ) : null}
            </Modal>
        )
    }
}
