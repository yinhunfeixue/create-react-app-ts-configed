import EmptyLabel from '@/component/EmptyLabel'
import DrawerLayout from '@/component/layout/DrawerLayout'
import RichTableLayout from '@/component/layout/RichTableLayout'
import SliderLayout from '@/component/layout/SliderLayout'
import { Button, Checkbox, Form, Input, message, Select, Switch, Tooltip } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { deleteSystem, deleteTreeNode, getNodeSourceCountByNodeId } from 'app_api/systemManage'
import { createTag, getTagTypeAppliableScene, getTagTypeManagementTree, getTagValueListByType, saveTagTypeHandle, tagModifyHandle } from 'app_api/tagManageApi'
import EditTree from 'app_page/dama/component/EditTree'
import TagsInput from 'app_page/dama/component/tagsInput'
import moment from 'moment'
import 'moment/locale/zh-cn'
import React from 'react'
import PermissionWrap from '@/component/PermissionWrap'
import './classManage.less'

const { Option } = Select
const CheckboxGroup = Checkbox.Group

const { TextArea } = Input

class TagCategory extends React.Component {
    constructor() {
        super()
        this.state = {
            treeData: [],
            addTypeModalVisible: false,
            // addSystemModalVisible: false,
            type: 'add',
            loading: false,
            listLoading: false,
            codeRule: false, // 编号是否重复
            nameRule: false, // 名称是否重复
            newTagList: [], // 创建标签list
            newTagValue: [], // 创建标签值
            addTypeInfo: {
                tagTypeDesc: '',
                tagTypeName: '',
                contextIds: [],
            },
            tagTypeAppliableSceneDatList: [
                { label: 'Apple', value: 'Apple' },
                { label: 'Pear', value: 'Pear' },
                { label: 'Orange', value: 'Orange' },
            ],
            checkedList: [],
            tablePagination: {
                total: '',
                page: 1,
                page_size: 20,
                pageSize: 20,
                paginationDisplay: 'none',
                // more: true
            },
            tableData: [],
            addTagModalVisible: false,
            addTagOperate: 'add',
            newTagValue: [], // 创建标签值
            defaultTreeSelectedKeys: [],
            selectedTagCategory: {},
            tagTypeId: '',
        }

        this.paramOption = {} // 表格参数
        this.columns = [
            {
                dataIndex: 'tagValueName',
                key: 'tagValueName',
                title: '标签名称',
                width: '24%',
                render: (text, record, index) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                dataIndex: 'tagValueCreator',
                key: 'tagValueCreator',
                title: '创建人',
                width: '22%',
                render: (text) => {
                    return text ? text : <EmptyLabel />
                },
            },
            {
                dataIndex: 'createTime',
                key: 'createTime',
                title: '创建时间',
                width: '28%',
                render: (text) => {
                    return text ? moment(text).format('YYYY-MM-DD HH:mm') : <EmptyLabel />
                },
            },
            {
                dataIndex: 'operate',
                key: 'operate',
                title: ' 操作',
                width: '20%',
                render: (text, record, index) => {
                    return (
                        <PermissionWrap funcCode='/md/tags/manage/switch'>
                            <Switch checkedChildren='启用' unCheckedChildren='禁用' onClick={this.onSwitchChange.bind(this, record)} checked={record.status && record.status == 'VALID'} />
                        </PermissionWrap>
                    )
                },
            },
        ]

        this.filter = {
            // addBtnOption: {
            //     show: true,
            //     clickFunction: this.addBtn,
            //     // authId: 'account:role:create',
            //     text: '新增标签'
            // },
            // editBtnOption: {
            //     show: true,
            //     clickFunction: this.editBtn,
            //     authId: 'systemManage:user:role:modify'
            // },
            // cancelBtnOption: {
            //     show: true,
            //     clickFunction: this.delBtn,
            //     authId: 'account:role:delete'
            // },
            // // lookBtnOption: {
            // //     show: true,
            // //     clickFunction: this.lookUser
            // // },
            // otherBtn: (<span>
            //     <Button onClick={this.authConfig} authId='system:role_menu:update'>权限配置</Button>
            //     <Button onClick={this.userConfig} authId='systemManage:user:profile'>用户配置</Button>
            // </span>)
        }
    }
    componentDidMount = () => {
        this.init()
    }

