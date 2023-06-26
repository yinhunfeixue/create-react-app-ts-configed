import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Divider, Dropdown, Menu, message, Modal, Space, Spin } from 'antd'
import type { DataNode } from 'antd/es/tree'
import { ContentLayout, Empty, SearchTree, TreeLayout, Wrap } from 'cps'
import React, { useEffect, useRef, useState } from 'react'
import { AddSystemDrawer, CateDetail, CateModal, SystemDetail } from '../cps'
import EMPTY_CATEGORY from './empty-category.png'
import style from './index.lees'

import PermissionWrap from '@/component/PermissionWrap'
import { defaultTitleRender, ISearchTreeRef, searchTreeMarkWord } from '@/components/trees/SearchTree'
import ProjectUtil from '@/utils/ProjectUtil'
import { deleteSystem, deleteSystemCategory, querySystem, querySystemList, sortCategory, sortSystem, TsystemDetail } from '../Service'

const more = (
    <svg viewBox='0 0 1024 1024' p-id='11296' width='14' height='14'>
        <path
            d='M864 416c53.12 0 96 42.88 96 96s-42.88 96-96 96S768 565.12 768 512s42.88-96 96-96zM512 416c53.12 0 96 42.88 96 96S565.12 608 512 608 416 565.12 416 512 458.88 416 512 416z m-352 0C213.12 416 256 458.88 256 512s-42.88 96-96 96S64 565.12 64 512s42.88-96 96-96z'
            p-id='11297'
        ></path>
    </svg>
)

interface TcurrentNode extends Record<any, any> {
    isLeaf?: boolean
}

const typeMap = {
    1: '报表系统',
    2: '数据仓库',
    3: '其它',
}

const storageKey = 'system-manage'
let init = true

const getParentKey = (key: React.Key, tree: DataNode[]): React.Key => {
    let parentKey: React.Key
    for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node.children) {
            if (node.children.some((item) => item.key === key)) {
                parentKey = node.key
            } else if (getParentKey(key, node.children)) {
                parentKey = getParentKey(key, node.children)
            }
        }
    }
    return parentKey!
}

let findResult: any

