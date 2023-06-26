const tabConfigs = [
    {
        name: '业务规则',
        path: 'dama/examination/ruleList/index',
        route: '/dqm/bizrules/manage',
        children: [
            {
                name: '新增业务规则',
                path: 'dama/examination/businessRule/addRule',
                route: '/dqm/bizrules/add',
            },
            {
                name: '编辑业务规则',
                path: 'dama/examination/businessRule/addRule',
                route: '/dqm/bizrules/edit',
            },
            {
                name: '实现技术规则',
                path: 'dama/examination/techRule/index',
                route: '/dqm/techrules',
            },
            {
                name: '实现技术规则（表）',
                path: 'dama/examination/techRule/index',
                route: '/dqm/tableTechrules',
            },
        ],
    },
    // {
    //     name: '检核任务',
    //     path: 'dama/examination/task/index',
    //     route: '/dqm/task/manage',
    //     children: [
    //         {
    //             name: '执行记录',
    //             path: 'dama/examination/task/record',
    //             route: '/dqm/task/records',
    //             children: [
    //                 {
    //                     name: '执行记录-问题清单',
    //                     title: '问题清单',
    //                     path: 'dama/examination/result/problem',
    //                     route: '/dqm/records_issuelist',
    //                 },
    //             ],
    //         },
    //         {
    //             name: '检核任务详情',
    //             path: 'dama/examination/task/detail',
    //             route: '/dqm/task/details',
    //         },
    //         {
    //             name: '新增检核任务',
    //             path: 'dama/examination/task/addTask',
    //             route: '/dqm/task/add',
    //         },
    //         {
    //             name: '编辑检核任务',
    //             path: 'dama/examination/task/addTask',
    //             route: '/dqm/task/edit',
    //         },
    //     ],
    // },
    {
        name: '检核结果',
        path: 'dama/examination/result/index',
        route: '/dqm/results/manage',
        children: [
            {
                name: '问题清单',
                path: 'dama/examination/result/problem',
                route: '/dqm/issuelist',
            },
            {
                name: '结果历史',
                path: 'dama/examination/result/history',
                route: '/dqm/results/history',
            },
        ],
    },
    {
        name: '检核任务',
        path: 'dama/examination/checkTask/index',
        route: '/dqm/task/manage',
        children: [
            {
                name: '检核任务详情',
                path: 'dama/examination/checkTask/detail',
                route: '/dqm/checkTask/detail',
                layout: 'fullScreen',
            },
        ],
    },
    // {
    //     name: '新业务规则',
    //     path: 'dama/examination/ruleList/index',
    //     route: '/dqm/ruleList/index',
    //     children: [],
    // },
]

