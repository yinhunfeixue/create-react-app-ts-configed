import {
    message
} from 'antd'
import {
    getFormula
} from 'app_api/addNewColApi'
import {
    matchBizLimit,
    searchBizLimit
} from 'app_api/metadataApi'
import {
    activeList,
    activeViews,
    lastOptReports,
    statistic
} from 'app_api/reportActive'
import {
    searchMetricsBusiness,
    usingBusinessIds
} from 'app_api/wordSearchApi'
import getTreeService from 'app_page/services/metaData/getTreeServices'
import {
    action,
    observable,
    runInAction
} from 'mobx'

class Store {
    @observable datasourceId = ''
    // 页签配置
    @observable pagination = {
        page: 1,
        page_size: 10,
        total: 0,
    }
    @observable tableLoading = false
    //分页器是否显示
    @observable paginationDisplay = false
    // 客户分群表格数据
    @observable tableData = []

    @observable activeCountInfo = {}
    @observable reportTreeData = []
    @observable defaultReportTreeSelectedKeys = []
    @observable lastOption = {}
    @observable indexmaChangeInfo = {}
    @observable showCreateBtn = true
    @observable reportsId = ''
    @observable viewsList = []
    // 搜索框列表
    @observable searchItem = []
    // 歧义项
    @observable ambiguityList = []
    // 设置node列表
    @observable nodeList = []

    @observable sourceData = {}

    @observable sourceDataCode = 0

    @observable loading = false

    @observable indexSampleList = []

    // 业务线id
    @observable businessId = ''
    // 多业务线id
    @observable businessIds = ''
    // 左侧栏loading效果
    @observable leftLoading = false
    // 业务线id列表
    @observable businessIdList = []
    // 可用的业务线列表
    @observable disableBusiness = []
    // 不可用的业务线列表
    @observable usableBusiness = []
    // 可用的业务线id列表
    @observable usableBusinessIds = []
    // 正在使用的业务线id列表
    @observable usingBusinessIds = []
    // 业务线类型
    @observable type = 0
    // 设置搜索栏内容
    @observable metricsList = []
    // 是否发生了合并行为
    @observable isMerge = false
    // 左侧栏选中项
    @observable leftSelectOption = []
    // 临时formlua
    @observable formulaList = []
    // 临时业务线id
    @observable tempBusinessId = ''
    // 创建csv所需id
    @observable busiGroupId = ''

    @observable viewSelectedIds = []

    // 设置busiGroupId
    @action.bound setBusiGroupId(id) {
        this.busiGroupId = id
    }
    // 设置多业务先id
    @action.bound setBusinessIds(list) {
        this.businessIds = list
    }
    // 设置业务线id列表
    @action.bound setBusinessIdList(list) {
        this.businessIdList = list
    }
    // 设置正在使用的业务线id列表
    @action.bound setUsingBusinessIds(list) {
        this.usingBusinessIds = list
    }
    // 设置formula列表
    @action.bound setFormulaList(list) {
        this.formulaList = list
    }
    @action setIsMerge = (bl) => {
        this.isMerge = bl
    }
    @action.bound async setSearchItem(searchItem, isMerge) {
        if (isMerge) {
            await this.setIsMerge(true)
        } else {
            await this.setIsMerge(false)
        }
        this.searchItem = searchItem
    }
    // 设置歧义项
    @action.bound setAmbiguity(ambiguityList) {
        this.ambiguityList = ambiguityList
    }

    // 设置选中视图id信息
    @action.bound setViewSelectedIds(viewIds) {
        this.viewSelectedIds = viewIds
    }

