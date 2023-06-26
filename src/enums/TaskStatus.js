class TaskStatus {}

TaskStatus.SUCCESS = 0
TaskStatus.FAIL = 1
TaskStatus.PROGRESS = 2

TaskStatus.toString = (value) => {
    switch (value) {
        case TaskStatus.SUCCESS:
            return '成功'
        case TaskStatus.FAIL:
            return '失败'
        case TaskStatus.PROGRESS:
            return '执行中'
        default:
            return ''
    }
}

export default TaskStatus
