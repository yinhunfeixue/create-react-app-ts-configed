import { NotificationWrap } from 'app_common'
import { action, observable, runInAction } from 'mobx'
import _ from 'underscore'
import { getRecommendQuery, getRelatedQuery } from 'app_api/intelligentApi'
import { getBusiness } from 'app_api/modelApi'

class Store {
    // 首页的推荐问句列表数据（不能余结果页共用一个 否则等待结果页出结果的过程中，点了首页的话 就会将原来的10个推荐问句覆盖，这样是不对的）
    @observable homeListData = []
    // 推荐问句列表数据
    @observable listData = []
    // 搜索框上面的单选项
    @observable radioList = []

    // 首页搜索框上面的单选项的默认值, 业务线Id
    @observable homeRedioDefultValue = ''

    // 第一次访问时选中的业务线的type
    @observable homeRedioDefultBussinessType = 0

    // 结果页搜索框上面的单选项的默认值
    @observable redioDefultValue = ''

    // 推荐问句的loading
    @observable listLoading = true

    @observable moreTipsDis = 'none'

    // 添加数据源页面 willmount的时候 重置editConnect
    @action.bound changeRadioValue(value) {
        this.redioDefultValue = value
    }

    // 添加数据源页面 willmount的时候 重置editConnect
    @action.bound changeHomeRadioValue(value) {
        this.homeRedioDefultValue = value
    }

    // 添加数据源页面 willmount的时候 重置editConnect
    @action.bound changeHomeBussinessType(value) {
        this.homeRedioDefultBussinessType = value
    }