    // 搜索方法
    @action.bound async onSearch(params) {
        this.loading = true
        this.leftLoading = true
        this.sourceDataCode = 666
        this.tempBusinessId = this.reportsId
        params.tempBusinessId = this.tempBusinessId
        let res = await searchBizLimit(params)
        if (res.code === 200) {
            // let nodeList = []
            // res.data.nodeList.map((value, index) => {
            //     if (value.id) {
            //         nodeList.push({ content: value.content, id: value.id, businessId: value.businessId })
            //     }
            // })

            runInAction(() => {
                // this.searchItem = res.data.nodeList
                this.nodeList = res.data.usedNodeList
                this.sourceData = res.data
                this.sourceDataCode = res.code

                // this.getActiveViews(this.reportsId)
                // this.findAmbiguity(res.data.nodeList)
            })
        } else {
            runInAction(() => {
                this.sourceData = {}
                this.sourceDataCode = res.code
            })
        }

        this.loading = false
    }
    // 清空呢容
    clearContent = (clear) => {
        if (clear) {
            this.sourceDataCode = 0
        }
        this.sourceData = {}
    }
    // 重置数据
    clearAll = () => {
        this.businessIdList = []
        this.leftSelectOption = []
        this.searchItem = []
        this.ambiguityList = []
        this.nodeList = []
        this.sourceData = {}
        this.sourceDataCode = 0
        this.businessId = 0
        this.type = 0
        this.metricsList = []
        this.formulaList = []
        // this.tempBusinessId = ''
    }
    // 重置数据
    clearButton = () => {
        this.datasourceId = ''
        this.usableBusiness = []
        this.tempBusinessId = ''
        this.businessIds = []
        this.usingBusinessIds = []
        this.businessIdList = []
        this.leftSelectOption = []
        this.searchItem = []
        this.ambiguityList = []
        this.nodeList = []
        this.sourceData = {}
        this.sourceDataCode = 0
        this.businessId = 0
        this.type = 0
        this.metricsList = []
    }
    // 设置左侧栏
    @action.bound async setNodeList(leftSelectOption) {
        this.leftSelectOption = leftSelectOption
        this.nodeList = leftSelectOption
    }
    // 句式识别
    @action.bound async onMatch(params) {
        const {
            businessIds
        } = this
        let usingBusinessIds = []
        this.tempBusinessId = this.reportsId
        params.tempBusinessId = this.tempBusinessId
        let res = await matchBizLimit(params)
        if (res.code === 200) {
            let nodeList = []
            let leftSelectOption = []
            res.data.map((value, index) => {
                if (value.businessId) {
                    if (value.useBusinessIds) {
                        value.useBusinessIds.map((value1, index) => {
                            if (usingBusinessIds.findIndex((val) => val === value1) === -1) {
                                usingBusinessIds.push(value1)
                            }
                        })
                    } else {
                        if (usingBusinessIds.findIndex((value) => value === value.businessId) === -1) {
                            usingBusinessIds.push(value.businessId)
                        }
                    }
                    if (value.type !== 5) {
                        leftSelectOption.push({
                            content: value.content,
                            id: value.id,
                            businessId: value.businessId
                        })
                    }
                    nodeList.push({
                        content: value.content,
                        id: value.id,
                        businessId: value.businessId
                    })
                } else {
                    if (value.type !== 5) {
                        leftSelectOption.push({
                            content: value.content,
                            id: value.id
                        })
                    }
                    nodeList.push({
                        content: value.content,
                        id: value.id
                    })
                }
            })
            if (!(usingBusinessIds.toString() === this.usingBusinessIds.toString())) {
                // this.getActiveViews(this.reportsId)
                // this.getSearchMetricsBusiness({
                //     usingBusinessIds,
                //     businessIds
                // })
            }
            runInAction(() => {
                this.usingBusinessIds = usingBusinessIds
                this.searchItem = res.data
                this.nodeList = res.data
                this.leftSelectOption = leftSelectOption
                if (res.data.length > 0) {
                    this.findAmbiguity(res.data)
                }
            })

            return res.data
        }
    }
    // 找到歧义项
    @action.bound findAmbiguity = (searchItem) => {
        let ambiguityList = []
        searchItem.map((value, index) => {
            if (value.status === 2) {
                if (value.type === 4) {
                    ambiguityList.push({
                        content: value.content,
                        name: value.sentenceTagNode[0].cnPath,
                        type: value.type,
                        status: value.status,
                        dataIndex: index,
                    })
                } else {
                    ambiguityList.push({
                        content: value.content,
                        name: value.cnPath,
                        type: value.type,
                        status: value.status,
                        dataIndex: index,
                    })
                }
            } else if (value.status === 1 || value.status === 3) {
                ambiguityList = [{
                    content: value.content,
                    /// name: value.sentenceTagNode[0].path,
                    type: value.type,
                    status: value.status,
                    dataIndex: index,
                }, ]
            }
        })
        this.ambiguityList = ambiguityList
    }
    // 切换业务线
    @action.bound changeRadioValue = (id, type) => {
        let ids = id.split(',')
        this.businessIdList.unshift({
            id: ids[0],
            type
        })
        this.businessIds = ids
        this.usableBusinessIds = ids
        // this.usingBusinessIds = [id]
    }
    // 设置临时业务线id
    @action.bound setTempBusinessId = (id) => {
        this.tempBusinessId = id
    }
    @action.bound async getActiveViews(reportsId) {
        this.reportsId = reportsId
        this.leftLoading = true
        let res = await activeViews({
            reportsId,
            nodeList: this.nodeList
        })
        if (res.code == 200) {
            this.viewsList = res.data
            let usableBusinessIds = res.data.map((value, index) => {
                return value.businessId
            })
            this.usableBusinessIds = usableBusinessIds
        }
        this.leftLoading = false
    }
    // 获取多个业务线下指标信息
    @action.bound async getSearchMetricsBusiness(params) {
        // this.leftLoading = true
        if (this.tempBusinessId) {
            params.tempBusinessId = this.tempBusinessId
        }
        params.needDatasourceId = true
        let res = await searchMetricsBusiness(params)
        if (res.code === 200) {
            runInAction(() => {
                this.usableBusiness = res.data.usableBusiness
                this.disableBusiness = res.data.disableBusiness
                let usableBusinessIds = res.data.usableBusiness.map((value, index) => {
                    return value.businessId
                })
                this.usableBusinessIds = usableBusinessIds
                // this.leftLoading = false
                this.datasourceId = res.data.usableBusiness[0].datasourceId
            })
        }
        this.getFormula({
            tempBusinessId: this.tempBusinessId,
            usableBusinessIds: this.usableBusinessIds
        })
    }
    // 清除参数
    @action.bound clearParams = () => {
        this.usingBusinessIds = []
        this.searchItem = []
        this.ambiguityList = []
        this.nodeList = []
    }
    // 清除左侧参数
    @action.bound clearLeftParams = () => {
        this.leftSelectOption = []
    }

