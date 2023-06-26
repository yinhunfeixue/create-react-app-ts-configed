import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import TipLabel from '@/component/tipLabel/TipLabel'
import { PlusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Input, message, Select, Table, Tooltip } from 'antd'
import { batchSaveRoot, configType, nameExist } from 'app_api/metadataApi'
import Lodash from 'lodash'
import React, { Component } from 'react'

const { Option } = Select

export default class AddDdRootDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rootInfo: [],
            rootCategory: '',
            rootCategoryName: '',
            typeList: [],
            loading: false,
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
                width: 180,
                render: (text, record, index) => {
                    return (
                        <div>
                            <Input
                                placeholder='请输入'
                                value={text}
                                onChange={this.changeName.bind(this, index, 'rootName')}
                                onBlur={this.checkName.bind(this, index)}
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
                width: 240,
                render: (text, record, index) => {
                    return (
                        <div>
                            <Select
                                showArrow={false}
                                style={{ width: '100%' }}
                                disabled={this.state.rootCategory == 'prefixsuffix'}
                                className='tagsSelect'
                                dropdownClassName='hideDropdown'
                                mode='tags'
                                tokenSeparators={[',', '，']}
                                placeholder='请输入描述词，逗号分割'
                                value={text}
                                onChange={this.changeName.bind(this, index, 'descWord')}
                            ></Select>
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
                width: 160,
                render: (text, record, index) => {
                    return (
                        <div className='HControlGroup' style={{ flexWrap: 'nowrap' }}>
                            <Select onChange={this.changeName.bind(this, index, 'rootType')} value={text} placeholder='请选择'>
                                {this.state.typeList.map((item) => {
                                    return (
                                        <Option title={item.name} name={item.name} value={item.id} key={item.id}>
                                            {item.name}
                                        </Option>
                                    )
                                })}
                            </Select>
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
                width: 230,
                render: (text, record, index) => {
                    return (
                        <div>
                            <Input placeholder='请输入' value={text} onChange={this.changeName.bind(this, index, 'remarks')} maxLength={128} />
                        </div>
                    )
                },
            },
            {
                title: '原字段名',
                dataIndex: 'fieldName',
                key: 'fieldName',
                width: 200,
                render: (text) =>
                    text ? (
                        <Tooltip placement='topLeft' title={<span dangerouslySetInnerHTML={{ __html: text }}></span>}>
                            <span dangerouslySetInnerHTML={{ __html: text }}></span>
                        </Tooltip>
                    ) : (
                        <EmptyLabel />
                    ),
            },
            {
                title: '操作',
                dataIndex: 'x',
                key: 'x',
                width: 90,
                render: (text, record, index) => {
                    return (
                        <span>
                            <a onClick={this.addColumn.bind(this, index)} style={{ marginRight: 16 }}>
                                <PlusCircleOutlined />
                            </a>
                            <a onClick={this.deleteColumn.bind(this, index)}>
                                <span className='iconfont icon-lajitong'></span>
                            </a>
                        </span>
                    )
                },
            },
        ]
    }
    openModal = async (data, rootCategory, rootCategoryName) => {
        // 在入口处过滤去重
        let rawData = [...data]
        let dataMap = new Map()
        rawData.forEach((v) => {
            let k = v.descWord.join(',')
            if (!dataMap[k]) {
                dataMap.set(k, v)
            }
        })
        const resData = [...dataMap.values()]

        await this.setState({
            modalVisible: true,
            rootInfo: resData,
            rootCategory,
            rootCategoryName,
        })
        this.getConfigType()
    }
    getConfigType = async () => {
        let res = await configType({ category: this.state.rootCategory })
        if (res.code == 200) {
            this.setState({
                typeList: res.data,
            })
        }
    }
    addColumn = (index) => {
        let { rootInfo, rootCategory } = this.state
        let obj = {
            descWord: [],
            remarks: '',
            rootName: '',
            rootType: rootCategory !== 'prefixsuffix' ? 'unknown' : undefined,
            rootTypeName: rootCategory !== 'prefixsuffix' ? '未知' : '',
            status: 1,
            fieldName: rootInfo[index].fieldName,
        }
        rootInfo.splice(index + 1, 0, obj)
        this.setState({
            rootInfo: rootInfo.concat(),
        })
    }
    deleteColumn = async (index) => {
        let { rootInfo } = this.state
        rootInfo.splice(index, 1)
        this.setState({
            rootInfo: rootInfo.concat(),
        })
    }
    addData = () => {
        let { rootInfo, rootCategory } = this.state
        rootInfo.push({
            descWord: [],
            remarks: '',
            rootName: '',
            rootType: rootCategory !== 'prefixsuffix' ? 'unknown' : undefined,
            rootTypeName: rootCategory !== 'prefixsuffix' ? '未知' : '',
            status: 1,
        })
        this.setState({
            rootInfo: rootInfo.concat(),
        })
    }
    changeName = (index, name, e, node) => {
        const { rootInfo } = this.state
        if (name == 'rootName' || name == 'remarks') {
            rootInfo[index][name] = e.target.value
        } else if (name == 'descWord') {
            rootInfo[index][name] = e
        } else if (name == 'rootType') {
            rootInfo[index].rootType = e
            rootInfo[index].rootTypeName = node.props.name
        }
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
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    postData = async () => {
        const { rootInfo, rootCategory, rootCategoryName } = this.state
        if (!rootCategory || !rootInfo.length) {
            message.info('请填写完整信息')
            return
        }
        let complete = true
        let hasRoot = false
        let array = []
        let descWord = []
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
            descWord.push(...item.descWord)
        })
        array.push(...descWord)
        array = Array.from(new Set(array))
        console.log(descWord, array, 'descWord')
        if (!complete) {
            message.info('请填写完整信息')
            return
        }
        if (hasRoot) {
            message.info('词根开头和结尾不能为下划线')
            return
        }
        if (array.length !== descWord.length) {
            message.info('描述词不能重复')
            return
        }

        this.setState({ loading: true })
        let res = await batchSaveRoot(rootInfo)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel()
            this.props.getNewTable()
        }
    }
    render() {
        const { modalVisible, rootInfo, loading } = this.state
        console.log('rootInfo', rootInfo)
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'addDdRootDrawer',
                    title: '新增词根',
                    width: 1160,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: false,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button type='primary' loading={loading} onClick={this.postData}>
                                确定
                            </Button>
                            <Button onClick={this.cancel}>取消</Button>
                        </React.Fragment>
                    )
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <Table style={{ marginBottom: 0 }} className='dataTableColumn' columns={this.columns} dataSource={Lodash.cloneDeep(rootInfo)} rowKey='id' pagination={false} />
                        <Button style={{ height: 48, boxShadow: 'inset 0px -1px 0px 0px #e6e8ed' }} block type='link' onClick={this.addData} icon={<PlusOutlined />}>
                            添加词根
                        </Button>
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}
