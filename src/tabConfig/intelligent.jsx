const tabConfigs = [
    {
        name: 'dataSearchIndex',
        title: '数据搜索',
        path: 'dama/intelligent/index/index',
        route: '/dama/intelligent/index',
    },
    {
        name: 'kewordSearch',
        title: '数据搜索-结果',
        path: 'dama/intelligent/kwResult/index',
        route: '/dama/intelligent/kwResult',
    },
    {
        name: 'sentenceSearch',
        title: '智能取数-结果',
        path: 'dama/intelligent/sentenceResult/index',
        route: '/dama/intelligent/sentenceResult',
    },
    {
        name: '业务详情',
        path: 'dama/intelligent/newBusiness/index',
        route: '/dama/intelligent/newBusiness',
    },
    {
        name: '修改表属性',
        path: 'dama/intelligent/tableField/index',
        route: '/dama/intelligent/tableField',
    },
    {
        name: '修改关联关系',
        path: 'dama/intelligent/connectRelationEdit/index',
        route: '/dama/intelligent/connectRelationEdit',
    },
    {
        name: 'createTable',
        title: '报表创建',
        path: 'dama/intelligent/createTable/index',
        route: '/dama/intelligent/createTable',
    },
    // '首页': {
    //     'name': '首页',
    //     'path': 'dama/intelligent/home/home',
    //     'needReload': true,
    // },
    // '智能取数-搜索结果': {
    //     'name': '智能取数-搜索结果',
    //     'path': 'dama/intelligent/result/result',
    //     'needReload': true
    // },
    // '查看已支持指标': {
    //     'name': '查看已支持指标',
    //     'path': 'dama/indexma/BrowsePage/index',
    //     'needReload': true,
    // },
    // '指标管理-详情': {
    //     'name': '指标管理-详情',
    //     'path': 'dama/indexma/BrowsePage/targetDetail/index'
    // },
    // '设置': {
    //     'name': '设置',
    //     'path': 'dama/intelligent/settings/index',
    //     'needReload': true,
    //     noCache: true
    // },
    // '添加业务': {
    //     'name': '添加业务',
    //     'path': 'dama/intelligent/newBusiness/index',
    //     'needReload': true,
    //     noCache: true
    // },
    // '编辑业务': {
    //     'name': '编辑业务',
    //     'path': 'dama/intelligent/newBusiness/index',
    //     'needReload': true,
    //     noCache: true
    // },
    // 字段详情: {
    //     name: '字段详情',
    //     path: 'dama/metadata/fieldDetail/fieldDetail',
    //     needReload: true
    // },
    // 表详情: {
    //     name: '表详情',
    //     path: 'dama/metadata/tableDetail/tableDetail',
    //     needReload: true
    // },
    // '数据源': {
    //     'name': '数据源',
    //     'path': 'dama/metadata/sourceNew/dataSourceManage',
    // },
    // '添加数据源': {
    //     'name': '添加数据源',
    //     'path': 'dama/metadata/sourceNew/addSource',
    //     'needReload': true,
    // },
    // '修改数据源': {
    //     'name': '修改数据源',
    //     'path': 'dama/metadata/sourceNew/addSource',
    //     'needReload': true
    // },
    // '添加数据表': {
    //     'name': '添加数据表',
    //     'path': 'dama/metadata/tableModal/tableModal'
    // },
    // 自动采集: {
    //     name: '自动采集',
    //     path: 'dama/metadata/autoCollection/autoCollection',
    // },
    // 添加自动采集任务: {
    //     name: '添加自动采集任务',
    //     path: 'dama/metadata/autoCollection/editAutoCollection',
    // },
    // 修改自动采集任务: {
    //     name: '修改自动采集任务',
    //     path: 'dama/metadata/autoCollection/editAutoCollection'
    // },
    // 手动采集: {
    //     name: '手动采集',
    //     path: 'dama/metadata/handCollection/handCollection',
    // },
    // 添加手动采集任务: {
    //     name: '添加手动采集任务',
    //     path: 'dama/metadata/handCollection/editHandCollection',

    //     needReload: true
    // },
    // 采集日志: {
    //     name: '采集日志',
    //     path: 'dama/metadata/collectionRecord/collectionRecord',
    //     needReload: true,
    //     params: {
    //         area: 'metadata'
    //     }
    // },
    // 任务配置: {
    //     name: '任务配置',
    //     path: 'dama/metadata/taskConfiguration/taskConfiguration',
    // },
    // 添加对比任务: {
    //     name: '添加对比任务',
    //     path: 'dama/metadata/taskConfiguration/addTaskConfiguration',
    // },
    // 查看对比任务: {
    //     name: '查看对比任务',
    //     path: 'dama/metadata/taskConfiguration/lookTaskConfiguration'
    // },
    // 版本查看: {
    //     name: '版本查看',
    //     path: 'dama/metadata/version/versionQuery/versionQuery'
    // },
    // 版本对比: {
    //     name: '版本对比',
    //     path: 'dama/metadata/version/versionCompare/versionCompare'
    // },
    // '变更历史-查看详情': {
    //     name: '变更历史-查看详情',
    //     path: 'dama/metadata/version/versionCompare/versionCompare',
    //     needReload: true
    // },
    // 版本发布: {
    //     name: '版本发布',
    //     path: 'dama/metadata/version/versionPublish/versionPublish',
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
    // 血缘管理: {
    //     name: '血缘管理',
    //     path: 'dama/metadata/analysis/manage/index',
    //     needReload: true
    // },
    // 血缘更新: {
    //     name: '血缘更新',
    //     path: 'dama/metadata/analysis/bloodUpdate/index',
    //     needReload: true,
    // },
    // '血缘更新-上传': {
    //     name: '血缘更新-上传',
    //     path: 'dama/metadata/analysis/bloodUpdate/upLoad',
    //     needReload: true,
    // },
    // '血缘更新-查看详情': {
    //     name: '血缘更新-查看详情',
    //     path: 'dama/metadata/analysis/bloodUpdate/lookDetail',
    //     needReload: true
    // },
    // 字段join关系: {
    //     name: '字段join关系',
    //     path: 'dama/metadata/analysis/g6JoinAnalysis/index',
    //     needReload: true,
    //     // tabChangeReload:false
    // },
    // 影响管理: {
    //     name: '影响管理',
    //     path: 'dama/metadata/analysis/manage/index',
    //     needReload: true
    // },
    // 高频分析: {
    //     name: '高频分析',
    //     path: 'dama/metadata/analysis/frequencyAnalysis',
    //     params: {
    //         visibleSearch: true,
    //         columns: 'table',
    //         tableVisible: false // 表搜索开关
    //     },
    //     tabChangeReload: false,
    // },
    // '高频分析-表': {
    //     name: '高频分析-表',
    //     path: 'dama/metadata/analysis/frequencyAnalysis',
    //     params: {
    //         columns: 'table'
    //     },
    //     tabChangeReload: false
    // },
    // '高频分析-字段': {
    //     name: '高频分析-字段',
    //     path: 'dama/metadata/analysis/frequencyAnalysis',
    //     params: {
    //         columns: 'field'
    //     },
    //     needReload: true,
    //     tabChangeReload: false
    // },
    // 变更订阅: {
    //     name: '变更订阅',
    //     path: 'dama/metadata/changeMenage/changeSubscriptions',
    //     needReload: true,
    // },
    // 变更历史: {
    //     name: '变更历史',
    //     path: 'dama/metadata/changeMenage/historySubscription',
    // },
    // 添加订阅: {
    //     name: '添加订阅',
    //     path: 'dama/metadata/changeMenage/addSubscriptions',
    //     needReload: true,
    // },
    // 修改订阅: {
    //     name: '修改订阅',
    //     path: 'dama/metadata/changeMenage/addSubscriptions',
    //     needReload: true
    // },
    // 生成指标: {
    //     name: '生成指标',
    //     path: 'dama/indexma/BrowsePage/NewIndex/index'
    // },
    // 数据地图: {
    //     name: '数据地图',
    //     path: 'dama/metadata/relationViews/physical/dataMap/index',
    //     needReload: true,
    // },
    // 数据地图编辑: {
    //     name: '数据地图编辑',
    //     path: 'dama/metadata/relationViews/physical/dataMap/edit',
    //     needReload: true
    // },
    // 物理层血缘: {
    //     name: '物理层血缘',
    //     path: 'dama/metadata/relationViews/physical/systemView/index',
    //     needReload: true,
    // },
    // '物理模型-关系列表': {
    //     name: '物理模型-关系列表',
    //     path: 'dama/metadata/relationViews/physical/systemView/relationList',
    //     needReload: true
    // },
    // 物理模型: {
    //     name: '物理模型',
    //     path: 'dama/metadata/relationViews/physical/bloodRelation/index',
    //     needReload: true,
    // },
    // '字段升级-标准': {
    //     name: '字段升级-标准',
    //     path: 'dama/metadata/upToStandardBz/index',
    //     needReload: true
    // },
    // '我的申请-升级': {
    //     name: '我的申请-升级',
    //     path: 'dama/metadata/upToStandardBz/applyTable',
    //     needReload: true,
    // },
    // '新的申请-升级': {
    //     name: '新的申请-升级',
    //     path: 'dama/metadata/upToStandardIt/applyTable',
    //     needReload: true,
    // },
    // '字段升级-标准-IT': {
    //     name: '字段升级-标准-IT',
    //     path: 'dama/metadata/upToStandardIt/index',
    //     needReload: true
    // },
    // '字段升级-标准-业务': {
    //     name: '字段升级-标准-业务',
    //     path: 'dama/metadata/upToStandardBz/index',
    //     needReload: true,
    //     params: {
    //         isEdit: true
    //     }
    // },
    // '全局搜索-搜索结果': {
    //     name: '全局搜索-搜索结果',
    //     path: 'dama/globalSearch/searchResult',
    //     needReload: true
    // },
    // 代码项信息: {
    //     name: '代码项信息',
    //     path: 'dama/metadata/codeItemDetail/codeItemDetail',
    //     needReload: true
    // },
    // '标准-查看详情': {
    //     'name': '标准-查看详情',
    //     'path': 'dama/standard/standardMa/modal/index.jsx',
    //     needReload: true
    // },
    // '代码值映射': {
    //     'name': '代码值映射',
    //     'path': 'dama/metadata/codeValueMap/index',
    //     needReload: true
    // },
    // '数据源概况': {
    //     'name': '数据源概况',
    //     'path': 'dama/metadata/onlineGovernance/overview/index',
    //     needReload: true,
    // },
    // 'step1表标准化': {
    //     'name': 'step1表标准化',
    //     'path': 'dama/metadata/onlineGovernance/tableFilter/index',

    //     needReload: true
    // },
    // 'step2字段标准化': {
    //     'name': 'step2字段标准化',
    //     'path': 'dama/metadata/onlineGovernance/fieldFilter/index',
    //     needReload: true,
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
]

export default tabConfigs
