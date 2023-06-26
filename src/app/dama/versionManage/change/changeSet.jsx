import EmptyLabel from '@/component/EmptyLabel'
import TableLayout from '@/component/layout/TableLayout'
import { InfoCircleFilled } from '@ant-design/icons'
import { Button, Input, Select, message, Switch, Checkbox, Alert, Table, Popconfirm } from 'antd'
import { getReportList, getSourceList } from 'app_api/metadataApi'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import './index.less'
import { getDiffFilter, changeDiffFilter } from 'app_api/systemManage'
import PermissionManage from '@/utils/PermissionManage'

const { Option } = Select

export default class DataCompare extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableData: [],
        }
        this.columns = [
            {
                dataIndex: 'category',
                key: 'category',
                title: '规则分类',
                width: 140,
                onHeaderCell: () => {
                    return {
                        className: 'lastHeaderCell',
                    }
                },
                render: (text, record, index) => {
                    const obj = {
                        children: (
                            <Tooltip placement='topLeft' title={text}>
                                <span className='LineClamp'>{text}</span>
                            </Tooltip>
                        ),
                        props: {},
                    }
                    const { tableData } = this.state
                    obj.props.rowSpan = this.getRowSpanCount(tableData, 'category', index)
                    return obj
                },
            },
            {
                dataIndex: 'description',
                key: 'description',
                title: '规则',
                width: '25%',
                onHeaderCell: () => {
                    return {
                        className: 'lastHeaderCell',
                    }
                },
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                dataIndex: 'updateUser',
                key: 'updateUser',
                title: '样例说明',
                children: [
                    {
                        title: '变更前',
                        dataIndex: 'sampleBefore',
                        key: 'sampleBefore',
                        onHeaderCell: () => {
                            return {
                                className: 'lastHeaderCell',
                            }
                        },
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
                        title: '变更后',
                        dataIndex: 'sampleAfter',
                        key: 'sampleAfter',
                        onHeaderCell: () => {
                            return {
                                className: 'lastHeaderCell',
                            }
                        },
                        render: (text, record) =>
                            text ? (
                                <Tooltip placement='topLeft' title={text}>
                                    <span className='LineClamp'>{text}</span>
                                </Tooltip>
                            ) : (
                                <EmptyLabel />
                            ),
                    },
                ],
            },
            {
                dataIndex: 'value',
                key: 'value',
                title: '是否忽略',
                width: 120,
                onHeaderCell: () => {
                    return {
                        className: 'lastHeaderCell',
                    }
                },
                render: (text, record, index) => {
                    return (
                        <div>
                            <Popconfirm title='是否确定修改' onConfirm={this.changeCheckbox.bind(this, index)} okText='修改' cancelText='取消'>
                                <Checkbox disabled={!PermissionManage.hasFuncPermission('/setting/md/changes/switch')} checked={text}></Checkbox>
                            </Popconfirm>
                        </div>
                    )
                },
            },
        ]
    }
    componentWillMount = () => {
        this.getTableList()
    }
    getTableList = async () => {
        let res = await getDiffFilter()
        if (res.code == 200) {
            this.setState({
                tableData: res.data,
            })
        }
    }
    changeCheckbox = async (index) => {
        let { tableData } = this.state
        let res = await changeDiffFilter({ id: tableData[index].id, value: !tableData[index].value })
        if (res.code == 200) {
            tableData[index].value = !tableData[index].value
            this.setState({
                tableData,
            })
        }
    }
    // 获取合并行
    getRowSpanCount = (data, key, target) => {
        if (!Array.isArray(data)) return 1
        data = data.map((_) => _[key]) // 只取出筛选项
        let preValue = data[0]
        const res = [[preValue]] // 放进二维数组里
        let index = 0 // 二维数组下标
        for (let i = 1; i < data.length; i++) {
            if (data[i] === preValue) {
                // 相同放进二维数组
                res[index].push(data[i])
            } else {
                // 不相同二维数组下标后移
                index += 1
                res[index] = []
                res[index].push(data[i])
                preValue = data[i]
            }
        }
        const arr = []
        res.forEach((_) => {
            const len = _.length
            for (let i = 0; i < len; i++) {
                arr.push(i === 0 ? len : 0)
            }
        })
        return arr[target]
    }

    render() {
        const { tableData } = this.state
        let number = 0
        tableData.map((item) => {
            if (item.value) {
                number++
            }
        })
        return (
            <React.Fragment>
                <div className='changeSet'>
                    <TableLayout
                        title='变更设置'
                        disabledDefaultFooter
                        renderDetail={() => {
                            return (
                                <Alert
                                    description={
                                        <div>
                                            1、勾选忽略规则后，则项不进入作为数据表更【元数据对比、数据源变更】
                                            <br />
                                            2、配置修改后，将在下一次对比时起作用
                                        </div>
                                    }
                                    type='info'
                                    showIcon
                                    icon={<InfoCircleFilled style={{ color: '#4D73FF' }} />}
                                />
                            )
                        }}
                    />
                    <div className='tableArea'>
                        <div style={{ marginBottom: 16 }}>已开启 {number} 项规则 作为变更条件</div>
                        <Table
                            className='rowSpanTable'
                            columns={this.columns}
                            dataSource={tableData}
                            bordered
                            pagination={false}
                        />
                    </div>
                </div>
                <div className='dopTitle'>- DOP数据运营平台 -</div>
            </React.Fragment>
        )
    }
}
