import DrawerLayout from '@/component/layout/DrawerLayout'
import RenderUtil from '@/utils/RenderUtil'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, message, Select } from 'antd'
import { filterOpts, filterRuleDetail, filterTypes, saveFilterRule } from 'app_api/autoManage'
import React, { Component } from 'react'
import './index.less'
const { TextArea } = Input
const { Option, OptGroup } = Select

export default class AddFilterRule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            addInfo: {
                enable: true,
                filterInfoList: [{ filterType: undefined, filterOpt: undefined, content: '', logicalOpt: 0 }],
            },
            loading: false,
            typeList: [],
            optList: [],
            pageType: 'add',
        }
    }
    openModal = async (data, type) => {
        await this.setState({
            modalVisible: true,
            pageType: type,
            addInfo: { enable: true, filterInfoList: [{ filterType: undefined, filterOpt: undefined, content: '', logicalOpt: 0 }] },
        })
        if (type == 'edit') {
            this.getDetailInfo(data.id)
        }
        this.getFilter()
    }
    getDetailInfo = async (id) => {
        let res = await filterRuleDetail({ id: id })
        if (res.code == 200) {
            res.data.filterInfoList = res.data.filterInfoList ? res.data.filterInfoList : [{ filterType: undefined, filterOpt: undefined, content: '', logicalOpt: 0 }]
            this.setState({
                addInfo: res.data,
            })
        }
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    getFilter = async () => {
        let res = await filterTypes()
        if (res.code == 200) {
            this.setState({
                typeList: res.data,
            })
        }
        let res1 = await filterOpts()
        if (res1.code == 200) {
            this.setState({
                optList: res1.data,
            })
        }
    }
    changeInput = (name, e) => {
        let { addInfo } = this.state
        addInfo[name] = e.target.value
        this.setState({
            addInfo,
        })
    }
    changeStatus = (index, name, e) => {
        let { addInfo } = this.state
        if (name == 'content') {
            addInfo.filterInfoList[index][name] = e.target.value
        } else {
            addInfo.filterInfoList[index][name] = e
        }
        this.setState({
            addInfo,
        })
    }
    changeType = () => {
        let { addInfo } = this.state
        addInfo.filterInfoList[0].logicalOpt = addInfo.filterInfoList[0].logicalOpt == 0 ? 1 : 0
        this.setState({
            addInfo,
        })
    }
    addData = () => {
        let { addInfo } = this.state
        addInfo.filterInfoList.push({ filterType: undefined, filterOpt: undefined, content: '' })
        this.setState({
            addInfo,
        })
    }
    deleteData = (index) => {
        let { addInfo } = this.state
        addInfo.filterInfoList.splice(index, 1)
        this.setState({
            addInfo,
        })
    }
    postData = async () => {
        let { addInfo } = this.state
        this.setState({ loading: true })
        let res = await saveFilterRule(addInfo)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel()
            this.props.search()
        }
    }
    render() {
        const { modalVisible, addInfo, loading, pageType, typeList, optList } = this.state
        let filterFull = true
        addInfo.filterInfoList.map((item) => {
            if (!item.filterType || !item.filterOpt || !item.content) {
                filterFull = false
            }
        })
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'filterSetDrawer',
                    title: pageType == 'add' ? '新增过滤规则' : '编辑过滤规则',
                    width: 960,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: true,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button disabled={!addInfo.name || !filterFull} type='primary' loading={loading} onClick={this.postData}>
                                确定
                            </Button>
                            <Button onClick={this.cancel}>取消</Button>
                        </React.Fragment>
                    )
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <Form className='MiniForm postForm Grid1' style={{ columnGap: 8 }}>
                            {RenderUtil.renderFormItems([
                                {
                                    label: '规则名称',
                                    required: true,
                                    content: (
                                        <Input
                                            placeholder='请输入'
                                            value={addInfo.name}
                                            onChange={this.changeInput.bind(this, 'name')}
                                            maxLength={32}
                                            suffix={<span style={{ color: '#B3B3B3' }}>{addInfo.name ? addInfo.name.length : 0}/32</span>}
                                        />
                                    ),
                                },
                                {
                                    label: '描述',
                                    content: (
                                        <div style={{ position: 'relative' }}>
                                            <TextArea maxLength={128} style={{ height: 52 }} value={addInfo.description} onChange={this.changeInput.bind(this, 'description')} placeholder='请输入' />
                                            <span style={{ color: '#B3B3B3', position: 'absolute', bottom: 8, right: 8 }}>{addInfo.description ? addInfo.description.length : 0}/128</span>
                                        </div>
                                    ),
                                },
                                {
                                    label: '过滤规则，数据表满足以下条件不采集（且或关系可点击切换）',
                                    required: true,
                                    content: (
                                        <div className='filterRuleArea'>
                                            {addInfo.filterInfoList.map((item, index) => {
                                                return (
                                                    <div className='filterRuleItem'>
                                                        <span className='inputLine'></span>
                                                        {index == addInfo.filterInfoList.length - 1 ? null : <span style={{ top: 34 + 49 * index + 'px' }} className='leftLine'></span>}
                                                        <Select
                                                            style={{ width: 240 }}
                                                            onChange={this.changeStatus.bind(this, index, 'filterType')}
                                                            value={item.filterType}
                                                            placeholder='过滤内容'
                                                            dropdownClassName='optGroupDropdown'
                                                        >
                                                            {typeList.map((item) => {
                                                                return (
                                                                    <Option key={item.id} value={item.id}>
                                                                        {item.name}
                                                                    </Option>
                                                                )
                                                            })}
                                                        </Select>
                                                        <Select
                                                            style={{ width: 140, margin: '0 8px' }}
                                                            onChange={this.changeStatus.bind(this, index, 'filterOpt')}
                                                            value={item.filterOpt}
                                                            placeholder='条件'
                                                        >
                                                            {optList.map((item) => {
                                                                return (
                                                                    <Option key={item.id} value={item.id}>
                                                                        {item.name}
                                                                    </Option>
                                                                )
                                                            })}
                                                        </Select>
                                                        <Input
                                                            style={{ width: 405, marginRight: 19 }}
                                                            placeholder='请输入'
                                                            value={item.content}
                                                            onChange={this.changeStatus.bind(this, index, 'content')}
                                                            maxLength={32}
                                                        />
                                                        {index !== 0 ? (
                                                            <span onClick={this.deleteData.bind(this, index)} style={{ color: '#CC0000', cursor: 'pointer' }} className='iconfont icon-lajitong'></span>
                                                        ) : null}
                                                    </div>
                                                )
                                            })}
                                            <span className='typeBtn' onClick={this.changeType}>
                                                {addInfo.filterInfoList[0].logicalOpt ? '或' : '且'}
                                            </span>
                                            <span className='btnLine'></span>
                                            <Button style={{ marginLeft: 24 }} icon={<PlusOutlined />} onClick={this.addData} ghost type='primary'>
                                                添加条件
                                            </Button>
                                        </div>
                                    ),
                                },
                            ])}
                        </Form>
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}
