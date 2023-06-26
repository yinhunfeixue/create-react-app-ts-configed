import Module from '@/component/Module'
import { columnTypeMapping, getDatasourceMapping } from 'app_api/systemManage'
import React, { Component } from 'react'
import '../index.less'
import AddDatatypeSetDrawer from './addDatatypeSetDrawer'

export default class StepTwo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            addTaskInfo: this.props.addTaskInfo,
        }
    }
    componentDidMount = () => {
        this.getTypeList()
    }
    getTypeList = async () => {
        let { addTaskInfo } = this.state
        let res = await getDatasourceMapping({ page: 1, pageSize: 10000 })
        if (res.code == 200) {
            res.data.map((item) => {
                if (item.id == addTaskInfo.lineageMapConfId) {
                    addTaskInfo.lineageMapConfName = item.content
                }
            }) // 找不到就删除
            if (!addTaskInfo.lineageMapConfName) {
                addTaskInfo.lineageMapConfId = undefined
            }
            this.setState({
                addTaskInfo,
            })
        }
        let res1 = await columnTypeMapping({ page: 1, pageSize: 10000 })
        if (res1.code == 200) {
            res1.data.map((item) => {
                if (item.id == addTaskInfo.columnTypeMapConfId) {
                    addTaskInfo.columnTypeMapConfName = item.content
                }
            })
            if (!addTaskInfo.columnTypeMapConfName) {
                addTaskInfo.columnTypeMapConfId = undefined
            }
            this.setState({
                addTaskInfo,
            })
        }
    }
    getData = (data) => {
        console.log(data, 'stepTwo')
        this.setState({
            addTaskInfo: data,
        })
    }
    openColumnSetModal = (name, type) => {
        let { addTaskInfo } = this.state
        let title = type == 'add' ? '添加忽略字段' : '编辑忽略字段'
        this.addDatatypeSetDrawer && this.addDatatypeSetDrawer.openModal(addTaskInfo, name, title, 'columnSet')
    }
    openSystemSetModal = (type) => {
        let { addTaskInfo } = this.state
        let title = type == 'add' ? '添加系统映射' : '编辑系统映射'
        this.addDatatypeSetDrawer && this.addDatatypeSetDrawer.openModal(addTaskInfo, 'lineageMapConfId', title, 'systemSet')
    }
    openDatatypeSetModal = (type) => {
        let { addTaskInfo } = this.state
        let title = type == 'add' ? '添加字段映射' : '编辑字段映射'
        this.addDatatypeSetDrawer && this.addDatatypeSetDrawer.openModal(addTaskInfo, 'columnTypeMapConfId', title, 'datatypeSet')
    }
    deleteColumnSet = (name) => {
        let { addTaskInfo } = this.state
        addTaskInfo[name] = ''
        this.setState({
            addTaskInfo,
        })
    }
    deleteSystemSet = (name) => {
        let { addTaskInfo } = this.state
        addTaskInfo[name] = undefined
        this.setState({
            addTaskInfo,
        })
    }
    getNewTaskInfo = async (data) => {
        await this.setState({
            addTaskInfo: { ...data },
        })
        this.getTypeList()
    }
    nextStep = () => {
        this.props.getNewTaskInfo(this.state.addTaskInfo)
    }
    render() {
        let { addTaskInfo } = this.state
        return (
            <div className='stepTwo'>
                <Module title='对比任务设置'>
                    <table>
                        <tr className='thead'>
                            <td style={{ width: '20%' }}>数据源</td>
                            <td style={{ width: '40%' }}>
                                <div className='titleName'>{addTaskInfo.targetDsName}</div>
                                <div className='versionName'>新版本</div>
                            </td>
                            <td style={{ width: '40%' }}>
                                <div className='titleName'>{addTaskInfo.sourceDsName}</div>
                                <div className='versionName'>旧版本</div>
                            </td>
                        </tr>
                        <tr>
                            <td>数据库类型</td>
                            <td>{addTaskInfo.targetDsProduct}</td>
                            <td>{addTaskInfo.sourceDsProduct}</td>
                        </tr>
                        <tr>
                            <td>忽略字段设置</td>
                            <td>
                                {
                                    addTaskInfo.targetIgnorePattern ?
                                        <div>
                                            <span onClick={this.openColumnSetModal.bind(this, 'targetIgnorePattern', 'edit')} className='LineClamp'>{addTaskInfo.targetIgnorePattern}</span>
                                            <span onClick={this.deleteColumnSet.bind(this, 'targetIgnorePattern')} className='iconfont icon-lajitong'></span>
                                        </div>
                                        :
                                        <a onClick={this.openColumnSetModal.bind(this, 'targetIgnorePattern', 'add')}>添加</a>
                                }
                            </td>
                            <td>
                                {
                                    addTaskInfo.sourceIgnorePattern ?
                                        <div>
                                            <span onClick={this.openColumnSetModal.bind(this, 'sourceIgnorePattern', 'edit')} className='LineClamp'>{addTaskInfo.sourceIgnorePattern}</span>
                                            <span onClick={this.deleteColumnSet.bind(this, 'sourceIgnorePattern')} className='iconfont icon-lajitong'></span>
                                        </div>
                                        :
                                        <a onClick={this.openColumnSetModal.bind(this, 'sourceIgnorePattern', 'add')}>添加</a>
                                }
                            </td>
                        </tr>
                        <tr>
                            <td rowspan={2}>推荐配置（必填）</td>
                            <td colspan={2}>
                                {addTaskInfo.lineageMapConfId ? (
                                    <div>
                                        <span onClick={this.openSystemSetModal.bind(this, 'edit')} className='LineClamp'>
                                            {addTaskInfo.lineageMapConfName}
                                        </span>
                                        <span onClick={this.deleteSystemSet.bind(this, 'lineageMapConfId')} className='iconfont icon-lajitong'></span>
                                    </div>
                                ) : (
                                    <div style={{ color: '#2D3033' }}>
                                        <span style={{ marginRight: 16 }}>1. 添加系统映射关系（明确对比范围）</span>
                                        <a onClick={this.openSystemSetModal.bind(this, 'add')}>添加配置</a>
                                    </div>
                                )}
                            </td>
                        </tr>
                        {addTaskInfo.sourceDsProduct == addTaskInfo.targetDsProduct ? null : (
                            <tr>
                                <td colspan={2}>
                                    {addTaskInfo.columnTypeMapConfId ? (
                                        <div>
                                            <span onClick={this.openDatatypeSetModal.bind(this, 'edit')} className='LineClamp'>
                                                {addTaskInfo.columnTypeMapConfName}
                                            </span>
                                            <span onClick={this.deleteSystemSet.bind(this, 'columnTypeMapConfId')} className='iconfont icon-lajitong'></span>
                                        </div>
                                    ) : (
                                        <div style={{ color: '#2D3033' }}>
                                            <span style={{ marginRight: 16 }}>2. 请添加字段类型映射关系</span>
                                            <a onClick={this.openDatatypeSetModal.bind(this, 'add')}>添加配置</a>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        )}
                    </table>
                </Module>
                <AddDatatypeSetDrawer
                    {...this.props}
                    ref={(dom) => this.addDatatypeSetDrawer = dom}
                    getNewTaskInfo={this.getNewTaskInfo}
                />
            </div>
        )
    }
}
