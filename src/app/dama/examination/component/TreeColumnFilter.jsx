import TreeControl from '@/utils/TreeControl'
import { Button, Col, Divider, Input, message, Modal, Row, Spin, Tooltip, Tree } from 'antd'
import { searchColumnField } from 'app_api/examinationApi'
import React, { Component } from 'react'
import TableSelectModal from './TableSelectModal'

const { TextArea } = Input

const filterList = ['+', '-', '*', '/', 'line', '(', ')', 'line', '<', '>', '>=', '<=', '!=', '=', 'line', 'NULL', 'and', 'or', 'in']

export default class TreeColumnFilter extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            value: '',
            value2: '',
            btnLoading: false,
            queryInfo: {
                query: '',
                page: 1,
                pageSize: 20,
            },
            searchKey: '',
            dataSource: [],
            tableLoading: false,
            hasError: '',
            columnId: '',
            visibleTableModal: false,

            /**
             * @type {{[key:string]:any, children: any[]}[]}
             */
            tableList: [],

            focusKey: 'joinStatement',

            /**
             * 关联关系
             */
            joinStatement: '',

            /**
             * 逻辑表达式
             */
            logicalExpression: '',
        }
    }
    componentWillMount = () => {}
    openModal = async (joinStatement, logicalExpression, tableId, columnId, tableName = '') => {
        let { queryInfo } = this.state
        queryInfo.page = 1
        queryInfo.tableId = tableId
        await this.setState({
            modalVisible: true,
            dataSource: [],
            queryInfo,
            columnId,
            hasError: '',
            joinStatement: joinStatement || '',
            logicalExpression: logicalExpression || '',
        })
        this.addTable({ id: tableId, physicalTable: tableName || tableId })
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    checkSql = async () => {}
    postData = () => {
        const { joinStatement, logicalExpression, tableList } = this.state
        const data = { joinStatement, logicalExpression }
        const extraTable = tableList[1]
        if (extraTable) {
            data.database = extraTable.database
            data.table = { id: extraTable.id, name: extraTable.name }
            if (!joinStatement) {
                message.info('请填写关联关系')
                return
            }
        }
        this.cancel()
        this.props.getFilterParam(data)
    }

    /**
     * 获取字段列表
     * @param {*} tableId
     * @returns
     */
    requestFieldList(tableId) {
        this.setState({ tableLoading: true })
        return searchColumnField({ tableId })
            .then((res) => {
                return res.data
            })
            .catch(() => {
                return undefined
            })
            .finally(() => {
                this.setState({ tableLoading: false })
            })
    }

    /**
     * 创建数据表对象
     * @param {*} table
     */
    async createTable(table) {
        const { id, physicalTable, database } = table
        // 构造{表属性, children:字段列表} 的数据
        const result = {
            id,
            name: physicalTable,
            type: 'table',
            database,
        }

        // 请求字段列表，如果成功且有数据，则添加；否则，提示
        const fieldList = await this.requestFieldList(id)
        if (fieldList) {
            result.children = fieldList
            return result
        } else {
            message.error(`id=${id}的表无可用字段`)
        }
        return undefined
    }

    /**
     * 添加数据表
     * @param {{id:string, physicalTable:string, [key:string]:any}} data
     */
    async addTable(data) {
        const { tableList } = this.state
        // 检查是否已存在
        const { id, physicalTable } = data
        const exist = tableList.find((item) => item.id === id)
        if (exist) {
            return
        }
        // 创建数据，创建成功，则添加
        const table = await this.createTable(data)
        if (table) {
            this.setState({ tableList: [...tableList, table] })
        }
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

    search = async (key) => {
        // let { queryInfo } = this.state
        // queryInfo.page = 1
        // await this.setState({
        //     queryInfo,
        //     dataSource: [],
        // })
        // this.getColumnList()
        this.setState({ searchKey: key })
    }
    addFilter = async (data) => {
        this.addContent(data)
    }
    addColumn = async (data) => {
        this.addContent(data.physical_field)
    }

    addContent(content) {
        let { focusKey } = this.state
        this.setState({
            [focusKey]: this.state[focusKey] + content,
        })
        this.checkSql()
    }

    changeValue = async (e) => {
        await this.setState({
            joinStatement: e.target.value,
        })
        this.checkSql()
    }

    getDisplayTreeData() {
        const { tableList, searchKey } = this.state
        if (!searchKey) {
            return tableList
        }

        const control = new TreeControl()
        const result = control.filter(tableList, (node) => {
            const { physical_field_highlight, name } = node
            return (physical_field_highlight || name).toLowerCase().includes(searchKey.toLowerCase())
        })
        return result
    }

    render() {
        const { value, btnLoading, modalVisible, queryInfo, value2, tableList, tableLoading, hasError, visibleTableModal, joinStatement, logicalExpression } = this.state

        return (
            <Modal
                width={960}
                className='columnFilterModal'
                title='设置逻辑表达式'
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
                        <Col span={7} style={{ borderRight: '1px solid #E6E8ED', display: 'flex', flexDirection: 'column' }}>
                            <div className='filterTitle filterLeftTitle'>
                                <Input.Search allowClear onSearch={this.search} placeholder='请输入关键词' />
                            </div>
                            {/* 字段列表 */}
                            <div className='filterLeft' ref={(dom) => (this.scrollRef = dom)}>
                                <Spin spinning={tableLoading}>
                                    <Tree
                                        selectable={false}
                                        showLine={false}
                                        treeData={this.getDisplayTreeData()}
                                        titleRender={(item) => {
                                            // 如果是表，返回表名称; 如果是字段，返回字段元素
                                            if (item.type === 'table') {
                                                return <div dangerouslySetInnerHTML={{ __html: item.name }} />
                                            }
                                            return (
                                                <Tooltip placement='topLeft' title={item.physical_field + (item.physical_field_desc ? '（' + item.physical_field_desc + ')' : '')}>
                                                    <div
                                                        onClick={this.addColumn.bind(this, item)}
                                                        dangerouslySetInnerHTML={{ __html: item.physical_field_highlight + (item.physical_field_desc ? '[' + item.physical_field_desc + ']' : '') }}
                                                    />
                                                </Tooltip>
                                            )
                                        }}
                                    />
                                </Spin>
                            </div>
                            {/* 未添加表时，可以操作（只能添加1个表） */}
                            {tableList.length <= 1 && (
                                <a className='BtnAddTable' onClick={() => this.setState({ visibleTableModal: true })}>
                                    添加表 +
                                </a>
                            )}
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
                                {tableList[1] ? <em>1. 输入关联关系（必填）</em> : null}
                                {tableList[1] ? (
                                    <TextArea
                                        onChange={this.changeValue}
                                        value={joinStatement}
                                        placeholder='请输入...'
                                        onFocus={() => {
                                            this.setState({ focusKey: 'joinStatement' })
                                        }}
                                    />
                                ) : null}

                                <em>2. 输入逻辑表达式（必填）</em>
                                <TextArea
                                    placeholder='请输入...'
                                    value={logicalExpression}
                                    onFocus={() => {
                                        this.setState({ focusKey: 'logicalExpression' })
                                    }}
                                    onChange={(event) => {
                                        this.setState({ logicalExpression: event.target.value })
                                    }}
                                />
                            </div>
                            <TableSelectModal
                                visible={visibleTableModal}
                                onCancel={() => this.setState({ visibleTableModal: false })}
                                onOk={(value) => {
                                    this.setState({ visibleTableModal: false })
                                    this.addTable(value)
                                }}
                            />
                        </Col>
                    </Row>
                ) : null}
            </Modal>
        )
    }
}
