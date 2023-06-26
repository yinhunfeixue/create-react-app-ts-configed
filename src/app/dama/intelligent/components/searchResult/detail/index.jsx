import { Table, Modal } from 'antd'
import './index.less'
import DataLoading from '../../loading'
import _ from 'underscore'

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

class TableDetail extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            // sourceData: this.props.sourceData,
            columns: [],
            tableData: [],
            columnsHeader: [],
            tableDataHeader: [],
            total: 0,
            leftPos: 0,
            visible: false
        }

        this.components = {
            header: {
                cell: ResizeableTitle,
            },
        }
    }

    getTableData = async () => {
        this.setState({
            loading: true
        })
        let params = {}
        let columns = []
        let tableData = []
        let columnsHeader = []
        let tableDataHeader = []
        let total = 0

        let detailData = await this.props.handleDetail(params)
        if (detailData.code === 200) {
            let sourceData = detailData.data
            if (sourceData.head) {
                let hLength = sourceData.head.length
                tableDataHeader[0] = {}
                _.map(sourceData.head, (val, key) => {
                    let columsFieldList = {
                        title: val['cname'],
                        dataIndex: val['ename'],
                        sourceInfo: val,
                        align: 'center',
                        width: 100,
                    }
                    let align = (val.columnType === 1) ? 'right' : 'left'
                    let width = 100
                    if (hLength < 4) {
                        width = (val.columnType === 1) ? 100 : 200
                    }

                    // width = 600

                    columnsHeader.push({
                        ...columsFieldList,
                        width,
                    })
                    columns.push({
                        ...columsFieldList,
                        align: align,
                        width,
                        render: (text) => {
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

                    tableDataHeader[0][[val['ename']]] = val['cname']
                })

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
                        key,
                        ...val
                    })
                })
            }

            total = sourceData.total
        }

        this.setState({
            columns,
            tableData,
            tableDataHeader,
            columnsHeader,
            total,
            loading: false
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

    visibleModal = (status, params) => {
        this.setState({
            visible: status,
        }, () => {
            this.getTableData()
        })
    }

    handleOk = (e) => {
        console.log(e)
        this.setState({
            visible: false,
        })
    };

    handleCancel = (e) => {
        console.log(e)
        this.setState({
            visible: false,
        })
    }

    handleResize = (index) => (e, { size }) => {
        console.log(index, '-------handleResize------')
        this.setState(({ columnsHeader }) => {
            const nextColumns = [...columnsHeader]
            nextColumns[index] = {
                ...nextColumns[index],
                width: size.width,
            }
            return { columnsHeader: nextColumns }
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
        const { columns, tableData, loading, total, tableDataHeader, columnsHeader, leftPos, visible } = this.state
        const columnsHeaderList = columnsHeader.map((col, index) => ({
            ...col,
            onHeaderCell: (column) => ({
                width: column.width,
                onResize: this.handleResize(index),
            }),
        }))

        return (
            <Modal
                title='明细数据'
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                width='80%'
                height='500px'
                footer={null}
            >
                <div className='kwContentTableDetail' >
                    {
                        !loading ? <div style={{ width: '100%', height: '100%' }} >
                            <div className='tableDetailHeader' style={{ position: 'relative', overflow: 'hidden' }}>
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
                                style={{ width: '100%', height: '330', overflow: 'auto', marginTop: '1px', paddingBottom: '40px', minHeight: '180px', maxHeight: '350px' }}
                                ref={(dom) => { this.dom = dom }}
                                onScrollCapture={() => this.handleOnScroll()}
                                className='tableDetailAlign'
                            >
                                <Table
                                    showHeader={false}
                                    dataSource={tableData}
                                    bordered
                                    columns={columns}
                                    pagination={false}
                                    rowKey='key'
                                    // loading={loading}
                                />
                            </div>
                            <div style={{ width: '100%', height: '20px', paddingTop: '8px', fontSize: '12px' }}>
                                <div>总计：{total}行</div>
                            </div>
                        </div>
                            : <div style={{ width: '100%', height: '330' }} >
                                <DataLoading />
                            </div>
                    }
                </div>
            </Modal>
        )
    }
}

export default TableDetail
