import EmptyLabel from '@/component/EmptyLabel';
import DrawerLayout from '@/component/layout/DrawerLayout';
import RenderUtil from '@/utils/RenderUtil';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Drawer, Form, Input, Modal, Popover, Tree } from 'antd';
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
                    {detailModal && (
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
                                            <span>
                                                {detailInfo.atomicMetricsDTO.chineseName || <EmptyLabel />}
                                                <Popover
                                                    placement='topLeft'
                                                    content={
                                                        <div style={{ color: '#666', fontFamily: 'PingFangSC-Light, PingFang SC', maxWidth: 300, lineHeight: '25px' }}>
                                                            <div>
                                                                <span>指标名称：</span>
                                                                <span
                                                                    onClick={this.openAtomDetail.bind(this, detailInfo.atomicMetricsDTO.id)}
                                                                    className='atomTooltip'
                                                                    style={{ color: '#1890ff', cursor: 'pointer' }}
                                                                >
                                                                    {detailInfo.atomicMetricsDTO.chineseName}
                                                                </span>
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
                                            </span>
                                        ),
                                    },
                                    { label: '统计粒度', content: detailInfo.statisticalColumnText },
                                    {
                                        label: '统计周期：',
                                        content: (
                                            <span>
                                                {detailInfo.statisticalPeriodDTO ? detailInfo.statisticalPeriodDTO.chineseName : <EmptyLabel />}
                                                <Popover
                                                    placement='topLeft'
                                                    content={
                                                        <div style={{ color: '#666', fontFamily: 'PingFangSC-Light, PingFang SC', maxWidth: 300, lineHeight: '25px' }}>
                                                            <div>
                                                                <span>统计周期名称：</span>
                                                                <span
                                                                    onClick={this.openPeriodDetail.bind(this, detailInfo.statisticalPeriodDTO ? detailInfo.statisticalPeriodDTO.id : '')}
                                                                    className='atomTooltip'
                                                                    style={{ color: '#1890ff', cursor: 'pointer' }}
                                                                >
                                                                    {detailInfo.statisticalPeriodDTO.chineseName}
                                                                </span>
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
                                            </span>
                                        ),
                                    },
                                    {
                                        label: '业务限定',
                                        content: (
                                            <span>
                                                {detailInfo.businessLimitDTO ? detailInfo.businessLimitDTO.chineseName : <EmptyLabel />}
                                                <Popover
                                                    placement='topLeft'
                                                    content={
                                                        <div style={{ color: '#666', fontFamily: 'PingFangSC-Light, PingFang SC', maxWidth: 300, lineHeight: '25px' }}>
                                                            <div>
                                                                <span>限定词名称：</span>
                                                                <span
                                                                    className='atomTooltip'
                                                                    onClick={this.openBusinessDetail.bind(this, detailInfo.businessLimitDTO ? detailInfo.businessLimitDTO.id : '')}
                                                                    style={{ color: '#1890ff', cursor: 'pointer' }}
                                                                >
                                                                    {detailInfo.businessLimitDTO ? detailInfo.businessLimitDTO.chineseName : <EmptyLabel />}
                                                                </span>
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
                                            </span>
                                        ),
                                    },
                                    {
                                        label: '来源模型',
                                        content: (
                                            <span>
                                                {detailInfo.factAssetsName} {detailInfo.factAssetsNameEn} {!detailInfo.factAssetsName && !detailInfo.factAssetsNameEn ? <EmptyLabel /> : ''}
                                            </span>
                                        ),
                                    },
                                    {
                                        label: '来源字段',
                                        content: (
                                            <span>
                                                {detailInfo.factColumnName} {detailInfo.factColumnNameEn} {!detailInfo.factColumnName && !detailInfo.factColumnNameEn ? <EmptyLabel /> : ''}
                                            </span>
                                        ),
                                    },
                                ])}
                            </Form>
                            <Form className='MiniForm DetailPart' layout='inline'>
                                <h3>技术口径</h3>
                                {RenderUtil.renderFormItems([{ content: sqlContent }])}
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
                    )}
                </DrawerLayout>
                <DrawerLayout
                    drawerProps={{
                        title: '原子指标详情',
                        visible: atomDetailModal,
                        onClose: this.atomCancel,
                    }}
                >
                    {atomDetailModal && (
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
                                        label: '计算逻辑：',
                                        content: (
                                            <span>
                                                {atomDetailInfo.factColumnName}
                                                {this.getFunction(atomDetailInfo.function)}
                                            </span>
                                        ),
                                    },
                                    {
                                        label: '来源模型：',
                                        content: (
                                            <span>
                                                {atomDetailInfo.factAssetsName} {atomDetailInfo.factAssetsNameEn}{' '}
                                                {!atomDetailInfo.factAssetsName && !atomDetailInfo.factAssetsNameEn ? <EmptyLabel /> : ''}
                                            </span>
                                        ),
                                    },
                                    {
                                        label: '来源字段：',
                                        content: (
                                            <span>
                                                {atomDetailInfo.factColumnName} {atomDetailInfo.factColumnNameEn}{' '}
                                                {!atomDetailInfo.factColumnName && !atomDetailInfo.factColumnNameEn ? <EmptyLabel /> : ''}
                                            </span>
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
                    )}
                </DrawerLayout>
                <Drawer
                    title='统计周期详情'
                    placement='right'
                    closable={true}
                    maskClosable={true}
                    // mask={false}
                    width={480}
                    onClose={this.periodCancel}
                    visible={periodDetailModal}
                    className='commonDrawer periodDrawer'
                >
                    {periodDetailInfo ? (
                        <div className='atomDetailArea'>
                            <div className='title' style={{ marginTop: 0, textAlign: 'left' }}>
                                基本信息
                            </div>
                            <div>
                                <span className='atomLabel'>统计周期名称：</span>
                                <span className='atomContent'>{periodDetailInfo.chineseName || <EmptyLabel />}</span>
                            </div>
                            <div>
                                <span className='atomLabel'>统计周期英文名：</span>
                                <span className='atomContent'>{periodDetailInfo.englishName || <EmptyLabel />}</span>
                            </div>
                            <div>
                                <span className='atomLabel'>英文缩写：</span>
                                <span className='atomContent'>{periodDetailInfo.englishNameAbbr || <EmptyLabel />}</span>
                            </div>
                            <div>
                                <span className='atomLabel'>业务描述：</span>
                                <span className='atomContent'>{periodDetailInfo.description || <EmptyLabel />}</span>
                            </div>
                            <div className='title' style={{ textAlign: 'left' }}>
                                业务定义
                            </div>
                            <div>
                                <span className='atomLabel'>时间粒度：</span>
                                <span className='atomContent'>
                                    {periodDetailInfo.granularity == 0
                                        ? '日'
                                        : periodDetailInfo.granularity == 1
                                        ? '月'
                                        : detailInfo.granularity == 2
                                        ? '周'
                                        : detailInfo.granularity == 3
                                        ? '季度'
                                        : '年'}
                                </span>
                            </div>
                            <div>
                                <span className='atomLabel'>时间类型：</span>
                                <span className='atomContent'>{periodDetailInfo.periodType == 0 ? '自然周期' : '相对周期'}</span>
                            </div>
                            <div>
                                <span className='atomLabel'>计算逻辑：</span>
                                <span className='atomContent'>{periodDetailInfo.calculateDesc || <EmptyLabel />}</span>
                            </div>
                            <div className='title' style={{ textAlign: 'left' }}>
                                管理属性
                            </div>
                            <div>
                                <span className='atomLabel'>创建时间：</span>
                                <span className='atomContent'>{periodDetailInfo.createTime || <EmptyLabel />}</span>
                            </div>
                            <div>
                                <span className='atomLabel'>创建人：</span>
                                <span className='atomContent'>{periodDetailInfo.createUser || <EmptyLabel />}</span>
                            </div>
                            <div>
                                <span className='atomLabel'>更新时间：</span>
                                <span className='atomContent'>{periodDetailInfo.updateTime || <EmptyLabel />}</span>
                            </div>
                            <div>
                                <span className='atomLabel'>修改人：</span>
                                <span className='atomContent'>{periodDetailInfo.updateUser || <EmptyLabel />}</span>
                            </div>
                        </div>
                    ) : null}
                </Drawer>
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
                                        label: '业务限定来源',
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