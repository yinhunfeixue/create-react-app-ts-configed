import RichTableLayout from '@/component/layout/RichTableLayout'
import TableLayout from '@/component/layout/TableLayout'
import { Button, Modal, Table } from 'antd'
import React, { Component } from 'react'
import './TableLayoutTest.less'

interface ITableLayoutTestSate {
    showFooterControl: boolean
}

/**
 * TableLayoutTest
 */
class TableLayoutTest extends Component<any, ITableLayoutTestSate> {
    constructor(props: any) {
        super(props)
        this.state = {
            showFooterControl: false,
        }
    }
    sleep(time = 1000): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, time)
        })
    }
    render() {
        return (
            <div className='TableLayoutTest'>
                <TableLayout
                    showFooterControl={this.state.showFooterControl}
                    title='我只有布局'
                    renderHeaderExtra={() => {
                        return (
                            <>
                                <Button>按钮一</Button>
                                <Button>按钮二</Button>
                            </>
                        )
                    }}
                    renderDetail={() => {
                        return (
                            <div
                                onClick={() =>
                                    this.setState({
                                        showFooterControl: !this.state.showFooterControl,
                                    })
                                }
                            >
                                这里是详情，点我显示页脚
                            </div>
                        )
                    }}
                    renderTable={() => {
                        return <Table />
                    }}
                    renderFooter={() => {
                        return <div>页脚</div>
                    }}
                />
                <RichTableLayout<any>
                    title='我带表格操作逻辑，查看filter、sorter参数，请在开发者工具查看'
                    renderHeaderExtra={() => {
                        return <Button>aa</Button>
                    }}
                    renderFooter={(controller, defaultFooterElements) => {
                        const { selectedKeys } = controller
                        return [
                            <Button
                                key='0'
                                onClick={() => {
                                    if (selectedKeys) {
                                        Modal.success({
                                            content: selectedKeys.join(),
                                        })
                                    }
                                }}
                                type='primary'
                                ghost
                            >
                                点我显示选中的key
                            </Button>,
                            <Button
                                key='reset'
                                onClick={() => {
                                    controller.updateSelectedKeys([])
                                }}
                            >
                                清除选中
                            </Button>,
                            <Button
                                key='reset'
                                onClick={() => {
                                    controller.updateSelectedKeys(['b'])
                                }}
                            >
                                选中id=b
                            </Button>,
                            <Button key='1' onClick={() => {}}>
                                批量操作2
                            </Button>,
                            ...defaultFooterElements(),
                        ]
                    }}
                    tableProps={{
                        selectedEnable: true,
                        columns: [
                            {
                                title: 'id',
                                dataIndex: 'id',
                            },
                            {
                                title: '属性一',
                                dataIndex: 'a',
                                sorter: true,
                            },
                            {
                                title: '属性三',
                                dataIndex: 'b',
                                sorter: true,
                                filters: [
                                    {
                                        text: 'Joe',
                                        value: 'Joe',
                                    },
                                    {
                                        text: 'Jim',
                                        value: 'Jim',
                                    },
                                ],
                            },
                            {
                                title: '属性二',
                                dataIndex: 'b',
                            },
                        ],
                    }}
                    requestListFunction={async (page, pageSize, filter, sorter, extra) => {
                        console.log('请求参数')
                        console.log('page=', page)
                        console.log('pageSize=', pageSize)
                        console.log('filter=', filter)
                        console.log('sorter=', sorter)
                        console.log('extra=', extra)
                        await this.sleep()
                        return {
                            total: 12345678,
                            dataSource: [
                                {
                                    id: 'a',
                                    a: 'a111',
                                    b: 'a22',
                                },
                                {
                                    id: 'b',
                                    a: 'b1',
                                    b: 'b22',
                                },
                            ],
                        }
                    }}
                />
            </div>
        )
    }
}

export default TableLayoutTest
