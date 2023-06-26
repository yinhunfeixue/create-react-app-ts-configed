import DrawerLayout from '@/component/layout/DrawerLayout'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Divider, Input, message, Select } from 'antd'
import { Form } from '@ant-design/compatible';
import { columnTypeMapping, getDatasourceMapping } from 'app_api/systemManage'
import React, { Component } from 'react'
import '../index.less'
const { TextArea } = Input

export default class AddDatatypeSetDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            selectedId: undefined,
            selectedName: '',
            addTaskInfo: {},
            drawerTitle: '',
            datasourceTypeList: [],
            columnTypeList: [],
            drawerType: 'columnSet',
            previewContent: ''
        }
    }
    openModal = (data, selectedName, title, drawerType) => {
        let { addTaskInfo } = this.state
        console.log(data, 'openModal')
        for (let k in data) {
            addTaskInfo[k] = data[k]
        }
        this.setState({
            modalVisible: true,
            addTaskInfo,
            drawerTitle: title,
            drawerType,
            selectedName,
            previewContent: selectedName == 'lineageMapConfId' ? data.lineageMapConfName : data.columnTypeMapConfName
        })
        this.getTypeList()
    }
    getTypeList = async () => {
        let res = await getDatasourceMapping({page: 1, pageSize: 10000})
        if (res.code == 200) {
            this.setState({
                datasourceTypeList: res.data
            })
        }
        let res1 = await columnTypeMapping({page: 1, pageSize: 10000})
        if (res1.code == 200) {
            this.setState({
                columnTypeList: res1.data
            })
        }
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    changeSelect = (e, node) => {
        let { addTaskInfo, selectedName, previewContent } = this.state
        addTaskInfo[selectedName] = e
        if (e) {
            previewContent = node.props.title
        }
        console.log(previewContent, 'previewContent+++')
        this.setState({
            addTaskInfo,
            previewContent
        })
    }
    changeInput = (e) => {
        let { addTaskInfo, selectedName } = this.state
        addTaskInfo[selectedName] = e.target.value
        this.setState({
            addTaskInfo,
        })
    }
    postData = async () => {
        let { addTaskInfo, drawerType, selectedName, previewContent } = this.state
        if (drawerType == 'systemSet') {
            addTaskInfo.lineageMapConfName = previewContent
        } else {
            if (!addTaskInfo[selectedName]) {
                message.info('请选择字段关系映射')
                return
            }
            addTaskInfo.columnTypeMapConfName = previewContent
        }
        this.props.getNewTaskInfo(addTaskInfo)
        this.cancel()
    }
    getNewTypeList = () => {
        let { addTaskInfo, selectedName } = this.state
        this.getTypeList()
        addTaskInfo[selectedName] = undefined
        this.setState({
            addTaskInfo,
            previewContent: ''
        })
    }
    renderTitle = (title) => {
        return (
            <div>{title}
            <span style={{ float: 'right' }}>
                <a onClick={this.openAddMapPage}>新增</a>
                <Divider style={{ margin: '0 8px' }} type='vertical' />
                <a onClick={this.getNewTypeList}>刷新</a>
            </span>
            </div>
        )
    }
    openAddMapPage = () => {
        let { drawerType } = this.state
        if (drawerType == 'systemSet') {
            this.props.addTab('新增系统映射', {}, true)
        } else {
            this.props.addTab('新增字段类型映射', {}, true)
        }
    }
    render() {
        const {
            modalVisible,
            selectedId,
            drawerTitle,
            datasourceTypeList,
            columnTypeList,
            selectedName,
            drawerType,
            addTaskInfo,
            previewContent
        } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'AddDatatypeSetDrawer',
                    title: drawerTitle,
                    width: 480,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: false,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button onClick={this.postData} type='primary'>
                                确定
                            </Button>
                            <Button onClick={this.cancel}>取消</Button>
                        </React.Fragment>
                    )
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        {
                            drawerType == 'columnSet' ?
                                <div>
                                    <div>数据源：{selectedName == 'sourceIgnorePattern' ? addTaskInfo.sourceDsName : addTaskInfo.targetDsName}</div>
                                    <div style={{ margin: '24px 0 8px 0' }}>忽略字段设置</div>
                                    <TextArea placeholder='请输入' rows={6} value={addTaskInfo[selectedName]} onChange={this.changeInput} />
                                    <div style={{ margin: '24px 0 16px 0', color: '#5E6266' }}>填写说明</div>
                                    <div>1.  最多支持三层，为库/表/字段</div>
                                    <div className='ruleDesc'>
                                        即填写.*/logic_.*/dt_.*时，认为忽略数据源下所有库中logic_开头的表下dt_开头的字段
                                    </div>
                                    <div>2. 填写一层时，默认为表</div>
                                    <div className='ruleDesc'>即填写abc时，认为忽略数据源下，表名为abc的表</div>
                                    <div>3. 填写两层时，默认为表/字段</div>
                                    <div className='ruleDesc'>即填写 .*/updatetime 时,认为忽略数据源下，任意表中的updatetime字段</div>
                                    <div>4. 支持填写多个条件，使用分号分隔，条件之间为“或”关系</div>
                                </div>
                                : null
                        }
                        {
                            drawerType == 'systemSet' ?
                                <div>
                                    <Form className='EditMiniForm postForm Grid1' style={{ columnGap: 8 }}>
                                        {RenderUtil.renderFormItems([
                                            {
                                                label: this.renderTitle('系统关系映射'),
                                                content: <Select allowClear value={addTaskInfo[selectedName]} placeholder='请选择' onChange={this.changeSelect}>
                                                    {datasourceTypeList.map((item) => {
                                                        return (
                                                            <Select.Option title={item.content} key={item.id} value={item.id}>
                                                                {item.sourceDatasourceIdentifier} <span className='iconfont icon-jiantou'></span> {item.targetDatasourceIdentifier}
                                                            </Select.Option>
                                                        )
                                                    })}
                                                </Select>,
                                            },
                                            {
                                                label: '配置内容预览',
                                                hide: !addTaskInfo[selectedName],
                                                content: <TextArea disabled className='previrwArea' value={previewContent}/>,
                                            },
                                        ])}
                                    </Form>
                                </div>
                                : null
                        }
                        {
                            drawerType == 'datatypeSet' ?
                                <div>
                                    <Form className='MiniForm postForm Grid1' style={{ columnGap: 8 }}>
                                        {RenderUtil.renderFormItems([
                                            {
                                                label: this.renderTitle('字段类型映射'),
                                                content: <Select value={addTaskInfo[selectedName]} placeholder='请选择' onChange={this.changeSelect}>
                                                    {columnTypeList.map((item) => {
                                                        return (
                                                            <Select.Option title={item.content} key={item.id} value={item.id}>
                                                                {item.sourceDatasourceType} <span className='iconfont icon-jiantou'></span> {item.targetDatasourceType}
                                                            </Select.Option>
                                                        )
                                                    })}
                                                </Select>,
                                            },
                                            {
                                                label: '配置内容预览',
                                                hide: !addTaskInfo[selectedName],
                                                content: <TextArea disabled className='previrwArea' value={previewContent}/>,
                                            },
                                        ])}
                                    </Form>
                                </div>
                                : null
                        }
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}
