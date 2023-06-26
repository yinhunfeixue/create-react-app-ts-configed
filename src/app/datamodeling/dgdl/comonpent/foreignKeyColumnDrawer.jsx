import React, { Component } from 'react'
import { Button, Select, Spin, Modal } from 'antd'
import { configCategory, rootList, configType } from 'app_api/metadataApi'
import { foreignSelectorSuggest, foreignSelectorDb, foreignSelectorTable, foreignSelectorColumn } from 'app_api/dataModeling'
import './foreignKeyColumnDrawer.less'

const IMG_PK = <svg viewBox="0 0 1609 1024" p-id="10330" width="25"><path d="M0 0m59.780366 0l1195.60731 0q59.780366 0 59.780366 59.780366l0 717.364386q0 59.780366-59.780366 59.780366l-1195.60731 0q-59.780366 0-59.780366-59.780366l0-717.364386q0-59.780366 59.780366-59.780366Z" fill="#E7F4FB" p-id="10331"></path><path d="M267.158454 657.584021c6.57584-59.780366 11.896293-129.962515 16.140698-210.486667 4.184626-80.583933 6.934522-168.759972 8.369251-264.468337h195.780698c24.988193 0 43.460326 0.836925 55.356618 2.630336 11.956073 1.733631 22.118735 4.722649 30.487986 8.907274 20.086203 10.043101 35.389976 24.50995 45.851541 43.280985 10.521344 18.771035 15.782017 41.128891 15.782016 67.07357 0 47.40583-15.064652 85.306582-45.193956 113.821816-30.129304 28.515234-70.540831 42.742961-121.174801 42.742961-6.336719 0-13.0919-0.478243-20.325324-1.434728a319.765175 319.765175 0 0 1-25.585997-4.543308l-19.249277-77.415574c9.564858 2.809677 18.711254 4.84221 27.319627 6.157378 8.668153 1.255388 17.336306 1.912972 25.944678 1.912972 24.50995 0 43.639667-6.396499 57.389151-19.249278 13.809264-12.852779 20.684006-30.607547 20.684007-53.204525 0-19.906862-5.738915-33.835687-17.336306-41.906036-11.537611-8.070349-32.161837-12.075634-61.812898-12.075634h-60.975973c-2.271654 24.988193-3.825943 41.846256-4.543308 50.633969a269.968131 269.968131 0 0 0-1.016266 18.352573L381.996536 512.556854c-0.478243 4.662869-1.076047 23.912146-1.793411 57.628272-0.657584 33.775907-1.374948 62.888945-2.092313 87.398895H267.218234z m397.53943 0c6.57584-59.780366 11.956073-129.962515 16.140699-210.486667 4.184626-80.583933 6.994303-168.759972 8.369251-264.468337h107.604658c-2.869458 24.031707-4.84221 43.221204-5.978036 57.628272-1.195607 14.347288-2.152093 27.917431-2.809678 40.770209l-11.59739 222.38296c-1.374948 28.335893-2.510775 54.938156-3.287921 79.926349-0.836925 24.988193-1.374948 49.737264-1.614069 74.247214H664.757665z m118.365124-249.045003l92.480226-117.70754c22.238296-28.455454 38.797457-50.514409 49.797044-66.176864 10.939807-15.662456 19.727521-29.651061 26.243581-42.025597h120.517217L897.90109 407.104289 1067.85667 657.584021H942.138561c-4.005284-9.564858-8.967055-19.727521-14.945092-30.487987-5.918256-10.760466-13.749484-23.553464-23.613244-38.498555L783.122789 408.539018z" fill="#1393DC" p-id="10332"></path></svg>

