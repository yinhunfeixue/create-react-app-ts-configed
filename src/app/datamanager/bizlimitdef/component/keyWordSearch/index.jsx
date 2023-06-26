import IconFont from '@/component/IconFont'
import StatusLabel from '@/component/statusLabel/StatusLabel'
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Col, message, Modal, Popconfirm, Row, Table, Tooltip } from 'antd';
import WarnPng from 'app_images/warn.png'
import { observer } from 'mobx-react'
import React, { Component } from 'react'
import store from '../../store'
import './index.less'
import SearchBlock from './searchBlock.jsx'
import SvgViewChart from './svgChart'

@observer
export default class Result extends Component {
    constructor(props) {
        super(props)

        this.state = {
            // 是否触发搜索
            visible: false,
            checked: false,
            visibleView: false,
            viewListOverHiddenCls: '',
            viewShowStatus: true,
            viewSelectedIds: [],
            columns: [
                {
                    title: '搜索视图',
                    dataIndex: 'viewName',
                    key: 'viewName',
                    width: 230,
                    render: (text, record) => (
                        <div className='viewList'>
                            <span>{text}</span>
                        </div>
                    ),
                },
                {
                    title: '原始查询',
                    dataIndex: 'keywordContent',
                    key: 'keywordContent',
                    render: (text, record) => (
                        <Tooltip title={text.join(', ')} placement='topLeft'>
                            {text.join(', ')}
                        </Tooltip>
                    ),
                    ellipsis: true,
                },
                {
                    title: '操作',
                    key: 'action',
                    align: 'center',
                    width: 50,
                    render: (text, record) => (
                        <Popconfirm
                            title='确定要删除?'
                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                            onConfirm={() => {
                                this.deleteView(record)
                            }}
                            okText='确定'
                            cancelText='取消'
                        >
                            <div title='删除视图' style={{ align: 'center' }}>
                                {SvgViewChart['DeleteViewIcon']['img']}
                            </div>
                        </Popconfirm>
                    ),
                },
            ],
            viewList: [],
        }
    }
    // 输入新条件
    onFocus = async () => {
        let { searchItem } = store
        // let { searchItem } = this.state
        let arr = [...searchItem]
        let length = arr.length - 1
        if (arr.length > 0 && arr[length].content.length < 1) {
            this['child' + (arr.length - 1)].input.focus()
        } else {
            this.addNewEdit(length)
        }
    }
    // 插入新行
    addNewEdit = async (index) => {
        let { searchItem } = store
        // let { searchItem } = this.state
        let arr = [...searchItem.slice()]
        arr.splice(index + 1, 0, { content: '' })
        await store.setSearchItem(arr, true)
        if (this['child' + (index + 1)]) {
            this['child' + (index + 1)].input.focus()
        }
    }
    delFormula = (params) => {
        console.log(params, 'keywordSearch+++++++++')
        let { searchItem } = store
        let arr = [...searchItem]
        arr.map((item, index) => {
            if (item.businessId == params.tempBusinessId) {
                this.deleteBlank(index, false, true)
            }
        })
        console.log(arr, 'searchItem+++++')
    }
    /**
     *  删除空行
     *  @param {Number,Boolean,Boolean} [删除位置下标, 对象内容是否为空, 是否获取焦点到上个未删除节点]
     */
    deleteBlank = async (index, isBlank, isFoucus) => {
        let { searchItem } = store
        let arr = [...searchItem]
        arr.splice(index, 1)
        console.log(arr, 'deleteBlank')
        if (isBlank) {
            if (arr.length < 1) {
                store.setAmbiguity([])
                await store.setSearchItem([], true)
            } else {
                await store.setSearchItem(arr, true)
            }
            return
        }
        if (arr.length < 1) {
            store.setAmbiguity([])
            store.clearLeftParams()
            let params = {
                nodeList: [{ content: '' }],
            }
            await this.onSearch(params)
            await store.setSearchItem([{ content: '' }], true)
            this['child0'].input.focus()
        } else if (index === 0) {
            let params = {
                nodeList: arr,
            }
            await this.onSearch(params)
            await store.setSearchItem(arr, true)
            this['child0'].input.focus()
        } else {
            let params = {
                nodeList: arr,
            }
            await store.setSearchItem(arr, true)
            await this.onSearch(params)
            if (!isFoucus) {
                var range = window.getSelection()
                range.selectAllChildren(this['child' + (index - 1)].input)
                range.collapseToEnd()
            }
        }
    }
    // 编辑内容 当子模块失去焦时触发
    editContent = async (index, params, match) => {
        let { searchItem } = store
        let arr = [...searchItem]
        arr.splice(index, 1, { ...params })
        await store.setSearchItem(arr)
        let param = {
            nodeList: arr,
        }
        this.onSearch(param, match)
        if (match) {
            var range = window.getSelection()
            range.selectAllChildren(this['child' + index].input)
            range.collapseToEnd()
        }
    }

