import EmptyLabel from '@/component/EmptyLabel'
import TableLayout from '@/component/layout/TableLayout'
import ModuleTitle from '@/component/module/ModuleTitle'
import RenderUtil from '@/utils/RenderUtil'
import ProjectUtil from '@/utils/ProjectUtil'
import { Button, Input, Select, Tooltip, Row, Col, Spin, Progress } from 'antd'
import { diffStatistic, schemaDiffTaskDetail } from 'app_api/autoManage'
import React, { Component } from 'react'
import './index.less'
import TableResult from './component/tableResult'

export default class DataCompareDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            detailInfo: {},
            taskDetail: [],
            staticsList: [],
            spinning: false,
        }
    }
    componentWillMount = async () => {
        this.getDetailInfo()
        this.getTaskDetailData()
    }
    get pageParams() {
        return ProjectUtil.getPageParam(this.props)
    }
    getDetailInfo = async () => {
        let res = await schemaDiffTaskDetail({id: this.pageParams.id})
        if (res.code == 200) {
            this.setState({
                detailInfo: res.data
            })
        }
    }
    getTaskDetailData = async () => {
        let { staticsList } = this.state
        this.setState({spinning: true})
        let res = await diffStatistic({taskId: this.pageParams.id})
        this.setState({spinning: false})
        if (res.code == 200) {
            res.data.map((item) => {
                item.name = item.type == 'table' ? '表' : (item.type == 'column' ? '字段' : (item.type == 'code' ? '代码项' : '代码值'))
            })
            staticsList = [
                {name: '表'},
                // {name: '字段'},
                // {name: '代码项'},
                // {name: '代码值'}
            ]
            staticsList.map((node, index) => {
                res.data.map((item) => {
                    if (item.name == node.name) {
                        node.created = item.created
                        node.deleted = item.deleted
                        node.updated = item.updated
                        node.remained = item.remained
                        node.sourceAmount = item.sourceAmount
                        node.targetAmount = item.targetAmount
                        node.remainePercent = ((item.remained / (item.sourceAmount + item.targetAmount - item.remained))*100).toFixed(0)
                        node.createPercent = ((item.created / (item.sourceAmount + item.targetAmount - item.remained))*100).toFixed(0)
                        node.updatePercent = ((item.updated / (item.sourceAmount + item.targetAmount - item.remained))*100).toFixed(0)
                        node.deletePercent = ((item.deleted / (item.sourceAmount + item.targetAmount - item.remained))*100).toFixed(0)
                    }
                })
            })
            console.log(staticsList, 'staticsList')
            this.setState({
                taskDetail: res.data,
                staticsList
            })
        }
    }
    openEditPage = () => {

    }
    render() {
        const {
            staticsList,
            spinning,
            detailInfo
        } = this.state
        return (
            <React.Fragment>
                <div className='dataCompareDetail'>
                    <TableLayout
                        title='元数据对比结果'
                        disabledDefaultFooter
                        // renderHeaderExtra={() => {
                        //     return (
                        //         <Button type='primary' onClick={this.openEditPage}>
                        //             影响分析
                        //         </Button>
                        //     )
                        // }}
                        renderDetail={() => {
                            return (
                                <div>
                                    <div className='compareItems'>
                                        <div className='Grid2'>
                                            <div>
                                                <div className='titleName'>{detailInfo.targetDsName || '-'}</div>
                                                <div className='versionName'>版本信息：{detailInfo.targetVersion || '-'}（最新）</div>
                                                <div className='systemName'>对比系统</div>
                                            </div>
                                            <div>
                                                <div className='titleName'>{detailInfo.sourceDsName || '-'}</div>
                                                <div className='versionName'>版本信息：{detailInfo.sourceVersion || '-'}（最新）</div>
                                                <div className='systemName'>参照系统</div>
                                            </div>
                                        </div>
                                        <img src={require('app_images/dataCompare/vs.png')} />
                                    </div>
                                    <ModuleTitle style={{ marginBottom: 15 }} title='对比结果统计'/>
                                    <Spin spinning={spinning}>
                                        <div className='resultStatics Grid1'>
                                            {
                                                staticsList.map((item) => {
                                                    return (
                                                        <div className='staticsItem'>
                                                            <div className='staticsItemTitle'>
                                                                {item.name == '表' ? <img src={require('app_images/dataCompare/table.png')} /> : null}
                                                                {item.name == '字段' ? <img src={require('app_images/dataCompare/column.png')} /> : null}
                                                                {item.name == '代码项' ? <img src={require('app_images/dataCompare/codeItem.png')} /> : null}
                                                                {item.name == '代码值' ? <img src={require('app_images/dataCompare/codeValue.png')} /> : null}
                                                                {item.name}</div>
                                                            {/*<div className='emptyText'>- 暂无更新内容 -</div>*/}
                                                            <Row style={{ marginLeft: 28 }}>
                                                                <Col span={5} className='Grid2' style={{ paddingRight: 40 }}>
                                                                    <div>
                                                                        <div className='titleName'>对比系统</div>
                                                                        <div className='value'>{ProjectUtil.numberFormat(item.targetAmount || 0)}</div>
                                                                    </div>
                                                                    <div>
                                                                        <div className='titleName'>参照系统</div>
                                                                        <div className='value'>{ProjectUtil.numberFormat(item.sourceAmount || 0)}</div>
                                                                    </div>
                                                                </Col>
                                                                <Col span={19} className='Grid4' style={{ columnGap: 'calc(33% - 219px)'}}>
                                                                    <div className='Grid2'>
                                                                        <div>
                                                                            <div className='titleName'>数据一致</div>
                                                                            <div className='value'>{ProjectUtil.numberFormat(item.remained || 0)}</div>
                                                                        </div>
                                                                        <Progress
                                                                            width={56}
                                                                            strokeColor='#3A9DFF'
                                                                            strokeWidth={8}
                                                                            showInfo={true}
                                                                            format={percent => `${percent}%`}
                                                                            strokeLinecap="square" type="circle" percent={item.remainePercent} />
                                                                    </div>
                                                                    <div className='Grid2'>
                                                                        <div>
                                                                            <div className='titleName'>数据增加</div>
                                                                            <div className='value'>{ProjectUtil.numberFormat(item.created || 0)}</div>
                                                                        </div>
                                                                        <Progress
                                                                            width={56}
                                                                            strokeColor='#42D0D5'
                                                                            strokeWidth={8}
                                                                            showInfo={true}
                                                                            format={percent => `${percent}%`}
                                                                            strokeLinecap="square" type="circle" percent={item.createPercent} />
                                                                    </div>
                                                                    <div className='Grid2'>
                                                                        <div>
                                                                            <div className='titleName'>数据差异</div>
                                                                            <div className='value'>{ProjectUtil.numberFormat(item.updated || 0)}</div>
                                                                        </div>
                                                                        <Progress
                                                                            width={56}
                                                                            strokeColor='#EEB836'
                                                                            strokeWidth={8}
                                                                            showInfo={true}
                                                                            format={percent => `${percent}%`}
                                                                            strokeLinecap="square" type="circle" percent={item.updatePercent} />
                                                                    </div>
                                                                    <div className='Grid2'>
                                                                        <div>
                                                                            <div className='titleName'>数据缺失</div>
                                                                            <div className='value'>{ProjectUtil.numberFormat(item.deleted || 0)}</div>
                                                                        </div>
                                                                        <Progress
                                                                            width={56}
                                                                            strokeColor='#E8703F'
                                                                            strokeWidth={8}
                                                                            showInfo={true}
                                                                            format={percent => `${percent}%`}
                                                                            strokeLinecap="square" type="circle" percent={item.deletePercent} />
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </Spin>
                                </div>
                            )
                        }}
                    />
                    <div style={{ padding: '20px', background: '#fff', marginTop: 16 }}>
                        <ModuleTitle style={{ marginBottom: 15 }} title='对比结果详情'/>
                        {
                            this.pageParams.id ? <TableResult {...this.props}/> : null
                        }
                    </div>
                    <div className='dopTitle'>- DOP数据运营平台 -</div>
                </div>
            </React.Fragment>
        )
    }
}