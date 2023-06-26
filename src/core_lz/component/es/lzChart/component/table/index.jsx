import { Pagination, Select, Table } from 'antd'
import _ from 'underscore'
import './index.less'
const Option = Select.Option

/**
 * 数据表格展现组件
 *
 * @param head list 表头数据
 * @param tabulate body 表格body数据
 *
 * 被引用业务场景：keywordsearch、智能取数、数据看板视图、透视表
 */
class TableContent extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            sourceData: this.props.sourceData,
            columns: [],
            tableData: [],
            columnsHeader: [],
            tableDataHeader: [],
            aggregationList: [],
            stylePosition: !this.props.absolute ? {} : { position: 'absolute' },
            total: 0,
            head: [],

            leftPos: 0,
            indexHtml: null,
            overflowY: 'hidden',
            tableConfig: {},
            editTitleData: {},
        }

        // 聚合方式
        this.aggregationTypeList = {
            sum: '求和',
            avg: '平均值',
            max: '最大值',
            min: '最小值',
            count: '计数',
            distinct: '计数(去重)',
        }
    }

    componentDidMount = () => {
        this.init()
    }

    init = () => {
        this.getTableData(this.props.sourceData)
    }

    titleTool = (column) => {
        console.log(column, '--titleTooltitleTool--')
    }

    headerCallBack = (data) => {
        this.setState(
            {
                editTitleData: data,
            },
            () => {
                this.getTableData(this.props.sourceData)
            }
        )

        // let columnsHeader = this.state.columnsHeader
        // let pos = data.pos

        // let indexString = ''
        // for (let index = 0; index < pos.length; index++) {
        //     indexString = indexString + '[' + pos[index] + ']'
        // }

        // // columnsHeader[indexString]['title'] = data.title

        // // _.map(columnsHeader, (val, k) => {
        // //     if (val.key === data.key) {
        // //         columnsHeader[k] = {
        // //             ...columnsHeader[k],
        // //             ...data
        // //         }

        // //         // if (columnsHeader[k].filterDropdown) {
        // //         //     columnsHeader[k].filterDropdown = (ele) => {
        // //         //         ele.selectedKeys.length < 1 && ele.selectedKeys.push(columnsHeader[k].title)
        // //         //         return columnsHeader[k].filterDropdown(ele, { key: columnsHeader[k].key, dataIndex: columnsHeader[k].dataIndex, title: columnsHeader[k].title }, this.headerCallBack)
        // //         //     }
        // //         // }
        // //     }
        // // })
        // console.log(indexString, [indexString], columnsHeader, '--------------columnsHeadercolumnsHeadercolumnsHeader---------------')
        // // this.setState({
        // //     columnsHeader
        // // })
    }

    eachHeader = (data, headCfg, pos = []) => {
        let headerData = [...data]
        let editTitleData = this.state.editTitleData
        _.map(headerData, (element, k) => {
            let cPos = [...pos]
            cPos.push(k)
            console.log(k, cPos, '-----------cPoscPos----------')
            element = {
                ...element,
                ...headCfg,
            }

            if (editTitleData.key === element.key) {
                element.title = editTitleData.title
            }

            if (headCfg.filterDropdown) {
                element.filterDropdown = (ele) => {
                    ele.selectedKeys.length < 1 && ele.selectedKeys.push(element.title)
                    return headCfg.filterDropdown(ele, { key: element.key, dataIndex: element.dataIndex, title: element.title, pos: cPos }, this.headerCallBack)
                }
            }

            headerData[k] = element

            if (!element.width) {
                element.width = element.columnType && element.columnType === 1 ? 100 : 100
            }
            if (element.children && element.children.length > 0) {
                headerData[k]['children'] = this.eachHeader(element.children, headCfg, cPos)
            } else {
                headerData[k] = element
            }
        })
        return headerData
    }

    handleTableHeade = (data, headCfg = {}) => {
        return this.eachHeader(data, headCfg)
        // return data
    }

    /**
     * @param sourceData 表格数据
     *  {
     *      head: [] 表头数据
     *      headCfg: {} 表头操作配置及回调事件等
     *      tabulate: [] 表 Body 数据
     *  }
     */
    getTableData = (sourceData) => {
        // let sourceData = store.sourceData
        // console.log(sourceData, '------sourceData--table----')
        let columns = []
        let tableData = []
        let columnsHeader = []
        let tableDataHeader = []
        let aggregationList = []
        let total = 0
        let head = {}
        if (sourceData.head) {
            let hLength = sourceData.head.length
            let sourceDataHead = this.handleTableHeade(sourceData.head, sourceData.headCfg)
            // let cellFuns = sourceData.tableConfig.cellFuns || {}
            tableDataHeader[0] = { key: 'head0' }
            _.map(sourceDataHead, (val, key) => {
                // console.log(val, '--------sourceData.head-----sourceData.head------------')
                head[val['dataIndex']] = val
                let fixed = {}

                // 单元格数据默认居中对齐，表头居中显示
                let columsFieldList = {
                    ...val,
                    title: val['title'],
                    dataIndex: val['dataIndex'],
                    key: val['key'] ? val['key'] : val['dataIndex'],
                    // sourceInfo: val,
                    align: 'center',
                    // width: 100,
                }
                if (val.children) {
                    columsFieldList['children'] = val.children
                }

                // columnType : 1 度量 右对齐，其他类型 左对齐
                let align = val.columnType && val.columnType === 1 ? 'right' : 'left'
                let width = 100
                if (hLength < 4) {
                    width = val.columnType && val.columnType === 1 ? 100 : 100
                }
                if (val['title'] === '') {
                    width = 200
                    fixed = {
                        fixed: 'left',
                    }
                }

                // width = 600

                if (key > 0) {
                    columnsHeader.push({
                        ...columsFieldList,
                        width,
                        // ...fixed,
                        // title: (column) => {
                        //     console.log(column, '----11111111111111111111---')
                        //     return (
                        //         <div className='tableTitle' >
                        //             <span>{val['title']}</span>
                        //             <span onClick={() => { this.titleTool(val) }} >{val['title']}</span>
                        //         </div>
                        //     )
                        // },
                        render: (text) => {
                            return <span title={text}>{text}</span>
                        },
                    })

                    columns.push({
                        ...columsFieldList,
                        align: align,
                        width,
                        // ...fixed,
                        render: (text) => {
                            text = text + ''
                            // if (_.isEmpty(text)) {
                            //     return ''
                            // }

                            if (val.columnType && val.columnType === 1) {
                                return text
                            } else {
                                return <span title={text}>{text}</span>
                            }
                        },
                    })
                } else {
                    columnsHeader.push({
                        ...columsFieldList,
                        width: 150,
                        // ...fixed,
                        // className: 'headerRowTd',
                        render: (text) => {
                            return <span title={text}>{text}</span>
                        },
                    })

                    columns.push({
                        ...columsFieldList,
                        align: align,
                        // className: 'headerRowTd',
                        width: 150,
                        render: (text) => {
                            if (text === undefined) {
                                return ''
                            }
                            text = text + ''

                            if (val.columnType && val.columnType === 1) {
                                return text
                            } else {
                                return <span title={text}>{text}</span>
                            }
                        },
                    })
                }

                tableDataHeader[0][[val['dataIndex']]] = val['title']
            })

            columns.push({
                title: '',
                //  width: '50%',
                dataIndex: '__lz_table_',
                sourceInfo: {},
            })

            columnsHeader.push({
                title: '',
                //   width: '50%',
                dataIndex: '__lz_table_',
                sourceInfo: {},
            })

            tableDataHeader[0]['_lz_table_'] = ''
        }
        if (sourceData.tabulate) {
            _.map(sourceData.tabulate, (val, key) => {
                if (val.key) {
                    tableData.push(val)
                } else {
                    tableData.push({
                        key: `body${key}`,
                        ...val,
                    })
                }
            })
        }

        if (sourceData.chartx && sourceData.chartx.code === 200 && sourceData.chartx.data && sourceData.chartx.data.tableData) {
            aggregationList = sourceData.chartx.data.tableData
        }
        total = sourceData.total
        console.log(columnsHeader, '------columnsHeader---columnsHeader--------')
        this.setState({
            columns,
            tableData,
            tableDataHeader,
            columnsHeader,
            aggregationList,
            total,
            head,
            tableConfig: sourceData.tableConfig || {},
        })
    }

    handleOnScroll = () => {
        let flag = false
        if (this.dom) {
            this.setState({
                leftPos: 0 - this.dom.scrollLeft,
            })
        }
    }

    getAggregationData = async (params, item, value) => {
        let aggIndex = item.index
        let aggregationList = this.state.aggregationList
        let aggData = await this.props.getAggregationData(params)
        aggregationList[aggIndex]['default']['aggregationType'] = value
        if (aggData.code === 200) {
            aggregationList[aggIndex]['default']['aggregationValue'] = aggData.data
        } else {
            aggregationList[aggIndex]['default']['aggregationValue'] = <span title={aggData.msg}>计算失败...</span>
        }
        this.setState({
            aggregationList,
        })
    }

    aggregationChange = (item, value) => {
        let params = {
            fieldName: item.name,
            aggregation: value,
        }

        let aggIndex = item.index
        let aggregationList = this.state.aggregationList
        aggregationList[aggIndex]['default']['aggregationValue'] = '正在计算...'
        this.setState(
            {
                aggregationList,
            },
            () => {
                let aggData = this.getAggregationData(params, item, value)
            }
        )
    }

    rowClick = async (record, ev) => {
        let selectRow = []
        let head = this.state.head
        _.map(record, (value, key) => {
            if (head[key] && head[key]['path']) {
                selectRow.push({
                    value,
                    path: head[key]['path'],
                })
            }
        })

        let params = {
            item: record,
            selectRow: selectRow,
            pos: {
                x: ev.pageX,
                y: ev.pageY,
            },
            layout: {
                drillDisplay: 'block',
                drillLeft: ev.pageX + 20,
                drillTop: ev.pageY,
            },
        }

        if (this.props.getDrillDownData) {
            this.props.getDrillDownData(params)
        }
    }

    onExpandRow = () => {
        this.setState(
            {
                overflowY: this.state.overflowY,
            },
            () => {
                setTimeout(() => {
                    const { scrollHeight, clientHeight } = this.dom
                    console.log(scrollHeight, clientHeight, '----------scrollHeight, clientHeight--------')
                    if (scrollHeight > clientHeight) {
                        this.state.overflowY !== 'scroll' && this.setState({ overflowY: 'scroll' })
                    } else {
                        this.setState({
                            overflowY: 'hidden',
                        })
                    }
                })
            }
        )
    }

    render() {
        const { columns, tableData, leftPos, tableDataHeader, aggregationList, columnsHeader, total, indexHtml, stylePosition, overflowY, tableConfig } = this.state
        console.log(columns, columnsHeader, tableConfig, '--------------tableConfigtableConfig-------------')
        return (
            <div className='kwViewTable' style={{ ...stylePosition }}>
                <div className='vTableHeader' style={{ position: 'relative', overflow: 'hidden', minHeight: '42px', overflowY: overflowY }}>
                    <div style={{ position: 'relative', left: leftPos }}>
                        <Table
                            // showHeader={false}
                            // dataSource={[]}
                            dataSource={tableDataHeader}
                            columns={columnsHeader}
                            bordered
                            pagination={false}
                            rowKey='key'
                        />
                    </div>
                </div>
                <div
                    ref={(dom) => {
                        this.dom = dom
                    }}
                    onScrollCapture={() => this.handleOnScroll()}
                    className='tableAlign'
                >
                    <Table
                        onRow={(record) => {
                            return {
                                onDoubleClick: (event) => {
                                    this.rowClick(record, event)
                                }, // 点击行
                            }
                        }}
                        showHeader={false}
                        dataSource={tableData}
                        bordered
                        columns={columns}
                        pagination={false}
                        rowKey='key'
                        onExpandedRowsChange={this.onExpandRow}
                        // {...tableConfig}
                        // scroll={{ x: 'calc(100%)' }}
                    />
                </div>
                {tableConfig.pagination ? (
                    <div>
                        <Pagination {...tableConfig.pagination} />
                    </div>
                ) : null}
                {
                    // !this.props.absolute ? null : <div style={{ width: '100%', minHeight: '20px', paddingTop: '8px', fontSize: '12px' }}>
                    //     <div>总计：{total}行</div>
                    // </div>
                }
                <div className='tableStatics'>
                    <div className='boxStatics'>
                        {_.map(aggregationList, (val, index) => {
                            return (
                                <div className='boxItem'>
                                    <b>{val.default.aggregationValue}</b>
                                    <em>{val.name}</em>
                                    <span>
                                        {val.aggregation ? (
                                            <Select defaultValue={[val.default.aggregationType]} onChange={this.aggregationChange.bind(this, { name: val.name, index: index })}>
                                                {_.map(val.aggregation, (v, k) => {
                                                    return (
                                                        <Option key={`${v.name}_${v}`} value={v}>
                                                            {this.aggregationTypeList[v] ? this.aggregationTypeList[v] : v}
                                                        </Option>
                                                    )
                                                })}
                                            </Select>
                                        ) : null}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {indexHtml}
            </div>
        )
    }
}

export default TableContent
