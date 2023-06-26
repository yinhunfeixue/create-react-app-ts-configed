import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import LevelTag from '@/component/LevelTag'
import ModuleTitle from '@/component/module/ModuleTitle'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Cascader, Divider, Form, message, Select } from 'antd'
import { bindEigenWithColumn, eigenList, securityTree } from 'app_api/dataSecurity'
import React, { Component } from 'react'
import '../index.less'

export default class TraitDetailDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            detailInfo: {
                hasTrait: true,
            },
            categoryId: [],
            categoryTreeData: [],
            traitList: [],
            btnLoading: false,
            isDel: false,
        }
    }
    openModal = async (data) => {
        let { detailInfo, categoryId } = this.state
        detailInfo = { ...data }
        detailInfo.tagName = detailInfo.senName
        detailInfo.hasTrait = detailInfo.eigenId ? true : false
        detailInfo.classIds = detailInfo.classIds ? detailInfo.classIds : []
        categoryId = detailInfo.classIds
        await this.setState({
            modalVisible: true,
            detailInfo,
            traitList: [],
            categoryId,
            // 进来重置删除状态
            isDel: false,
        })
        this.getTreeData()
        if (detailInfo.hasTrait) {
            this.getTraitList()
        }
    }
    getTreeData = async () => {
        let res = await securityTree()
        if (res.code == 200) {
            this.setState({
                categoryTreeData: res.data.children,
            })
        }
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    changeType = async (name, e, node) => {
        let { detailInfo } = this.state
        if (name == 'categoryId') {
            await this.setState({
                [name]: e,
            })
        } else {
            detailInfo[name] = e
            detailInfo.level = node.props.item.level
            detailInfo.tagName = node.props.item.tagName
            this.setState({
                detailInfo,
            })
        }

        console.log(detailInfo.eigenId, 'detailInfo.eigenId')
        if (name == 'categoryId') {
            this.getTraitList()
        }
    }
    getTraitList = async () => {
        let { categoryId } = this.state
        let res = await eigenList({ classId: categoryId[categoryId.length - 1] })
        if (res.code == 200) {
            this.setState({
                traitList: res.data,
            })
        }
    }
    deleteTrait = () => {
        let { detailInfo } = this.state
        this.setState({
            isDel: true,
            categoryId: [],
            detailInfo: {
                hasTrait: true,
            },
        })
    }
    addTrait = () => {
        let { detailInfo } = this.state
        detailInfo.hasTrait = true
        this.setState({
            detailInfo,
            // 重置删除状态
            isDel: false,
        })
        this.getTreeData()
    }
    postData = async () => {
        let { detailInfo, isDel } = this.state
        let query = {
            columnId: detailInfo.columnId,
            eigenId: isDel ? undefined : detailInfo.eigenId,
        }
        if (!(query.eigenId || (isDel && detailInfo.eigenId))) {
            this.cancel()
            return
        }
        this.setState({ btnLoading: true })
        let res = await bindEigenWithColumn(query)
        this.setState({ btnLoading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel()
            this.props.search()
        }
    }
    render() {
        const { modalVisible, detailInfo, categoryTreeData, categoryId, traitList, btnLoading, isDel } = this.state
        const filter = (inputValue, path) => path.some((option) => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)

        const showTrait = detailInfo.hasTrait && !isDel
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'traitDetailDrawer',
                    title: '分类特征1',
                    width: 480,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: false,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button loading={btnLoading} onClick={this.postData} type='primary'>
                                确定
                            </Button>
                            <Button onClick={this.cancel}>取消</Button>
                        </React.Fragment>
                    )
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <div className='titleValue'>{detailInfo.columnName}</div>
                        <div className='path'>来源路径：{detailInfo.path}</div>
                        <Divider />
                        {showTrait ? (
                            <div>
                                <ModuleTitle title='特征信息' />
                                <Form className='EditMiniForm Grid1'>
                                    {RenderUtil.renderFormItems([
                                        {
                                            label: '分类路径',
                                            required: true,
                                            content: (
                                                <Cascader
                                                    allowClear={false}
                                                    showSearch={{ filter }}
                                                    expandTrigger='hover'
                                                    fieldNames={{ label: 'name', value: 'id' }}
                                                    value={categoryId}
                                                    options={categoryTreeData}
                                                    style={{ width: '100%' }}
                                                    onChange={this.changeType.bind(this, 'categoryId')}
                                                    popupClassName='searchCascader'
                                                    placeholder='请选择'
                                                    className='dataDistributionDropdown'
                                                    getPopupContainer={() => document.body}
                                                />
                                            ),
                                        },
                                        {
                                            label: '特征选择',
                                            content: (
                                                <div>
                                                    <Select onChange={this.changeType.bind(this, 'eigenId')} value={detailInfo.eigenId} placeholder='请选择'>
                                                        {traitList.map((item) => {
                                                            return (
                                                                <Select.Option item={item} title={item.eigenName} key={item.id} value={item.id}>
                                                                    {item.eigenName}
                                                                </Select.Option>
                                                            )
                                                        })}
                                                    </Select>
                                                    {detailInfo.eigenId ? (
                                                        <div style={{ marginTop: 4, color: '#606366' }}>
                                                            <span style={{ marginRight: 24 }}>
                                                                安全等级：
                                                                <LevelTag type='text' value={detailInfo.level} />
                                                            </span>
                                                            <span>敏感标签：{detailInfo.tagName || <EmptyLabel />}</span>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            ),
                                        },
                                    ])}
                                </Form>
                                <div style={{ marginTop: 24 }}>
                                    <a onClick={this.deleteTrait}>
                                        <span style={{ marginRight: 4 }} className='iconfont icon-lajitong'></span>
                                        删除特征
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div style={{ paddingTop: 50, textAlign: 'center' }}>
                                <span style={{ color: '#9EA3A8' }}>暂未有特征信息，可点击 </span>
                                <a onClick={this.addTrait}>添加特征</a>
                            </div>
                        )}
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}
