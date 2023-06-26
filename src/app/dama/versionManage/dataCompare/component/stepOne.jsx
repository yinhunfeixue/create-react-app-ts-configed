import EmptyLabel from '@/component/EmptyLabel';
import SystemTree from '@/app/dama/dataSecurity/catalog/systemTree';
import Module from '@/component/Module';
import RenderUtil from '@/utils/RenderUtil';
import { Input, message } from 'antd';
import { Form } from '@ant-design/compatible';
import { latestVersionList } from 'app_api/autoManage';
import React, { Component } from 'react';
import '../index.less';

export default class StepOne extends Component {
    constructor(props) {
        super(props)
        this.state = {
            addTaskInfo: {},
            treeData: []
        }
    }
    componentWillMount = () => {
    }
    getData = (treeData, data) => {
        console.log(data, 'getData')
        this.setState({
            treeData,
            addTaskInfo: {...data}
        })
        this.systemTreeLeft&&this.systemTreeLeft.getTreeData(treeData, [data.sourceDsId], true)
        this.systemTreeRight&&this.systemTreeRight.getTreeData(treeData, [data.targetDsId], true)
    }
    nextStep = () => {
        this.props.getNewTaskInfo(this.state.addTaskInfo)
    }
    onChangeInput = (e) => {
        let { addTaskInfo } = this.state
        addTaskInfo.name = e.target.value
        this.setState({
            addTaskInfo
        })
    }
    onSelectLeft = async (name, selectedKeys, e) => {
        let { addTaskInfo } = this.state
        console.log(selectedKeys, e)
        if (e.selectedNodes.length > 0) {
            addTaskInfo[name] = selectedKeys[0]
            if (name == 'sourceDsId') {
                addTaskInfo.sourceDsName = e.selectedNodes[0].dataRef.name
                addTaskInfo.sourceDsProduct = e.selectedNodes[0].dataRef.product
                await this.getVersionList('sourceVersion', selectedKeys[0])
            } else {
                addTaskInfo.targetDsName = e.selectedNodes[0].dataRef.name
                addTaskInfo.targetDsProduct = e.selectedNodes[0].dataRef.product
                await this.getVersionList('targetVersion', selectedKeys[0])
            }
            this.setState({
                addTaskInfo
            })
        }
    }
    getVersionList = async (name, id) => {
        let { addTaskInfo } = this.state
        let res = await latestVersionList({datasourceId: id})
        if (res.code == 200) {
            if (res.data.length) {
                res.data.map((item) => {
                    if (item.latest) {
                        addTaskInfo[name] = item.version
                    }
                })
                this.setState({
                    addTaskInfo,
                })
            } else {
                addTaskInfo[name] = ''
                this.setState({
                    addTaskInfo,
                })
                message.info('该系统暂无版本')
            }
        }
    }
    render() {
        let {
            addTaskInfo,
        } = this.state
        return (
            <div className='stepOne'>
                <Module title='任务信息'>
                    <Form className='EditMiniForm Grid1'>
                        {RenderUtil.renderFormItems([
                            {
                                label: '任务名称',
                                required: true,
                                content: (
                                    <Input
                                        placeholder='请输入'
                                        value={addTaskInfo.name}
                                        onChange={this.onChangeInput}
                                        maxLength={32}
                                        suffix={<span style={{ color: '#B3B3B3' }}>{addTaskInfo.name ? addTaskInfo.name.length : 0}/32</span>}
                                    />
                                ),
                            },
                        ])}
                    </Form>
                </Module>
                <Module title='选择节点'>
                    <div className='Grid2' style={{ columnGap: '16px' }}>
                        <div className='systemTreeArea'>
                            <div className='titleName'>对比系统
                                {
                                    addTaskInfo.targetDsName ? <span>已选择：{addTaskInfo.targetDsName}</span> : null
                                }
                            </div>
                            <div className='treeArea commonScroll'>
                                <SystemTree
                                    ref={(dom) => this.systemTreeRight = dom}
                                    onTreeSelect={this.onSelectLeft.bind(this, 'targetDsId')}
                                    selectedKeys={addTaskInfo.targetDsId}
                                    itemKey='id'
                                    selectType={2}
                                    itemTitle='name'
                                />
                            </div>
                            <div className='versionName'>
                                <span className='required'>*</span>系统版本：{addTaskInfo.targetVersion ? <span className='newTag'>最新</span> : <EmptyLabel/>}{addTaskInfo.targetVersion}
                            </div>
                        </div>
                        <div className='systemTreeArea'>
                            <div className='titleName'>参照系统
                                {
                                    addTaskInfo.sourceDsName ? <span>已选择：{addTaskInfo.sourceDsName}</span> : null
                                }
                            </div>
                            <div className='treeArea commonScroll'>
                                <SystemTree
                                    ref={(dom) => this.systemTreeLeft = dom}
                                    onTreeSelect={this.onSelectLeft.bind(this, 'sourceDsId')}
                                    selectedKeys={addTaskInfo.sourceDsId}
                                    itemKey='id'
                                    selectType={2}
                                    itemTitle='name'
                                />
                            </div>
                            <div className='versionName'>
                                <span className='required'>*</span>系统版本：{addTaskInfo.sourceVersion ? <span className='newTag'>最新</span> : <EmptyLabel/>}{addTaskInfo.sourceVersion}
                            </div>
                        </div>
                    </div>
                </Module>
            </div>
        )
    }
}