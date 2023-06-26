const tabConfigs = [
    {
        name: '数据分级管理',
        path: 'dama/dataSecurity/classManage/index.jsx',
        route: '/dt_security/scy_lvl/manage',
        children: [
            {
                name: '安全管理-详情',
                title: '详情',
                path: 'dama/dataSecurity/classManage/detail.jsx',
                route: '/dt_security/scy_lvl/detials',
            },
            {
                name: '安全配置',
                path: 'dama/dataSecurity/classManage/config.jsx',
                route: '/classManage/config',
            },
            {
                name: '批量安全配置',
                path: 'dama/dataSecurity/classManage/batchConfig.jsx',
                route: '/classManage/batchConfig',
            },
        ]
    },
    {
        name: '脱敏规则',
        path: 'dama/dataSecurity/dataMasking/dataMasking.jsx',
        route: '/dt_securtiy/data_masking',
    },
    {
        name: '敏感标签',
        path: 'dama/dataSecurity/sensitiveTag/index.jsx',
        route: '/dt_security/sensitive_tag',
        children: [
            {
                name: '映射字段',
                path: 'dama/dataSecurity/sensitiveTag/mapColumnDetail.jsx',
                route: '/sensitiveTag/mapColumnDetail',
            }
        ]
    },
    {
        name: '数仓分层',
        path: 'dama/dataSecurity/dataWareLevel/index.jsx',
        route: '/setting/dw_layer/def',
    },
    {
        name: '系统分类',
        path: 'dama/dataSecurity/category/index.jsx',
        route: '/setting/sys_category/manage',
    },
    {
        name: '业务分类',
        path: 'dama/dataSecurity/dataCategory/index.jsx',
        route: '/dt_calssification/def/biz',
    },
    {
        name: '数仓主题',
        path: 'dama/dataSecurity/dataCategory/dataWareHouse.jsx',
        route: '/dt_classification/def/dw_sub',
    },
    {
        name: '分析主题',
        path: 'dama/dataSecurity/dataCategory/analysis.jsx',
        route: '/dt_calssification/def/anls_sub',
    },
    {
        name: '数仓分层管理',
        path: 'dama/dataSecurity/dataWareMap/index.jsx',
        route: '/setting/dw_layer/mapping',
    },
    {
        name: '分类分级配置',
        path: 'dama/dataSecurity/dataCategory/securitySet/index.jsx',
        route: '/dt_calssification/def/securitySet',
    },
]
// const tabConfigs = {
//     '分类分级查询': {
//         'name': '分类分级查询',
//         'path': 'dama/dataSecurity/classManage/class.jsx',
//         needReload: true,
//         refresh: true
//     },
//     'classManageDetail': {
//         'name': '详情页',
//         'path': 'dama/dataSecurity/classManage/detail.jsx',
//         needReload: true,
//         refresh: true
//     },
//     '分类分级配置': {
//         'name': '分类分级配置',
//         'path': 'dama/dataSecurity/classManage/config.jsx',
//         needReload: true,
//         refresh: true
//     },
//     '批量表配置': {
//         'name': '批量表配置',
//         'path': 'dama/dataSecurity/classManage/massConfigTable.jsx',
//         needReload: true,
//         refresh: true
//     },
//     '批量字段配置': {
//         'name': '批量字段配置',
//         'path': 'dama/dataSecurity/classManage/massConfigColumn.jsx',
//         needReload: true,
//         refresh: true
//     },
//     '分类分级定版': {
//         'name': '分类分级定版',
//         'path': 'dama/dataSecurity/version/version.jsx',
//         needReload: true,
//         refresh: true
//     },
//     'classHistoryRecord': {
//         'name': '历史版本',
//         'path': 'dama/dataSecurity/version/historyRecord.jsx',
//         needReload: true,
//         refresh: true
//     },
//     '历史版本详情': {
//         'name': '历史版本详情',
//         'path': 'dama/dataSecurity/version/versionDetail.jsx',
//         needReload: true,
//         refresh: true
//     },
//     'classTreeEdit': {
//         'name': '分类树维护',
//         'path': 'dama/dataSecurity/treeEdit/classTreeEdit.jsx',
//         needReload: true,
//         refresh: true
//     },
//     '脱敏规则': {
//         'name': '脱敏规则',
//         'path': 'dama/dataSecurity/dataMasking/dataMasking.jsx',
//         needReload: true,
//         refresh: true
//     },
//     '脱敏字段': {
//         'name': '脱敏字段',
//         'path': 'dama/dataSecurity/dataMasking/column.jsx',
//         needReload: true,
//         refresh: true
//     },
//     '脱敏详情': {
//         'name': '脱敏详情',
//         'path': 'dama/dataSecurity/dataMasking/columnDetail.jsx',
//         needReload: true,
//         refresh: true
//     },
//     '审核日志': {
//         'name': '审核日志',
//         'path': 'dama/dataSecurity/auditLog/auditLog.jsx',
//         needReload: true,
//         refresh: true
//     },
// }
export default tabConfigs