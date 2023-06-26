import {
    message
} from 'antd'
import {
    extractorJob
} from 'app_api/metadataApi'
import {
    deleteManualJob,
    getManualJob,
    postManualJob
} from 'app_api/termApi'
import {
    action,
    observable,
    runInAction
} from 'mobx'

class Store {
    // 表格loading
    @observable tableLoading = false
    // 表格数据
    @observable tableData = []
    // 页签配置
    @observable pagination = {
        page: 1,
        page_size: 20,
        total: 0,
    }
    // 保存表格搜索参数 用于分页查询
    @observable tableParams = {}
    // 是否显示增加页面
    @observable addContentVisible = false
    // 表格选中项的id
    @observable selectedRows = []
    // 日志列表
    @observable logList = []
    // 列表数据
    @observable recordData = []
    // 上传文件
    @observable fileList = []
    // 上传参数
    @observable uploadprops = {
        customRequest: this.onFileSelected,
        onRemove: this.onRemove,
        accept: '.xlsx,.xls',
        fileList: [...this.fileList],
    }
    // 获取采集列表数据
    @action.bound async getTableData(params) {
        this.tableLoading = true
        this.pagination = {
            ...params
        }
        let res = await getManualJob(params)
        // 循环获取记录，并附加到数据中
        const data = res.data || []
        for (let item of data) {
            const extractorRes = await extractorJob({
                jobId: item.id,
            })
            const extractorList = extractorRes.data
            if (extractorList && extractorList.length) {
                item.extractor = extractorList[0]
            } else {
                item.extractor = {}
            }
        }
        runInAction(() => {
            this.tableData = data
            this.tableParams = params
            this.tableLoading = false
            this.pagination.total = res.total
            this.pagination.paginationDisplay = this.pagination.total < this.pagination.page_size ? 'none' : 'block'
        })

        return {
            total: res.total,
            dataSource: data,
        }
    }

    // 获取列表选中项
    @action.bound async getTableRow(arr) {
        this.selectedRows = arr
    }
    // 手动采集任务保存方法
    @action.bound async addForm(params) {
        const typeOne = 'target'
        const {
            documentTemplate
        } = params
        const uploadfile = this.fileList[0]
        if (!uploadfile) {
            message.warning('请上传文件')
            return
        }
        let typeTwo = ['0', '1', '2'].indexOf(documentTemplate) > -1 ? 'common' : 'mapping'
        params = {
            ...params,
            typeTwo,
            typeOne,
            uploadfile
        }
        console.log(params)
        let res = await postManualJob(params)
        if (res.code == '200') {
            message.success(res.msg)
            runInAction(() => {
                this.uploadprops.fileList = []
                this.addTask()
                this.getTableData({
                    fileTpl: ['codeStandardMapping', 'codeStandard', 'basicsStandard', 'targetStandard', 'standardMapping', 'standardFieldMapping'],
                })
            })
        }
    }
    // 添加手动采集任务
    @action.bound async addTask() {
        this.addContentVisible = !this.addContentVisible
    }
    // 删除任务
    @action.bound async onDel() {
        let params = []
        this.selectedRows.forEach((item) => {
            params.push({
                id: item.id,
                jobName: item.jobName
            })
        })
        let res = await deleteManualJob(params)
        console.log(params, res)
        runInAction(() => {
            if (res.code === '200') {
                this.getTableData()
            }
        })
    }
    // 选择上传的文件
    @action.bound onFileSelected(params) {
        this.file = params.file
        this.uploadprops.fileList = [params.file]
        this.fileList = [params.file]
    }
    // 移除
    @action.bound onRemove() {
        ;
        ({
            fileList
        }) => {
            return {
                fileList: []
            }
        }
        this.uploadprops.fileList = []
        this.fileList = []
    }
}

const store = new Store()
export default store