    @action.bound resetRelatedQueryData() {
        this.listData = []
    }
    @action.bound closeTips() {
        this.moreTipsDis = 'none'
    }
    /**
     * 获取首页输入框上面的业务数据
     * @param  {Object} [params={}] [description]
     * @return {[type]}             [description]
     */
    @action.bound async getBusinessData(page, pageSize) {
        let req = { page: 1, page_size: 10000, withUsed: 1 }
        const res = await getBusiness(req)
        if (res.code == 200) {
            let radioList = []
            _.map(res.data, (item, key) => {
                // if (item.status == '索引完成' || item.type === 1) {
                radioList.push({ businessTypeName: item.businessTypeName, id: item.id + '', type: item.type })
                // }
            })

            // radioList = [
            //         {
            //             "businessTypeName":"审计日志(audit_log)",
            //             "creator":"liangzhi",
            //             "id":"110",
            //             "isUseStandard":false,
            //             "metricsNumber":26,
            //             "modelTableList":Array[3],
            //             "type":2
            //         },
            //         {
            //             "businessTypeName":"客户统计信息(agg_cust_statistics_info)",
            //             "creator":"liangzhi",
            //             "id":"95",
            //             "isUseStandard":false,
            //             "metricsNumber":138,
            //             "modelTableList":[
            //                 {
            //                     "ename":"dim_customer",
            //                     "key":"2744545268184204220_null_null",
            //                     "tableId":"2744545268184204220"
            //                 },
            //                 {
            //                     "ename":"agg_cust_statistics_info",
            //                     "key":"5376071272031599925_null_null",
            //                     "tableId":"5376071272031599925"
            //                 },
            //                 {
            //                     "ename":"dim_branch",
            //                     "key":"7622010004000754907_null_null",
            //                     "tableId":"7622010004000754907"
            //                 }
            //             ],
            //             "type":2
            //         },
            //         {
            //             "businessTypeName":"模型推理表表(kn_table)",
            //             "creator":"liangzhi",
            //             "id":"74",
            //             "isUseStandard":false,
            //             "metricsNumber":125,
            //             "modelTableList":[
            //                 {
            //                     "cname":"",
            //                     "ename":"md_diff_check",
            //                     "key":"1905068340075332630_null_null",
            //                     "tableId":"1905068340075332630"
            //                 },
            //                 {
            //                     "cname":"",
            //                     "ename":"kn_table",
            //                     "key":"2863843416398919740_null_null",
            //                     "tableId":"2863843416398919740"
            //                 },
            //                 {
            //                     "cname":"",
            //                     "ename":"md_database",
            //                     "key":"2892060829325663835_null_null",
            //                     "tableId":"2892060829325663835"
            //                 },
            //                 {
            //                     "cname":"",
            //                     "ename":"md_datasource",
            //                     "key":"2923861659627260713_null_null",
            //                     "tableId":"2923861659627260713"
            //                 },
            //                 {
            //                     "cname":"标准相关属性表",
            //                     "ename":"std_standard",
            //                     "key":"3386948697453048972_null_null",
            //                     "tableId":"3386948697453048972"
            //                 },
            //                 {
            //                     "cname":"",
            //                     "ename":"ex_tcheck_rule",
            //                     "key":"4888719801724781661_null_null",
            //                     "tableId":"4888719801724781661"
            //                 },
            //                 {
            //                     "cname":"描述术语唯一映射的物理字段信息",
            //                     "ename":"md_column",
            //                     "key":"6811058471580004754_null_null",
            //                     "tableId":"6811058471580004754"
            //                 },
            //                 {
            //                     "cname":"",
            //                     "ename":"md_table",
            //                     "key":"8129496892364396530_null_null",
            //                     "tableId":"8129496892364396530"
            //                 }
            //             ],
            //             "type":2
            //         },
            //         {
            //             "businessTypeName":"营业部统计信息表(agg_branch_statistics_info)+客户统计信息(agg_cust_statistics_info)",
            //             "creator":"liangzhi",
            //             "id":"105",
            //             "isUseStandard":false,
            //             "metricsNumber":212,
            //             "modelTableList":[
            //                 {
            //                     "ename":"dim_customer",
            //                     "key":"2744545268184204220_null_null",
            //                     "tableId":"2744545268184204220"
            //                 },
            //                 {
            //                     "ename":"agg_cust_statistics_info",
            //                     "key":"5376071272031599925_null_null",
            //                     "tableId":"5376071272031599925"
            //                 },
            //                 {
            //                     "ename":"agg_branch_statistics_info",
            //                     "key":"5864200909203621256_null_null",
            //                     "tableId":"5864200909203621256"
            //                 },
            //                 {
            //                     "ename":"dim_branch",
            //                     "key":"7622010004000754907_null_null",
            //                     "tableId":"7622010004000754907"
            //                 }
            //             ],
            //             "type":2
            //         },
            //         {
            //             "businessTypeName":"客户持股统计表(agg_cust_stock)",
            //             "creator":"liangzhi",
            //             "id":"109",
            //             "isUseStandard":false,
            //             "metricsNumber":140,
            //             "modelTableList":[
            //                 {
            //                     "ename":"dim_customer",
            //                     "key":"2744545268184204220_null_null",
            //                     "tableId":"2744545268184204220"
            //                 },
            //                 {
            //                     "ename":"dim_stock",
            //                     "key":"5909036342218200984_null_null",
            //                     "tableId":"5909036342218200984"
            //                 },
            //                 {
            //                     "ename":"agg_cust_stock",
            //                     "key":"6654039838990088781_null_null",
            //                     "tableId":"6654039838990088781"
            //                 },
            //                 {
            //                     "ename":"dim_branch",
            //                     "key":"7622010004000754907_null_null",
            //                     "tableId":"7622010004000754907"
            //                 }
            //             ],
            //             "type":2
            //         },
            //         {
            //             "businessTypeName":"营业部统计信息表(agg_branch_statistics_info)",
            //             "creator":"liangzhi",
            //             "id":"104",
            //             "isUseStandard":false,
            //             "metricsNumber":90,
            //             "modelTableList":[
            //                 {
            //                     "ename":"agg_branch_statistics_info",
            //                     "key":"5864200909203621256_null_null",
            //                     "tableId":"5864200909203621256"
            //                 },
            //                 {
            //                     "ename":"dim_branch",
            //                     "key":"7622010004000754907_null_null",
            //                     "tableId":"7622010004000754907"
            //                 }
            //             ],
            //             "type":2
            //         }
            //     ]

            let redioDefultValue = radioList.length > 0 ? radioList[0].id : ''
            runInAction(() => {
                this.homeRedioDefultValue = redioDefultValue + ''
                this.radioList = radioList
                if (radioList.length > 0) {
                    this.moreTipsDis = 'none'
                } else {
                    this.moreTipsDis = 'block'
                }
            })
        } else {
            NotificationWrap.error(
                res.msg
                    ? res.msg
                    : '请求业务类型失败！')
        }
    }

