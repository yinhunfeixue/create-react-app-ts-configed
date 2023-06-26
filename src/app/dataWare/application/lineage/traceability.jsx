import EmptyLabel from '@/component/EmptyLabel'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import ProjectUtil from '@/utils/ProjectUtil'
import { DownloadOutlined } from '@ant-design/icons'
import { Button, Card, Divider, Form, Input, message, Switch as MySwitch, Radio, Select, Spin, Table, Tabs, Tooltip } from 'antd'
import {
    getColumnDown,
    getColumnGraph,
    getColumnLevel,
    getDwLevel,
    getResultColumnList,
    getResultTableList,
    getTableDown,
    getTableGraph,
    getTableLevel,
    getTraceabilityColumn,
    getTraceabilityDatabase,
    getTraceabilityTable
} from 'app_api/dataAssetApi'
import Graph from 'app_page/dama/component/g6Graph/apply.jsx'
import _ from 'lodash'
import { observer } from 'mobx-react'
import React, { Component } from 'react'

const { Option } = Select
const { TabPane } = Tabs

const formItemLayout = {
    labelCol: {
        span: 3,
    },
    wrapperCol: {
        span: 20,
    },
}
@observer
class analysis extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableParams: {
                total: 0,
                pageSize: 10,
            },
            columParams: {
                total: 0,
                pageSize: 10,
            },
            databaseList: [],
            tableList: [],
            columnList: [],
            selLevelList: [],
            selTableList: [],
            selColumnList: [],
            resultTableList: [],
            resultColumnList: [],
            tableGraph: [],
            columnGraph: [],
            graphLoading: false,
            tabKey: '1',
            isShowRes: 'none',
        }

        this.tableColumns = [
            {
                dataIndex: 'levelName',
                key: 'levelName',
                title: '血缘层级',
                width: '10%',
                // fixed: 'left',
            },
            {
                dataIndex: 'sourceTableName',
                key: 'sourceTableName',
                title: '表名称（来源）',
                width: '20%',
                render: (text) =>
                    text ? (
                        <Tooltip title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'sourceDatabaseName',
                key: 'sourceDatabaseName',
                title: '所属库（来源）',
                width: '14%',
                render: (text) => `/${text}` || <EmptyLabel />,
            },
            {
                dataIndex: 'sourceDwLevelName',
                key: 'sourceDwLevelName',
                title: '数仓层级（来源)',
                width: '14%',
                render: (text) => text || <EmptyLabel />,
            },
            {
                dataIndex: 'targetTableName',
                key: 'targetTableName',
                title: '表名称（目标）',
                width: '20%',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                dataIndex: 'targetDatabaseName',
                key: 'targetDatabaseName',
                title: '所属库（目标）',
                width: '14%',
                render: (text) => `/${text}` || <EmptyLabel />,
            },
            {
                dataIndex: 'fileName',
                key: 'fileName',
                title: '来源脚本',
                width: '24%',
                fixed: 'right',
                render: (text) =>
                    text ? (
                        <Tooltip title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]

        this.columColumns = [
            {
                dataIndex: 'levelName',
                key: 'levelName',
                width: '10%',
                title: '血缘层级',
            },
            {
                dataIndex: 'sourceColumnName',
                key: 'sourceColumnName',
                title: '字段名称（来源）',
                width: '15%',
                render: (text) =>
                    text ? (
                        <Tooltip title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'sourceTableName',
                key: 'sourceTableName',
                title: '表名称（来源）',
                width: '16%',
                render: (text) =>
                    text ? (
                        <Tooltip title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'sourceDatabaseName',
                key: 'sourceDatabaseName',
                title: '所属库（来源）',
                width: '14%',
                render: (text) =>
                    text ? (
                        <Tooltip title={text}>
                            <span className='LineClamp'>/{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'sourceDwLevelName',
                key: 'sourceDwLevelName',
                title: '数仓层级（来源)',
                width: '14%',
                render: (text) => text || <EmptyLabel />,
            },
            {
                dataIndex: 'targetColumnName',
                key: 'targetColumnName',
                title: '字段名称（目标）',
                width: '15%',
                render: (text) =>
                    text ? (
                        <Tooltip title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'targetTableName',
                key: 'targetTableName',
                title: '表名称（目标）',
                width: '16%',
                render: (text) =>
                    text ? (
                        <Tooltip title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'targetDatabaseName',
                key: 'targetDatabaseName',
                title: '所属库（目标）',
                width: '16%',
                render: (text) =>
                    text ? (
                        <Tooltip title={text}>
                            <span className='LineClamp'>/{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'fileName',
                key: 'fileName',
                title: '来源脚本',
                width: '16%',
                fixed: 'right',
                render: (text) =>
                    text ? (
                        <Tooltip title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
        ]

        this.myBox = React.createRef()
    }

    componentDidMount = () => {
        this.getDataBase()
        // test
        // this.getTableGraphData()
        // this.setState({
        //     graphWidth: this.myBox.current.offsetWidth - 10,
        // })
    }

    getLevelData = async () => {
        let res = await getDwLevel({ needTag: false })
        if ((res.code = 200)) {
            this.setState({
                selLevelList: res.data,
            })
        }
    }

    getTableData = async () => {
        let res = await getTableLevel({
            tableId: this.form.getFieldValue('table'),
        })
        if ((res.code = 200)) {
            this.setState({
                selTableList: res.data,
            })
        }
    }

    getColumnData = async () => {
        let res = await getColumnLevel({
            columnId: this.form.getFieldValue('column'),
        })
        if ((res.code = 200)) {
            this.setState({
                selColumnList: res.data,
            })
        }
    }

    getDataBase = async () => {
        let res = await getTraceabilityDatabase({})
        if ((res.code = 200)) {
            this.setState({
                databaseList: res.data,
            })
        }
    }

    databaseChange = (value) => {
        this.getTable(value)
        this.form.resetFields(['table', 'column'])
    }

    tableChange = (value) => {
        this.getColumn(value)
        this.form.resetFields(['column'])
    }

    getTable = async (id) => {
        let res = await getTraceabilityTable({
            databaseId: id,
        })
        if ((res.code = 200)) {
            this.setState({
                tableList: res.data,
            })
        }
    }

    getColumn = async (id) => {
        let res = await getTraceabilityColumn({
            tableId: id,
        })
        if ((res.code = 200)) {
            this.setState({
                columnList: res.data,
            })
        }
    }

    handleSubmit = (values) => {
        if (_.isEmpty(values.database)) {
            message.destroy()
            message.error('数据库必选')
            return
        }
        if (_.isEmpty(values.table)) {
            message.destroy()
            message.error('表必选')
            return
        }
        if (_.isEmpty(values.column) && values.obj === '2') {
            message.destroy()
            message.error('字段必选')
            return
        }
        const isTable = _.get(values, 'obj') === '1'
        if (isTable) {
            this.tableListChange()
            this.getTableGraphData()
            this.getTableData()
        } else {
            this.columnListChange()
            this.getColumnGraphData()
            this.getColumnData()
        }

        this.getLevelData()
        this.setState({
            isShowRes: 'block',
        })
    }

    tableListChange = async (params = {}) => {
        let query = {
            id: this.form.getFieldValue('table'),
            level: this.form.getFieldValue('level') || '',
            dwLevel: this.form.getFieldValue('dwLevel') || '',
            keyword: this.form.getFieldValue('keyword') || '',
            page: _.get(params, 'current', 1),
            pageSize: _.get(params, 'pageSize', 10),
        }

        let res = await getResultTableList(query)

        if ((res.code = 200)) {
            this.setState({
                resultTableList: res.data,
                tableParams: {
                    total: res.total,
                    pageSize: _.get(params, 'pageSize', 10),
                },
            })
        }
    }

    columnListChange = async (params = {}) => {
        let query = {
            id: this.form.getFieldValue('column'),
            level: this.form.getFieldValue('level') || '',
            dwLevel: this.form.getFieldValue('dwLevel') || '',
            keyword: this.form.getFieldValue('keyword') || '',
            page: _.get(params, 'current', 1),
            pageSize: _.get(params, 'pageSize', 10),
        }

        let res = await getResultColumnList(query)
        if ((res.code = 200)) {
            this.setState({
                resultColumnList: res.data,
                columParams: {
                    total: res.total,
                    pageSize: _.get(params, 'pageSize', 10),
                },
            })
        }
    }

    getTableGraphData = async () => {
        this.setState({
            graphLoading: true,
        })
        let res = await getTableGraph({
            tableId: this.form.getFieldValue('table'),
        })
        if ((res.code = 200)) {
            this.setState({
                tableGraph: res.data,
            })
        }
        this.setState({
            graphLoading: false,
        })
    }

    getColumnGraphData = async () => {
        this.setState({
            graphLoading: true,
        })
        let res = await getColumnGraph({
            columnId: this.form.getFieldValue('column'),
        })
        if ((res.code = 200)) {
            this.setState({
                columnGraph: res.data,
            })
        }
        this.setState({
            graphLoading: false,
        })
    }

    onSearch = (async) => {
        if (this.form.getFieldValue('obj') === '1') {
            this.tableListChange({})
        } else {
            this.columnListChange({})
        }
    }

    onReset = (async) => {
        this.form.resetFields(['dwLevel', 'level', 'keyword'])
        this.onSearch()
    }

    radioChange = async (event) => {
        console.log('event', event)
        this.form.resetFields()
        this.form.setFieldsValue({
            obj: event.target.value,
        })

        this.setState({
            resultTableList: [],
            resultColumnList: [],
            tableGraph: [],
            columnGraph: [],
            isShowRes: 'none',
        })
    }

    onChange = (checked) => {
        const isTable = this.form.getFieldValue('obj') === '1'
        if (checked) {
            if (isTable) {
                this.ChildTable.showOpen()
            } else {
                this.ChildColumn.showOpen()
            }
        } else {
            if (isTable) {
                this.ChildTable.showClose()
            } else {
                this.ChildColumn.showClose()
            }
        }
    }

    toDownload = async () => {
        const isTable = this.form.getFieldValue('obj') === '1'
        let query = {
            id: isTable ? this.form.getFieldValue('table') : this.form.getFieldValue('column'),
        }

        let res = {}

        if (isTable) {
            res = await getTableDown(query)
        } else {
            res = await getColumnDown(query)
        }
    }

    refresh = () => {
        const isTable = this.form.getFieldValue('obj') === '1'
        if (isTable) {
            this.ChildTable.refresh()
        } else {
            this.ChildColumn.refresh()
        }
    }

    small = () => {
        const isTable = this.form.getFieldValue('obj') === '1'
        if (isTable) {
            this.ChildTable.small()
        } else {
            this.ChildColumn.small()
        }
    }

    large = () => {
        const isTable = this.form.getFieldValue('obj') === '1'
        if (isTable) {
            this.ChildTable.large()
        } else {
            this.ChildColumn.large()
        }
    }

    tabChange = (tabKey) => {
        this.setState({
            tabKey,
        })
    }

    render() {
        const {
            databaseList,
            tableList,
            columnList,
            resultTableList,
            resultColumnList,
            tableParams,
            columParams,
            tableGraph,
            columnGraph,
            selLevelList,
            selTableList,
            selColumnList,
            graphLoading,
            graphWidth,
            tabKey,
            isShowRes,
        } = this.state

        let isTable = true
        let levelList = selTableList
        let disable = false
        let getFieldValue
        if (this.form) {
            getFieldValue = this.form.getFieldValue
            isTable = getFieldValue('obj') === '1'
            console.log('render', this.form, getFieldValue('obj'))
            levelList = isTable ? selTableList : selColumnList
            disable = isTable ? getFieldValue('database') && getFieldValue('table') : getFieldValue('database') && getFieldValue('table') && getFieldValue('column')
        }
        return (
            <Form
                className='VControlGroup traceability'
                onFinish={this.handleSubmit}
                ref={(target) => (this.form = target)}
                initialValues={{
                    obj: '1',
                }}
            >
                <TableLayout
                    title='溯源分析'
                    disabledDefaultFooter
                    renderDetail={() => {
                        return (
                            <React.Fragment>
                                <Module title='溯源对象'>
                                    <Form.Item
                                        label='对象类型'
                                        name='obj'
                                        rules={[
                                            {
                                                require: true,
                                                message: '对象不能为空',
                                            },
                                        ]}
                                    >
                                        <Radio.Group onChange={this.radioChange}>
                                            <Radio value='1'>表</Radio>
                                            <Radio value='2'>字段</Radio>
                                        </Radio.Group>
                                    </Form.Item>
                                    <Form.Item label={isTable ? '选择表' : '选择字段'}>
                                        <div className='HControlGroup'>
                                            <Form.Item noStyle name='database'>
                                                <Select
                                                    showSearch
                                                    style={{
                                                        width: 240,
                                                    }}
                                                    placeholder='请选择数据库'
                                                    onChange={this.databaseChange}
                                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                >
                                                    {databaseList.map((value, index) => {
                                                        return <Option value={value.id}>{value.physicalDatabase}</Option>
                                                    })}
                                                </Select>
                                            </Form.Item>
                                            <Form.Item noStyle name='table'>
                                                <Select
                                                    showSearch
                                                    style={{
                                                        width: 240,
                                                    }}
                                                    placeholder='请选择表'
                                                    onChange={this.tableChange}
                                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                >
                                                    {tableList.map((value, index) => {
                                                        return <Option value={value.id}>{value.physicalTable}</Option>
                                                    })}
                                                </Select>
                                            </Form.Item>
                                            {!isTable && (
                                                <Form.Item noStyle name='column'>
                                                    <Select
                                                        showSearch
                                                        style={{
                                                            width: 240,
                                                        }}
                                                        placeholder='请选择字段'
                                                        onChange={() => {
                                                            this.forceUpdate()
                                                        }}
                                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                    >
                                                        {columnList.map((value, index) => {
                                                            return <Option value={value.id}>{value.physicalField}</Option>
                                                        })}
                                                    </Select>
                                                </Form.Item>
                                            )}
                                            <Form.Item noStyle name='button'>
                                                <Button type='primary' disabled={!disable} htmlType='submit'>
                                                    溯源分析
                                                </Button>
                                            </Form.Item>
                                        </div>
                                    </Form.Item>
                                    {/* </Form> */}
                                </Module>
                            </React.Fragment>
                        )
                    }}
                />
                {isShowRes === 'block' && (
                    <Module
                        Module
                        title='溯源结果'
                        renderHeaderExtra={() => {
                            return (
                                <Button type='primary' ghost icon={<DownloadOutlined />} onClick={this.toDownload}>
                                    下载数据
                                </Button>
                            )
                        }}
                    >
                        <Tabs onChange={this.tabChange} animated={false}>
                            <TabPane tab='血缘图' key='1'>
                                <Card
                                    size='large'
                                    className='card_result'
                                    extra={
                                        <div className='graph_action_icon'>
                                            <div
                                                style={{
                                                    display: tabKey === '1' ? 'inline-block' : 'none',
                                                }}
                                            >
                                                展示全链路 <MySwitch onChange={this.onChange} checkedChildren='开' unCheckedChildren='关' />
                                            </div>
                                            <Divider type='vertical' />
                                            <Tooltip title='重置'>
                                                <img
                                                    onClick={this.refresh}
                                                    style={{
                                                        marginRight: '13px',
                                                        width: '16px',
                                                        cursor: 'pointer',
                                                    }}
                                                    src={require('app_images/dataAsset/chongzhi.png')}
                                                />
                                            </Tooltip>
                                            <Tooltip title='放大'>
                                                <img
                                                    onClick={this.large}
                                                    style={{
                                                        marginRight: '13px',
                                                        width: '16px',
                                                        cursor: 'pointer',
                                                    }}
                                                    src={require('app_images/dataAsset/large.png')}
                                                />
                                            </Tooltip>
                                            <Tooltip title='缩小'>
                                                <img
                                                    onClick={this.small}
                                                    style={{
                                                        marginRight: '13px',
                                                        width: '16px',
                                                        cursor: 'pointer',
                                                    }}
                                                    src={require('app_images/dataAsset/small.png')}
                                                />
                                            </Tooltip>
                                        </div>
                                    }
                                    style={{
                                        marginTop: '16px',
                                        minHeight: '650px',
                                    }}
                                    title={
                                        <div className='link_box_title'>
                                            源头表{' '}
                                            <div
                                                className='link_box'
                                                style={{
                                                    backgroundColor: '#FF9933',
                                                }}
                                            ></div>
                                            溯源表{' '}
                                            <div
                                                className='link_box'
                                                style={{
                                                    backgroundColor: '#41BFD9',
                                                }}
                                            ></div>
                                        </div>
                                    }
                                >
                                    <Spin spinning={graphLoading}>
                                        <div
                                            style={{
                                                marginTop: '10px',
                                                display: isTable ? 'block' : 'none',
                                            }}
                                        >
                                            <Graph onRef={(c) => (this.ChildTable = c)} id={getFieldValue('table')} data={tableGraph} height={500} width={graphWidth} type='table' />
                                        </div>
                                        <div
                                            style={{
                                                marginTop: '10px',
                                                display: isTable ? 'none' : 'block',
                                            }}
                                        >
                                            <Graph onRef={(c) => (this.ChildColumn = c)} width={graphWidth} data={columnGraph} type='column' height={500} id={getFieldValue('column')} />
                                        </div>
                                    </Spin>
                                </Card>
                            </TabPane>
                            <TabPane tab='结果表' key='2'>
                                <div className='HControlGroup'>
                                    <Form.Item noStyle name='keyword'>
                                        <Input.Search onSearch={this.onSearch} allowClear placeholder={`输入${isTable ? '表' : '字段'}名称（来源/目标）`} onPressEnter={this.onSearch} />
                                    </Form.Item>
                                    <Form.Item noStyle name='dwLevel'>
                                        <Select
                                            onChange={() => {
                                                setTimeout(this.onSearch, 100)
                                            }}
                                            allowClear
                                            placeholder='数仓层级'
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        >
                                            {selLevelList.map((value, index) => {
                                                return <Option value={value.id}>{value.name}</Option>
                                            })}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item noStyle name='level'>
                                        {isTable ? (
                                            <Select
                                                allowClear
                                                placeholder='血缘层级'
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                onChange={() => {
                                                    setTimeout(this.onSearch, 100)
                                                }}
                                            >
                                                {selTableList.map((value, index) => {
                                                    return <Option value={value.level}>{value.levelName}</Option>
                                                })}
                                            </Select>
                                        ) : (
                                            <Select
                                                allowClear
                                                placeholder='血缘层级'
                                                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                                onChange={() => {
                                                    setTimeout(this.onSearch, 100)
                                                }}
                                            >
                                                {selColumnList.map((value, index) => {
                                                    return <Option value={value.level}>{value.levelName}</Option>
                                                })}
                                            </Select>
                                        )}
                                    </Form.Item>
                                    <Button onClick={this.onReset}>重置</Button>
                                </div>
                                <Table
                                    style={{
                                        marginTop: '16px',
                                        display: isTable ? 'block' : 'none',
                                    }}
                                    className='dataTable'
                                    rowKey={(record, index) => `${index}_${record.fileId}`}
                                    // scroll={{ x: 800 }}
                                    columns={this.tableColumns}
                                    dataSource={resultTableList}
                                    onChange={this.tableListChange}
                                    pagination={{
                                        pageSize: tableParams.pageSize,
                                        total: tableParams.total,
                                        showQuickJumper: true,
                                        showSizeChanger: true,
                                        showTotal: (total) => (
                                            <span>
                                                总数 <b>{ProjectUtil.formNumber(total)}</b> 条
                                            </span>
                                        ),
                                    }}
                                />

                                <Table
                                    style={{
                                        marginTop: '16px',
                                        display: isTable ? 'none' : 'block',
                                    }}
                                    className='dataTable'
                                    rowKey={(record, index) => `${index}_${record.fileId}`}
                                    columns={this.columColumns}
                                    scroll={{ x: 1300 }}
                                    dataSource={resultColumnList}
                                    onChange={this.columnListChange}
                                    pagination={
                                        columParams.total <= 20
                                            ? false
                                            : {
                                                  pageSize: columParams.pageSize,
                                                  total: columParams.total,
                                                  showQuickJumper: true,
                                                  showSizeChanger: true,
                                                  showTotal: (total) => (
                                                      <span>
                                                          总数 <b>{ProjectUtil.formNumber(total)}</b> 条
                                                      </span>
                                                  ),
                                              }
                                    }
                                />
                            </TabPane>
                        </Tabs>
                    </Module>
                )}
            </Form>
        )
    }
}

export default analysis
