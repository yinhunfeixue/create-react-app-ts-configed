import DrawerLayout from '@/component/layout/DrawerLayout'
import TipLabel from '@/component/tipLabel/TipLabel'
import RenderUtil from '@/utils/RenderUtil'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Alert, Button, Col, Form, Input, message, Radio, Row, Select } from 'antd'
import { configCategory, configJoinType, configOrderType, configSpellType, dsspecification, dsspecificationDatasource, saveDsspecification } from 'app_api/metadataApi'
import React, { Component } from 'react'
import './addDs.less'

const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input

export default class eastUpload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rootInfo: {
                spellType: 'camel',
                spellTypeName: '驼峰',
                joinType: 'underline',
                joinTypeName: '下划线连接',
                rootOrderType: 'chinese_desc_order',
                rootOrderTypeName: '按中文描述词排序',
                datasourceId: this.props.param.datasourceId,
                datasourceType: this.props.param.datasourceType,
                datasourceNameEn: this.props.param.datasourceNameEn,
                filterRules: this.props.param.filterRules ? this.props.param.filterRules : [],
            },
            databaseIdList: [],
            loading: false,
            sourceList: [],
            baseList: [],
            categoryList: [],
            joinTypeList: [],
            spellTypeList: [],
            orderTypeList: [],
        }
    }
    componentWillMount = () => {
        this.getSourceData()
        this.getConfigCategory()
        this.getConfigJoinType()
        this.getConfigOrderType()
        this.getConfigSpellType()
        if (this.props.param.title == '编辑词根组合规范') {
            this.getDmDetail()
        }
        if (this.props.param.from == 'ddl') {
            let { rootInfo } = this.state
            rootInfo.datasourceId = this.props.param.datasourceId
            rootInfo.datasourceType = this.props.param.datasourceType
            rootInfo.datasourceNameEn = this.props.param.datasourceNameEn
            this.setState({
                rootInfo,
            })
        }
    }
    getSourceData = async () => {
        let res = await dsspecificationDatasource({ filterConfig: this.props.param.title == '编辑词根组合规范' ? false : true })
        if (res.code == 200) {
            this.setState({
                sourceList: res.data,
            })
        }
    }
    getDmDetail = async () => {
        let res = await dsspecification({ id: this.props.param.datasourceId })
        if (res.code == 200) {
            await this.setState({
                rootInfo: res.data,
            })
        }
    }
    changeDatasource = async (e, node) => {
        console.log(node, 'changeDatasource')
        const { rootInfo } = this.state
        rootInfo.datasourceId = e
        rootInfo.datasourceNameEn = node.props.children
        rootInfo.datasourceType = node.props.product
        await this.setState({
            rootInfo,
        })
    }
    changeJoinType = (e, node) => {
        const { rootInfo } = this.state
        rootInfo.joinType = e
        rootInfo.joinTypeName = node.props.name
        if (e == 'noconnectors') {
            rootInfo.spellType = 'camel'
            rootInfo.spellTypeName = '驼峰'
        }
        this.setState({
            rootInfo,
        })
    }
    changeSpellType = (e, node) => {
        const { rootInfo } = this.state
        if (rootInfo.joinType == 'noconnectors' && e !== 'camel') {
            message.info('连接方式为无连接符时，仅支持拼写方式为驼峰的检查')
            return
        }
        rootInfo.spellType = e
        rootInfo.spellTypeName = node.props.name
        this.setState({
            rootInfo,
        })
    }
    changeRootCategory = (e, node) => {
        const { rootInfo } = this.state
        rootInfo.rootCategory = e
        rootInfo.rootCategoryName = node.props.children
        this.setState({
            rootInfo,
        })
    }
    changeRootOrderType = (e, node) => {
        const { rootInfo } = this.state
        rootInfo.rootOrderType = e
        rootInfo.rootOrderTypeName = node.props.children
        this.setState({
            rootInfo,
        })
    }
    cancel = () => {
        // this.props.remove('新增词根组合规范')
        // this.props.addTab('词根组合规范')
        const { onClose } = this.props
        onClose()
    }
    postData = async () => {
        const { rootInfo } = this.state
        if (!rootInfo.datasourceId || !rootInfo.rootCategory || !rootInfo.spellType || !rootInfo.joinType || !rootInfo.rootOrderType) {
            message.info('请填写完整信息')
            return
        }
        let hasEmpty = false
        rootInfo.filterRules.map((item) => {
            if (!item.fileRuleName || !item.filterRuleContent) {
                hasEmpty = true
            }
        })
        if (hasEmpty) {
            message.info('请填写完整过滤设置')
            return
        }

        const { onSuccess } = this.props
        this.setState({ loading: true })
        let res = await saveDsspecification(rootInfo)
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
    getConfigOrderType = async () => {
        let res = await configOrderType()
        if (res.code == 200) {
            this.setState({
                orderTypeList: res.data,
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
    changeName = (index, e) => {
        let { rootInfo } = this.state
        rootInfo.filterRules[index].fileRuleName = e.target.value
        this.setState({
            rootInfo,
        })
    }
    changeRemarks = (index, e) => {
        let { rootInfo } = this.state
        rootInfo.filterRules[index].remarks = e.target.value
        this.setState({
            rootInfo,
        })
    }
    deleteData = async (index) => {
        let { rootInfo } = this.state
        rootInfo.filterRules.splice(index, 1)
        this.setState({
            rootInfo,
        })
    }
    changeExt = (index, e) => {
        let { rootInfo } = this.state
        rootInfo.filterRules[index].filterRuleContent = e.target.value
        this.setState({
            rootInfo,
        })
    }
    addData = () => {
        let { rootInfo } = this.state
        rootInfo.filterRules.push({ fileRuleName: '', filterRuleContent: '', remarks: '' })
        this.setState({
            rootInfo,
        })
    }

    render() {
        const { rootInfo, databaseIdList, loading, sourceList, baseList, categoryList, joinTypeList, orderTypeList, spellTypeList } = this.state
        const { visible } = this.props
        return (
            <DrawerLayout
                drawerProps={{
                    title: '新增词根组合',
                    visible,
                    width: 640,
                    onClose: this.cancel,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button loading={loading} onClick={this.postData} type='primary'>
                                保存
                            </Button>
                            <Button onClick={this.cancel}>取消</Button>
                        </React.Fragment>
                    )
                }}
            >
                <Alert showIcon type='warning' message='每个数据源仅能创建唯一一套规范，已创建规范的数据源请在列表中搜索并修改。' />
                <Form className='EditMiniForm Grid1'>
                    {RenderUtil.renderFormItems([
                        {
                            label: '数据源',
                            required: true,
                            content: (
                                <Select
                                    notFoundContent={
                                        <div style={{ fontSize: '12px', color: '#666' }}>
                                            目前没有可以配置规范的数据源，可能有以下2种情况
                                            <br />
                                            1、系统还未采集过数据源，请在【数据治理】-【数据源管理】中进行
                                            <br />
                                            采集
                                            <br />
                                            2、系统已经采集过数据源，但数据源已经配置规范，请在【词根组合规范】
                                            <br />
                                            列表中查找并修改。
                                        </div>
                                    }
                                    showSearch
                                    optionFilterProp='title'
                                    disabled={this.props.param.title == '编辑词根组合规范'}
                                    onChange={this.changeDatasource}
                                    value={rootInfo.datasourceId}
                                    placeholder='数据源'
                                >
                                    {sourceList.map((item) => {
                                        return (
                                            <Option title={item.identifier} product={item.product} value={item.id} key={item.id}>
                                                {item.identifier}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            ),
                        },
                        {
                            label: '数据源类型',
                            content: rootInfo.datasourceType,
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
                        {
                            label: '词根排序',
                            required: true,
                            content: (
                                <Select onChange={this.changeRootOrderType} value={rootInfo.rootOrderType} placeholder='词根排序'>
                                    {orderTypeList.map((item) => {
                                        return (
                                            <Option name={item.name} value={item.id} key={item.id}>
                                                {item.name}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            ),
                        },
                        {
                            label: (
                                <TipLabel
                                    label='过滤设置'
                                    tip={
                                        <div>
                                            <p>说明：</p>
                                            <p>1、过滤设置用于在规范性检查时，事先过滤掉不需要检查的表，例如临时表、中间表等。</p>
                                            <p>2、符合正则表达式的表将不做规范性检查。</p>
                                            <p>3、满足任一表达式就会被过滤。</p>
                                        </div>
                                    }
                                />
                            ),
                            content: (
                                <div className='VControlGroup FilterGroup'>
                                    <Row gutter={10}>
                                        <Col span={8}>名称</Col>
                                        <Col span={8}>正则表达式</Col>
                                        <Col span={8}>备注</Col>
                                    </Row>
                                    {rootInfo.filterRules.map((item, index) => {
                                        return (
                                            <Row gutter={10}>
                                                <Col span={8}>
                                                    <Input title={item.fileRuleName} onChange={this.changeName.bind(this, index)} value={item.fileRuleName} placeholder='请输入名称' />
                                                </Col>
                                                <Col span={8}>
                                                    <Input title={item.filterRuleContent} onChange={this.changeExt.bind(this, index)} value={item.filterRuleContent} placeholder='请输入正则表达式' />
                                                </Col>
                                                <Col span={8}>
                                                    <div className='HControlGroup' style={{ flexWrap: 'nowrap' }}>
                                                        <Input title={item.remarks} onChange={this.changeRemarks.bind(this, index)} value={item.remarks} placeholder='请输入备注' />
                                                        <DeleteOutlined onClick={this.deleteData.bind(this, index)} />
                                                    </div>
                                                </Col>
                                            </Row>
                                        )
                                    })}
                                    <Button onClick={this.addData} icon={<PlusOutlined />} block type='link' ghost>
                                        添加
                                    </Button>
                                </div>
                            ),
                        },
                    ])}
                </Form>
            </DrawerLayout>
        )
    }
}
