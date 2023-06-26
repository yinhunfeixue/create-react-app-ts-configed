import {
    message
} from 'antd'
import {
    getSourceList,
    getTaskJobList,
    postChangeBatchTaskJobStatus,
    postChangeTaskJobStatus,
    postDeleteBatchTaskJob,
    postDeleteTaskJob,
    postRunBatchTaskJob,
    postRunTaskJob,
} from 'app_api/metadataApi'
import {
    action,
    observable,
    runInAction
} from 'mobx'
import _ from 'underscore'

class Store {
    @observable inTerval = {}
    //表格loading
    @observable tableLoading = true
    // 表格数据
    @observable tableData = []
    // 数据源下拉框数据
    @observable sourceData = []
    @observable sourceDataLoading = false
    // 表格选择的项
    @observable selectedRows = []
    // 表格选择的项
    @observable selectedRowKeys = []

    @observable tablePagination = {
        total: '',
        page: 1,
        page_size: 20,
        paginationDisplay: 'none',
    }

    // 清理表格数据
    @action.bound clearTable() {
        this.tableData = []
    }

    // 表格复选框改变
    @action.bound onSelectChange(selectedRowsKeys, selectedRows) {
        this.selectedRows = selectedRows
        this.selectedRowKeys = selectedRowsKeys
        console.log(this.selectedRows.length)
    }

    // 清空表格复选框选中
    @action.bound clearSelectChange() {
        this.selectedRowKeys = []
        this.selectedRows = []
    }

    @action.bound resetCondition() {
        this.searchCondition = {
            keyword: undefined,
            status: undefined,
            businessId: undefined,
            taskSubType: undefined,
            lastStatus: undefined,
        }
        this.tablePagination = {
            total: '',
            pageNo: 1,
            pageSize: 20,
            paginationDisplay: 'none',
        }
    }
    @action.bound resetAndSearch() {
        this.resetCondition()
        this.getJobData()
    }

    // 搜索条件
    @observable searchCondition = {
        keyword: undefined,
        status: undefined,
        businessId: undefined,
        taskSubType: undefined,
        lastStatus: undefined,
    }

    @action.bound keywordChange(value) {
        this.searchCondition = {
            ...this.searchCondition,
            keyword: value,
        }
    }
    @action.bound statusChange(value) {
        this.searchCondition = {
            ...this.searchCondition,
            status: value,
        }
        // runInAction(() => {
        //     this.getJobData({ page: 1 })
        // })
    }
    @action.bound lastStatusChange(value) {
        this.searchCondition = {
            ...this.searchCondition,
            lastStatus: value,
        }
        // runInAction(() => {
        //     this.getJobData({ page: 1 })
        // })
    }

    @action.bound taskSubTypeChange(value) {
        this.searchCondition = {
            ...this.searchCondition,
            taskSubType: value,
        }
        // runInAction(() => {
        //     this.getJobData({ page: 1 })
        // })
    }

    @action.bound datasourceIdChange(value) {
        console.log(value)
        this.searchCondition = {
            ...this.searchCondition,
            businessId: value,
        }
        // runInAction(() => {
        //     this.getJobData({ page: 1 })
        // })
    }

