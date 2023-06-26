import {
    message
} from 'antd'
import {
    departments
} from 'app_api/manageApi'
import {
    delStandardMapField,
    delStandardMapTarget,
    getCodeDefinition,
    getStandardList,
    standardHistoryRecord,
    standardHistoryRecords,
    standardMapping
} from 'app_api/standardApi'
import {
    getTree
} from 'app_api/systemManage'
import CONSTANTS from 'app_constants'
import {
    action,
    observable,
    runInAction
} from 'mobx'
import moment from 'moment'
import 'moment/locale/zh-cn'
import _ from 'underscore'

const selectOption = CONSTANTS['SELECT_OPTION']
class Store {
    @observable historyRecordList = []
    @observable historyRecordDetail = []
    @observable tableLoading = false
    @observable detailTableLoading = false
    // 从后台获取的数据是基础数据还是指标数据
    @observable standardLevel = '基础指标标准'

    // 1 基础标准，2 指标标准，3 代码标准
    @observable levelType = 1

    // 当前返回的数据
    @observable detailData = []

    // 设置关联指标属性
    @observable associationIndex = '资产属性'

    // 设置引用代码字段
    @observable referenceCode = 'CD00067'

    // 设置关联指标id
    @observable termEntityId = ''

    // 打开代码的弹出框
    @observable codeVisible = false

    // 引用代码弹出框的table值
    @observable referenceCodeTableData = []

    // 标准系统下拉框
    @observable standardSystemSelect = {}

    // 标准层次下拉框
    @observable standardLevelSelect = {}

    // 初始获取的类目信息
    @observable gradeSelect = []

    // 指标类型
    @observable typeSelect = {}

    // 统计频率
    @observable frequencySelect = {}
    // 数据类型
    @observable dataCategorySelect = {}
    // 常用维度
    @observable logicTypeSelect = {}
    // 落地系统
    @observable systemUsedSelect = {}
    // 质量单位
    @observable dataUnitSelect = {}
    // 管理部门
    @observable controlDeptSelect = []
    // 协办部门
    @observable coSectorSelect = []
    // 生效状态
    @observable entityStatusSelect = {}

    @observable orderNumber = 0

    @observable standardData = {}
    @observable referenceTableData = 0
    @observable fieldModalVisible = false
    @observable targetModalVisible = false
    @observable referSelectedRows = [] // 引用 table 选中项
    // 当前节点的父节点
    @observable currentParentId = ''

    // 设置数组存放三级name
    @observable grade = []

    @observable tablePagination = {
        total: '',
        page: 1,
        page_size: 10,
        // paginationDisplay: 'none',
    }

    @observable tablePaginationRecord = {
        total: '',
        page: 1,
        page_size: 10,
        // paginationDisplay: 'none',
    }



    // 获取当前选中项详情页面
    @action.bound async getStandardSourceList(params, form) {
        const res = await getStandardList(params)
        if (res.code == '200') {
            if (res.data.length > 0) {
                runInAction(() => {
                    this.standardData = res.data[0]
                    this.standardLevel = res.data[0].standardLevel
                    this.levelType = res.data[0].levelType
                    this.termEntityId = res.data[0].termEntityId
                    this.referenceCode = res.data[0].udcCode
                    this.associationIndex = res.data[0].termEntityDesc
                    this.currentParentId = res.data[0].entityCategory
                    this.detailData = res.data[0]
                })
                // this.getGradeSelect();
                // this.setDetailData(form,this.detailData);
            }
        }
    }

    @action.bound async getDepartment() {
        let res = await departments({
            page_size: 100000
        })
        if (res.code == 200) {
            this.controlDeptSelect = res.data
            this.coSectorSelect = res.data
        }
    }

    @action.bound getSelectValue() {
        this.standardSystemSelect = selectOption.standardSystem
        this.standardLevelSelect = selectOption.standardLevel
        this.typeSelect = selectOption.indexType
        this.frequencySelect = selectOption.frequency
        this.dataCategorySelect = selectOption.dataType
        this.logicTypeSelect = selectOption.logicType
        this.systemUsedSelect = selectOption.systemUsed
        this.dataUnitSelect = selectOption.metricUnit
        // this.controlDeptSelect = selectOption.controlDept
        // this.coSectorSelect = selectOption.coSector
        this.entityStatusSelect = selectOption.status
    }

    // 设置下拉框里面的值
    @action.bound setDetailData(form, data) {
        console.log(data)
        data['offlineTime'] = data['offlineTime'] ? moment(data['offlineTime']) : undefined
        data['effectiveTime'] = data['effectiveTime'] ? moment(data['effectiveTime']) : undefined

        form.setFieldsValue(data)
    }

    // 获取等级分类
    @action.bound async getGradeSelect() {
        const res = await getTree({
            code: 'ZT002'
        })
        if (res.code == '200') {
            //  console.log(res.data.slice())
            runInAction(() => {
                this.gradeSelect = [res.data]
                //    this.getThirdCatergoryId(res.data,this.currentParentId);
            })
            // console.log(this.grade.slice());
        }
    }

    // 获取依赖code的数据详情接口
    @action.bound async getModaldetaiByCode(referenceCode) {
        let req = {}
        req.udcCode = referenceCode || this.referenceCode
        const res = await getCodeDefinition(req)
        this.referenceCodeTableData = []
        this.orderNumber = 0
        if (res.code == '200') {
            if (res.data.length > 0) {
                runInAction(() => {
                    _.map(res.data, (node) => {
                        node.key = ++this.orderNumber
                        this.referenceCodeTableData.push(node)
                        this.codeVisible = true
                    })
                })
            }
        }
    }
    // 打开代码Modal
    @action.bound referenceCodeClick() {
        this.getModaldetaiByCode(this.referenceCode)
    }
    // 关闭引用代码打开的modal
    @action.bound onOk() {
        this.codeVisible = false
    }

    // 删除映射
    @action.bound async delMap() {
        let fieldList = [],
            targetList = []
        this.referSelectedRows.forEach((item) => {
            if (item.type === '字段') {
                fieldList.push({
                    relationId: item.relationId
                })
            } else if (item.type === '指标') {
                targetList.push({
                    relationId: item.relationId
                })
            }
        })

        if (fieldList.length > 0) {
            await delStandardMapField(fieldList)
        }

        if (targetList.length > 0) {
            await delStandardMapTarget(targetList)
        }
    }

    @action.bound async getReferenceData(param) {
        let res = await standardMapping(param)
        if (res.code != 200) {
            return
        }
        runInAction(() => {
            this.tablePaginationRecord.total = res.total
            this.referenceTableData = res.data
        })
    }
    @action.bound async getHistoryRecordDetail(param) {
        this.detailTableLoading = true
        let res = await standardHistoryRecord(param)
        if (res.code == 200) {
            this.historyRecordDetail = res.data
        }
        this.detailTableLoading = false
    }
    @action.bound async getHistoryRecord(param) {
        this.tableLoading = true
        let params = {
            ...this.tablePagination,
            ...param,
        }
        delete params.total
        delete params.paginationDisplay
        let res = await standardHistoryRecords(params)
        if (res.code == 200) {
            this.historyRecordList = res.data
            this.tablePagination.total = res.total
        }
        this.tableLoading = false
    }
}
const store = new Store()
export default store