import {
    message
} from 'antd'
import {
    delExtractorJob,
    extractLog,
    extractLogSim,
    extractorJob
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
        page: 1,
        page_size: 20,
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
    @observable paginationDisplay = false
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
        extractType: 2,
    }

    @action.bound resetCondition() {
        this.searchCondition = {
            keyword: '',
            status: undefined,
            extractType: 2,
        }
        this.tableCurrentPage = 1
        this.pageSize = 20
        this.jobId = ''
        this.getTableData({
            page: 1
        })
    }

    @action.bound keywordChange(value) {
        this.searchCondition = {
            ...this.searchCondition,
            keyword: value.target.value,
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
    @action.bound extractTypeChange(value) {
        this.searchCondition = {
            ...this.searchCondition,
            extractType: value,
        }
    }
    // 检测数据库名唯一性
    @action.bound async dataSourceCheckUnik(req) {
        const res = await dataSourceCheck(req)
        return res
    }

    // 搜索表格数据
    @action.bound searchTableData(params) {
        this.tableCurrentPage = 1
        return this.getTableData(params)
    }

    // 获取采集列表数据
    @action.bound async getTableData(params) {
        this.tableLoading = true
        this.pagination = {
            ...params,
            ...this.searchCondition,
            area: this.area,
            jobId: this.jobId
        }
        let res = await extractorJob(this.pagination)
        runInAction(() => {
            this.tableData = res.data
            this.tableParams = params
            this.tableLoading = false
            this.pagination.total = res.total
            this.pagination.paginationDisplay = res.total > this.pagination.pageSize ? 'block' : 'none'
        })
        return {
            total: res.total,
            dataSource: res.data,
        }
    }

    // 删除日志
    @action.bound async delExtractorJobData(rows) {
        let selectedRowsArr = []
        _.map(rows.slice(), (item, key) => {
            selectedRowsArr.push(item.id.toString())
        })

        const res = await delExtractorJob(selectedRowsArr)
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
    @observable logId = []
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
    @action.bound setLogId(logId) {
        this.logId = logId
    }
    // 页数改变
    @action.bound handlePaginationOnChangeRecord(page, pageSize) {
        this.getExtractLog(page, pageSize, this.simLog)
    }

    // 请求日志
    @action.bound async getExtractLog(page, pageSize, hasSim) {
        this.listLoading = true
        let req = {}
        req.logId = this.logId
        req.page = page ? page : this.tableCurrentPageRecord
        req.page_size = pageSize ? pageSize : this.pageSize

        let res = {}
        if (hasSim) {
            this.simLog = true
            res = await extractLogSim(req)
        } else {
            this.simLog = false
            res = await extractLog(req)
        }
        if (res.code == 200) {
            let recordData = []
            _.map(res.data, (item, key) => {
                recordData.push({
                    content: item[1],
                })
            })
            runInAction(() => {
                this.tableCurrentPageRecord = page
                this.recordData = recordData
                this.reportDataSourcesTotalRecord = res.total
                this.listLoading = false
            })
        }
    }
}

const store = new Store()
export default store