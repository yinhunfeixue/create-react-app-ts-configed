import { Form, Input, Select, Button, Row, Col, message, Modal } from 'antd'
import TableLayout from '@/component/layout/TableLayout'
import React, { Component } from 'react'
import '../index.less'
import RenderUtil from '@/utils/RenderUtil'
import ProjectUtil from '@/utils/ProjectUtil'
import Module from '@/component/Module'
import { postDatasourceMapping, checkDatasourceMapping } from 'app_api/systemManage'
import { getSourceList } from 'app_api/metadataApi'

const { TextArea } = Input
export default class AddSystemMap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            addInfo: {
                content: 'target.database=.*\ntarget.table={source.database}_{source.table}\ntarget.column={source.column}',
            },
            checkResult: false,
            loading: false,
            sourceList: [],
        }
    }
    componentWillMount = () => {
        if (this.pageParams.pageType == 'edit') {
            this.setState({
                addInfo: this.pageParams,
                checkResult: true,
            })
        }
        this.getDataSourceData()
    }
    getDataSourceData = async () => {
        let query = {
            page: 1,
            page_size: 10000,
        }
        let res = await getSourceList(query)
        if (res.code == 200) {
            res.data.map((item) => {
                item.id = item.id.toString()
            })
            this.setState({
                sourceList: res.data,
            })
        }
    }
    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }
    cancel = () => {
        this.props.addTab('系统映射关系')
    }
    onChangeInput = (e) => {
        let { addInfo } = this.state
        addInfo.content = e.target.value
        this.setState({
            addInfo,
        })
    }
    changeStatus = async (name, e, node) => {
        let { addInfo } = this.state
        addInfo[name] = e
        if (name == 'sourceDatasourceId') {
            addInfo.sourceDatasourceIdentifier = node.props.identifier
        }
        if (name == 'targetDatasourceId') {
            addInfo.targetDatasourceIdentifier = node.props.identifier
        }
        await this.setState({
            addInfo,
        })
        this.getCheckResult(this.state.addInfo.sourceDatasourceId, this.state.addInfo.targetDatasourceId)
    }
    getCheckResult = (sourceDatasourceId, targetDatasourceId) => {
        if (sourceDatasourceId !== undefined && targetDatasourceId !== undefined) {
            checkDatasourceMapping({ sourceDatasourceId: sourceDatasourceId, targetDatasourceId: targetDatasourceId }).then((res) => {
                if (res.code == 200) {
                    this.setState({ checkResult: true })
                } else {
                    this.setState({ checkResult: false })
                }
            })
        }
    }
    saveAndUpdate = () => {
        let { addInfo } = this.state
        addInfo.execute = true
        let that = this
        Modal.confirm({
            title: '',
            content: '更新血缘时会删除老的映射关系产生的血缘，并依据最新的映射关系生成血缘，更新后不可恢复，请谨慎操作',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                that.postData(addInfo)
            },
        })
    }
    save = () => {
        let { addInfo } = this.state
        addInfo.execute = false
        this.postData(addInfo)
    }
    postData = async (query) => {
        this.setState({ loading: true })
        let res = await postDatasourceMapping(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel()
        }
    }

    render() {
        const { loading, addInfo, sourceList, checkResult } = this.state
        const { pageType } = this.pageParams
        return (
            <div className='addSystemMap' style={{ paddingBottom: 50 }}>
                <TableLayout
                    title={pageType == 'edit' ? '编辑系统映射' : '新增系统映射'}
                    disabledDefaultFooter
                    renderDetail={() => {
                        return (
                            <Module title='映射信息'>
                                <Form className='EditMiniForm Grid1'>
                                    <Row gutter={16} style={{ width: 'calc(50% - 4px)' }}>
                                        <Col span={12}>
                                            {RenderUtil.renderFormItems([
                                                {
                                                    label: '来源数据源',
                                                    content: (
                                                        <div>
                                                            <Select
                                                                showSearch
                                                                optionFilterProp='title'
                                                                onChange={this.changeStatus.bind(this, 'sourceDatasourceId')}
                                                                value={addInfo.sourceDatasourceId}
                                                                placeholder='请选择'
                                                            >
                                                                {sourceList.map((item) => {
                                                                    return (
                                                                        <Select.Option identifier={item.identifier} title={item.dsName} key={item.id} value={item.id}>
                                                                            {item.dsName}
                                                                        </Select.Option>
                                                                    )
                                                                })}
                                                            </Select>
                                                            {addInfo.sourceDatasourceIdentifier ? (
                                                                <div style={{ marginTop: 8 }}>
                                                                    <span style={{ color: '#5e6266' }}>英文名：</span>
                                                                    {addInfo.sourceDatasourceIdentifier}
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    ),
                                                },
                                            ])}
                                        </Col>
                                        <Col span={12}>
                                            {RenderUtil.renderFormItems([
                                                {
                                                    label: '目标数据源',
                                                    content: (
                                                        <div>
                                                            <Select
                                                                showSearch
                                                                optionFilterProp='title'
                                                                onChange={this.changeStatus.bind(this, 'targetDatasourceId')}
                                                                value={addInfo.targetDatasourceId}
                                                                placeholder='请选择'
                                                            >
                                                                {sourceList.map((item) => {
                                                                    return (
                                                                        <Select.Option identifier={item.identifier} title={item.dsName} key={item.id} value={item.id}>
                                                                            {item.dsName}
                                                                        </Select.Option>
                                                                    )
                                                                })}
                                                            </Select>
                                                            {addInfo.targetDatasourceIdentifier ? (
                                                                <div style={{ marginTop: 8 }}>
                                                                    <span style={{ color: '#5e6266' }}>英文名：</span>
                                                                    {addInfo.targetDatasourceIdentifier}
                                                                </div>
                                                            ) : null}
                                                        </div>
                                                    ),
                                                },
                                            ])}
                                        </Col>
                                    </Row>
                                    {RenderUtil.renderFormItems([
                                        {
                                            label: '映射配置（示例如下）',
                                            content: (
                                                <div className='Grid2' style={{ columnGap: '40px' }}>
                                                    <TextArea style={{ height: 400 }} placeholder='请输入' value={addInfo.content} onChange={this.onChangeInput} />
                                                    <div className='descArea'>
                                                        <div style={{ color: '#5E6266', marginBottom: 16 }}>填写说明</div>
                                                        <div>1. 定义方式</div>
                                                        <div className='Grid2 borderLeft'>
                                                            <div>
                                                                target.database 代表目标数据源的数据库
                                                                <br />
                                                                target.table 代表目标数据源的数据表
                                                                <br />
                                                                target.column 代表目标数据源的数据字段
                                                            </div>
                                                            <div>
                                                                source.database 代表来源数据源的数据库
                                                                <br />
                                                                source.table 代表来源数据源的数据表
                                                                <br />
                                                                source.column 代表来源数据源的数据字段
                                                            </div>
                                                        </div>
                                                        <div>2. 支持以下几种规则转换方式</div>
                                                        <div className='Grid2 borderLeft'>
                                                            <div>
                                                                2.1 加固定前缀AAA
                                                                <br />
                                                                {'target.database=AAA_{source.database}'}
                                                                <br />
                                                                {'//目标库=AAA_来源库'}
                                                            </div>
                                                            <div>
                                                                2.2 加固定后缀AAA
                                                                <br />
                                                                {'target.database={source.database}_AAA'}
                                                                <br />
                                                                {'//目标库=来源库_AAA'}
                                                            </div>
                                                        </div>
                                                        <div>3.引用</div>
                                                        <div style={{ borderLeft: '0px' }} className='Grid2 borderLeft'>
                                                            <div>
                                                                {'target.table={source.database}_{source.table}'}
                                                                <br />
                                                                {'//目标表=来源库_来源表'}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                        },
                                    ])}
                                </Form>
                            </Module>
                        )
                    }}
                    showFooterControl
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Button
                                    disabled={!addInfo.sourceDatasourceId || !addInfo.targetDatasourceId || !addInfo.content || !checkResult}
                                    loading={loading}
                                    type='primary'
                                    onClick={this.saveAndUpdate}
                                >
                                    保存并更新血缘
                                </Button>
                                <Button disabled={!addInfo.sourceDatasourceId || !addInfo.targetDatasourceId || !addInfo.content || !checkResult} loading={loading} type='primary' onClick={this.save}>
                                    仅保存
                                </Button>
                                <Button onClick={this.cancel}>取消</Button>
                            </React.Fragment>
                        )
                    }}
                />
            </div>
        )
    }
}
