import { message } from 'antd'
import { getAppModelList, getAppModelOverview, getAppModelReference, getAppModelRelationGraph, getAppModelRelationList, saveAppModelModify } from 'app_api/metadata/modelManage'

class ModelManageService {
    /**
     * 应用模型-》报表列表数据获取
     *
     * @param {*} params
     * @param { report | dim } modelType
     */
    static async getAppModelListData(modelType, params = {}) {
        let res = await getAppModelList({ ...params, modelType })
        if (res.code == 200) {
            return res
        } else {
            message.error(res.msg)
            return null
        }
    }

    static async handleAppModelModify(params) {
        let res = await saveAppModelModify({ ...params })
        // return
        if (res.code == 200) {
            message.success(res.msg)
            return res.data || true
        } else {
            message.error(res.msg)
            return null
        }
    }

    static async getAppModelRelationListData(params) {
        let res = await getAppModelRelationList({ ...params })
        if (res.code == 200) {
            return res
        } else {
            message.error(res.msg)
            return null
        }
    }

    static async getAppModelReferenceData(params) {
        let res = await getAppModelReference({ ...params })
        if (res.code == 200) {
            return res
        } else {
            message.error(res.msg)
            return null
        }
    }

    static async getAppModelRelationGraphData(params) {
        let res = await getAppModelRelationGraph({ ...params })
        if (res.code == 200) {
            // return {
            //     "relationTables": {
            //         "linkDataArray": [
            //             {
            //                 "from": "5627560039619094488",
            //                 "fromFieldText": "aid",
            //                 "fromPort": "1238906807788639619",
            //                 "id": "44822",
            //                 "text": "1",
            //                 "join": "LEFT",
            //                 "to": "3702414090830001272",
            //                 "toFieldText": "aid",
            //                 "toPort": "3927854588385745665",
            //                 "toText": "1"
            //             },
            //             {
            //                 "from": "3602840687749306578",
            //                 "fromFieldText": "aid",
            //                 "fromPort": "3953718327678676786",
            //                 "id": "44823",
            //                 "text": "1",
            //                 "join": "RIGHT",
            //                 "to": "3702414090830001272",
            //                 "toFieldText": "aid",
            //                 "toPort": "3927854588385745665",
            //                 "toText": "1"
            //             },
            //             {
            //                 "from": "5970431975426442044",
            //                 "fromFieldText": "jid",
            //                 "fromPort": "3209735411493834995",
            //                 "id": "44824",
            //                 "text": "1",
            //                 "join": "INNER",
            //                 "to": "6988831649020673977",
            //                 "toFieldText": "jid",
            //                 "toPort": "4771710422303584493",
            //                 "toText": "1"
            //             },
            //             {
            //                 "from": "1145614917479054240",
            //                 "fromFieldText": "jid",
            //                 "fromPort": "2822822499673847011",
            //                 "id": "44825",
            //                 "text": "1",
            //                 "join": "FULL",
            //                 "to": "6988831649020673977",
            //                 "toFieldText": "jid",
            //                 "toPort": "4771710422303584493",
            //                 "toText": "1"
            //             },
            //             {
            //                 "from": "5855915012939507260",
            //                 "fromFieldText": "kid",
            //                 "fromPort": "9172444698656983842",
            //                 "id": "44826",
            //                 "text": "1",
            //                 "join": "CROSS",
            //                 "to": "7161302614547487417",
            //                 "toFieldText": "kid",
            //                 "toPort": "1295015627977091900",
            //                 "toText": "1"
            //             },
            //             {
            //                 "from": "6387103165158855962",
            //                 "fromFieldText": "kid",
            //                 "fromPort": "5071061356717723842",
            //                 "id": "44827",
            //                 "text": "1",
            //                 "to": "7161302614547487417",
            //                 "toFieldText": "kid",
            //                 "toPort": "1295015627977091900",
            //                 "toText": "1"
            //             },
            //             {
            //                 "from": "6309493948044942884",
            //                 "fromFieldText": "kid",
            //                 "fromPort": "4859213860601332154",
            //                 "id": "44828",
            //                 "text": "1",
            //                 "to": "7161302614547487417",
            //                 "toFieldText": "kid",
            //                 "toPort": "1295015627977091900",
            //                 "toText": "1"
            //             },
            //             {
            //                 "from": "399295288205122285",
            //                 "fromFieldText": "citing",
            //                 "fromPort": "5822099660526797359",
            //                 "id": "44829",
            //                 "text": "1",
            //                 "to": "1145614917479054240",
            //                 "toFieldText": "pid",
            //                 "toPort": "1822969320297628142",
            //                 "toText": "1"
            //             },
            //             {
            //                 "from": "399295288205122285",
            //                 "fromFieldText": "cited",
            //                 "fromPort": "8300029602569290396",
            //                 "id": "44830",
            //                 "text": "1",
            //                 "to": "1145614917479054240",
            //                 "toFieldText": "pid",
            //                 "toPort": "1822969320297628142",
            //                 "toText": "1"
            //             },
            //             {
            //                 "from": "7013734867946970046",
            //                 "fromFieldText": "pid",
            //                 "fromPort": "6535493477496621526",
            //                 "id": "44831",
            //                 "text": "1",
            //                 "to": "1145614917479054240",
            //                 "toFieldText": "pid",
            //                 "toPort": "1822969320297628142",
            //                 "toText": "1"
            //             },
            //             {
            //                 "from": "6309493948044942884",
            //                 "fromFieldText": "pid",
            //                 "fromPort": "4757022643401185660",
            //                 "id": "44832",
            //                 "text": "1",
            //                 "to": "1145614917479054240",
            //                 "toFieldText": "pid",
            //                 "toPort": "1822969320297628142",
            //                 "toText": "1"
            //             },
            //             {
            //                 "from": "3602840687749306578",
            //                 "fromFieldText": "pid",
            //                 "fromPort": "2532493673972784319",
            //                 "id": "44833",
            //                 "text": "1",
            //                 "to": "1145614917479054240",
            //                 "toFieldText": "pid",
            //                 "toPort": "1822969320297628142",
            //                 "toText": "1"
            //             },
            //             {
            //                 "from": "1046605390734082585",
            //                 "fromFieldText": "cid",
            //                 "fromPort": "4134357167180544542",
            //                 "id": "44834",
            //                 "text": "1",
            //                 "to": "2969486015320165531",
            //                 "toFieldText": "cid",
            //                 "toPort": "6528238393176451009",
            //                 "toText": "1"
            //             },
            //             {
            //                 "from": "1145614917479054240",
            //                 "fromFieldText": "cid",
            //                 "fromPort": "8259859200696199669",
            //                 "id": "44835",
            //                 "text": "1",
            //                 "to": "2969486015320165531",
            //                 "toFieldText": "cid",
            //                 "toPort": "6528238393176451009",
            //                 "toText": "1"
            //             },
            //             {
            //                 "from": "5627560039619094488",
            //                 "fromFieldText": "did",
            //                 "fromPort": "3308703932828758172",
            //                 "id": "44836",
            //                 "text": "1",
            //                 "to": "8507663708190571718",
            //                 "toFieldText": "did",
            //                 "toPort": "4294972105617869796",
            //                 "toText": "1"
            //             },
            //             {
            //                 "from": "1046605390734082585",
            //                 "fromFieldText": "did",
            //                 "fromPort": "8911628580342596755",
            //                 "id": "44837",
            //                 "text": "1",
            //                 "to": "8507663708190571718",
            //                 "toFieldText": "did",
            //                 "toPort": "4294972105617869796",
            //                 "toText": "1"
            //             },
            //             {
            //                 "from": "5970431975426442044",
            //                 "fromFieldText": "did",
            //                 "fromPort": "4308634665461937002",
            //                 "id": "44838",
            //                 "text": "1",
            //                 "to": "8507663708190571718",
            //                 "toFieldText": "did",
            //                 "toPort": "4294972105617869796",
            //                 "toText": "1"
            //             },
            //             {
            //                 "from": "5855915012939507260",
            //                 "fromFieldText": "did",
            //                 "fromPort": "6269272013901710706",
            //                 "id": "44839",
            //                 "text": "1",
            //                 "to": "8507663708190571718",
            //                 "toFieldText": "did",
            //                 "toPort": "4294972105617869796",
            //                 "toText": "1"
            //             },
            //             {
            //                 "from": "7013734867946970046",
            //                 "fromFieldText": "did",
            //                 "fromPort": "8327845538506661696",
            //                 "id": "44840",
            //                 "text": "1",
            //                 "to": "8507663708190571718",
            //                 "toFieldText": "did",
            //                 "toPort": "4294972105617869796",
            //                 "toText": "1"
            //             },
            //             {
            //                 "from": "3702414090830001272",
            //                 "fromFieldText": "oid",
            //                 "fromPort": "2432673669462440088",
            //                 "id": "44841",
            //                 "text": "1",
            //                 "to": "3196457704582052685",
            //                 "toFieldText": "oid",
            //                 "toPort": "3843324171238584094",
            //                 "toText": "1"
            //             }
            //         ],
            //         "nodeDataArray": [
            //             {
            //                 "fields": [
            //                     {
            //                         "cname": "cited",
            //                         "dataType": "INT",
            //                         "hasIndex": false,
            //                         "id": "8300029602569290396",
            //                         "keyType": 2
            //                     },
            //                     {
            //                         "cname": "citing",
            //                         "dataType": "INT",
            //                         "hasIndex": false,
            //                         "id": "5822099660526797359",
            //                         "keyType": 2
            //                     }
            //                 ],
            //                 "key": "399295288205122285",
            //                 "tableName": "cite"
            //             },
            //             {
            //                 "fields": [
            //                     {
            //                         "cname": "did",
            //                         "dataType": "INT",
            //                         "hasIndex": false,
            //                         "id": "8911628580342596755",
            //                         "keyType": 2
            //                     },
            //                     {
            //                         "cname": "cid",
            //                         "dataType": "INT",
            //                         "hasIndex": false,
            //                         "id": "4134357167180544542",
            //                         "keyType": 2
            //                     }
            //                 ],
            //                 "key": "1046605390734082585",
            //                 "tableName": "domain_conference"
            //             },
            //             {
            //                 "fields": [
            //                     {
            //                         "cname": "cid",
            //                         "dataType": "INT",
            //                         "hasIndex": false,
            //                         "id": "8259859200696199669",
            //                         "keyType": 2
            //                     },
            //                     {
            //                         "cname": "pid",
            //                         "dataType": "INT",
            //                         "hasIndex": false,
            //                         "id": "1822969320297628142",
            //                         "keyType": 0
            //                     },
            //                     {
            //                         "cname": "jid",
            //                         "dataType": "INT",
            //                         "hasIndex": false,
            //                         "id": "2822822499673847011",
            //                         "keyType": 2
            //                     }
            //                 ],
            //                 "key": "1145614917479054240",
            //                 "tableName": "publication"
            //             },
            //             {
            //                 "fields": [
            //                     {
            //                         "cname": "cid",
            //                         "dataType": "INT",
            //                         "hasIndex": false,
            //                         "id": "6528238393176451009",
            //                         "keyType": 0
            //                     }
            //                 ],
            //                 "key": "2969486015320165531",
            //                 "tableName": "conference"
            //             },
            //             {
            //                 "fields": [
            //                     {
            //                         "cname": "oid",
            //                         "dataType": "INT",
            //                         "hasIndex": false,
            //                         "id": "3843324171238584094",
            //                         "keyType": 0
            //                     }
            //                 ],
            //                 "key": "3196457704582052685",
            //                 "tableName": "organization"
            //             },
            //             {
            //                 "fields": [
            //                     {
            //                         "cname": "aid",
            //                         "dataType": "INT",
            //                         "hasIndex": false,
            //                         "id": "3953718327678676786",
            //                         "keyType": 2
            //                     },
            //                     {
            //                         "cname": "pid",
            //                         "dataType": "INT",
            //                         "hasIndex": false,
            //                         "id": "2532493673972784319",
            //                         "keyType": 2
            //                     }
            //                 ],
            //                 "key": "3602840687749306578",
            //                 "tableName": "writes"
            //             },
            //             {
            //                 "fields": [
            //                     {
            //                         "cname": "oid",
            //                         "dataType": "INT",
            //                         "hasIndex": false,
            //                         "id": "2432673669462440088",
            //                         "keyType": 2
            //                     },
            //                     {
            //                         "cname": "aid",
            //                         "dataType": "INT",
            //                         "hasIndex": false,
            //                         "id": "3927854588385745665",
            //                         "keyType": 0
            //                     }
            //                 ],
            //                 "key": "3702414090830001272",
            //                 "tableName": "author"
            //             },
            //             {
            //                 "key": "5268019237411561805",
            //                 "tableName": "ids"
            //             },
            //             {
            //                 "fields": [
            //                     {
            //                         "cname": "aid",
            //                         "dataType": "INT",
            //                         "hasIndex": false,
            //                         "id": "1238906807788639619",
            //                         "keyType": 2
            //                     },
            //                     {
            //                         "cname": "did",
            //                         "dataType": "INT",
            //                         "hasIndex": false,
            //                         "id": "3308703932828758172",
            //                         "keyType": 2
            //                     }
            //                 ],
            //                 "key": "5627560039619094488",
            //                 "tableName": "domain_author"
            //             },
            //             {
            //                 "fields": [
            //                     {
            //                         "cname": "kid",
            //                         "dataType": "INT",
            //                         "hasIndex": false,
            //                         "id": "9172444698656983842",
            //                         "keyType": 2
            //                     },
            //                     {
            //                         "cname": "did",
            //                         "dataType": "INT",
            //                         "hasIndex": false,
            //                         "id": "6269272013901710706",
            //                         "keyType": 2
            //                     }
            //                 ],
            //                 "key": "5855915012939507260",
            //                 "tableName": "domain_keyword"
            //             },
            //             {
            //                 "fields": [
            //                     {
            //                         "cname": "did",
            //                         "dataType": "INT",
            //                         "hasIndex": false,
            //                         "id": "4308634665461937002",
            //                         "keyType": 2
            //                     },
            //                     {
            //                         "cname": "jid",
            //                         "dataType": "INT",
            //                         "hasIndex": false,
            //                         "id": "3209735411493834995",
            //                         "keyType": 2
            //                     }
            //                 ],
            //                 "key": "5970431975426442044",
            //                 "tableName": "domain_journal"
            //             },
            //             {
            //                 "fields": [
            //                     {
            //                         "cname": "kid",
            //                         "dataType": "INT",
            //                         "hasIndex": false,
            //                         "id": "4859213860601332154",
            //                         "keyType": 2
            //                     },
            //                     {
            //                         "cname": "pid",
            //                         "dataType": "INT",
            //                         "hasIndex": false,
            //                         "id": "4757022643401185660",
            //                         "keyType": 2
            //                     }
            //                 ],
            //                 "key": "6309493948044942884",
            //                 "tableName": "publication_keyword"
            //             },
            //             {
            //                 "fields": [
            //                     {
            //                         "cname": "kid",
            //                         "dataType": "INT",
            //                         "hasIndex": false,
            //                         "id": "5071061356717723842",
            //                         "keyType": 2
            //                     }
            //                 ],
            //                 "key": "6387103165158855962",
            //                 "tableName": "keyword_variations"
            //             },
            //             {
            //                 "fields": [
            //                     {
            //                         "cname": "jid",
            //                         "dataType": "INT",
            //                         "hasIndex": false,
            //                         "id": "4771710422303584493",
            //                         "keyType": 0
            //                     }
            //                 ],
            //                 "key": "6988831649020673977",
            //                 "tableName": "journal"
            //             },
            //             {
            //                 "fields": [
            //                     {
            //                         "cname": "pid",
            //                         "dataType": "INT",
            //                         "hasIndex": false,
            //                         "id": "6535493477496621526",
            //                         "keyType": 2
            //                     },
            //                     {
            //                         "cname": "did",
            //                         "dataType": "INT",
            //                         "hasIndex": false,
            //                         "id": "8327845538506661696",
            //                         "keyType": 2
            //                     }
            //                 ],
            //                 "key": "7013734867946970046",
            //                 "tableName": "domain_publication"
            //             },
            //             {
            //                 "fields": [
            //                     {
            //                         "cname": "kid",
            //                         "dataType": "INT",
            //                         "hasIndex": false,
            //                         "id": "1295015627977091900",
            //                         "keyType": 0
            //                     }
            //                 ],
            //                 "key": "7161302614547487417",
            //                 "tableName": "keyword"
            //             },
            //             {
            //                 "fields": [
            //                     {
            //                         "cname": "did",
            //                         "dataType": "INT",
            //                         "hasIndex": false,
            //                         "id": "4294972105617869796",
            //                         "keyType": 0
            //                     }
            //                 ],
            //                 "key": "8507663708190571718",
            //                 "tableName": "domain"
            //             }
            //         ]
            //     }
            // }

            return res.data
        } else {
            message.error(res.msg)
            return null
        }
    }

    static async getAppModelOverviewData(params) {
        let res = await getAppModelOverview({ ...params })
        if (res.code == 200) {
            return res.data
        } else {
            message.error(res.msg)
            return null
        }
    }
}

export default ModelManageService
