import {sendPost} from './base';

import CONSTANTS from 'app_constants';

const serverList = CONSTANTS['API_LIST']['examination'];


/**
 * 常规报告总体情况
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getGeneralReport(params = {}) {
    // const data = await httpObj.httpPost(serverList['generalStatistic'], params);
    // if (data == undefined) {
    //     return false;
    // }
    // return data.data;
    return  {
                 "code":200,
                 "data":{
                     "abnormal_rate":0.64,
                     "exam_date":"2018-08-31 10:28:29",
                     "fields_abnormal":32,
                     "fields_sum":89,
                     "table_sum":4
                 },
                 "msg":"ok",
                 "total":5
             };
};

/**
 * 常规报告 异常详情
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getGeneralReportTable(params = {}) {
    // const data = await httpObj.httpPost(serverList['generalAbnormal'], params);
    // if (data == undefined) {
    //     return false;
    // }
    // return data.data;
    return {
             "code":200,
             "data":[
                    {
                        "abnormal_detail":"缺失值太高",
                        "abnormal_level":"高",
                        "field_name":"type",
                        "key":1705,
                        "tbl_name":"dim_customer"
                    },
                    {"abnormal_detail":"缺失值太高","abnormal_level":"高","field_name":"nation_id","key":1706,"tbl_name":"dim_customer"},
                    {"abnormal_detail":"缺失值太高","abnormal_level":"高","field_name":"register_address","key":1707,"tbl_name":"dim_customer"},
                    {"abnormal_detail":"缺失值太高","abnormal_level":"高","field_name":"province","key":1708,"tbl_name":"dim_customer"},
                    {"abnormal_detail":"缺失值太高","abnormal_level":"高","field_name":"city","key":1709,"tbl_name":"dim_customer"},
                    {"abnormal_detail":"缺失值太高","abnormal_level":"高","field_name":"region","key":1710,"tbl_name":"dim_customer"},
                    {"abnormal_detail":"缺失值太高","abnormal_level":"高","field_name":"street","key":1711,"tbl_name":"dim_customer"},
                    {"abnormal_detail":"缺失值太高","abnormal_level":"高","field_name":"e_mail","key":1712,"tbl_name":"dim_customer"},
                    {"abnormal_detail":"缺失值太高","abnormal_level":"高","field_name":"company","key":1713,"tbl_name":"dim_customer"},
                    {"abnormal_detail":"缺失值太高","abnormal_level":"高","field_name":"control_person","key":1714,"tbl_name":"dim_customer"}
                ],
                msg: "ok",
                total: 32
            };
};

/**
 * 常规报告 历史统计
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getGeneralHistoryStatistic(params = {}) {
    // const data = await httpObj.httpPost(serverList['generalHistoryStatistic'], params);
    // if (data == undefined) {
    //     return false;
    // }
    // return data.data;

    return {
        'abnormal':{
            'resolved':80,
            'unresolved':26,
            'new':30
        },
        "dataQualityTrends":{
            "table":{
                'date':["12-01","12-02","12-03","12-04","12-05","12-06","12-07"],
                'data':[[51,40,11],[46,33,13],[64,51,13],[52,48,3],[60,45,15],[62,48,14]] //[全部，正常，异常]
            },
            "field":{
                'date':["12-01","12-02","12-03","12-04","12-05","12-06","12-07"],
                'data':[[51,40,11],[46,33,13],[64,51,13],[52,48,3],[60,45,15],[62,48,14]] //[全部，正常，异常]
            },
        },
        "abnormalTop":{
            "table":[{name:"个股信息",value:0.35},{name:"个股信息2",value:0.15}],
            "field":[{name:"个股信息",value:0.35},{name:"个股信息2",value:0.15}]
        }
    };
};


/**
 * 常规报告 异常详情
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getGeneralFieldTable(params = {}) {
    // const data = await httpObj.httpPost(serverList['generalAbnormal'], params);
    // if (data == undefined) {
    //     return false;
    // }
    // return data.data;
    return {
             "code":200,
             "data":[
                    {
                        "field_name":"type",
                        "key":1,
                        "index_name":"dim_customer",
                        "miss_num":20,
                        "miss_ratio":0.2,
                        "abnormal_num":32,
                        "abnormal_ratio":0.15,
                        "max_value":100,
                        "min_value":5,
                        "avg_value":60,
                        "deviation":56,
                        "upper_quartile":0.74,
                        "lower_quartile":0.26,
                    },
                    {
                        "field_name":"type",
                        "key":2,
                        "index_name":"dim_customer",
                        "miss_num":20,
                        "miss_ratio":0.2,
                        "abnormal_num":32,
                        "abnormal_ratio":0.15,
                        "max_value":100,
                        "min_value":5,
                        "avg_value":60,
                        "deviation":56,
                        "upper_quartile":0.74,
                        "lower_quartile":0.26,
                    },
                    {
                        "field_name":"type",
                        "key":3,
                        "index_name":"dim_customer",
                        "miss_num":20,
                        "miss_ratio":0.2,
                        "abnormal_num":32,
                        "abnormal_ratio":0.15,
                        "max_value":100,
                        "min_value":5,
                        "avg_value":60,
                        "deviation":56,
                        "upper_quartile":0.74,
                        "lower_quartile":0.26,
                    },
                    {
                        "field_name":"type",
                        "key":4,
                        "index_name":"dim_customer",
                        "miss_num":20,
                        "miss_ratio":0.2,
                        "abnormal_num":32,
                        "abnormal_ratio":0.15,
                        "max_value":100,
                        "min_value":5,
                        "avg_value":60,
                        "deviation":56,
                        "upper_quartile":0.74,
                        "lower_quartile":0.26,
                    },
                    {
                        "field_name":"type",
                        "key":5,
                        "index_name":"dim_customer",
                        "miss_num":20,
                        "miss_ratio":0.2,
                        "abnormal_num":32,
                        "abnormal_ratio":0.15,
                        "max_value":100,
                        "min_value":5,
                        "avg_value":60,
                        "deviation":56,
                        "upper_quartile":0.74,
                        "lower_quartile":0.26,
                    },
                    {
                        "field_name":"type",
                        "key":6,
                        "index_name":"dim_customer",
                        "miss_num":20,
                        "miss_ratio":0.2,
                        "abnormal_num":32,
                        "abnormal_ratio":0.15,
                        "max_value":100,
                        "min_value":5,
                        "avg_value":60,
                        "deviation":56,
                        "upper_quartile":0.74,
                        "lower_quartile":0.26,
                    }
                ],
                msg: "ok",
                total: 32
            };
};

/**
 * 数据核检 用户分组数据获取
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getUserGroupList( params = {} ){
    return {
             "code":200,
             "data":[
                 {
                     key:12,
                     name:"市场部",
                     num:13
                 },
                 {
                     key:13,
                     name:"市场部",
                     num:18
                 }
             ],
             "msg":'ok',
             "total":20
         }
}

/**
 * 数据核检 用户列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getUserList( params = {} ){
    return {
             "code":200,
             "data":[
                 {
                     key:12,
                     name:"小王",
                     group:'市场部',
                     email:'123@qq.com',
                     phone:15338763663,
                 },
                 {
                     key:13,
                     name:"小美",
                     group:'市场部',
                     email:'123@qq.com',
                     phone:15338763663,
                 }
             ],
             "msg":'ok',
             "total":20
         }
}

/**
 * 数据核检 用户列表
 * @param  {Object} [params={}] [description]
 * @return {[type]}             [description]
 */
