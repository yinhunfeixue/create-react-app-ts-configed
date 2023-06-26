import EmptyLabel from '@/component/EmptyLabel'
import { message, Button, Spin, Divider } from 'antd'
import ModuleTitle from '@/component/module/ModuleTitle'
import { getReportList, getSourceList, reportUpload } from 'app_api/metadataApi'
import { addManualJob, getManualJob } from 'app_api/autoManage'
import { Tooltip } from 'lz_antd'
import React, { Component } from 'react'
import '../../index.less'
import Cache from 'app_utils/cache'
import { displayTableInfoByDGDLItem, tableDGDLconfirm } from 'app_api/autoManage'

export default class CategoryCheck extends Component {
    constructor(props) {
        super(props)
        this.state = {
            categoryInfo: {},
            standardList: [],
            selectedLevel: '',
            total: 0,
            loading: false,
        }
    }
    componentDidMount = () => {
        this.getTableList()
    }
    getTableList = async (params = {}) => {
        let { selectedLevel } = this.state
        let query = {
            tableId: this.props.detailInfo.tableId,
            item: '表的分类',
        }
        let res = await displayTableInfoByDGDLItem(query)
        if (res.code == 200) {
            if (res.data.tableClzDGDLS.length) {
                selectedLevel = res.data.tableClzDGDLS[0].content
            }
            this.setState({
                categoryInfo: res.data,
                standardList: res.data.tableClzDGDLS,
                selectedLevel,
            })
            this.props.getTotal('clzCount', res.data.tableClzDGDLS.length)
        }
    }
    selectLevel = (data) => {
        this.setState({
            selectedLevel: data.content,
        })
    }
    check = async (value) => {
        let { selectedLevel, standardList, categoryInfo } = this.state
        let tableDGDLItem = { ...categoryInfo }
        standardList.map((item, index) => {
            if (item.content == selectedLevel) {
                tableDGDLItem.tableClzDGDLS = [item]
            }
        })
        let query = {
            checkOrNot: value,
            item: '表的分类',
            userName: Cache.get('userinfo').lastname,
            tableDGDLItem,
        }
        this.setState({ loading: true })
        let res = await tableDGDLconfirm(query)
        this.setState({ loading: false })
        if (res.code == 200) {
            message.success('操作成功')
            this.getTableList()
            this.props.reload()
        }
    }
    render() {
        const { standardList, selectedLevel, loading } = this.state
        return (
            <React.Fragment>
                <div className='standardCheck'>
                    <ModuleTitle style={{ marginBottom: 16 }} title='分类推荐' />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className='HControlGroup'>
                            {standardList.map((item) => {
                                return (
                                    <div onClick={this.selectLevel.bind(this, item)} className={selectedLevel == item.content ? 'tagItem selectedTagItem' : 'tagItem'}>
                                        {item.content}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <Divider />
                    <div>
                        <Button onClick={this.check.bind(this, true)} type='primary'>
                            通过
                        </Button>
                        <Button onClick={this.check.bind(this, false)} className='dangerBtn' style={{ marginLeft: 8 }}>
                            不通过
                        </Button>
                    </div>
                </div>
                {loading ? (
                    <div className='checkSpin'>
                        <Spin spinning={loading}></Spin>
                    </div>
                ) : null}
            </React.Fragment>
        )
    }
}
