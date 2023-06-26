import {
    message
} from 'antd'
import {
    delSource,
    getSourceList,
    postDeleteJobByBusiness
} from 'app_api/metadataApi'
import {
    action,
    observable,
    runInAction
} from 'mobx'

class Store {
    // 数据源下拉框数据
    @observable sourceData = []
    //表格数据
    @observable tableData = []
    // 新增数据源时，第二步搜索框输入值
    @observable inputValue = ''
    // 数据源表格上方输入框的值
    @observable sourceTableInputValue = undefined
    // 数据源表格上方下拉框的值
    @observable sourceTableSelectValue = undefined
    @observable collectMethod = undefined
    @observable techniqueManagerId = undefined
    @observable tablePagination = {
        total: '',
        page: 1,
        page_size: 20,
        paginationDisplay: 'none',
    }

    // 获取数据源下拉框数据
    @action.bound async getDataSourceData(params) {
        let req = {
            collectMethod: params
        }
        req.page = 1
        req.page_size = 999999
        req.more = true

        const res = await getSourceList(req)
        if (res.code == 200) {
            runInAction(() => {
                this.sourceData = res.data
            })
        }
    }

    @action.bound resetCondition() {
        this.sourceTableInputValue = undefined
        this.collectMethod = undefined
        this.sourceTableSelectValue = undefined
        this.techniqueManagerId = undefined
        this.tablePagination = {
            total: '',
            page: 1,
            page_size: 20,
            paginationDisplay: 'none',
        }
        this.search()
    }

    // 改变数据源表格上方输入框的值
    @action.bound conditionChange(value) {
        console.log(value)
        this.sourceTableInputValue = value
        runInAction(() => {
            this.search()
        })
    }
    // 改变数据源表格上方下拉框的值
    @action.bound conditionSelectChange(value) {
        this.sourceTableSelectValue = value
        runInAction(() => {
            this.search()
        })
    }

    search() {
        if (this.controller) {
            this.controller.reset()
        }
    }

    // 改变数据源表格上方下拉框的值
    @action.bound collectMethodChange(value) {
        this.collectMethod = value
        runInAction(() => {
            this.search()
        })
    }

    // 输入框值改变
    @action.bound searchInputChange(value) {
        this.inputValue = value
    }

    // 获取表格数据
    @action.bound async getDataSourceTableData(params) {
        let req = {
            ...this.tablePagination,
            ...params,
        }
        req.id = this.sourceTableInputValue
        req.dsType = this.sourceTableSelectValue
        req.collectMethod = this.collectMethod
        req.brief = false
        req.more = true
        req.techniqueManagerId = this.techniqueManagerId || ''

        const res = await getSourceList(req)
        if (res.code == 200) {
            runInAction(() => {
                this.tableData = res.data
                this.tablePagination = {
                    ...req,
                    paginationDisplay: res.total > this.tablePagination.page_size ? 'block' : 'none',
                    total: res.total
                }
            })
            return {
                total: res.total,
                dataSource: res.data,
            }
        }
    }

    // 删除数据源(单个删除，后台不支持多个)
    @action.bound async cancleDataBase(dataSourceId) {
        const res = await delSource({
            id: dataSourceId
        })
        if (res.code == 200) {
            message.success(res.msg)
            postDeleteJobByBusiness({
                id: dataSourceId
            }).then((response) => {
                if (response.code == 200) {} else {
                    message.error(response.msg)
                }
            })
        }
    }
}

const store = new Store()
export default store