    // 获取数据源下拉框数据
    @action.bound async getDataSourceData(params) {
        let req = {
            collectMethod: params
        }
        req.page = 1
        req.page_size = 10000
        req.more = true
        req.brief = false
        req.validState = 1
        this.sourceDataLoading = true
        const res = await getSourceList(req)
        this.sourceDataLoading = false
        if (res.code == 200) {
            runInAction(() => {
                this.sourceData = res.data
            })
        }
    }
    @action.bound async getTableData(req) {
        const res = await getTaskJobList(req)
        if (res.code == 200) {
            this.tableData = res.data
            let hasRunning = false
            this.tableData.map((item, index) => {
                if (item.lastStatus == 2) {
                    hasRunning = true
                }
            })
            if (!hasRunning) {
                clearInterval(this.inTerval)
            }
        }
    }
    // 获取表格数据
    @action.bound async getJobData(params) {
        console.log(params, 'params')
        this.tableLoading = true
        if (params !== undefined) {
            this.tablePagination.page = params.page
            this.tablePagination.pageSize = params.page_size !== undefined ? params.page_size : this.tablePagination.pageSize
        }
        let req = {
            ...this.tablePagination,
            ...params,
        }
        req.status = this.searchCondition.status
        req.taskSubType = this.searchCondition.taskSubType
        req.lastStatus = this.searchCondition.lastStatus
        req.businessId = this.searchCondition.businessId
        req.type = 1
        req.businessType = 1001 // 业务类型

        const res = await getTaskJobList(req)
        if (res.code == 200) {
            runInAction(() => {
                // res.data[0].lastStatus = 3
                this.tableData = res.data.concat()
                this.tablePagination.paginationDisplay = res.total > this.tablePagination.pageSize ? 'block' : 'none'
                this.tablePagination.total = res.total
                // this.tablePagination = {...req, paginationDisplay:"block", total: res.total}
                this.tableLoading = false

                // 更新选中数据
                let hasRunning = false
                this.tableData.map((item, index) => {
                    this.selectedRows.slice().map((data, i) => {
                        if (item.id == data.id) {
                            this.selectedRows[i] = item
                        }
                    })
                    if (item.lastStatus == 2) {
                        hasRunning = true
                    }
                })
                if (hasRunning) {
                    let that = this
                    clearInterval(this.inTerval)
                    this.inTerval = setInterval(function () {
                        that.getTableData(req)
                    }, 3000);
                } else {
                    clearInterval(this.inTerval)
                }
            })

            return {
                total: res.total,
                dataSource: res.data,
            }
        }
    }

    // 删除自动采集任务
    @action.bound async deleteJobData(data, type) {
        let selectedRowsArr = []
        if (data instanceof Array) {
            _.map(data.slice(), (item, key) => {
                selectedRowsArr.push(item.id)
            })
        }
        if (type == 'single') {
            postDeleteTaskJob({
                id: data.id
            }).then((res) => {
                if (res.code == 200) {
                    this.clearSelectChange()
                    message.success(res.msg)
                    this.getJobData({
                        page: 1
                    })
                }
            })
            return
        } else {
            postDeleteBatchTaskJob({
                ids: selectedRowsArr
            }).then((res) => {
                if (res.code == 200) {
                    this.clearSelectChange()
                    message.success(res.msg)
                    this.getJobData({
                        page: 1
                    })
                }
            })
        }
    }

    // 立即执行
    @action.bound async execJobData(id, type) {
        let selectedRowsArr = []
        if (id instanceof Array) {
            _.map(id.slice(), (item, key) => {
                selectedRowsArr.push(item.id)
            })
        }
        if (type == 'single') {
            postRunTaskJob({
                id: id
            }).then((res) => {
                if (res.code == 200) {
                    message.success(res.msg)
                    this.getJobData()
                }
            })
            return
        } else {
            postRunBatchTaskJob({
                ids: selectedRowsArr
            }).then((res) => {
                if (res.code == 200) {
                    message.success(res.msg)
                    // this.clearSelectChange()
                    this.getJobData()
                }
            })
        }
    }
    // 切换状态接口
    @action.bound async exchangeStateData(data, type, status) {
        let selectedRowsArr = []
        if (data instanceof Array) {
            _.map(data.slice(), (item, key) => {
                selectedRowsArr.push(item.id)
            })
        }
        if (type == 'single') {
            postChangeTaskJobStatus({
                id: data.id,
                status: data.status ? 0 : 1,
            }).then((res) => {
                if (res.code == 200) {
                    // message.success(res.msg)
                    // this.clearSelectChange()
                    // this.getJobData()
                }
            })
            return
        } else {
            postChangeBatchTaskJobStatus({
                ids: selectedRowsArr,
                status,
            }).then((res) => {
                if (res.code == 200) {
                    // message.success(res.msg)
                    // this.clearSelectChange()
                    // this.getJobData()
                }
            })
        }
    }
}

const store = new Store()
export default store