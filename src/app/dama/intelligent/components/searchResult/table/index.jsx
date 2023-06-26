import { Table, Select, Pagination, Icon } from 'antd'
import './index.less'
import _ from 'underscore'
const Option = Select.Option
import Cache from 'app_utils/cache'

import { Resizable } from 'react-resizable'

const ResizeableTitle = (props) => {
    const { onResize, width, ...restProps } = props

    if (!width) {
        return <th {...restProps} />
    }

    return (
        <Resizable
            width={width}
            height={0}
            onResize={onResize}
            draggableOpts={{ enableUserSelectHack: false }}
        >
            <th {...restProps} />
        </Resizable>
    )
}

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
            tableConfig: {},
            editTitleData: {}

        }

        this.components = {
            header: {
                cell: ResizeableTitle,
            },
        }

        // 聚合方式
        this.aggregationTypeList = {
            'sum': '求和',
            'avg': '平均值',
            'max': '最大值',
            'min': '最小值',
            'count': '计数',
            'distinct': '计数(去重)'
        }
    }

    componentDidMount = () => {
        this.init()
    }

    init = () => {
        this.getTableData(this.props.sourceData)
    }

    headerCallBack = (data) => {
        // console.log(data, '========headerCallBackheaderCallBack=========')
        let eTitle = data.title
        let eKey = data.key
        let columnsHeader = [...data.columnsHeader]
        let headCfg = this.props.sourceData.headCfg
        _.map(columnsHeader, (val, key) => {
            columnsHeader[key] = {
                ...headCfg,
                ...val
            }

            if (eKey === val.key) {
                columnsHeader[key]['title'] = eTitle
                val.title = eTitle
            }

            if (headCfg) {
                if (headCfg.filterDropdown) {
                    columnsHeader[key].filterDropdown = (ele) => {
                        ele.selectedKeys.length < 1 && ele.selectedKeys.push(val.title)
                        return headCfg.filterDropdown(ele, { key: val.key, dataIndex: val.dataIndex, title: val.title, columnsHeader: this.state.columnsHeader }, this.headerCallBack)
                    }
                }
            }
        })

        this.setState({
            columnsHeader
        }, () => {
            this.saveColumnsHeaderSession()
        })
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
            // let editTitleData = this.state.editTitleData
            let columnsHeaderCache = Cache.get('kws_columnsHeader')

            tableDataHeader[0] = {
                'key': 'head0'
            }
            _.map(sourceData.head, (val, key) => {
                head[val['ename']] = val
                tableDataHeader[0][val['ename']] = val['cname']
                // columnType : 1 度量 右对齐，其他类型 左对齐
                let align = (val.columnType === 1) ? 'right' : 'left'
                let width = 100
                if (hLength < 4) {
                    width = (val.columnType === 1) ? 100 : 200
                }

                let columnsHeaderCacheInfo = {}
                // 获取sesssion 缓存中 前一次保存的列宽信息
                if (columnsHeaderCache && columnsHeaderCache[val['ename']]) {
                    columnsHeaderCacheInfo = columnsHeaderCache[val['ename']]
                }

                // 单元格数据默认居中对齐，表头居中显示
                let columsFieldList = {
                    title: val['cname'],
                    dataIndex: val['ename'],
                    key: val['key'] ? val['key'] : val['ename'],
                    // sourceInfo: val,
                    align: 'center',
                    width,
                    ellipsis: true,
                    defaultSortOrder: 'ascend',
                    ...columnsHeaderCacheInfo
                }

                if (sourceData.headCfg) {
                    columsFieldList = {
                        ...columsFieldList,
                        ...sourceData.headCfg
                    }

                    // if (!_.isEmpty(columnsHeaderCacheInfo)) {
                    //     columsFieldList.title = columnsHeaderCacheInfo.title
                    // }

                    if (sourceData.headCfg.filterDropdown) {
                        columsFieldList.filterDropdown = (ele) => {
                            ele.selectedKeys.length < 1 && ele.selectedKeys.push(columsFieldList.title)
                            return sourceData.headCfg.filterDropdown(ele, { key: columsFieldList.key, dataIndex: columsFieldList.dataIndex, title: columsFieldList.title, columnsHeader: this.state.columnsHeader }, this.headerCallBack)
                        }
                    }
                }

                // width = 600
                columnsHeader.push({
                    ...columsFieldList,
                    // width,
                    // ...columnsHeaderCacheInfo,
                    render: (text) => {
                        return (
                            <div title={text} >
                                <span>{text}</span>
                            </div>
                        )
                    }
                })

                columns.push({
                    ...columsFieldList,
                    align: align,
                    // width,
                    // ...columnsHeaderCacheInfo,
                    render: (text) => {
                        if (text === undefined) {
                            return ''
                        }

                        if (val.columnType === 1) {
                            return text
                        } else {
                            return (
                                <span title={text} >
                                    {text}
                                </span>
                            )
                        }
                    }
                })
            })

            // 自动增加空白列，当数据字段比较少的时候，让表格充满整个容器，宽度不指定
            columns.push({
                title: '',
                dataIndex: '__lz_table_',
                sourceInfo: {},
            })

            columnsHeader.push({
                title: '',
                dataIndex: '__lz_table_',
                sourceInfo: {},
            })

            tableDataHeader[0]['_lz_table_'] = ''
        }
        if (sourceData.tabulate) {
            _.map(sourceData.tabulate, (val, key) => {
                tableData.push({
                    key: `body${key}`,
                    ...val
                })
            })
        }

        if (sourceData.chartx && sourceData.chartx.code === 200 && sourceData.chartx.data && sourceData.chartx.data.tableData) {
            aggregationList = sourceData.chartx.data.tableData
        }
        total = sourceData.total
        this.setState({
            columns,
            tableData,
            tableDataHeader,
            columnsHeader,
            aggregationList,
            total,
            head,
            tableConfig: sourceData.tableConfig || {}
        })
    }

    handleOnScroll = () => {
        let flag = false
        if (this.dom) {
            this.setState({
                leftPos: 0 - this.dom.scrollLeft
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
            aggregationList
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
        this.setState({
            aggregationList
        }, () => {
            let aggData = this.getAggregationData(params, item, value)
        })
    }

    rowClick = async (record, ev) => {
        let selectRow = []
        let head = this.state.head
        _.map(record, (value, key) => {
            if (head[key] && head[key]['path']) {
                selectRow.push({
                    value,
                    path: head[key]['path']
                })
            }
        })

        let params = {
            item: record,
            selectRow: selectRow,
            pos: {
                x: ev.pageX,
                y: ev.pageY
            },
            layout: {
                drillDisplay: 'block',
                drillLeft: ev.pageX + 20,
                drillTop: ev.pageY
            }
        }

        if (this.props.getDrillDownData) {
            this.props.getDrillDownData(params)
        }
    }

    saveColumnsHeaderSession = () => {
        // console.log(this.state.columnsHeader, '---saveColumnsHeaderSession')
        let columnsHeader = this.state.columnsHeader
        let columnsHeaderKeyObject = {}
        columnsHeader.map((col, index) => {
            columnsHeaderKeyObject[col.dataIndex] = col
        })
        Cache.set('kws_columnsHeader', columnsHeaderKeyObject)
    }

    handleResize = (index) => (e, { size }) => {
        // console.log(index, '-------handleResize------')
        this.setState(({ columnsHeader }) => {
            const nextColumns = [...columnsHeader]
            nextColumns[index] = {
                ...nextColumns[index],
                width: size.width,
            }
            return { columnsHeader: nextColumns }
        }, () => {
            this.saveColumnsHeaderSession()
        })

        this.setState(({ columns }) => {
            const nextColumns = [...columns]
            nextColumns[index] = {
                ...nextColumns[index],
                width: size.width,
            }
            return { columns: nextColumns }
        })
    };

    render() {
        const { columns, tableData, leftPos, tableDataHeader, aggregationList, columnsHeader, total, indexHtml, stylePosition, tableConfig } = this.state

        const columnsHeaderList = columnsHeader.map((col, index) => ({
            ...col,
            onHeaderCell: (column) => ({
                width: column.width,
                onResize: this.handleResize(index),
            }),
            title: <span title={col.title} >{col.title}</span>
        }))

        // console.log(columnsHeaderList, '----columnsHeaderList----')

        return (
            <div className='kwContentTable' style={{ ...stylePosition }}>
                <div className='tableHeader' style={{ position: 'relative', overflow: 'hidden', minHeight: '42px' }}>
                    <div style={{ position: 'relative', left: leftPos }}>
                        <Table
                            // showHeader={false}
                            dataSource={tableDataHeader}
                            columns={columnsHeaderList}
                            bordered
                            pagination={false}
                            rowKey='key'
                            components={this.components}
                        />
                    </div>
                </div>
                <div
                    ref={(dom) => { this.dom = dom }}
                    onScrollCapture={() => this.handleOnScroll()}
                    className='tableAlign'
                >
                    <Table
                        onRow={(record) => {
                            return {
                                onDoubleClick: (event) => { this.rowClick(record, event) }, // 点击行
                            }
                        }}
                        showHeader={false}
                        dataSource={tableData}
                        bordered
                        pagination={false}
                        columns={columns}
                        // {...tableConfig}
                        rowKey='key'
                        // components={this.components}
                        // scroll={{ x: 'calc(100%)' }}

                    />
                </div>
                {
                    tableConfig.pagination ? <div><Pagination
                        style={{ float: 'right' }}
                        {...tableConfig.pagination}
                                                  />
                                             </div> : null
                }
                {
                    !this.props.absolute ? null : <div style={{ width: '100%', minHeight: '20px', paddingTop: '8px', fontSize: '12px' }}>
                        <div>总计：{total}行</div>
                                                  </div>
                }
                <div className='tableStatics' style={{ display: this.props.tableStaticsHide ? 'none' : '' }}>
                    <div className='boxStatics'>
                        {
                            _.map(aggregationList, (val, index) => {
                                return (
                                    <div className='boxItem'>
                                        <b>{val.default.aggregationValue}</b>
                                        <em>{val.name}</em>
                                        <span>
                                            {
                                                val.aggregation ? <Select defaultValue={[val.default.aggregationType]} onChange={this.aggregationChange.bind(this, { 'name': val.name, 'index': index })} >
                                                    {
                                                        _.map(val.aggregation, (v, k) => {
                                                            return (
                                                                <Option key={`${v.name}_${v}`} value={v}>{this.aggregationTypeList[v] ? this.aggregationTypeList[v] : v}</Option>
                                                            )
                                                        })
                                                    }

                                                                  </Select> : null
                                            }

                                        </span>

                                    </div>
                                )
                            })
                        }

                    </div>
                </div>

                {indexHtml}
            </div>
        )
    }
}

export default TableContent
