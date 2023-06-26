import EmptyLabel from '@/component/EmptyLabel';
import DrawerLayout from '@/component/layout/DrawerLayout';
import RenderUtil from '@/utils/RenderUtil';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Form, Input, Modal, Popover, Tree } from 'antd';
import { bizLimitDetail, statisticalperiodDetail } from 'app_api/metadataApi';
import { derivativeMetricsSql, getAtomicMetricsById, getDerById } from 'app_api/termApi';
import React, { Component } from 'react';
import './index.less';


const confirm = Modal.confirm
const { TextArea } = Input
const { TreeNode } = Tree

export default class DeriveDetailDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            detailModal: false,
            detailInfo: {
                atomicMetricsDTO: {},
                businessLimitDTO: {},
                statisticalPeriodDTO: {},
            },
            atomDetailModal: false,
            atomDetailInfo: {},
            periodDetailModal: false,
            periodDetailInfo: {},
            businessDetailModal: false,
            businessDetailInfo: {},
            sqlLoading: false,
            sqlContent: '',
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
    openDetailModal = async (data) => {
        this.setState({
            detailModal: true,
        })
        this.getSql(data.id)
        let res = await getDerById({ id: data.id })
        if (res.code == 200) {
            this.setState({
                detailInfo: res.data,
            })
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
            detailModal: false,
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
    render() {
        const { detailModal, detailInfo, atomDetailModal, atomDetailInfo, periodDetailModal, periodDetailInfo, businessDetailModal, businessDetailInfo, sqlLoading, sqlContent } = this.state
        return (
            <div>
                <DrawerLayout
                    drawerProps={{
                        title: '指标详情',
                        visible: detailModal,
                        onClose: this.cancel,
                    }}
                >
                    {detailModal ? (
                        <React.Fragment>
                            <Form className='MiniForm DetailPart' layout='inline'>
                                <h3>基本信息</h3>
                                {RenderUtil.renderFormItems([
                                    { label: '指标编码', content: detailInfo.codeNo },
                                    { label: '指标名称', content: detailInfo.chineseName },
                                    { label: '指标英文名', content: detailInfo.englishName },
                                    { label: '指标类型', content: detailInfo.metricsTypeText },
                                    { label: '业务板块', content: detailInfo.moduleNameWithParent },
                                    { label: '主题域', content: detailInfo.themeNameWithParent },
                                    { label: '业务过程', content: detailInfo.bizProcessName },
                                    { label: '业务口径', content: detailInfo.description },
                                ])}
                            </Form>
                            <Form className='MiniForm DetailPart' layout='inline'>
                                <h3>业务定义</h3>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '原子指标',
                                        content: (
                                            <React.Fragment>
                                                {detailInfo.atomicMetricsDTO.chineseName || <EmptyLabel />}
                                                <Popover
                                                    placement='topLeft'
                                                    content={
                                                        <div style={{ color: '#666', fontFamily: 'PingFangSC-Light, PingFang SC', maxWidth: 300, lineHeight: '25px' }}>
                                                            <div>
                                                                <span>指标名称：</span>
                                                                <a onClick={this.openAtomDetail.bind(this, detailInfo.atomicMetricsDTO.id)}>{detailInfo.atomicMetricsDTO.chineseName}</a>
                                                            </div>
                                                            <div>
                                                                <span>计算逻辑：</span>
                                                                <span className='atomTooltip'>
                                                                    {detailInfo.atomicMetricsDTO.factColumnName + '' + this.getFunction(detailInfo.atomicMetricsDTO.function)}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span>业务口径：</span>
                                                                <span className='atomTooltip'>{detailInfo.atomicMetricsDTO.description || <EmptyLabel />}</span>
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
                                        label: '统计粒度',
                                        content: detailInfo.statisticalColumnText,
                                    },
                                    {
                                        label: '统计周期',
                                        content: (
                                            <React.Fragment>
                                                {detailInfo.statisticalPeriodDTO ? detailInfo.statisticalPeriodDTO.chineseName : <EmptyLabel />}
                                                <Popover
                                                    placement='topLeft'
                                                    content={
                                                        <div style={{ color: '#666', fontFamily: 'PingFangSC-Light, PingFang SC', maxWidth: 300, lineHeight: '25px' }}>
                                                            <div>
                                                                <span>统计周期名称：</span>
                                                                <a onClick={this.openPeriodDetail.bind(this, detailInfo.statisticalPeriodDTO ? detailInfo.statisticalPeriodDTO.id : '')}>
                                                                    {detailInfo.statisticalPeriodDTO.chineseName}
                                                                </a>
                                                            </div>
                                                            <div>
                                                                <span>业务口径：</span>
                                                                <span className='atomTooltip'>{detailInfo.statisticalPeriodDTO ? detailInfo.statisticalPeriodDTO.description : <EmptyLabel />}</span>
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
                                                {detailInfo.businessLimitDTO ? detailInfo.businessLimitDTO.chineseName : <EmptyLabel />}
                                                <Popover
                                                    placement='topLeft'
                                                    content={
                                                        <div>
                                                            <div>
                                                                <span>限定词名称：</span>
                                                                <a onClick={this.openBusinessDetail.bind(this, detailInfo.businessLimitDTO ? detailInfo.businessLimitDTO.id : '')}>
                                                                    {detailInfo.businessLimitDTO ? detailInfo.businessLimitDTO.chineseName : <EmptyLabel />}
                                                                </a>
                                                            </div>
                                                            <div>
                                                                <span>计算逻辑：</span>
                                                                <span className='atomTooltip'>{detailInfo.businessLimitDTO ? detailInfo.businessLimitDTO.queryDesc : <EmptyLabel />}</span>
                                                            </div>
                                                            <div>
                                                                <span>业务口径：</span>
                                                                <span className='atomTooltip'>{detailInfo.businessLimitDTO ? detailInfo.businessLimitDTO.description : <EmptyLabel />}</span>
                                                            </div>
                                                        </div>
                                                    }
                                                >
                                                    {detailInfo.businessLimitDTO ? <InfoCircleOutlined style={{ color: '#b3b3b3', marginLeft: '5px' }} /> : null}
                                                </Popover>
                                            </React.Fragment>
                                        ),
                                    },
                                    {
                                        label: '来源模型',
                                        content: (
                                            <React.Fragment>
                                                {detailInfo.factAssetsName} {detailInfo.factAssetsNameEn} {!detailInfo.factAssetsName && !detailInfo.factAssetsNameEn ? <EmptyLabel /> : ''}
                                            </React.Fragment>
                                        ),
                                    },
                                    {
                                        label: '来源字段',
                                        content: (
                                            <React.Fragment>
                                                {detailInfo.factColumnName} {detailInfo.factColumnNameEn} {!detailInfo.factColumnName && !detailInfo.factColumnNameEn ? <EmptyLabel /> : ''}
                                            </React.Fragment>
                                        ),
                                    },
                                ])}
                            </Form>

                            <Form className='MiniForm DetailPart' layout='inline'>
                                <h3>技术口径</h3>
                                {RenderUtil.renderFormItems([
                                    {
                                        content: sqlContent,
                                    },
                                ])}
                            </Form>

                            <Form className='MiniForm DetailPart' layout='inline'>
                                <h3>管理属性</h3>
                                {RenderUtil.renderFormItems([
                                    { label: '技术归口部门', content: detailInfo.techDepartName },
                                    { label: '业务归口部门', content: detailInfo.busiDepartName },
                                    { label: '负责人', content: detailInfo.busiManagerName },
                                    { label: '创建时间', content: detailInfo.createTime },
                                    { label: '创建人', content: detailInfo.createUser },
                                    { label: '更新时间', content: detailInfo.updateTime },
                                    { label: '修改人', content: detailInfo.updateUser },
                                ])}
                            </Form>
                        </React.Fragment>
                    ) : null}
                </DrawerLayout>
                <DrawerLayout
                    drawerProps={{
                        title: '指标详情',
                        visible: atomDetailModal,
                        onClose: this.atomCancel,
                    }}
                >
                    {atomDetailModal ? (
                        <React.Fragment>
                            <Form className='MiniForm DetailPart' layout='inline'>
                                <h3>基本信息</h3>
                                {RenderUtil.renderFormItems([
                                    { label: '指标编码', content: atomDetailInfo.codeNo },
                                    { label: '指标名称', content: atomDetailInfo.chineseName },
                                    { label: '指标英文名', content: atomDetailInfo.englishName },
                                    { label: '指标类型', content: atomDetailInfo.metricsTypeText },
                                    { label: '业务板块', content: atomDetailInfo.moduleNameWithParent },
                                    { label: '主题域', content: atomDetailInfo.themeNameWithParent },
                                    { label: '业务过程', content: atomDetailInfo.bizProcessName },
                                    { label: '业务口径', content: atomDetailInfo.description },
                                ])}
                            </Form>
                            <Form className='MiniForm DetailPart' layout='inline'>
                                <h3>业务定义</h3>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '计算逻辑',
                                        content: (
                                            <React.Fragment>
                                                {atomDetailInfo.factColumnName}
                                                {this.getFunction(atomDetailInfo.function)}
                                            </React.Fragment>
                                        ),
                                    },
                                    {
                                        label: '来源模型',
                                        content: (
                                            <React.Fragment>
                                                {atomDetailInfo.factAssetsName} {atomDetailInfo.factAssetsNameEn}{' '}
                                                {!atomDetailInfo.factAssetsName && !atomDetailInfo.factAssetsNameEn ? <EmptyLabel /> : ''}
                                            </React.Fragment>
                                        ),
                                    },
                                    {
                                        label: '来源字段',
                                        content: (
                                            <React.Fragment>
                                                {atomDetailInfo.factColumnName} {atomDetailInfo.factColumnNameEn}{' '}
                                                {!atomDetailInfo.factColumnName && !atomDetailInfo.factColumnNameEn ? <EmptyLabel /> : ''}
                                            </React.Fragment>
                                        ),
                                    },
                                ])}
                            </Form>
                            <Form className='MiniForm DetailPart' layout='inline'>
                                <h3>管理属性</h3>
                                {RenderUtil.renderFormItems([
                                    { label: '技术归口部门', content: atomDetailInfo.techDepartName },
                                    { label: '业务归口部门', content: atomDetailInfo.busiDepartName },
                                    { label: '负责人', content: atomDetailInfo.busiManagerName },
                                    { label: '创建时间', content: atomDetailInfo.createTime },
                                    { label: '创建人', content: atomDetailInfo.createUser },
                                    { label: '更新时间', content: atomDetailInfo.updateTime },
                                    { label: '修改人', content: atomDetailInfo.updateUser },
                                ])}
                            </Form>
                        </React.Fragment>
                    ) : null}
                </DrawerLayout>
                <DrawerLayout
                    drawerProps={{
                        title: '统计周期详情',
                        visible: periodDetailModal,
                        onClose: this.periodCancel,
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
                                        content: (
                                            <React.Fragment>
                                                {periodDetailInfo.granularity == 0
                                                    ? '日'
                                                    : periodDetailInfo.granularity == 1
                                                    ? '月'
                                                    : detailInfo.granularity == 2
                                                    ? '周'
                                                    : detailInfo.granularity == 3
                                                    ? '季度'
                                                    : '年'}
                                            </React.Fragment>
                                        ),
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
                <DrawerLayout
                    drawerProps={{
                        title: '业务限定详情',
                        visible: businessDetailModal,
                        onClose: this.businessCancel,
                    }}
                >
                    {businessDetailModal ? (
                        <React.Fragment>
                            <Form className='MiniForm DetailPart' layout='inline'>
                                <h3>基本信息</h3>
                                {RenderUtil.renderFormItems([
                                    { label: '业务限定名称', content: businessDetailInfo.chineseName },
                                    { label: '业务限定英文名', content: businessDetailInfo.englishName },
                                    { label: '业务板块', content: businessDetailInfo.bizModuleName },
                                    { label: '主题域', content: businessDetailInfo.themeName },
                                    { label: '业务描述', content: businessDetailInfo.description },
                                ])}
                            </Form>
                            <Form className='MiniForm DetailPart' layout='inline'>
                                <h3>业务定义</h3>
                                {RenderUtil.renderFormItems([
                                    { label: '计算逻辑', content: businessDetailInfo.calculateDesc },
                                    {
                                        label: '业务限定来源：',
                                        content: (
                                            <React.Fragment>
                                                {businessDetailInfo.sourceAssetsName} {businessDetailInfo.sourceAssetsEnglishName}{' '}
                                                {!businessDetailInfo.sourceAssetsName && !businessDetailInfo.sourceAssetsEnglishName ? <EmptyLabel /> : ''}
                                            </React.Fragment>
                                        ),
                                    },
                                ])}
                            </Form>
                            <Form className='MiniForm DetailPart' layout='inline'>
                                <h3>管理属性</h3>
                                {RenderUtil.renderFormItems([
                                    { label: '创建时间', content: businessDetailInfo.createTime },
                                    { label: '创建人', content: businessDetailInfo.createUser },
                                    { label: '更新时间', content: businessDetailInfo.updateTime },
                                    { label: '修改人', content: businessDetailInfo.updateUser },
                                ])}
                            </Form>
                        </React.Fragment>
                    ) : null}
                </DrawerLayout>
            </div>
        );
    }
}