    // 设置光标位置
    setCaretPosition = (textDom, pos) => {
        if (textDom.setSelectionRange) {
            // IE Support
            textDom.focus()
            textDom.setSelectionRange(pos, pos)
        } else {
            // Firefox support
            var range = document.selection.createRange()
            range.collapse(true)
            range.moveStart('character', pos)
            range.select()
        }
    }

    // 下拉框选择 当子模块失焦时触发
    onEnter = async (index, params) => {
        let { searchItem } = store
        let arr = [...searchItem.slice()]
        arr.splice(index, 1, { ...params })
        await store.setSearchItem(arr, true)
        let param = {
            nodeList: arr,
        }
        this.onSearch(param)
        this['child' + index].input.blur()
    }
    // 清空按钮
    clearMethod = async () => {
        // store.setSearchItem([])
        // store.setAmbiguity([])
        // store.clearLeftParams()
        // store.clearContent('clear')
        // store.clearButton()
        store.clearAll()
    }

    /**
     *  搜索方法
     *  @param {Object,Boolean} [搜索需要的参数, 是否调用match接口,true代表传入]
     */
    onSearch = async (param, match) => {
        let { searchItem } = store
        //  const { searchItem, businessId, type } = this.state
        const { usableBusinessIds } = store
        let params = param
        params.businessIds = usableBusinessIds
        let viewIdsSelected = this.state.viewIdsSelected
        params.viewIdsSelected = viewIdsSelected
        if (!params.nodeList || params.nodeList.length < 1) {
            store.clearContent()
            return
        }
        // await store.onSearch(params)
        if (!match) {
            await store.onMatch(params)
        }

        if (store.ambiguityList.length === 1 && store.ambiguityList[0].status === 1) {
            store.clearContent()
            return
        } else {
            console.log('search')
            // await store.onSearch(params)
            this.props.handleSearchAction && this.props.handleSearchAction()
        }
        // console.log()
    }
    // 修改
    edit = (dataIndex) => {
        var range = window.getSelection()
        this['child' + dataIndex].input.focus()
        range.selectAllChildren(this['child' + dataIndex].input)
        range.collapseToEnd()
    }

    // 接受
    accept = (ambiguityList) => {
        const { searchItem } = store
        searchItem[ambiguityList.dataIndex].status = 0
        store.setAmbiguity(searchItem)
        let param = {
            nodeList: searchItem,
        }
        this.onSearch(param)
    }
    // 关闭下拉框
    hiddenOption = (key) => {
        const { searchItem } = store
        searchItem.map((value, index) => {
            if (index !== key) {
                this['child' + index].closeCheckOption()
            }
        })
    }
    // 切换按钮方法
    onSwitch = (checked) => {
        const { searchItem } = store
        if (searchItem.length === 0) {
            if (checked) {
                if (store.businessIdList.length === 0) {
                    // this.props.tabOperate.removeTab('kewordSearch')
                    this.props.tabOperate.addTab('sentenceSearch', {
                        businessId: store.businessIds.length ? store.businessIds[0] : 0,
                        businessIds: store.businessIds,
                        tempBusinessId: store.tempBusinessId,
                    })
                    return
                }
                if (store.businessIdList.length > 0) {
                    // this.props.tabOperate.removeTab('kewordSearch')
                    this.props.tabOperate.addTab('sentenceSearch', {
                        type: store.businessIdList[0].type,
                        businessId: store.businessIdList[0].id,
                        businessIds: store.businessIds,
                        tempBusinessId: store.tempBusinessId,
                    })
                }
                // else {
                //     message.warning('存在多个业务线不能跳转智能取数')
                // }
            }
        } else {
            this.setState({
                visible: true,
            })
        }
    }

