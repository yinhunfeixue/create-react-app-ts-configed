import EmptyLabel from '@/component/EmptyLabel'
import TableLayout from '@/component/layout/TableLayout'
import ModuleTitle from '@/component/module/ModuleTitle'
import RenderUtil from '@/utils/RenderUtil'
import ProjectUtil from '@/utils/ProjectUtil'
import { Button, Input, Select, Tooltip, Row, Col, Divider, Tabs, Spin } from 'antd'
import { getExternalList, getTaskDetail } from 'app_api/metadataApi'
import React, { Component } from 'react'
import './index.less'
import TableResult from './component/tableResult'
import { versionDiffStatistic } from 'app_api/autoManage'


export default class DataCompareDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            taskDetail: [],
            staticsList: [
                {name: '表'},
                {name: '字段'},
                {name: '代码项'},
                {name: '代码值'}
            ],
            spinning: false,
            selectedRows: []
        }

    }
    componentWillMount = async () => {
        await this.setState({
            selectedRows: JSON.parse(this.pageParam.selectedRows)
        })
        this.getTaskDetailData()
    }
    getTaskDetailData = async () => {
        console.log(this.pageParam, 'this.pageParam')
        let { staticsList, selectedRows } = this.state
        let query = {
            sourceVersion: selectedRows[1].version,
            targetVersion: selectedRows[0].version,
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
            taskDetail,
            staticsList,
            spinning,
            selectedRows
        } = this.state
        return (
            <React.Fragment>
                <div className='versionCompareResult'>
                    <TableLayout
                        title={this.pageParam.datasourceName}
                        disabledDefaultFooter
                        renderDetail={() => {
                            return (
                                <div>
                                    <div className='compareItems'>
                                        <div className='Grid2'>
                                            <div>
                                                <div className='titleName'>{selectedRows[0].tag}</div>
                                                <div className='versionName'>定版时间：{selectedRows[0].date}</div>
                                                <div className='systemName'>新版本</div>
                                            </div>
                                            <div>
                                                <div className='titleName'>{selectedRows[1].tag}</div>
                                                <div className='versionName'>定版时间：{selectedRows[1].date}</div>
                                                <div className='systemName'>旧版本</div>
                                            </div>
                                        </div>
                                        <img src={require('app_images/dataCompare/vs.png')} />
                                    </div>
                                    <ModuleTitle style={{ marginBottom: 15 }} title='对比结果统计'/>
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
                        <ModuleTitle style={{ marginBottom: 15 }} title='对比详情'/>
                        {
                            this.pageParam.datasourceId ? <TableResult from="change" {...this.props}/> : null
                        }
                    </div>
                    <div className='dopTitle'>- DOP数据运营平台 -</div>
                </div>
            </React.Fragment>
        )
    }
}