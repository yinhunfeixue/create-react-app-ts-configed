import React, { Component } from 'react'
import { Button, Row, Col, message, Modal, Tooltip, Checkbox, Spin } from 'antd'
import '../index.less'
import IconFont from '@/component/IconFont'
import { flatPreview, replaceBizTree, listByCodes } from 'app_api/dataSecurity'
export default class DataCategoryPreview extends Component {
    constructor(props) {
        super(props)
        this.state = {
            previewList: [],
            modalVisible: false,
            tableData: [],
            loading: false,
            tableLoading: false,
            previewInfo: {},
            maxRow: 0,
        }
        this.columns = [
            {
                title: '业务分类',
                children: [
                    {
                        title: '一级',
                        align: 'center',
                        dataIndex: 'companyAddress',
                        key: 'companyAddress',
                    },
                    {
                        title: '二级',
                        align: 'center',
                        dataIndex: 'companyName',
                        key: 'companyName',
                    },
                ],
            },
            {
                title: '数据分类',
                children: [
                    {
                        title: '三级',
                        align: 'center',
                        dataIndex: 'companyAddress',
                        key: 'companyAddress',
                    },
                    {
                        title: '四级',
                        align: 'center',
                        dataIndex: 'companyName',
                        key: 'companyName',
                    },
                    {
                        title: '五级',
                        align: 'center',
                        dataIndex: 'companyName',
                        key: 'companyName',
                    },
                ],
            },
        ]
    }

    componentWillMount = () => {
        this.getTreeInfo()
    }
    getTreeInfo = async () => {
        let res = await listByCodes(['BZB001', 'BZB002'])
        if (res.code == 200) {
            res.data.map((item) => {
                item.checked = false
            })
            this.setState({
                previewList: res.data,
            })
        }
    }
    getFlatPreview = async (code) => {
        this.setState({ tableLoading: true })
        let res = await flatPreview({ treeCode: code })
        this.setState({ tableLoading: false })
        if (res.code == 200) {
            let array = []
            res.data.map((item) => {
                array.push(item.row)
            })
            this.setState({
                tableData: res.data,
                maxRow: Math.max(...array) + 1,
            })
        }
    }
    openPreviewModal = (data) => {
        this.setState({
            modalVisible: true,
            maxRow: 0,
            tableData: [],
            previewInfo: data,
        })
        this.getFlatPreview(data.code)
    }
    changeCheckbox = (index, e) => {
        let { previewList } = this.state
        previewList.map((item) => {
            item.checked = false
        })
        previewList[index].checked = e.target.checked
        this.setState({
            previewList,
        })
    }
    closePreview = async (code) => {
        this.setState({ loading: true })
        let res = await replaceBizTree({ backupTreeCode: code })
        this.setState({ loading: false })
        if (res.code == 200) {
            this.props.changePreviewStatus()
        }
    }
    onCancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    render() {
        const { previewList, modalVisible, tableData, loading, previewInfo, maxRow, tableLoading } = this.state
        let renderLength = []
        for (let i = 0; i < maxRow; i++) {
            renderLength.push(' ')
        }
        return (
            <div className='dataCategoryPreview'>
                <div className='previewTitle'>请先选择编目模板</div>
                <Spin spinning={loading}>
                    <Row gutter={20}>
                        {previewList.map((item, index) => {
                            return (
                                <Col span={12}>
                                    <div className='previewItem'>
                                        <IconFont type='icon-chanpinjieshao' />
                                        <div className='previewContent'>
                                            <div className='catalogTitle'>
                                                <span>{item.name}</span>
                                                <a onClick={this.openPreviewModal.bind(this, item)}>结构预览</a>
                                            </div>
                                            <div className='catalogDesc'>{item.description}</div>
                                            <Checkbox checked={item.checked} onChange={this.changeCheckbox.bind(this, index)}>
                                                确定选择后不可修改
                                            </Checkbox>
                                            <Button onClick={this.closePreview.bind(this, item.code)} type='primary' disabled={!item.checked}>
                                                确定选择
                                            </Button>
                                        </div>
                                    </div>
                                </Col>
                            )
                        })}
                    </Row>
                </Spin>
                <Modal title='结构预览' visible={modalVisible} footer={null} onCancel={this.onCancel} width={960} className='dataCategpryModal'>
                    {modalVisible && (
                        <div>
                            <div className='catalogTitle'>{previewInfo.name}</div>
                            <div className='catalogDesc'>{previewInfo.description}</div>
                            <Spin spinning={tableLoading}>
                                <div className='tableCell'>
                                    <table>
                                        {renderLength.map((item, index) => {
                                            return (
                                                <tr>
                                                    {tableData.map((node) => {
                                                        return (
                                                            <td
                                                                className={node.row < 2 ? 'theader' : 'tbody'}
                                                                style={{ display: node.row == index ? '' : 'none' }}
                                                                colSpan={node.columnSpan ? node.columnSpan : 1}
                                                                rowSpan={node.rowSpan ? node.rowSpan : 1}
                                                            >
                                                                <Tooltip title={node.content}>{node.content}</Tooltip>
                                                            </td>
                                                        )
                                                    })}
                                                </tr>
                                            )
                                        })}
                                    </table>
                                </div>
                            </Spin>
                        </div>
                    )}
                </Modal>
            </div>
        )
    }
}
