import sendPost from './base';

import CONSTANTS from 'app_constants';

const serverList = CONSTANTS['SERVER_LIST'];
const connectWho = 'dmpTestServer';

// 同和接口开始-----------------------------------------------------------------------
export async function taskScheduler(params = {}) {
    const data = await sendPost('/task/scheduler', 'post', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;
};
// 同和接口结束-------------------------------------------------------------------------------

// 客户画像开始-----------------------------------------------------------------------
// 增加标签
export async function savePortrait(params = {}) {
    const data = await sendPost('/portrait/new_tag', 'post', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;
};

// 新增标签-阈值调整（上半部分图）
export async function tagParamAdjust(params = {}) {
    const data = await sendPost('/portrait/param_adjust', 'post', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;
};

// 新增标签-计算
export async function tagDistribution(params = {}) {
    const data = await sendPost('/portrait/tag_distribution', 'post', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;
};

// 请求标签列表
export async function getTagList(params = {}) {
    const data = await sendPost('/portrait/tag_list', 'get', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;

};

// 请求我的标签列表
export async function getMyTagList(params = {}) {
    const data = await sendPost('/portrait/my_tag_list', 'get', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;

};

// 标签审核列表
export async function tagChecklist(params = {}) {
    const data = await sendPost('/portrait/my_audit_tag_list', 'get', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;
};

// 标签中文名校验
export async function tagCheckunique(params = {}) {
    const data = await sendPost('/dmp/myterm/checkunique', 'get', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;
};

// 详情（我的标签和标签审核）
export async function tagDetail(params = {}) {
    const data = await sendPost('/portrait/edit_info', 'get', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;
};

// 标签列表 标签详情-历史版本（正式库）
export async function tagVersion(params = {}) {
    const data = await sendPost('/portrait/tag_version', 'get', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;
};

// 标签列表 标签详情-统计信息（正式库）
export async function tagPhyInfo(params = {}) {
    const data = await sendPost('/portrait/tag_phy_info', 'get', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;
};

// 标签列表 标签详情-统计信息（正式库）
export async function tagStatInfo(params = {}) {
    const data = await sendPost('/portrait/stat_info', 'get', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;
};

// 详细信息接口(标签列表)
export async function myTagDetail(params = "") {
    const data = await sendPost('/portrait/tag_detail', 'get', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;
};

// 标签搜索
export async function tagSearch(params = {}) {
    const data = await sendPost('/portrait/search', 'get', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;
};

/*
标签审核各操作接口
    id： 1
    operate： 多操作用逗号分隔
        check_ready：提交审核,
        check_pass：审核通过
 */

export async function mytagOperate(params = {}) {
    const data = await sendPost('/portrait/audit_tag', 'post', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;
};

// 更新
export async function updateLogicInfo(params = {}) {
    const data = await sendPost('/portrait/update_logic_info', 'put', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;
};

// 标签列表 停用或启用
export async function yesOrNo(params = {}) {
    const data = await sendPost('/portrait/yes_or_no', 'post', params, serverList[connectWho]);
    if (data == undefined) {
        return false;
    }
    return data.data;
};

// 客户画像结束-------------------------------------------------------------------------------
