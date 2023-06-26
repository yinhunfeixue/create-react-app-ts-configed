import EmptyLabel from '@/component/EmptyLabel'
import { Button, Col, Input, message, Row, Select, Table, Tooltip } from 'antd'
import { databaseList, searchColumnField } from 'app_api/examinationApi'
import { getSourceList } from 'app_api/metadataApi'
import React, { Component } from 'react'

export default class BatchTransfer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            queryInfo: {
                query: '',
                page: 1,
                pageSize: 10,
                ignoreProducts: ['MONGODB']
            },
            sourceList: [],
            baseList: [],
            columnEntityList: [],
            total: 0,
            dataSource: [],
            tableLoading: false
        }
        this.columns = [
            {
                title: '字段英文名',
                dataIndex: 'physical_field_highlight',
                key: 'physical_field_highlight',
                ellipsis: true,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={this.renderTooltip(text)}><span dangerouslySetInnerHTML={{ __html: text }}></span></Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '数据表',
                dataIndex: 'physical_table',
                key: 'physical_table',
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
                title: '数据库',
                dataIndex: 'physical_db',
                key: 'physical_db',
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
                title: '数据源',
                dataIndex: 'datasource_name',
                key: 'datasource_name',
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
                title: '操作',
                width: 100,
                render: (_, record, index) => {
                    if (record.checked) {
                        return [
                            <a
                                key='detail'
                            >
                                已选择
                            </a>
                        ]
                    } else {
                        return [
                            <a
                                onClick={this.addNewData.bind(
                                    this,
                                    record
                                )}
                                key='detail'
                            >
                                选择
                            </a>
                        ]
                    }
                },
            }
        ]
    }
    componentWillMount = () => {
        this.getSourceData()
        this.getTableList()
    }
    getSourceData = async () => {
        let res = await getSourceList({ignoreProducts: 'MONGODB', sourceType: 1})
        if (res.code == 200) {
            this.setState({
                sourceList: res.data,
            })
        }
    }
    getDatabaseList = async () => {
        let { queryInfo } = this.state
        let query = {
            datasourceId: queryInfo.datasourceId,
            page: 1,
            page_size: 10000,
        }
        let res = await databaseList(query)
        if (res.code == 200) {
            this.setState({
                baseList: res.data,
            })
        }
    }
    renderTooltip = (value) => {
        return <a style={{ color: '#fff' }} dangerouslySetInnerHTML={{ __html: value }}></a>
    }
    changeStatus = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo
        })
        if (name == 'datasourceId') {
            queryInfo.databaseId = undefined
            this.setState({
                queryInfo
            })
            this.getDatabaseList()
        }
        this.search()
    }
    changeKeyword = (e) => {
        let { queryInfo } = this.state
        queryInfo.query = e.target.value
        this.setState({
            queryInfo
        })
    }
    search = async () => {
        let { queryInfo } = this.state
        queryInfo.page = 1
        await this.setState({
            queryInfo,
            dataSource: []
        })
        this.getTableList()
    }
    getTableList = async () => {
        let { queryInfo, dataSource } = this.state
        this.setState({tableLoading: true})
        let res = await searchColumnField(queryInfo)
        this.setState({tableLoading: false})
        if (res.code == 200) {
            dataSource = dataSource.concat(res.data)
            await this.setState({
                total: res.total,
                dataSource
            })
            this.getCheckStatus()
        }
    }
    onScrollEvent = async () => {
        // let { queryInfo } = this.state
        // if (this.scrollRef.scrollTop + this.scrollRef.clientHeight === this.scrollRef.scrollHeight) {
        //     console.info('到底了！');
        //     queryInfo.page ++
        //     await this.setState({queryInfo})
        //     this.getTableList()
        // }
    }
    nextPage = async () => {
        let { queryInfo } = this.state
        queryInfo.page ++
        await this.setState({queryInfo})
        this.getTableList()
    }
    addNewData = async (data) => {
        let { columnEntityList } = this.state
        const include = columnEntityList.find(item => item.columnId === data.id)
        if (include) {
            message.info('此项已选选择');
            return;
        }
        columnEntityList.push({
            columnId: data.id,
            columnName: data.physical_field,
            tableId: data.physical_table_id,
            tableName: data.physical_table,
            databaseId: data.database_id,
            databaseName: data.physical_db,
            datasourceId: data.datasource_id,
            datasourceName: data.datasource_name,
        })
        await this.setState({
            columnEntityList
        })
        this.getCheckStatus()
        this.props.getColumnEntityList(columnEntityList)
    }
    deleteData = async (index) => {
        let { columnEntityList } = this.state
        columnEntityList.splice(index, 1)
        await this.setState({
            columnEntityList
        })
        this.getCheckStatus()
        this.props.getColumnEntityList(columnEntityList)
    }
    getCheckStatus = () => {
        let { columnEntityList, dataSource } = this.state
        dataSource.map((column) => {
            column.checked = false
            columnEntityList.map((item) => {
                if (column.id == item.columnId) {
                    column.checked = true
                }
            })
        })
        this.setState({
            dataSource
        })
    }
    render() {
        const {
            sourceList,
            baseList,
            queryInfo,
            columnEntityList,
            dataSource,
            tableLoading,
            total,
        } = this.state
        return (
            <Row className='batchTransfer'>
                <Col span={18} style={{ borderRight: '1px solid #E6E8ED' }}>
                    <div className='transferTitle'>批量选择检核字段</div>
                    <div className='transferLeft'>
                        <Row gutter={8} style={{ marginBottom: 12, padding: '0 16px' }}>
                            <Col span={12}>
                                <Input.Search
                                    allowClear
                                    value={queryInfo.query}
                                    onChange={this.changeKeyword}
                                    onSearch={this.search}
                                    placeholder='请输入字段英文名或中文名'
                                />
                            </Col>
                            <Col span={6}>
                                <Select allowClear showSearch optionFilterProp='title' placeholder='数据源' value={queryInfo.datasourceId} onChange={this.changeStatus.bind(this, 'datasourceId')}>
                                    {sourceList.map((item) => {
                                        return (
                                            <Select.Option title={item.identifier} key={item.id} value={item.id}>
                                                {item.identifier}
                                            </Select.Option>
                                        )
                                    })}
                                </Select>
                            </Col>
                            <Col span={6}>
                                <Select allowClear showSearch optionFilterProp='title' placeholder='数据库' value={queryInfo.databaseId} onChange={this.changeStatus.bind(this, 'databaseId')}>
                                    {baseList.map((item) => {
                                        return (
                                            <Select.Option title={item.physicalDatabase} key={item.id} value={item.id}>
                                                {item.physicalDatabase}
                                            </Select.Option>
                                        )
                                    })}
                                </Select>
                            </Col>
                        </Row>
                        <div className='tableArea HideScroll' ref={dom => this.scrollRef = dom} onScrollCapture={this.onScrollEvent}>
                            <Table
                                loading={tableLoading}
                                columns={this.columns}
                                dataSource={dataSource}
                                rowKey="id"
                                pagination={false}  />
                            {
                                total > 10 ? <Button onClick={this.nextPage} type="link" block>下一页</Button> : null
                            }
                        </div>
                    </div>
                </Col>
                <Col span={6}>
                    <div className='transferTitle'>已添加检核字段（{columnEntityList.length}）</div>
                    <div className='transferRight HideScroll'>
                        {
                            columnEntityList.length?
                                <div>
                                    {
                                        columnEntityList.map((item, index) => {
                                            return (
                                                <Row className='columnItem'>
                                                    <Col className='columnTitle' span={18}>
                                                        <Tooltip placement='topLeft' title=''><div>{item.columnName}</div></Tooltip>
                                                        <Tooltip placement='topLeft' title=''><div style={{ color: '#9EA3A8' }}>{item.tableName}</div></Tooltip>
                                                    </Col>
                                                    <Col className='columnBtn' span={6}>
                                                        <a onClick={this.deleteData.bind(this, index)}>移除</a>
                                                    </Col>
                                                </Row>
                                            )
                                        })
                                    }
                                </div>
                                :
                                <div className='emptyTip'>
                                    <img src={require('app_images/exam/finger.png')} />
                                    <div>请先在左侧选择字段</div>
                                </div>
                        }
                    </div>
                </Col>
            </Row>
        )
    }
}