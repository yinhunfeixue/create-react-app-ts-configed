import DrawerLayout from '@/component/layout/DrawerLayout'
import RenderUtil from '@/utils/RenderUtil'
import { LinkOutlined } from '@ant-design/icons'
import { Button, Form, message, Select } from 'antd'
import { dimassetsInternalColumn, dimassetsInternalInfo, dimassetsRelateAssets, dimassetsRelationSave } from 'app_api/metadataApi'
import React, { Component } from 'react'
import './addRelation.less'

export default class AddRelation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            loading: false,
            relateAssets: [],
            rightAssets: [],
            assetInfo: { assetsId: this.props.location.state.id },
            leftColumns: [],
            rightColumns: [],
        }
    }
    componentDidMount = () => {}
    getRelateAssets = async () => {
        let { assetInfo } = this.state
        let query = {
            assetsId: this.props.location.state.id,
            leftAssets: true,
        }
        let res = await dimassetsRelateAssets(query)
        if (res.code == 200) {
            if (res.data.length) {
                if (!this.props.canEdit) {
                    assetInfo.leftBusinessId = res.data[0].id
                    await this.setState({
                        assetInfo,
                    })
                }
                this.getRightAssets()
                this.getLeftColumns()
            }
            this.setState({
                relateAssets: res.data,
            })
        }
    }
    openModal = async () => {
        if (this.props.canEdit) {
            this.setState({
                modalVisible: true,
            })
            this.getDetail()
        } else {
            await this.setState({
                modalVisible: true,
                relateAssets: [],
                rightAssets: [],
                assetInfo: { assetsId: this.props.location.state.id },
                leftColumns: [],
                rightColumns: [],
            })
        }
        this.getRelateAssets()
    }
    getDetail = async () => {
        let query = {
            assetsId: this.props.location.state.id,
            leftColumnId: this.props.leftColumnId,
            relationId: this.props.relationId,
        }
        let res = await dimassetsInternalInfo(query)
        if (res.code == 200) {
            await this.setState({
                assetInfo: res.data,
            })
            this.getRelateAssets()
            this.getRightColumns()
        }
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    postData = async () => {
        this.setState({ loading: true })
        let res = await dimassetsRelationSave(this.state.assetInfo)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel()
            this.props.addRelation()
        }
    }
    onChangeLeftAsset = async (e) => {
        let { assetInfo } = this.state
        assetInfo.leftBusinessId = e
        assetInfo.rightBusinessId = undefined
        assetInfo.leftColumnId = undefined
        assetInfo.rightColumnId = undefined
        await this.setState({
            assetInfo,
            rightAssets: [],
            leftColumns: [],
            rightColumns: [],
        })
        this.getRightAssets()
        this.getLeftColumns()
    }
    onChangeRightAsset = async (e) => {
        let { assetInfo } = this.state
        assetInfo.rightBusinessId = e
        assetInfo.rightColumnId = undefined
        await this.setState({
            assetInfo,
            rightColumns: [],
        })
        this.getRightColumns()
    }
    onChangeLeftColumn = (e) => {
        let { assetInfo } = this.state
        assetInfo.leftColumnId = e
        this.setState({
            assetInfo,
        })
    }
    onChangeRightColumn = (e) => {
        let { assetInfo } = this.state
        assetInfo.rightColumnId = e
        this.setState({
            assetInfo,
        })
    }
    getRightAssets = async () => {
        let query = {
            assetsId: this.props.location.state.id,
            ignoreAssetsId: this.state.assetInfo.leftBusinessId,
            leftAssets: false,
        }
        let res = await dimassetsRelateAssets(query)
        if (res.code == 200) {
            this.setState({
                rightAssets: res.data,
            })
        }
    }
    getLeftColumns = async () => {
        let query = {
            assetsId: this.state.assetInfo.leftBusinessId,
            modelAssetsId: this.props.location.state.id,
        }
        let res = await dimassetsInternalColumn(query)
        if (res.code == 200) {
            this.setState({
                leftColumns: res.data,
            })
        }
    }
    getRightColumns = async () => {
        let query = {
            assetsId: this.state.assetInfo.rightBusinessId,
            modelAssetsId: this.props.location.state.id,
        }
        let res = await dimassetsInternalColumn(query)
        if (res.code == 200) {
            this.setState({
                rightColumns: res.data,
            })
        }
    }

    render() {
        const { modalVisible, loading, relateAssets, assetInfo, rightAssets, leftColumns, rightColumns } = this.state

        return (
            <DrawerLayout
                drawerProps={{
                    title: this.props.canEdit ? '编辑关联维度' : '添加关联维度',
                    visible: modalVisible,
                    onClose: this.cancel,
                    width: 700,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button
                                disabled={!assetInfo.leftBusinessId || !assetInfo.rightBusinessId || !assetInfo.leftColumnId || !assetInfo.rightColumnId}
                                onClick={this.postData}
                                key='submit'
                                type='primary'
                                loading={loading}
                            >
                                确定
                            </Button>
                            <Button key='back' onClick={this.cancel}>
                                取消
                            </Button>
                        </React.Fragment>
                    )
                }}
            >
                {modalVisible && (
                    <div className='addRelation'>
                        <div className='addRelationModule'>
                            <h3>当前维度资产中选择需要被关联的维度</h3>
                            <Form className='MiniForm Grid1'>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '维度信息',
                                        content: (
                                            <Select placeholder='请选择维度信息' disabled={this.props.canEdit} value={assetInfo.leftBusinessId} onChange={this.onChangeLeftAsset}>
                                                {relateAssets.map((item) => {
                                                    return (
                                                        <Select.Option title={item.name + ' ' + item.englishName} value={item.id} key={item.id}>
                                                            {item.name}
                                                            <span style={{ color: '#b3b3b3', marginLeft: 8 }}>{item.englishName}</span>
                                                        </Select.Option>
                                                    )
                                                })}
                                            </Select>
                                        ),
                                    },
                                    {
                                        label: '字段信息',
                                        content: (
                                            <Select placeholder='选择关联字段' value={assetInfo.leftColumnId} onChange={this.onChangeLeftColumn}>
                                                {leftColumns.map((item) => {
                                                    return (
                                                        <Select.Option title={item.name + ' ' + item.englishName} value={item.id} key={item.id}>
                                                            {item.name}
                                                            <span style={{ color: '#b3b3b3', marginLeft: 8 }}>{item.englishName}</span>
                                                            {item.primaryKey ? <span style={{ color: '#1890ff', marginLeft: 8 }}>主键</span> : null}
                                                        </Select.Option>
                                                    )
                                                })}
                                            </Select>
                                        ),
                                    },
                                ])}
                            </Form>
                        </div>
                        <LinkOutlined />
                        <div className='addRelationModule'>
                            <h3>添加关联维度信息</h3>
                            <Form className='MiniForm Grid1'>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '维度信息',
                                        content: (
                                            <Select placeholder='请选择维度信息' disabled={this.props.canEdit} value={assetInfo.rightBusinessId} onChange={this.onChangeRightAsset}>
                                                {rightAssets.map((item) => {
                                                    return (
                                                        <Select.Option title={item.name + ' ' + item.englishName} value={item.id} key={item.id}>
                                                            {item.name}
                                                            <span style={{ color: '#b3b3b3', marginLeft: 8 }}>{item.englishName}</span>
                                                        </Select.Option>
                                                    )
                                                })}
                                            </Select>
                                        ),
                                    },
                                    {
                                        label: '字段信息',
                                        content: (
                                            <Select placeholder='选择关联字段' value={assetInfo.rightColumnId} onChange={this.onChangeRightColumn}>
                                                {rightColumns.map((item) => {
                                                    return (
                                                        <Select.Option title={item.name + ' ' + item.englishName} value={item.id} key={item.id}>
                                                            {item.name}
                                                            <span style={{ color: '#b3b3b3', marginLeft: 8 }}>{item.englishName}</span>
                                                            {item.primaryKey ? <span style={{ color: '#1890ff', marginLeft: 8 }}>主键</span> : null}
                                                        </Select.Option>
                                                    )
                                                })}
                                            </Select>
                                        ),
                                    },
                                ])}
                            </Form>
                        </div>
                    </div>
                )}
            </DrawerLayout>
        )
    }
}
