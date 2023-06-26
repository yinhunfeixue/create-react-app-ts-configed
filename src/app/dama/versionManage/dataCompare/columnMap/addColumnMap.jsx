import { Input, Select, Button, Row, Col, message } from 'antd'
import { Form } from '@ant-design/compatible'
import TableLayout from '@/component/layout/TableLayout'
import React, { Component } from 'react'
import '../index.less'
import RenderUtil from '@/utils/RenderUtil'
import ProjectUtil from '@/utils/ProjectUtil'
import Module from '@/component/Module'
import { datasourceType, addColumnTypeMapping } from 'app_api/systemManage'

const { TextArea } = Input
export default class AddSystemMap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            addInfo: {
                content: 'tinyint:string\nsmallint:int\nmediumint:int\nint:int\ninteger:int\nbigint:bigint\nfloat:decimal(38,12)\ndouble:decimal(38,12)\ndecimal:decimal\nbit:boolean"',
            },
            loading: false,
            sourceList: [],
        }
    }
    componentWillMount = () => {
        if (this.pageParams.pageType == 'edit') {
            this.setState({
                addInfo: this.pageParams,
            })
        }
        this.getDataSourceData()
    }
    getDataSourceData = async () => {
        let query = {
            page: 1,
            page_size: 10000,
        }
        let res = await datasourceType(query)
        if (res.code == 200) {
            this.setState({
                sourceList: res.data,
            })
        }
    }
    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }
    cancel = () => {
        this.props.addTab('字段类型映射关系')
    }
    postData = async () => {
        let { addInfo } = this.state
        let res = await postData(addInfo)
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel()
        }
    }
    onChangeInput = (e) => {
        let { addInfo } = this.state
        addInfo.content = e.target.value
        this.setState({
            addInfo,
        })
    }
    changeStatus = (name, e) => {
        let { addInfo } = this.state
        addInfo[name] = e
        this.setState({
            addInfo,
        })
    }
    postData = async () => {
        let { addInfo } = this.state
        this.setState({ loading: true })
        let res = await addColumnTypeMapping(addInfo)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel()
        }
    }
    render() {
        const { loading, addInfo, sourceList } = this.state
        const { pageType } = this.pageParams
        return (
            <div className='addSystemMap' style={{ paddingBottom: 50 }}>
                <TableLayout
                    title={pageType == 'edit' ? '编辑字段类型映射' : '新增字段类型映射'}
                    disabledDefaultFooter
                    renderDetail={() => {
                        return (
                            <Module title='映射信息'>
                                <Form className='EditMiniForm Grid1'>
                                    <Row gutter={16} style={{ width: 'calc(50% - 4px)' }}>
                                        <Col span={12}>
                                            {RenderUtil.renderFormItems([
                                                {
                                                    label: '来源类型',
                                                    content: (
                                                        <Select
                                                            showSearch
                                                            optionFilterProp='title'
                                                            onChange={this.changeStatus.bind(this, 'sourceDatasourceType')}
                                                            value={addInfo.sourceDatasourceType}
                                                            placeholder='请选择'
                                                        >
                                                            {sourceList.map((item) => {
                                                                return (
                                                                    <Select.Option title={item} key={item} value={item}>
                                                                        {item}
                                                                    </Select.Option>
                                                                )
                                                            })}
                                                        </Select>
                                                    ),
                                                },
                                            ])}
                                        </Col>
                                        <Col span={12}>
                                            {RenderUtil.renderFormItems([
                                                {
                                                    label: '目标类型',
                                                    content: (
                                                        <Select
                                                            showSearch
                                                            optionFilterProp='title'
                                                            onChange={this.changeStatus.bind(this, 'targetDatasourceType')}
                                                            value={addInfo.targetDatasourceType}
                                                            placeholder='请选择'
                                                        >
                                                            {sourceList.map((item) => {
                                                                return (
                                                                    <Select.Option title={item} key={item} value={item}>
                                                                        {item}
                                                                    </Select.Option>
                                                                )
                                                            })}
                                                        </Select>
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
                                                        <div>1. 填写格式为 sourceformat：targetformat</div>
                                                        <div className='borderLeft'>以MySQL转换到Hive为例，MySQL的smallint映射到Hive的int应该填写为smallint: int</div>
                                                        <div>2. 支持填写字段长度精度映射</div>
                                                        <div className='borderLeft'>float: decimal(38,12)</div>
                                                        <div>3.支持填写多个字段类型映射，以 | 隔开例如</div>
                                                        <div style={{ borderLeft: '0px' }} className='borderLeft'>
                                                            varchar2: varchar | string
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
                                <Button disabled={!addInfo.sourceDatasourceType || !addInfo.targetDatasourceType || !addInfo.content} loading={loading} type='primary' onClick={this.postData}>
                                    保存
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
