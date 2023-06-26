import IconFont from '@/component/IconFont'
import DrawerLayout from '@/component/layout/DrawerLayout'
import { Input, Spin, Tooltip } from 'antd'
import { auditListDs } from 'app_api/dataSecurity'
import React, { Component } from 'react'
import '../index.less'

export default class DatasourceDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            treeQueryInfo: {
                keyword: '',
                needAll: true,
            },
            treeData: [],
            treeLoading: false,
            selectedTable: {},
            showFilter: false,
            datasourceIds: [],
            datasourceInfo: [],
        }
    }
    openModal = (data) => {
        this.setState({
            modalVisible: true,
            selectedTable: data,
        })
        this.getLeftTreeData()
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
    }
    getLeftTreeData = async () => {
        let { treeQueryInfo, datasourceIds } = this.state
        let query = {
            ...treeQueryInfo,
        }
        this.setState({ treeLoading: true })
        let res = await auditListDs(query)
        this.setState({ treeLoading: false })
        if (res.code == 200) {
            this.setState({
                treeData: res.data.list,
            })
        }
    }
    changeTreeKeyword = async (e) => {
        let { treeQueryInfo } = this.state
        treeQueryInfo.keyword = e.target.value
        await this.setState({
            treeQueryInfo,
        })
    }
    treeSearch = async () => {
        let { treeQueryInfo } = this.state
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
        const { modalVisible, treeData, treeLoading, treeQueryInfo, selectedTable } = this.state

        const { getContainer } = this.props
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
                    getContainer,
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <div className='header'>
                            <Tooltip title='收起'>
                                <span onClick={this.cancel} className='iconfont icon-botton_down'></span>
                            </Tooltip>
                            <span onClick={this.cancel}>数据源选择</span>
                        </div>
                        <div className='HideScroll datasourceArea' ref={(dom) => (this.scrollRef = dom)} onScrollCapture={this.onScrollEvent}>
                            <div>
                                <div className='searchGroup'>
                                    <Input.Search
                                        prefix={<IconFont type='icon-search' />}
                                        onSearch={this.treeSearch}
                                        value={treeQueryInfo.keyword}
                                        onChange={this.changeTreeKeyword}
                                        placeholder='输入数据源名，回车搜索'
                                    />
                                </div>
                                <Spin spinning={treeLoading}>
                                    {treeData.length ? (
                                        <div>
                                            {treeData.map((item) => {
                                                return (
                                                    <div
                                                        onClick={this.onSelect.bind(this, item)}
                                                        className={selectedTable.datasourceId == item.datasourceId ? 'tableItem tableItemSelected' : 'tableItem'}
                                                    >
                                                        <span className='treeName'>
                                                            <span className='iconfont icon-xitong'></span>
                                                            {item.datasourceNameCn}
                                                        </span>
                                                    </div>
                                                )
                                            })}
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
