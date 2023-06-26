import { httpObj } from './base'
import axios from 'axios'
import CONSTANTS from 'app_constants'

const apiList = CONSTANTS['API_LIST']['keywordSearch']
const connectWho = 'dmpTestServer'

// 获取数据管理列表
export async function getkewordsearchData(params = {}) {
    const data = await httpObj.httpGet(apiList['getkewordsearchData'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 上传文件接口
export async function uploadFile(params = {}) {
    const data = await httpObj.httpPost(apiList['uploadFile'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 上传字段校验
export async function checkFileName(params = {}) {
    const data = await httpObj.httpGet(apiList['checkFileName'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 字段类型配置提交
export async function creatTableWithColumn(params = {}) {
    const data = await httpObj.httpPost(apiList['creatTableWithColumn'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 数据配置列表
export async function columnSetting(params = {}) {
    const data = await httpObj.httpGet(apiList['columnSetting'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 数据配置列表
export async function postColumnSetting(params = {}) {
    const data = await httpObj.httpPost(apiList['columnSetting'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 数据预览
export async function getPreview(params = {}) {
    const data = await httpObj.httpGet(apiList['preview'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 下载错误
export async function downloadError(params = '') {
    window.open(`${apiList['downloadError']}${params}`, '_self')
}

// ============================keyword search 应用接口===============================//
// keyword search 接口
export async function getSearchData(params = {}) {
    const data = await httpObj.httpCancelPost(apiList['search'], params)
    if (data === undefined) {
        return false
    }
    return data.data

    // return {
    //     'code': 200,
    //     'data': {
    //         'chartx': {
    //             'code': 200,
    //             'data': {
    //                 'chartData': {
    //                     'settings': {
    //                         'selectedValues': {
    //                             'yAxis': [
    //                                 {
    //                                     'name': '年龄的和'
    //                                 }
    //                             ],
    //                             'xAxis': [
    //                                 {
    //                                     'name': '年收入的和'
    //                                 }
    //                             ],
    //                             'size': [
    //                                 {
    //                                     'name': '子女的和'
    //                                 }
    //                             ],
    //                             'legend': [
    //                                 {
    //                                     'legend': '姓名'
    //                                 }
    //                             ],
    //                             'label': [
    //                                 {
    //                                     'name': '住址'
    //                                 }
    //                             ]
    //                         },
    //                         'selectedCollection': {
    //                             'yAxis': [
    //                                 '年收入的和',
    //                                 '年龄的和',
    //                                 '子女的和',
    //                                 '月收入的和',
    //                                 '手机号码的和'
    //                             ],
    //                             'xAxis': [
    //                                 '年收入的和',
    //                                 '年龄的和',
    //                                 '子女的和',
    //                                 '月收入的和',
    //                                 '手机号码的和'
    //                             ],
    //                             'size': [
    //                                 '年收入的和',
    //                                 '年龄的和',
    //                                 '子女的和',
    //                                 '月收入的和',
    //                                 '手机号码的和'
    //                             ],
    //                             'legend': [
    //                                 '职务',
    //                                 '住址',
    //                                 '喜好',
    //                                 '姓名',
    //                                 '工作单位'
    //                             ],
    //                             'label': [
    //                                 '职务',
    //                                 '住址',
    //                                 '喜好',
    //                                 '姓名',
    //                                 '工作单位'
    //                             ]
    //                         }
    //                     },
    //                     'level': 0,
    //                     'chartType': 'Bubble',
    //                     'options': {
    //                         'geoms': [
    //                             {
    //                                 'color': '姓名',
    //                                 'size': '子女的和',
    //                                 'position': '年收入的和*年龄的和',
    //                                 'type': 'point'
    //                             }
    //                         ]
    //                     },
    //                     'legendSize': 2,
    //                     'title': '每个住址、姓名的年收入的和、年龄的和、子女的和',
    //                     'dataset': [
    //                         {
    //                             '姓名': '诸',
    //                             '住址': '大连市港�          ',
    //                             '子女的和': 0,
    //                             '年收入的和': 4,
    //                             '年龄的和': 28
    //                         },
    //                         {
    //                             '姓名': '� ',
    //                             '住址': '上海市徐�          ',
    //                             '子女的和': 0,
    //                             '年收入的和': 4,
    //                             '年龄的和': 20
    //                         },
    //                         {
    //                             '姓名': '� ',
    //                             '住址': '北京市海淀�        ',
    //                             '子女的和': 0,
    //                             '年收入的和': 4,
    //                             '年龄的和': 36
    //                         },
    //                         {
    //                             '姓名': '� ',
    //                             '住址': '广州市越�           ',
    //                             '子女的和': 0,
    //                             '年收入的和': 4,
    //                             '年龄的和': 16
    //                         },
    //                         {
    //                             '姓名': '� ',
    //                             '住址': '杭州市余杭�       ',
    //                             '子女的和': 32,
    //                             '年收入的和': 1400000,
    //                             '年龄的和': 112
    //                         },
    //                         {
    //                             '姓名': '� ',
    //                             '住址': '杭州市江            ',
    //                             '子女的和': 4,
    //                             '年收入的和': 2000000,
    //                             '年龄的和': 204
    //                         },
    //                         {
    //                             '姓名': '� ',
    //                             '住址': '杭州市滨江区滨盛',
    //                             '子女的和': 36,
    //                             '年收入的和': 1600000,
    //                             '年龄的和': 124
    //                         },
    //                         {
    //                             '姓名': '� ',
    //                             '住址': '杭州市西湖区益   ',
    //                             '子女的和': 32,
    //                             '年收入的和': 1280000,
    //                             '年龄的和': 136
    //                         },
    //                         {
    //                             '姓名': '� ',
    //                             '住址': '沂蒙市沂�          ',
    //                             '子女的和': 8,
    //                             '年收入的和': 4000000,
    //                             '年龄的和': 212
    //                         },
    //                         {
    //                             '姓名': '� ',
    //                             '住址': '深圳市罗�           ',
    //                             '子女的和': 0,
    //                             '年收入的和': 4,
    //                             '年龄的和': 12
    //                         }
    //                     ]
    //                 },
    //                 'tableData': [
    //                     {
    //                         'default': {
    //                             'aggregationValue': '4',
    //                             'aggregationType': 'distinct'
    //                         },
    //                         'name': '职务',
    //                         'aggregation': [
    //                             'distinct',
    //                             'count'
    //                         ],
    //                         'fieldType': 'string'
    //                     },
    //                     {
    //                         'default': {
    //                             'aggregationValue': '10',
    //                             'aggregationType': 'distinct'
    //                         },
    //                         'name': '住址',
    //                         'aggregation': [
    //                             'distinct',
    //                             'count'
    //                         ],
    //                         'fieldType': 'string'
    //                     },
    //                     {
    //                         'default': {
    //                             'aggregationValue': '1',
    //                             'aggregationType': 'distinct'
    //                         },
    //                         'name': '性别',
    //                         'aggregation': [
    //                             'distinct',
    //                             'count'
    //                         ],
    //                         'fieldType': 'string'
    //                     },
    //                     {
    //                         'default': {
    //                             'aggregationValue': '1.03千万',
    //                             'aggregationType': 'sum'
    //                         },
    //                         'name': '年收入的和',
    //                         'aggregation': [
    //                             'sum',
    //                             'avg',
    //                             'max',
    //                             'min'
    //                         ],
    //                         'fieldType': 'decimal'
    //                     },
    //                     {
    //                         'default': {
    //                             'aggregationValue': '900',
    //                             'aggregationType': 'sum'
    //                         },
    //                         'name': '年龄的和',
    //                         'aggregation': [
    //                             'sum',
    //                             'avg',
    //                             'max',
    //                             'min'
    //                         ],
    //                         'fieldType': 'decimal'
    //                     },
    //                     {
    //                         'default': {
    //                             'aggregationValue': '112',
    //                             'aggregationType': 'sum'
    //                         },
    //                         'name': '子女的和',
    //                         'aggregation': [
    //                             'sum',
    //                             'avg',
    //                             'max',
    //                             'min'
    //                         ],
    //                         'fieldType': 'decimal'
    //                     },
    //                     {
    //                         'default': {
    //                             'aggregationValue': '7',
    //                             'aggregationType': 'distinct'
    //                         },
    //                         'name': '喜好',
    //                         'aggregation': [
    //                             'distinct',
    //                             'count'
    //                         ],
    //                         'fieldType': 'string'
    //                     },
    //                     {
    //                         'default': {
    //                             'aggregationValue': '2',
    //                             'aggregationType': 'distinct'
    //                         },
    //                         'name': '姓名',
    //                         'aggregation': [
    //                             'distinct',
    //                             'count'
    //                         ],
    //                         'fieldType': 'string'
    //                     },
    //                     {
    //                         'default': {
    //                             'aggregationValue': '1',
    //                             'aggregationType': 'distinct'
    //                         },
    //                         'name': '户籍',
    //                         'aggregation': [
    //                             'distinct',
    //                             'count'
    //                         ],
    //                         'fieldType': 'string'
    //                     },
    //                     {
    //                         'default': {
    //                             'aggregationValue': '28.4万',
    //                             'aggregationType': 'sum'
    //                         },
    //                         'name': '月收入的和',
    //                         'aggregation': [
    //                             'sum',
    //                             'avg',
    //                             'max',
    //                             'min'
    //                         ],
    //                         'fieldType': 'decimal'
    //                     },
    //                     {
    //                         'default': {
    //                             'aggregationValue': '3',
    //                             'aggregationType': 'distinct'
    //                         },
    //                         'name': '工作单位',
    //                         'aggregation': [
    //                             'distinct',
    //                             'count'
    //                         ],
    //                         'fieldType': 'string'
    //                     },
    //                     {
    //                         'default': {
    //                             'aggregationValue': '5384.44亿',
    //                             'aggregationType': 'sum'
    //                         },
    //                         'name': '手机号码的和',
    //                         'aggregation': [
    //                             'sum',
    //                             'avg',
    //                             'max',
    //                             'min'
    //                         ],
    //                         'fieldType': 'decimal'
    //                     }
    //                 ],
    //                 'chartSelectStatus': {
    //                     'Geo': false,
    //                     'Line': true,
    //                     'StackedColumn': true,
    //                     'Bar': true,
    //                     'Bubble': true,
    //                     'Column': true,
    //                     'Scatter': true,
    //                     'Pie': true,
    //                     'StackedBar': true
    //                 }
    //             }
    //         },
    //         'head': [
    //             {
    //                 'cname': '职务',
    //                 'columnType': 2,
    //                 'ename': 'column11'
    //             },
    //             {
    //                 'cname': '住址',
    //                 'columnType': 2,
    //                 'ename': 'column6'
    //             },
    //             {
    //                 'cname': '性别',
    //                 'columnType': 2,
    //                 'ename': 'column4'
    //             },
    //             {
    //                 'cname': '年收入的和',
    //                 'columnType': 1,
    //                 'ename': 'column13'
    //             },
    //             {
    //                 'cname': '年龄的和',
    //                 'columnType': 1,
    //                 'ename': 'column3'
    //             },
    //             {
    //                 'cname': '子女的和',
    //                 'columnType': 1,
    //                 'ename': 'column9'
    //             },
    //             {
    //                 'cname': '喜好',
    //                 'columnType': 2,
    //                 'ename': 'column14'
    //             },
    //             {
    //                 'cname': '姓名',
    //                 'columnType': 2,
    //                 'ename': 'column1'
    //             },
    //             {
    //                 'cname': '户籍',
    //                 'columnType': 2,
    //                 'ename': 'column5'
    //             },
    //             {
    //                 'cname': '月收入的和',
    //                 'columnType': 1,
    //                 'ename': 'column12'
    //             },
    //             {
    //                 'cname': '工作单位',
    //                 'columnType': 2,
    //                 'ename': 'column10'
    //             },
    //             {
    //                 'cname': '手机号码的和',
    //                 'columnType': 1,
    //                 'ename': 'column7'
    //             }
    //         ],
    //         'inspector': {
    //             'alias': '主查询',
    //             'filters': [

    //             ],
    //             'groupBys': [
    //                 '职务',
    //                 '住址',
    //                 '性别',
    //                 '喜好',
    //                 '姓名',
    //                 '户籍',
    //                 '工作单位'
    //             ],
    //             'joinConditions': [

    //             ],
    //             'orderBys': [

    //             ],
    //             'selects': [
    //                 '职务',
    //                 '住址',
    //                 '性别',
    //                 '年收入的和',
    //                 '年龄的和',
    //                 '子女的和',
    //                 '喜好',
    //                 '姓名',
    //                 '户籍',
    //                 '月收入的和',
    //                 '工作单位',
    //                 '手机号码的和'
    //             ],
    //             'subqueries': [

    //             ]
    //         },
    //         'nodeList': [
    //             {
    //                 'businessId': '224539503063115237',
    //                 'cnPath': 'liangzhi自有数据库-用户信息表(1).csv-职务',
    //                 'content': '职务',
    //                 'id': '344098559793206308',
    //                 'path': 'dmp_user_liangzhi.dmp8904230544224894396tbl.column11',
    //                 'status': 0,
    //                 'type': 2
    //             },
    //             {
    //                 'businessId': '224539503063115237',
    //                 'cnPath': 'liangzhi自有数据库-用户信息表(1).csv-住址',
    //                 'content': '住址',
    //                 'id': '435201645200464814',
    //                 'path': 'dmp_user_liangzhi.dmp8904230544224894396tbl.column6',
    //                 'status': 0,
    //                 'type': 2
    //             },
    //             {
    //                 'businessId': '224539503063115237',
    //                 'cnPath': 'liangzhi自有数据库-用户信息表(1).csv-性别',
    //                 'content': '性别',
    //                 'id': '968815152275751945',
    //                 'path': 'dmp_user_liangzhi.dmp8904230544224894396tbl.column4',
    //                 'status': 0,
    //                 'type': 2
    //             },
    //             {
    //                 'businessId': '224539503063115237',
    //                 'cnPath': 'liangzhi自有数据库-用户信息表(1).csv-年收入',
    //                 'content': '年收入',
    //                 'id': '1134258916068019079',
    //                 'path': 'dmp_user_liangzhi.dmp8904230544224894396tbl.column13',
    //                 'status': 0,
    //                 'type': 1
    //             },
    //             {
    //                 'businessId': '224539503063115237',
    //                 'cnPath': 'liangzhi自有数据库-用户信息表(1).csv-年龄',
    //                 'content': '年龄',
    //                 'id': '3534012143949128974',
    //                 'path': 'dmp_user_liangzhi.dmp8904230544224894396tbl.column3',
    //                 'status': 0,
    //                 'type': 1
    //             },
    //             {
    //                 'businessId': '224539503063115237',
    //                 'cnPath': 'liangzhi自有数据库-用户信息表(1).csv-子女',
    //                 'content': '子女',
    //                 'id': '3616078293152774451',
    //                 'path': 'dmp_user_liangzhi.dmp8904230544224894396tbl.column9',
    //                 'status': 0,
    //                 'type': 1
    //             },
    //             {
    //                 'businessId': '224539503063115237',
    //                 'cnPath': 'liangzhi自有数据库-用户信息表(1).csv-喜好',
    //                 'content': '喜好',
    //                 'id': '3730962997563452032',
    //                 'path': 'dmp_user_liangzhi.dmp8904230544224894396tbl.column14',
    //                 'status': 0,
    //                 'type': 2
    //             },
    //             {
    //                 'businessId': '224539503063115237',
    //                 'cnPath': 'liangzhi自有数据库-用户信息表(1).csv-姓名',
    //                 'content': '姓名',
    //                 'id': '4211038251290360491',
    //                 'path': 'dmp_user_liangzhi.dmp8904230544224894396tbl.column1',
    //                 'status': 0,
    //                 'type': 2
    //             },
    //             {
    //                 'businessId': '224539503063115237',
    //                 'cnPath': 'liangzhi自有数据库-用户信息表(1).csv-户籍',
    //                 'content': '户籍',
    //                 'id': '4728884605660243098',
    //                 'path': 'dmp_user_liangzhi.dmp8904230544224894396tbl.column5',
    //                 'status': 0,
    //                 'type': 2
    //             },
    //             {
    //                 'businessId': '224539503063115237',
    //                 'cnPath': 'liangzhi自有数据库-用户信息表(1).csv-月收入',
    //                 'content': '月收入',
    //                 'id': '4858259440267520792',
    //                 'path': 'dmp_user_liangzhi.dmp8904230544224894396tbl.column12',
    //                 'status': 0,
    //                 'type': 1
    //             },
    //             {
    //                 'businessId': '224539503063115237',
    //                 'cnPath': 'liangzhi自有数据库-用户信息表(1).csv-工作单位',
    //                 'content': '工作单位',
    //                 'id': '5194841219559732403',
    //                 'path': 'dmp_user_liangzhi.dmp8904230544224894396tbl.column10',
    //                 'status': 0,
    //                 'type': 2
    //             },
    //             {
    //                 'businessId': '224539503063115237',
    //                 'cnPath': 'liangzhi自有数据库-用户信息表(1).csv-手机号码',
    //                 'content': '手机号码',
    //                 'id': '5394070828189907773',
    //                 'path': 'dmp_user_liangzhi.dmp8904230544224894396tbl.column7',
    //                 'status': 0,
    //                 'type': 1
    //             }
    //         ],
    //         'sql': '',
    //         'tabulate': [
    //             {
    //                 'column1': '� ',
    //                 'column12': '4',
    //                 'column11': '副',
    //                 'column10': '中�',
    //                 'column5': '�',
    //                 'column4': '�',
    //                 'column3': '12',
    //                 'column9': '0',
    //                 'column7': '54844444444',
    //                 'column6': '深圳市罗�           ',
    //                 'column14': '变�',
    //                 'column13': '4'
    //             },
    //             {
    //                 'column1': '� ',
    //                 'column12': '4',
    //                 'column11': '副',
    //                 'column10': '中�',
    //                 'column5': '�',
    //                 'column4': '�',
    //                 'column3': '36',
    //                 'column9': '0',
    //                 'column7': '54044444444',
    //                 'column6': '北京市海淀�        ',
    //                 'column14': '捉 ',
    //                 'column13': '4'
    //             },
    //             {
    //                 'column1': '� ',
    //                 'column12': '40000',
    //                 'column11': '副',
    //                 'column10': '中�',
    //                 'column5': '�',
    //                 'column4': '�',
    //                 'column3': '212',
    //                 'column9': '8',
    //                 'column7': '53644444444',
    //                 'column6': '沂蒙市沂�          ',
    //                 'column14': '走�',
    //                 'column13': '4000000'
    //             },
    //             {
    //                 'column1': '� ',
    //                 'column12': '92000',
    //                 'column11': 'CEO',
    //                 'column10': '量� ',
    //                 'column5': '�',
    //                 'column4': '�',
    //                 'column3': '136',
    //                 'column9': '32',
    //                 'column7': '52444444444',
    //                 'column6': '杭州市西湖区益   ',
    //                 'column14': '�  ',
    //                 'column13': '1280000'
    //             },
    //             {
    //                 'column1': '诸',
    //                 'column12': '4',
    //                 'column11': '副',
    //                 'column10': '中�',
    //                 'column5': '�',
    //                 'column4': '�',
    //                 'column3': '28',
    //                 'column9': '0',
    //                 'column7': '55644444444',
    //                 'column6': '大连市港�          ',
    //                 'column14': '�  ',
    //                 'column13': '4'
    //             },
    //             {
    //                 'column1': '� ',
    //                 'column12': '4',
    //                 'column11': '副',
    //                 'column10': '中�',
    //                 'column5': '�',
    //                 'column4': '�',
    //                 'column3': '20',
    //                 'column9': '0',
    //                 'column7': '54444444444',
    //                 'column6': '上海市徐�          ',
    //                 'column14': '�  ',
    //                 'column13': '4'
    //             },
    //             {
    //                 'column1': '� ',
    //                 'column12': '32000',
    //                 'column11': '� ',
    //                 'column10': '中�',
    //                 'column5': '�',
    //                 'column4': '�',
    //                 'column3': '204',
    //                 'column9': '4',
    //                 'column7': '53244444444',
    //                 'column6': '杭州市江            ',
    //                 'column14': '奢 ',
    //                 'column13': '2000000'
    //             },
    //             {
    //                 'column1': '� ',
    //                 'column12': '20000',
    //                 'column11': '� ',
    //                 'column10': '招  ',
    //                 'column5': '�',
    //                 'column4': '�',
    //                 'column3': '124',
    //                 'column9': '36',
    //                 'column7': '52844444444',
    //                 'column6': '杭州市滨江区滨盛',
    //                 'column14': '�   ',
    //                 'column13': '1600000'
    //             },
    //             {
    //                 'column1': '� ',
    //                 'column12': '100000',
    //                 'column11': '董',
    //                 'column10': '量� ',
    //                 'column5': '�',
    //                 'column4': '�',
    //                 'column3': '112',
    //                 'column9': '32',
    //                 'column7': '52044444444',
    //                 'column6': '杭州市余杭�       ',
    //                 'column14': '�  ',
    //                 'column13': '1400000'
    //             },
    //             {
    //                 'column1': '� ',
    //                 'column12': '4',
    //                 'column11': '副',
    //                 'column10': '中�',
    //                 'column5': '�',
    //                 'column4': '�',
    //                 'column3': '16',
    //                 'column9': '0',
    //                 'column7': '55244444444',
    //                 'column6': '广州市越�           ',
    //                 'column14': '芭�',
    //                 'column13': '4'
    //             }
    //         ],
    //         'title': '职务,住址,性别,年收入的和,年龄的和,子女的和,喜好,姓名,户籍,月收入的和,工作单位,手机号码的和',
    //         'total': 10
    //     }
    // }
    // return {
    //     'code': 200,
    //     'data': {
    //         'chartx': {
    //             'code': 200,
    //             'data': {
    //                 'chartData': {
    //                     'settings': {
    //                         'selectedValues': {
    //                             'yAxis': [
    //                                 {
    //                                     'name': '标题'
    //                                 }
    //                             ],
    //                             'xAxis': [
    //                                 {
    //                                     'name': '被引用数'
    //                                 }
    //                             ]
    //                         },
    //                         'selectedCollection': {
    //                             'yAxis': [
    //                                 '标题'
    //                             ],
    //                             'xAxis': [
    //                                 '被引用数'
    //                             ],
    //                             'legend': [
    //                                 '标题'
    //                             ]
    //                         }
    //                     },
    //                     'level': 0,
    //                     'chartType': 'Bar',
    //                     'options': {
    //                         'geoms': [
    //                             {
    //                                 // 'color': '标题',
    //                                 'position': '标题*被引用数',
    //                                 'type': 'interval'
    //                             }
    //                         ]
    //                     },
    //                     'legendSize': 1,
    //                     'title': '各标题的被引用数的对比',
    //                     'dataset': [
    //                         {
    //                             '被引用数': 1031,
    //                             '标题': 'Proposed NIST Standard for Role-Based Access Control'
    //                         },
    //                         {
    //                             '被引用数': 1359,
    //                             '标题': 'The Sybil Attack'
    //                         },
    //                         {
    //                             '被引用数': 1009,
    //                             '标题': 'Semantic Web Services'
    //                         },
    //                         {
    //                             '被引用数': 1392,
    //                             '标题': 'Location Systems for Ubiquitous Computing'
    //                         },
    //                         {
    //                             '被引用数': 1193,
    //                             '标题': 'The Click modular router'
    //                         },
    //                         {
    //                             '被引用数': 1430,
    //                             '标题': 'Geography-informed energy conservation for Ad Hoc routing'
    //                         },
    //                         {
    //                             '被引用数': 1119,
    //                             '标题': 'Equation-based congestion control for unicast applications'
    //                         },
    //                         {
    //                             '被引用数': 1054,
    //                             '标题': 'Generating Representative Web Workloads for Network and Server Performance Evaluation'
    //                         },
    //                         {
    //                             '被引用数': 1766,
    //                             '标题': 'A comparative study on feature selection in text categorization'
    //                         },
    //                         {
    //                             '被引用数': 1174,
    //                             '标题': 'A reliable multicast framework for light-weight sessions and application level framing'
    //                         },
    //                         {
    //                             '被引用数': 1473,
    //                             '标题': 'Fast and robust fixed-point algorithms for independent component analysis'
    //                         },
    //                         {
    //                             '被引用数': 1233,
    //                             '标题': 'A Study of Cross-Validation and Bootstrap for Accuracy Estimation and Model Selection'
    //                         },
    //                         {
    //                             '被引用数': 4626,
    //                             '标题': 'Bagging predictors'
    //                         },
    //                         {
    //                             '被引用数': 1302,
    //                             '标题': 'Ideal Spatial Adaptation by Wavelet Shrinkage'
    //                         },
    //                         {
    //                             '被引用数': 1121,
    //                             '标题': 'Random Key Predistribution Schemes for Sensor Networks'
    //                         },
    //                         {
    //                             '被引用数': 1417,
    //                             '标题': 'A Fast Fixed-Point Algorithm for Independent Component Analysis'
    //                         },
    //                         {
    //                             '被引用数': 1512,
    //                             '标题': 'Texture Features for Browsing and Retrieval of Image Data'
    //                         },
    //                         {
    //                             '被引用数': 1237,
    //                             '标题': 'Laplacian Eigenmaps for Dimensionality Reduction and Data Representation'
    //                         },
    //                         {
    //                             '被引用数': 1443,
    //                             '标题': 'Communicating and Mobile Systems: The Pi-Calculus'
    //                         },
    //                         {
    //                             '被引用数': 1302,
    //                             '标题': 'Analog integrated circuit design'
    //                         },
    //                         {
    //                             '被引用数': 1155,
    //                             '标题': 'Additive logistic regression: a statistical view of boosting'
    //                         },
    //                         {
    //                             '被引用数': 1029,
    //                             '标题': 'A technique for orthogonal frequency division multiplexing frequency offset correction'
    //                         },
    //                         {
    //                             '被引用数': 1024,
    //                             '标题': 'Toward the Next Generation of Recommender Systems: A Survey of the State-of-the-Art and Possible Extensions'
    //                         },
    //                         {
    //                             '被引用数': 3534,
    //                             '标题': 'Statistical mechanics of complex networks'
    //                         },
    //                         {
    //                             '被引用数': 4986,
    //                             '标题': 'Linear Matrix Inequalities in System and Control Theory'
    //                         },
    //                         {
    //                             '被引用数': 1429,
    //                             '标题': 'Speech and Language Processing: An Introduction to Natural Language Processing, Computational Linguistics, and Speech Recognition'
    //                         },
    //                         {
    //                             '被引用数': 1782,
    //                             '标题': 'Software Architecture: Perspectives on an Emerging Discipline'
    //                         }
    //                     ]
    //                 },
    //                 'tableData': [
    //                     {
    //                         'default': {
    //                             'aggregationValue': '4.41万',
    //                             'aggregationType': 'sum'
    //                         },
    //                         'name': '被引用数',
    //                         'aggregation': [
    //                             'sum',
    //                             'avg',
    //                             'max',
    //                             'min'
    //                         ],
    //                         'fieldType': 'integer'
    //                     },
    //                     {
    //                         'default': {
    //                             'aggregationValue': '27',
    //                             'aggregationType': 'distinct'
    //                         },
    //                         'name': '标题',
    //                         'aggregation': [
    //                             'distinct',
    //                             'count'
    //                         ],
    //                         'fieldType': 'string'
    //                     }
    //                 ],
    //                 'chartSelectStatus': {
    //                     'Geo': false,
    //                     'Line': true,
    //                     'StackedColumn': false,
    //                     'Bar': true,
    //                     'Bubble': false,
    //                     'Column': true,
    //                     'Scatter': false,
    //                     'Pie': true,
    //                     'StackedBar': false
    //                 }
    //             }
    //         },
    //         'head': [
    //             {
    //                 'cname': '被引用数',
    //                 'columnType': 1,
    //                 'ename': 'citation_num'
    //             },
    //             {
    //                 'cname': '标题',
    //                 'columnType': 2,
    //                 'ename': 'title'
    //             }
    //         ],
    //         'inspector': {
    //             'alias': '主查询',
    //             'filters': [
    //                 '被引用数 > 1000'
    //             ],
    //             'groupBys': [

    //             ],
    //             'joinConditions': [

    //             ],
    //             'orderBys': [

    //             ],
    //             'selects': [
    //                 '被引用数',
    //                 '标题'
    //             ],
    //             'subqueries': [

    //             ]
    //         },
    //         'nodeList': [
    //             {
    //                 'classify': 1,
    //                 'content': '被引用数大于1000',
    //                 'sentenceName': 'GREATER',
    //                 'sentenceTagNode': [
    //                     {
    //                         'businessId': '5068364264371488137',
    //                         'cnPath': 'mas-publication-被引用数',
    //                         'content': '被引用数',
    //                         'id': '1353607344876645008',
    //                         'path': 'mas.publication.citation_num',
    //                         'status': 0,
    //                         'type': 1
    //                     }
    //                 ],
    //                 'sentenceValue': [
    //                     '1000'
    //                 ],
    //                 'status': 0,
    //                 'type': 4
    //             },
    //             {
    //                 'businessId': '5068364264371488137',
    //                 'cnPath': 'mas-publication-标题',
    //                 'content': '标题',
    //                 'id': '7346040741980627510',
    //                 'path': 'mas.publication.title',
    //                 'status': 0,
    //                 'type': 2
    //             }
    //         ],
    //         'tabulate': [
    //             {
    //                 'title': 'Proposed NIST Standard for Role-Based Access Control',
    //                 'citation_num': '1031'
    //             },
    //             {
    //                 'title': 'The Sybil Attack',
    //                 'citation_num': '1359'
    //             },
    //             {
    //                 'title': 'Semantic Web Services',
    //                 'citation_num': '1009'
    //             },
    //             {
    //                 'title': 'Location Systems for Ubiquitous Computing',
    //                 'citation_num': '1392'
    //             },
    //             {
    //                 'title': 'The Click modular router',
    //                 'citation_num': '1193'
    //             },
    //             {
    //                 'title': 'Geography-informed energy conservation for Ad Hoc routing',
    //                 'citation_num': '1430'
    //             },
    //             {
    //                 'title': 'Equation-based congestion control for unicast applications',
    //                 'citation_num': '1119'
    //             },
    //             {
    //                 'title': 'Generating Representative Web Workloads for Network and Server Performance Evaluation',
    //                 'citation_num': '1054'
    //             },
    //             {
    //                 'title': 'A comparative study on feature selection in text categorization',
    //                 'citation_num': '1766'
    //             },
    //             {
    //                 'title': 'A reliable multicast framework for light-weight sessions and application level framing',
    //                 'citation_num': '1174'
    //             },
    //             {
    //                 'title': 'Fast and robust fixed-point algorithms for independent component analysis',
    //                 'citation_num': '1473'
    //             },
    //             {
    //                 'title': 'A Study of Cross-Validation and Bootstrap for Accuracy Estimation and Model Selection',
    //                 'citation_num': '1233'
    //             },
    //             {
    //                 'title': 'Bagging predictors',
    //                 'citation_num': '4626'
    //             },
    //             {
    //                 'title': 'Ideal Spatial Adaptation by Wavelet Shrinkage',
    //                 'citation_num': '1302'
    //             },
    //             {
    //                 'title': 'Random Key Predistribution Schemes for Sensor Networks',
    //                 'citation_num': '1121'
    //             },
    //             {
    //                 'title': 'A Fast Fixed-Point Algorithm for Independent Component Analysis',
    //                 'citation_num': '1417'
    //             },
    //             {
    //                 'title': 'Texture Features for Browsing and Retrieval of Image Data',
    //                 'citation_num': '1512'
    //             },
    //             {
    //                 'title': 'Laplacian Eigenmaps for Dimensionality Reduction and Data Representation',
    //                 'citation_num': '1237'
    //             },
    //             {
    //                 'title': 'Communicating and Mobile Systems: The Pi-Calculus',
    //                 'citation_num': '1443'
    //             },
    //             {
    //                 'title': 'Analog integrated circuit design',
    //                 'citation_num': '1302'
    //             },
    //             {
    //                 'title': 'Additive logistic regression: a statistical view of boosting',
    //                 'citation_num': '1155'
    //             },
    //             {
    //                 'title': 'A technique for orthogonal frequency division multiplexing frequency offset correction',
    //                 'citation_num': '1029'
    //             },
    //             {
    //                 'title': 'Toward the Next Generation of Recommender Systems: A Survey of the State-of-the-Art and Possible Extensions',
    //                 'citation_num': '1024'
    //             },
    //             {
    //                 'title': 'Statistical mechanics of complex networks',
    //                 'citation_num': '3534'
    //             },
    //             {
    //                 'title': 'Linear Matrix Inequalities in System and Control Theory',
    //                 'citation_num': '4986'
    //             },
    //             {
    //                 'title': 'Speech and Language Processing: An Introduction to Natural Language Processing, Computational Linguistics, and Speech Recognition',
    //                 'citation_num': '1429'
    //             },
    //             {
    //                 'title': 'Software Architecture: Perspectives on an Emerging Discipline',
    //                 'citation_num': '1782'
    //             }
    //         ],
    //         'title': '被引用数,标题',
    //         'total': 27
    //     }
    // }

    // return {
    //     'code': 200,
    //     'data': {
    //         'chartx': {
    //             'code': 200,
    //             'data': {
    //                 'chartData': {
    //                     'settings': {
    //                         'selectedValues': {
    //                             'yAxis': [{ 'name': '\u6807\u9898' }],
    //                             'xAxis': [{ 'name': '\u88AB\u5F15\u7528\u6570\u7684\u548C' }]
    //                         },
    //                         'selectedCollection': {
    //                             'yAxis': ['\u6807\u9898'],
    //                             'xAxis': ['\u88AB\u5F15\u7528\u6570\u7684\u548C'],
    //                             'legend': ['\u6807\u9898']
    //                         }
    //                     },
    //                     'level': 0,
    //                     'chartType': 'Bar',
    //                     'options': {
    //                         'geoms': [{
    //                             'position': '\u6807\u9898*\u88AB\u5F15\u7528\u6570\u7684\u548C',
    //                             'type': 'interval'
    //                         }]
    //                     },
    //                     'legendSize': 1,
    //                     'title': '\u5404\u6807\u9898\u7684\u88AB\u5F15\u7528\u6570\u7684\u548C\u7684\u5BF9\u6BD4',
    //                     'dataset': [{
    //                         '\u88AB\u5F15\u7528\u6570\u7684\u548C': 1766,
    //                         '\u6807\u9898': 'A comparative study on feature selection in text categorization'
    //                     }, {
    //                         '\u88AB\u5F15\u7528\u6570\u7684\u548C': 1512,
    //                         '\u6807\u9898': 'Texture Features for Browsing and Retrieval of Image Data'
    //                     }, {
    //                         '\u88AB\u5F15\u7528\u6570\u7684\u548C': 3534,
    //                         '\u6807\u9898': 'Statistical mechanics of complex networks'
    //                     }, {
    //                         '\u88AB\u5F15\u7528\u6570\u7684\u548C': 1029,
    //                         '\u6807\u9898': 'A technique for orthogonal frequency division multiplexing frequency offset correction'
    //                     }, {
    //                         '\u88AB\u5F15\u7528\u6570\u7684\u548C': 1237,
    //                         '\u6807\u9898': 'Laplacian Eigenmaps for Dimensionality Reduction and Data Representation'
    //                     }, {
    //                         '\u88AB\u5F15\u7528\u6570\u7684\u548C': 1054,
    //                         '\u6807\u9898': 'Generating Representative Web Workloads for Network and Server Performance Evaluation'
    //                     }, {
    //                         '\u88AB\u5F15\u7528\u6570\u7684\u548C': 1359,
    //                         '\u6807\u9898': 'The Sybil Attack'
    //                     }, {
    //                         '\u88AB\u5F15\u7528\u6570\u7684\u548C': 1443,
    //                         '\u6807\u9898': 'Communicating and Mobile Systems: The Pi-Calculus'
    //                     }, {
    //                         '\u88AB\u5F15\u7528\u6570\u7684\u548C': 1121,
    //                         '\u6807\u9898': 'Random Key Predistribution Schemes for Sensor Networks'
    //                     }, {
    //                         '\u88AB\u5F15\u7528\u6570\u7684\u548C': 1155,
    //                         '\u6807\u9898': 'Additive logistic regression: a statistical view of boosting'
    //                     }, {
    //                         '\u88AB\u5F15\u7528\u6570\u7684\u548C': 1430,
    //                         '\u6807\u9898': 'Geography-informed energy conservation for Ad Hoc routing'
    //                     }, {
    //                         '\u88AB\u5F15\u7528\u6570\u7684\u548C': 4626,
    //                         '\u6807\u9898': 'Bagging predictors'
    //                     }, {
    //                         '\u88AB\u5F15\u7528\u6570\u7684\u548C': 1392,
    //                         '\u6807\u9898': 'Location Systems for Ubiquitous Computing'
    //                     }, {
    //                         '\u88AB\u5F15\u7528\u6570\u7684\u548C': 1119,
    //                         '\u6807\u9898': 'Equation-based congestion control for unicast applications'
    //                     }, {
    //                         '\u88AB\u5F15\u7528\u6570\u7684\u548C': 1302,
    //                         '\u6807\u9898': 'Ideal Spatial Adaptation by Wavelet Shrinkage'
    //                     }, {
    //                         '\u88AB\u5F15\u7528\u6570\u7684\u548C': 1009,
    //                         '\u6807\u9898': 'Semantic Web Services'
    //                     }, {
    //                         '\u88AB\u5F15\u7528\u6570\u7684\u548C': 1473,
    //                         '\u6807\u9898': 'Fast and robust fixed-point algorithms for independent component analysis'
    //                     }, {
    //                         '\u88AB\u5F15\u7528\u6570\u7684\u548C': 1031,
    //                         '\u6807\u9898': 'Proposed NIST Standard for Role-Based Access Control'
    //                     }, {
    //                         '\u88AB\u5F15\u7528\u6570\u7684\u548C': 1024,
    //                         '\u6807\u9898': 'Toward the Next Generation of Recommender Systems: A Survey of the State-of-the-Art and Possible Extensions'
    //                     }, {
    //                         '\u88AB\u5F15\u7528\u6570\u7684\u548C': 1233,
    //                         '\u6807\u9898': 'A Study of Cross-Validation and Bootstrap for Accuracy Estimation and Model Selection'
    //                     }, {
    //                         '\u88AB\u5F15\u7528\u6570\u7684\u548C': 1193,
    //                         '\u6807\u9898': 'The Click modular router'
    //                     }, {
    //                         '\u88AB\u5F15\u7528\u6570\u7684\u548C': 1417,
    //                         '\u6807\u9898': 'A Fast Fixed-Point Algorithm for Independent Component Analysis'
    //                     }, {
    //                         '\u88AB\u5F15\u7528\u6570\u7684\u548C': 1174,
    //                         '\u6807\u9898': 'A reliable multicast framework for light-weight sessions and application level framing'
    //                     }, {
    //                         '\u88AB\u5F15\u7528\u6570\u7684\u548C': 1429,
    //                         '\u6807\u9898': 'Speech and Language Processing: An Introduction to Natural Language Processing, Computational Linguistics, and Speech Recognition'
    //                     }, {
    //                         '\u88AB\u5F15\u7528\u6570\u7684\u548C': 1302,
    //                         '\u6807\u9898': 'Analog integrated circuit design'
    //                     }, {
    //                         '\u88AB\u5F15\u7528\u6570\u7684\u548C': 4986,
    //                         '\u6807\u9898': 'Linear Matrix Inequalities in System and Control Theory'
    //                     }, {
    //                         '\u88AB\u5F15\u7528\u6570\u7684\u548C': 1782,
    //                         '\u6807\u9898': 'Software Architecture: Perspectives on an Emerging Discipline'
    //                     }]
    //                 },
    //                 'tableData': [{
    //                     'default': {
    //                         'aggregationValue': 44132.0,
    //                         'aggregationType': 'sum'
    //                     },
    //                     'name': '\u88AB\u5F15\u7528\u6570\u7684\u548C',
    //                     'aggregation': ['sum', 'avg', 'max', 'min'],
    //                     'fieldType': 'integer'
    //                 }, {
    //                     'default': {
    //                         'aggregationValue': 27,
    //                         'aggregationType': 'distinct'
    //                     },
    //                     'name': '\u6807\u9898',
    //                     'aggregation': ['distinct', 'count'],
    //                     'fieldType': 'string'
    //                 }],
    //                 'chartSelectStatus': {
    //                     'Geo': false,
    //                     'Line': true,
    //                     'StackedColumn': false,
    //                     'Bar': true,
    //                     'Bubble': false,
    //                     'Column': true,
    //                     'Scatter': false,
    //                     'Pie': true,
    //                     'StackedBar': false
    //                 }
    //             }
    //         },
    //         'head': [{
    //             'cname': '\u88AB\u5F15\u7528\u6570\u7684\u548C',
    //             'ename': 'citation_num',
    //             'columnType': 1
    //         }, {
    //             'cname': '\u6807\u9898',
    //             'ename': 'title',
    //             'columnType': 2
    //         }],
    //         'inspector': {
    //             'alias': '\u4E3B\u67E5\u8BE2',
    //             'filters': ['\u88AB\u5F15\u7528\u6570 > 1000'],
    //             'groupBys': ['\u6807\u9898'],
    //             'joinConditions': [],
    //             'orderBys': [],
    //             'selects': ['\u88AB\u5F15\u7528\u6570\u7684\u548C', '\u6807\u9898'],
    //             'subqueries': []
    //         },
    //         'nodeList': [{
    //             'classify': 1,
    //             'content': '\u88AB\u5F15\u7528\u6570\u5927\u4E8E1000',
    //             'sentenceName': 'GREATER',
    //             'sentenceTagNode': [{
    //                 'businessId': '5068364264371488137',
    //                 'content': '\u88AB\u5F15\u7528\u6570',
    //                 'id': '1353607344876645008',
    //                 'path': 'mas.publication.citation_num',
    //                 'status': 0,
    //                 'type': 1
    //             }],
    //             'sentenceValue': ['1000'],
    //             'status': 0,
    //             'type': 4
    //         }, {
    //             'businessId': '5068364264371488137',
    //             'content': '\u6807\u9898',
    //             'id': '7346040741980627510',
    //             'path': 'mas.publication.title',
    //             'status': 0,
    //             'type': 2
    //         }],
    //         'sql': 'SELECT SUM(publication.`citation_num`) AS `\u88AB\u5F15\u7528\u6570\u7684\u548C`,\n\tpublication.`title` AS `\u6807\u9898`\nFROM mas.publication AS `publication`\nWHERE publication.`citation_num` > 1000\nGROUP BY \u6807\u9898\n',
    //         'tabulate': [{
    //             'title': 'A comparative study on feature selection in text categorization',
    //             'citation_num': '1766'
    //         }, {
    //             'title': 'Texture Features for Browsing and Retrieval of Image Data',
    //             'citation_num': '1512'
    //         }, {
    //             'title': 'Statistical mechanics of complex networks',
    //             'citation_num': '3534'
    //         }, {
    //             'title': 'A technique for orthogonal frequency division multiplexing frequency offset correction',
    //             'citation_num': '1029'
    //         }, {
    //             'title': 'Laplacian Eigenmaps for Dimensionality Reduction and Data Representation',
    //             'citation_num': '1237'
    //         }, {
    //             'title': 'Generating Representative Web Workloads for Network and Server Performance Evaluation',
    //             'citation_num': '1054'
    //         }, {
    //             'title': 'The Sybil Attack',
    //             'citation_num': '1359'
    //         }, {
    //             'title': 'Communicating and Mobile Systems: The Pi-Calculus',
    //             'citation_num': '1443'
    //         }, {
    //             'title': 'Random Key Predistribution Schemes for Sensor Networks',
    //             'citation_num': '1121'
    //         }, {
    //             'title': 'Additive logistic regression: a statistical view of boosting',
    //             'citation_num': '1155'
    //         }, {
    //             'title': 'Geography-informed energy conservation for Ad Hoc routing',
    //             'citation_num': '1430'
    //         }, {
    //             'title': 'Bagging predictors',
    //             'citation_num': '4626'
    //         }, {
    //             'title': 'Location Systems for Ubiquitous Computing',
    //             'citation_num': '1392'
    //         }, {
    //             'title': 'Equation-based congestion control for unicast applications',
    //             'citation_num': '1119'
    //         }, {
    //             'title': 'Ideal Spatial Adaptation by Wavelet Shrinkage',
    //             'citation_num': '1302'
    //         }, {
    //             'title': 'Semantic Web Services',
    //             'citation_num': '1009'
    //         }, {
    //             'title': 'Fast and robust fixed-point algorithms for independent component analysis',
    //             'citation_num': '1473'
    //         }, {
    //             'title': 'Proposed NIST Standard for Role-Based Access Control',
    //             'citation_num': '1031'
    //         }, {
    //             'title': 'Toward the Next Generation of Recommender Systems: A Survey of the State-of-the-Art and Possible Extensions',
    //             'citation_num': '1024'
    //         }, {
    //             'title': 'A Study of Cross-Validation and Bootstrap for Accuracy Estimation and Model Selection',
    //             'citation_num': '1233'
    //         }, {
    //             'title': 'The Click modular router',
    //             'citation_num': '1193'
    //         }, {
    //             'title': 'A Fast Fixed-Point Algorithm for Independent Component Analysis',
    //             'citation_num': '1417'
    //         }, {
    //             'title': 'A reliable multicast framework for light-weight sessions and application level framing',
    //             'citation_num': '1174'
    //         }, {
    //             'title': 'Speech and Language Processing: An Introduction to Natural Language Processing, Computational Linguistics, and Speech Recognition',
    //             'citation_num': '1429'
    //         }, {
    //             'title': 'Analog integrated circuit design',
    //             'citation_num': '1302'
    //         }, {
    //             'title': 'Linear Matrix Inequalities in System and Control Theory',
    //             'citation_num': '4986'
    //         }, {
    //             'title': 'Software Architecture: Perspectives on an Emerging Discipline',
    //             'citation_num': '1782'
    //         }],
    //         'title': '\u88AB\u5F15\u7528\u6570\u7684\u548C,\u6807\u9898',
    //         'total': 27
    //     }
    // }

    // return {
    //     'code': 200,
    //     'msg': 'success',
    //     'data': {
    //         'head': [
    //             {
    //                 cname: 'Name',
    //                 ename: 'name'
    //             },
    //             {
    //                 cname: 'Age',
    //                 ename: 'age'
    //             },
    //             {
    //                 cname: 'Address',
    //                 ename: 'address',
    //             },
    //             {
    //                 cname: 'Name1',
    //                 ename: 'name1',
    //             },
    //             {
    //                 cname: 'Age1',
    //                 ename: 'age1',
    //             },
    //             {
    //                 cname: 'Address1',
    //                 ename: 'address1',
    //             }
    //         ],
    //         'tabulate': [
    //             {
    //                 'name': 'Edward King 0',
    //                 'age': 32,
    //                 'address': 'London, Park Lane no. 0',
    //                 'name1': 'Edward King 0',
    //                 'age1': 32,
    //                 'address1': 'London, Park Lane no. 0'
    //             }, {
    //                 'name': 'Edward King 1',
    //                 'age': 32,
    //                 'address': 'London, Park Lane no. 1',
    //                 'name1': 'Edward King 1',
    //                 'age1': 32,
    //                 'address1': 'London, Park Lane no. 1'
    //             }, {
    //                 'name': 'Edward King 2',
    //                 'age': 32,
    //                 'address': 'London, Park Lane no. 2',
    //                 'name1': 'Edward King 2',
    //                 'age1': 32,
    //                 'address1': 'London, Park Lane no. 2'
    //             }, {
    //                 'name': 'Edward King 3',
    //                 'age': 32,
    //                 'address': 'London, Park Lane no. 3',
    //                 'name1': 'Edward King 3',
    //                 'age1': 32,
    //                 'address1': 'London, Park Lane no. 3'
    //             }, {
    //                 'name': 'Edward King 4',
    //                 'age': 32,
    //                 'address': 'London, Park Lane no. 4',
    //                 'name1': 'Edward King 4',
    //                 'age1': 32,
    //                 'address1': 'London, Park Lane no. 4'
    //             }, {
    //                 'name': 'Edward King 4',
    //                 'age': 32,
    //                 'address': 'London, Park Lane no. 4',
    //                 'name1': 'Edward King 4',
    //                 'age1': 32,
    //                 'address1': 'London, Park Lane no. 4'
    //             }, {
    //                 'name': 'Edward King 4',
    //                 'age': 32,
    //                 'address': 'London, Park Lane no. 4',
    //                 'name1': 'Edward King 4',
    //                 'age1': 32,
    //                 'address1': 'London, Park Lane no. 4'
    //             }, {
    //                 'name': 'Edward King 4',
    //                 'age': 32,
    //                 'address': 'London, Park Lane no. 4',
    //                 'name1': 'Edward King 4',
    //                 'age1': 32,
    //                 'address1': 'London, Park Lane no. 4'
    //             }, {
    //                 'name': 'Edward King 4',
    //                 'age': 32,
    //                 'address': 'London, Park Lane no. 4',
    //                 'name1': 'Edward King 4',
    //                 'age1': 32,
    //                 'address1': 'London, Park Lane no. 4'
    //             }
    //         ],
    //         'title': '表格标题表格标题表格标题表格标题表格标题表格标题',
    //         'inspector': {
    //             'alias': '\u4E3B\u67E5\u8BE2',
    //             'filters': ["\u65E5\u671F = '20161115'", '\u878D\u8D44\u76C8\u5229 > 2000000'],
    //             'groupBys': [],
    //             'joinConditions': ['agg_cust_balance.`customer_no` = dim_customer.`customer_no`'],
    //             'orderBys': [],
    //             'selects': ['\u6536\u5E02\u4FDD\u8BC1\u91D1\u53EF\u7528\u4F59\u989D', '\u5BA2\u6237\u4EE3\u7801', '\u5BA2\u6237\u59D3\u540D', '\u65E5\u671F', '\u878D\u8D44\u76C8\u5229'],
    //             'subqueries': []
    //         },
    //         'chartx': {
    //             'code': 200,
    //             'msg': '出错信息',
    //             'data': {
    //                 'chartSelectStatus': {
    //                     'Bar': true,
    //                     'Pie': true,
    //                     'Columns': true,
    //                     'Line': true,
    //                     'Scatter': true,
    //                     'StackedBar': true,
    //                     'StackedColumn': true,
    //                     'Bubble': true
    //                 }, // 图是否可以切换
    //                 'chartData': {
    //                     'level': 0, // 推荐等级，0 不优先展示， 1 优先展示
    //                     'legendSize': 21, // 图例分组数，默认 1
    //                     'dataset': [
    //                         { genre: '111图例分组数图例分组数', sold: 275, type: 'cate', soldw: 9 },
    //                         { genre: 'Strategy1111ewrwewer', type: 'cate', sold: 115, soldw: 5 },
    //                         { genre: 'Actionrwerwrwe', type: 'cate2', sold: 120, soldw: 1 },
    //                         { genre: 'Shooterwerew', type: 'cate', sold: 350, soldw: 2 },
    //                         { genre: '1图例分组数1', type: 'cate2', sold: 150, soldw: 1 },
    //                         { genre: '2图例分组数2', type: 'cate2', sold: 150, soldw: 2 },
    //                         { genre: '3图例分组数3', type: 'cate', sold: 150, soldw: 12 },
    //                         { genre: '4图例分组数4', type: 'cate1', sold: 150, soldw: 3 },
    //                         { genre: '5图例分组数5', type: 'cate', sold: 150, soldw: 4 },
    //                         { genre: '6图例分组数6', type: 'cate', sold: 150, soldw: 5 },
    //                         { genre: '7图例分组数', type: 'cate2', sold: 150, soldw: 12 },
    //                         { genre: '8图例分组数', type: 'cate2', sold: 150, soldw: 9 },
    //                         { genre: 'Other71', type: 'cate1', sold: 150, soldw: 2 },
    //                         { genre: 'Other72', type: 'cate2', sold: 150, soldw: 7 },
    //                         { genre: 'Other73', type: 'cate1', sold: 150, soldw: 12 },
    //                         { genre: 'Other74', type: 'cate1', sold: 150, soldw: 6 },
    //                         { genre: 'Other75', type: 'cate2', sold: 150, soldw: 8 },
    //                         { genre: 'Other76', type: 'cate1', sold: 150, soldw: 12 },
    //                         { genre: 'Other77', type: 'cate1', sold: 150, soldw: 6 },
    //                         { genre: 'Other78', type: 'cate1', sold: 150, soldw: 12 },
    //                         { genre: 'Other79', type: 'cate1', sold: 150, soldw: 9 },
    //                         { genre: 'Other80', type: 'cate1', sold: 150, soldw: 12 },
    //                     ],
    //                     'chartType': 'Bar',
    //                     'options': {
    //                         'geoms': [
    //                             {
    //                                 'type': 'interval',
    //                                 'position': 'genre*sold',
    //                                 'color': 'genre'
    //                             },
    //                         ],

    //                     },
    //                     'settings': {
    //                         'selectedCollection': {
    //                             'xAxis': [
    //                                 '地理11',
    //                                 '地理22',
    //                                 '地理33'
    //                             ],
    //                             'yAxis': [
    //                                 '总计销售额11',
    //                                 '平均数量11',
    //                                 '最大利润11'
    //                             ]
    //                         },
    //                         'selectedValues': {
    //                             'xAxis': [
    //                                 '地理11'
    //                             ],
    //                             'yAxis': [
    //                                 '总计销售额11'
    //                             ]
    //                         }
    //                     },
    //                     'title': '总计销售额 按地区(地理)分布11'
    //                 },
    //                 'tableData': [
    //                     {
    //                         'aggregation': [
    //                             'distinct',
    //                             'count'
    //                         ],
    //                         'default': {
    //                             'aggregationType': 'distinct',
    //                             'aggregationValue': 2
    //                         },
    //                         'fieldType': '----',
    //                         'name': '性别'
    //                     },
    //                     {
    //                         'aggregation': [
    //                             'distinct',
    //                             'count'
    //                         ],
    //                         'default': {
    //                             'aggregationType': 'distinct',
    //                             'aggregationValue': 2
    //                         },
    //                         'fieldType': '----',
    //                         'name': '地理'
    //                     },
    //                     {
    //                         'default': {
    //                             'aggregationType': '',
    //                             'aggregationValue': 'Apr 2015~Oct 2019'
    //                         },
    //                         'fieldType': 'datetime',
    //                         'name': '日期'
    //                     },
    //                     {
    //                         'aggregation': [
    //                             'sum',
    //                             'avg',
    //                             'max',
    //                             'min'
    //                         ],
    //                         'fieldType': '----',
    //                         'default': {
    //                             'aggregationType': 'sum',
    //                             'aggregationValue': 18633443.0
    //                         },
    //                         'name': '总计销售额'
    //                     }
    //                 ],
    //             }
    //         },
    //         'total': 100
    //     }
    // }
}

// keyword search 明细接口
export async function getSearchDetail(params = {}) {
    const data = await httpObj.httpPost(apiList['searchDetail'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// keyword search 聚合接口
export async function getAggregationData(params = {}) {
    const data = await httpObj.httpPost(apiList['aggregation'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 获取业务线及数据集使用记录
export async function getBusiness(params = {}) {
    const data = await httpObj.httpGet(apiList['getBusiness'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 键盘精灵
export async function getQuickTip(params = {}) {
    const data = await httpObj.httpCancelPost(apiList['quickTip'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 获取业务线下所有指标
export async function getMetrics(params = {}) {
    const data = await httpObj.httpGet(apiList['getMetrics'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
export async function searchMetrics(params = {}) {
    const data = await httpObj.httpGet(apiList['searchMetrics'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 获取多个业务线下指标信息
export async function searchMetricsBusiness(params = {}) {
    const data = await httpObj.httpPost(apiList['searchMetricsBusiness'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 左侧栏键盘精灵
export async function leftQuickTip(params = {}) {
    const data = await httpObj.httpPost(apiList['leftQuickTip'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// keyword search 图形切换接口
export async function handleSwitchData(params = {}) {
    httpObj.cancelRequest()
    const data = await httpObj.httpCancelPost(apiList['switch'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// keyword match 图形切换接口
export async function getMatchData(params = {}) {
    httpObj.cancelRequest()
    const data = await httpObj.httpCancelPost(apiList['match'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// 记录推荐
// keyword search 明细接口
export async function logSuggestion(params = {}) {
    const data = await httpObj.httpPost(apiList['logSuggestion'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

/**
 * 智能取数下载接口
 * @param  {Object} [params={}] [description]
 * @return {data}             [description]
 */
export async function kwdDownload(params = '') {
    // window.open(apiList['download'] + params, '_self')
    // let renderTitle = params.renderTitle
    axios({
        url: apiList['download'],
        method: 'post',
        data: params,
        responseType: 'blob'
    }).then(function(res) {
        let blob = new Blob([res.data], { type: res.headers['content-type'] })
        // console.log(res.headers, res.headers['content-disposition'], '------res.headers------')
        let fileName = res.headers['content-disposition'].split(';')[1].split('filename=')[1]
        // console.log(fileName, '------res.headers------')
        let downloadElement = document.createElement('a')
        let href = window.URL.createObjectURL(blob) // 创建下载的链接
        downloadElement.href = href
        downloadElement.download = fileName // 下载后文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() // 点击下载
        document.body.removeChild(downloadElement) // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放掉blob对象
    }).catch(function() {
    })
};

// 首页推荐示例接口
export async function getIndexSample(params = {}) {
    const data = await httpObj.httpGet(apiList['indexSample'], params)
    if (data === undefined) {
        return false
    }
    return data.data

    // return {
    //     code: 200,
    //     msg: 'success',
    //     data: [
    //         {
    //             type: 0,
    //             businessId: '12312',
    //             samples: [
    //                 { 'showName': '度量指标1', 'nodeList': [] },
    //                 { 'showName': '度量指标2', 'nodeList': [] },
    //             ]
    //         },
    //         {
    //             type: 1,
    //             businessId: '12312',
    //             samples: [
    //                 { 'showName': '维度1', 'nodeList': [] },
    //                 { 'showName': '维度2', 'nodeList': [] },
    //             ]
    //         },
    //         {
    //             type: 2,
    //             businessId: '12312',
    //             samples: [
    //                 { 'showName': '过滤1', 'nodeList': [] },
    //                 { 'showName': '过滤2', 'nodeList': [] },
    //             ]
    //         },
    //         {
    //             type: 3,
    //             businessId: '12312',
    //             samples: [
    //                 { 'showName': '计算1', 'nodeList': [] },
    //                 { 'showName': '计算2', 'nodeList': [] },
    //             ]
    //         },
    //         {
    //             type: 0,
    //             businessId: '12312',
    //             samples: [
    //                 { 'showName': '排序1', 'nodeList': [] },
    //                 { 'showName': '排序2', 'nodeList': [] },
    //             ]
    //         }
    //     ]
    // }
}

// 下钻指标列表接口
export async function getDrillIndexList(params = {}) {
    httpObj.cancelRequest()
    const data = await httpObj.httpCancelPost(apiList['drillIndexList'], params)

    // const data = await httpObj.httpPost(apiList['drillIndexList'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// 下钻NodeList获取接口
export async function getDrillDownSearch(params = {}) {
    const data = await httpObj.httpPost(apiList['drillDownSearch'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}
// ==================================END==============================================//

// 业务线分组接口
export async function getDatamanagerCategory(params = {}) {
    const data = await httpObj.httpGet(apiList['datamanagerCategory'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function getDatamanagerBusiness(params = {}) {
    const data = await httpObj.httpGet(apiList['datamanagerBusiness'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

// =================================搜索视图================================================

export async function searchViewAdd(params = {}) {
    const data = await httpObj.httpPost(apiList['searchViewAdd'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function searchViewList(params = {}) {
    const data = await httpObj.httpPost(apiList['searchViewList'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}

export async function deleteSearchViewList(params = {}) {
    const data = await httpObj.httpDel(apiList['searchViewList'], { data: params })
    if (data === undefined) {
        return false
    }
    return data.data
}

// 当前在使用业务线
export async function usingBusinessIds(params = {}) {
    const data = await httpObj.httpGet(apiList['usingBusinessIds'], params)
    if (data === undefined) {
        return false
    }
    return data.data
}