import DrawerLayout from '@/component/layout/DrawerLayout'
import TipLabel from '@/component/tipLabel/TipLabel'
import RenderUtil from '@/utils/RenderUtil'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, message, Radio, Select, Table } from 'antd'
import { batchSaveRoot, configCategory, configType, descExist, nameExist } from 'app_api/metadataApi'
import TagsInput from 'app_page/dama/component/tagsInput'
import Lodash from 'lodash'
import React, { Component } from 'react'

const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input

export default class eastUpload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rootInfo: [],
            inputVisible: false,
            inputValue: '',
            loading: false,
            typeList: [],
            categoryList: [],
            rootCategory: this.props.param.rootCategory,
            rootCategoryName: '',
            showDataType: true,
        }
        this.columns = [
            {
                dataIndex: 'rootName',
                key: 'rootName',
                title: () => {
                    return (
                        <TipLabel
                            label='词根'
                            tip={
                                <div>
                                    <p>词根只能由英文、数字、下划线组成，开头结尾不能为下划线</p>
                                    <p>在同一类别下，词根有且只有唯一</p>
                                </div>
                            }
                        />
                    )
                },
                width: 150,
                render: (text, record, index) => {
                    return (
                        <div>
                            <Input
                                placeholder='请输入词根'
                                value={text}
                                style={{ height: '28px' }}
                                onChange={this.changeName.bind(this, index)}
                                onKeyUp={this.rootNameKeyup.bind(this, index)}
                                maxLength={128}
                            />
                        </div>
                    )
                },
            },
            {
                dataIndex: 'descWord',
                key: 'descWord',
                title: () => {
                    return (
                        <TipLabel
                            label='描述词'
                            tip={<div>{this.state.rootCategory == 'prefixsuffix' ? <p>前缀后缀类别词根无描述词</p> : <p>同一类别下，1个词根可以有多个描述词，但1个描述词只能描述1个词根</p>}</div>}
                        />
                    )
                },
                minWidth: 150,
                render: (text, record, index) => {
                    return (
                        <div className='descInput'>
                            <TagsInput
                                addOnBlur={true}
                                addOnPaste={true}
                                pasteSplit={(data) => data.split(' ')}
                                value={text}
                                onChange={this.changeNewTagInput.bind(this, index)}
                                inputProps={{ placeholder: '请添加描述词，空格区分' }}
                            />
                        </div>
                    )
                },
            },
            {
                dataIndex: 'rootType',
                key: 'rootType',
                title: () => {
                    return <TipLabel label='词根类型' tip='根类型用于拼接英文名时，调整词根排列的顺序，确保多个同样词根仅能拼出唯一的英文名' />
                },
                width: 150,
                render: (text, record, index) => {
                    return (
                        <div className='HControlGroup' style={{ flexWrap: 'nowrap' }}>
                            {this.state.showDataType ? (
                                <Select onChange={this.changeRootType.bind(this, index)} onBlur={this.onColumnTypeBlur.bind(this, index)} value={text} placeholder='请选择词根类型'>
                                    {this.state.typeList.map((item) => {
                                        return (
                                            <Option title={item.name} name={item.name} value={item.id} key={item.id}>
                                                {item.name}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            ) : null}
                            <TipLabel
                                tip={
                                    <div>
                                        {this.state.rootCategory == 'prefixsuffix' ? (
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
                        </div>
                    )
                },
            },
            {
                dataIndex: 'remarks',
                key: 'remarks',
                title: () => {
                    return <TipLabel label='备注' tip='备注用于补充描述词根，例如词根week的描述是：从本周一到今日的累计' />
                },
                minWidth: 150,
                render: (text, record, index) => {
                    return (
                        <div>
                            <Input
                                placeholder='请输入备注'
                                value={text}
                                style={{ height: '28px' }}
                                onChange={this.changeDesc.bind(this, index)}
                                onBlur={this.onColumnTypeBlur.bind(this, index)}
                                maxLength={128}
                            />
                        </div>
                    )
                },
            },
            {
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                width: 70,
                render: (text, record, index) => {
                    return <a onClick={this.deleteColumn.bind(this, index)}>删除</a>
                },
            },
        ]
    }
    componentWillMount = async () => {
        const { rootInfo } = this.state
        if (this.props.param.lackedRootsArr) {
            this.props.param.lackedRootsArr.map((item) => {
                rootInfo.push({
                    rootName: item,
                    descWord: [],
                    descWordTip: '',
                    rootCategory: this.props.param.rootCategory,
                    rootType: this.props.param.rootCategory !== 'prefixsuffix' ? 'unknown' : undefined,
                    rootTypeName: this.props.param.rootCategory !== 'prefixsuffix' ? '未知' : '',
                })
            })
            await this.setState({
                rootInfo,
            })
        }
        this.getConfigCategory()
        this.getConfigType()
    }

    handleInputChange = (e) => {
        this.setState({ inputValue: e.target.value })
    }
    changeName = (index, e) => {
        const { rootInfo } = this.state
        rootInfo[index].rootName = e.target.value
        this.setState({
            rootInfo,
        })
    }
    rootNameKeyup = (index) => {
        const { rootInfo } = this.state
        if (rootInfo[index].rootName[0] == '_') {
            rootInfo[index].rootName = rootInfo[index].rootName.substr(1, rootInfo[index].rootName.length)
        }
        rootInfo[index].rootName = rootInfo[index].rootName.replace(/[^\w_]/g, '')
        this.setState({
            rootInfo,
        })
    }
    checkName = async (index, e) => {
        const { rootInfo, rootCategory } = this.state
        let query = {
            category: rootCategory,
            id: rootInfo[index].id,
            name: rootInfo[index].rootName,
        }
        let res = await nameExist(query)
        if (res.code == 200) {
            if (res.data) {
                message.error('词根已存在')
            } else {
                delete rootInfo[index].editable
                this.setState({
                    rootInfo,
                })
            }
        }
    }
    changeDesc = (index, e) => {
        const { rootInfo } = this.state
        rootInfo[index].remarks = e.target.value
        this.setState({
            rootInfo,
        })
    }
    changeRootType = (index, e, node) => {
        const { rootInfo } = this.state
        rootInfo[index].rootType = e
        rootInfo[index].rootTypeName = node.props.name
        this.setState({
            rootInfo,
        })
    }
    changeRootCategory = async (e, node) => {
        let { rootCategory, rootCategoryName, rootInfo } = this.state
        rootInfo.map((item) => {
            if (e !== 'prefixsuffix') {
                item.rootType = 'unknown'
                item.rootTypeName = '未知'
            } else {
                item.rootType = undefined
                item.rootTypeName = ''
                console.log(item.editable, 'editable+++')
                item.descWord = []
                item.descWordTip = ''
                if (item.editable == 2) {
                    delete item.editable
                }
            }
        })
        rootCategory = e
        rootCategoryName = node.props.name
        await this.setState({
            rootCategory,
            rootCategoryName,
            rootInfo,
        })
        this.getConfigType()
    }
    getConfigType = async () => {
        this.setState({ showDataType: false })
        let res = await configType({ category: this.state.rootCategory })
        if (res.code == 200) {
            this.setState({
                typeList: res.data,
            })
        }
        this.setState({ showDataType: true })
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
        this.props.remove('批量新增词根')
        this.props.addTab('词根库')
    }
    postData = async () => {
        const { rootInfo, rootCategory, rootCategoryName } = this.state
        const { onSuccess } = this.props
        console.log('postData', rootInfo)
        if (!rootCategory || !rootInfo.length) {
            message.info('请填写完整信息')
            return
        }
        let complete = true
        let hasRoot = false
        rootInfo.map((item) => {
            item.rootCategory = rootCategory
            item.rootCategoryName = rootCategoryName
            if (!item.rootName || !item.rootCategory) {
                complete = false
            }
            if (item.rootCategory !== 'prefixsuffix' && !item.descWord.length) {
                complete = false
            }
            if (item.rootName[item.rootName.length - 1] == '_') {
                hasRoot = true
            }
        })
        if (!complete) {
            message.info('请填写完整信息')
            return
        }
        if (hasRoot) {
            message.info('词根开头和结尾不能为下划线')
            return
        }

        this.setState({ loading: true })
        let res = await batchSaveRoot(rootInfo)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
            onSuccess()
        }
    }
    addData = async () => {
        let { rootInfo, rootCategory } = this.state
        rootInfo.push({
            descWord: [],
            descWordTip: '',
            remarks: '',
            rootName: '',
            rootType: rootCategory !== 'prefixsuffix' ? 'unknown' : undefined,
            rootTypeName: rootCategory !== 'prefixsuffix' ? '未知' : '',
            status: 1,
            ids: Math.random(),
        })
        await this.setState({
            rootInfo: rootInfo.concat(),
        })
    }
    showSelect = (record, index, num) => {
        if (this.state.rootCategory == 'prefixsuffix' && num == 1) {
            return
        }
        let { rootInfo } = this.state
        let params = { ...record }
        if (params.editable) {
            delete params.editable
        }
        let tableData = [...rootInfo]
        tableData = tableData.map((value) => {
            if (value.editable) {
                delete value.editable
            }
            return value
        })
        switch (num) {
            case '0':
                params.editable = 1
                break
            case '1':
                params.editable = 2
                break
            case '2':
                params.editable = 3
                break
            case '3':
                params.editable = 4
                break
            case '4':
                params.editable = 5
                break
            default:
                break
        }
        tableData[index].editable = params.editable
        console.log(tableData, 'tableData++++')
        this.setState({ rootInfo: [...tableData] })
    }
    onColumnTypeBlur = (index) => {
        let { rootInfo } = this.state
        delete rootInfo[index].editable
        this.setState({
            rootInfo,
        })
    }
    deleteColumn = async (index) => {
        let { rootInfo } = this.state
        rootInfo.splice(index, 1)
        this.setState({
            rootInfo: rootInfo.concat(),
        })
    }
    changeNewTagInput = async (index, e, node) => {
        console.log(node, 'node+++')
        let { rootInfo, rootCategory } = this.state
        var regTextChar = /^([\w\u4E00-\u9FA5_\-]+)+$/
        if (!regTextChar.test(e[e.length - 1])) {
            message.error('不允许输入特殊字符')
            return
        }
        if (e.length < rootInfo[index].descWord.length) {
            console.log('deleteTag')
            rootInfo[index].descWord = e
            rootInfo[index].descWordTip = e.join('、')
            this.setState({ rootInfo })
        } else {
            let query = {
                category: rootCategory,
                desc: e[e.length - 1],
            }
            let res = await descExist(query)
            if (res.code == 200) {
                if (res.data) {
                    message.error('描述词已存在')
                } else {
                    let array = []
                    rootInfo.map((item) => {
                        item.descWord &&
                            item.descWord.map((item1) => {
                                array.push(item1)
                            })
                    })
                    if (query.desc && array.indexOf(query.desc) == -1) {
                        rootInfo[index].descWord = e
                        rootInfo[index].descWordTip = e.join('、')
                        this.setState({ rootInfo })
                    } else {
                        message.error('描述词已存在')
                    }
                }
            }
        }
        console.log(e, 'newTagValue +++++')
    }

    render() {
        const { rootInfo, inputVisible, inputValue, loading, categoryList, typeList, rootCategory } = this.state
        const { visible, onClose } = this.props
        console.log('rootInfo', rootInfo)
        return (
            <DrawerLayout
                drawerProps={{
                    title: '批量新增词根',
                    visible,
                    onClose,
                    width: 960,
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
                <Form>
                    {RenderUtil.renderFormItems([
                        {
                            label: '词根类别',
                            required: true,
                            content: (
                                <Select onChange={this.changeRootCategory} value={rootCategory} placeholder='词根类别'>
                                    {categoryList.map((item) => {
                                        return (
                                            <Option name={item.name} value={item.id} key={item.id}>
                                                {item.name}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            ),
                            extra: '系统支持多套词根类别，适用于不同的业务系统，新的类别请联系管理员添加',
                        },
                        {
                            label: '',
                            content: (
                                <React.Fragment>
                                    <Table
                                        className='dataTableColumn'
                                        columns={this.columns}
                                        dataSource={Lodash.cloneDeep(rootInfo)}
                                        rowKey='id'
                                        bordered
                                        rowClassName={() => 'editable-row'}
                                        pagination={false}
                                    />
                                    <Button style={{ marginTop: 24 }} block type='link' onClick={this.addData} icon={<PlusOutlined />}>
                                        添加
                                    </Button>
                                </React.Fragment>
                            ),
                        },
                    ])}
                </Form>
            </DrawerLayout>
        )
    }
}
