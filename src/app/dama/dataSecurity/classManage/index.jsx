import React, { Component } from 'react'
import SliderLayout from '@/component/layout/SliderLayout'
import { Tabs, Input, Dropdown, Menu, Tooltip, Tree, message, Spin } from 'antd'
import './index.less'
import { DownOutlined, CaretDownOutlined } from '@ant-design/icons'
import ClassTable from './component/classTable'
import { datasecurityTree } from 'app_api/dataSecurity'
import ProjectUtil from '@/utils/ProjectUtil'
import { latestDiffTree } from 'app_api/autoManage'
import Cache from 'app_utils/cache'

const { TabPane } = Tabs
const { TreeNode } = Tree

export default class ClassManage extends React.Component {
    constructor() {
        super()
        this.state = {
            tabValue: '1',
            treeQuery: {
                confirm: false,
                keyword: '',
                keywordType: 1,
                filterNodes: [],
            },
            treeLoading: false,
            treeData: [],
            backupTreeData: [],
            selectedKeys: [],
            expandedKeys: [],
            selectedTagCategory: {},
        }
    }
    componentDidMount = () => {
        if (Cache.get('tabValue')) {
            this.setSelectedKeys()
        } else {
            this.getTreeData()
        }
    }
    setSelectedKeys = async () => {
        let selectedTagCategory = Cache.get('selectedTagCategory') ? Cache.get('selectedTagCategory') : this.state.selectedTagCategory
        let selectedKeys = selectedTagCategory.id ? [selectedTagCategory.id] : []
        let tabValue = Cache.get('tabValue') ? Cache.get('tabValue') : this.state.tabValue
        await this.setState({
            tabValue,
            selectedKeys,
            selectedTagCategory,
        })
        await this.getTreeData()
        this.setState({
            expandedKeys: this.expandAll(this.state.backupTreeData, []),
        })
        ;(await this.classTable) && this.classTable.getTabValue(tabValue)
        this.classTable && this.classTable.getTreeInfo(selectedTagCategory)
    }
    get pageParam() {
        return ProjectUtil.getPageParam(this.props)
    }
    getTreeQuery = async (data) => {
        let { treeQuery } = this.state
        treeQuery.filterNodes = data.filterNodes
        treeQuery.confirm = data.confirm
        // treeQuery.keyword = ''
        await this.setState({
            treeQuery,
        })
        this.getTreeData()
    }
    getTreeData = async () => {
        let { treeQuery, tabValue } = this.state
        let query = {
            ...treeQuery,
            domain: tabValue == 1 ? ['TABLE'] : ['COLUMN'],
        }
        this.setState({ treeLoading: true })
        let res = await datasecurityTree(query)
        // let res = await latestDiffTree(query)
        this.setState({ treeLoading: false })
        if (res.code == 200) {
            this.setState({
                treeData: res.data,
                backupTreeData: res.data,
            })
        }
    }
    searchTree = () => {
        let { treeQuery, backupTreeData } = this.state
        if (treeQuery.keywordType == 1) {
            this.getTreeData()
            // this.setState({
            //     expandedKeys: this.expandAll(backupTreeData, [])
            // })
            this.classTable && this.classTable.getKeyword(treeQuery.keyword)
        }
    }
    onExpand = (expandedKeys) => {
        console.log(expandedKeys)
        this.setState({
            expandedKeys,
        })
    }
    onSelect = async (selectedKeys, e) => {
        let { selectedTagCategory } = this.state
        console.log('onSelect', selectedKeys, e)
        if (selectedKeys.length) {
            await this.setState({ selectedKeys })
            let selectedNode = e.selectedNodes[0] ? e.selectedNodes[0] : { dataRef: {} }
            selectedTagCategory = selectedNode.dataRef
            this.classTable && this.classTable.getTreeInfo(selectedTagCategory)
            this.setState({
                selectedTagCategory,
            })
            Cache.set('selectedTagCategory', selectedTagCategory)
        }
    }
    selectAll = () => {
        this.setState({
            selectedKeys: [],
            selectedTagCategory: {},
        })
        this.classTable && this.classTable.getTreeInfo({})
        Cache.set('selectedTagCategory', {})
    }
    expandAll = (treeData, expandedKeys) => {
        treeData.map((item) => {
            expandedKeys.push(item.id)
            if (item.children && item.children.length > 0) {
                this.expandAll(item.children, expandedKeys)
            }
        })
        return expandedKeys
    }
    changeKeyword = async (e) => {
        let { treeQuery, backupTreeData } = this.state
        treeQuery.keyword = e.target.value
        await this.setState({
            treeQuery,
        })
        if (treeQuery.keywordType == 0) {
            this.setState({
                treeData: this.treeFilter(treeQuery.keyword, backupTreeData),
                expandedKeys: this.expandAll(backupTreeData, []),
            })
        }
    }
    treeFilter = (value, treeData) => {
        if (value) {
            let newList = []
            treeData &&
                treeData.map((item) => {
                    if (item.name.indexOf(value) > -1) {
                        const Children = this.treeFilter(value, item.children)
                        const obj = {
                            ...item,
                            children: Children,
                        }
                        newList.push(obj)
                    } else {
                        if (item.children && item.children.length > 0) {
                            const Children = this.treeFilter(value, item.children)
                            const obj = {
                                ...item,
                                children: Children,
                            }
                            if (Children && Children.length > 0) {
                                newList.push(obj)
                            }
                        }
                    }
                })
            return newList
        } else {
            return treeData
        }
    }
    tabChange = async (e) => {
        let { treeQuery } = this.state
        treeQuery.keyword = ''
        ;(await this.classTable) && this.classTable.getKeyword(treeQuery.keyword)
        await this.setState({
            tabValue: e,
            selectedKeys: [],
            treeQuery,
        })
        Cache.set('tabValue', e)
        this.classTable && this.classTable.getTabValue(e)
    }
    onClickMenu = async (e) => {
        let { treeQuery } = this.state
        treeQuery.keywordType = e.key
        treeQuery.keyword = ''
        await this.setState({
            treeQuery,
        })
        this.classTable && this.classTable.getKeyword(treeQuery.keyword)
        this.getTreeData()
    }
    renderTreeNode(treeData) {
        if (!treeData) {
            return []
        }
        return treeData.map((item) => {
            return (
                <Tree.TreeNode
                    title={
                        <Tooltip title={item.name}>
                            <span>
                                <span className='ellipsisLabel'>{item.name}</span>
                                <span style={{ color: '#9EA3A8', float: 'right' }}>{ProjectUtil.numberFormatWithK(item.statistic)}</span>
                            </span>
                        </Tooltip>
                    }
                    key={item.id}
                >
                    {this.renderTreeNode(item.children)}
                </Tree.TreeNode>
            )
        })
    }
    render() {
        const { tabValue, treeData, treeLoading, treeQuery, selectedKeys, expandedKeys } = this.state
        let total = 0
        treeData.map((item) => {
            total += item.statistic
        })
        const menu = (
            <Menu onClick={this.onClickMenu} selectedKeys={[treeQuery.keywordType]}>
                <Menu.Item key={1}>搜索表</Menu.Item>
                <Menu.Item key={0}>搜索分类</Menu.Item>
            </Menu>
        )
        const treeTitle = (data) => {
            return (
                <span>
                    <Tooltip title={data.name}>
                        <span
                            style={{
                                width: 'calc(100% - 60px)',
                                display: 'inline-block',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {data.name}
                        </span>
                    </Tooltip>
                    <span className='treeTitleNumber' style={{ color: '#b3b3b3' }}>
                        {ProjectUtil.numberFormatWithK(data.statistic)}
                    </span>
                </span>
            )
        }
        const titleIcon = () => {
            return <DownOutlined />
        }
        const renderTreeNodes = (data, parentId) =>
            data.map((item) => {
                if (item.children) {
                    return (
                        <TreeNode icon={<DownOutlined />} title={treeTitle(item)} key={item.id} parentId={parentId} dataRef={item}>
                            {renderTreeNodes(item.children, item.id)}
                        </TreeNode>
                    )
                }
                return <TreeNode title={treeTitle(item)} key={item.id} parentId={parentId} dataRef={item} />
            })
        return (
            <div className='classPage'>
                <Tabs animated={false} onChange={this.tabChange} activeKey={tabValue}>
                    <TabPane key='1' tab='数据表'></TabPane>
                    <TabPane key='2' tab='字段'></TabPane>
                </Tabs>
                <div className='classManage'>
                    <SliderLayout
                        style={{ height: '100%' }}
                        renderSliderBody={() => {
                            return (
                                <div className='treeContent HideScroll'>
                                    <Dropdown overlay={menu} placement='bottomLeft'>
                                        <span className='searchIcon' style={{ zIndex: '99' }}>
                                            <span className='icon-sousuo iconfont'></span>
                                            <CaretDownOutlined style={{ fontSize: '8px', color: '#5E6266' }} />
                                        </span>
                                    </Dropdown>
                                    <Input.Search
                                        value={treeQuery.keyword}
                                        onSearch={this.searchTree}
                                        onChange={this.changeKeyword}
                                        placeholder={treeQuery.keywordType == '1' ? (tabValue == 1 ? '搜索表' : '搜索字段') : '搜索分类'}
                                    />
                                    <div>
                                        <div onClick={this.selectAll} className={selectedKeys.length ? 'treeTitle' : 'treeTitle treeTitleSelected'}>
                                            <img src={require('app_images/file_box.png')} />
                                            全部数据<span>{ProjectUtil.numberFormatWithK(total)}</span>
                                        </div>
                                        <Spin spinning={treeLoading}>
                                            {treeData.length ? (
                                                <Tree className='LineTree' blockNode selectedKeys={selectedKeys} onExpand={this.onExpand} onSelect={this.onSelect} expandedKeys={expandedKeys}>
                                                    {renderTreeNodes(treeData)}
                                                </Tree>
                                            ) : null}
                                        </Spin>
                                    </div>
                                </div>
                            )
                        }}
                        renderContentBody={() => {
                            return (
                                <div className='tableContent HideScroll'>
                                    <ClassTable {...this.props} getTreeQuery={this.getTreeQuery} ref={(dom) => (this.classTable = dom)} />
                                </div>
                            )
                        }}
                    />
                </div>
            </div>
        )
    }
}
