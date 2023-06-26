// 备选词根完善
import React, { Component } from 'react'
import DrawerLayout from '@/component/layout/DrawerLayout'
import { Button, message, Input, Select, Alert, Tooltip, Table } from 'antd'
import TipLabel from '@/component/tipLabel/TipLabel'
import EmptyLabel from '@/component/EmptyLabel'
import { candidateRootCheck } from 'app_api/dataModeling'

export default class AddRootDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            tableData: [],
            expandedRowKeys: [],
            loading: false,
            btnLoading: false,
        }
        this.columns = [
            {
                dataIndex: 'rootName',
                key: 'rootName',
                width: 150,
                title: () => {
                    return (
                        <TipLabel
                            label='词根'
                            tip={
                                <div>
                                    <p>词根只能由英文、数字、下划线组成，开头结尾不能为下划线</p>
                                    <p>在同一类别下，词根有且只有唯一</p>
                                </div>
                            }
                        />
                    )
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
                dataIndex: 'descWord',
                key: 'descWord',
                title: () => {
                    return <TipLabel label='描述词' tip='同一类别下，1个词根可以有多个描述词，但1个描述词只能描述1个词根' />
                },
                render: (text, record, index) => {
                    return (
                        <div style={{ position: 'relative' }}>
                            <Select
                                dropdownClassName='hideDropdown'
                                style={{ width: '100%' }}
                                mode='tags'
                                tokenSeparators={[',', '，', '↵']}
                                placeholder='（必填）输入文本，逗号分割'
                                value={record.descWord}
                                onChange={this.changeSelect.bind(this, index)}
                            ></Select>
                            {text.length ? null : <span className='redDot'></span>}
                        </div>
                    )
                },
            },
        ]
    }
    openModal = async (data) => {
        console.log(data, 'openModal')
        await this.setState({
            modalVisible: true,
            tableData: [...data],
        })
        this.getExpandedRowKeys()
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    changeSelect = async (index, e) => {
        let { tableData } = this.state
        tableData[index].descWord = e
        await this.setState({
            tableData,
        })
        this.checkRoot(tableData)
    }
    checkRoot = async (query) => {
        this.setState({ loading: true })
        let res = await candidateRootCheck(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            await this.setState({
                tableData: res.data,
            })
            this.getExpandedRowKeys()
        }
    }
    postData = async () => {
        this.cancel()
        this.props.setCandidateRoot(this.state.tableData)
    }
    expandedRowRender = (record, index) => {
        if (record.replaceRoots && record.replaceRoots.length) {
            return (
                <div>
                    {record.replaceRoots.map((item, index1) => {
                        return (
                            <div className='expandArea'>
                                {index1 == 0 ? <span className='iconfont icon-cigenjiancha'></span> : null}
                                <span style={{ color: '#5E6266' }}>
                                    已存在"
                                    <span style={{ color: '#2D3033' }}>
                                        {item.rootName}-{this.renderDescWord(item.descWord ? item.descWord : [], '#2D3033')}
                                    </span>
                                    "该词根，是否替换？
                                    <a style={{ marginLeft: 16 }} onClick={this.replaceRoot.bind(this, index, index1)}>
                                        替换
                                    </a>
                                </span>
                            </div>
                        )
                    })}
                </div>
            )
        }
    }
    renderDescWord = (data, color) => {
        let html = ''
        data.map((item, index) => {
            html += item + (index < data.length - 1 ? '、' : '')
        })
        return <span style={{ color: color }} dangerouslySetInnerHTML={{ __html: html }}></span>
    }
    replaceRoot = (index, index1) => {
        console.log(index, 'replaceRoot')
        let { tableData } = this.state
        let query = {
            candidateRoot: tableData[index],
            replaceRoot: tableData[index].replaceRoots[index1],
        }
        this.props.replaceRoot(query, index)
    }
    deleteRoot = (index) => {
        let { tableData } = this.state
        tableData.splice(index, 1)
        this.setState({
            tableData,
        })
        this.props.setCandidateRoot(tableData)
    }
    getExpandedRowKeys = () => {
        let { tableData, expandedRowKeys } = this.state
        expandedRowKeys = []
        tableData.map((item) => {
            if (item.replaceRoots && item.replaceRoots.length) {
                expandedRowKeys.push(item.rootName)
            }
        })
        console.log(expandedRowKeys, 'expandedRowKeys')
        this.setState({
            expandedRowKeys,
        })
    }
    render() {
        const { modalVisible, tableData, expandedRowKeys, loading, btnLoading } = this.state
        let hasReplace = false
        let root = 0
        tableData.map((item) => {
            if (!item.descWord.length) {
                root++
            }
            if (item.replaceRoots) {
                if (item.replaceRoots.length) {
                    hasReplace = true
                }
            }
        })
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'addRootDrawer',
                    title: '新增词根',
                    width: 640,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: true,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button disabled={root || !tableData.length || hasReplace} loading={btnLoading} onClick={this.postData} type='primary'>
                                确定
                            </Button>
                            <Button onClick={this.cancel}>取消</Button>
                        </React.Fragment>
                    )
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <Alert
                            message={
                                <div>
                                    检测到{tableData.length} 个词根，{root}个待完善
                                </div>
                            }
                            type='warning'
                            showIcon
                        />
                        <Table
                            ref={(node) => {
                                this.table = node
                            }}
                            loading={loading}
                            columns={this.columns}
                            dataSource={tableData}
                            expandIconAsCell={false}
                            expandIconColumnIndex={-1}
                            rowKey='rootName'
                            expandedRowRender={this.expandedRowRender}
                            defaultExpandAllRows={false}
                            expandedRowKeys={expandedRowKeys}
                            pagination={false}
                        />
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}