    init = async () => {
        await this.getCategoryData()
        this.getTagTypeAppliableSceneData()
    }

    addBtn = () => {
        // let param = {}
        // param.type = 'add'
        // this.props.addTab('添加角色', param)
        this.setState({
            addTagModalVisible: true,
            addTagOperate: 'add',
        })
    }

    // 启用禁用操作
    onSwitchChange = async (record, checked, e) => {
        e.stopPropagation()
        let eData = {
            tagValueId: record.tagValueId,
            status: checked ? 'VALID' : 'INVALID',
        }
        let editStatus = await this.tagEdit(eData)

        if (editStatus) {
            this.controller.refresh()
            // 数据修改成功后，更新标签列表
            // let tableData = this.state.tableData
            // let dataList = []
            // tableData.map((item) => {
            //     if (item.tagValueId == record.tagValueId) {
            //         item.status = checked ? 'VALID' : 'INVALID'
            //         // return item
            //     }

            //     dataList.push(item)
            // })

            // this.setState({
            //     tableData: dataList,
            // })
        }
    }

    tagEdit = async (eData) => {
        let params = {
            tagValues: [eData],
        }
        let res = await tagModifyHandle(params)
        if (res.code == 200) {
            message.success(res.msg)
            return true
        }
        return false
    }

    getCategoryData = async () => {
        this.setState({
            treeData: [],
            listLoading: true,
        })
        let params = {
            // code: 'ZT005'
        }
        let res = await getTagTypeManagementTree(params)
        if (res.code == 200) {
            res.data.level = 0
            res.data = this.getColor(res.data)
            let defaultTreeSelectedKeys = res['data'] && res['data']['children'] ? [res['data']['children'][0]['id']] : []
            let selectedTagCategory = res['data'] && res['data']['children'] ? res['data']['children'][0] : {}
            console.log(res.data, 'depth')
            this.setState(
                {
                    treeData: [res.data],
                    defaultTreeSelectedKeys,
                    selectedTagCategory,
                    tagTypeId: selectedTagCategory.id || '',
                },
                () => {
                    // this.getTagList()
                    this.search()
                }
            )
        }
        this.setState({ listLoading: false })
    }

    getColor = (data) => {
        data.children.map((item, index) => {
            item.color = index + 1
            if (item.children) {
                item.children.map((value) => {
                    value.color = item.color
                })
            }
        })
        return data
    }