    // 输入中发生合并 把光标位置定位到之前的结尾
    preFocus = (key, pos) => {
        // this['child' + (key - 1) ].input.focus()
        if (pos) {
            this['child' + key].input.focus()
            let selection = window.getSelection()
            let range = selection.getRangeAt(0)
            var textNode = range.startContainer
            range.setStart(textNode, pos)
            range.collapse(true)
            selection.removeAllRanges()
            selection.addRange(range)
        } else {
            var range = window.getSelection()
            range.selectAllChildren(this['child' + key].input)
            range.collapseToEnd()
        }

        const { searchItem } = store
        let arr = [...searchItem]
        let params = {
            businessIds: store.usableBusinessIds,
            nodeList: arr,
            currentIndex: key,
            position: pos,
        }
        this['child' + key].getKeyWord(params)
    }
    // 取消
    onCancel = () => {
        this.setState({
            visible: false,
        })
    }
    // 确定跳转到智能取数
    goOnIntelligent = () => {
        this.setState({
            visible: false,
        })
        // this.clearMethod()
        // this.props.tabOperate.removeTab('kewordSearch')
        this.props.tabOperate.addTab('sentenceSearch', { type: store.type, businessId: store.businessIds[0], businessIds: store.businessIds, tempBusinessId: store.tempBusinessId })
    }
    // 使搜索框获焦
    onSearchFocus = () => {
        this.onFocus()
    }

    searchViewManage = () => {
        this.setState({
            visibleView: !this.state.visibleView,
        })
    }

    onCancelView = () => {
        this.setState({
            visibleView: false,
        })
    }

    deleteView = (record) => {
        console.log(record, '--------record-------')
        this.props.handleDeleteViewList && this.props.handleDeleteViewList(record)
    }

    viewTagClick = async (tagInfo) => {
        console.log(tagInfo, '-------tagInfotagInfo-------')
        let viewSelectedIds = []
        if (!tagInfo.available) {
            return
        }
        let viewList = this.state.viewList
        viewList.map((val, k) => {
            if (tagInfo.viewId === val.viewId) {
                // delete viewList[k]
                viewList[k]['selected'] = !tagInfo.selected
            }

            if (viewList[k]['selected']) {
                viewSelectedIds.push(val.viewId)
            }
        })

        await store.setViewSelectedIds(viewSelectedIds)
        // tagInfo.selected = true
        // viewList.unshift(tagInfo)
        this.setState(
            {
                viewList,
                viewSelectedIds,
            },
            () => {
                // if (viewIdsSelected.length > 0) {
                this.props.handleSearchAction && this.props.handleSearchAction()
                // }
            }
        )
    }

    viewListShow = (status) => {
        if (status) {
            // 显示
            this.setState({
                viewListOverHidden: '',
            })
        } else {
            // 隐藏
            this.setState({
                viewListOverHidden: 'viewListOverHidden',
            })
        }
    }

    viewShowStatus = () => {
        this.setState({
            viewShowStatus: !this.state.viewShowStatus,
            viewListOverHiddenCls: !this.state.viewShowStatus ? '' : 'viewListOverHidden',
        })
    }

    renderViewList = (viewList, operate) => {
        this.setState(
            {
                viewList,
            },
            () => {
                // const { clientHeight } = this.searchViewDom
                // console.log(clientHeight, '-----clientHeight')
                if (operate === 'expend') {
                    !this.state.viewShowStatus &&
                        this.setState({
                            viewShowStatus: true,
                            viewListOverHidden: '',
                        })
                    // if (clientHeight > 42) {

                    // }
                } else {
                    // 非添加状态下，默认隐藏
                    // if (clientHeight > 42) {
                    this.state.viewShowStatus &&
                        this.setState({
                            viewShowStatus: false,
                            viewListOverHidden: 'viewListOverHidden',
                        })
                    // }
                }
            }
        )
    }
    postSaveMtrics = () => {
        if (!store.nodeList.length) {
            message.error('请输入指标口径')
            return
        }
        this.props.postSaveMtrics()
    }