export async function getRrror( params = {} ){
    return {
             "code":200,
             "data":[
                 {
                     key:1,
                     datasource: "UF2.0",
                     datatable: 'dim_customer',
                     datafield: 'type',
                     level: "高",
                     desc: "“客户类型”不能为空",
                 },
                 {
                     key:2,
                     datasource: "UF2.0",
                     datatable: 'dim_customer',
                     datafield: 'e-mail',
                     level: "高",
                     desc: "“邮箱”不能为空",
                 },{
                     key:3,
                     datasource: "UF2.0",
                     datatable: 'dim_customer',
                     datafield: 'company',
                     level: "中",
                     desc: "“公司”不能为空",
                 },{
                     key:4,
                     datasource: "UF2.0",
                     datatable: 'dim_customer',
                     datafield: 'city',
                     level: "高",
                     desc: "“城市”不能为空",
                 },{
                     key:5,
                     datasource: "UF2.0",
                     datatable: 'dim_customer',
                     datafield: 'province',
                     level: "高",
                     desc: "“省份”不能为空",
                 },{
                     key:6,
                     datasource: "UF2.0",
                     datatable: 'dim_branch',
                     datafield: 'company_no',
                     level: "中",
                     desc: "“客户类型”不能为空",
                 },{
                     key:7,
                     datasource: "UF2.0",
                     datatable: 'dim_branch',
                     datafield: 'branch_name',
                     level: "高",
                     desc: "“邮箱”不能为空",
                 },{
                     key:8,
                     datasource: "UF2.0",
                     datatable: 'dim_customer',
                     datafield: 'f_branch_no',
                     level: "高",
                     desc: "“公司”不能为空",
                 },{
                     key:9,
                     datasource: "UF2.0",
                     datatable: 'dim_customer',
                     datafield: 'branch_category',
                     level: "高",
                     desc: "“城市”不能为空",
                 },{
                     key:10,
                     datasource: "UF2.0",
                     datatable: 'dim_customer',
                     datafield: 'latitude',
                     level: "高",
                     desc: "“省份”不能为空",
                 }
             ],
             "msg":'ok',
             "total":20
         }
}
