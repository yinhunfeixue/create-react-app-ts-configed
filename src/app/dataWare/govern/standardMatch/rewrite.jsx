import EmptyIcon from '@/component/EmptyIcon'
import EmptyLabel from '@/component/EmptyLabel'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import { Col, message, Modal, Row, Select, Table, Tabs } from 'antd'
import { searchLineageFile } from 'app_api/metadataApi'
import { desensitizerule, lineageDatasource, standardRewrite } from 'app_api/standardApi'
import CodeMirrorDiff from 'app_page/dama/component/codeMirrorDiff'
import PermissionWrap from '@/component/PermissionWrap'
import { Button, Tooltip } from 'lz_antd'
import React, { Component } from 'react'
// import './index.less'

const confirm = Modal.confirm
const { Option } = Select
const { TabPane } = Tabs

export default class StandardMap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tableData: [],
            loading: false,
            modalVisible: false,
            selectedRowKeys: [],
            tabValue: '1',
            datasourceList: [],
            etlFileList: [],
            fileId: undefined,
            datasourceId: undefined,
            btnLoading: false,
            showTable: false,
            rewriteInfo: {
                oldContent: '',
                rewriteContent: '',
                tableInfos: [{ columnInfos: [] }],
            },
        }
        this.columns = [
            {
                title: '字段英文名',
                dataIndex: 'columnEnglishName',
                key: 'columnEnglishName',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '字段中文名',
                dataIndex: 'columnChineseName',
                key: 'columnChineseName',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '标准字段英文名',
                dataIndex: 'standardChineseName',
                key: 'standardChineseName',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
            {
                title: '标准字段英文名',
                dataIndex: 'standardEnglishName',
                key: 'standardEnglishName',
                render: (text) => (text ? <Tooltip title={text}>{text}</Tooltip> : <EmptyLabel />),
            },
        ]
    }
    componentWillMount = () => {
        // this.getTableList({})
        this.getDatasource()
    }
    deleteData = (data) => {
        let that = this
        confirm({
            title: '你确定要删除此条映射吗？',
            content: '',
            okText: '确定',
            cancelText: '取消',
            onOk() {},
        })
    }
    getDatasource = async () => {
        let res = await lineageDatasource()
        if (res.code == 200) {
            this.setState({
                datasourceList: res.data,
            })
        }
    }
    getFile = async () => {
        let res = await searchLineageFile({ datasourceIdList: [this.state.datasourceId] })
        if (res.code == 200) {
            this.setState({
                etlFileList: res.data,
            })
        }
    }
    getTableList = async (params = {}) => {
        console.log(params, 'params+++++')
        let query = {
            ...params,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 10,
        }
        this.setState({ loading: true })
        let res = await desensitizerule(query)
        if (res.code == 200) {
            this.setState({
                tableData: [{ name: 1 }, { name: 2 }, { name: 3 }],
            })
        }
        this.setState({ loading: false })
    }
    onCancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    onChangeDataSource = async (e) => {
        await this.setState({
            datasourceId: e,
            fileId: undefined,
        })
        this.getFile()
    }
    onChangeFile = (e) => {
        this.setState({
            fileId: e,
            fetching: false,
        })
    }
    changTab = (e) => {
        this.setState({
            tabValue: e,
        })
    }
    rewrite = async () => {
        this.setState({ btnLoading: true })
        let res = await standardRewrite({ fileId: this.state.fileId })
        this.setState({ btnLoading: false, showTable: false })
        if (res.code == 200) {
            this.setState({
                rewriteInfo: res.data,
                showTable: true,
            })
        }
    }
    copy = () => {
        var input = document.getElementById('textarea')
        input.value = this.state.rewriteInfo.rewriteContent
        input.select()
        document.execCommand('copy')
        message.success('复制成功')
    }

    render() {
        const { tableData, loading, modalVisible, selectedRowKeys, tabValue, datasourceList, datasourceId, etlFileList, fileId, btnLoading, rewriteInfo, showTable } = this.state

        return (
            <div className='VControlGroup'>
                <TableLayout
                    title='标准化改写'
                    disabledDefaultFooter
                    renderDetail={() => {
                        return (
                            <React.Fragment>
                                <Module title='选择ETL文件'>
                                    <div className='HControlGroup'>
                                        <Select placeholder='数据源' style={{ width: 240 }} value={datasourceId} onChange={this.onChangeDataSource}>
                                            {datasourceList.map((item) => {
                                                return (
                                                    <Option title={item.dsName} key={item.id} value={item.id}>
                                                        {item.dsName}
                                                    </Option>
                                                )
                                            })}
                                        </Select>
                                        <Select
                                            showSearch
                                            placeholder='ETL文件'
                                            style={{ width: 360 }}
                                            value={fileId}
                                            optionFilterProp='children'
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            onChange={this.onChangeFile}
                                        >
                                            {etlFileList.map((item) => {
                                                return (
                                                    <Option title={item.name} key={item.id} value={item.id}>
                                                        {item.name}
                                                    </Option>
                                                )
                                            })}
                                        </Select>
                                        <PermissionWrap funcCode='/dtstd/rewrite/action'>
                                            <Button disabled={!datasourceId || !fileId} loading={btnLoading} onClick={this.rewrite} type='primary'>
                                                改写
                                            </Button>
                                        </PermissionWrap>
                                    </div>
                                </Module>
                            </React.Fragment>
                        )
                    }}
                />
                {showTable ? (
                    <React.Fragment>
                        <Module title='改写内容'>
                            <span style={{ color: '#9EA3A8' }}>共有{rewriteInfo.tableInfos ? rewriteInfo.tableInfos.length : 0}个数据表需要改写</span>
                            <Tabs activeKey={tabValue} tabPosition='top' onChange={this.changTab}>
                                {rewriteInfo.tableInfos.map((item, index) => (
                                    <TabPane tab={item.tableEnglishName} key={index + 1}>
                                        <div className='commonScroll' style={{ maxHeight: '180px' }}>
                                            <Table columns={this.columns} pagination={false} bordered loading={loading} dataSource={item.columnInfos} />
                                        </div>
                                    </TabPane>
                                ))}
                            </Tabs>
                        </Module>
                        <Module title='改写结果'>
                            <Row style={{ margin: '16px 0 8px 0', lineHeight: '28px' }}>
                                <Col span={13}>改写前</Col>
                                <Col span={11} className='HControlGroup'>
                                    <span>改写后</span>
                                    <a onClick={this.copy}>复制</a>
                                </Col>
                            </Row>
                            <CodeMirrorDiff newValue={rewriteInfo.rewriteContent} oldValue={rewriteInfo.oldContent} />
                        </Module>
                    </React.Fragment>
                ) : (
                    <Module title='改写内容'>
                        <EmptyIcon description='暂无改写结果，请先现在上方选择数据源和ETL文件' />
                    </Module>
                )}
                <textarea id='textarea' style={{ opacity: '0', height: '0px' }}>
                    {rewriteInfo.rewriteContent}
                </textarea>
                <div className='dopTitle'>- DOP数据运营平台 -</div>
            </div>
        )
    }
}
