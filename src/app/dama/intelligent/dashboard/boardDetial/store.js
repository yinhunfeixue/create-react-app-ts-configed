import { NotificationWrap } from 'app_common'
import { action, observable, runInAction } from 'mobx'
import _ from 'underscore'
import { getRecommendQuery, getRelatedQuery, getBoardDetial } from 'app_api/dashboardApi'

class Store {
    // 看板id
    @observable pinboardId = 0
    // 左侧栏选中的项
    @observable leftSelectOption = []
    // 左侧栏选中的项的标识
    @observable leftSelectId = []
    // 右侧状态栏显示的项目/搜索用的数据
    @observable selectedList = []
    // 视图名称
    @observable name = ''
    // 视图描述，目前页面没有展示但是可编辑
    @observable description = ''
    // 过滤条件
    @observable filters = []
    // 视图位置
    @observable viewPosition='[]'
    // 视图信息
    @observable views = []
    // 是否能创建报表
    @observable canReportsBeGenerated = false

    @action.bound async getData(pinboardId) {
        let res = await getBoardDetial({ id: pinboardId })
        if (res.code === 200) {
            let filters = res.data.filters || []
            runInAction(() => {
                this.name = res.data.name
                this.description = res.data.description
                this.filters = res.data.filters
                this.viewPosition = res.data.viewPosition ? res.data.viewPosition : '[]'
                this.views = res.data.views
                this.canReportsBeGenerated = res.data.canReportsBeGenerated
            })
            this.changeSelectedList(filters)
            this.changeLeftValue(filters)
        }
    }
    // 改变看板id
    @action.bound changePinboardId(id) {
        this.pinboardId = id
    }
    // 改变右侧状态栏显示
    @action.bound changeSelectedList(list) {
        console.log(list, '条件更改，调用搜索接口')
        this.selectedList = list
    }
    // 改变左侧状态栏
    @action.bound changeLeftValue(list) {
        this.leftSelectOption = list
        let arr = []
        list.length > 0 && list.map((value, index) => {
            arr.push(value.columnId)
        })
        this.leftSelectId = arr
    }
}

const store = new Store()
export default store
