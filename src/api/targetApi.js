import sendPost from './base';

import CONSTANTS from 'app_constants';

const serverList = CONSTANTS['SERVER_LIST'];
const connectWho = 'dmpTestServer';

// 采集日志表格查询方法
export async function getTableData(params = {}) {
    console.log(params)
    // const data = await sendPost('/quantchiAPI/api/query', 'get', params, serverList[connectWho]);
    // if (data == undefined) {
    //     return false;
    // }
    // return data.data.data;
};

// 采集日志日志记录查询方法
export async function getLogList(params = {}) {
    console.log(params)
    // const data = await sendPost('/quantchiAPI/api/query', 'post', params, serverList[connectWho]);
    // if (data == undefined) {
    //     return false;
    // }
    // return data.data;
};
// 手动采集表格查询方法
export async function getManualTableData(params = {}) {
    console.log(params)
    // const data = await sendPost('/quantchiAPI/api/query', 'get', params, serverList[connectWho]);
    // if (data == undefined) {
    //     return false;
    // }
    // return data.data.data;
};

// 手动采集记录查询方法
export async function getManualLogList(params = {}) {
    console.log(params)
    // const data = await sendPost('/quantchiAPI/api/query', 'post', params, serverList[connectWho]);
    // if (data == undefined) {
    //     return false;
    // }
    // return data.data;
};
export async function getMapTableData(params = {}) {
    const data =await sendPost('/quantchiAPI/api/selectMetric', 'post', params, serverList[connectWho])
    if (data == undefined) {
        return false;
    }
    return data.data;
}