    render() {
        const { searchItem, ambiguityList, isMerge } = store
        const { visible, checked, visibleView, viewList, viewListOverHiddenCls, viewShowStatus } = this.state
        return (
            <div className='searchWrap' style={{ position: 'relative' }}>
                <div className='searchContent'>
                    <IconFont className='IconSearch' type='icon-sousuo' onClick={this.searchMethod} />
                    <div
                        className='kwSearch'
                        contentEditable='true'
                        onClick={this.onFocus}
                        onKeyDown={this.onFocus}
                        ref={(refs) => {
                            this.search = refs
                        }}
                    >
                        {searchItem.map((value, index) => {
                            return (
                                <SearchBlock
                                    ref={(ref) => {
                                        this['child' + index] = ref
                                    }}
                                    key={index}
                                    dataIndex={index}
                                    addNewEdit={this.addNewEdit}
                                    deleteBlank={this.deleteBlank}
                                    edit={this.editContent}
                                    onEnter={this.onEnter}
                                    onSearch={this.onSearch}
                                    hiddenOption={this.hiddenOption}
                                    searchAction={this.props.handleSearchAction}
                                    preFocus={this.preFocus}
                                    isMerge={isMerge}
                                    params={value}
                                />
                            )
                        })}
                    </div>
                </div>
                {ambiguityList.length > 0 ? (
                    <div className='ambiguity'>
                        {ambiguityList[0].status === 2 ? (
                            <div className='warnList'>
                                <StatusLabel type='warning' message={`查询中的“${ambiguityList[0].content}”匹配到了多个指标。以下结果中，我们使用了 “${ambiguityList[0].name}” 进行计算`} />
                                <div className='warnBtn'>
                                    <Button style={{ marginRight: '8px' }} onClick={this.edit.bind(this, ambiguityList[0].dataIndex)}>
                                        修改
                                    </Button>
                                    <Button onClick={this.accept.bind(this, ambiguityList[0])}>接受</Button>
                                </div>
                            </div>
                        ) : (
                            <div className='warnList'>
                                <StatusLabel type='error' message={`没有查询到和“${ambiguityList[0].content}”相关的指标或数据`} />
                                <div className='warnBtn'>
                                    <Button onClick={this.edit.bind(this, ambiguityList[0].dataIndex)}>修改</Button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : null}
                {viewList.length > 0 ? (
                    <div
                        className='searchView'
                        ref={(dom) => {
                            this.searchViewDom = dom
                        }}
                    >
                        <Row>
                            <Col span='2'>
                                搜索视图
                                <Tooltip title='搜索视图' className='searchViewTooltip'>
                                    {SvgViewChart['HelpIcon']['img']}
                                    <i>{SvgViewChart['HelpIcon']['hover']}</i>
                                </Tooltip>
                            </Col>
                            <Col span='20' className={viewListOverHiddenCls}>
                                {viewList.map((val, k) => {
                                    let clsName = !val.available ? 'viewTagDef viewTagDisabled' : val.selected ? 'viewTagDef viewTagSelected' : 'viewTagDef'
                                    return (
                                        <div style={{ width: '100%' }}>
                                            <div className='viewTag'>
                                                <span
                                                    className={clsName}
                                                    onClick={() => {
                                                        this.viewTagClick(val)
                                                    }}
                                                >
                                                    <span className='textContent'>{val.viewName}</span>
                                                    {val.selected ? <span>{SvgViewChart['SelectedIcon']['img']}</span> : null}
                                                </span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </Col>
                            <Col span='2'>
                                <span className='viewShowIcon' onClick={this.viewShowStatus}>
                                    {!viewShowStatus ? (
                                        <span>
                                            {SvgViewChart['CollapseIcon']['img']}
                                            <i>{SvgViewChart['CollapseIcon']['hover']}</i>
                                        </span>
                                    ) : (
                                        <span>
                                            {SvgViewChart['ExpendIcon']['img']}
                                            <i>{SvgViewChart['ExpendIcon']['hover']}</i>
                                        </span>
                                    )}
                                </span>
                                <span onClick={this.searchViewManage} className='viewManIcon' title='搜索视图管理'>
                                    {SvgViewChart['SettingViewIcon']['img']}
                                    <i>{SvgViewChart['SettingViewIcon']['hover']}</i>
                                </span>
                            </Col>
                        </Row>
                    </div>
                ) : null}
                <Modal title='提示' visible={visible} onCancel={this.onCancel} footer={null}>
                    <div style={{ padding: '0 78', overflow: 'hidden' }}>
                        <div style={{ float: 'left', paddingRight: '5px' }}>
                            <img src={WarnPng} style={{ width: '20px', height: '20px' }} />
                        </div>
                        <div style={{ float: 'left', width: '440px' }}>
                            <p>当前查询直接无法切换到智能取数, 如要切换, 系统将清空您当前的查询内容</p>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <Button onClick={this.onCancel} style={{ marginRight: '10px' }}>
                            取消
                        </Button>
                        <Button type='primary' onClick={this.goOnIntelligent}>
                            确定
                        </Button>
                    </div>
                </Modal>
                <Modal title='搜索视图管理' visible={visibleView} onCancel={this.onCancelView} footer={null} width='50%' height='500px' centered>
                    <Table pagination={false} dataSource={viewList} columns={this.state.columns} scroll={{ y: 450 }} rowKey='viewId' />
                </Modal>
            </div>
        )
    }
}
