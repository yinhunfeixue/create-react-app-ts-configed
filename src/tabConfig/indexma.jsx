const tabConfigs = {
    '指标手动采集': {
        'name': '指标手动采集',
        'path': 'dama/indexma/ManualRecord/index',
        'needReload': true,
        refresh: true
    },
    '报表-指标绑定': {
        'name': '报表-指标绑定',
        'path': 'dama/indexma/mappingManagement/indexma',
        'needReload': true,
        refresh: true
    },
    '指标-字段映射': {
        'name': '指标-字段映射',
        'path': 'dama/indexma/mappingManagement/column',
        'needReload': true,
        refresh: true
    },
    '规则定义': {
        'name': '规则定义',
        'path': 'dama/indexma/monitor/ruleDefinition',
        'needReload': true,
        refresh: true
    },
    '规则执行': {
        'name': '规则执行',
        'path': 'dama/indexma/monitor/ruleExecute',
        'needReload': true,
        refresh: true
    },
    '质量监控': {
        'name': '质量监控',
        'path': 'dama/indexma/monitor/mass',
        'needReload': true,
        refresh: true
    },
    '字段-指标关联': {
        'name': '字段-指标关联',
        'path': 'dama/indexma/mappingManagement/columnIndexma',
        'needReload': true,
        refresh: true
    },
    '指标关联': {
        'name': '指标关联',
        'path': 'dama/indexma/mappingManagement/indexmaColumn',
        'needReload': true,
        refresh: true
    },
    '关联字段': {
        'name': '关联字段',
        'path': 'dama/indexma/mappingManagement/relateColumn',
        'needReload': true,
        refresh: true
    },
    '指标采集日志': {
        'name': '指标采集日志',
        'path': 'dama/metadata/collectionRecord/collectionRecord',
        'needReload': true,
        'params': {
            area: 'metric',
            // activeKey: '2',
            from: 'handCollection',
            authIds: {
                'handCollectionRecordDeleteId': "metrics:log:delete", // 手动删除
            }
        },
        refresh: true
    },
    '字段映射': {
        'name': '字段映射',
        'path': 'dama/indexma/FieldMap/index',
        'treeData': true,
        'needReload': true,
        refresh: true
    },
    '标准映射': {
        'name': '标准映射',
        'path': 'dama/indexma/targetMap/index',
        'treeData': true,
        'needReload': true,
        refresh: true
    },
    '指标管理-浏览': {
        'name': '指标管理-浏览',
        'path': 'dama/indexma/BrowsePage/index',
        'needReload': true
    },
    '指标管理-新增': {
        'name': '指标管理-新增',
        'path': 'dama/indexma/BrowsePage/NewIndex/index'
    },
    '新增基础指标-业务': {
        'name': '新增基础指标-业务',
        'path': 'dama/indexma/BrowsePage/NewIndexV2/firstStep',
        'needReload': true
    },
    '新增衍生指标-业务': {
        'name': '新增衍生指标-业务',
        'path': 'dama/indexma/BrowsePage/NewIndexV2/extraStep',
        'needReload': true
    },
    '编辑基础指标-业务': {
        'name': '编辑基础指标-业务',
        // 'path': 'dama/indexma/BrowsePage/NewIndexV2/firstStep',
        'path': 'dama/indexma/BrowsePage/NewIndexV2/extraStep',
        'needReload': true
    },
    '编辑衍生指标-业务': {
        'name': '编辑衍生指标-业务',
        'path': 'dama/indexma/BrowsePage/NewIndexV2/extraStep',
        'needReload': true
    },
    '新增基础指标-IT': {
        'name': '新增基础指标-IT',
        'path': 'dama/indexma/BrowsePage/NewIndexIT/firstStep',
        'needReload': true
    },
    '编辑基础指标-IT': {
        'name': '编辑基础指标-IT',
        'path': 'dama/indexma/BrowsePage/NewIndexIT/firstStep',
        'needReload': true
    },
    '新增衍生指标-IT': {
        'name': '新增衍生指标-IT',
        'path': 'dama/indexma/BrowsePage/NewIndexIT/extraStep',
        'needReload': true
    },
    '编辑衍生指标-IT': {
        'name': '编辑衍生指标-IT',
        'path': 'dama/indexma/BrowsePage/NewIndexIT/extraStep',
        'needReload': true
    },
    '我的申请-审核': {
        'name': '我的申请-审核',
        'path': 'dama/indexma/BrowsePage/NewIndexV2/index',
        needReload: true,
        refresh: true
    },
    '新的申请-审核': {
        'name': '新的申请-审核',
        'path': 'dama/indexma/BrowsePage/NewIndexIT/index',
        needReload: true,
        refresh: true
    },
    '指标管理-详情': {
        'name': '指标管理-详情',
        'path': 'dama/indexma/BrowsePage/targetDetail/index',
        needReload: true,
    },
    '指标管理-修改': {
        'name': '指标管理-修改',
        'path': 'dama/indexma/BrowsePage/NewIndex/index'
    },
    '指标管理-升级为标准': {
        'name': '指标管理-升级为标准',
        'path': 'dama/indexma/BrowsePage/upgradeIndex/upgradeIndex'
    },
    '': {
        'name': '指标管理-新增',
        'path': 'dama/indexma/BrowsePage/NewIndex/index'
    },
    '标准逻辑模型': {
        'name': '标准逻辑模型',
        'path': 'dama/indexma/LogicView/StandardLogic/standard/index',
        'needReload': true,
        refresh: true
    },
    '实用业务模型': {
        'name': '实用业务模型',
        'path': 'dama/indexma/LogicView/BusinessModel/business/index',
        'needReload': true,
        refresh: true
    },
    '逻辑表血缘': {
        'name': '逻辑表血缘',
        'path': 'dama/indexma/LogicView/LogicalBlood/logical/index',
        'needReload': true,
        refresh: true
    },
    '调整指标': {
        'name': '调整指标',
        'path': 'dama/indexma/LogicView/changeIndex/changeIndex',
        'needReload': true
    },
    '新的申请-升级': {
        'name': '新的申请-升级',
        'path': 'dama/indexma/newApply/index',
        'needReload': true,
        refresh: true
    },
    '新的申请-升级-修改': {
        'name': '新的申请-升级-修改',
        'path': 'dama/indexma/newApply/upgradeIndex',
        'needReload': true
    },
    '新的申请-升级-查看详情': {
        'name': '新的申请-升级-查看详情',
        'path': 'dama/indexma/newApply/upgradeIndex',
        'needReload': true
    },
    '我的申请-升级': {
        'name': '我的申请-升级',
        'path': 'dama/indexma/myApply/index',
        'needReload': true,
        refresh: true
    },
    '指标分类设置': {
        'name': '指标分类设置',
        'path': 'dama/indexma/CategoryEdit/index',
        'needReload': true,
        refresh: true
    },
    // '全局搜索-搜索结果': {
    //     name: '全局搜索-搜索结果',
    //     path: 'globalSearch/result',
    //     needReload: true,
    // // },
    // 数据源详情: {
    //     name: '数据源详情',
    //     path: 'metadata/dataSourceDetail/dataSourceDetail',
    //     needReload: true
    // },
    // 库详情: {
    //     name: '库详情',
    //     path: 'metadata/databaseDetail/databaseDetail',
    //     needReload: true
    // },
    // 表详情: {
    //     name: '表详情',
    //     path: 'metadata/tableDetail/tableDetail',
    //     needReload: true
    // },
    // 字段详情: {
    //     name: '字段详情',
    //     path: 'metadata/fieldDetail/fieldDetail',
    //     needReload: true
    // },
    // 代码项信息: {
    //     name: '代码项信息',
    //     path: 'metadata/codeItemDetail/codeItemDetail',
    //     needReload: true,
    // },
    // '标准-查看详情': {
    //     'name': '标准-查看详情',
    //     'path': 'standard/standardMa/modal/index.jsx',
    //     needReload: true
    // },
    '指标-血缘分析': {
        'name': '指标-血缘分析',
        'path': 'dama/indexma/BrowsePage/targetDetail/targetBlood/index.jsx'
    },
    // '标准列表': {
    //     'name': '标准列表',
    //     'path': 'standard/standardMa/list',
    //     needReload: true,
    //     refresh: true
    // },
    // '规则管理': {
    //     'name': '规则管理',
    //     'path': 'examination/ruleManage/index',
    //     'needReload': true,
    //     refresh: true
    // },
    // '查看规则': {
    //     'name': '查看规则',
    //     'path': 'examination/ruleManage/lookRule',
    //     'needReload': true
    // },
    '指标-标准映射管理': {
        'name': '指标-标准映射管理',
        'path': 'dama/indexma/targetMap/MapManage/mapManage.jsx',
        'needReload': true
    },
    '指标-字段映射管理': {
        'name': '指标-字段映射管理',
        'path': 'dama/indexma/MapManage/index.jsx',
        'needReload': true
    },
    '全局搜索-搜索结果': {
        name: '全局搜索-搜索结果',
        path: 'dama/globalSearch/result',
        needReload: true
    },
    // '血缘关系': {
    //     'name': '血缘关系',
    //     'path': 'metadata/analysis/g6BloodAnalysis/index',
    //     'needReload': true,
    //     noCache: true
    // },
    // '影响关系': {
    //     'name': '影响关系',
    //     'path': 'metadata/analysis/g6EffectAnalysis/index',
    //     'needReload': true,
    //     noCache: true
    // },
    '维度管理': {
        'name': '维度管理',
        'path': 'dama/dimension/index',
        'needReload': true,
        refresh: true
    },
    '定义维度': {
        'name': '定义维度',
        'path': 'dama/dimension/addDimension',
        'needReload': true,
        refresh: true
    },
}

export default tabConfigs
