import { Alert, Button, Form, Input, message, Modal, Select, Tooltip } from 'antd'
import { AppTree, DrawerWrap, ListHorizontal, SearchTree, Select as LocalSelect, TreeLayout, Wrap } from 'cps'
import React, { Key, useCallback, useEffect, useRef, useState } from 'react'

import { CheckCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons'

import UploadDrawer from './upload'

import style from './index.lees'

import { defaultTitleRender, searchTreeDisableNodeSelectIfHasChildren, searchTreeMarkWord } from '@/components/trees/SearchTree'
import ProjectUtil from '@/utils/ProjectUtil'
import TreeControl from '@/utils/TreeControl'
import { createDirectory, deleteDirectory, editDirectory, queryDirectoryDetail, querySystemDirectoryList, querySystemList, searchDirectory, sortDirectory } from '../Service'
import PermissionWrap from '@/component/PermissionWrap'
import PermissionManage from '@/utils/PermissionManage'
const storageKey = 'system-directory'
let init = true

export default function Directory(props: any) {
    const ref = useRef<{ isEdit: boolean; parentId?: number }>({ isEdit: false })

    /* state */
    // 节点详情
    const [currentNode, setCurrentNode] = useState<Record<string, any>>({})
    // select key
    const [selectedKey, setSelectedKey] = useState<Set<React.Key>>(new Set())
    // expand key
    const [expandKey, setExpandkey] = useState<Set<React.Key>>(new Set())

    const [systemList, setSystemList] = useState<Record<string, any>[]>([])
    const [directoryList, setDirectoryList] = useState<Record<string, any>[]>([])

    // 活动操作树节点
    const [activeTreeNode, setActiveTreeNode] = useState<Record<string, any>>({})
    const [selectedTreeNode, setSelectedTreeNode] = useState<Record<string, any>>({})

    const [uploadDrawerVisible, setUploadDrawerVisible] = useState(false)
    const [detailVisible, setDetailVisible] = useState(false)
    const [editVisible, setEditVisible] = useState(false)
    const [systemSearchValue, setSystemSearchValue] = useState('')
    const [directorySearchValue, setDirectorySearchValue] = useState('')
    const [searchList, setSearchList] = useState<any[]>([])
    const [appTreeSelectedNodes, setAppTreeSelecteNodes] = useState<string[]>([])

    // 目录详情
    const [appTreeNodeDetail, setAppTreeNodeDetail] = useState<Record<string, any>>({})

    const [updateDirectory, setUpdateDirectory] = useState<boolean>(false)
    const [updateSystem, setUpdateSystem] = useState(false)

    const [updateSelect, setUpdateSelect] = useState(0)
    const [treeEdit, setTreeEdit] = useState(false)
    const [parent, setParent] = useState({})

    const [form] = Form.useForm()

    // 左侧树
    useEffect(() => {
        querySystemList({ keyword: systemSearchValue }).then((res) => {
            const data = res.data || []
            data.forEach((v) => {
                v.key = v.id
                v.title = v.name
                if (v.systemList) {
                    v.systemList.forEach((k) => {
                        if (k) {
                            k.key = k.id
                            k.title = k.name
                            k.parentId = v.id
                        }
                    })
                    // null值过滤
                    v.systemList = v.systemList.filter((v) => v !== null)
                    v.children = v.systemList
                }
            })
            // 先找回填值
            let storage: any = getStorage() || {}
            if (init && (storage.currentNode || {}).id) {
                init = false
                console.log('storage', storage)
                setCurrentNode({ ...storage.currentNode })
                setSelectedKey(new Set([storage.currentNode.id]))
                setExpandkey(new Set([storage.currentNode.parentId]))
                setSystemList([...data])
                return
            }
            // 如果还没有选中节点，默认选中页面中传的结点（如果有） 或 第一个节点
            if (!currentNode.id) {
                let propsId = ProjectUtil.getPageParam(props).id

                let selectNode
                let chain
                let expandKeys = []

                // 如果页面地址中有id，则使用页面的id；否则，使用第1个结点
                if (propsId) {
                    chain = new TreeControl().searchChain(data, (node) => {
                        return node.id.toString() === propsId
                    })
                    if (chain && chain.length) {
                        selectNode = chain[chain.length - 1]
                        expandKeys = chain.map((item) => item.id)
                    }
                } else {
                    selectNode = (data[0].systemList || [])[0] || {}
                    expandKeys = [data[0].id]
                }

                if (selectNode) {
                    setCurrentNode(selectNode)
                    setSelectedKey(new Set([selectNode.id]))
                    setExpandkey(new Set(expandKeys))
                }
            }
            setSystemList([...data])
        })
    }, [systemSearchValue, updateSystem])

    useEffect(() => {
        return () => {
            setStorage('')
        }
    }, [])
    // 系统目录
    useEffect(() => {
        if (!currentNode.id) return
        // 记录currentNode id
        setStorage({ currentNode: { ...currentNode } })
        querySystemDirectoryList({ systemId: currentNode.id }).then((res) => {
            setDirectoryList(res.data)
        })
    }, [currentNode.id, updateDirectory, updateSystem])
    // 系统目录搜索
    useEffect(() => {
        if (!directorySearchValue) {
            setSearchList([])
            return
        }
        searchDirectory({ keyword: directorySearchValue, systemId: currentNode.id }).then((res) => {
            let data = res.data || []
            data = data.filter((v) => !!v)
            setSearchList([...data])
        })
    }, [directorySearchValue])
    // 系统详情
    useEffect(() => {
        if (detailVisible) {
            queryDirectoryDetail({ id: activeTreeNode.id }).then((res) => {
                setAppTreeNodeDetail(res.data)
            })
        }
    }, [detailVisible])

    /* event */

    const selectChange = useCallback((selectedKey: Key[], e: Record<string, any>) => {
        if (!e.node.systemType) return
        setCurrentNode({ ...(e.node || {}) })
        setUpdateSelect((v) => ++v)
        setAppTreeSelecteNodes([])
    }, [])

    const expandChange = (value: Record<string, any>) => {
        if (expandKey.has(value.id)) {
            expandKey.delete(value.id)
        } else {
            expandKey.add(value.id)
        }
        setExpandkey(new Set([...expandKey]))
    }

    const edit = (data: any) => {
        setActiveTreeNode({ ...data })
        queryDirectoryDetail({ id: data.id }).then((res) => {
            const values = res.data
            values.tech = [values.techniqueDepartment, values.techniqueManagerId]
            values.business = [values.businessDepartment, values.businessMangerId]
            form.setFieldsValue(values)
            setEditVisible(true)
        })
        ref.current.isEdit = true
    }

    const del = (data: any) => {
        Modal.confirm({
            title: '删除系统目录',
            icon: <ExclamationCircleOutlined />,
            content: '您确定删除系统分类吗',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: () => {
                deleteDirectory({ id: data.id }).then((res) => {
                    if (res.code === 200) {
                        message.success('删除成功')
                        setUpdateDirectory((v) => !v)
                    } else {
                        message.error(res.msg || '删除失败')
                    }
                })
            },
        })
    }

    const treeMenu = (data: any = {}, parent: any = {}) => {
        let menuList: any = [
            {
                key: 'detail',
                label: (
                    <a
                        onClick={() => {
                            setActiveTreeNode({ ...data })
                            setDetailVisible(true)
                        }}
                        style={{ width: 132, display: 'inline-block' }}
                    >
                        详情
                    </a>
                ),
            },
        ]
        if (PermissionManage.hasFuncPermission('/system/directory/edit')) {
            menuList.push({
                key: 'edit',
                label: (
                    <a
                        onClick={() => {
                            edit(data)
                            setTreeEdit(true)
                            setParent(parent)
                            ref.current.parentId = parent.id
                        }}
                        style={{ width: 132, display: 'inline-block' }}
                    >
                        编辑
                    </a>
                ),
            })
        }
        if (PermissionManage.hasFuncPermission('/system/directory/delete')) {
            menuList.push({
                danger: true,
                key: 'delete',
                label: (
                    <a
                        onClick={() => {
                            setActiveTreeNode({ ...data })
                            del(data)
                        }}
                        style={{ width: 132, display: 'inline-block' }}
                    >
                        删除
                    </a>
                ),
            })
        }
        return menuList
    }

    const editOk = async () => {
        form.validateFields()
            .then(async (value) => {
                const values = form.getFieldsValue()
                console.log('values', values)
                // 数据转换
                values.techniqueDepartment = (values.tech || [])[0]
                values.techniqueManagerId = (values.tech || [])[1]
                values.businessDepartment = (values.business || [])[0]
                values.businessMangerId = (values.business || [])[1]

                // 删除多余参数
                delete values.tech
                delete values.business

                if (ref.current.isEdit) {
                    values.id = activeTreeNode.id
                }

                values.systemId = currentNode.id
                // parentId
                if (ref.current.parentId) {
                    values.parentId = ref.current.parentId
                }

                const res = ref.current.isEdit ? await editDirectory(values) : await createDirectory(values)
                if (res.code === 200) {
                    message.success('操作成功')
                    setEditVisible(false)
                    setUpdateDirectory((v) => !v)
                } else {
                    message.error(res.msg || '操作失败')
                }
            })
            .catch((errorInfo) => {
                console.log('errorInfo', errorInfo)
            })
    }

    const renderTreeEmpty = (appIndex: number, parent: any) => {
        return (
            <div className={style.treeEmpty}>
                <p>暂无系统目录</p>
                {appIndex == 0 ? (
                    <p>
                        <a onClick={() => treeAdd(appIndex, parent)}>添加目录</a>或点击右上角上传目录
                    </p>
                ) : (
                    <p>
                        点击<a onClick={() => treeAdd(appIndex, parent)}>添加目录</a>上传目录
                    </p>
                )}
            </div>
        )
    }

    const treeAdd = (dataIndex: number, parent: any = {}) => {
        setParent({ ...parent })
        setEditVisible(true)
        form.resetFields()
        ref.current.isEdit = false
        ref.current.parentId = parent.id
    }

    const treeSelect = (data: any) => {
        setSelectedTreeNode(data)
    }

    const searchChange = (value: any) => {
        setDirectorySearchValue(value)
    }

    const searchSelectChange = (value: any, e: any = {}) => {
        const nodeIds = e.nodeId || []
        setAppTreeSelecteNodes(nodeIds)
        if (!e.nodeId) {
            setDirectorySearchValue('')
        }
    }

    const appTreeSortChange = (data: any) => {
        sortDirectory({ sortList: data.map((v: any) => v.id) }).then((res) => {
            if (res.code == 200) {
                message.success('排序成功')
                setUpdateDirectory((v) => !v)
                // 清空选中
                setAppTreeSelecteNodes([])
            } else {
                message.error(res.msg || '操作失败')
            }
        })
    }

    const uploadSubmitChange = () => {
        setUpdateSystem((v) => !v)
    }

    const searchTreeChange = (e: any) => {
        setSystemSearchValue(e.target.value)
    }

    const setStorage = (value: any) => {
        if (value) {
            sessionStorage.setItem(storageKey, JSON.stringify(value))
        } else {
            sessionStorage.removeItem(storageKey)
        }
    }
    const getStorage = () => JSON.parse(sessionStorage.getItem(storageKey) || '{}')

    return (
        <TreeLayout
            rightTitle={
                <div className={style.title}>
                    {currentNode.name}{' '}
                    <PermissionWrap funcCode='/system/directory/upload'>
                        <Button
                            onClick={() => {
                                setUploadDrawerVisible(true)
                            }}
                            type='primary'
                        >
                            上传目录
                        </Button>
                    </PermissionWrap>
                </div>
            }
            leftTitle={<div className={style.title}>系统目录</div>}
            leftContent={
                <SearchTree
                    style={{height:'100%'}}
                    treeProps={{
                        treeData: systemList,
                        onSelect: selectChange,
                    }}
                    disableNodeSelect={searchTreeDisableNodeSelectIfHasChildren}
                    defaultSelectedEqual={(node) => Boolean(node.systemType)}
                    treeTitleRender={(node, searchKey) => {
                        return defaultTitleRender(
                            node,
                            (node) => {
                                return {
                                    icon: ProjectUtil.getTreeNodeIcon(node.type || 0, node.icon),
                                    title: <span className={style.text}>{searchTreeMarkWord(node.name, searchKey)}</span>,
                                    extra: (
                                        <span className={style.subTitle}>
                                            {node.hasPath && (
                                                <Tooltip title='有目录' placement='top'>
                                                    <CheckCircleFilled style={{ color: '#29C45D' }} />
                                                </Tooltip>
                                            )}
                                        </span>
                                    ),
                                }
                            },
                            searchKey
                        )
                    }}
                />
            }
        >
            <Wrap className={style.wrapClass} padding='20px 20px 0 20px'>
                <div className={style.search}>
                    <Select
                        key={updateSelect}
                        allowClear
                        showSearch
                        className='categorySelect'
                        filterOption={false}
                        onSearch={searchChange}
                        style={{ minWidth: '280px' }}
                        placeholder='搜索系统目录'
                        suffixIcon={<span className='iconfont icon-sousuo'></span>}
                        onChange={searchSelectChange}
                    >
                        {searchList.map((item) => {
                            const str = (item.nodeNames || []).join(' > ')
                            return (
                                <Select.Option key={(item.nodeIds || []).join(',')} nodeId={item.nodeIds} value={str}>
                                    <span dangerouslySetInnerHTML={{ __html: str }} />
                                </Select.Option>
                            )
                        })}
                    </Select>
                </div>
                <AppTree
                    height={'100%'}
                    treeData={directoryList}
                    fieldNames={{ children: 'childList' }}
                    renderNode={(data) => (
                        <span className={style.titleWrap}>
                            {!data.canEdit ? <span className={`iconfont icon-suo1 ${style.titleIcon}`} /> : null}
                            {data.name}
                        </span>
                    )}
                    renderNodeMore={(data) => (
                        <div>
                            描述：<span>{data.desc}</span>
                        </div>
                    )}
                    hideAdd={!PermissionManage.hasFuncPermission('/system/directory/add')}
                    hideSort={!PermissionManage.hasFuncPermission('/system/directory/sort')}
                    renderTitle={(i) => `路径${i + 1}`}
                    moreOverlayMenuItem={treeMenu}
                    renderEmpty={renderTreeEmpty}
                    onAdd={treeAdd}
                    onSelect={treeSelect}
                    selectedKeys={appTreeSelectedNodes}
                    sortChange={appTreeSortChange}
                    firstTitle={currentNode.name}
                />
            </Wrap>
            <UploadDrawer node={{ ...currentNode }} systemId={currentNode.id} visible={uploadDrawerVisible} onClose={() => setUploadDrawerVisible(false)} submitChange={uploadSubmitChange} />
            <DrawerWrap
                title='目录详情'
                visible={detailVisible}
                onClose={() => setDetailVisible(false)}
                onOk={() => {
                    setDetailVisible(false)
                }}
                footer={null}
            >
                <div>
                    <div className={style.wrap}>
                        <h3>{appTreeNodeDetail.name}</h3>
                        <p>{appTreeNodeDetail.desc}</p>
                    </div>
                    <div className={style.wrap} style={{ padding: '24px 0' }}>
                        <h4>基本信息</h4>
                        <ListHorizontal label='技术归属部门' value={appTreeNodeDetail.businessDepartmentName} />
                        <ListHorizontal label='技术负责人' value={appTreeNodeDetail.businessMangerName} />
                        <ListHorizontal label='业务归属部门' value={appTreeNodeDetail.techniqueDepartmentName} />
                        <ListHorizontal style={{ marginBottom: 0 }} label='业务负责人' value={appTreeNodeDetail.techniqueManagerName} />
                    </div>
                    <div className={style.wrap} style={{ padding: '24px 0' }}>
                        <h4>其他信息</h4>
                        <ListHorizontal label='创建人' value={appTreeNodeDetail.createUserName} />
                        <ListHorizontal style={{ marginBottom: 0 }} label='创建时间' value={appTreeNodeDetail.createTime} />
                    </div>
                </div>
            </DrawerWrap>
            <DrawerWrap
                title={`${treeEdit ? '编辑' : '新增'}系列目录`}
                visible={editVisible}
                onClose={() => {
                    setEditVisible(false)
                    setTreeEdit(false)
                }}
                onOk={editOk}
            >
                <Alert message={!parent.name ? `所属系统：${currentNode.name}` : `上级目录：${parent.name}`} showIcon />
                <Form form={form} layout='vertical'>
                    <Form.Item label='目录名称' name='name' rules={[{ required: true }]}>
                        <Input placeholder='请输入' maxLength={16} showCount />
                    </Form.Item>
                    <Form.Item label='目录描述' name='desc'>
                        <Input.TextArea placeholder='请输入' maxLength={128} showCount />
                    </Form.Item>
                    <Form.Item label='技术归属方' name='tech'>
                        <LocalSelect.DepartUser placeholder={['技术部门', '技术负责人']} />
                    </Form.Item>
                    <Form.Item label='业务归属方' name='business'>
                        <LocalSelect.DepartUser placeholder={['业务部门', '业务负责人']} />
                    </Form.Item>
                </Form>
            </DrawerWrap>
        </TreeLayout>
    )
}
