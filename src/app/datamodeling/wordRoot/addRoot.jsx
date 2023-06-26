import DrawerLayout from '@/component/layout/DrawerLayout'
import TipLabel from '@/component/tipLabel/TipLabel'
import RenderUtil from '@/utils/RenderUtil'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, message, Radio, Select, Tag, Tooltip } from 'antd'
import { configCategory, configType, descExist, nameExist, rootList, saveRoot } from 'app_api/metadataApi'
import React, { Component } from 'react'

const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input

export default class eastUpload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rootInfo: {
                descWord: [],
                rootCategory: this.props.param.rootCategory,
                rootName: this.props.param.lackedRootsView,
                status: 1,
            },
            inputVisible: false,
            inputValue: '',
            loading: false,
            typeList: [],
            categoryList: [],
        }
    }
    componentWillMount = async () => {
        if (this.props.param.title == '编辑词根') {
            await this.getRootInfo()
            this.getConfigCategory()
            this.getConfigType()
        } else {
            if (this.state.rootInfo.rootCategory !== 'prefixsuffix') {
                this.state.rootInfo.rootType = 'unknown'
            } else {
                this.state.rootInfo.rootType = undefined
            }
            await this.setState({
                rootInfo: this.state.rootInfo,
            })
            this.getConfigCategory()
            this.getConfigType()
        }
    }
    getRootInfo = async () => {
        let res = await rootList({ idList: [this.props.param.id] })
        if (res.code == 200) {
            if (res.data) {
                this.setState({
                    rootInfo: res.data[0],
                })
            }
        }
    }
    handleClose = (removedTag) => {
        const { rootInfo } = this.state
        const tags = rootInfo.descWord.filter((tag) => tag !== removedTag)
        rootInfo.descWord = tags
        console.log(tags, 'close')
        this.setState({ rootInfo })
    }

    showInput = () => {
        this.setState({ inputVisible: true }, () => this.input.focus())
    }
    handleInputConfirm = async () => {
        const { inputValue } = this.state
        let { rootInfo } = this.state
        if (!inputValue) {
            this.setState({
                inputVisible: false,
            })
            return
        }
        let query = {
            category: rootInfo.rootCategory,
            id: rootInfo.id,
            desc: inputValue,
        }
        let res = await descExist(query)
        if (res.code == 200) {
            if (res.data) {
                message.error('描述词已存在')
            } else {
                if (inputValue && rootInfo.descWord.indexOf(inputValue) == -1) {
                    rootInfo.descWord = [...rootInfo.descWord, inputValue]
                    this.setState({
                        rootInfo,
                        inputVisible: false,
                        inputValue: '',
                    })
                    console.log(rootInfo.descWord, 'add')
                } else {
                    message.error('描述词已存在')
                }
            }
        }
    }
    saveInputRef = (input) => (this.input = input)

    handleInputChange = (e) => {
        this.setState({ inputValue: e.target.value })
    }
    changeName = (e) => {
        const { rootInfo } = this.state
        rootInfo.rootName = e.target.value
        this.setState({
            rootInfo,
        })
    }
    rootNameKeyup = () => {
        const { rootInfo } = this.state
        if (rootInfo.rootName[0] == '_') {
            rootInfo.rootName = rootInfo.rootName.substr(1, rootInfo.rootName.length)
        }
        rootInfo.rootName = rootInfo.rootName.replace(/[^\w_]/g, '')
        this.setState({
            rootInfo,
        })
    }
    checkName = async (e) => {
        const { rootInfo } = this.state
        let query = {
            category: rootInfo.rootCategory,
            id: rootInfo.id,
            name: rootInfo.rootName,
        }
        let res = await nameExist(query)
        if (res.code == 200) {
            if (res.data) {
                message.error('词根已存在')
            }
        }
    }
    changeDesc = (e) => {
        const { rootInfo } = this.state
        rootInfo.remarks = e.target.value
        this.setState({
            rootInfo,
        })
    }
    changeRootType = (e, node) => {
        const { rootInfo } = this.state
        rootInfo.rootType = e
        rootInfo.rootTypeName = node.props.name
        this.setState({
            rootInfo,
        })
    }
    changeRootCategory = async (e, node) => {
        const { rootInfo } = this.state
        if (e !== 'prefixsuffix') {
            rootInfo.rootType = 'unknown'
        } else {
            rootInfo.rootType = undefined
            rootInfo.descWord = []
        }
        rootInfo.rootCategory = e
        rootInfo.rootCategoryName = node.props.name
        await this.setState({
            rootInfo,
        })
        this.getConfigType()
    }
    getConfigType = async () => {
        let res = await configType({ category: this.state.rootInfo.rootCategory })
        if (res.code == 200) {
            this.setState({
                typeList: res.data,
            })
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
    cancel = () => {
        this.props.remove('新增词根')
        this.props.addTab('词根库')
    }
    postData = async () => {
        const { rootInfo } = this.state
        const { onSuccess } = this.props
        if (!rootInfo.rootName || !rootInfo.rootCategory) {
            message.info('请填写完整信息')
            return
        }
        if (rootInfo.rootCategory !== 'prefixsuffix' && !rootInfo.descWord.length) {
            message.info('请填写完整信息')
            return
        }
        if (rootInfo.rootName[rootInfo.rootName.length - 1] == '_') {
            message.info('词根开头和结尾不能为下划线')
            return
        }
        this.setState({ loading: true })
        let res = await saveRoot(rootInfo)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
            onSuccess()
        }
    }

    render() {
        const { rootInfo, inputVisible, inputValue, loading, categoryList, typeList } = this.state
        const { visible, onClose } = this.props
        const { title } = this.props.param
        return (
            <DrawerLayout
                drawerProps={{
                    title: title || '新增词根',
                    visible,
                    onClose,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button loading={loading} onClick={this.postData} type='primary'>
                                保存
                            </Button>
                            <Button onClick={() => onClose()}>取消</Button>
                        </React.Fragment>
                    )
                }}
            >
                <Form className='EditMiniForm Grid1'>
                    {RenderUtil.renderFormItems([
                        {
                            label: <TipLabel label='词根类别' tip='系统支持多套词根类别，适用于不同的业务系统，新的类别请联系管理员添加' />,
                            required: true,
                            content: (
                                <Select disabled={this.props.param.title == '编辑词根'} onChange={this.changeRootCategory} value={rootInfo.rootCategory} placeholder='词根类别'>
                                    {categoryList.map((item) => {
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
                                    label='词根'
                                    tip={
                                        <div>
                                            词根只能由英文、数字、下划线组成，开头结尾不能为下划线
                                            <br />
                                            在同一类别下，词根有且只有唯一
                                        </div>
                                    }
                                />
                            ),
                            content: (
                                <Input
                                    onBlur={this.checkName}
                                    disabled={this.props.param.title == '编辑词根'}
                                    onKeyUp={this.rootNameKeyup}
                                    value={rootInfo.rootName}
                                    onChange={this.changeName}
                                    placeholder='请输入词根名称'
                                />
                            ),
                        },
                        {
                            label: <TipLabel label='描述词' tip='同一类别下，1个词根可以有多个描述词，但1个描述词只能描述1个词根' />,
                            hide: rootInfo.rootCategory == 'prefixsuffix',
                            content: (
                                <div>
                                    {rootInfo.descWord.map((tag, index) => {
                                        const isLongTag = tag.length > 20
                                        const tagElem = (
                                            <Tag color='blue' key={tag} closable={true} onClose={() => this.handleClose(tag)}>
                                                {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                            </Tag>
                                        )
                                        return isLongTag ? (
                                            <Tooltip title={tag} key={tag}>
                                                {tagElem}
                                            </Tooltip>
                                        ) : (
                                            tagElem
                                        )
                                    })}
                                    {inputVisible && (
                                        <Input
                                            ref={this.saveInputRef}
                                            type='text'
                                            size='small'
                                            style={{ width: 78 }}
                                            value={inputValue}
                                            onChange={this.handleInputChange}
                                            onBlur={this.handleInputConfirm}
                                            onPressEnter={this.handleInputConfirm}
                                        />
                                    )}
                                    {!inputVisible && (
                                        <Tag onClick={this.showInput} style={{ border: '1px solid #4D74FE', color: '#4D74FE' }}>
                                            <PlusOutlined /> 添加描述词
                                        </Tag>
                                    )}
                                </div>
                            ),
                        },
                        {
                            label: (
                                <TipLabel
                                    label='词根类型'
                                    tip={
                                        <div>
                                            {rootInfo.rootCategory == 'prefixsuffix' ? (
                                                <div>
                                                    <p>层次前缀：标识数仓层次，如ODS，DWD，DWM，DWS等</p>
                                                    <p>子层次前缀：数仓层次下的细分层次</p>
                                                    <p>主题前缀：标识数仓主题分类，如客户、产品等主题</p>
                                                    <p>子主题前缀：标识数仓主题下的子主题分类</p>
                                                    <p>分表前缀：标识数据拆分后的表 </p>
                                                    <p>其他前缀：其他分类</p>
                                                    <p>业务板块：标识业务板块信息</p>
                                                    <p>业务过程：标识业务过程信息</p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p>基础指标类：例如数量、金额、占比、描述等</p>
                                                    <p>日期时间类：描述时间点或时间区间，例如每日、每周、每月、本年、7天内等</p>
                                                    <p>聚合统计类：描述统计方式或聚合操作，例如平均、总和、累计、最大、最小等</p>
                                                    <p>主体类：描述的主体对象，例如客户、营业部、公司等</p>
                                                    <p>业务描述类：描述业务场景的词汇，例如未分配、认购、交易等。</p>
                                                    <p>未知：无法分类的</p>
                                                </div>
                                            )}
                                        </div>
                                    }
                                />
                            ),
                            content: (
                                <Select onChange={this.changeRootType} value={rootInfo.rootType} placeholder='词根类型'>
                                    {typeList.map((item) => {
                                        return (
                                            <Option name={item.name} value={item.id} key={item.id}>
                                                {item.name}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            ),
                            extra: '词根类型用于拼接英文名时，调整词根排列的顺序，确保多个同样词根仅能拼出唯一的英文名',
                        },
                        {
                            label: <TipLabel label='备注' tip='备注用于补充描述词根，例如词根week的描述是：从本周一到今日的累计' />,
                            content: <TextArea style={{ paddingTop: 10 }} maxLength={200} value={rootInfo.remarks} onChange={this.changeDesc} rows={5} placeholder='请输入备注' />,
                        },
                    ])}
                </Form>
            </DrawerLayout>
        )
    }
}
