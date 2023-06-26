import {
    message
} from 'antd'
import {
    getSourceList,
    getTaskList,
    getTaskLogList,
    postDeleteTask
} from 'app_api/metadataApi'
import {
    action,
    observable,
    runInAction
} from 'mobx'
import _ from 'underscore'

class Store {
    // 页签配置
    @observable pagination = {
        pageNo: 1,
        pageSize: 20,
        total: 0,
        paginationDisplay: 'none',
    }
    //表格loading
    @observable tableLoading = true
    //当前表格第几页
    @observable tableCurrentPage = 1
    //初始一共页数
    @observable reportDataSourcesTotal = 0
    //每页多少条数据
    @observable pageSize = 20
    //分页器是否显示
    // @observable paginationDisplay = false
    // 客户分群表格数据
    @observable tableData = []
    // 数据源下拉框数据
    @observable sourceData = []
    //表格的序号
    @observable orderNumber = 0
    //模态框显示隐藏
    @observable modalVisible = false
    //当前选中行的状态
    @observable recordStatus = ''
    // 表格选择的项
    @observable selectedRows = []
    // 表格选择的项
    @observable selectedRowKeys = []
    // 区分是指标还是元数据还是标准
    @observable area = ''

    @observable jobId = ''
    @action.bound changeJobId(jobId) {
        this.jobId = jobId
    }
    // 表格复选框改变
    @action.bound onSelectChange(selectedRowsKeys, selectedRows) {
        this.selectedRowKeys = selectedRowsKeys
        this.selectedRows = selectedRows
    }
    // 清空表格复选框选中
    @action.bound clearSelectChange() {
        this.selectedRowKeys = []
        this.selectedRows = []
    }
    // 搜索条件
    @observable searchCondition = {
        keyword: '',
        status: undefined,
        subType: undefined,
        businessId: undefined,
        taskJobId: undefined,
    }

    @action.bound resetCondition(value) {
        this.searchCondition = {
            keyword: '',
            status: undefined,
            subType: undefined,
            businessId: undefined,
            taskJobId: undefined,
            ...value,
        }
        this.tableCurrentPage = 1
        this.pageSize = 20
    }
    @action.bound resetAndSearch() {
        this.resetCondition()
        this.searchTableData()
    }

    @action.bound datasourceIdChange(value, request = true) {
        this.searchCondition = {
            ...this.searchCondition,
            businessId: value !== undefined ? parseInt(value) : value,
        }
        if (request) {
            if (this.controller) {
                this.controller.reset()
            }
        }
        runInAction(() => {
            // this.searchTableData({ page: 1 })
        })
    }

    // 获取数据源下拉框数据
    @action.bound async getDataSourceData() {
        let req = {}
        req.page = 1
        req.page_size = 10000

        const res = await getSourceList(req)
        if (res.code == 200) {
            runInAction(() => {
                this.sourceData = res.data
            })
        }
    }
    @action.bound getTaskJobId(id) {
        this.searchCondition = {
            ...this.searchCondition,
            taskJobId: id,
        }
    }

    @action.bound keywordChange(value) {
        this.searchCondition = {
            ...this.searchCondition,
            keyword: value,
        }
    }
    @action.bound showModal() {
        this.modalVisible = true
    }
    @action.bound hideModal() {
        this.modalVisible = false
    }
    @action.bound statusChange(value) {
        this.searchCondition = {
            ...this.searchCondition,
            status: value,
        }
        runInAction(() => {
            this.searchTableData({
                page: 1
            })
        })
    }
    @action.bound extractTypeChange(value, request = true) {
        this.searchCondition = {
            ...this.searchCondition,
            subType: value,
        }
        if (request) {
            if (this.controller) {
                this.controller.reset()
            }
        }
        runInAction(() => {
            // this.searchTableData({ page: 1 })
        })
    }
    // 检测数据库名唯一性
    @action.bound async dataSourceCheckUnik(req) {
        const res = await dataSourceCheck(req)
        return res
    }

    // 搜索表格数据
    @action.bound searchTableData(params) {
        this.tableCurrentPage = 1
        if (this.controller) {
            this.controller.reset()
        }
    }

    // 获取采集列表数据
    @action.bound async getTableData(params) {
        console.log(params, 'params')
        this.tableLoading = true
        if (params !== undefined) {
            this.pagination.pageNo = params.page
            this.pagination.pageSize = params.page_size !== undefined ? params.page_size : this.pagination.pageSize
        }
        this.pagination = {
            ...this.pagination,
            ...params,
            ...this.searchCondition,
            type: 1,
            businessType: 1001,
        }
        let res = await getTaskList(this.pagination)
        runInAction(() => {
            this.tableData = res.data
            // this.tableParams = params
            this.tableLoading = false
            this.pagination.total = res.total
            this.pagination.paginationDisplay = res.total > this.pagination.pageSize ? 'block' : 'none'
        })
        return {
            dataSource: res.data,
            total: res.total,
        }
    }

    // 删除日志
    @action.bound async delExtractorJobData() {
        let selectedRowsArr = []
        _.map(this.selectedRows.slice(), (item, key) => {
            selectedRowsArr.push(item.id.toString())
        })

        const res = await postDeleteTask({
            ids: selectedRowsArr
        })
        if (res.code == 200) {
            message.success(res.msg)
            this.clearSelectChange()
            this.orderNumber = 0
            this.tableCurrentPage = 1
            this.getTableData({
                page: 1
            })
        }
    }

    // 日志详情
    // 日志数据
    @observable recordData = []
    // 日志id
    @observable taskId = []
    // 请求日志的多少页
    @observable tableCurrentPageRecord = 1
    // 日志总条数
    @observable reportDataSourcesTotalRecord = 0
    // 日志列表外面的loading
    @observable listLoading = false

    // 点击查看日志 显示loading
    @action.bound showLoading() {
        this.listLoading = true
    }
    // 重置日志数据
    @action.bound resetRecordData() {
        this.tableCurrentPageRecord = 1
        this.recordData = []
    }
    @action.bound setLogId(taskId) {
        this.taskId = taskId
    }
    // 页数改变
    @action.bound handlePaginationOnChangeRecord(page, pageSize) {
        this.getExtractLog(page, pageSize, this.simLog)
    }

    // 请求日志
    @action.bound async getExtractLog(page, pageSize, hasSim) {
        this.listLoading = true
        let req = {}
        req.taskId = this.taskId
        req.pageNo = page ? page : this.tableCurrentPageRecord
        req.pageSize = pageSize ? pageSize : this.pageSize

        let res = {}
        res = await getTaskLogList(req)

        if (res.code == 200) {
            runInAction(() => {
                this.tableCurrentPageRecord = page
                this.recordData = res.data
                this.reportDataSourcesTotalRecord = res.total
                this.listLoading = false
            })
        }
    }
}

const store = new Store()
export default store