export default function Manage(props: React.PropsWithChildren<{}>) {
    /* state */
    const [systemDrawerVisible, setSystemDrawerVisible] = useState(false)
    const [cateModalVisible, setCateModalVisible] = useState(false)
    // 节点详情
    const [currentNode, setCurrentNode] = useState<TcurrentNode>({})
    // select key
    const [selectedKey, setSelectedKey] = useState<Set<React.Key>>(new Set())
    // expand key
    const [expandKey, setExpandkey] = useState<Set<React.Key>>(new Set())
    // 系统详情，由节点详情id查
    const [systemDetail, setSystemDetail] = useState<TsystemDetail>({})
    // 分类变化标识
    const [cateCount, setCateCount] = useState<number>(0)
    const [cateModalData, setCateModalData] = useState({})
    const [systemDrawerData, setSystemDrawerData] = useState({})
    const [systemDrawerType, setSystemDrawerType] = useState<'create' | 'edit' | 'delete' | ''>('')

    const [loadCount, setLoadCount] = useState(0)

    const [systemList, setSystemList] = useState<Record<string, any>[]>([])
    const [systemLoading, setSystemLoading] = useState(false)

    const [updateCateDetail, setUpdateCateDetail] = useState(false)

    const [searchValue, setSearchValue] = useState('')
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([])
    const [autoExpandParent, setAutoExpandParent] = useState(true)

    const [directorySelectedKeys, setDirectorySelectedKeys] = useState<string[]>([])
    const [directoryExpandedKeys, setDirectoryExpandedKeys] = useState<string[]>([])
    const [loadingTree, setLoadingTree] = useState(false)

    const ref = useRef<Record<string, any>>({})

    /* effect */

    useEffect(() => {
        if (!currentNode.systemType) return
        querySystem({ sysId: currentNode.id }).then((res) => {
            setTimeout(() => {
                setSystemDetail(res.data || {})
            }, 100)
        })
    }, [currentNode.id, cateCount])

    useEffect(() => {
        setSystemLoading(true)
        querySystemList({ keyword: searchValue }).then((res) => {
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
                console.log('storage模式')
                init = false
                console.log('storage', storage)
                setCurrentNode({ ...storage.currentNode })

                setDirectorySelectedKeys([storage.currentNode.id])
                setDirectoryExpandedKeys([storage.currentNode.systemType ? storage.currentNode.parentId : storage.currentNode.id])

                setLoadCount((c) => c + 1)
                setSystemLoading(false)
                setSystemList([...data])
                return
            }
            // 如果还没有选中节点，默认选中第一个节点, 高亮第一个节点
            if (!currentNode.id) {
                setCurrentNode(data[0] || {})
                setDirectoryExpandedKeys([data[0].id as unknown as string])
                setDirectorySelectedKeys([data[0].id as unknown as string])
            } else {
                // 已有选中节点，要更新节点，只更新分类; 系统也要更新，根据parentId来
                data.forEach((v) => {
                    if (v.id === currentNode.id) {
                        setCurrentNode(v)
                    }
                    if (v.id === currentNode.parentId) {
                        if (v.systemList) {
                            let _currentNode = v.systemList.filter((k) => k.id === currentNode.id)
                            if (_currentNode.length > 0) {
                                setCurrentNode(_currentNode[0])
                            }
                        }
                    }
                })
            }
            setLoadCount((c) => c + 1)
            setSystemLoading(false)
            setSystemList([...data])
        })
    }, [cateCount, searchValue])

    /* event */

    const selectChange = (value: Record<string, any>) => {
        setCurrentNode({ ...value })
        selectedKey.clear()
        selectedKey.add(value.key)
        setSelectedKey(new Set([...selectedKey]))
    }
    const expandChange = (value: Record<string, any>) => {
        if (expandKey.has(value.id)) {
            expandKey.delete(value.id)
        } else {
            expandKey.add(value.id)
        }
        setExpandkey(new Set([...expandKey]))
    }
    // 添加系统
    const addSystem = (value: any, isEdit?: boolean) => {
        setSystemDrawerVisible(true)
        setSystemDrawerData({ ...value })
        setSystemDrawerType(isEdit ? 'edit' : 'create')
    }
    // 删除系统
    const delSystem = (value: any) => {
        Modal.confirm({
            title: '删除系统',
            icon: <ExclamationCircleOutlined />,
            content: '您确定删除该系统吗',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: async () => {
                const res = await deleteSystem({ sysId: value.id })
                if (res.code === 200) {
                    message.success('删除成功')
                    // 删除成功后，置空currentNode
                    setCurrentNode({})
                    setCateCount((c) => ++c)
                } else {
                    message.error(res.msg || '操作失败')
                }
            },
        })
    }
    // 删除分类
    const delCate = (data: Record<string, any>) => {
        Modal.confirm({
            title: '删除系统分类',
            icon: <ExclamationCircleOutlined />,
            content: '您确定删除系统分类吗',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk: async () => {
                const res = await deleteSystemCategory({ sysCategoryId: data.id || currentNode.id })
                if (res.code === 200) {
                    message.success('删除成功')
                    // 删除成功后，置空currentNode
                    setCurrentNode({})
                    setCateCount((count) => ++count)
                } else {
                    message.error(res.msg || '操作失败')
                }
            },
        })
    }

    const dropdownMenuEdit = () => {
        if (currentNode.systemType) {
            // 系统
            addSystem(currentNode, true)
        } else {
            // 分类
            setCateModalVisible(true)
            setCateModalData(currentNode)
        }
    }

    const dropdownMenuDelete = () => {
        if (currentNode.systemType) {
            // 系统
            delSystem(currentNode)
        } else {
            // 分类
            delCate(currentNode)
        }
    }

    /* cp */
    const dropdownMenu = (
        <Menu>
            <PermissionWrap funcCode='/system/manage/detailedit'>
                <Menu.Item key='edit'>
                    <a onClick={dropdownMenuEdit}>编辑</a>
                </Menu.Item>
            </PermissionWrap>
            <PermissionWrap funcCode='/system/manage/detaildelete'>
                <Menu.Item key='delete'>
                    <a className={style.danger} onClick={dropdownMenuDelete}>
                        删除
                    </a>
                </Menu.Item>
            </PermissionWrap>
        </Menu>
    )

    const cateModalSubmitChange = (type: any) => {
        setCateCount((count) => ++count)
        if (!currentNode.systemType) {
            setUpdateCateDetail((v) => !v)
        }
    }

    const sortChange = async (values: any[], type: string, cb: () => void) => {
        const params = { sortList: values.map((v) => (type === 'main' ? v.id : v.outSysId)) }

        setLoadingTree(true)
        const res = type === 'main' ? await sortCategory(params) : await sortSystem(params)
        setLoadingTree(false)
        if (res.code === 200) {
            message.success('操作成功')
            cb && cb()
        } else {
            message.error(res.msg || '操作失败')
        }
        console.log('res', res)
    }

    const getTreeLayoutRef = (treeRef: any) => {
        ref.current.treeLayoutRef = treeRef
    }

    const treeRef = useRef<ISearchTreeRef>()

    const tableRowClick = (record: any) => {
        // 找出tree节点，一定是在currentNode里边找
        currentNode.children.forEach((v: any) => {
            if (v.id === record.id) {
                setCurrentNode({ ...v })
                setDirectorySelectedKeys([v.id])
                setDirectoryExpandedKeys([v.systemType ? v.parentId : v.id])
                if (treeRef.current) {
                    treeRef.current.selectedAndOpenKey(v.id)
                }
            }
        })
    }

    const treeSelect = (selectedKeys: any, e: any) => {
        setCurrentNode({ ...(e.node || {}) })
        ref.current.treeLayoutRef.scrollTop = 0
        setStorage({ currentNode: { ...(e.node || {}) } })
        setDirectorySelectedKeys(selectedKeys)
    }

    const findItem = (data: any, node: any = {}, parentItem?: any) => {
        data.find((item: any = {}) => {
            if (item.key === node.key) {
                if (parentItem) {
                    item.parent = parentItem
                    return (findResult = item)
                } else return (findResult = item)
            } else if ((item.children || {}).length) {
                return (findResult = findItem(item.children, node, item))
            }
        })
        return findResult
    }

    const dealDrap = (dragNode: any, node: any, treeData: any, dropPosition: any) => {
        let dragNodeResult, nodeResult
        findResult = ''
        dragNodeResult = findItem(treeData, dragNode) || {}
        findResult = ''
        nodeResult = findItem(treeData, node) || {}
        // 0是移动到他下面作为他子集
        if (dropPosition === 0) {
            if ((dragNodeResult.parent || {}).key === nodeResult.key) {
                return true
            }
            return false
        }
        // -1是移动到和他平级在他上面    1是移动到和他平级在他下面
        if (dropPosition === 1 || dropPosition === -1) {
            // 都有父
            if (dragNodeResult.parent && nodeResult.parent) {
                // 父相等
                if ((dragNodeResult.parent || {}).key == (nodeResult.parent || {}).key) {
                    return true
                } else {
                    return false
                }
            }
            //有父无父
            if (dragNodeResult.parent && !nodeResult.parent) {
                return false
            }
            if (!dragNodeResult.parent && !nodeResult.parent) {
                return true
            }
        }
    }
    const onDrop = (info: any) => {
        const dropKey = info.node.key
        const dragKey = info.dragNode.key
        const dropPos = info.node.pos.split('-')
        const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])

        const dealData = JSON.parse(JSON.stringify(systemList))
        const result = dealDrap(info.dragNode, info.node, [...dealData], dropPosition)
        if (!result) return

        const loop = (data: any, key: React.Key, callback: (node: DataNode, i: number, data: DataNode[]) => void) => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].key === key) {
                    return callback(data[i], i, data)
                }
                if (data[i].children) {
                    loop(data[i].children!, key, callback)
                }
            }
        }
        const data = [...systemList]

        // Find dragObject
        let dragObj: DataNode
        loop(data, dragKey, (item, index, arr) => {
            arr.splice(index, 1)
            dragObj = item
        })
        if (!info.dropToGap) {
            // Drop on the content
            loop(data, dropKey, (item) => {
                item.children = item.children || []
                // where to insert 示例添加到头部，可以是随意位置
                item.children.unshift(dragObj)
            })
        } else if (
            ((info.node as any).props.children || []).length > 0 && // Has children
            (info.node as any).props.expanded && // Is expanded
            dropPosition === 1 // On the bottom gap
        ) {
            loop(data, dropKey, (item) => {
                item.children = item.children || []
                // where to insert 示例添加到头部，可以是随意位置
                item.children.unshift(dragObj)
                // in previous version, we use item.children.push(dragObj) to insert the
                // item to the tail of the children
            })
        } else {
            let ar: DataNode[] = []
            let i: number
            loop(data, dropKey, (_item, index, arr) => {
                ar = arr
                i = index
            })
            if (dropPosition === -1) {
                ar.splice(i!, 0, dragObj!)
            } else {
                ar.splice(i! + 1, 0, dragObj!)
            }
        }

        let values: any[] = []
        if (info.dragNode.systemType) {
            data.forEach((v) => {
                if (v.id == info.dragNode.parentId) {
                    values = v.children
                }
            })
        } else {
            values = data
        }
        sortChange(values, info.dragNode.systemType ? 'sub' : 'main', () => {
            setSystemList(data)
        })
    }

    const setStorage = (value: any) => {
        sessionStorage.setItem(storageKey, JSON.stringify(value))
    }
    const getStorage = () => JSON.parse(sessionStorage.getItem(storageKey) || '{}')

    return (
        <div className={style.wrap}>
            <Spin className={style.spin} spinning={loadCount === 0}>
                {loadCount >= 1 && systemList && systemList.length <= 0 && !searchValue && !systemLoading ? (
                    <ContentLayout title='系统管理' footer>
                        <Empty image={EMPTY_CATEGORY} desc='暂无系统信息，你可以添加分类管理员' height={460}>
                            <Button
                                onClick={() => {
                                    setCateModalVisible(true)
                                    setCateModalData({})
                                }}
                                type='primary'
                            >
                                <PlusOutlined />
                                添加分类
                            </Button>
                        </Empty>
                    </ContentLayout>
                ) : (
                    <TreeLayout
                        rightTitle={`${currentNode.systemType ? '系统详情' : '分类详情'}`}
                        leftTitle={
                            <div className={style.leftTitle}>
                                系统目录<span className={style.desc}>拖拽可排序</span>
                                <PermissionWrap funcCode='/system/manage/systemadd'>
                                    <PlusOutlined
                                        onClick={() => {
                                            setCateModalVisible(true)
                                            setCateModalData({})
                                        }}
                                        className={style.add}
                                    />
                                </PermissionWrap>
                            </div>
                        }
                        leftContent={
                            <Spin spinning={loadingTree}>
                                <SearchTree
                                    ref={treeRef}
                                    style={{ height: '100%' }}
                                    treeProps={{
                                        treeData: systemList,
                                        onSelect: treeSelect,
                                        onDrop: onDrop,
                                        draggable: {
                                            icon: false,
                                        },
                                        allowDrop: ({ dragNode, dropNode, dropPosition }) => {
                                            return Boolean(dealDrap(dragNode, dropNode, JSON.parse(JSON.stringify(systemList)), dropPosition))
                                        },
                                    }}
                                    defaultSelectedEqual={(node) => Boolean(node.key)}
                                    treeTitleRender={(node, searchKey) =>
                                        defaultTitleRender(node, (node) => {
                                            return {
                                                icon: ProjectUtil.getTreeNodeIcon(node.type || 0, node.icon),
                                                title: searchTreeMarkWord(node.name, searchKey),
                                                menuList: node.systemType
                                                    ? [
                                                          {
                                                              key: 'eidt',
                                                              label: '编辑系统',
                                                              onClick: () => addSystem(node, true),
                                                          },
                                                          {
                                                              key: 'delete',
                                                              label: <span style={{ color: '#F54B45' }}>删除</span>,
                                                              onClick: () => delSystem(node),
                                                          },
                                                      ]
                                                    : [
                                                          {
                                                              key: 'add',
                                                              label: '添加系统',
                                                              onClick: () => addSystem(node, false),
                                                          },
                                                          {
                                                              key: 'eidt',
                                                              label: '编辑',
                                                              onClick: () => {
                                                                  setCateModalVisible(true)
                                                                  setCateModalData({ ...node })
                                                              },
                                                          },
                                                          {
                                                              key: 'delete',
                                                              label: <span style={{ color: '#F54B45' }}>删除</span>,
                                                              onClick: () => delCate(node),
                                                          },
                                                      ],
                                            }
                                        })
                                    }
                                />
                            </Spin>
                        }
                        getRightContentRef={getTreeLayoutRef}
                    >
                        <Wrap padding={'16px 20px'}>
                            <div className={style.header}>
                                {currentNode.systemType && currentNode.icon && <span className={style.img} style={{ backgroundImage: `url(${currentNode.icon})` }}></span>}
                                <div className={style.text}>
                                    <h2>
                                        <p>{currentNode.title}</p>
                                        <span className={style.tag}>{currentNode.systemType ? typeMap[systemDetail.systemType as string] : '分类'}</span>
                                    </h2>
                                    <p className={style.headerDesc}>{currentNode.systemType ? systemDetail.desc : currentNode.desc}</p>
                                    {currentNode.systemType && (
                                        <p className={style.systemDesc}>
                                            <Space split={<Divider type='vertical' />}>
                                                <span>系统类型：{typeMap[systemDetail.systemType as string] || '-'}</span>
                                                <span>系统ID：{systemDetail.id || '-'}</span>
                                                <span>供应商：{systemDetail.systemSupplier || '-'}</span>
                                            </Space>
                                        </p>
                                    )}
                                </div>
                                <div className={style.operation}>
                                    <Space>
                                        <Dropdown overlay={dropdownMenu}>
                                            <Button>
                                                <span className={style.btnMore}>{more}</span>更多
                                            </Button>
                                        </Dropdown>
                                        {!currentNode.systemType && (
                                            <PermissionWrap funcCode='/system/manage/detailadd'>
                                                <Button
                                                    onClick={() => {
                                                        setSystemDrawerVisible(true)
                                                        setSystemDrawerData({ ...currentNode })
                                                        setSystemDrawerType('create')
                                                    }}
                                                    type='primary'
                                                >
                                                    <PlusOutlined />
                                                    添加系统
                                                </Button>
                                            </PermissionWrap>
                                        )}
                                    </Space>
                                </div>
                            </div>
                            {!currentNode.systemType ? (
                                <CateDetail update={updateCateDetail} tableRowClick={tableRowClick} node={{ ...currentNode }} />
                            ) : (
                                <SystemDetail detail={{ ...systemDetail }} {...props} />
                            )}
                        </Wrap>
                    </TreeLayout>
                )}
                <AddSystemDrawer
                    submitType={systemDrawerType}
                    data={{ ...systemDrawerData }}
                    visible={systemDrawerVisible}
                    onClose={() => setSystemDrawerVisible(false)}
                    submitChange={cateModalSubmitChange}
                />
                <CateModal visible={cateModalVisible} onCancel={() => setCateModalVisible(false)} submitChange={cateModalSubmitChange} data={{ ...cateModalData }} />
            </Spin>
        </div>
    )
}
