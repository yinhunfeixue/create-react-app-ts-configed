const tabConfigs = {
    标准列表: {
        name: '标准列表',
        path: 'dama/standard/standardMa/list',
        needReload: true,
    },
    // "新增标准":{
    //     'name':'新增标准',
    //     'path':'dama/standard/standardMa/add',
    // },
    '发布/废弃': {
        name: '发布/废弃',
        path: 'dama/standard/release/standard',
        params: {
            type: 'review',
        },
        needReload: true,
        refresh: true,
    },
    标准变更: {
        name: '标准变更',
        path: 'dama/standard/historyRecord/recordList',
        needReload: true,
        refresh: true,
    },
    标准审核: {
        name: '标准审核',
        path: 'dama/standard/historyRecord/auditingList',
        needReload: true,
        refresh: true,
    },
    标准变更申请: {
        name: '标准变更申请',
        path: 'dama/standard/historyRecord/changeRecordForm',
        needReload: true,
        refresh: true,
    },
    标准变更审批: {
        name: '标准变更审批',
        path: 'dama/standard/historyRecord/changeRecordForm',
        needReload: true,
        refresh: true,
    },
    我的申请: {
        name: '发布审核',
        path: 'dama/standard/release/standard',
        params: {
            type: 'application',
        },
    },
    公共代码发布: {
        name: '公共代码发布',
        path: 'dama/standard/release/code',
    },
    标准采集日志: {
        name: '标准采集日志',
        path: 'dama/metadata/collectionRecord/collectionRecord',
        needReload: true,
        params: {
            area: 'standard',
            from: 'handCollection',
            authIds: {
                handCollectionRecordDeleteId: 'standard:log:delete', // 手动删除
            },
        },
    },
    标准采集: {
        name: '标准采集',
        path: 'dama/standard/release/ManualRecord/index',
        needReload: true,
        refresh: true,
    },
    '标准-指标映射': {
        name: '标准-指标映射',
        path: 'dama/standard/release/standardMapTarget/index',
        treeData: true,
        needReload: true,
        refresh: true,
    },
    '标准-字段映射': {
        name: '标准-字段映射',
        path: 'dama/standard/release/standardMapField/index',
        treeData: true,
        needReload: true,
        refresh: true,
    },
    '标准-查看详情': {
        name: '标准-查看详情',
        path: 'dama/standard/standardMa/modal/index.jsx',
        needReload: true,
    },
    代码标准详情: {
        name: '代码标准详情',
        path: 'dama/standard/standardMa/modal/codeDetail.jsx',
        needReload: true,
    },
    '标准管理-修改': {
        name: '标准管理-修改',
        path: 'dama/standard/standardMa/modal/index.jsx',
    },
    维度项列表: {
        name: '维度项列表',
        path: 'dama/standard/dimension/index.jsx',
        needReload: true,
        refresh: true,
    },
    新增维度项: {
        name: '新增维度项',
        path: 'dama/standard/dimension/addFrom.jsx',
        needReload: true,
    },
    修改维度项: {
        name: '修改维度项',
        path: 'dama/standard/dimension/addFrom.jsx',
        needReload: true,
    },
    标准分类: {
        name: '标准分类',
        path: 'dama/standard/CategoryEdit/index.jsx',
        needReload: true,
        refresh: true,
    },
    // '全局搜索-搜索结果': {
    //     name: '全局搜索-搜索结果',
    //     path: 'dama/globalSearch/searchResult',
    //     needReload: true,
    // },
    // 数据源详情: {
    //     name: '数据源详情',
    //     path: 'dama/metadata/dataSourceDetail/dataSourceDetail',
    //     needReload: true
    // },
    // 库详情: {
    //     name: '库详情',
    //     path: 'dama/metadata/databaseDetail/databaseDetail',
    //     needReload: true
    // },
    // 表详情: {
    //     name: '表详情',
    //     path: 'dama/metadata/tableDetail/tableDetail',
    //     needReload: true
    // },
    // 字段详情: {
    //     name: '字段详情',
    //     path: 'dama/metadata/fieldDetail/fieldDetail',
    //     needReload: true
    // },
    // 代码项信息: {
    //     name: '代码项信息',
    //     path: 'dama/metadata/codeItemDetail/codeItemDetail',
    //     needReload: true,
    // },
    // '指标管理-详情': {
    //     'name': '指标管理-详情',
    //     'path': 'dama/indexma/BrowsePage/targetDetail/index',
    //     needReload: true,
    // },
    '标准-代码值映射': {
        name: '标准-代码值映射',
        path: 'dama/standard/standardMa/CodeValueMap/index',
        needReload: true,
    },
    '标准-字段映射管理': {
        name: '标准-字段映射管理',
        path: 'dama/standard/release/MapManage/index.jsx',
        needReload: true,
    },
    '标准-指标映射管理': {
        name: '标准-指标映射管理',
        path: 'dama/standard/release/MapManage/index.jsx',
        needReload: true,
    },
    // '指标管理-浏览': {
    //     'name': '指标管理-浏览',
    //     'path': 'dama/indexma/BrowsePage/index',
    //     'needReload': true,
    //     refresh: true
    // },
    // '规则管理': {
    //     'name': '规则管理',
    //     'path': 'dama/examination/ruleManage/index',
    //     'needReload': true,
    //     refresh: true
    // },
    // '血缘关系': {
    //     'name': '血缘关系',
    //     'path': 'dama/metadata/analysis/g6BloodAnalysis/index',
    //     'needReload': true,
    //     noCache: true
    // },
    // '影响关系': {
    //     'name': '影响关系',
    //     'path': 'dama/metadata/analysis/g6EffectAnalysis/index',
    //     'needReload': true,
    //     noCache: true
    // },
    智能映射: {
        name: '智能映射',
        path: 'dama/standard/intelligent/index',
        treeData: true,
        needReload: true,
        refresh: true,
    },
    同义簇管理: {
        name: '同义簇管理',
        path: 'dama/autoCompleteManage/clusterManage/index',
        treeData: true,
        needReload: true,
        refresh: true,
    },
    编辑簇: {
        name: '编辑簇',
        path: 'dama/autoCompleteManage/clusterManage/clusterEdit',
        treeData: true,
        needReload: true,
        refresh: true,
    },
    手动添加: {
        name: '手动添加',
        path: 'dama/autoCompleteManage/autoComplete/index',
        treeData: true,
        needReload: true,
        refresh: true,
    },
    编辑中文信息: {
        name: '字段信息',
        path: 'dama/autoCompleteManage/autoComplete/column',
        treeData: true,
        needReload: true,
        refresh: true,
    },
    智能抽取: {
        name: '智能抽取',
        path: 'dama/autoCompleteManage/autoComplete/exstract',
        treeData: true,
        needReload: true,
        refresh: true,
    },
    标准映射: {
        name: '标准映射',
        path: 'dama/standard/intelligent/standard',
        treeData: true,
        needReload: true,
        refresh: true,
    },
    映射管理: {
        name: '映射管理',
        path: 'dama/standard/intelligent/standardMap',
        treeData: true,
        needReload: true,
        refresh: true,
    },
    标准化改写: {
        name: '标准化改写',
        path: 'dama/standard/intelligent/standardChange',
        treeData: true,
        needReload: true,
        refresh: true,
    },
    落标检核: {
        name: '落标检核',
        path: 'dama/standard/dataStandard/index',
        treeData: true,
        needReload: true,
        refresh: true,
    },
}

export default tabConfigs
