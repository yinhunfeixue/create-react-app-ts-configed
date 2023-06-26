import {
    message
} from 'antd'
import {
    extractorJob
} from 'app_api/metadataApi'
import {
    getQualityTaskJobById,
    taskGroupDetail
} from 'app_api/examinationApi'
import {
    action,
    observable,
    runInAction
} from 'mobx'
import moment from 'moment'
import _ from 'underscore'

const weekMap = {
    1: '一',
    2: '二',
    3: '三',
    4: '四',
    5: '五',
    6: '六',
    7: '日',
}

class Store {
    // 选中任务
    @observable selectedTaskInfo = {}
    @observable selectedTable = {}
    @observable taskDetail = {
        businessData: {}
    }
    @observable taskDisplayModal = false
    @observable tabValue = '1'
    @observable pageLoading = false

    @action.bound onSelectTask(data) {
        console.log(data, 'selectedTaskInfo')
        this.selectedTaskInfo = {
            ...data
        }
        this.getDetail()
    }
    @action.bound onSelectedTable(data) {
        this.selectedTable = {
            ...data
        }
    }
    @action.bound changeTaskDisplayModal(value) {
        this.taskDisplayModal = value
    }
    @action.bound changeTab(value) {
        this.tabValue = value
        this.taskDisplayModal = false
    }
    @action.bound getDetail() {
        let query = {
            taskGroupId: this.selectedTaskInfo.taskGroupId,
        }
        taskGroupDetail(query).then(res => {
            if (res.code == 200) {
                res.data.partitionInfo = res.data.partitionInfo ? JSON.parse(res.data.partitionInfo) : {}
                res.data.checkRange = res.data.checkRange ? JSON.parse(res.data.checkRange) : {}
                res.data.weekChecboxValue = []
                res.data.monthChecboxValue = []
                if (res.data.frequency == 5) {
                    res.data.weekChecboxValue = res.data.days.split('|')
                } else if (res.data.frequency == 6) {
                    res.data.monthChecboxValue = res.data.days.split('|')
                }
                // res.data.primaryKeys = []
                // res.data.primaryKeys.map((item) => {
                //     res.data.primaryKeys.push(item.id)
                // })

                let time = res.data.time !== undefined && res.data.time ? res.data.time : ''
                let startTime = res.data.startTime !== undefined ? moment(res.data.startTime).format('YYYY-MM-DD') : ''
                let endTime = res.data.endTime !== undefined ? moment(res.data.endTime).format('YYYY-MM-DD') : ''
                let customizeBeginTime = res.data.checkRange.customizeBeginTime !== undefined ? moment(res.data.checkRange.customizeBeginTime).format('YYYY-MM-DD') : ''
                let customizeEndTime = res.data.checkRange.customizeEndTime !== undefined ? moment(res.data.checkRange.customizeEndTime).format('YYYY-MM-DD') : ''
                res.data.customizeTimeDesc = customizeBeginTime + (customizeBeginTime && customizeEndTime ? ' ~ ' : '') + customizeEndTime
                res.data.timeRangeDesc = startTime + (startTime && endTime ? ' ~ ' : '') + endTime
                if (res.data.frequency == 4) {
                    res.data.circleInfo = '每天 ' + time
                } else if (res.data.frequency == 5) {
                    let weekString = ''
                    _.map(res.data.days.split("|"), (item, key) => {
                        weekString += `${weekMap[item]}${key + 1 == res.data.days.split("|").length?'':'、'}`
                    })
                    res.data.circleInfo = '每周' + weekString + ' ' + time
                } else if (res.data.frequency == 6) {
                    let monthString = ''
                    _.map(res.data.days.split("|"), (item, key) => {
                        monthString += `${item}${key + 1 == res.data.days.split("|").length?'':'、'}`
                    })
                    res.data.circleInfo = '每月' + monthString + '号 ' + time
                }
                res.data.timePeriod = res.data.timePeriod ? res.data.timePeriod : {
                    allSet: {
                        endTime: '当日02:00',
                        executeMinute: 120,
                        startTime: '',
                    },
                    working: {
                        endTime: '当日02:00',
                        executeMinute: 120,
                        startTime: '',
                    },
                    weekend: {
                        endTime: '当日04:00',
                        executeMinute: 240,
                        startTime: '',
                    },
                    startTime: '',
                    type: 1,
                    isInitData: true
                }
                res.data.timePeriodDesc = ''
                if (res.data.timePeriod.type == 1) {
                    res.data.timePeriodDesc = '不设置'
                } else if (res.data.timePeriod.type == 2) {
                    res.data.timePeriodDesc = '周一～周日窗口时长：' + (res.data.timePeriod.allSet.executeMinute / 60) + '小时'
                } else {
                    res.data.timePeriodDesc = '周一～周五窗口时长：' + (res.data.timePeriod.working.executeMinute / 60) + '小时' + '；周六～周日窗口时长：' + (res.data.timePeriod.weekend.executeMinute / 60) + '小时'
                }
                res.data.time = res.data.time ? moment(res.data.time, 'HH:mm:ss') : moment('00:00:00', 'HH:mm:ss')
                this.taskDetail = res.data
            }
        })
    }
    @action.bound setTaskDetail(data) {
        this.taskDetail = {
            ...data
        }
    }

}

const store = new Store()
export default store