    editData = async (req) => {}
    deleteData = (data) => {
        if (data.children.length) {
            message.error('该分类下已有系统节点，无法删除')
            return
        }
        getNodeSourceCountByNodeId({ id: data.id }).then((resp) => {
            if (resp.code == 200) {
                if (resp.data) {
                    message.error('该节点下已有资源，无法删除')
                } else {
                    // 系统节点需先删除系统
                    if (data.level == 2) {
                        deleteSystem({ ids: [data.objectId] }).then((res) => {
                            if (res.code == 200) {
                                deleteTreeNode({ id: data.id }).then((response) => {
                                    if (response.code == 200) {
                                        message.success(response.msg)
                                        if (this.props.location.state.callback) {
                                            this.props.location.state.callback()
                                        }
                                        this.getCategoryData()
                                    } else {
                                        message.error(response.msg)
                                    }
                                })
                            }
                        })
                    } else {
                        deleteTreeNode({ id: data.id }).then((response) => {
                            if (response.code == 200) {
                                message.success(response.msg)
                                if (this.props.location.state.callback) {
                                    this.props.location.state.callback()
                                }
                                this.getCategoryData()
                            } else {
                                message.error(response.msg)
                            }
                        })
                    }
                }
            }
        })
    }
    getNode = (data) => {
        console.log('data', data)
    }
    openAddModal = (data, type) => {
        console.log(data, type)
        this.resetForm()
        let addTypeInfo = this.state.addTypeInfo

        if (data.level == 0) {
            // 根节点只支持添加子节点
            addTypeInfo = {
                // description: '',
                tagTypeDesc: '',
                tagTypeName: '',
                contextIds: [],
            }
        } else {
            let contextIds = []
            data.appliableScene &&
                data.appliableScene.map((d) => {
                    contextIds.push(d.id)
                })
            addTypeInfo.tagTypeName = data.name
            addTypeInfo.tagTypeDesc = data.desc
            addTypeInfo.contextIds = contextIds
            if (type == 'edit') {
                addTypeInfo.tagTypeId = data.id
            }
        }

        this.setState({
            addTypeModalVisible: true,
            type,
            addTypeInfo,
        })

        // if (data.level == 0) {
        //     addTypeInfo.parentId = 0
        //     addTypeInfo.treeId = data.id
        //     addTypeInfo.type = 1
        //     this.setState({
        //         addTypeModalVisible: true,
        //         type,
        //         addTypeInfo
        //     })
        // } else {
        //     if (type == 'edit') {
        //         addTypeInfo.code = data.code
        //         addTypeInfo.name = data.name
        //         addTypeInfo.id = data.id
        //         addTypeInfo.level = data.level
        //         addTypeInfo.description = data.description
        //         addTypeInfo.treeId = data.treeId
        //         addTypeInfo.parentId = data.parentId
        //         this.setState({
        //             addTypeModalVisible: true,
        //             type,
        //             addTypeInfo
        //         })
        //     } else {
        //         addTypeInfo.parentId = data.id
        //         addTypeInfo.treeId = data.treeId
        //         this.setState({
        //             addTypeModalVisible: true,
        //             type,
        //             addTypeInfo
        //         })
        //     }
        // }
    }
    resetForm = () => {
        const { addTypeInfo } = this.state
        addTypeInfo.code = ''
        addTypeInfo.name = ''
        addTypeInfo.tagTypeDesc = ''
        this.setState({
            addTypeInfo,
            // codeRule: false,
            // nameRule: false
        })
    }
    cancel = () => {
        this.setState({
            addTypeModalVisible: false,
            // addSystemModalVisible: false
        })
    }
    // getSystemData = async (data, parentId) => {
    //     console.log(data, 'getSystemData', parentId)
    //     const { addTypeInfo } = this.state
    //     // addTypeInfo.code = data.code
    //     addTypeInfo.name = data.name
    //     addTypeInfo.parentId = parentId
    //     // addTypeInfo.id = data.id
    //     addTypeInfo.objectId = data.id
    //     addTypeInfo.objectType = 2
    //     addTypeInfo.type = 2
    //     await this.setState({ addTypeInfo })
    //     this.postAddType()
    // }
    postAddType = async () => {
        const { addTypeInfo, type } = this.state
        this.setState({ loading: true })
        let res
        if (type == 'add') {
            res = await saveTagTypeHandle(addTypeInfo)
        } else {
            res = await saveTagTypeHandle({ ...addTypeInfo, tagTypeId: selectedTagCategory.id })
        }
        if (res.code == 200) {
            message.success(res.msg ? res.msg : '操作成功')
            // if (this.props.location.state.callback) {
            //     this.props.location.state.callback()
            // }
            this.getCategoryData()
            this.cancel()
        }
        this.setState({ loading: false })
    }
    // changeCode = async (e) => {
    //     console.log(e)
    //     const { addTypeInfo } = this.state
    //     addTypeInfo.code = e.target.value || e.target.value == 0 ? e.target.value.replace(/[^\d]/g, '') : ''
    //     this.setState({ addTypeInfo })
    // }
    // checkCode = async () => {
    //     const { addTypeInfo } = this.state
    //     let params = {
    //         code: addTypeInfo.code,
    //         parentId: addTypeInfo.parentId,
    //         treeId: addTypeInfo.treeId
    //     }
    //     let res = await checkNodeCode(params)
    //     if (res.code == 200) {
    //         this.setState({ codeRule: res.data })
    //     }
    // }
    changeName = async (e) => {
        console.log(e)
        const { addTypeInfo } = this.state
        addTypeInfo.tagTypeName = e.target.value
        this.setState({ addTypeInfo })
    }

