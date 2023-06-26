import EmptyLabel from '@/component/EmptyLabel';
import DrawerLayout from '@/component/layout/DrawerLayout';
import Module from '@/component/Module';
import RenderUtil from '@/utils/RenderUtil';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Divider, Drawer, Empty, Form, Input, Popover, Spin, Tabs, Tooltip } from 'antd';
import { bizLimitDetail, statisticalperiodDetail } from 'app_api/metadataApi';
import { derivativeMetricsSql, getAtomicMetricsById, getDerById, getDeriveRelatedMetrics, getRelatedMetrics } from 'app_api/termApi';
import { LzTable } from 'app_component';
import React, { Component } from 'react';
import DeriveDetailDrawer from '../newIndexma/deriveDetailDrawer';
// import './index.less'
import './indexmaDrawer.less';

const TabPane = Tabs.TabPane
const { TextArea } = Input

export default class IndexmaDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: 'atomic',
            indexmaDrawer: false,
            tabValue: '0',
            detailInfo: {},
            changeTableData: [],
            changeTotal: 0,
            loading: false,
            keyword: '',
            showSearchResult: false,
            deriveDetailInfo: {
                atomicMetricsDTO: {},
                businessLimitDTO: {},
                statisticalPeriodDTO: {},
            },
            deriveModal: false,
            sqlLoading: false,
            sqlContent: '',
            atomDetailModal: false,
            atomDetailInfo: {},
            periodDetailModal: false,
            periodDetailInfo: {},
            businessDetailInfo: {},
            businessDetailModal: false,
            indexmaInfo: {},
        }
        this.indexmaColumns = [
            {
                title: '指标名称',
                dataIndex: 'chineseName',
                key: 'chineseName',
                width: 240,
                fixed: 'left',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp1'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '指标英文名',
                dataIndex: 'englishName',
                key: 'englishName',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp1'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '统计粒度',
                dataIndex: 'statisticalColumns',
                key: 'statisticalColumns',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '统计周期',
                dataIndex: 'statisticalPeriod',
                key: 'statisticalPeriod',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '业务限定',
                dataIndex: 'businessLimit',
                key: 'businessLimit',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '口径说明',
                dataIndex: 'description',
                key: 'description',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '操作',
                width: 60,
                fixed: 'right',
                render: (_, record) => {
                    return <a onClick={this.openIndexmaPage.bind(this, record.derivativeId)}>详情</a>
                },
            },
        ]
        this.deriveColumns = [
            {
                title: '指标名称',
                dataIndex: 'chineseName',
                key: 'chineseName',
                width: 240,
                fixed: 'left',
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp1'>{text}</span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '指标英文名',
                dataIndex: 'englishName',
                key: 'englishName',
                render: (text) => (text ? <span className='LineClamp1'>{text}</span> : <EmptyLabel />),
            },
            {
                title: '原子指标',
                dataIndex: 'atomicMetricName',
                key: 'atomicMetricName',
                width: 240,
                render: (text, record) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <a onClick={this.openAtomDetail.bind(this, record.atomicMetricId)}>{text}</a>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '统计周期',
                dataIndex: 'statisticalPeriod',
                key: 'statisticalPeriod',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '业务限定',
                dataIndex: 'businessLimit',
                key: 'businessLimit',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '口径说明',
                dataIndex: 'description',
                key: 'description',
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            {text}
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '操作',
                width: 60,
                fixed: 'right',
                render: (_, record) => {
                    return <a onClick={this.openIndexmaPage.bind(this, record.derivativeId)}>详情</a>
                },
            },
        ]
    }
    componentWillMount = () => {}
    openDrawer = async (data) => {
        await this.setState({
            indexmaDrawer: true,
            type: data.type,
            keyword: '',
            indexmaInfo: data,
            showSearchResult: false,
        })
        this.changeTab(data.tabValue)
        if (data.type == 'atomic') {
            this.getAtomDetail(data.id)
        } else {
            this.getDeriveDetail(data.id)
        }
    }
    openIndexmaPage = async (id) => {
        this.deriveDrawer.openDetailModal({ id: id })
    }
    changeTab = (e) => {
        this.setState({
            tabValue: e,
        })
        if (e == 1) {
            this.getTableList()
        }
    }
    reset = () => {}
    getAtomDetail = async (id) => {
        let res = await getAtomicMetricsById({ id: id })
        if (res.code == 200) {
            this.setState({
                detailInfo: res.data,
            })
        }
    }
    getDeriveDetail = async (id) => {
        this.getSql(id)
        let res = await getDerById({ id: id })
        if (res.code == 200) {
            this.setState({
                deriveDetailInfo: res.data,
            })
        }
    }
    search = () => {
        this.setState({
            showSearchResult: true,
        })
        this.getTableList({})
    }
    getTableList = async (params = {}) => {
        let { type } = this.state
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 10,
            keyword: this.state.keyword,
            metricsId: this.state.indexmaInfo.id,
        }
        this.setState({ loading: true })
        let res = {}
        if (type == 'atomic') {
            res = await getRelatedMetrics(query)
        } else {
            res = await getDeriveRelatedMetrics(query)
        }
        if (res.code == 200) {
            let param = {
                ...params.filterSelectedList,
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 10,
                // dataIndex
            }
            let data = {
                data: res.data,
                total: res.total,
            }
            this.setState({
                changeTableData: res.data,
                changeTotal: res.total,
            })
            this.lzTableDom && this.lzTableDom.setTableData(data, param)
        }
        this.setState({ loading: false })
    }
    changeKeyword = async (e) => {
        let { keyword } = this.state
        await this.setState({
            keyword: e.target.value,
        })
        if (!e.target.value) {
            this.search()
        }
    }
    getFunction = (value) => {
        if (value == 'sum') {
            return '求和'
        } else if (value == 'average') {
            return '平均值'
        } else if (value == 'accumulate') {
            return '累计值'
        } else if (value == 'count') {
            return '不去重计数'
        } else if (value == 'dist_count') {
            return '去重计数'
        } else if (value == 'max') {
            return '最大值'
        } else if (value == 'min') {
            return '最小值'
        }
    }
    cancel = () => {
        this.setState({
            deriveModal: false,
        })
    }
    openAtomDetail = async (id) => {
        this.setState({
            atomDetailModal: true,
        })
        let res = await getAtomicMetricsById({ id: id })
        if (res.code == 200) {
            this.setState({
                atomDetailInfo: res.data,
            })
        }
    }
    atomCancel = () => {
        this.setState({
            atomDetailModal: false,
        })
    }
    openPeriodDetail = async (id) => {
        this.setState({
            periodDetailModal: true,
        })
        let res = await statisticalperiodDetail({ id: id })
        if (res.code == 200) {
            this.setState({
                periodDetailInfo: res.data,
            })
        }
    }
    periodCancel = () => {
        this.setState({
            periodDetailModal: false,
        })
    }
    businessCancel = () => {
        this.setState({
            businessDetailModal: false,
        })
    }
    openBusinessDetail = async (id) => {
        this.setState({
            businessDetailModal: true,
        })
        let res = await bizLimitDetail({ id: id })
        if (res.code == 200) {
            this.setState({
                businessDetailInfo: res.data,
            })
        }
    }
    getSql = async (id) => {
        this.setState({ sqlLoading: true })
        let res = await derivativeMetricsSql({ id: id })
        this.setState({ sqlLoading: false })
        if (res.code == 200) {
            this.setState({
                sqlContent: res.data,
            })
        }
    }
    atomDetail = (data) => {
        return (
            <div className='atomDetailArea detailArea'>
                <Module title='基础信息'>
                    <Form className='MiniForm Grid3'>
                        {RenderUtil.renderFormItems([
                            { label: '指标编码', content: data.codeNo },
                            { label: '指标名称', content: data.chineseName },
                            { label: '指标英文名', content: data.englishName },
                            { label: '指标类型', content: data.metricsTypeText },
                            { label: '业务板块', content: data.moduleNameWithParent },
                            { label: '主题域', content: data.themeNameWithParent },
                            { label: '业务过程', content: data.bizProcessName },
                            { label: '业务口径', content: data.description },
                        ])}
                    </Form>
                </Module>
                <Divider />
                <Module title='业务定义'>
                    <div className='MiniForm Grid3'>
                        {RenderUtil.renderFormItems([
                            {
                                label: '计算逻辑',
                                content: (
                                    <span>
                                        {data.factColumnName}
                                        {this.getFunction(data.function)}
                                    </span>
                                ),
                            },
                            {
                                label: '来源模型',
                                content: (
                                    <React.Fragment>
                                        {data.factAssetsName} {data.factAssetsNameEn} {!data.factAssetsName && !data.factAssetsNameEn ? <EmptyLabel /> : ''}
                                    </React.Fragment>
                                ),
                            },
                            {
                                label: '来源字段',
                                content: (
                                    <React.Fragment>
                                        {data.factColumnName} {data.factColumnNameEn} {!data.factColumnName && !data.factColumnNameEn ? <EmptyLabel /> : ''}
                                    </React.Fragment>
                                ),
                            },
                        ])}
                    </div>
                </Module>
                <Divider />
                <Module title='管理属性'>
                    <Form className='MiniForm Grid3'>
                        {RenderUtil.renderFormItems([
                            { label: '技术归口部门', content: data.techDepartName },
                            { label: '业务归口部门', content: data.busiDepartName },
                            { label: '负责人', content: data.busiManagerName },
                            { label: '创建时间', content: data.createTime },
                            { label: '创建人', content: data.createUser },
                            { label: '更新时间', content: data.updateTime },
                            { label: '修改人', content: data.updateUser },
                        ])}
                    </Form>
                </Module>
            </div>
        )
    }

    atomDetail2 = (data) => {
        return (
            <React.Fragment>
                <Form className='MiniForm DetailPart' layout='inline'>
                    <h3>基础信息</h3>
                    {RenderUtil.renderFormItems([
                        { label: '指标编码', content: data.codeNo },
                        { label: '指标名称', content: data.chineseName },
                        { label: '指标英文名', content: data.englishName },
                        { label: '指标类型', content: data.metricsTypeText },
                        { label: '业务板块', content: data.moduleNameWithParent },
                        { label: '主题域', content: data.themeNameWithParent },
                        { label: '业务过程', content: data.bizProcessName },
                        { label: '业务口径', content: data.description },
                    ])}
                </Form>
                <Form className='MiniForm DetailPart' layout='inline'>
                    <h3>业务定义</h3>
                    {RenderUtil.renderFormItems([
                        {
                            label: '计算逻辑',
                            content: (
                                <span>
                                    {data.factColumnName}
                                    {this.getFunction(data.function)}
                                </span>
                            ),
                        },
                        {
                            label: '来源模型',
                            content: (
                                <React.Fragment>
                                    {data.factAssetsName} {data.factAssetsNameEn} {!data.factAssetsName && !data.factAssetsNameEn ? <EmptyLabel /> : ''}
                                </React.Fragment>
                            ),
                        },
                        {
                            label: '来源字段',
                            content: (
                                <React.Fragment>
                                    {data.factColumnName} {data.factColumnNameEn} {!data.factColumnName && !data.factColumnNameEn ? <EmptyLabel /> : ''}
                                </React.Fragment>
                            ),
                        },
                    ])}
                </Form>
                <Form className='MiniForm DetailPart' layout='inline'>
                    <h3>管理属性</h3>
                    {RenderUtil.renderFormItems([
                        { label: '技术归口部门', content: data.techDepartName },
                        { label: '业务归口部门', content: data.busiDepartName },
                        { label: '负责人', content: data.busiManagerName },
                        { label: '创建时间', content: data.createTime },
                        { label: '创建人', content: data.createUser },
                        { label: '更新时间', content: data.updateTime },
                        { label: '修改人', content: data.updateUser },
                    ])}
                </Form>
            </React.Fragment>
        )
    }
    deriveDetail = (data, sqlLoading, sqlContent) => {
        return (
            <div className='atomDetailArea detailArea'>
                <Module title='基础信息'>
                    <Form className='MiniForm Grid3'>
                        {RenderUtil.renderFormItems([
                            { label: '指标编码', content: data.codeNo },
                            { label: '指标名称', content: data.chineseName },
                            { label: '指标英文名', content: data.englishName },
                            { label: '指标类型', content: data.metricsTypeText },
                            { label: '业务板块', content: data.moduleNameWithParent },
                            { label: '主题域', content: data.themeNameWithParent },
                            { label: '业务过程', content: data.bizProcessName },
                            { label: '业务口径', content: data.description },
                        ])}
                    </Form>
                </Module>
                <Module title='业务定义'>
                    <Form className='MiniForm Grid3'>
                        {RenderUtil.renderFormItems([
                            {
                                label: '原子指标',
                                content: (
                                    <React.Fragment>
                                        {data.atomicMetricsDTO.chineseName || <EmptyLabel />}
                                        <Popover
                                            placement='topLeft'
                                            content={
                                                <div style={{ color: '#666', fontFamily: 'PingFangSC-Light, PingFang SC', maxWidth: 300, lineHeight: '25px' }}>
                                                    <div>
                                                        <span>指标名称：</span>
                                                        <span
                                                            onClick={this.openAtomDetail.bind(this, data.atomicMetricsDTO.id)}
                                                            className='atomTooltip'
                                                            style={{ color: '#1890ff', cursor: 'pointer' }}
                                                        >
                                                            {data.atomicMetricsDTO.chineseName}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span>计算逻辑：</span>
                                                        <span className='atomTooltip'>{data.atomicMetricsDTO.factColumnName + '' + this.getFunction(data.atomicMetricsDTO.function)}</span>
                                                    </div>
                                                    <div>
                                                        <span>业务口径：</span>
                                                        <span className='atomTooltip'>{data.atomicMetricsDTO.description || <EmptyLabel />}</span>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            <InfoCircleOutlined style={{ color: '#b3b3b3', marginLeft: '5px' }} />
                                        </Popover>
                                    </React.Fragment>
                                ),
                            },
                            { label: '统计粒度', content: data.statisticalColumnText },
                            {
                                label: '统计周期',
                                content: (
                                    <React.Fragment>
                                        {data.statisticalPeriodDTO ? data.statisticalPeriodDTO.chineseName : <EmptyLabel />}
                                        <Popover
                                            placement='topLeft'
                                            content={
                                                <div style={{ color: '#666', fontFamily: 'PingFangSC-Light, PingFang SC', maxWidth: 300, lineHeight: '25px' }}>
                                                    <div>
                                                        <span>统计周期名称：</span>
                                                        <span
                                                            onClick={this.openPeriodDetail.bind(this, data.statisticalPeriodDTO ? data.statisticalPeriodDTO.id : '')}
                                                            className='atomTooltip'
                                                            style={{ color: '#1890ff', cursor: 'pointer' }}
                                                        >
                                                            {data.statisticalPeriodDTO.chineseName}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span>业务口径：</span>
                                                        <span className='atomTooltip'>{data.statisticalPeriodDTO ? data.statisticalPeriodDTO.description : <EmptyLabel />}</span>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            <InfoCircleOutlined style={{ color: '#b3b3b3', marginLeft: '5px' }} />
                                        </Popover>
                                    </React.Fragment>
                                ),
                            },
                            {
                                label: '业务限定',
                                content: (
                                    <React.Fragment>
                                        {data.businessLimitDTO ? data.businessLimitDTO.chineseName : <EmptyLabel />}
                                        <Popover
                                            placement='topLeft'
                                            content={
                                                <div style={{ color: '#666', fontFamily: 'PingFangSC-Light, PingFang SC', maxWidth: 300, lineHeight: '25px' }}>
                                                    <div>
                                                        <span>限定词名称：</span>
                                                        <span
                                                            className='atomTooltip'
                                                            onClick={this.openBusinessDetail.bind(this, data.businessLimitDTO ? data.businessLimitDTO.id : '')}
                                                            style={{ color: '#1890ff', cursor: 'pointer' }}
                                                        >
                                                            {data.businessLimitDTO ? data.businessLimitDTO.chineseName : <EmptyLabel />}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span>计算逻辑：</span>
                                                        <span className='atomTooltip'>{data.businessLimitDTO ? data.businessLimitDTO.queryDesc : <EmptyLabel />}</span>
                                                    </div>
                                                    <div>
                                                        <span>业务口径：</span>
                                                        <span className='atomTooltip'>{data.businessLimitDTO ? data.businessLimitDTO.description : <EmptyLabel />}</span>
                                                    </div>
                                                </div>
                                            }
                                        >
                                            {data.businessLimitDTO ? <InfoCircleOutlined style={{ color: '#b3b3b3', marginLeft: '5px' }} /> : null}
                                        </Popover>
                                    </React.Fragment>
                                ),
                            },
                            {
                                label: '来源模型',
                                content: (
                                    <React.Fragment>
                                        {data.factAssetsName} {data.factAssetsNameEn} {!data.factAssetsName && !data.factAssetsNameEn ? <EmptyLabel /> : ''}
                                    </React.Fragment>
                                ),
                            },
                            {
                                label: '来源字段',
                                content: (
                                    <React.Fragment>
                                        {data.factColumnName} {data.factColumnNameEn} {!data.factColumnName && !data.factColumnNameEn ? <EmptyLabel /> : ''}
                                    </React.Fragment>
                                ),
                            },
                        ])}
                    </Form>
                </Module>
                <Module title='技术口径'>
                    <Form className='MiniForm Grid'>
                        {RenderUtil.renderFormItems([{ label: '', content: <TextArea disabled={true} style={{ height: 150, resize: 'none', color: '#333' }} value={sqlContent} /> }])}
                    </Form>
                </Module>
                <Module title='管理属性'>
                    <Form className='MiniForm Grid3'>
                        {RenderUtil.renderFormItems([
                            { label: '技术归口部门', content: data.techDepartName },
                            { label: '业务归口部门', content: data.busiDepartName },
                            { label: '负责人', content: data.busiManagerName },
                            { label: '创建时间', content: data.createTime },
                            { label: '创建人', content: data.createUser },
                            { label: '更新时间', content: data.updateTime },
                            { label: '修改人', content: data.updateUser },
                        ])}
                    </Form>
                </Module>
            </div>
        );
    }
    handleCancel = () => {
        this.setState({
            indexmaDrawer: false,
        })
    }
    render() {
        const {
            type,
            tabValue,
            detailInfo,
            loading,
            changeTableData,
            changeTotal,
            showSearchResult,
            keyword,
            deriveDetailInfo,
            deriveModal,
            sqlLoading,
            sqlContent,
            atomDetailModal,
            atomDetailInfo,
            periodDetailModal,
            periodDetailInfo,
            businessDetailModal,
            businessDetailInfo,
            indexmaDrawer,
        } = this.state
        return (
            <div>
                <Drawer title='指标详情' placement='right' closable={true} maskClosable={true} width={1000} onClose={this.handleCancel} visible={indexmaDrawer} className='commonDrawer indexmaDrawer'>
                    {indexmaDrawer ? (
                        <div className='commonTablePage assetManage indexmaAssetDetail'>
                            <div className='assetTitle'>
                                <div
                                    className='assetIcon'
                                    style={{
                                        background: type == 'atomic' ? '#316ce2' : '#EA8137',
                                    }}
                                >
                                    {type == 'atomic' ? '原' : '衍'}
                                </div>
                                <div className='OverView'>
                                    {type == 'atomic' ? (
                                        <Tooltip title={detailInfo.chineseName + detailInfo.englishName}>
                                            <div className='title'>
                                                {detailInfo.chineseName || <EmptyLabel />} {detailInfo.englishName || <EmptyLabel />}
                                            </div>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title={deriveDetailInfo.chineseName + deriveDetailInfo.englishName}>
                                            <div className='title'>
                                                {deriveDetailInfo.chineseName || <EmptyLabel />} {deriveDetailInfo.englishName || <EmptyLabel />}
                                            </div>
                                        </Tooltip>
                                    )}
                                    {type == 'atomic' ? (
                                        <div>
                                            {RenderUtil.renderSplitList(
                                                [
                                                    {
                                                        label: '业务板块：',
                                                        content: detailInfo.moduleNameWithParent,
                                                    },
                                                    {
                                                        label: '主题域：',
                                                        content: detailInfo.themeNameWithParent,
                                                    },
                                                    {
                                                        label: '业务过程：',
                                                        content: detailInfo.bizProcessName,
                                                    },
                                                    {
                                                        label: '负责人：',
                                                        content: detailInfo.busiManagerName,
                                                    },
                                                ],
                                                'atomLabel'
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            {RenderUtil.renderSplitList(
                                                [
                                                    {
                                                        label: '业务板块：',
                                                        content: deriveDetailInfo.moduleNameWithParent,
                                                    },
                                                    {
                                                        label: '主题域：',
                                                        content: deriveDetailInfo.themeNameWithParent,
                                                    },
                                                    {
                                                        label: '业务过程：',
                                                        content: deriveDetailInfo.bizProcessName,
                                                    },
                                                    {
                                                        label: '负责人：',
                                                        content: deriveDetailInfo.busiManagerName,
                                                    },
                                                ],
                                                'atomLabel'
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <main>
                                <Tabs
                                    activeKey={tabValue}
                                    onChange={this.changeTab}
                                    tabBarExtraContent={
                                        <Tooltip
                                            title={
                                                <span>
                                                    显示与 <b>{type == 'atomic' ? detailInfo.chineseName : deriveDetailInfo.chineseName}</b> 具有相同统计粒度的衍生指标
                                                </span>
                                            }
                                        >
                                            <span className='NoImportLabel'>什么是关联指标？</span>
                                        </Tooltip>
                                    }
                                >
                                    <TabPane tab='基本信息' key='0'>
                                        {type == 'atomic' ? <div>{this.atomDetail(detailInfo)}</div> : <div>{this.deriveDetail(deriveDetailInfo, sqlLoading, sqlContent)}</div>}
                                    </TabPane>
                                    <TabPane tab='关联指标' key='1'>
                                        {showSearchResult || changeTotal ? (
                                            <div className='HControlGroup' style={{ marginBottom: 16 }}>
                                                <Input.Search allowClear value={keyword} onSearch={this.search} onChange={this.changeKeyword} placeholder='搜索指标名称' />
                                            </div>
                                        ) : null}
                                        {showSearchResult || changeTotal ? (
                                            <div>
                                                <LzTable
                                                    key='1'
                                                    from='globalSearch'
                                                    columns={type == 'atomic' ? this.indexmaColumns : this.deriveColumns}
                                                    dataSource={changeTableData}
                                                    ref={(dom) => {
                                                        this.lzTableDom = dom
                                                    }}
                                                    getTableList={this.getTableList}
                                                    loading={loading}
                                                    rowKey='id'
                                                    pagination={{
                                                        showQuickJumper: true,
                                                        showSizeChanger: true,
                                                    }}
                                                    scroll={{ x: 1500 }}
                                                />
                                            </div>
                                        ) : (
                                            <Spin spinning={loading}>
                                                <div className='emptyIconArea' style={{ marginTop: 24 }}>
                                                    <div className='iconContent'>
                                                        <Empty description='无关联指标' />
                                                    </div>
                                                </div>
                                            </Spin>
                                        )}
                                    </TabPane>
                                </Tabs>
                            </main>
                        </div>
                    ) : null}
                </Drawer>
                <Drawer title='指标详情' placement='right' closable={true} maskClosable={true} width={480} onClose={this.cancel} visible={deriveModal} className='commonDrawer atomDrawer'>
                    {deriveModal ? <div>{this.deriveDetail(deriveDetailInfo, sqlLoading, sqlContent)}</div> : null}
                </Drawer>
                <DrawerLayout
                    drawerProps={{
                        title: '指标详情',
                        width: 480,
                        onClose: this.atomCancel,
                        visible: atomDetailModal,
                    }}
                >
                    {atomDetailModal ? this.atomDetail2(atomDetailInfo) : null}
                </DrawerLayout>
                <DrawerLayout
                    drawerProps={{
                        title: '统计周期详情',
                        onClose: this.periodCancel,
                        visible: periodDetailModal,
                    }}
                >
                    {periodDetailInfo ? (
                        <React.Fragment>
                            <Form className='MiniForm DetailPart' layout='inline'>
                                <h3>基本信息</h3>
                                {RenderUtil.renderFormItems([
                                    { label: '统计周期名称', content: periodDetailInfo.chineseName },
                                    { label: '统计周期英文名', content: periodDetailInfo.englishName },
                                    { label: '英文缩写', content: periodDetailInfo.englishNameAbbr },
                                    { label: '业务描述', content: periodDetailInfo.description },
                                ])}
                            </Form>
                            <Form className='MiniForm DetailPart' layout='inline'>
                                <h3>业务定义</h3>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '时间粒度',
                                        content:
                                            periodDetailInfo.granularity == 0
                                                ? '日'
                                                : periodDetailInfo.granularity == 1
                                                ? '月'
                                                : detailInfo.granularity == 2
                                                ? '周'
                                                : detailInfo.granularity == 3
                                                ? '季度'
                                                : '年',
                                    },
                                    { label: '时间类型', content: periodDetailInfo.periodType == 0 ? '自然周期' : '相对周期' },
                                    { label: '计算逻辑', content: periodDetailInfo.calculateDesc },
                                ])}
                            </Form>
                            <Form className='MiniForm DetailPart' layout='inline'>
                                <h3>管理属性</h3>
                                {RenderUtil.renderFormItems([
                                    { label: '创建时间', content: periodDetailInfo.createTime },
                                    { label: '创建人', content: periodDetailInfo.createUser },
                                    { label: '更新时间', content: periodDetailInfo.updateTime },
                                    { label: '修改人', content: periodDetailInfo.updateUser },
                                ])}
                            </Form>
                        </React.Fragment>
                    ) : null}
                </DrawerLayout>
                <Drawer
                    title='业务限定详情'
                    placement='right'
                    closable={true}
                    maskClosable={true}
                    width={480}
                    onClose={this.businessCancel}
                    visible={businessDetailModal}
                    className='commonDrawer periodDrawer'
                >
                    {businessDetailModal ? (
                        <div className='atomDetailArea'>
                            <div className='title' style={{ marginTop: 0, textAlign: 'left' }}>
                                基本信息
                            </div>
                            <div>
                                <span className='atomLabel'>业务限定名称：</span>
                                <span className='atomContent'>{businessDetailInfo.chineseName || <EmptyLabel />}</span>
                            </div>
                            <div>
                                <span className='atomLabel'>业务限定英文名：</span>
                                <span className='atomContent'>{businessDetailInfo.englishName || <EmptyLabel />}</span>
                            </div>
                            <div>
                                <span className='atomLabel'>业务板块：</span>
                                <span className='atomContent'>{businessDetailInfo.bizModuleName || <EmptyLabel />}</span>
                            </div>
                            <div>
                                <span className='atomLabel'>主题域：</span>
                                <span className='atomContent'>{businessDetailInfo.themeName || <EmptyLabel />}</span>
                            </div>
                            <div>
                                <span className='atomLabel'>业务描述：</span>
                                <span className='atomContent'>{businessDetailInfo.description || <EmptyLabel />}</span>
                            </div>
                            <div className='title' style={{ textAlign: 'left' }}>
                                业务定义
                            </div>
                            <div>
                                <span className='atomLabel'>计算逻辑：</span>
                                <span className='atomContent'>{businessDetailInfo.calculateDesc || <EmptyLabel />}</span>
                            </div>
                            <div>
                                <span className='atomLabel'>业务限定来源：</span>
                                <span className='atomContent'>
                                    {businessDetailInfo.sourceAssetsName} {businessDetailInfo.sourceAssetsEnglishName}{' '}
                                    {!businessDetailInfo.sourceAssetsName && !businessDetailInfo.sourceAssetsEnglishName ? <EmptyLabel /> : ''}
                                </span>
                            </div>
                            <div className='title' style={{ textAlign: 'left' }}>
                                管理属性
                            </div>
                            <div>
                                <span className='atomLabel'>创建时间：</span>
                                <span className='atomContent'>{businessDetailInfo.createTime || <EmptyLabel />}</span>
                            </div>
                            <div>
                                <span className='atomLabel'>创建人：</span>
                                <span className='atomContent'>{businessDetailInfo.createUser || <EmptyLabel />}</span>
                            </div>
                            <div>
                                <span className='atomLabel'>更新时间：</span>
                                <span className='atomContent'>{businessDetailInfo.updateTime || <EmptyLabel />}</span>
                            </div>
                            <div>
                                <span className='atomLabel'>修改人：</span>
                                <span className='atomContent'>{businessDetailInfo.updateUser || <EmptyLabel />}</span>
                            </div>
                        </div>
                    ) : null}
                </Drawer>
                <DeriveDetailDrawer
                    ref={(dom) => {
                        this.deriveDrawer = dom
                    }}
                    {...this.props}
                />
            </div>
        )
    }
}