    @action.bound setLoading = (status) => {
        this.loading = status
    }

    // 首页推荐示例
    @action.bound async getIndexSampleData(params = {}) {
        let res = await usingBusinessIds(params)
        if (res.code === 200) {
            runInAction(() => {
                this.indexSampleList = res.data
                this.businessIds = res.data
            })
        }
    }

    // 设置选中项目
    @action.bound async setLeftOption(params) {
        this.leftSelectOption = params
        let searchItem = [...this.searchItem]
        params.map((value, index) => {
            let ifHas = false
            searchItem.map((val, dataIndex) => {
                if (value.tempBusinessId && val.id === value.id) {
                    searchItem[dataIndex] = value
                    ifHas = true
                }
                if (val.type !== 5 && val.id && val.id === value.id && val.businessId === value.businessId) {
                    searchItem[dataIndex] = value
                    ifHas = true
                }
            })
            if (!ifHas && value.id) {
                searchItem.push(value)
            }
        })
        this.searchItem = searchItem
    }
    // 删除条目
    @action.bound async delLeftOption(params, id) {
        this.leftSelectOption = params
        let searchItem = [...this.searchItem]
        searchItem.map((val, index) => {
            if (val.id === id) {
                searchItem.splice(index, 1)
                return
            }
        })
        this.searchItem = searchItem
    }

    // 左侧选中
    @action.bound async leftSelected(data) {
        let leftSelectOption = []
        const {
            usingBusinessIds,
            businessIds
        } = this
        // let ifRefresh = false
        data.map((value, index) => {
            // 判断是formula还是正常业务线参数
            if (value.businessId) {
                if (value.type !== 5) {
                    leftSelectOption.push({
                        content: value.content,
                        id: value.id,
                        businessId: value.businessId
                    })
                }
                if (usingBusinessIds.findIndex((value) => value === value.businessId) === -1) {
                    // ifRefresh = true
                    usingBusinessIds.push(value.businessId)
                }
            } else {
                if (value.type !== 5) {
                    leftSelectOption.push({
                        content: value.content,
                        id: value.id
                    })
                }
            }
        })
        runInAction(() => {
            this.leftSelectOption = leftSelectOption
        })
    }
    // 获取临时formula
    @action.bound async getFormula(params) {
        let res = await getFormula(params)
        if (res.code === 200) {
            this.setFormulaList(res.data)
        }
    }
    @action.bound setShowCreateBtn(value) {
        this.showCreateBtn = value
    }
    @action.bound setIndexmaChangeInfo(value) {
        this.indexmaChangeInfo = value
    }

    @action.bound getMetadataTree() {
        getTreeService.getReportTree({
            id: null,
            keyword: null
        }).then((res) => {
            if (res.code == 200) {
                res.data.level = 0
                this.reportTreeData = [res.data]
                this.defaultReportTreeSelectedKeys = [res.data.id.toString()]
            }
        })
    }
    @action.bound async getLastOptReports() {
        let res = await lastOptReports()
        runInAction(() => {
            if (res.code == 200) {
                this.lastOption = res.data
            }
        })
    }
    @action.bound async getPartitionData(categoryIdList) {
        let res = await statistic(categoryIdList)
        runInAction(() => {
            if (res.code == 200) {
                this.activeCountInfo = res.data
            }
        })
    }
    // @action.bound async getTableList(params) {
    //     let query = {
    //         page: params.pagination ? params.pagination.page : 1,
    //         pageSize: params.pagination ? params.pagination.page_size : 10,
    //         activeStatusList: params.tableType == 1?undefined:(params.tableType == 2?0:(params.tableType == 3?1:2)),
    //         categoryIdList: params.categoryIdList
    //     }
    //     let res = await activeList(query)
    //     if (res.code == 200) {
    //         return res
    //     }
    // }
    // 获取列表数据
    @action.bound async getTableList(params) {
        this.tableLoading = true
        this.pagination = {
            ...this.pagination,
            ...params
        }
        let res = await activeList(this.pagination)
        runInAction(() => {
            this.tableData = res.data
            console.log(this.tableData, 'this.tableData')
            this.pagination.total = res.total
            this.tableLoading = false
        })
    }
}

const store = new Store()
export default store