// 添加检核表
import React, { Component } from 'react'
import DrawerLayout from '@/component/layout/DrawerLayout'
import { Button, Select, Spin, Input, message } from 'antd'
import { configCategory, rootList, configType, fieldSearch, getSourceList, getTableDetail, listTableByDatabaseId } from 'app_api/metadataApi'
import { foreignSelectorSuggest, foreignSelectorDb, foreignSelectorTable, foreignSelectorColumn } from 'app_api/dataModeling'
import { databaseList } from 'app_api/examinationApi'
import { addTableToTaskGroup } from 'app_api/examinationApi'
import '../../index.less'
import store from '../../store'
import AutoTip from '@/component/AutoTip'

export default class AddCheckTableDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            btnLoading: false,
            queryInfo: {
                keyword: '',
            },
            selectSuggest: undefined,
            selectedPath: [],
            loading: false,
            selectedItem: [],
            selectedTitle: [],
            showTreeData: false,
            treeData: [],
            suggestList: [],
            showSelectDropdown: false,
            dbData: [],
            tableData: [],
            columnData: [],
            datasourceKeyword: '',
            databaseKeyword: '',
            tableKeyword: '',
        }
    }
    openModal = async () => {
        let { queryInfo } = this.state
        queryInfo.keyword = ''
        await this.setState({
            modalVisible: true,
            selectedItem: [],
            selectedTitle: [],
            selectSuggest: undefined,
            queryInfo,
            datasourceKeyword: '',
            databaseKeyword: '',
            tableKeyword: '',
        })
        await this.getDatasourceData()
        // this.getSuggestPath()
        this.getTreeData([])
    }
    getDatasourceData = async () => {
        this.setState({ loading: true })
        let res = await getSourceList({ ignoreProducts: 'MONGODB', sourceType: 1 })
        this.setState({ loading: false })
        if (res.code == 200) {
            res.data.map((item) => {
                item.level = 1
                item.name = item.dsName
                item.ename = item.identifier
            })
            this.setState({
                dbData: res.data,
                treeData: res.data,
            })
        }
    }
    getTableData = async (selectedTitle) => {
        let query = {
            datasourceId: selectedTitle[0].id,
            page: 1,
            page_size: 999999,
        }
        this.setState({ loading: true })
        let res = await databaseList(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            res.data.map((item) => {
                item.level = 2
                item.name = item.physicalDatabase
            })
            this.setState({
                tableData: res.data,
            })
        }
    }
    getColumnData = async (selectedTitle) => {
        console.log(selectedTitle, 'getColumnData')
        let query = {
            datasourceId: selectedTitle[0].id,
            databaseId: selectedTitle[1].id,
            page: 1,
            page_size: 999999,
        }
        this.setState({ loading: true })
        let res = await listTableByDatabaseId(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            res.data.map((item) => {
                item.level = 3
                item.name = item.physicalTable
            })
            this.setState({
                columnData: res.data,
            })
        }
    }
    getSuggestPath = async () => {
        let { queryInfo } = this.state
        let res = await foreignSelectorSuggest(queryInfo)
        if (res.code == 200) {
            // res.data = [{nodeIds: ["8733124813057795984", "6487174440717700524"], nodeNames: ['123', '323']}]
            res.data.map((item) => {
                item.pathNameDesc = item.nodeNames ? item.nodeNames.join(' > ') : ''
                item.nodeIdString = item.nodeIds ? item.nodeIds.join(',') : ''
            })
            this.setState({
                suggestList: res.data,
            })
        }
    }
    clearInput = async (e, node) => {
        if (e == undefined) {
            await this.setState({
                selectSuggest: e,
                selectedPath: [],
                selectedItem: [],
                selectedTitle: [],
            })
            this.handleSearch('')
        } else {
            await this.setState({
                selectSuggest: e,
                selectedPath: node.props.nodeIds,
            })
        }
        this.getSelectedItem()
    }
    getSelectedItem = async () => {
        let { selectedPath, treeData } = this.state
        await this.setState({ selectedItem: [], selectedTitle: [] })
        this.getTreeData(selectedPath)
    }
    getTreeData = async (selectedPath) => {
        for (let index = 0; index < selectedPath.length; index++) {
            let { treeData, selectedItem, selectedTitle } = this.state
            if (index == 0) {
                treeData.map((node) => {
                    if (node.id == selectedPath[index]) {
                        selectedItem[0] = node
                    }
                })
            } else if (index == 1) {
                await this.getTableData(selectedItem)
                this.state.tableData.map((node) => {
                    if (node.id == selectedPath[index]) {
                        selectedItem[1] = node
                    }
                })
                this.getColumnData(selectedItem)
            } else {
                console.log(selectedItem, 'selectedItem11')
                await this.getColumnData(selectedItem)
                this.state.columnData.map((node) => {
                    if (node.id == selectedPath[index]) {
                        selectedTitle.push(node)
                    }
                })
            }
            this.setState({
                selectedItem,
                selectedTitle: index > 1 ? selectedTitle : [...selectedItem],
            })
            console.log(selectedItem, 'selectedItem2++++++')
            let categoryContent = document.querySelector('.categoryContent')
            categoryContent.style.maxWidth = (selectedItem.length + 1) * 198 + 'px'
        }
    }
    renderDropdown = (menu) => {
        let { suggestList } = this.state
        return (
            <div>
                <div className='dropdownTitle'>
                    搜索到<span>{suggestList.length}</span>个结果
                </div>
                {menu}
            </div>
        )
    }
    selectTree = async (data) => {
        let { selectedItem, selectedTitle } = this.state
        if (data.level == 3) {
            if (selectedItem.length < data.level) {
                if (selectedTitle.length == data.level) {
                    selectedTitle[selectedTitle.length - 1] = data
                } else {
                    selectedTitle.push(data)
                }
                this.setState({
                    selectedTitle,
                })
            } else {
                let array = []
                for (let i = 0; i < data.level - 1; i++) {
                    array.push(selectedItem[i])
                }
                selectedItem = [...array]
                selectedTitle = [...array]
                selectedTitle.push(data)
                await this.setState({
                    selectedItem,
                    selectedTitle,
                })
                if (data.level == 1) {
                    this.getTableData(selectedTitle)
                } else if (data.level == 2) {
                    this.getColumnData(selectedTitle)
                }
            }
            return
        }
        if (selectedItem.length) {
            if (data.level == 1) {
                selectedItem = [data]
            } else {
                let array = []
                for (let i = 0; i < data.level - 1; i++) {
                    array.push(selectedItem[i])
                }
                console.log(array, 'selectedItem')
                array.push(data)
                selectedItem = [...array]
            }
        } else {
            selectedItem.push(data)
        }
        console.log(selectedItem, 'selectTree')
        await this.setState({
            selectedItem,
            selectedTitle: [...selectedItem],
        })
        if (data.level == 1) {
            this.getTableData(selectedItem)
            this.setState({
                databaseKeyword: '',
                tablekeyword: '',
            })
        } else if (data.level == 2) {
            this.getColumnData(selectedItem)
            this.setState({
                tableKeyword: '',
            })
        }
        // transition生效必须使用max-width
        let categoryContent = document.querySelector('.categoryContent')
        categoryContent.style.maxWidth = (selectedItem.length + 1) * 198 + 'px'
    }
    handleSearch = async (value) => {
        console.log(value, 'handleSearch')
        let { queryInfo } = this.state
        queryInfo.keyword = value
        await this.setState({
            queryInfo,
            showSelectDropdown: true,
        })
        this.getSuggestPath()
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    postData = async () => {
        let { selectedTitle } = this.state
        const { selectedTaskInfo } = store
        let query = {
            tableId: selectedTitle[2].id,
            taskGroupId: selectedTaskInfo.taskGroupId,
        }
        this.setState({ btnLoading: true })
        let res = await addTableToTaskGroup(query)
        this.setState({ btnLoading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.cancel()
            this.props.refresh()
        }
    }
    changeKeyword = async (index, e) => {
        let { treeData, tableData, columnData } = this.state
        if (index == 0) {
            await this.setState({
                datasourceKeyword: e.target.value,
            })
            treeData.map((item) => {
                if (item.name.includes(this.state.datasourceKeyword) || item.ename.includes(this.state.datasourceKeyword)) {
                    item.disabled = false
                } else {
                    item.disabled = true
                }
            })
            this.setState({
                treeData,
            })
        } else if (index == 1) {
            await this.setState({
                databaseKeyword: e.target.value,
            })
            tableData.map((item) => {
                if (item.name.includes(this.state.databaseKeyword)) {
                    item.disabled = false
                } else {
                    item.disabled = true
                }
            })
            this.setState({
                tableData,
            })
        } else {
            await this.setState({
                tableKeyword: e.target.value,
            })
            columnData.map((item) => {
                if (item.name.includes(this.state.tableKeyword)) {
                    item.disabled = false
                } else {
                    item.disabled = true
                }
            })
            this.setState({
                columnData,
            })
        }
    }
    render() {
        const {
            modalVisible,
            btnLoading,
            suggestList,
            selectSuggest,
            selectedItem,
            selectedTitle,
            showSelectDropdown,
            loading,
            treeData,
            tableData,
            columnData,
            datasourceKeyword,
            databaseKeyword,
            tableKeyword,
        } = this.state
        let renderLength = []
        for (let i = 0; i < selectedItem.length + 1; i++) {
            renderLength.push(' ')
        }
        return (
            <DrawerLayout
                drawerProps={{
                    title: '添加检核表',
                    className: 'addCheckTableDrawer',
                    width: 650,
                    visible: modalVisible,
                    onClose: this.cancel,
                }}
                renderFooter={() => {
                    return (
                        <React.Fragment>
                            <Button disabled={selectedTitle.length < 3} onClick={this.postData} type='primary' loading={btnLoading}>
                                确定
                            </Button>
                            <Button onClick={this.cancel}>取消</Button>
                        </React.Fragment>
                    )
                }}
            >
                {modalVisible && (
                    <div className='foreignCategory'>
                        {/*<div style={{ width: '100%' }}>*/}
                        {/*<Select*/}
                        {/*allowClear*/}
                        {/*showSearch*/}
                        {/*className='categorySelect'*/}
                        {/*filterOption={false}*/}
                        {/*onSearch={this.handleSearch}*/}
                        {/*style={{ width: '100%', margin: '0 0 16px 0' }}*/}
                        {/*dropdownClassName={showSelectDropdown ? 'categoryDropdown' : 'categoryDropdown hideDropdown'}*/}
                        {/*placeholder="请输入表名称"*/}
                        {/*value={selectSuggest}*/}
                        {/*onChange={this.clearInput}*/}
                        {/*dropdownRender={this.renderDropdown}*/}
                        {/*suffixIcon={<span className='iconfont icon-sousuo'></span>}*/}
                        {/*getPopupContainer={triggerNode => triggerNode.parentNode}*/}
                        {/*>*/}
                        {/*{suggestList.map((item) => {*/}
                        {/*return (*/}
                        {/*<Select.Option nodeIds={item.nodeIds} key={item.nodeIdString} value={item.nodeIdString}>*/}
                        {/*<span dangerouslySetInnerHTML={{ __html: item.pathNameDesc }}></span>*/}
                        {/*</Select.Option>*/}
                        {/*)*/}
                        {/*})}*/}
                        {/*</Select>*/}
                        {/*</div>*/}
                        <Spin spinning={loading}>
                            <div className='categoryContent'>
                                {renderLength.map((item, index) => {
                                    return (
                                        <div className='categoryItem'>
                                            <div className={selectedTitle[index] ? 'itemHeader' : 'itemHeader itemHeaderGrey'}>{index == 0 ? '数据源选择' : index == 1 ? '库选择' : '表选择'}</div>
                                            <div className='itemContent'>
                                                <Input.Search
                                                    allowClear
                                                    value={index == 0 ? datasourceKeyword : index == 1 ? databaseKeyword : tableKeyword}
                                                    onChange={this.changeKeyword.bind(this, index)}
                                                    placeholder={index == 0 ? '数据源搜索' : index == 1 ? '数据库搜索' : '表搜索'}
                                                />
                                                <div className='scrollContent HideScroll'>
                                                    {(index == 0 ? treeData : index == 1 ? tableData : columnData).map((item) => {
                                                        return (
                                                            <div
                                                                style={{ display: item.disabled == true ? 'none' : '' }}
                                                                className={(selectedTitle[index] ? selectedTitle[index].name : undefined) == item.name ? 'itemDiv itemDivSelected' : 'itemDiv'}
                                                            >
                                                                <div className='itemTitle' onClick={this.selectTree.bind(this, item)}>
                                                                    {/*{*/}
                                                                    {/*item.type == 1 ? <span className="tagName">虚拟</span> : null*/}
                                                                    {/*}*/}

                                                                    <span className='titleValue'>
                                                                        <AutoTip content={item.name} />
                                                                    </span>
                                                                    <span className='titleIcon'>{index > 1 ? null : <span className='iconfont icon-you' style={{ marginLeft: 4 }}></span>}</span>
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                    {!(index == 0 ? treeData : index == 1 ? tableData : columnData).length ? <div className='emptyLabel'>暂无数据</div> : null}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </Spin>
                        <div className='selectedPath'>
                            <span className='title'>当前选择：</span>
                            {selectedTitle.map((item, index) => {
                                return (
                                    <span className='value'>
                                        {item.name}
                                        {index + 1 == selectedTitle.length ? null : <span className='iconfont icon-you'></span>}
                                    </span>
                                )
                            })}
                        </div>
                    </div>
                )}
            </DrawerLayout>
        )
    }
}