export default class ForeignKeyColumnDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            btnLoading: false,
            queryInfo: {
                keyword: '',
                datasourceId: '',
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
            columnData: []
        }
    }
    openModal = async (data, datasourceId) => {
        let { queryInfo } = this.state
        queryInfo.datasourceId = datasourceId
        // queryInfo.datasourceId = 2417
        await this.setState({
            modalVisible: true,
            selectedItem: [],
            selectedTitle: [],
            selectSuggest: undefined,
            queryInfo
        })
        await this.getDbData()
        this.getSuggestPath()
        this.getTreeData(data)
    }
    getDbData = async () => {
        let { queryInfo } = this.state
        let res = await foreignSelectorDb({datasourceId: queryInfo.datasourceId, type: this.props.type})
        if (res.code == 200) {
            res.data.map((item) => {
                item.level = 1
            })
            this.setState({
                dbData: res.data,
                treeData: res.data
            })
        }
    }
    getTableData = async (selectedTitle) => {
        let { queryInfo } = this.state
        let res = await foreignSelectorTable({datasourceId: queryInfo.datasourceId, databaseId: (selectedTitle[0] || {}).id, type: (selectedTitle[0] || {}).type })
        if (res.code == 200) {
            res.data.map((item) => {
                item.level = 2
            })
            this.setState({
                tableData: res.data
            })
        }
    }
    getColumnData = async (selectedTitle) => {
        let { queryInfo } = this.state
        console.log(selectedTitle, 'getColumnData')
        let res = await foreignSelectorColumn({datasourceId: queryInfo.datasourceId, tableId: selectedTitle[1].id, type: selectedTitle[1].type })
        if (res.code == 200) {
            res.data.map((item) => {
                item.level = 3
            })
            this.setState({
                columnData: res.data
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
                suggestList: res.data
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
                selectedPath: node.props.nodeIds
            })
        }
        this.getSelectedItem()
    }
    getSelectedItem = async () => {
        let { selectedPath, treeData } = this.state
        await this.setState({selectedItem: [], selectedTitle: []})
        this.getTreeData(selectedPath)
    }
    getTreeData = async (selectedPath) => {
        for ( let index = 0;index < selectedPath.length;index ++) {
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
                selectedTitle: index > 1 ? selectedTitle : [...selectedItem]
            })
            console.log(selectedItem, 'selectedItem2++++++')
            let categoryContent = document.querySelector('.categoryContent')
            categoryContent.style.maxWidth = (selectedItem.length + 1) * 250 + 'px'
        }
    }
    renderDropdown = (menu) => {
        let { suggestList } = this.state
        return (
            <div>
                <div className='dropdownTitle'>搜索到<span>{suggestList.length}</span>个结果</div>
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
                    selectedTitle
                })
            } else {
                let array = []
                for ( let i = 0; i<data.level - 1;i++) {
                    array.push(selectedItem[i])
                }
                selectedItem = [...array]
                selectedTitle = [...array]
                selectedTitle.push(data)
                await this.setState({
                    selectedItem,
                    selectedTitle
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
                for ( let i = 0; i<data.level - 1;i++) {
                    array.push(selectedItem[i])
                }
                console.log(array,'selectedItem')
                array.push(data)
                selectedItem = [...array]
            }
        } else {
            selectedItem.push(data)
        }
        console.log(selectedItem, 'selectTree')
        await this.setState({
            selectedItem,
            selectedTitle: [...selectedItem]
        })
        if (data.level == 1) {
            this.getTableData(selectedItem)
        } else if (data.level == 2) {
            this.getColumnData(selectedItem)
        }
        // transition生效必须使用max-width
        let categoryContent = document.querySelector('.categoryContent')
        categoryContent.style.maxWidth = (selectedItem.length + 1) * 250 + 'px'
    }
    handleSearch = async (value) => {
        console.log(value,'handleSearch')
        let { queryInfo } = this.state
        queryInfo.keyword = value
        await this.setState({
            queryInfo,
            showSelectDropdown: true
        })
        this.getSuggestPath()
    }
    cancel = () => {
        this.setState({
            modalVisible: false
        })
    }
    postData = () => {
        let { selectedTitle } = this.state
        this.props.getForeignKeyData(selectedTitle)
        this.cancel()
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
            columnData
        } = this.state
        let renderLength = []
        for(let i = 0; i < selectedItem.length + 1; i++) {
            renderLength.push(' ')
        }
        return (
            <Modal
                className="foreignKeyDrawer"
                title='外键选择'
                width={800}
                visible={modalVisible}
                onCancel={this.cancel}
                maskClosable={false}
                footer={[
                    <Button
                        disabled={selectedTitle.length < 3}
                        onClick={this.postData} type='primary' loading={btnLoading}>
                        确定
                    </Button>,
                    <Button onClick={this.cancel}>
                        取消
                    </Button>,
                ]}>
                {modalVisible && (
                    <div className='foreignCategory'>
                        <div style={{ width: '100%' }}>
                            <Select
                                allowClear
                                showSearch
                                className='categorySelect'
                                filterOption={false}
                                onSearch={this.handleSearch}
                                style={{ width: '100%', margin: '0 0 16px 0' }}
                                dropdownClassName={showSelectDropdown ? 'categoryDropdown' : 'categoryDropdown hideDropdown'}
                                placeholder="请输入字段名称"
                                value={selectSuggest}
                                onChange={this.clearInput}
                                dropdownRender={this.renderDropdown}
                                suffixIcon={<span className='iconfont icon-sousuo'></span>}
                                getPopupContainer={triggerNode => triggerNode.parentNode}
                            >
                                {suggestList.map((item) => {
                                    return (
                                        <Select.Option nodeIds={item.nodeIds} key={item.nodeIdString} value={item.nodeIdString}>
                                            <span dangerouslySetInnerHTML={{ __html: item.pathNameDesc }}></span>
                                        </Select.Option>
                                    )
                                })}
                            </Select>
                        </div>
                        <Spin spinning={loading}>
                            <div className='categoryContent'>
                                {
                                    renderLength.map((item, index) => {
                                        return (
                                            <div className='categoryItem'>
                                                <div className={selectedTitle[index] ? 'itemHeader' : 'itemHeader itemHeaderGrey'}>{index == 0 ? '库选择' : (index == 1 ? '表选择' : '字段选择')}</div>
                                                <div className='itemContent HideScroll'>
                                                    {
                                                        (index == 0 ? treeData : (index == 1 ? tableData : columnData)).map((item) => {
                                                            return (
                                                                <div className={(selectedTitle[index]?selectedTitle[index].name:undefined) == item.name ? 'itemDiv itemDivSelected' : 'itemDiv'}>
                                                                    <div className='itemTitle' onClick={this.selectTree.bind(this, item)}>
                                                                        {
                                                                            item.type == 1 ? <span className="tagName">虚拟</span> : null
                                                                        }
                                                                        <span className='titleValue'>{ index == 2 && item.isPk && IMG_PK }{item.name}</span>
                                                                        <span className='titleIcon'>
                                                                            {index > 1 ? null : <span className='iconfont icon-you' style={{ marginLeft: 4 }}></span>}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                    {
                                                        !(index == 0 ? treeData : (index == 1 ? tableData : columnData)).length ? <div className='emptyLabel'>暂无数据</div> : null
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </Spin>
                        <div className="selectedPath">
                            <span className="title">当前选择：</span>
                            {
                                selectedTitle.map((item, index) => {
                                    return (
                                        <span className="value">
                                            {item.name}
                                            {
                                                index + 1 == selectedTitle.length ? null : <span className="iconfont icon-you"></span>
                                            }
                                        </span>
                                    )
                                })
                            }
                        </div>
                    </div>
                )}
            </Modal>
        )
    }
}