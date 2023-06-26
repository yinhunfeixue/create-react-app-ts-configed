import EmptyIcon from '@/component/EmptyIcon'
import IconFont from '@/component/IconFont'
import SliderLayout from '@/component/layout/SliderLayout'
import TextMore from '@/component/textmore/TextMore'
import ProjectUtil from '@/utils/ProjectUtil'
import RenderUtil from '@/utils/RenderUtil'
import { DownOutlined } from '@ant-design/icons'
import { Cascader, Checkbox, Collapse, Input, Pagination, Popover, Select, Spin, Tabs, Tag, Tooltip, Tree } from 'antd'
import { wareAssetSearch, wareAssetTree, wareTagFilter } from 'app_api/dataAssetApi'
import _ from 'lodash'
import { observer } from 'mobx-react'
import React, { Component, Fragment } from 'react'
import './index.less'

const { TreeNode } = Tree
const { Search } = Input
const { Panel } = Collapse
const TabPane = Tabs.TabPane

const assetTypeOptions = [
    { label: '系统表', value: '0' },
    { label: '血缘脚本', value: '3' },
]

@observer
export default class CreateETL extends Component {
    constructor(props) {
        super(props)
        this.state = {
            spinLoading: false,
            tagTitle: '标签',
            selectedFilterList: [], // 已选筛选项
            queryInfo: {
                page: 1,
                pageSize: 10,
                keyword: '',
                filterNodes: [],
                treeFilters: [],
                domain: 'TABLE',
                preciseSearch: false,
            },
            total: 0,
            modelQuery: {
                page: 1,
                pageSize: 100000,
            },
            preciseSearch: false,
            showFilter: false,
            showTagFilter: false,
            assetType: [],
            expandedKeys: [],
            checkedKeys: [],
            selectedKeys: [],
            searchTree: [],
            assetList: [
                {
                    ename: 'ename',
                    cname: '表中文名',
                    tagList: [],
                    type: 1,
                    columnList: [],
                    modelRecommend: [],
                },
            ],
            modelModalVisible: false,
            modelList: [],
            tagFilter: [],
            tagIndex: 0,
            tagIndex1: 0, // 选择中标签序列
            tagFilterList: [],
            treeLoading: false,
            classifyIds: [],
            classifyIdInfo: undefined,
        }
    }
    componentDidMount = async () => {
        let { queryInfo } = this.state
        console.log(this.pageParam, 'this.pageParam')
        queryInfo.filterNodes = this.pageParam.query ? [JSON.parse(this.pageParam.query)] : []
        await this.setState({
            queryInfo
        })
        this.getDataAsset()
        this.getTree()
        await this.getTagFilter()
        this.searchFilter()
        RenderUtil.removeTypographyTitle()

        window.addEventListener('resize', this.resizeHandler)
        document.getElementById('dataWare').addEventListener('scroll', this.resizeHandler)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeHandler)
        document.getElementById('dataWare').removeEventListener('scroll', this.resizeHandler)
    }
    get pageParam() {
        return ProjectUtil.getPageParam(this.props)
    }
    updateElCascaderStyle() {
        // 效果：项目名称的input框随着内容的长度而自适应，设置 cascader 标签的width
        var el_cascader_element = document.querySelector('.autoWidthCascader')
        let value = document.querySelector('.autoWidthCascader > .ant-cascader-picker-label').innerText
        console.log(value, 'updateElCascaderStyle')
        var length = value.length
        var num = length * 14 + 50 + 'px'
        el_cascader_element.style.width = num
    }

    resizeHandler = () => {
        this.updateTreeWrapStyle()
    }

    searchFilter = async () => {
        const filterNodes = _.get(this.state, 'tagFilterList[1].filterNodes', [])
        const index = _.findIndex(filterNodes, { id: _.get(this.props, 'location.state.data.techniqueManagerId') })
        if (index > -1) {
            this.changeAssetType(filterNodes[index], 1, index)
        }
    }

    getTree = async () => {
        let { expandedKeys, queryInfo } = this.state
        this.setState({ treeLoading: true, searchTree: [] })
        queryInfo.preciseSearch = this.state.preciseSearch
        let query = {
            ...queryInfo,
            filterNodes: [...queryInfo.filterNodes]
        }
        query.filterNodes.map((item) => {
            if (item.type == 'securityLevel_string' && item.name !== '不限') {
                query.filterNodes.push({
                    ...item,
                    type: 'securityLevelConfirm',
                    value: true
                })
            }
        })
        let res = await wareAssetTree(query)
        if (res.code == 200) {
            res.data.map((item) => {
                item.level = 0
                expandedKeys.push(item.id)
            })
            console.log(expandedKeys, 'expandedKeys')
            this.setState({
                searchTree: res.data,
                expandedKeys,
            })
        }
        this.setState({ treeLoading: false })
    }
    showMoreModel = (index, value) => {
        const { modelList } = this.state
        modelList[index].showMore = value
        this.setState({ modelList })
    }
    getTagFilter = async () => {
        let { queryInfo, selectedFilterList } = this.state
        queryInfo.preciseSearch = this.state.preciseSearch
        queryInfo.filterNodes = this.pageParam.query ? [JSON.parse(this.pageParam.query)] : []
        let res = await wareTagFilter(queryInfo)
        selectedFilterList = []
        if (res.code == 200) {
            res.data.map((item) => {
                item.filterNodes.map((item1) => {
                    item1.showTagFilter = false
                    item1.checked = false
                    if (item1.children) {
                        item1.children.map((item2) => {
                            item2.checked = false
                        })
                    }
                    if (item1.type !== 'classIds' && item1.type !== 'tagtype') {
                        if (item1.name == '不限') {
                            item1.checked = true
                        }
                    }
                })
            })
            this.setState({
                tagFilterList: res.data,
                selectedFilterList,
            })
        }
    }
    numberFormat = (num) => {
        if (num) {
            if (num < 1000) {
                return num
            } else if (num >= 1000 && num < 1000000) {
                return (num / 1000).toFixed(1) + 'K'
            } else if (num >= 1000000) {
                return (num / 1000000).toFixed(1) + 'M'
            }
        } else {
            return '0'
        }
    }
    getDataAsset = async () => {
        let { queryInfo } = this.state
        this.setState({ spinLoading: true })
        queryInfo.preciseSearch = this.state.preciseSearch
        let query = {
            ...queryInfo,
            filterNodes: [...queryInfo.filterNodes]
        }
        query.filterNodes.map((item) => {
            if (item.type == 'securityLevel_string' && item.name !== '不限') {
                query.filterNodes.push({
                    ...item,
                    type: 'securityLevelConfirm',
                    value: true
                })
            }
        })
        let res = await wareAssetSearch(query)
        if (res.code == 200) {
            await this.setState({
                assetList: res.data,
                total: res.total,
            })
        }
        this.setState({ spinLoading: false })
    }
    onShowSizeChange = async (current, pageSize) => {
        const { queryInfo } = this.state
        queryInfo.page = 1
        queryInfo.pageSize = pageSize
        await this.setState({
            queryInfo,
        })
        this.getDataAsset()
    }
    changePage = async (page) => {
        const { queryInfo } = this.state
        queryInfo.page = page
        await this.setState({
            queryInfo,
        })
        this.getDataAsset()
        document.querySelector('.ContentContainer').scrollTop = 0
    }
    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
        })
        console.log(expandedKeys, 'expandedKeys')
    }

    onCheck = async (checkedKeys, e) => {
        let { queryInfo } = this.state
        queryInfo.page = 1
        console.log('onCheck', checkedKeys)
        console.log(e, 'oncheck')
        let dataRef = { ...e.node.props.dataRef }
        let hasData = false
        let index
        if (!_.isEmpty(dataRef.children)) {
            if (queryInfo.treeFilters.length) {
                dataRef.children.map((item) => {
                    queryInfo.treeFilters.map((item1, i) => {
                        if (item.id == item1.id) {
                            queryInfo.treeFilters.splice(i, 1)
                        }
                    })
                })
                if (e.checked) {
                    queryInfo.treeFilters.push(...dataRef.children)
                    // queryInfo.treeFilters = Array.from(new Set(queryInfo.treeFilters))
                }
            } else {
                dataRef.children.map((item) => {
                    queryInfo.treeFilters.push(item)
                })
            }
        } else {
            if (queryInfo.treeFilters.length) {
                for (let i = 0; i < queryInfo.treeFilters.length; i++) {
                    if (queryInfo.treeFilters[i].id == dataRef.id) {
                        hasData = true
                        index = i
                    }
                }
                if (hasData) {
                    queryInfo.treeFilters.splice(index, 1)
                } else {
                    if (e.checked) {
                        queryInfo.treeFilters.push(dataRef)
                    }
                }
            } else {
                if (e.checked) {
                    queryInfo.treeFilters.push(dataRef)
                }
            }
        }
        console.log(queryInfo, 'queryInfo')
        await this.setState({ checkedKeys, queryInfo })
        // this.getTagFilter()
        // this.getTree()
        this.getDataAsset()
    }
    onSelect = async (selectedKeys, info) => {
        console.log('onSelect', selectedKeys, info)
        let { queryInfo } = this.state
        if (selectedKeys.length) {
            queryInfo.treeFilters = [info.node.props.dataRef]
        } else {
            queryInfo.treeFilters = []
        }
        queryInfo.page = 1
        await this.setState({ selectedKeys, queryInfo })
        // await this.getTagFilter()
        // this.getTree()
        this.getDataAsset()
    }
    changeClassify = async (value, selectedOptions) => {
        console.log(value, selectedOptions)
        let { tagFilterList, classifyIdInfo } = this.state
        let classifyName = ''
        selectedOptions.map((item, index) => {
            classifyName += item.name + (index + 1 == selectedOptions.length ? '' : '/')
        })
        classifyIdInfo = {
            ...selectedOptions[selectedOptions.length - 1],
            name: classifyName,
        }
        await this.setState({
            classifyIds: value,
            classifyIdInfo,
        })
        this.updateElCascaderStyle()
        this.getSelectFilterList()
        // this.getDataAsset()
    }
    changeKeyword = (e) => {
        console.log(e.target.value, 'changeKeyword')
        const { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        this.setState({
            queryInfo,
        })
    }
    showFilterMethod = async () => {
        const { tagFilterList } = this.state
        tagFilterList.map((item) => {
            item.filterNodes.map((item1) => {
                item1.showTagFilter = false
            })
        })
        await this.setState({
            tagFilterList,
            showFilter: !this.state.showFilter,
        })
        let categoryContent = document.querySelector('.FilterWrap')
        categoryContent.style.maxHeight = this.state.showFilter ? '500px' : '0px'
    }
    changeAssetType = async (data, index, index1) => {
        let { tagFilterList } = this.state
        tagFilterList[index].filterNodes.map((item) => {
            item.checked = false
        })
        tagFilterList[index].filterNodes[index1].checked = !tagFilterList[index].filterNodes[index1].checked
        await this.setState({
            tagFilterList,
        })
        this.getSelectFilterList()
    }
    getSelectFilterList = async () => {
        let { selectedFilterList, tagFilterList, queryInfo, classifyIdInfo } = this.state
        selectedFilterList = []
        tagFilterList.map((item, index) => {
            item.filterNodes.map((item1, index1) => {
                if (item1.type == 'tagtype') {
                    item1.hasFilter = false
                    if (item1.children) {
                        item1.children.map((item2, index2) => {
                            console.log(item2, 'item2')
                            if (item2.checked) {
                                item1.hasFilter = true
                                selectedFilterList.push({
                                    name: item2.name,
                                    id: item2.id,
                                    type: item2.type,
                                    value: item2.value,
                                    title: item1.name,
                                    index: index,
                                    index1: index1,
                                    index2: index2,
                                })
                            }
                        })
                    }
                } else if (item1.type == 'classIds') {
                    let classIndex = 0
                    let hasClassId = false
                    selectedFilterList.map((item2, index2) => {
                        if (item2.type == 'classIds') {
                            hasClassId = true
                            classIndex = index2
                        }
                    })
                    if (hasClassId) {
                        selectedFilterList[classIndex] = classifyIdInfo
                    } else {
                        if (classifyIdInfo) {
                            selectedFilterList.push(classifyIdInfo)
                        }
                    }
                } else {
                    if (item1.checked == true) {
                        selectedFilterList.push({
                            name: item1.name,
                            id: item1.id,
                            type: item1.type,
                            index: index,
                            index1: index1,
                            value: item1.value,
                        })
                    }
                }
            })
        })
        if (this.pageParam.query) {
            queryInfo.filterNodes = [...selectedFilterList, JSON.parse(this.pageParam.query)]
        } else {
            queryInfo.filterNodes = [...selectedFilterList]
        }
        let array = []
        selectedFilterList.map((item) => {
            if (item.name !== '不限') {
                array.push(item)
            }
        })
        await this.setState({
            selectedFilterList: array,
            tagFilterList,
            queryInfo,
        })
        this.keywordSearch(queryInfo.keyword)
        // this.getAssetPadding()
    }
    changeAssetTag = async (index) => {
        let { selectedFilterList, tagFilterList, tagIndex, tagIndex1 } = this.state
        tagFilterList[tagIndex].filterNodes[tagIndex1].children[index].checked = !tagFilterList[tagIndex].filterNodes[tagIndex1].children[index].checked
        await this.setState({
            tagFilterList,
        })
        this.getSelectFilterList()
    }
    showTagFilterMethod = (data, index, index1) => {
        const { tagFilterList } = this.state
        tagFilterList.map((item) => {
            item.filterNodes.map((item1, i) => {
                if (i == index1) {
                    item1.showTagFilter = !item1.showTagFilter
                } else {
                    item1.showTagFilter = false
                }
            })
        })
        this.setState({
            tagFilterList,
            tagTitle: data.name,
            tagFilter: data.children ? data.children : [],
            tagIndex: index,
            tagIndex1: index1,
        })
    }
    closeTagFilter = async (data) => {
        let { selectedFilterList, tagFilterList } = this.state
        if (data.type == 'tagIds') {
            tagFilterList[data.index].filterNodes[data.index1].children[data.index2].checked = false
        } else if (data.type == 'classIds') {
            await this.setState({
                classifyIds: [],
                classifyIdInfo: undefined,
            })
        } else {
            tagFilterList[data.index].filterNodes[data.index1].checked = false
        }
        await this.setState({
            tagFilterList,
        })
        this.getSelectFilterList()
    }

    // 详情跳转
    goAssetDetail = (data) => {
        const type = _.get(data, 'type')
        if (type === 0) {
            this.props.addTab('sysDetail', { id: data.id }, true)
        } else if (type === 3) {
            this.props.addTab('sqlDetail', { id: data.id }, true)
        }
    }

    getShortName = (name) => {
        if (name) {
            if (name.length > 8) {
                return name.substr(0, 7) + '...'
            } else {
                return name
            }
        } else {
            return '空'
        }
    }

    // 展示多少页
    showTotal = (total) => {
        return (
            <span>
                总数 <b>{ProjectUtil.formNumber(total)}</b> 条
            </span>
        )
    }
    keywordSearch = async (value) => {
        const { queryInfo } = this.state
        queryInfo.keyword = value
        queryInfo.page = 1
        await this.setState({
            queryInfo,
        })
        this.getTree()
        // this.getTagFilter()
        this.getDataAsset()
    }
    renderTooltip = (value) => {
        return <a style={{ color: '#fff' }} dangerouslySetInnerHTML={{ __html: value }}></a>
    }
    /**
     *
     * @param {{label:string, content:any}[]} list
     * @returns
     */
    renderItemList(list) {
        let array = []
        list.map((item) => {
            if (!item.hide) {
                array.push(item)
            }
        })
        return RenderUtil.renderSplitList(array, 'assetLabel', this.renderTooltip)
    }

    componentDidUpdate(prevProps, prevState) {
        console.log('didupdate')
        RenderUtil.removeTypographyTitle()
        this.updateTreeWrapStyle()
    }

    updateTreeWrapStyle() {
        const dataWare = document.getElementById('dataWare')
        const dataWareHeader = document.getElementById('dataWareHeader')
        const treeWrap = document.getElementById('treeWrap')
        // 如果滚动距离小于header高度，需减去header高度
        let height = dataWare.offsetHeight
        if (dataWare.scrollTop < dataWareHeader.offsetHeight) {
            height -= dataWareHeader.offsetHeight - dataWare.scrollTop + 15
        } else {
        }

        // treeWrap.style.height = `400px`
        // treeWrap.style.height = `${height}px`
    }
    changeType = async (e) => {
        let { queryInfo } = this.state
        queryInfo.domain = e
        queryInfo.page = 1
        queryInfo.filterNodes = []
        queryInfo.treeFilters = []
        await this.setState({
            queryInfo,
            selectedFilterList: [],
            selectedKeys: [],
            classifyIds: [],
        })
        this.getTagFilter()
        this.getDataAsset()
        this.getTree()
    }
    changePreciseSearch = async () => {
        await this.setState({ preciseSearch: !this.state.preciseSearch })
        this.getDataAsset()
        this.getTree()
    }

    render() {
        let {
            total,
            expandedKeys,
            checkedKeys,
            selectedKeys,
            searchTree,
            showFilter,
            assetType,
            showTagFilter,
            tagList,
            assetList,
            modelModalVisible,
            modelList,
            tagFilter,
            tagFilterList,
            selectedFilterList,
            queryInfo,
            spinLoading,
            treeLoading,
            preciseSearch,
            classifyIds,
        } = this.state
        showTagFilter = false
        tagFilterList.map((item) => {
            if (item.filterNodes) {
                item.filterNodes.map((item1, i) => {
                    if (item1.showTagFilter) {
                        showTagFilter = true
                    }
                })
            }
        })
        const delay = 1.5
        const treeTitle = (data) => {
            let titleWidth = 0
            if (data.type == 'datasourceId' || data.type == 'databaseId') {
                if (data.dbDwLevelTagName) {
                    titleWidth = 'calc(100% - 110px)'
                } else {
                    titleWidth = 'calc(100% - 70px)'
                }
            } else {
                if (data.dbDwLevelTagName) {
                    titleWidth = 'calc(100% - 100px)'
                } else {
                    titleWidth = 'calc(100% - 60px)'
                }
            }
            return (
                <span>
                    {data.type == 'datasourceId' ? <span className="iconfont icon-xitong"></span> : null}
                    {data.type == 'databaseId' ? <span className="iconfont icon-ku"></span> : null}
                    {
                        data.dbDwLevelTagName ?
                            <span style={{
                                maxWidth: 40,
                                height: 16,
                                background: '#95A9BD',
                                borderRadius: '2px',
                                color: '#fff',
                                fontSize: '9px',
                                padding: '0 3px',
                                display: 'inline-block',
                                lineHeight: '16px',
                                overflowX: 'hidden',
                                textOverflow: 'ellipsis',
                                float: 'left',
                                margin: '11px 8px 0 0',
                            }}>{data.dbDwLevelTagName}</span> : null
                    }
                    <Tooltip title={data.name}><span style={{
                        width: titleWidth,
                        display: 'inline-block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}>{data.name}</span></Tooltip>
                    <span className='treeTitleNumber' style={{ color: data.level == 0 ? '' : '#b3b3b3' }}>{ProjectUtil.numberFormatWithK(data.statistic)}</span>
                </span>
            )
        }
        const titleIcon = () => {
            return <DownOutlined />
        }
        const { domain } = queryInfo
        const renderTreeNodes = (data, parentId) =>
            data.map((item) => {
                if (item.children) {
                    return (
                        <TreeNode className={item.level == 0 ? 'treeTitle' : ''} icon={<DownOutlined />} title={treeTitle(item)} key={item.id} parentId={parentId} dataRef={item}>
                            {renderTreeNodes(item.children, item.id)}
                        </TreeNode>
                    )
                }
                return <TreeNode checkable className={item.level == 0 ? 'treeTitle' : ''} title={treeTitle(item)} key={item.id} parentId={parentId} dataRef={item} />
            })

        return (
            <div id='dataWare' className='dataWare'>
                <header id='dataWareHeader'>
                    <div className='HeaderContent'>
                        <Select size='large' allowClear={false} onChange={this.changeType} value={domain}>
                            {RenderUtil.renderSelectOptionList(
                                [
                                    {
                                        value: 'TABLE',
                                        label: '元数据',
                                    },
                                    {
                                        value: 'LINEAGE_FILE',
                                        label: '血缘脚本',
                                    },
                                ],
                                (item) => item.label,
                                (item) => item.value
                            )}
                        </Select>
                        <Search
                            allowClear
                            value={queryInfo.keyword}
                            size='large'
                            enterButton={<span className='iconfont icon-a-searchall'></span>}
                            loading={spinLoading}
                            onChange={this.changeKeyword}
                            placeholder='请输入内容'
                            onSearch={this.keywordSearch}
                        />

                        <span className='searchMode'>
                            <Spin spinning={spinLoading}>
                                <span onClick={this.changePreciseSearch}>
                                    <span className='iconfont icon-qiehuan'></span> {preciseSearch ? '精准搜索' : '模糊搜索'}
                                </span>
                            </Spin>
                        </span>
                    </div>
                </header>
                <SliderLayout
                    className='Body'
                    style={{
                        height: 'calc(100vh - 164px)',
                    }}
                    renderSliderBody={() => {
                        return (
                            <div className='Left' id='treeWrap'>
                                {/* 左侧树 */}
                                <Spin spinning={treeLoading}>
                                    {searchTree.length ? (
                                        <Tree className='NoLineTree'
                                              blockNode
                                              selectedKeys={selectedKeys}
                                              onExpand={this.onExpand} onSelect={this.onSelect} expandedKeys={expandedKeys}>
                                            {renderTreeNodes(searchTree)}
                                        </Tree>
                                    ) : null}
                                </Spin>
                            </div>
                        )
                    }}
                    renderContentBody={() => {
                        return (
                            <React.Fragment>
                                <div className='Content'>
                                    <header>
                                        <div className='HControlGroup'>
                                            <span>相关资源 {total} 条</span>
                                            {selectedFilterList.map((item, index) => {
                                                return (
                                                    <Tag className='ExtraTag' closable style={{ marginBottom: 0 }} onClose={this.closeTagFilter.bind(this, item)}>
                                                        {item.type == 'tagIds' ? item.title + '/' + item.name : item.name}
                                                    </Tag>
                                                )
                                            })}
                                        </div>
                                        <div className='filterBtn'>
                                    <span onClick={this.showFilterMethod}>
                                            高级筛选
                                            <IconFont type='icon-botton_down' />
                                    </span>
                                        </div>
                                    </header>
                                    {/* 过滤 */}
                                    <div className='FilterWrap' style={{ maxHeight: 0 }}>
                                        {showFilter?
                                            <div className='filterContent' style={{ visibility: showFilter?'visible': 'hidden'}}>
                                                {
                                                    tagFilterList.map((item, index) => {
                                                        return (
                                                            <div className='filterItem' style={{ display: item.filterNodes.length ? '' : 'none', borderBottom: index < tagFilterList.length-1?'1px dashed #E6E8ED':'none'}}>
                                                                <span className='filterTitle'>{item.filterName}</span>
                                                                {
                                                                    item.filterName == '分类信息' ?
                                                                        <Cascader
                                                                            className='autoWidthCascader'
                                                                            allowClear={false}
                                                                            changeOnSelect={true}
                                                                            style={{ marginBottom: 9, maxWidth: 800, minWidth: 240 }}
                                                                            fieldNames={{ label: 'name', value: 'id' }}
                                                                            options={item.filterNodes.length? item.filterNodes[0].children : []}
                                                                            value={classifyIds}
                                                                            displayRender={(e) => e.join('-')}
                                                                            onChange={this.changeClassify}
                                                                            popupClassName='searchCascader classCascader'
                                                                            placeholder='请选择'
                                                                            // getPopupContainer={triggerNode => triggerNode.parentNode}
                                                                        />
                                                                        :
                                                                        <TextMore maxLine={1.5}>
                                                                            {
                                                                                item.filterNodes.map((item1,index1) => {
                                                                                    if (item1.type == 'tagtype') {
                                                                                        return (
                                                                                            <span className='tagName'
                                                                                                  style={{ color: item1.showTagFilter ? '#4d73ff' : '#5e6266' }}
                                                                                                  onClick={this.showTagFilterMethod.bind(this,item1, index, index1)}>
                                                                        {item1.name}{item1.showTagFilter?<span className="iconfont icon-shang" />:<span className="iconfont icon-xiangxia" />}
                                                                                                {item1.hasFilter ? <span className='redDot'></span> : null }
                                                                    </span>
                                                                                        )
                                                                                    } else {
                                                                                        return (
                                                                                            <Checkbox checked={item1.checked} onClick={this.changeAssetType.bind(this, item1, index, index1)} value={item1.id}>{item1.name}</Checkbox>
                                                                                        )
                                                                                    }

                                                                                })
                                                                            }
                                                                        </TextMore>
                                                                }
                                                                {
                                                                    item.filterName == '标签' ?
                                                                        <div className='tagFilter' style={{ display: showTagFilter?'': 'none'}}>
                                                                            {
                                                                                tagFilter.map((item,index) => {
                                                                                    return (
                                                                                        <Checkbox onClick={this.changeAssetTag.bind(this,index)} checked={item.checked} value={item.id}>{item.name}</Checkbox>
                                                                                    )
                                                                                })
                                                                            }
                                                                        </div>
                                                                        : null
                                                                }
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            :null}
                                    </div>
                                    <main>
                                        {total ? (
                                            <div className='assetContent'>
                                                <Spin spinning={spinLoading}>
                                                    {assetList.map((item) => {
                                                        return (
                                                            <div className='assetItem'>
                                                                <div className='assetTitle' onClick={() => this.goAssetDetail(item, '1')}>
                                                                    {item.type == 0 ? (
                                                                        <Tooltip title='系统表'>
                                                                            <img className='assetIcon' src={require('app_images/dataAsset/sys.png')} />
                                                                        </Tooltip>
                                                                    ) : null}
                                                                    {item.type == 3 ? (
                                                                        <Tooltip title='血缘脚本'>
                                                                            <img className='assetIcon' src={require('app_images/dataAsset/code.png')} />
                                                                        </Tooltip>
                                                                    ) : null}

                                                                    <span className='HControlGroup'>
                                                            {item.ename && <span dangerouslySetInnerHTML={{ __html: item.ename }} />}
                                                                        {item.cname && <span dangerouslySetInnerHTML={{ __html: item.cname }} />}
                                                        </span>
                                                                </div>
                                                                {item.type == 0 && (
                                                                    <Fragment>
                                                                        <div className='assetDetail'>
                                                                            {this.renderItemList([
                                                                                {
                                                                                    label: '系统路径：',
                                                                                    hide: !item.path,
                                                                                    content: item.path ? <span dangerouslySetInnerHTML={{ __html: item.sysClassPath + ' - ' + item.path }} /> : '',
                                                                                },
                                                                                {
                                                                                    label: '数据库类型：',
                                                                                    hide: !item.clasdatasourceTypesPath,
                                                                                    content: item.datasourceType ? <span dangerouslySetInnerHTML={{ __html: item.datasourceType }} /> : '',
                                                                                },
                                                                                {
                                                                                    label: '数仓层级：',
                                                                                    hide: !item.dwLevelTagValueName,
                                                                                    content: item.dwLevelTagValueName ? <span dangerouslySetInnerHTML={{ __html: item.dwLevelTagValueName }} /> : '',
                                                                                },
                                                                                {
                                                                                    label: '分类信息：',
                                                                                    hide: !item.classPath,
                                                                                    content: item.classPath ? <span className='pathLabel' dangerouslySetInnerHTML={{ __html: item.classPath }} /> : '',
                                                                                },
                                                                                {
                                                                                    label: '安全等级：',
                                                                                    hide: !item.securityLevel || !item.levelConfirm,
                                                                                    content: item.securityLevel && item.levelConfirm ? <span dangerouslySetInnerHTML={{ __html: item.securityLevel }} /> : '',
                                                                                },
                                                                                // {
                                                                                //     label: '技术负责人：',
                                                                                //     content: item.techniqueManager ? <span dangerouslySetInnerHTML={{ __html: item.techniqueManager }} /> : '',
                                                                                // },
                                                                            ])}
                                                                        </div>
                                                                        <div className='assetDetail assetLabel' onClick={(event) => event.stopPropagation()}>
                                                                            <div className='columnArea'>
                                                                                <label>{`字段信息（${_.size(item.columnList || [])}）：`}</label>
                                                                                {_.get(item, 'columnList', []).map((inItem, index) => (
                                                                                    <React.Fragment>
                                                                                        <Popover content={<div><h4>引用标准</h4><div>{inItem.columnStandardEname} {inItem.columnStandardCname}</div></div>}>
                                                                                            {inItem.standardId !== undefined ? <span className='iconfont icon-biaozhun'></span> : null}
                                                                                        </Popover>
                                                                                        <span dangerouslySetInnerHTML={{ __html: inItem.name }} /><span>{index + 1 === _.size(item.columnList || []) ? '' : '；'}</span>
                                                                                    </React.Fragment>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                        <div className='assetDetail ellipsisLabel'>
                                                                            {this.renderItemList([
                                                                                {
                                                                                    label: '',
                                                                                    content: !_.isEmpty(item.tagList) && (
                                                                                        <span>
                                                                                {item.tagList.map((tag) => {
                                                                                    return (
                                                                                        <Tag className='ant-tag-grey'>
                                                                                            <span dangerouslySetInnerHTML={{ __html: tag.tagName }} />
                                                                                        </Tag>
                                                                                    )
                                                                                })}
                                                                            </span>
                                                                                    ),
                                                                                },
                                                                            ])}
                                                                        </div>
                                                                    </Fragment>
                                                                )}

                                                                {item.type == 3 && (
                                                                    <Fragment>
                                                                        <div className='assetDetail'>
                                                                            {this.renderItemList([
                                                                                {
                                                                                    label: '脚本类型：',
                                                                                    content: <span dangerouslySetInnerHTML={{ __html: item.datasourceType }} />,
                                                                                },
                                                                                {
                                                                                    label: '负责人：',
                                                                                    content: <span dangerouslySetInnerHTML={{ __html: item.techniqueManager }} />,
                                                                                },
                                                                            ])}
                                                                        </div>
                                                                    </Fragment>
                                                                )}
                                                            </div>
                                                        )
                                                    })}
                                                </Spin>
                                            </div>
                                        ) : (
                                            <EmptyIcon />
                                        )}
                                        <Pagination
                                            style={{ marginTop: 16 }}
                                            pageSize={queryInfo.pageSize}
                                            current={queryInfo.page}
                                            total={total}
                                            showSizeChanger
                                            showQuickJumper
                                            showTotal={this.showTotal}
                                            onChange={this.changePage}
                                            onShowSizeChange={this.onShowSizeChange}
                                        />
                                    </main>
                                </div>
                            </React.Fragment>
                        )
                    }}
                />
            </div>
        )
    }
}
