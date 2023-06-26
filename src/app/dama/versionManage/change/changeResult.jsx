// 变更管理详情
import EmptyLabel from '@/component/EmptyLabel'
import TableLayout from '@/component/layout/TableLayout'
import ModuleTitle from '@/component/module/ModuleTitle'
import RenderUtil from '@/utils/RenderUtil'
import ProjectUtil from '@/utils/ProjectUtil'
import { Button, Input, Select, Tooltip, Row, Col, Spin, Tabs, DatePicker } from 'antd'
import { versionDiffStatistic } from 'app_api/autoManage'
import React, { Component } from 'react'
import './index.less'
import TableResult from '../version/component/tableResult'
import moment from 'moment'


export default class DataCompareDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            taskDetail: [],
            staticsList: [
                {name: '表', value: 'tableInfo'},
                {name: '字段', value: 'columnInfo'},
                {name: '代码项', value: 'codeItem'},
                {name: '代码值', value: 'codeValue'}
            ],
            spinning: false,
        }
    }
    componentWillMount = async () => {
        this.getTaskDetailData()
    }
    getTaskDetailData = async () => {
        let { staticsList } = this.state
        let query = {
            // sourceVersion: this.pageParam.sourceVersion,
            targetVersion: this.pageParam.targetVersion,
            datasourceId: this.pageParam.datasourceId
        }
        this.setState({spinning: true})
        let res = await versionDiffStatistic(query)
        this.setState({spinning: false})
        if (res.code == 200) {
            res.data.map((item) => {
                item.name = item.type == 'table' ? '表' : (item.type == 'column' ? '字段' : (item.type == 'code' ? '代码项' : '代码值'))
            })
            staticsList = [
                {name: '表'},
                {name: '字段'},
                {name: '代码项'},
                {name: '代码值'}
            ]
            staticsList.map((node, index) => {
                res.data.map((item) => {
                    if (item.name == node.name) {
                        node.created = item.created
                        node.deleted = item.deleted
                        node.updated = item.updated
                    }
                })
            })
            this.setState({
                taskDetail: res.data,
                staticsList
            })
        }
    }
    get pageParam() {
        return ProjectUtil.getPageParam(this.props)
    }
    render() {
        const {
            staticsList,
            spinning
        } = this.state
        const { date } = this.pageParam
        return (
            <React.Fragment>
                <div className='versionCompareResult'>
                    <TableLayout
                        title={this.pageParam.datasourceName}
                        renderHeaderExtra={() => {
                            return (
                                <div>
                                    <span style={{ color: '#5E6266', fontSize: '14px' }}>变更日期：{date}</span>
                                </div>
                            )
                        }}
                        disabledDefaultFooter
                        renderDetail={() => {
                            return (
                                <div>
                                    <ModuleTitle style={{ marginBottom: 15 }} title='变更汇总'/>
                                    <Spin spinning={spinning}>
                                        <div className='resultStatics Grid4'>
                                            {
                                                staticsList.map((item, index) => {
                                                    return (
                                                        <div className='staticsItem'>
                                                            <div className='staticsItemTitle'>
                                                                {item.name == '表' ? <img src={require('app_images/dataCompare/table.png')} /> : null}
                                                                {item.name == '字段' ? <img src={require('app_images/dataCompare/column.png')} /> : null}
                                                                {item.name == '代码项' ? <img src={require('app_images/dataCompare/codeItem.png')} /> : null}
                                                                {item.name == '代码值' ? <img src={require('app_images/dataCompare/codeValue.png')} /> : null}
                                                                {item.name}
                                                            </div>
                                                            {
                                                                item.created || item.deleted || item.updated ?
                                                                    <div style={{ marginLeft: 28 }}>
                                                                        <div className='Grid3'>
                                                                            <div>
                                                                                <div className='titleName'>新增</div>
                                                                                <div className='value'>{ProjectUtil.numberFormat(item.created)}{item.created > 9999 ? <span style={{ fontSize: '14px' }}>万</span> : null}</div>
                                                                            </div>
                                                                            <div>
                                                                                <div className='titleName'>删除</div>
                                                                                <div className='value'>{ProjectUtil.numberFormat(item.deleted)}{item.deleted > 9999 ? <span style={{ fontSize: '14px' }}>万</span> : null}</div>
                                                                            </div>
                                                                            <div>
                                                                                <div className='titleName'>修改</div>
                                                                                <div className='value'>{ProjectUtil.numberFormat(item.updated)}{item.updated > 9999 ? <span style={{ fontSize: '14px' }}>万</span> : null}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    :
                                                                    <div className='emptyText'>- 暂无更新内容 -</div>
                                                            }
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
                        <ModuleTitle style={{ marginBottom: 15 }} title='变更详情'/>
                        {
                            this.pageParam.datasourceId ? <TableResult from="change" {...this.props}/> : null
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    }
}