    /**
     * 获取推荐问句
     * @param  {String} [redioDefultValue] [业务类型]
     * @return {[listData]}             [推荐问句]
     */
    @action.bound async getHomeRecommendData(redioDefultValue, type) {
        let req = {}
        req.businessTypeId = redioDefultValue
        req.page_size = 30
        req.type = type
        this.listLoading = true
        const res = await getRecommendQuery(req)
        if (res.code == 200) {
            runInAction(() => {
                this.homeListData = this.splitArr(this.splitArr(res.data, 5), 2)
            })
        } else {
            NotificationWrap.error(
                res.msg
                    ? res.msg
                    : '请求推荐问句失败！')
        }
        this.listLoading = false
    }

    splitArr(data, num) {
        let result = []
        for (let i = 0; i < data.length; i += num) {
            result.push(data.slice(i, i + num))
        }
        return result
    }

    /**
     * 获取推荐问句
     * @param  {String} [redioDefultValue] [业务类型]
     * @return {[listData]}             [推荐问句]
     */
    @action.bound async getRecommendData(redioDefultValue) {
        let req = {}
        req.businessTypeId = redioDefultValue
        const res = await getRecommendQuery(req)
        if (res.code == 200) {
            runInAction(() => {
                this.listData = res.data
            })
        } else {
            NotificationWrap.error(
                res.msg
                    ? res.msg
                    : '请求推荐问句失败！')
        }
    }

    /**
     * 获取相关问句（除首页是推荐问句，其他都是相关问句）
     * @param  {Object} [params={}] [description]
     * @return {[type]}             [description]
     */
    @action.bound async getRelatedQueryData(keyword, businessId) {
        let req = {}
        req.keyword = keyword
        req.businessId = businessId || this.redioDefultValue

        // const res = await getRelatedQuery(req)
        // if (res.code == 200) {
        //     runInAction(() => {
        //         // this.listData = [
        //         //     {
        //         //         "id": 1,
        //         //         "query": "2016年1月8日年日均融资余额最大的10个客户"
        //         //     }, {
        //         //         "id": 2,
        //         //         "query": "2016年1月5日维保比例<140%客户人数占所有客户人数的比例"
        //         //     }, {
        //         //         "id": 3,
        //         //         "query": "2016年1月1日客户融资余额之和"
        //         //     }, {
        //         //         "id": 4,
        //         //         "query": "2016年1月3日学历是学士且性别为女的客户人数"
        //         //     }, {
        //         //         "id": 5,
        //         //         "query": "2016年1月7日融资余额超过5000万的客户是谁"
        //         //     }
        //         // ]
        //         this.listData = res.data
        //     })
        // } else {
        //     NotificationWrap.error(
        //         res.msg
        //         ? res.msg
        //         : "请求相关问句失败！")
        // }
    }
    // 给数据加上序号
    filteredProjects(data) {
        let newData = []
        _.map(data, (node) => {
            node.key = ++this.orderNumber
            newData.push(node)
        })
        return newData
    }
}

const store = new Store()
export default store