    changeDesc = async (e) => {
        console.log(e)
        const { addTypeInfo } = this.state
        addTypeInfo.tagTypeDesc = e.target.value
        this.setState({ addTypeInfo })
    }

    checkName = async () => {
        // const { addTypeInfo, type } = this.state
        // let params = {
        //     name: addTypeInfo.tagTypeName,
        // }
        // if (type == 'edit') {
        //     params.tagTypeId = addTypeInfo.tagTypeId
        // }
        // let res = await checkNodeName(params)
        // if (res.code == 200) {
        //     this.setState({ nameRule: res.data })
        // }
    }
    onExpand = (id) => {
        // this.ThreedReportTree.treeExpand(id)
        // console.log(this.state.treeData, 'this.state.treeData')
    }
    expandNode = (id) => {
        this.tree.ExpandTree(id)
    }

    getTableData = (param) => {}

    onSelect = (selectedKeys, e) => {
        console.log(selectedKeys, e)
        let selectedTagCategory = {}
        if (e.selectedNodes.length > 0) {
            let selectedNode = e.selectedNodes[0]
            selectedTagCategory = selectedNode.dataRef
            console.log(selectedTagCategory)
        }

        this.setState(
            {
                selectedTagCategory,
                tagTypeId: selectedTagCategory.id || '',
            },
            () => {
                // this.getTagList()
                this.search()
            }
        )
    }

    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }

    changeNewTagInput = (e) => {
        var regTextChar = /^([\w\u4E00-\u9FA5_\-]+)+$/
        if (!regTextChar.test(e[e.length - 1])) {
            message.error('不允许输入特殊字符')
            return
        }
        this.setState({ newTagValue: e })
        console.log(e, 'newTagValue +++++')
    }

    visibleTagModal = () => {
        this.setState({
            addTagModalVisible: !this.state.addTagModalVisible,
            newTagValue: !this.state.addTagModalVisible ? this.state.newTagValue : [],
            newTagList: !this.state.addTagModalVisible ? this.state.newTagList : [],
        })
    }

    checkBoxChange = (contextIds) => {
        console.log(contextIds, '--------checkedList-------')
        const { addTypeInfo } = this.state
        addTypeInfo.contextIds = contextIds
        this.setState({ addTypeInfo })
    }

    getTagTypeAppliableSceneData = async () => {
        let res = await getTagTypeAppliableScene()
        if (res.code == 200) {
            this.setState({
                tagTypeAppliableSceneDatList: res.data,
            })
        }
    }

    getTagList = async (param = {}) => {
        console.log(param, '----getTagList---------')
        let tagTypeId = this.state.tagTypeId
        let params = {
            searchText: this.state.searchText,
            status: this.state.statusSelectValue,
            tagTypeId,
        }
        this.paramOption = {
            ...this.state.tablePagination,
            ...param,
            ...params,
            pageSize: param && param.page_size ? param.page_size : this.state.tablePagination.pageSize,
        }
        console.log(this.paramOption, '------this.paramOption------')
        let tableData = []
        if (tagTypeId) {
            let res = await getTagValueListByType(tagTypeId, this.paramOption)
            if (res.code == 200) {
                this.setState({
                    tableData: res.data,
                    tablePagination: { ...this.paramOption, paginationDisplay: res.total > this.paramOption.pageSize ? 'block' : 'none', total: res.total },
                })
                return {
                    total: res.total,
                    dataSource: res.data,
                }
            }
        }
    }

    resetSearch = async () => {
        await this.setState({
            searchText: '',
            statusSelectValue: undefined,
        })
        this.searchHandle()
    }

    // 创建标签
    postCreateTag = async () => {
        let { newTagList, newTagValue } = this.state
        newTagValue.map((item) => {
            newTagList.push({
                tagTypeId: this.state.tagTypeId,
                name: item,
            })
        })
        this.setState({
            loading: true,
        })
        let params = {
            tagTypeId: this.state.tagTypeId,
            tagValueNameList: [],
        }
        this.state.newTagList.map((item) => {
            params.tagValueNameList.push(item.name)
        })
        let res = await createTag(params)
        this.setState({
            loading: false,
        })
        if (res.code == 200) {
            message.success(res.msg || '操作成功')
            // this.changeModalType('add')
            this.visibleTagModal()
            this.search()
        }
    }

    conditionSelectChange = async (value) => {
        await this.setState({
            statusSelectValue: value,
        })
        this.searchHandle()
    }
    searchTextChange = (e) => {
        let searchText = e.target.value
        this.setState({
            searchText,
        })
    }

    searchHandle = () => {
        // this.getTagList()
        this.search()
    }

    render() {
        const {
            addTypeModalVisible,
            type,
            loading,
            listLoading,
            addTypeInfo,
            codeRule,
            nameRule,
            treeData,
            // addSystemModalVisible,
            tablePagination,
            tableData,
            addTagModalVisible,
            addTagOperate,
            newTagValue,
            defaultTreeSelectedKeys,
            selectedTagCategory,
            statusSelectValue,
        } = this.state
        return (
            <React.Fragment>
                <SliderLayout
                    className='classManage'
                    style={{ height: '100%' }}
                    renderSliderHeader={() => {
                        return '标签分类'
                    }}
                    renderContentHeaderExtra={() => {
                        return (
                            <PermissionWrap funcCode='/md/tags/manage/add'>
                                <Button type='primary' onClick={this.addBtn}>
                                    新增标签
                                </Button>
                            </PermissionWrap>
                        )
                    }}
                    renderContentHeader={() => {
                        return (
                            <div>
                                {selectedTagCategory.name}
                                <span className='NoImportLabel'>
                                    （目标对象：
                                    {selectedTagCategory.appliableScene && selectedTagCategory.appliableScene.length > 0
                                        ? selectedTagCategory.appliableScene
                                              .map((d) => {
                                                  return d.name
                                              })
                                              .join(',')
                                        : null}
                                    ）
                                </span>
                            </div>
                        )
                    }}
                    renderSliderBody={() => {
                        return treeData.length ? (
                            <EditTree
                                useIcon
                                data={this.getNode}
                                ref={(node) => {
                                    this.tree = node
                                }}
                                treeData={treeData}
                                openAddModal={this.openAddModal}
                                editData={this.editData}
                                deleteData={this.deleteData}
                                disableEdit={[0, 1]}
                                disableDelete={[0, 1]}
                                disableAdd={[1]}
                                onSelect={this.onSelect}
                                depth={1}
                                defaultSelectedKeys={defaultTreeSelectedKeys}
                                type='treeEdit'
                                selectable={false}
                            />
                        ) : null
                    }}
                    renderContentBody={() => {
                        return (
                            <RichTableLayout
                                smallLayout
                                editColumnProps={{ hidden: true }}
                                disabledDefaultFooter
                                renderSearch={(controller) => {
                                    this.controller = controller
                                    return (
                                        <React.Fragment>
                                            <Input.Search allowClear onSearch={this.searchHandle} placeholder='请输入标签名称' onChange={this.searchTextChange} value={this.state.searchText} />
                                            <Select onChange={this.conditionSelectChange} allowClear value={statusSelectValue} placeholder='状态'>
                                                <Option key='VALID' value='VALID'>
                                                    启用
                                                </Option>
                                                <Option key='INVALID' value='INVALID'>
                                                    禁用
                                                </Option>
                                            </Select>
                                            <Button s className='searchBtn' onClick={this.resetSearch}>
                                                重置
                                            </Button>
                                        </React.Fragment>
                                    )
                                }}
                                requestListFunction={async (page, pageSize) => {
                                    return this.getTagList({
                                        pagination: {
                                            page,
                                            page_size: pageSize,
                                        },
                                    })
                                }}
                                tableProps={{
                                    columns: this.columns,
                                    extraTableProps: {
                                        scroll: {
                                            x: false,
                                        },
                                    },
                                }}
                                renderDetail={() => {
                                    return (
                                        <Form className='MiniForm' layout='inline'>
                                            <FormItem style={{ maxWidth: '100%' }} label='描述'>
                                                {<span className='ellipsisText'>{selectedTagCategory.desc}</span> || <EmptyLabel />}
                                            </FormItem>
                                        </Form>
                                    )
                                }}
                            />
                        )
                    }}
                />
                <DrawerLayout
                    drawerProps={{
                        title: addTagOperate == 'add' ? '新增标签' : '修改标签',
                        visible: addTagModalVisible,
                        onClose: this.visibleTagModal,
                        width: 480,
                    }}
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Button type='primary' disabled={!newTagValue.length} loading={loading} onClick={this.postCreateTag}>
                                    确定
                                </Button>
                                <Button onClick={this.visibleTagModal}>取消</Button>
                            </React.Fragment>
                        )
                    }}
                >
                    <div className='MiniForm'>
                        <FormItem label='标签名称'>
                            <TagsInput
                                addOnBlur={true}
                                addOnPaste={true}
                                pasteSplit={(data) => data.split(' ')}
                                value={newTagValue}
                                onChange={::this.changeNewTagInput}
                                inputProps={{ placeholder: '请输入标签名称，标签以空格隔开' }}
                            />
                        </FormItem>
                    </div>
                </DrawerLayout>
                <DrawerLayout
                    drawerProps={{
                        title: type == 'add' ? '新增分类' : '修改分类',
                        visible: addTypeModalVisible,
                        onClose: this.cancel,
                        width: 480,
                    }}
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Button type='primary' disabled={addTypeInfo.tagTypeName && !nameRule ? false : true} loading={loading} onClick={this.postAddType}>
                                    {type == 'add' ? '完成' : '确认修改'}
                                </Button>
                                <Button onClick={this.cancel}>取消</Button>
                            </React.Fragment>
                        )
                    }}
                >
                    <div className='EditMiniForm Grid1'>
                        <Form.Item label='分类名称' className={!nameRule ? '' : 'errorTip'}>
                            <Input
                                style={{ paddingRight: '50px !important' }}
                                maxLength={20}
                                value={addTypeInfo.tagTypeName}
                                onChange={this.changeName}
                                onBlur={this.checkName}
                                placeHolder='请输入分类名称'
                                suffix={<span style={{ color: '#b3b3b3' }}>{addTypeInfo.tagTypeName.length + '/20'}</span>}
                            />
                            {nameRule ? <div style={{ color: '#F23F30', fontSize: '12px' }}>名称重复</div> : null}
                        </Form.Item>
                        <Form.Item label='分类描述'>
                            <TextArea rows={4} cols={62} style={{ height: 54 }} value={addTypeInfo.tagTypeDesc} onChange={this.changeDesc} placeHolder='请输入分类描述' />
                        </Form.Item>
                        <Form.Item label='目标对象'>
                            <CheckboxGroup options={this.state.tagTypeAppliableSceneDatList} value={addTypeInfo.contextIds} onChange={this.checkBoxChange} />
                        </Form.Item>
                    </div>
                </DrawerLayout>
            </React.Fragment>
        )
    }
}

export default TagCategory
