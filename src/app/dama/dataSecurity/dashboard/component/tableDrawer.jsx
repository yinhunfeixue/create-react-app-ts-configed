import IconFont from '@/component/IconFont'
import DrawerLayout from '@/component/layout/DrawerLayout'
import { Button, Input, Select, Spin, Tooltip } from 'antd'
import { levelListTableByDs } from 'app_api/dataSecurity'
import { databaseList } from 'app_api/examinationApi'
import React, { Component } from 'react'
import '../index.less'

export default class TableDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            treeQueryInfo: {
                keyword: '',
                page: 1,
                pageSize: 30,
            },
            treeData: [],
            treeTotal: 0,
            treeLoading: false,
            selectedTable: {},
            showFilter: false,
            databaseList: [],
        }
    }
    openModal = async (data, datasourceId) => {
        let { treeQueryInfo } = this.state
        treeQueryInfo = {
            keyword: '',
            page: 1,
        }
        await this.setState({
            modalVisible: true,
            selectedTable: data,
            datasourceId: datasourceId,
            treeQueryInfo,
            treeData: [],
        })
        this.getLeftTreeData()
        this.getDatabase()
    }
    getDatabase = async () => {
        const { datasourceId } = this.state
        let res = await databaseList({ datasourceId: datasourceId, page: 1, page_size: 999999 })
        if (res.code == 200) {
            this.setState({
                databaseList: res.data,
            })
        }
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    getLeftTreeData = async () => {
        let { treeQueryInfo, datasourceId, treeData } = this.state
        treeQueryInfo.pageSize = 30
        let query = {
            ...treeQueryInfo,
            datasourceId,
        }
        this.setState({ treeLoading: true })
        let res = await levelListTableByDs(query)
        this.setState({ treeLoading: false })
        if (res.code == 200) {
            res.data.list.map((item) => {
                item.senColumnCountRate = ((item.senColumnCount / item.columnCount) * 100).toFixed(2)
                item.lvlColumnCountRate = ((item.lvlColumnCount / item.columnCount) * 100).toFixed(2)
                let tableData = this.getPercent([item.lvlOneCount, item.lvlTwoCount, item.lvlThreeCount, item.lvlFourCount, item.lvlFiveCount], item.lvlColumnCount)
                item.pieData = this.getPieData(tableData)
            })
            treeData = treeData.concat(res.data.list)
            console.log(treeData, 'getLeftTreeData')
            this.setState({
                treeData,
            })
            this.setState({
                treeData,
                treeTotal: res.data.total,
            })
        }
    }
    nextPage = async () => {
        let { treeQueryInfo } = this.state
        treeQueryInfo.page++
        await this.setState({ treeQueryInfo })
        this.getLeftTreeData()
    }
    getPercent(data, total) {
        let array = []
        data.map((item) => {
            let value = total > 0 ? ((item / total) * 100).toFixed(2) : 0
            array.push(value)
        })
        return array
    }
    getPieData(data) {
        let pieData = [
            { value: data[0], name: ' 一级' },
            { value: data[1], name: ' 二级' },
            { value: data[2], name: ' 三级' },
            { value: data[3], name: ' 四级' },
            { value: data[4], name: ' 五级' },
        ]
        return pieData
    }
    changeTreeKeyword = async (e) => {
        let { treeQueryInfo } = this.state
        treeQueryInfo.keyword = e.target.value
        await this.setState({
            treeQueryInfo,
        })
    }
    changeTreeSelect = async (name, e) => {
        let { treeQueryInfo } = this.state
        treeQueryInfo[name] = e
        await this.setState({
            treeQueryInfo,
        })
        this.treeSearch()
    }
    treeSearch = async () => {
        let { treeQueryInfo } = this.state
        treeQueryInfo.page = 1
        document.querySelector('.tableArea').scrollTop = 0
        await this.setState({
            treeQueryInfo,
            treeData: [],
        })
        this.getLeftTreeData()
    }
    onSelect = async (data) => {
        await this.setState({
            selectedTable: data,
        })
        this.cancel()
        this.props.getSelectedData && this.props.getSelectedData(data)
    }
    render() {
        const { modalVisible, treeData, treeLoading, treeQueryInfo, showFilter, selectedTable, databaseList, treeTotal } = this.state
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'distributionTableDrawer',
                    title: '',
                    width: 280,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: false,
                    placement: 'bottom',
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <div className='header'>
                            <Tooltip title='收起'>
                                <span onClick={this.cancel} className='iconfont icon-botton_down'></span>
                            </Tooltip>
                            表选择
                        </div>
                        <div className='HideScroll tableArea' ref={(dom) => (this.scrollRef = dom)} onScrollCapture={this.onScrollEvent}>
                            <div>
                                <div className='searchGroup'>
                                    <Input.Search
                                        prefix={<IconFont type='icon-search' />}
                                        onSearch={this.treeSearch}
                                        value={treeQueryInfo.keyword}
                                        onChange={this.changeTreeKeyword}
                                        placeholder='输入表名，回车搜索'
                                    />
                                    <span className={showFilter ? 'showFilter filterIcon' : 'filterIcon'}>
                                        <span onClick={() => this.setState({ showFilter: !showFilter })} className='iconfont icon-Filter'></span>
                                        {treeQueryInfo.databaseId ? <span className='statusDot'></span> : null}
                                    </span>
                                    {showFilter ? (
                                        <div style={{ marginTop: 8 }}>
                                            <Select
                                                style={{ width: '100%' }}
                                                allowClear
                                                showSearch
                                                optionFilterProp='title'
                                                onChange={this.changeTreeSelect.bind(this, 'databaseId')}
                                                value={treeQueryInfo.databaseId}
                                                placeholder='所属库'
                                            >
                                                {databaseList.map((item) => {
                                                    return (
                                                        <Select.Option title={item.physicalDatabase} value={item.id} key={item.id}>
                                                            {item.physicalDatabase}
                                                        </Select.Option>
                                                    )
                                                })}
                                            </Select>
                                        </div>
                                    ) : null}
                                </div>
                                <Spin spinning={treeLoading}>
                                    {treeData.length ? (
                                        <div>
                                            {treeData.map((item) => {
                                                return (
                                                    <div onClick={this.onSelect.bind(this, item)} className={selectedTable.tableId == item.tableId ? 'tableItem tableItemSelected' : 'tableItem'}>
                                                        <div>
                                                            <span className='treeName'>
                                                                <span style={{ color: '#6A747F', marginRight: 8 }} className='iconfont icon-biao1'></span>
                                                                {item.tableName}
                                                            </span>
                                                            <span className='treeCount'>{item.columnCount || 0}</span>
                                                        </div>
                                                        <div style={{ color: '#5E6266' }}>
                                                            <span className='treeName'>
                                                                <span style={{ color: '#6A747F', marginRight: 8 }} className='iconfont icon-ku'></span>
                                                                {item.databaseName}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                            {treeTotal > 30 ? (
                                                <Button onClick={this.nextPage} type='link' block>
                                                    下一页
                                                </Button>
                                            ) : null}
                                        </div>
                                    ) : (
                                        <div style={{ marginTop: 80, textAlign: 'center', color: '#C4C8CC' }}>- 暂无数据 -</div>
                                    )}
                                </Spin>
                            </div>
                        </div>
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}
