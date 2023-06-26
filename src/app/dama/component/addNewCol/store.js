import { action, observable } from 'mobx'

class Store {
    // 业务线id
    @observable businessId = []
    // 临时业务线id
    @observable tempBusinessId = ''
    // 可用中的业务线id列表
    @observable useBusinessIds = []
    // 使用中的业务线id
    @observable usingBusinessIds = []
    // 字段类别
    @observable category = '1'
    // 编辑用的id
    @observable editId = ''
    // 搜索框列表
    @observable searchItem = []
    // formula整串
    @observable formula = ''
    // 设置node列表
    @observable nodeList = []
    // 是否发生合并
    @observable isMerge = false
    // 鼠标位置
    @observable mousePos = 0
    // 节点位置
    @observable nodePos = 0
    // 字段类型
    @observable columnType = 0
    // 公式释义
    @observable definition = ''
    // 公式释义
    @observable errTip = ''
    // 区分编辑还是添加
    @observable isAdd = true
    // 时间差参数
    @observable timeDiff = {}
    // 获取时间参数
    @observable getTimeParam = {}
    // 分组聚合计算参数
    @observable aggregation = {}
    // 分组聚合指标参数
    @observable indexmaList = []
    // 分组累计计算参数
    @observable cumulative = {}
    // 分组赋值
    @observable assignment = {}
    // 分组排序
    @observable sortInfo = {}
    // 1对应worksheet 2对应query
    @observable scope = 1
    // 是否是创建过程表
    @observable ifProcess = false
    // etl过程表id
    @observable etlProcessId = 0
    // 设置业务
    @action.bound setScope(id) {
        this.scope = id
    }
    // 设置etl信息
    @action setEtlProgess(bl, id) {
        this.ifProcess = bl
        if (id) {
            this.etlProcessId = id
        }
    }
    // 设置业务线id
    @action.bound setBusinessId(id) {
        this.businessId = id
    }
    // 设置使用中的业务线id
    @action.bound setUsingBusinessIds(list) {
        this.usingBusinessIds = list
    }
    // 设置合并状态
    @action.bound setIsMerge(isMerge) {
        this.isMerge = isMerge
    }
    // 设置搜索栏
    @action.bound setSearchItem(searchItem, isMerge) {
        this.searchItem = searchItem
        let formula = ''
        searchItem.map((value, index) => {
            formula += value.content
        })
        this.formula = formula
        if (isMerge) {
            this.isMerge = true
        } else {
            this.isMerge = false
        }
    }
    // 设置鼠标位置信息
    @action.bound setMouseInf(nodePos, mousePos) {
        this.nodePos = nodePos
        this.mousePos = mousePos
    }
    // 设置字段类型
    @action.bound setColumnType(type) {
        this.columnType = type
    }
    // 设置是否合法
    @action.bound setErrTip(bl) {
        this.errTip = bl
    }
    // 设置公式释义
    @action.bound setDefinition(definition) {
        this.definition = definition
    }
    // 设置类型
    @action.bound setCategory(type) {
        this.category = type
    }
    // 设置计算时间差参数
    @action.bound setTimeDiff(obj) {
        this.timeDiff = obj
    }
    // 设置获取时间参数
    @action.bound setGetTime(obj) {
        this.getTimeParam = obj
    }
    // 设置分组聚合计算参数
    @action.bound setAggregation(obj) {
        console.log(obj, 'setAggregation')
        this.aggregation = obj
    }
    // 设置分组聚合指标参数
    @action.bound setIndexmaList(obj) {
        this.indexmaList = obj
    }
    @action.bound setAggregationEditData(obj) {
        this.setAggregation(obj)
        let array = []
        if (obj.advancedSetting) {
            for (let k in obj.advancedSetting) {
                array.push({
                    name: k,
                    value: [],
                    selectValue: obj.advancedSetting[k],
                })
            }
        }
        this.setIndexmaList(array)
    }
    // 设置分组累计计算参数
    @action.bound setCumulative(obj) {
        this.cumulative = obj
    }
    // 设置分组排序
    @action.bound setSortInfo(obj) {
        this.sortInfo = obj
    }
    // 设置分组赋值参数
    @action.bound setAssignment(obj) {
        this.assignment = obj
    }
    // 清除参数
    @action.bound clearParams() {
        this.usingBusinessIds = []
        this.searchItem = []
        this.formula = ''
        this.nodeList = []
        this.isMerge = false
        this.mousePos = 0
        this.nodePos = 0
        this.columnType = 0
        this.category = '1'
        this.definition = ''
        this.isLegal = true
        // 时间差参数
        this.timeDiff = {}
        // 获取时间参数
        this.getTimeParam = {}
        // 分组聚合计算参数
        this.aggregation = {}
        // 分组累计计算参数
        this.cumulative = {}
        // 业务线id
        this.businessId = 0
        // 分组赋值参数
        this.assignment = {}
        // this.tempBusinessId = ''
        this.isAdd = true
        // 公式释义
        this.definition = ''
        // 公式是否合法
        this.errTip = ''
        this.sortInfo = {}
    }
    // 设置临时id
    @action.bound setTempBusinessId(id) {
        this.tempBusinessId = id
    }
    @action.bound setIsAdd(bl) {
        this.isAdd = bl
    }
    @action.bound setEditId(id) {
        this.editId = id
    }
}

const store = new Store()
export default store