export default tabConfigs
// const tabConfigs = {
//     '日常检核': {
//         'name': '日常检核',
//         'path': 'dama/examination/customNew/index',
//     },
//     '手动检核': {
//         'name': '手动检核',
//         'path': 'dama/examination/headCustom/index',
//     },
//     '常规检核': {
//         'name': '常规检核',
//         'path': 'dama/examination/general/index',
//     },
//     '历史报告': {
//         'name': '历史报告',
//         'path': 'dama/examination/general/history/index',
//     },
//     '用户组设置': {
//         'name': '用户组设置',
//         'path': 'dama/examination/mailUserNew/index',
//     },
//     '业务规则': {
//         'name': '业务规则',
//         'path': 'dama/examination/settingsBusin/index',
//     },
//     '新增业务规则': {
//         'name': '新增业务规则',
//         'path': 'dama/examination/settingsBusin/ruleModel',
//     },
//     '修改业务规则': {
//         'name': '修改业务规则',
//         'path': 'dama/examination/settingsBusin/ruleModel',
//     },
//     '查看业务规则': {
//         'name': '查看业务规则',
//         'path': 'dama/examination/settingsBusin/lookRule',
//     },
//     '技术规则': {
//         'name': '技术规则',
//         'path': 'dama/examination/settingsTech/index',
//     },
//     '新增技术规则': {
//         'name': '新增技术规则',
//         'path': 'dama/examination/settingsTech/ruleModel',
//     },
//     '修改技术规则': {
//         'name': '修改技术规则',
//         'path': 'dama/examination/settingsTech/ruleModel',
//     },
//     '查看技术规则': {
//         'name': '查看技术规则',
//         'path': 'dama/examination/settingsTech/lookRule',
//     },
//     '查看字段': {
//         'name': '查看字段',
//         'path': 'dama/examination/general/field/index',
//     },
//     '查看完整结果报告': {
//         'name': '查看完整结果报告',
//         'path': 'dama/examination/wholeReport',
//     },
//     '查看报告': {
//         'name': '查看报告',
//         'path': 'dama/examination/component/report',
//     },
//     '任务报表': {
//         'name': '任务报表',
//         'path': 'dama/examination/general/history/index',
//         'needReload': true
//     },
//     '新增日常检核任务': {
//         'name': '新增日常检核任务',
//         'path': 'dama/examination/examAdd/index',
//         'type': 'auto'
//     },
//     '修改日常检核任务': {
//         'name': '修改日常检核任务',
//         'path': 'dama/examination/examAdd/index',
//         'type': 'auto',
//         'needReload': true
//     },
//     '查看日常检核任务': {
//         'name': '查看日常检核任务',
//         'path': 'dama/examination/examAdd/index',
//         'type': 'auto'
//     },
//     '新增手动检核任务': {
//         'name': '新增手动检核任务',
//         'path': 'dama/examination/examAdd/index',
//         'type': 'Manual'
//     },
//     '修改手动检核任务': {
//         'name': '修改手动检核任务',
//         'path': 'dama/examination/examAdd/index',
//         'type': 'Manual',
//         'needReload': true
//     },
//     '查看手动检核任务': {
//         'name': '查看手动检核任务',
//         'path': 'dama/examination/examAdd/index',
//         'type': 'Manual'
//     },
//     '查看异常': {
//         'name': '查看异常',
//         'path': 'dama/examination/general/history/lookError'
//     },
//     '按天统计': {
//         'name': '按天统计',
//         'path': 'dama/examination/summary/byDay',
//         'needReload': true,
//         refresh: true
//     },
//     '规则列表': {
//         'name': '规则列表',
//         'path': 'dama/examination/summary/ruleList',
//         'needReload': true
//     },
//     '出错记录明细': {
//         'name': '出错记录明细',
//         'path': 'dama/examination/summary/errorRecordDetail',
//         'needReload': true,
//     },
//     '规则管理': {
//         'name': '规则管理',
//         'path': 'dama/examination/ruleManage/index',
//         'needReload': true,
//         // refresh: true
//     },
//     '规则分类': {
//         'name': '规则分类',
//         'path': 'dama/examination/CategoryEdit/index',
//         'needReload': true,
//         // refresh: true
//     },
//     '检核任务': {
//         'name': '检核任务',
//         'path': 'dama/examination/examTask/index',
//         'needReload': true,
//         refresh: true
//     },
//     '新增检核任务': {
//         'name': '新增检核任务',
//         'path': 'dama/examination/examTask/addExamTask',
//         'needReload': true,
//         refresh: true
//     },
//     '修改检核任务': {
//         'name': '修改检核任务',
//         'path': 'dama/examination/examTask/addExamTask',
//         'needReload': true,
//     },
//     '查看检核任务': {
//         'name': '查看检核任务',
//         'path': 'dama/examination/examTask/lookTask',
//         'needReload': true,
//     },
//     '执行日志': {
//         'name': '执行日志',
//         'path': 'dama/examination/ruleGroupManage/collectionRecord/collectionRecord',
//         'needReload': true,
//     },
//     // '新增规则': {
//     //     'name': '新增规则',
//     //     'path': 'dama/examination/ruleManage/ruleModel',
//     //     'needReload': true
//     // },
//     // '修改规则': {
//     //     'name': '修改规则',
//     //     'path': 'dama/examination/ruleManage/ruleModel',
//     //     'needReload': true
//     // },
//     // '查看规则': {
//     //     'name': '查看规则',
//     //     'path': 'dama/examination/ruleManage/lookRule',
//     //     'needReload': true
//     // },
//     '订阅列表': {
//         'name': '订阅列表',
//         'path': 'dama/examination/changeManage/changeSubscriptions',
//         needReload: true,
//         refresh: true
//     },
//     '我的收藏': {
//         'name': '我的收藏',
//         'path': 'dama/examination/changeManage/mySubscriptions',
//         needReload: true,
//         refresh: true
//     },
//     'EXAMINATION:添加订阅': {
//         name: '添加订阅',
//         path: 'dama/examination/changeManage/addSubscriptions',
//         needReload: true,
//         refresh: true
//     },
//     修改订阅: {
//         name: '修改订阅',
//         path: 'dama/examination/changeManage/addSubscriptions',
//         needReload: true
//     },
//     订阅详情: {
//         name: '订阅详情',
//         path: 'dama/examination/changeManage/addSubscriptions',
//         needReload: true
//     }, 数据源详情: {
//         name: '数据源详情',
//         path: 'metadata/dataSourceDetail/dataSourceDetail',
//         needReload: true
//     },
//     // 库详情: {
//     //     name: '库详情',
//     //     path: 'metadata/databaseDetail/databaseDetail',
//     //     needReload: true
//     // },
//     // 表详情: {
//     //     name: '表详情',
//     //     path: 'metadata/tableDetail/tableDetail',
//     //     needReload: true
//     // },
//     // 字段详情: {
//     //     name: '字段详情',
//     //     path: 'metadata/fieldDetail/fieldDetail',
//     //     needReload: true
//     // },
//     // '指标管理-浏览': {
//     //     'name': '指标管理-浏览',
//     //     'path': 'indexma/BrowsePage/index',
//     //     'needReload': true,
//     //     refresh: true
//     // },
//     // '标准列表': {
//     //     'name': '标准列表',
//     //     'path': 'standard/standardMa/list',
//     //     needReload: true,
//     //     refresh: true
//     // },
//     // '指标管理-详情': {
//     //     'name': '指标管理-详情',
//     //     'path': 'indexma/BrowsePage/targetDetail/index',
//     //     needReload: true,
//     // },
//     // '标准-查看详情': {
//     //     'name': '标准-查看详情',
//     //     'path': 'standard/standardMa/modal/index.jsx',
//     //     needReload: true
//     // },
//     // '全局搜索-搜索结果': {
//     //     name: '全局搜索-搜索结果',
//     //     path: 'globalSearch/searchResult',
//     //     needReload: true,
//     // },
//     '执行记录': {
//         'name': '执行记录',
//         'path': 'dama/examination/execLog/index',
//         needReload: true
//     },
//     '考核报表': {
//         'name': '考核报表',
//         'path': 'dama/examination/evaluation/index.jsx',
//         needReload: true
//     },
//     '报表数据': {
//         'name': '报表数据',
//         'path': 'dama/examination/evaluation/valuationTable.jsx',
//         needReload: true
//     },
//     '报表配置': {
//         'name': '报表配置',
//         'path': 'dama/examination/evaluation/tableConfig.jsx',
//         needReload: true,
//         refresh: true
//     },
//     '添加报表': {
//         'name': '添加报表',
//         'path': 'dama/examination/evaluation/addTable.jsx',
//         needReload: true,
//         refresh: true
//     },
//     '修改报表': {
//         'name': '修改报表',
//         'path': 'dama/examination/evaluation/addTable.jsx',
//         needReload: true,
//         refresh: true
//     },
//     '报表详情': {
//         'name': '报表详情',
//         'path': 'dama/examination/evaluation/addTable.jsx',
//         needReload: true,
//         refresh: true
//     },
//     '报表预览': {
//         'name': '报表预览',
//         'path': 'dama/examination/evaluation/tablePreview.jsx',
//         needReload: true,
//         refresh: true
//     },
//     '执行记录-检核规则': {
//         'name': '执行记录-检核规则',
//         'path': 'dama/examination/execLog/execLogRule.jsx',
//         needReload: true
//     },
//     '责任人维护': {
//         'name': '责任人维护',
//         'path': 'dama/examination/responsible/index.jsx',
//         needReload: true,
//         refresh: true
//     },
//     '新增责任人': {
//         'name': '新增责任人',
//         'path': 'dama/examination/responsible/new/index.jsx',
//         needReload: true
//     },
//     '修改责任人': {
//         'name': '修改责任人',
//         'path': 'dama/examination/responsible/new/index.jsx',
//         needReload: true
//     },
//     '责任人明细': {
//         'name': '责任人明细',
//         'path': 'dama/examination/responsible/detail/index.jsx',
//         needReload: true
//     },
//     '报表统计': {
//         name: '报表统计',
//         path: 'dama/examination/report/index.js'
//     },
//     '报表统计-总体': {
//         name: '报表统计-总体',
//         path: 'dama/examination/report/index.js',
//         params: {
//             _all: true
//         },
//         needReload: true
//     },
//     '报表统计-责任机构': {
//         name: '报表统计-责任机构',
//         path: 'dama/examination/report/index.js'
//     },
//     '血缘关系': {
//         'name': '血缘关系',
//         'path': 'metadata/analysis/g6BloodAnalysis/index',
//         'needReload': true,
//         noCache: true
//     },
//     '影响关系': {
//         'name': '影响关系',
//         'path': 'metadata/analysis/g6EffectAnalysis/index',
//         'needReload': true,
//         noCache: true
//     },
//     '检核表分析': {
//         'name': '检核表分析',
//         'path': 'dama/examination/resultAnalysis/index',
//         'needReload': true
//     },
//     '检核结果报告': {
//         'name': '检核结果报告',
//         'path': 'dama/examination/resultReport/index',
//         'needReload': true
//     },
//     '出错规则': {
//         'name': '出错规则',
//         'path': 'dama/examination/resultAnalysis/errorRule',
//         'needReload': true
//     },
//     '出错字段': {
//         'name': '出错字段',
//         'path': 'dama/examination/resultAnalysis/errorField',
//         'needReload': true
//     },
//     '异常明细': {
//         'name': '异常明细',
//         'path': 'dama/examination/resultAnalysis/getAbnormalData',
//         'needReload': true
//     },
//     '问题清单': {
//         'name': '问题清单',
//         'path': 'dama/examination/resultReport/ruleReport/index',
//         'needReload': true
//     },
//     '质量报告': {
//         'name': '质量报告',
//         'path': 'dama/examination/resultReport/qualityReport/index',
//         'needReload': true
//     },
//     'EXAM:规则历史趋势': {
//         'name': '规则历史趋势',
//         'path': 'dama/examination/resultReport/ruleReport/ruleTrend',
//         'needReload': true
//     },
//     'EXAM:规则结果报告': {
//         'name': '规则结果报告',
//         'path': 'dama/examination/report/resultReport/rule',
//         'needReload': true
//     },
//     '数据源检核统计': {
//         'name': '数据源检核统计',
//         'path': 'dama/examination/report/resultReport/index',
//         'needReload': true
//     },
//     '质量报告（总体）': {
//         'name': '质量报告（总体）',
//         'path': 'dama/examination/report/qualityReport/index',
//         'needReload': true
//     },
//     '质量报告（系统）': {
//         'name': '质量报告（系统）',
//         'path': 'dama/examination/report/qualityReport/index',
//         'needReload': true,
//         params: {
//             type: 'system'
//         },
//     },
// }
//
// export default tabConfigs
