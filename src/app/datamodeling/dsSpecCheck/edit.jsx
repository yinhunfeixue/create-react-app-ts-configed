import DrawerLayout from '@/component/layout/DrawerLayout'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Form, Input, message, Radio, Select } from 'antd'
import { addOrUpdateDmTask, configCategory, configJoinType, configSpellType, dsspecification, dsspecificationDatasource, getDatabaseList, getDmTaskById } from 'app_api/metadataApi'
import React, { Component } from 'react'

// import '../index.less'

const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input

export default class eastUpload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rootInfo: {
                joinType: undefined,
            },
            databaseIdList: [],
            loading: false,
            sourceList: [],
            baseList: [],
            categoryList: [],
            joinTypeList: [],
            spellTypeList: [],
        }
    }
    componentWillMount = () => {
        this.getSourceData()
        this.getConfigCategory()
        this.getConfigJoinType()
        this.getConfigSpellType()
        if (this.props.param.title == '编辑检查') {
            this.getDmDetail()
        }
    }
    getSourceData = async () => {
        let res = await dsspecificationDatasource({ filterConfig: false })
        if (res.code == 200) {
            this.setState({
                sourceList: res.data,
            })
        }
    }
    getDmDetail = async () => {
        let { databaseIdList } = this.state
        let res = await getDmTaskById({ id: this.props.param.taskId })
        if (res.code == 200) {
            res.data.databaseIdNameList &&
                res.data.databaseIdNameList.map((item) => {
                    databaseIdList.push(item.id)
                })
            await this.setState({
                rootInfo: res.data,
                databaseIdList,
            })
            this.getDatabase()
        }
    }
    changeDatasource = async (e, node) => {
        console.log(node, 'changeDatasource')
        const { rootInfo, databaseIdList } = this.state
        rootInfo.datasourceId = e
        rootInfo.datasourceNameEn = node.props.children
        await this.setState({
            rootInfo,
            databaseIdList: [],
        })
        this.getDsspecification()
        this.getDatabase()
    }
    getDsspecification = async () => {
        const { rootInfo } = this.state
        let res = await dsspecification({ id: rootInfo.datasourceId })
        if (res.code == 200) {
            if (res.data) {
                rootInfo.rootCategory = res.data.rootCategory
                rootInfo.spellType = res.data.spellType
                rootInfo.joinType = res.data.joinType
                this.setState({
                    rootInfo,
                })
            }
        }
    }
    getDatabase = async () => {
        const { rootInfo } = this.state
        let res = await getDatabaseList({ datasourceId: rootInfo.datasourceId, page: 1, pageSize: 10000 })
        if (res.code == 200) {
            this.setState({
                baseList: res.data,
            })
        }
    }
    changeDatabase = (e) => {
        this.setState({
            databaseIdList: e,
        })
    }
    changeJoinType = (e) => {
        const { rootInfo } = this.state
        rootInfo.joinType = e
        if (e == 'noconnectors') {
            rootInfo.spellType = 'camel'
        }
        this.setState({
            rootInfo,
        })
    }
    changeSpellType = (e) => {
        const { rootInfo } = this.state
        if (rootInfo.joinType == 'noconnectors' && e !== 'camel') {
            message.info('连接方式为无连接符时，仅支持拼写方式为驼峰的检查')
            return
        }
        rootInfo.spellType = e
        this.setState({
            rootInfo,
        })
    }
    changeRootCategory = (e) => {
        const { rootInfo } = this.state
        rootInfo.rootCategory = e
        this.setState({
            rootInfo,
        })
    }
    cancel = () => {
        this.props.remove('新增检查')
        this.props.addTab('规范性检查')
    }
    postData = async () => {
        const { rootInfo, databaseIdList, baseList } = this.state
        const { onSuccess } = this.props
        rootInfo.databaseIdNameList = []
        if (!rootInfo.datasourceId || !databaseIdList.length || !rootInfo.rootCategory || !rootInfo.spellType || !rootInfo.joinType) {
            message.info('请填写完整信息')
            return
        }
        baseList.map((item) => {
            databaseIdList.map((item1) => {
                if (item1 == item.databaseId) {
                    rootInfo.databaseIdNameList.push({ id: item1, name: item.physicalDatabase })
                }
            })
        })
        this.setState({ loading: true })
        let res = await addOrUpdateDmTask(rootInfo)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
            onSuccess()
        }
    }
    getConfigCategory = async () => {
        let res = await configCategory()
        if (res.code == 200) {
            this.setState({
                categoryList: res.data,
            })
        }
    }
    getConfigJoinType = async () => {
        let res = await configJoinType()
        if (res.code == 200) {
            this.setState({
                joinTypeList: res.data,
            })
        }
    }
    getConfigSpellType = async () => {
        let res = await configSpellType()
        if (res.code == 200) {
            this.setState({
                spellTypeList: res.data,
            })
        }
    }

    render() {
        const { rootInfo, databaseIdList, loading, sourceList, baseList, categoryList, joinTypeList, spellTypeList } = this.state
        const { param, visible, onClose } = this.props
        const { title } = param

        return (
            <DrawerLayout
                drawerProps={{
                    title,
                    visible,
                    onClose,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button loading={loading} onClick={this.postData} type='primary'>
                                开始检查
                            </Button>
                            <Button onClick={onClose}>取消</Button>
                        </React.Fragment>
                    )
                }}
            >
                <Form className='EditMiniForm Grid1'>
                    {RenderUtil.renderFormItems([
                        {
                            label: '数据源',
                            required: true,
                            content: (
                                <Select showSearch optionFilterProp='title' disabled={title == '编辑检查'} onChange={this.changeDatasource} value={rootInfo.datasourceId} placeholder='数据源'>
                                    {sourceList.map((item) => {
                                        return (
                                            <Option title={item.identifier} value={item.id} key={item.id}>
                                                {item.identifier}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            ),
                        },
                        {
                            label: '数据库',
                            required: true,
                            content: (
                                <Select showSearch={false} disabled={title == '编辑检查'} mode='multiple' onChange={this.changeDatabase} value={databaseIdList} placeholder='数据库'>
                                    {baseList.map((item) => {
                                        return (
                                            <Option value={item.databaseId} key={item.databaseId}>
                                                {item.physicalDatabase + (item.physicalDatabaseDesc ? '-' + item.physicalDatabaseDesc : '')}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            ),
                        },
                        {
                            label: '词根类别',
                            required: true,
                            content: (
                                <Select onChange={this.changeRootCategory} value={rootInfo.rootCategory} placeholder='词根类别'>
                                    {categoryList.map((item) => {
                                        return (
                                            <Option value={item.id} key={item.id}>
                                                {item.name}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            ),
                        },
                        {
                            label: '拼写方式',
                            required: true,
                            content: (
                                <Select onChange={this.changeSpellType} value={rootInfo.spellType} placeholder='拼写方式'>
                                    {spellTypeList.map((item) => {
                                        return (
                                            <Option disabled={item.id !== 'camel' && rootInfo.joinType == 'noconnectors'} name={item.name} value={item.id} key={item.id}>
                                                {item.name}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            ),
                        },
                        {
                            label: '连接方式',
                            required: true,
                            content: (
                                <Select onChange={this.changeJoinType} value={rootInfo.joinType} placeholder='连接方式'>
                                    {joinTypeList.map((item) => {
                                        return (
                                            <Option disabled={rootInfo.spellType !== 'camel' && item.id == 'noconnectors'} name={item.name} value={item.id} key={item.id}>
                                                {item.name}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            ),
                        },
                    ])}
                </Form>
            </DrawerLayout>
        )
    }
}
