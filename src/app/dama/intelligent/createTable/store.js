import { NotificationWrap } from 'app_common'
import { action, observable, runInAction } from 'mobx'
import _ from 'underscore'

class Store {
    // 看板id
    @observable pinboardId = 0
    // 是否是创建报表
    @observable ifCreate = true
    // 报表id
    @observable reportId = null
    // 报表名称
    @observable name = ''
    // 报表周期
    @observable cycle = 0
    // 报表类型
    @observable type = 0
    // 是否需要回显数据
    @observable isSetData = true
    // 看板视图数据
    @observable boardList = []
    // 选中的看板视图
    @observable selectList = [{}]
    // 设置的合并字段信息 选择信息
    @observable pbViewList = {
        mergeColumnNames: [],
        pbViews: []
    }
    // 设置看板id
    @action.bound setPinboardId = (id) => {
        this.pinboardId = id
    }
    // 设置是否是创建报表
    @action.bound setStatus = (status) => {
        this.ifCreate = status
    }
    // 报表编辑时确保第二步不会重复请求详情
    @action.bound setNotRepeat = (bl) => {
        this.isSetData = bl
    }
    // 设置报表id
    @action.bound setReportId = (id) => {
        this.reportId = id
    }
    // 设置第一步的内容
    @action.bound setTableInf(name, cycle, type) {
        this.name = name
        this.cycle = cycle
        this.type = type
    }
    // 设置看板视图数据
    @action.bound setBoardList (list) {
        this.boardList = list
    }
    // 第二步添加
    @action.bound addBoard() {
        this.selectList.push({})
    }
    // 第二步设置列
    @action.bound setSelectList(list) {
        this.selectList = list
    }
    // 第三步设置合并字段
    @action.bound setPbViewList(list) {
        this.pbViewList = []
        runInAction(() => {
            this.pbViewList = list
        })
    }
    // 清空步骤
    @action.bound clearContent() {
        this.isSetData = true
        this.name = ''
        this.cycle = 0
        this.type = 0
        this.pinboardId = 0
        this.selectList = [{}]
        this.boardList = []
        this.pbViewList = {
            mergeColumnNames: [],
            pbViews: []
        }
        this.reportId = null
    }
}

const store = new Store()
export default store
