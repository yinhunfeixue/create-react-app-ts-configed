import { InfoCircleOutlined } from '@ant-design/icons';
import { Col, Progress, Row, Tooltip } from 'antd';
import {
    chineaseName,
    columnMapStandard,
    columnMatchStandard,
    dwLevelInfoStatistic,
    metadataAndLineage,
    nameSpecification,
} from 'app_api/dataWarehouse'
import React, { Component } from 'react'
import 'react-count-animation/dist/count.min.css'
import WelcomeBarChart from './component/barChart'
import GaugeChart from './component/GaugeChart'
import WelcomePieChart from './component/pieChart'
import StackBarChart from './component/stackBarChart'
import './style.less'

export default class WareHoseWelcome extends Component {
    constructor(props) {
        super(props)
        this.state = {
            chineaseNameInfo: {},
            columnMapStandardInfo: {
                columnChangeNumber: 0,
                mappedStandardChangeNumber: 0,
                unmappedStandardChangeNumber: 0,
            },
            columnMatchStandardInfo: {},
            dwLevelInfo: {
                citedViolationOdsTableChangeNumber: 0,
                citeOdsViolationTableChangeNumber: 0,
            },
            nameSpecificationInfo: {},
            metadataAndLineageInfo: {
                databaseChangeNumber: 0,
                tableChangeNumber: 0,
                columnChangeNumber: 10,
                lineageFileChangeNumber: 0,
                isolateTableChangeNumber: 0,
            },
        }
    }
    componentDidMount = () => {
        this.getChineaseName()
        this.getColumnMapStandard()
        this.getColumnMatchStandard()
        this.getDwLevelInfoStatistic()
        this.getNameSpecification()
        this.getMetadataAndLineage()
    }
    getChineaseName = async () => {
        let res = await chineaseName()
        if (res.code == 200) {
            await this.setState({
                chineaseNameInfo: res.data,
            })
            this.gaugeChart.setChartData(res.data.nameCnCompleteRate)
            this.barChart.setChartData(res.data.dwNameCnCompleteRateList)
        }
    }
    getColumnMatchStandard = async () => {
        let res = await columnMatchStandard()
        if (res.code == 200) {
            await this.setState({
                columnMatchStandardInfo: res.data,
            })
            this.columnGaugeChart.setChartData(res.data.qualifiedRate)
            this.stackBarChart.setChartData(res.data.dwMatchStatisticsDtoList)
        }
    }
    getColumnMapStandard = async () => {
        let res = await columnMapStandard()
        if (res.code == 200) {
            res.data.mappedStandardRate = (
                (res.data.mappedStandardNumber * 100) /
                res.data.columnNumber
            )
                .toFixed(2)
                .replace(/[.]?0+$/g, '')
            res.data.unmappedStandardRate = (
                (res.data.unmappedStandardNumber * 100) /
                res.data.columnNumber
            )
                .toFixed(2)
                .replace(/[.]?0+$/g, '')
            this.setState({
                columnMapStandardInfo: res.data,
            })
        }
    }
    getDwLevelInfoStatistic = async () => {
        let res = await dwLevelInfoStatistic()
        if (res.code == 200) {
            res.data.citedViolationOdsTableRate = (
                (res.data.citedViolationOdsTableNumber * 100) /
                res.data.odsTableNumber
            )
                .toFixed(2)
                .replace(/[.]?0+$/g, '')
            // res.data.citeOdsViolationTableDetail = [
            //     {
            //         levelTagValueName: '123',
            //         tableCount: 80,
            //     },
            //     {
            //         levelTagValueName: '456',
            //         tableCount: 20,
            //     }
            // ]
            res.data.citeOdsViolationTableDetail.map((item) => {
                item.rate = (
                    (item.tableCount * 100) /
                    res.data.citeOdsViolationTableNumber
                )
                    .toFixed(2)
                    .replace(/[.]?0+$/g, '')
            })
            console.log(
                res.data.citeOdsViolationTableDetail,
                'res.data.citeOdsViolationTableDetail'
            )
            await this.setState({
                dwLevelInfo: res.data,
            })
            this.pieChart.setChartData(res.data)
        }
    }
    getNameSpecification = async () => {
        let res = await nameSpecification()
        if (res.code == 200) {
            this.setState({
                nameSpecificationInfo: res.data,
            })
        }
    }
    getMetadataAndLineage = async () => {
        let res = await metadataAndLineage()
        if (res.code == 200) {
            res.data.relationTableRatio = res.data.relationTableRatio
                ? parseFloat(res.data.relationTableRatio)
                : 0
            // res.data.isolateTableDetail = [
            //     {
            //         levelTagValueName: '1122223',
            //         tableCount: 10,
            //     },
            //     {
            //         levelTagValueName: '411156',
            //         tableCount: res.data.isolateTableNumber - 10,
            //     }
            // ]
            res.data.isolateTableDetail.map((item) => {
                item.rate = (
                    (item.tableCount * 100) /
                    res.data.isolateTableNumber
                )
                    .toFixed(2)
                    .replace(/[.]?0+$/g, '')
            })
            console.log(
                res.data.isolateTableDetail,
                'res.data.isolateTableDetail'
            )
            res.data.citeOdsViolationTableDetail = res.data.isolateTableDetail
            res.data.citeOdsViolationTableNumber = res.data.isolateTableNumber
            await this.setState({
                metadataAndLineageInfo: res.data,
            })
            this.pieChart1.setChartData(res.data)
        }
    }
    getToFixedNum = (value) => {
        if (value) {
            return value.toFixed(2).replace(/[.]?0+$/g, '') + '%';
        } else {
            return '0%'
        }
    }
    changePage = () => {
        this.props.addTab('引导页')
    }
    render() {
        const {
            chineaseNameInfo,
            columnMapStandardInfo,
            columnMatchStandardInfo,
            dwLevelInfo,
            nameSpecificationInfo,
            metadataAndLineageInfo,
        } = this.state
        // metadataAndLineageInfo.databaseChangeNumber = 10
        // metadataAndLineageInfo.tableChangeNumber = -10
        // metadataAndLineageInfo.columnChangeNumber = 10
        // metadataAndLineageInfo.lineageFileChangeNumber = -10
        // metadataAndLineageInfo.isolateTableChangeNumber = 10
        //
        // columnMapStandardInfo.columnChangeNumber = -10
        // columnMapStandardInfo.mappedStandardChangeNumber = 10
        // columnMapStandardInfo.unmappedStandardChangeNumber = -10
        //
        // dwLevelInfo.citedViolationOdsTableChangeNumber = -10
        // dwLevelInfo.citeOdsViolationTableChangeNumber = 10
        return (
            <div className='wareHoseWelcome'>
                <div className='wareItem'>
                    {/*<a onClick={this.changePage}>引导页</a>*/}
                    {/* <a onClick={() => this.props.addTab('报表采集')}> 报表采集 </a>
                    <a onClick={() => this.props.addTab('报表分类')}> 报表分类 </a>
                    <a onClick={() => this.props.addTab('报表列表')}> 报表列表 </a>
                    <a onClick={() => this.props.addTab('表命名规则')}> 表命名规则 </a>
                    <a onClick={() => this.props.addTab('kewordSearch')}> 智能取数 </a>
                    <a onClick={() => this.props.addTab('数据字典')}> 数据字典 </a>
                    <a onClick={() => this.props.addTab('分类分级配置')}> 分类分级配置 </a>
                    <a onClick={() => this.props.addTab('分布总览')}> 分布总览 </a>
                    <a onClick={() => this.props.addTab('数据分布')}> 数据分布 </a>
                    <a onClick={() => this.props.addTab('数据发现')}> 数据发现 </a> */}
                    <div className='title'>
                        数仓元数据总览
                        <span
                            style={{ float: 'right', marginBottom: 0 }}
                            className='time'
                        >
                            评估时间：{metadataAndLineageInfo.statisticTime}
                        </span>
                    </div>
                    <div style={{ padding: '0 28px' }}>
                        <div className='dataView'>
                            <div className='dataViewItem'>
                                <div className='dataViewItemBorder'>
                                    <div className='dataViewItemName'>
                                        数据库
                                    </div>
                                    <div className='dataViewItemValue'>
                                        {parseFloat(
                                            metadataAndLineageInfo.databaseNumber ||
                                                0
                                        ).toLocaleString()}
                                        <span
                                            style={{
                                                color:
                                                    metadataAndLineageInfo.databaseChangeNumber <
                                                    0
                                                        ? '#73D13E'
                                                        : '#F5222D',
                                            }}
                                        >
                                            {metadataAndLineageInfo.databaseChangeNumber <
                                            0 ? (
                                                <img
                                                    src={require('app_images/home/down.png')}
                                                />
                                            ) : metadataAndLineageInfo.databaseChangeNumber >
                                              0 ? (
                                                <img
                                                    src={require('app_images/home/up.png')}
                                                />
                                            ) : null}
                                            {metadataAndLineageInfo.databaseChangeNumber !==
                                            0
                                                ? Math.abs(
                                                      metadataAndLineageInfo.databaseChangeNumber
                                                  )
                                                : null}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='dataViewItem'>
                                <div className='dataViewItemBorder'>
                                    <div className='dataViewItemName'>
                                        数据表
                                    </div>
                                    <div className='dataViewItemValue'>
                                        {parseFloat(
                                            metadataAndLineageInfo.tableNumber ||
                                                0
                                        ).toLocaleString()}
                                        <span
                                            style={{
                                                color:
                                                    metadataAndLineageInfo.tableChangeNumber <
                                                    0
                                                        ? '#73D13E'
                                                        : '#F5222D',
                                            }}
                                        >
                                            {metadataAndLineageInfo.tableChangeNumber <
                                            0 ? (
                                                <img
                                                    src={require('app_images/home/down.png')}
                                                />
                                            ) : metadataAndLineageInfo.tableChangeNumber >
                                              0 ? (
                                                <img
                                                    src={require('app_images/home/up.png')}
                                                />
                                            ) : null}
                                            {metadataAndLineageInfo.tableChangeNumber !==
                                            0
                                                ? Math.abs(
                                                      metadataAndLineageInfo.tableChangeNumber
                                                  )
                                                : null}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='dataViewItem'>
                                <div
                                    className='dataViewItemBorder'
                                    style={{ borderRight: 'none' }}
                                >
                                    <div className='dataViewItemName'>
                                        数据字段
                                    </div>
                                    <div className='dataViewItemValue'>
                                        {parseFloat(
                                            metadataAndLineageInfo.columnNumber ||
                                                0
                                        ).toLocaleString()}
                                        <span
                                            style={{
                                                color:
                                                    metadataAndLineageInfo.columnChangeNumber <
                                                    0
                                                        ? '#73D13E'
                                                        : '#F5222D',
                                            }}
                                        >
                                            {metadataAndLineageInfo.columnChangeNumber <
                                            0 ? (
                                                <img
                                                    src={require('app_images/home/down.png')}
                                                />
                                            ) : metadataAndLineageInfo.columnChangeNumber >
                                              0 ? (
                                                <img
                                                    src={require('app_images/home/up.png')}
                                                />
                                            ) : null}
                                            {metadataAndLineageInfo.columnChangeNumber !==
                                            0
                                                ? Math.abs(
                                                      metadataAndLineageInfo.columnChangeNumber
                                                  )
                                                : null}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: 24, display: 'flex' }}>
                        <div style={{ flexGrow: '1', width: '50%' }}>
                            <div className='title'>
                                血缘统计
                                <Tooltip title='血缘关系或关联关系覆盖的表的数量/表的总数。'>
                                    <InfoCircleOutlined
                                        style={{
                                            color: '#b3b3b3',
                                            marginLeft: 4,
                                        }} />
                                </Tooltip>
                            </div>
                            <div className='chartItem'>
                                <div style={{ display: 'inline-block' }}>
                                    <Progress
                                        strokeColor='#536DFE'
                                        format={(percent) => `${percent}%`}
                                        width={180}
                                        type='circle'
                                        percent={
                                            metadataAndLineageInfo.relationTableRatio
                                        }
                                    />
                                    <div
                                        style={{
                                            fontSize: '14px',
                                            marginTop: 8,
                                        }}
                                    >
                                        血缘覆盖率
                                    </div>
                                </div>
                                <div className='chartItemDesc'>
                                    <div className='dataViewItemName'>
                                        血缘脚本数
                                    </div>
                                    <div className='dataViewItemValue'>
                                        {parseFloat(
                                            metadataAndLineageInfo.lineageFileNumber ||
                                                0
                                        ).toLocaleString()}
                                        <span
                                            style={{
                                                color:
                                                    metadataAndLineageInfo.lineageFileChangeNumber <
                                                    0
                                                        ? '#73D13E'
                                                        : '#F5222D',
                                            }}
                                        >
                                            {metadataAndLineageInfo.lineageFileChangeNumber <
                                            0 ? (
                                                <img
                                                    src={require('app_images/home/down.png')}
                                                />
                                            ) : metadataAndLineageInfo.lineageFileChangeNumber >
                                              0 ? (
                                                <img
                                                    src={require('app_images/home/up.png')}
                                                />
                                            ) : null}
                                            {metadataAndLineageInfo.lineageFileChangeNumber !==
                                            0
                                                ? Math.abs(
                                                      metadataAndLineageInfo.lineageFileChangeNumber
                                                  )
                                                : null}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            style={{
                                flexGrow: '1',
                                paddingLeft: 32,
                                width: '50%',
                            }}
                        >
                            <div className='title'>
                                孤立表统计
                                <Tooltip title='未存在映射关系的表。'>
                                    <InfoCircleOutlined
                                        style={{
                                            color: '#b3b3b3',
                                            marginLeft: 4,
                                        }} />
                                </Tooltip>
                            </div>
                            <div
                                className='chartItem'
                                style={{ border: 'none' }}
                            >
                                <div
                                    style={{
                                        display: 'inline-block',
                                        width: 330,
                                    }}
                                >
                                    <WelcomePieChart
                                        lengendInfo={{
                                            offsetX: 15,
                                            offsetY: -20,
                                        }}
                                        heightInfo={{
                                            height: 180,
                                            padding: [30, 80, 0, 30],
                                        }}
                                        id='dataWare_container5'
                                        ref={(dom) => {
                                            this.pieChart1 = dom
                                        }}
                                    />
                                    <div
                                        style={{
                                            fontSize: '14px',
                                            marginTop: 8,
                                            paddingRight: 35,
                                        }}
                                    >
                                        孤立表的分布
                                    </div>
                                </div>
                                <div
                                    className='chartItemDesc'
                                    style={{ paddingLeft: 14 }}
                                >
                                    <div className='dataViewItemName'>
                                        孤立表数
                                    </div>
                                    <div className='dataViewItemValue'>
                                        {parseFloat(
                                            metadataAndLineageInfo.isolateTableNumber ||
                                                0
                                        ).toLocaleString()}
                                        <span
                                            style={{
                                                color:
                                                    metadataAndLineageInfo.isolateTableChangeNumber <
                                                    0
                                                        ? '#73D13E'
                                                        : '#F5222D',
                                            }}
                                        >
                                            {metadataAndLineageInfo.isolateTableChangeNumber <
                                            0 ? (
                                                <img
                                                    src={require('app_images/home/down.png')}
                                                />
                                            ) : metadataAndLineageInfo.isolateTableChangeNumber >
                                              0 ? (
                                                <img
                                                    src={require('app_images/home/up.png')}
                                                />
                                            ) : null}
                                            {metadataAndLineageInfo.isolateTableChangeNumber !==
                                            0
                                                ? Math.abs(
                                                      metadataAndLineageInfo.isolateTableChangeNumber
                                                  )
                                                : null}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='wareItem'>
                    <div className='title'>
                        中文信息完整度
                        <Tooltip title='已存在中文信息的字段/字段总数。'>
                            <InfoCircleOutlined style={{ color: '#b3b3b3', marginLeft: 4 }} />
                        </Tooltip>
                        <span
                            style={{ float: 'right', marginBottom: 0 }}
                            className='time'
                        >
                            评估时间：{chineaseNameInfo.executeTime}
                        </span>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <div className='chartItem' style={{ width: '40%' }}>
                            <GaugeChart
                                id='dataWare_container'
                                ref={(dom) => {
                                    this.gaugeChart = dom
                                }}
                            />
                        </div>
                        <div
                            className='chartItem'
                            style={{
                                border: 'none',
                                width: '60%',
                                textAlign: 'left',
                            }}
                        >
                            <div
                                style={{
                                    textAlign: 'left',
                                    padding: '0px 0px 10px 60px',
                                }}
                            >
                                数仓各层级中文系信息完整度
                            </div>
                            <WelcomeBarChart
                                ref={(dom) => {
                                    this.barChart = dom
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className='wareItem'>
                    <div className='title'>字段对标总览</div>
                    <div style={{ padding: '0 28px' }}>
                        <div className='dataView'>
                            <div className='dataViewItem'>
                                <div className='dataViewItemBorder'>
                                    <div className='dataViewItemName'>
                                        数据字段总数
                                    </div>
                                    <div className='dataViewItemValue'>
                                        {parseFloat(
                                            columnMapStandardInfo.columnNumber ||
                                                0
                                        ).toLocaleString()}
                                        <span
                                            style={{
                                                color:
                                                    columnMapStandardInfo.columnChangeNumber <
                                                    0
                                                        ? '#73D13E'
                                                        : '#F5222D',
                                            }}
                                        >
                                            {columnMapStandardInfo.columnChangeNumber <
                                            0 ? (
                                                <img
                                                    src={require('app_images/home/down.png')}
                                                />
                                            ) : columnMapStandardInfo.columnChangeNumber >
                                              0 ? (
                                                <img
                                                    src={require('app_images/home/up.png')}
                                                />
                                            ) : null}
                                            {columnMapStandardInfo.columnChangeNumber !==
                                            0
                                                ? Math.abs(
                                                      columnMapStandardInfo.columnChangeNumber
                                                  )
                                                : null}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='dataViewItem'>
                                <div className='dataViewItemBorder'>
                                    <div
                                        className='progressText'
                                        style={{
                                            display: 'inline-block',
                                            marginRight: 24,
                                            verticalAlign: 'bottom',
                                        }}
                                    >
                                        <Progress
                                            strokeColor='#536DFE'
                                            format={(percent) => `${percent}%`}
                                            width={64}
                                            type='circle'
                                            percent={
                                                columnMapStandardInfo.mappedStandardRate
                                            }
                                        />
                                    </div>
                                    <div style={{ display: 'inline-block' }}>
                                        <div className='dataViewItemName'>
                                            已对标字段
                                        </div>
                                        <div className='dataViewItemValue'>
                                            {parseFloat(
                                                columnMapStandardInfo.mappedStandardNumber ||
                                                    0
                                            ).toLocaleString()}
                                            <span
                                                style={{
                                                    color:
                                                        columnMapStandardInfo.mappedStandardChangeNumber <
                                                        0
                                                            ? '#73D13E'
                                                            : '#F5222D',
                                                }}
                                            >
                                                {columnMapStandardInfo.mappedStandardChangeNumber <
                                                0 ? (
                                                    <img
                                                        src={require('app_images/home/down.png')}
                                                    />
                                                ) : columnMapStandardInfo.mappedStandardChangeNumber >
                                                  0 ? (
                                                    <img
                                                        src={require('app_images/home/up.png')}
                                                    />
                                                ) : null}
                                                {columnMapStandardInfo.mappedStandardChangeNumber !==
                                                0
                                                    ? Math.abs(
                                                          columnMapStandardInfo.mappedStandardChangeNumber
                                                      )
                                                    : null}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='dataViewItem'>
                                <div
                                    className='dataViewItemBorder'
                                    style={{ borderRight: 'none' }}
                                >
                                    <div
                                        className='progressText'
                                        style={{
                                            display: 'inline-block',
                                            marginRight: 24,
                                            verticalAlign: 'bottom',
                                        }}
                                    >
                                        <Progress
                                            strokeColor='#536DFE'
                                            format={(percent) => `${percent}%`}
                                            width={64}
                                            type='circle'
                                            percent={
                                                columnMapStandardInfo.unmappedStandardRate
                                            }
                                        />
                                    </div>
                                    <div
                                        style={{
                                            display: 'inline-block',
                                            marginRight: 24,
                                        }}
                                    >
                                        <div className='dataViewItemName'>
                                            未对标字段
                                        </div>
                                        <div className='dataViewItemValue'>
                                            {parseFloat(
                                                columnMapStandardInfo.unmappedStandardNumber ||
                                                    0
                                            ).toLocaleString()}
                                            <span
                                                style={{
                                                    color:
                                                        columnMapStandardInfo.unmappedStandardChangeNumber <
                                                        0
                                                            ? '#73D13E'
                                                            : '#F5222D',
                                                }}
                                            >
                                                {columnMapStandardInfo.unmappedStandardChangeNumber <
                                                0 ? (
                                                    <img
                                                        src={require('app_images/home/down.png')}
                                                    />
                                                ) : columnMapStandardInfo.unmappedStandardChangeNumber >
                                                  0 ? (
                                                    <img
                                                        src={require('app_images/home/up.png')}
                                                    />
                                                ) : null}
                                                {columnMapStandardInfo.unmappedStandardChangeNumber !==
                                                0
                                                    ? Math.abs(
                                                          columnMapStandardInfo.unmappedStandardChangeNumber
                                                      )
                                                    : null}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ marginTop: 24, display: 'flex' }}>
                        <div style={{ flexGrow: '1', width: '40%' }}>
                            <div className='title'>
                                字段落标情况
                                <Tooltip title='已存在映射关系的字段/总基础字段数。'>
                                    <InfoCircleOutlined
                                        style={{
                                            color: '#b3b3b3',
                                            marginLeft: 4,
                                        }} />
                                </Tooltip>
                            </div>
                            <div
                                className='chartItem'
                                style={{ textAlign: 'left' }}
                            >
                                <GaugeChart
                                    id='dataWare_container2'
                                    title='字段落标率'
                                    ref={(dom) => {
                                        this.columnGaugeChart = dom
                                    }}
                                />
                            </div>
                        </div>
                        <div
                            style={{
                                flexGrow: '1',
                                paddingLeft: 32,
                                width: '60%',
                            }}
                        >
                            <div className='title'>
                                数仓各层级落标情况
                                <span
                                    style={{ float: 'right', marginBottom: 0 }}
                                    className='time'
                                >
                                    评估时间：
                                    {columnMatchStandardInfo.lastExecuteTime}
                                </span>
                            </div>
                            <div
                                className='chartItem'
                                style={{ border: 'none', textAlign: 'left' }}
                            >
                                <StackBarChart
                                    ref={(dom) => {
                                        this.stackBarChart = dom
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='wareItem'>
                    <div className='title'>
                        数仓命名规范性评估
                        <Tooltip title='规范性命名的表或字段/总基础表和字段数。'>
                            <InfoCircleOutlined style={{ color: '#b3b3b3', marginLeft: 4 }} />
                        </Tooltip>
                        <span
                            style={{ float: 'right', marginBottom: 0 }}
                            className='time'
                        >
                            评估时间：{nameSpecificationInfo.evaluateTime}
                        </span>
                    </div>
                    <div style={{ padding: '0 28px' }}>
                        <Row
                            gutter={40}
                            className='dataView'
                            style={{
                                padding: '32px 0',
                                marginLeft: 0,
                                marginRight: 0,
                            }}
                        >
                            <Col span={12}>
                                <div className='dataViewWithPic'>
                                    <div
                                        style={{
                                            display: 'inline-block',
                                            margin: '11px 0 0 44px',
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: '14px',
                                                marginBottom: 13,
                                            }}
                                            className='dataViewItemName'
                                        >
                                            表命名规范率
                                        </div>
                                        <div className='dataViewItemValue'>
                                            {this.getToFixedNum(
                                                nameSpecificationInfo.tablePassRate *
                                                    100
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ float: 'right' }}>
                                        <img
                                            src={require('app_images/home/welcomePic1.png')}
                                        />
                                    </div>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className='dataViewWithPic'>
                                    <div
                                        style={{
                                            display: 'inline-block',
                                            margin: '11px 0 0 44px',
                                        }}
                                    >
                                        <div
                                            style={{
                                                fontSize: '14px',
                                                marginBottom: 13,
                                            }}
                                            className='dataViewItemName'
                                        >
                                            字段命名规范率
                                        </div>
                                        <div className='dataViewItemValue'>
                                            {this.getToFixedNum(
                                                nameSpecificationInfo.columnPassRate *
                                                    100
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ float: 'right' }}>
                                        <img
                                            src={require('app_images/home/welcomePic2.png')}
                                        />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div style={{ marginTop: 24 }}>
                        <div className='title'>
                            数仓建设规范性评估
                            <Tooltip title='ODS表被跨层依赖率 = ODS层被跨层引用的表/ODS层表总数。'>
                                <InfoCircleOutlined style={{ color: '#b3b3b3', marginLeft: 4 }} />
                            </Tooltip>
                            <span
                                style={{ float: 'right', marginBottom: 0 }}
                                className='time'
                            >
                                评估时间：{dwLevelInfo.statisticTime}
                            </span>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <div
                                className='chartItem'
                                style={{
                                    width: '33%',
                                    paddingLeft: 48,
                                    height: 300,
                                }}
                            >
                                <div
                                    style={{
                                        color: '#333',
                                        fontSize: '14px',
                                        marginBottom: 12,
                                    }}
                                    className='dataViewItemName'
                                >
                                    被跨层依赖的ODS表数量
                                </div>
                                <div
                                    className='dataViewItemValue'
                                    style={{
                                        display: 'block',
                                        textAlign: 'left',
                                    }}
                                >
                                    {parseFloat(
                                        dwLevelInfo.citedViolationOdsTableNumber ||
                                            0
                                    ).toLocaleString()}
                                    <span
                                        style={{
                                            float: 'none',
                                            color:
                                                dwLevelInfo.citedViolationOdsTableChangeNumber <
                                                0
                                                    ? '#73D13E'
                                                    : '#F5222D',
                                            display: 'inline-block',
                                            transform: 'translate(0px, -5px)',
                                        }}
                                    >
                                        {dwLevelInfo.citedViolationOdsTableChangeNumber <
                                        0 ? (
                                            <img
                                                src={require('app_images/home/down.png')}
                                            />
                                        ) : dwLevelInfo.citedViolationOdsTableChangeNumber >
                                          0 ? (
                                            <img
                                                src={require('app_images/home/up.png')}
                                            />
                                        ) : null}
                                        {dwLevelInfo.citedViolationOdsTableChangeNumber !==
                                        0
                                            ? Math.abs(
                                                  dwLevelInfo.citedViolationOdsTableChangeNumber
                                              )
                                            : null}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        fontSize: '14px',
                                        margin: '32px 0 12px 0',
                                    }}
                                    className='dataViewItemName'
                                >
                                    ODS表被跨层依赖率
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <Progress
                                        strokeColor='#536DFE'
                                        format={(percent) => `${percent}%`}
                                        width={150}
                                        type='circle'
                                        percent={
                                            dwLevelInfo.citedViolationOdsTableRate
                                        }
                                    />
                                </div>
                            </div>
                            <div
                                className='chartItem'
                                style={{ width: '33%', height: 300 }}
                            >
                                <div
                                    style={{
                                        color: '#333',
                                        fontSize: '14px',
                                        marginBottom: 12,
                                        paddingLeft: 80,
                                    }}
                                    className='dataViewItemName'
                                >
                                    跨ODS层依赖的下游表数量
                                </div>
                                <div
                                    className='dataViewItemValue'
                                    style={{
                                        display: 'block',
                                        textAlign: 'left',
                                        paddingLeft: 80,
                                    }}
                                >
                                    {parseFloat(
                                        dwLevelInfo.citeOdsViolationTableNumber ||
                                            0
                                    ).toLocaleString()}
                                    <span
                                        style={{
                                            float: 'none',
                                            color:
                                                dwLevelInfo.citeOdsViolationTableChangeNumber <
                                                0
                                                    ? '#73D13E'
                                                    : '#F5222D',
                                            display: 'inline-block',
                                            transform: 'translate(0px, -5px)',
                                        }}
                                    >
                                        {dwLevelInfo.citeOdsViolationTableChangeNumber <
                                        0 ? (
                                            <img
                                                src={require('app_images/home/down.png')}
                                            />
                                        ) : dwLevelInfo.citeOdsViolationTableChangeNumber >
                                          0 ? (
                                            <img
                                                src={require('app_images/home/up.png')}
                                            />
                                        ) : null}
                                        {dwLevelInfo.citeOdsViolationTableChangeNumber !==
                                        0
                                            ? Math.abs(
                                                  dwLevelInfo.citeOdsViolationTableChangeNumber
                                              )
                                            : null}
                                    </span>
                                </div>
                                <div
                                    style={{
                                        fontSize: '14px',
                                        margin: '32px 0 12px 0',
                                        paddingLeft: 80,
                                    }}
                                    className='dataViewItemName'
                                >
                                    跨ODS层依赖下游表分布
                                </div>
                                <div style={{ textAlign: 'left', width: 300 }}>
                                    <WelcomePieChart
                                        lengendInfo={{
                                            offsetX: 25,
                                            offsetY: -20,
                                        }}
                                        heightInfo={{
                                            height: 170,
                                            width: 300,
                                            padding: [20, 80, 20, 40],
                                        }}
                                        id='dataWare_container4'
                                        ref={(dom) => {
                                            this.pieChart = dom
                                        }}
                                    />
                                </div>
                            </div>
                            <div
                                className='chartItem'
                                style={{
                                    border: 'none',
                                    width: '33%',
                                    paddingLeft: 80,
                                    height: 300,
                                }}
                            >
                                <div
                                    style={{
                                        color: '#333',
                                        fontSize: '14px',
                                        marginBottom: 12,
                                    }}
                                    className='dataViewItemName'
                                >
                                    EDW一级下游表的数量平均值
                                </div>
                                <div
                                    className='dataViewItemValue'
                                    style={{
                                        display: 'block',
                                        textAlign: 'left',
                                    }}
                                >
                                    {parseFloat(
                                        dwLevelInfo.edwDownstreamTableAvg || 0
                                    ).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
