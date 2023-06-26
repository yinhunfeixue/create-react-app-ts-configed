// import sendPost from './base';
import sendPost, { formData, httpObj } from './base'
import CONSTANTS from 'app_constants';

const serverList = CONSTANTS['SERVER_LIST'];
const connectWho = 'dmpTestServer';

//新建客群
export async function createCustomerGroup(params = {}) {
    const data = await sendPost('/quantchiAPI/api/createCustomerGroup', 'post', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;
};

//删除客群
export async function deleteCustomerGroup(params = {}) {
    const data = await sendPost('/quantchiAPI/api/deleteCustomerGroup', 'post', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;
};

//新建客群条件
export async function createCustomerGroupCriteria(params = {}) {
    const data = await sendPost('/quantchiAPI/api/createCustomerGroupCriteria', 'post', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;
};

//客群条件列表查看
export async function listCustomerGroupCriterias(params = {}) {
    const data = await sendPost('/quantchiAPI/api/listCustomerGroupCriterias', 'post', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;
};

//检索维度下拉数据
export async function getDdlDimData(params = {}) {
    const data = await sendPost('/quantchiAPI/api/getDdlDimData', 'post', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;
};

//客群客户检索结果展示
export async function listCustomersWithDim(params = {}) {
    const data = await sendPost('/quantchiAPI/api/listCustomersWithDim', 'post', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;
};

//客群客户详情列表展示
export async function listCustomersByCustomerGroupId(params = {}) {
    const data = await sendPost('/quantchiAPI/api/listCustomersByCustomerGroupId', 'post', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;
};

//客群客户列表结果导出
export async function exportCustomerList(params = "") {
    // window.open(serverList[connectWho] + '/quantchiAPI/api/exportCustomerList' + params, "_self");
    httpObj.httpGetDownload(serverList[connectWho] + '/quantchiAPI/api/exportCustomerList' + params, {})
    return
};

//客群画像
export async function getCustomerPortraitData(params = {}, key) {
    const data = await sendPost(`/quantchiAPI/api/customerGroupPortrayal/${key}`, 'post', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;
};

//刷新客群
export async function refreshCustomerGroup(params = {}) {
    const data = await sendPost('/quantchiAPI/api/refreshCustomerGroup', 'post', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;
};

//查看客群条件
export async function findCustomerGroup(params = {}) {
    const data = await sendPost('/quantchiAPI/api/findCustomerCondition', 'post', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;
};
// 删除客群条件
export async function delCustomerGroup(params = {}) {
    const data = await sendPost(`/quantchiAPI/api/deleteCustomerGroupCondition`, 'post', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;
};
//获取客群列表数据
export async function getCustomerData(params = {}) {
    const data = await sendPost('/quantchiAPI/api/listCustomerGroups', 'post', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;
};
