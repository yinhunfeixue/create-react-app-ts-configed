// 在webpack.config.js里定义的的环境变量 区分开发、生产环境
// __DEV__ 为 true 代表是开发环境
let HTTP_BASE_URL = ''
// if (__DEV__) {
//     HTTP_BASE_URL = ""
// }

const CONSTANTS = {
    // 静态资源存放目录
    // APP_BASE_URL: '',
    APP_BASE_URL: '/',

    LAST_UPDATE_LIST: {},

    // 请求接口地址前面的域名
    SERVER_LIST: {
        dmpTestServer: HTTP_BASE_URL,
    },

    // 请求数据接口
    API_LIST: {
        metadata: {
            // 元数据管理相关接口
            datasourceListForQuery: HTTP_BASE_URL + '/quantchiAPI/api/metadata/datasource/listForQuery', // 源库级联接口
            extractjobLineageInfo: HTTP_BASE_URL + '/quantchiAPI/api/lineage/extractjob/file/lineage', //
            reanalysis: HTTP_BASE_URL + '/quantchiAPI/api/reports/task/reanalysis', // 重新解析血缘
            viewList: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/view/list', // 获取报表视图列表
            analysisLog: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/analysisLog', // 查看文件分析日志
            columnList: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/columnList', // 获取报表指标信息
            reportDetail: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/detail', // 获取报表基本信息
            headInfo: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/headInfo', // 获取报表表头预览信息

            searchLineageFile: HTTP_BASE_URL + '/quantchiAPI/api/lineage/extractjob/searchLineageFile', // 血缘更新页面：查询文件列表
            deleteFile: HTTP_BASE_URL + '/quantchiAPI/api/lineage/extractjob/deleteFile', // 血缘更新页面：删除文件
            getLineageFileById: HTTP_BASE_URL + '/quantchiAPI/api/lineage/extractjob/getLineageFileById', // 血缘更新页面：获取血缘文件信息
            searchLineageJobLog: HTTP_BASE_URL + '/quantchiAPI/api/lineage/extractjob/searchLineageJobLog', // 血缘更新页面：获取血缘任务日志信息
            deleteLineageByTableId: HTTP_BASE_URL + '/quantchiAPI/api/lineage/deleteLineageByTableId', // 血缘分析页面-数据表-删除：根据表ID删除血缘关系
            searchLineageJob: HTTP_BASE_URL + '/quantchiAPI/api/lineage/extractjob/searchLineageJob', // 查询血缘任务信息
            deleteTask: HTTP_BASE_URL + '/quantchiAPI/api/lineage/extractjob/delete', // 删除血缘任务
            getJobById: HTTP_BASE_URL + '/quantchiAPI/api/lineage/extractjob/getJobById', // 根据id取得job数据
            downloadBatch: HTTP_BASE_URL + '/quantchiAPI/api/lineage/extractjob/file/downloadBatch', // 查询血缘任务日志信息

            reportUpload: HTTP_BASE_URL + '/quantchiAPI/api/reports/task/upload', // 上传报表文件
            getExternalList: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/list', // 获取报表文件列表
            getExternalCount: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/count', // 获取报表文件数量
            categoryTree: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/filter/categoryTree', // 查询 - 报表分类过滤器
            externalTypes: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/columnList/types', // 获取报表指标类型
            reportsLevel: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/reportsLevel', // 获取报表等级信息
            externalEdit: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/', // 修改报表信息(包括字段信息)
            getReportList: HTTP_BASE_URL + '/quantchiAPI/api/reports/task/list', // 获取报表任务列表
            getTaskDetail: HTTP_BASE_URL + '/quantchiAPI/api/reports/task/detail', // 获取单个报表任务信息
            getAssetsTree: HTTP_BASE_URL + '/quantchiAPI/api/tree/getAssetsTree', // 获取数据资产目录
            getMetadataTree: HTTP_BASE_URL + '/quantchiAPI/api/tree/getMetadataTree', // 获取浏览左侧树
            sourceTaskList: HTTP_BASE_URL + '/service-task/taskJob/getDataSourceTaskList', // 获取数据源任务列表
            sourceTaskCountList: HTTP_BASE_URL + '/service-task/taskJob/getDataSourceTaskCountList', // 获取数据源任务数量列表
            saveDataCollectionJob: HTTP_BASE_URL + '/service-task/taskJob/saveDataCollectionJob', // 保存采集任务
            taskJobList: HTTP_BASE_URL + '/service-task/taskJob/getTaskJobList', // 获取调度任务列表
            updateTaskJob: HTTP_BASE_URL + '/service-task/taskJob/updateTaskJob', // 更新调度任务
            runTaskJob: HTTP_BASE_URL + '/service-task/taskJob/runTaskJob', // 立即执行调度任务
            deleteTaskJob: HTTP_BASE_URL + '/service-task/taskJob/deleteTaskJob', // 删除调度任务
            changeTaskJobStatus: HTTP_BASE_URL + '/service-task/taskJob/changeTaskJobStatus', // 改变调度状态
            changeBatchTaskJobStatus: HTTP_BASE_URL + '/service-task/taskJob/changeBatchTaskJobStatus', // 批量改变调度状态
            deleteBatchTaskJob: HTTP_BASE_URL + '/service-task/taskJob/deleteBatchTaskJob', // 批量删除调度状态
            runBatchTaskJob: HTTP_BASE_URL + '/service-task/taskJob/runBatchTaskJob', // 批量执行调度状态
            taskList: HTTP_BASE_URL + '/service-task/task/getTaskList', // 获取采集日志
            taskLogList: HTTP_BASE_URL + '/service-task/task/getTaskLogList', // 获取采集日志详情
            deleteTaskList: HTTP_BASE_URL + '/service-task/task/deleteTaskList', // 删除采集日志
            deleteJobByBusiness: HTTP_BASE_URL + '/service-task/taskJob/deleteJobByBusiness', // 删除数据源相关任务
            datasourceSupport: HTTP_BASE_URL + '/quantchiAPI/api/metadata/datasource/support', // 获取采集任务禁用类型
            sourceList: HTTP_BASE_URL + '/quantchiAPI/api/metadata/datasource',
            sourceConnect: HTTP_BASE_URL + '/quantchiAPI/api/metadata/datasource/connect',
            sourceConnectSim: HTTP_BASE_URL + '/quantchiAPI/api/metadata/datasource/simConnect',
            datasourceSqltest: HTTP_BASE_URL + '/quantchiAPI/api/metadata/datasource/sqltest',
            sourceSave: HTTP_BASE_URL + '/quantchiAPI/api/metadata/datasource/save',
            getDataSourcedDatabase: HTTP_BASE_URL + '/quantchiAPI/api/metadata/datasource/database',
            getsourcedata: HTTP_BASE_URL + '/quantchiAPI/api/metadata/datasource/getsourcedata',
            datasourcecheck: HTTP_BASE_URL + '/quantchiAPI/api/metadata/datasource/check',
            sourceDel: HTTP_BASE_URL + '/quantchiAPI/api/metadata/datasource/delete',
            localSave: HTTP_BASE_URL + '/quantchiAPI/api/metadata/datasource/localsave',
            relationList: HTTP_BASE_URL + '/quantchiAPI/api/metadata/relation/list',
            relationSave: HTTP_BASE_URL + '/quantchiAPI/api/metadata/relation/save',
            relationDel: HTTP_BASE_URL + '/quantchiAPI/api/metadata/relation/del',
            createTerm: HTTP_BASE_URL + '/quantchiAPI/api/metadata/source/createterm',
            loadSheet: HTTP_BASE_URL + '/quantchiAPI/api/metadata/loadSheet',
            getSysDatabase: HTTP_BASE_URL + '/quantchiAPI/api/metadata/datasource/database/dictSys',

            updateTaskJobByBusiness: HTTP_BASE_URL + '/service-task/taskJob/updateTaskJobByBusiness', // 通过业务ID更新任务调度信息
            getCollectNetwork: HTTP_BASE_URL + '/quantchiAPI/api/metadata/datasource/getCollectNetwork', // 获取网关信息

            // 数据表管理相关接口
            tableSearch: HTTP_BASE_URL + '/quantchiAPI/api/metadata/table/search', // 数据表搜索接口
            tableDetail: HTTP_BASE_URL + '/quantchiAPI/api/metadata/table/searchTable', // 数据表详情接口
            tableDel: HTTP_BASE_URL + '/quantchiAPI/api/metadata/table/del', // 数据表删除接口
            tableEdit: HTTP_BASE_URL + '/quantchiAPI/api/metadata/table/edit', // 数据表修改接口
            tableCheck: HTTP_BASE_URL + '/quantchiAPI/api/metadata/table/check', // 审核接口
            foreignkeys: HTTP_BASE_URL + '/quantchiAPI/api/metadata/table/foreignkeys', // 外键接口
            updateField: HTTP_BASE_URL + '/quantchiAPI/api/metadata/updateField', // 更新字段接口
            insertField: HTTP_BASE_URL + '/quantchiAPI/api/metadata/insertField', // 操作字段接口

            // 字段管理相关接口
            fieldSearch: HTTP_BASE_URL + '/quantchiAPI/api/metadata/field/search', // 字段搜索接口
            fieldEdit: HTTP_BASE_URL + '/quantchiAPI/api/metadata/field/edit', // 字段修改接口

            // 获取存储过程列表
            getAllRemoteFuncWithParams: HTTP_BASE_URL + '/service-qa/rule/getAllRemoteFuncWithParams', // 字段搜索接口

            // 逻辑主体管理接口
            entityCreate: HTTP_BASE_URL + '/quantchiAPI/api/metadata/entity/create', // 新增主体接口
            entityModify: HTTP_BASE_URL + '/quantchiAPI/api/metadata/entity/modify', // 修改主体接口
            entitySearch: HTTP_BASE_URL + '/quantchiAPI/api/metadata/entity/search', // 搜索主体接口
            entityDel: HTTP_BASE_URL + '/quantchiAPI/api/metadata/entity/del', // 删除主体接口
            model: HTTP_BASE_URL + '/quantchiAPI/api/model', // 多模型视图血缘图接口
            field: HTTP_BASE_URL + '/quantchiAPI/api/model/field', // 多模型视图血缘图展开接口
            fieldLineageField: HTTP_BASE_URL + '/quantchiAPI/api/fieldLineage/field', // 多模型视图血缘图展开接口
            dataMap: HTTP_BASE_URL + '/quantchiAPI/api/dataMap', // 多模型视图数据地图接口
            expandDataMapField: HTTP_BASE_URL + '/quantchiAPI/api/dataMap/node', // 多模型视图数据地图接口
            fieldLineage: HTTP_BASE_URL + '/quantchiAPI/api/fieldLineage', // 多模型视图数据地图接口
            jobResult: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/result/', // 获取核检任务结果
            jobHistory: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/history', // 获取核检任务结果
            getLineageExtractjob: HTTP_BASE_URL + '/quantchiAPI/api/lineage/extractjob', // 获取血缘抽取任务列表或者按条件检索列表
            getSingleExtractjob: HTTP_BASE_URL + '/quantchiAPI/api/lineage/extractjob/', // 获取血缘抽取任务列表或者按条件检索列表
            postLineageExtractjob: HTTP_BASE_URL + '/quantchiAPI/api/lineage/extractjob', // 新增或者修改血缘抽取任务信息
            fileDownload: HTTP_BASE_URL + '/quantchiAPI/api/lineage/extractjob/file/', // 新增或者修改血缘抽取任务信息
            tableFrequency: HTTP_BASE_URL + '/quantchiAPI/api/metadata/table/frequency', // 表级高频分析
            fieldFrequency: HTTP_BASE_URL + '/quantchiAPI/api/metadata/field/frequency', // 字段级高频分析
            lineageList: HTTP_BASE_URL + '/quantchiAPI/api/lineage/',
            lineageUpStream: HTTP_BASE_URL + '/quantchiAPI/api/lineage/upstream/field',
            lineageDatasource: HTTP_BASE_URL + '/quantchiAPI/api/lineage/datasource/',
            lineageDatabase: HTTP_BASE_URL + '/quantchiAPI/api/lineage/database/',
            lineageTable: HTTP_BASE_URL + '/quantchiAPI/api/lineage/table/',
            lineageColumn: HTTP_BASE_URL + '/quantchiAPI/api/lineage/column/',
            lineageDownStream: HTTP_BASE_URL + '/quantchiAPI/api/lineage/downstream/field', // G6影响分析
            joinRelation: HTTP_BASE_URL + '/quantchiAPI/api/metadata/field/relation', // G6join分析
            getLatestDiff: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiff/getLatestDiff', // 最近变更
            addSubscription: HTTP_BASE_URL + '/quantchiAPI/api/subscribe/newSubscription', // 添加订阅
            updateSubscription: HTTP_BASE_URL + '/quantchiAPI/api/subscribe/updateSubscription', // 更新订阅
            getAllSubscription: HTTP_BASE_URL + '/quantchiAPI/api/subscribe/getAllSubscription', // 订阅列表获取
            getSubscriptionDetail: HTTP_BASE_URL + '/quantchiAPI/api/subscribe/getSubscriptionDetail', // 订阅列表详情接口
            deleteSubscription: HTTP_BASE_URL + '/quantchiAPI/api/subscribe/deleteSubscription', // 订阅删除接口
            getDatabaseInfo: HTTP_BASE_URL + '/quantchiAPI/api/metadata/database', // 获取数据库信息
            upgradeField: HTTP_BASE_URL + '/quantchiAPI/api/upgradeField', // 字段升级标准
            standardApplying: HTTP_BASE_URL + '/quantchiAPI/api/standard/applying', // 字段升级标准
            metadataDBTree: HTTP_BASE_URL + '/quantchiAPI/api/metadataDBTree', // 获取数据库树形列表
            metadataTreeWithPaging: HTTP_BASE_URL + '/quantchiAPI/api/metadataTreeWithPaging', // 获取元数据树形列表(带分页)
            deleteMetadataTree: HTTP_BASE_URL + '/quantchiAPI/api/metadataTree/delete', // 删除元数据分类树节点
            editMetadataTree: HTTP_BASE_URL + '/quantchiAPI/api/metadataTree', // 编辑元数据分类树
            getCodeSystemConf: HTTP_BASE_URL + '/quantchiAPI/api/metadata/getCodeSystemConf', // 获取码表系统列表
            metadataCodeValue: HTTP_BASE_URL + '/quantchiAPI/api/metadata/codeValue', // 获取代码值
            deleteMetadataCodeValue: HTTP_BASE_URL + '/quantchiAPI/api/metadata/codeValue/delete', // 删除代码值
            getMetadataCodeItem: HTTP_BASE_URL + '/quantchiAPI/api/metadata/codeItem/', // 获取单条元数据代码项
            metadataCodeValueMap: HTTP_BASE_URL + '/quantchiAPI/api/metadata/codeValue/mapping', // 获取元数据代码值到标准代码值映射
            metadataCodeValueTree: HTTP_BASE_URL + '/quantchiAPI/api/metadata/codeValue/tree', // 获取元数据代码项树
            standardCodeValueMapBatch: HTTP_BASE_URL + '/quantchiAPI/api/standard/codeValue/mapping/batch', // 批量添加代码项映射
            standardCodeValueMapDelete: HTTP_BASE_URL + '/quantchiAPI/api/standard/codeValue/mapping/delete/batch', // 批量删除代码项映射
            codeValueMapList: HTTP_BASE_URL + '/quantchiAPI/api/standard/codeValue/mappingList', // 获取代码项映射列表
            tableFilterRule: HTTP_BASE_URL + '/quantchiAPI/api/governance/table/filterRule', // 新增表筛选规则
            tableFilterRuleDelete: HTTP_BASE_URL + '/quantchiAPI/api/governance/table/filterRule/delete', // 删除表筛选规则
            columnFilterRule: HTTP_BASE_URL + '/quantchiAPI/api/governance/column/filterRule', // 新增字段筛选规则
            columnFilterRuleDelete: HTTP_BASE_URL + '/quantchiAPI/api/governance/column/filterRule/delete', // 删除字段筛选规则
            dsGovernanceSummary: HTTP_BASE_URL + '/quantchiAPI/api/governance/datasource/summary', // 在线数据治理概况
            fdGovernanceSummary: HTTP_BASE_URL + '/quantchiAPI/api/governance/column/summary', // 字段治理概况
            tbGovernanceSummary: HTTP_BASE_URL + '/quantchiAPI/api/governance/table/summary', // 表治理概况
            cdGovernanceSummary: HTTP_BASE_URL + '/quantchiAPI/api/governance/code/summary', // 代码映射治理概况
            governanceDsUndo: HTTP_BASE_URL + '/quantchiAPI/api/governance/datasource/undo', // 在线数据治理概况 - 未治理
            governanceDsDoing: HTTP_BASE_URL + '/quantchiAPI/api/governance/datasource/doing', // 在线数据治理概况 - 治理中
            governanceDsDone: HTTP_BASE_URL + '/quantchiAPI/api/governance/datasource/done', // 在线数据治理概况 - 治理完成
            fdGovernanceList: HTTP_BASE_URL + '/quantchiAPI/api/governance/column/', // 在线数据治理概况 -overview 字段
            tbGovernanceList: HTTP_BASE_URL + '/quantchiAPI/api/governance/table/', // 在线数据治理概况 -overview  table
            cdGovernanceList: HTTP_BASE_URL + '/quantchiAPI/api/governance/code/', // 在线数据治理概况 -overview  代码映射
            governanceCodeRecommend: HTTP_BASE_URL + '/quantchiAPI/api/governance/code/recommend', // 在线数据治理概况 -overview  代码映射
            standardDomain: HTTP_BASE_URL + '/quantchiAPI/api/standard/domain', // 主题列表
            governance: HTTP_BASE_URL + '/quantchiAPI/api/governance/', // 修改状态和过滤原因
            governanceColumnRecommend: HTTP_BASE_URL + '/quantchiAPI/api/governance/column/recommend', // 修改表和字段的推荐信息
            recommendBatch: HTTP_BASE_URL + '/quantchiAPI/api/governance/table/recommend/batch', // 批量修改主题
            codeItemRef: HTTP_BASE_URL + '/quantchiAPI/api/metadata/codeItemRef', // 代码项引用字段
            codeItemDelete: HTTP_BASE_URL + '/quantchiAPI/api/metadata/codeItem/delete', // 删除代码项
            // "codeValueDiff": HTTP_BASE_URL + "/quantchiAPI/api/metadata/codeValue/diff", // 根据代码项id获取代码值diff
            innerRuleExec: HTTP_BASE_URL + '/quantchiAPI/api/governance/innerRule/exec', // 内置规则执行(针对重复表)
            innerRuleFileUpload: HTTP_BASE_URL + '/quantchiAPI/api/governance/innerRule/fileUpload', // 内置规则文件上传
            getInnerRule: HTTP_BASE_URL + '/quantchiAPI/api/governance/innerRule', // 获取内置规则
            codeItemStatistics: HTTP_BASE_URL + '/quantchiAPI/api/metadata/codeItem/statistics', // 码值管理-码值列表接口
            codeItemExport: HTTP_BASE_URL + '/quantchiAPI/api/metadata/codeItem/statistics/download', // 码值管理-码值列表导出接口
            codeValueExport: HTTP_BASE_URL + '/quantchiAPI/api/metadata/codeItem/download', // 代码项获取元数据代码项导出
            codeItemDatasource: HTTP_BASE_URL + '/quantchiAPI/api/metadata/codeItem/datasource', // 代码项列表数据源、数据库接口
            listTableByDatabaseId: HTTP_BASE_URL + '/quantchiAPI/api/metadata/table/listTableByDatabaseId', // 规则管理 新增规则 技术信息 中 根据数据库搜数据表（不用原来的搜表接口）
            systemHomePage: HTTP_BASE_URL + '/quantchiAPI/api/metadata/statistics/total', // 首页上部分
            statisticsChinesize: HTTP_BASE_URL + '/quantchiAPI/api/metadata/statistics/chinesize', // 首页右下部分
            systemStatistics: HTTP_BASE_URL + '/quantchiAPI/api/metadata/system/statistics', // 中文含义统计
            dataSourceDownload: HTTP_BASE_URL + '/quantchiAPI/api/metadata/datasource/download', // 数据源导出
            getDictSys: HTTP_BASE_URL + '/quantchiAPI/api/metadata/datasource/dictSys', // 获取字典据源系统下的系统
            fieldDiffDownload: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiffByJob/download', // 字段变更信息导出
            fieldDiffDownloadAll: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiffByJob/downloadAll', // 字段变更信息导出
            upstreamDownload: HTTP_BASE_URL + '/quantchiAPI/api/lineage/upstream/download', // 血缘分析导出
            downstreamDownload: HTTP_BASE_URL + '/quantchiAPI/api/lineage/downstream/download', // 影响分析导出
            dependencyList: HTTP_BASE_URL + '/quantchiAPI/api/lineage/table/dependency', // 血缘关系，表依赖关系
            dependSuggestList: HTTP_BASE_URL + '/quantchiAPI/api/lineage/table/search',
            downloadCurrent: HTTP_BASE_URL + '/quantchiAPI/api/lineage/table/download',
            systemView: HTTP_BASE_URL + '/quantchiAPI/api/operationReport/systemView', // 应用系统空间存储数据
            datasourceView: HTTP_BASE_URL + '/quantchiAPI/api/operationReport/datasourceView', // 数据源空间存储数据
            databaseView: HTTP_BASE_URL + '/quantchiAPI/api/operationReport/databaseView', // 数据库空间存储数据
            tableView: HTTP_BASE_URL + '/quantchiAPI/api/operationReport/tableView', // 数据库空间存储数据
            systemEnum: HTTP_BASE_URL + '/quantchiAPI/api/operationReport/systemEnum', //
            datasourceEnum: HTTP_BASE_URL + '/quantchiAPI/api/operationReport/datasourceEnum', //
            databaseEnum: HTTP_BASE_URL + '/quantchiAPI/api/operationReport/databaseEnum', //
            tableEnum: HTTP_BASE_URL + '/quantchiAPI/api/operationReport/tableEnum', //
            standardSummary: HTTP_BASE_URL + '/quantchiAPI/api/metadata/statistics/standard', // 标准数据概况
            totalByTagsSummary: HTTP_BASE_URL + '/quantchiAPI/api/metadata/statistics/totalByTags',
            taskSummary: HTTP_BASE_URL + '/service-task/task/taskStat', // 任务统计
            getRedundancyView: HTTP_BASE_URL + '/quantchiAPI/api/operationReport/redundancyView', // 重复资源
            getRedundancyViewDetail: HTTP_BASE_URL + '/quantchiAPI/api/operationReport/redundancyViewDetail', // 重复资源详情
            extractSchemaDiff: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiff/',
            schemaDiffLineages: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiff/lineages', // 对比血缘分析
            schemaDiffLineagesSelects: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiff/lineages/', // 对比血缘下拉列表
            schemaDiffLineagesDownload: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiff/lineages/download', // 血缘变更数据下载
            getSubscribiePushList: HTTP_BASE_URL + '/quantchiAPI/api/subscribe/push/list', //变更推送记录
            subscribiePushOptRecord: HTTP_BASE_URL + '/quantchiAPI/api/subscribe/push/optRecord', // 变更推送确认
            subscribiePushRepush: HTTP_BASE_URL + '/quantchiAPI/api/subscribe/push/repush', // 重新推送
            getLineageBidirection: HTTP_BASE_URL + '/quantchiAPI/api/lineage/bidirection', // 全链路分析下钻 LIST 接口
            getTableBidirection: HTTP_BASE_URL + '/quantchiAPI/api/lineage/table/bidirection', // 表的全链路分析
            getColumnBidirection: HTTP_BASE_URL + '/quantchiAPI/api/lineage/column/bidirection', // 表的全链路分析
            getTableRelationService: HTTP_BASE_URL + '/quantchiAPI/api/metadata/database/tableRelation', // 模型关系数据接口
            getRedundancyCheckTaskJob: HTTP_BASE_URL + '/service-task/taskJob/getRedundancyCheckTaskJob', // 重复资源任务获取
            saveRedundancyCheckJob: HTTP_BASE_URL + '/service-task/taskJob/saveRedundancyCheckJob', // 重复资源任务触发

            searchDmTask: HTTP_BASE_URL + '/quantchiAPI/datamodeling/task/searchDmTask', // 规范性检查
            toggleDmTaskStatus: HTTP_BASE_URL + '/quantchiAPI/datamodeling/task/toggleDmTaskStatus', // 规范性检查
            getRegExFilterConfig: HTTP_BASE_URL + '/quantchiAPI/datamodeling/task/getRegExFilterConfig', // 规范性检查
            saveFilterConfig: HTTP_BASE_URL + '/quantchiAPI/datamodeling/task/saveFilterConfig', // 规范性检查
            deleteRegExFilterConfig: HTTP_BASE_URL + '/quantchiAPI/datamodeling/task/deleteRegExFilterConfig', // 规范性检查
            deleteDmTask: HTTP_BASE_URL + '/quantchiAPI/datamodeling/task/deleteDmTask', // 规范性检查
            listHistoryTaskResult: HTTP_BASE_URL + '/quantchiAPI/datamodeling/task/listHistoryTaskResult', // 规范性检查
            getChartData: HTTP_BASE_URL + '/quantchiAPI/datamodeling/task/getChartData', // 图表接口
            addOrUpdateDmTask: HTTP_BASE_URL + '/quantchiAPI/datamodeling/task/addOrUpdateDmTask', // 规范性检查
            getDmTaskById: HTTP_BASE_URL + '/quantchiAPI/datamodeling/task/getDmTaskById', // 规范性检查
            getResultDetailByTaskResultId: HTTP_BASE_URL + '/quantchiAPI/datamodeling/task/getResultDetailByTaskResultId', // 规范性检查
            downloadTaskResultItem: HTTP_BASE_URL + '/quantchiAPI/datamodeling/task/downloadTaskResultItem', // 规范性检查
            listTaskResultItem: HTTP_BASE_URL + '/quantchiAPI/datamodeling/task/listTaskResultItem', // 规范性检查
            filterTable: HTTP_BASE_URL + '/quantchiAPI/datamodeling/task/filterTable', // 规范性检查
            dsspecification: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/dsspecification', // 规范性检查

            dsspecificationDatasource: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/dsspecification/datasource', // 规范性检查
            saveDsspecification: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/dsspecification/save', // 规范性检查

            rootList: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/root', // 获取词根列表
            saveRoot: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/root/save', // 保存词根列表
            batchSaveRoot: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/root/batchSave', // 保存词根列表
            nameExist: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/root/nameExist', // 判断name是否存在
            descExist: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/root/descExist', // 判断描述词是否存在
            template: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/root/template', // 下载词根模板
            rootUpload: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/root/upload', // 上传词根

            tableDdl: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/ddl', // ddl
            tableDgdl: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/dgdl', // dgdl
            saveTable: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/save', // 保存数据表信息
            datamodelingTable: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table', // 获取数据表列表
            parseCname: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/root/parseCname', // 解析中文名
            suggestion: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/root/suggestion', // suggestionInputRoot
            tableDataTypes: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/dataTypes', // 获取数据源下的数据类型
            configLimit: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/configLimit', // 获取数据源配置限制

            configCategory: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/config/category', // 获取词根类别
            configJoinType: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/config/joinType', // 获取词根连接方式
            configOrderType: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/config/orderType', // 获取词根排序方式
            configSpellType: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/config/spellType', // 获取词根连接方式
            configType: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/config/type', // 获取词根类型

            facttableDatabase: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/facttable/database', // 事实资产-库列表
            facttableTable: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/facttable/table', // 事实资产-表列表
            timeFormat: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/facttable/timeFormat', // 事实资产-获取时间格式
            facttableDataTypes: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/facttable/dataTypes', // 事实资产-字段类型
            columnForAdd: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/facttable/columnForAdd', // 事实资产-字段
            bizModuleAndTheme: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/factassets/filter/bizModuleAndTheme', // 获取业务版块及主题过滤器
            classifyFilters: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/factassets/filter/classifyFilters', // 获取业务版块及主题过滤器
            bizProcess: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/factassets/filter/bizProcess', // 获取业务过程过滤器
            bizDatabase: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/factassets/filter/database', // 获取业务过程过滤器
            factassetsSearch: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/factassets', // 查询事实资产列表
            factassetsDelete: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/factassets/', // 删除事实资产
            factassetsSave: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/factassets/save', // 保存事实资产信息
            factassetsDetail: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/factassets/', // 查询事实资产详情
            facttableDetail: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/facttable/detail/', // 获取事实表详情
            suggestBizClass: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/facttable/suggestBizClass', // 推荐业务分类信息
            suggestClassify: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/facttable/suggestClassify', // 推荐业务分类信息
            facttableTempSave: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/facttable/tempSave', // 临时保存事实表信息
            saveAndGenerateAssets: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/facttable/saveAndGenerateAssets', // 保存并生成事实资产
            normalColumns: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/factassets/normalColumns', // 事实资产详情 - 普通字段
            partitionColumns: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/factassets/partitionColumns', // 事实资产详情 - 分区字段
            detailForEdit: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/factassets/detailForEdit/', // 事实资产详情

            statisticalperiod: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/metrics/statisticalperiod', // 查询统计周期列表
            saveStatisticalperiod: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/metrics/statisticalperiod/save', // 保存统计周期
            periodExample: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/metrics/statisticalperiod/periodExample', // 周期示例

            bizLimit: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/metrics/bizLimit', // 查询业务限定列表
            bizLimitBizModuleAndTheme: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/metrics/bizLimit/filter/bizModuleAndTheme', // 查询业务限定列表
            bizLimitClassifyFilters: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/metrics/bizLimit/filter/classifyFilters', // 查询业务限定列表
            bizLimitEditDetail: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/metrics/bizLimit/forEdit/', // 查询业务限定列表
            saveBizLimit: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/metrics/bizLimit/save', // 保存业务限定
            searchBizLimit: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/metrics/bizLimit/search', // 搜索，tempBusinessId传入业务限定ID
            matchBizLimit: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/metrics/bizLimit/search/match', // 节点匹配
            bizLimitQuickTip: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/metrics/bizLimit/search/quickTip', // 键盘精灵
            bizAssets: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/assets/bizAssets', // 获取业务资产信息
            bizClassifyTree: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/assets/bizAssets/classifyTree', // 获取业务资产分类树
            simpleBizAssets: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/metrics/bizLimit/simple', // 获取业务资产分类树

            metricsSummary: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/metricsSummary', // 查询事实资产列表
            SummaryBizModuleAndTheme: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/metricsSummary/filter/bizModuleAndTheme', // 获取业务版块及主题过滤器
            SummaryClassifyFilters: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/metricsSummary/filter/classifyFilters', // 获取业务版块及主题过滤器
            metricsProcess: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/metricsSummary/metrics/process', // 查询指标所在的业务过程列表
            metricsProcessFilters: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/metricsSummary/metrics/processFilters', // 查询指标所在的业务过程列表
            summaryMetrics: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/metricsSummary/metrics', // 查询事实资产列表
            summaryDetailForEdit: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/metricsSummary/detailForEdit/', // 查询汇总资产详情
            saveSummaryMetrics: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/metricsSummary/save', // 保存汇总资产信息
            summaryMetricsDetail: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/metricsSummary/', // 查询汇总资产详情

            assetsBizModuleAndTheme: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/assets/release/metricsSummary/filter/bizModuleAndTheme', // 汇总资产-业务版块及主题过滤器
            assetsClassifyFilters: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/assets/release/metricsSummary/filter/classifyFilters', // 汇总资产-业务版块及主题过滤器
            assetsMetricsSummary: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/assets/release/metricsSummary', // 汇总资产-业务版块及主题过滤器
            summaryMetricsEtlDownload: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/assets/release/metricsSummary/etl/download', // 汇总资产-下载ETL脚本
            releaseMetricsSummary: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/assets/release/metricsSummary/release', // 汇总资产-发布/更新汇总资产
            versionFilter: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/assets/release/versionFilter', // 汇总资产-版本号过滤器
            metricsSummaryDateColumn: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/metricsSummary/dateColumn', // 查询汇总资产的时间字段
            unreleaseDetail: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/assets/release/detail/unrelease', // 变更内容（未发布内容）
            releaseHistory: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/assets/release/releaseHistory', // 发布历史

            releaseBusiness: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/assets/release/business', // 业务资产 - 查询业务资产列表
            businessBizModuleAndTheme: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/assets/release/business/filter/bizModuleAndTheme', // 业务资产-业务版块及主题过滤器
            businessClassifyFilters: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/assets/release/business/filter/classifyFilters', // 业务资产-业务版块及主题过滤器
            businessPublish: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/assets/release/business/publish', // 业务资产-发布/更新业务资产
            bizAssetsDetail: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/assets/bizAssets/', // 业务资产-获取业务资产详情
            businessNormalColumn: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/assets/bizAssets/column/normal', // 获取业务资产普通字段
            businessColumnType: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/assets/bizAssets/column/types', // 获取业务字段类型过滤器
            businessPatitionColumn: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/assets/bizAssets/column/partition', // 获取业务资产分区字段
            bizAssetsPreview: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/assets/bizAssets/preview', // 预览业务数据
            internalTableRelation: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/assets/bizAssets/internalTableRelation', // 获取业务资产内部表间关系

            dimtable: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimtable', // 查询-维度表列表
            dimtableBizModuleAndTheme: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimtable/filter/bizModuleAndTheme', // 查询-业务版块及主题过滤器
            dimtableClassifyFilters: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimtable/filter/classifyFilters', // 查询-业务版块及主题过滤器
            dimtableTypes: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimtable/filter/types', // 查询-获取类型过滤器
            dimtableDatabase: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimtable/filter/database', // 查询-获取数据库过滤器
            dimtableDelete: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimtable/', // 删除维度表
            dimtableNormalColumns: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimtable/normalColumns', // 详情-普通字段
            dimtablePartitionColumns: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimtable/partitionColumns', // 详情-分区字段
            dimtableSuggestBizClass: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimtable/suggestBizClass', // 创建-推荐业务分类信息
            dimtableSuggestClassify: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimtable/suggestClassify', // 创建-推荐业务分类信息
            dimtableDatabaseList: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimtable/database', // 创建-获取库列表
            dimtableTable: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimtable/table', // 创建-获取表列表
            dimtableColumnForAdd: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimtable/columnForAdd', // 创建-获取表列表
            dimtableDataTypes: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimtable/dataTypes', // 创建-获取字段类型列表
            dimtableEnglishNamePrefix: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimtable/englishNamePrefix', // 创建-查询维度英文名前缀
            dimtableTimeFormat: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimtable/timeFormat', // 创建-获取时间格式信息
            dimtableSaveAndGenerateAssets: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimtable/saveAndGenerateAssets', // 保存并生成维度资产
            dimtableEditDetail: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimtable/forEdit/', // 编辑-获取维度表编辑详情
            dimtableColumn: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimtable/column',
            verticalDimColumn: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimtable/verticalDim/generateColumn',

            dimassets: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimassets', // 查询-维度资产列表
            dimassetsBizModuleAndTheme: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimassets/filter/bizModuleAndTheme', // 查询-获取业务版块及主题过滤器
            dimassetsClassifyFilters: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimassets/filter/classifyFilters', // 查询-获取业务版块及主题过滤器
            dimassetsDatabase: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimassets/filter/database', // 查询-获取数据库过滤器
            dimassetsNormalColumns: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimassets/normalColumns', // 详情-普通字段
            dimassetsModelFilter: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimassets/normalColumns/filter/modelRelation', // 详情-普通字段模型关系过滤器
            dimassetsSourceFilter: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimassets/normalColumns/filter/source', // 详情-普通字段模型关系过滤器
            dimassetsPartitionColumns: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimassets/partitionColumns', // 详情-分区字段
            dimassetsDetailForEdit: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimassets/detailForEdit/', // 编辑-查询维度资产详情
            dimassetsSave: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimassets/save', // 保存维度资产信息

            dimassetsInternalColumn: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/assets/relation/internal/columns', // 内部关系-获取关联资产的字段信息
            dimassetsInternalDelete: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/assets/relation/internal/delete', // 内部关系-删除关联关系信息
            dimassetsInternalInfo: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/assets/relation/internal/info', // 内部关系-获取关联资产的字段信息
            dimassetsRelateAssets: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/assets/relation/internal/relateAssets', // 内部关系-获取可关联的资产信息
            dimassetsRelationSave: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/assets/relation/internal/save', // 内部关系-保存关联关系
            belongFactsBizModuleAndTheme: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimassets/belongFacts/filter/bizModuleAndTheme', // 详情-关联事实资产的业务版块与主题域过滤器
            belongFactsBizProcess: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimassets/belongFacts/filter/bizProcess', // 详情-关联事实资产的业务版块与主题域过滤器
            belongFactsClassifyFilters: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimassets/belongFacts/filter/classifyFilters', // 详情-关联事实资产的业务版块与主题域过滤器
            belongFacts: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimassets/belongFacts', // 详情-关联事实资产的业务版块与主题域过滤器
            factassetsModelFilter: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/factassets/normalColumns/filter/modelRelation', // 详情-普通字段模型关系过滤器
            factassetsSourceFilter: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/factassets/normalColumns/filter/source', // 详情-普通字段模型关系过滤器
            factassetsRelateBiz: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/assets/bizAssets/column/relateBiz', // 详情-普通字段模型关系过滤器
            datasourceDefine: HTTP_BASE_URL + '/quantchiAPI/api/datasource/define/list', // 数据源配置

            systemmenuList: HTTP_BASE_URL + '/tdc/systemmenu/list',
            systemmenuDivide: HTTP_BASE_URL + '/tdc/systemmenu/divide',
            dataDistributionDetail: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/level/listStatByTableId',

            //元模型相关
            queryMetaModelList: HTTP_BASE_URL + '/quantchiAPI/api/metamodel/manager/queryMetaModelList',
            queryMetaModelDetailList: HTTP_BASE_URL + '/quantchiAPI/api/metamodel/manager/queryMetaModelDetailList',
            changeEnableStatus: HTTP_BASE_URL + '/quantchiAPI/api/metamodel/manager/changeEnableStatus',
            sortMetaModelDetail: HTTP_BASE_URL + '/quantchiAPI/api/metamodel/manager/sortMetaModelDetail',
            sortGroup: HTTP_BASE_URL + '/quantchiAPI/api/metamodel/manager/sortGroup',
            deleteMetaModelDetail: HTTP_BASE_URL + '/quantchiAPI/api/metamodel/manager/deleteMetaModelDetail',
            editOrAddMetaModelDetail: HTTP_BASE_URL + '/quantchiAPI/api/metamodel/manager/editOrAddMetaModelDetail',
            metaModelDetailRelationCount: HTTP_BASE_URL + '/quantchiAPI/api/metamodel/manager/metaModelDetailRelationCount',

            // 数据源发现
            datasourceDiscover: HTTP_BASE_URL + '/quantchiAPI/api/datasource/discover/page',
            getDatasourceById: HTTP_BASE_URL + '/quantchiAPI/api/metadata/datasource/getDatasourceById',
            discoverLog: HTTP_BASE_URL + '/quantchiAPI/api/datasource/discover/page/log/',
            discoverConfig: HTTP_BASE_URL + '/quantchiAPI/api/datasource/discover/datasource/discover/config/get',
            saveDiscoverConfig: HTTP_BASE_URL + '/quantchiAPI/api/datasource/discover/config/save',
            discoverConfigStatus: HTTP_BASE_URL + '/quantchiAPI/api/datasource/discover/datasource/discover/config/changeStatus',
            discoverDefault: HTTP_BASE_URL + '/quantchiAPI/api/datasource/discover/default/data/',
            discoverExecute: HTTP_BASE_URL + '/quantchiAPI/api/datasource/discover/execute/',
            dsMap: HTTP_BASE_URL + '/quantchiAPI/api/datasource/discover/ds/map/',
            querySystemOverview: HTTP_BASE_URL + '/service-qa/dataAnalysis/querySystemOverview',

        },
        term: {
            term: HTTP_BASE_URL + '/quantchiAPI/term', // 术语
            termUploadFile: HTTP_BASE_URL + '/quantchiAPI/term/import', // 术语列表 文件上传
            blood: HTTP_BASE_URL + '/quantchiAPI/api/lineage', // 指标详情 血缘关系图
            node: HTTP_BASE_URL + '/quantchiAPI/api/selectMetric', // 血缘关系图 节点详细信
            selectBusiness: HTTP_BASE_URL + '/quantchiAPI/api/selectBusiness', // 指标列表 左侧树
            metrics: HTTP_BASE_URL + '/quantchiAPI/api/metrics', // 指标列表
            selectMetric: HTTP_BASE_URL + '/quantchiAPI/api/selectMetric', // 指标列表 old
            insertMetric: HTTP_BASE_URL + '/quantchiAPI/api/insertMetric', // 指标新增
            selectPhysicalProperty: HTTP_BASE_URL + '/quantchiAPI/api/selectPhysicalProperty', // 查询指标物理字段信息
            selectMapping: HTTP_BASE_URL + '/quantchiAPI/api/selectMapping', // 查询指标-字段映射
            insertMapping: HTTP_BASE_URL + '/quantchiAPI/api/insertMapping', // 添加指标-字段映射
            insertMappingBatch: HTTP_BASE_URL + '/quantchiAPI/api/insertMappingBatch', // 添加指标-字段映射批量
            deleteMapping: HTTP_BASE_URL + '/quantchiAPI/api/deleteMapping', // 删除指标-字段映射
            deleteMappingBatch: HTTP_BASE_URL + '/quantchiAPI/api/deleteMappingBatch', // 删除指标-字段映射
            deleteTarget: HTTP_BASE_URL + '/quantchiAPI/api/deleteTarget', // 删除指标
            query: HTTP_BASE_URL + '/quantchiAPI/api/query', // 衍生指标查询sql
            queryFromSearch: HTTP_BASE_URL + '/quantchiAPI/api/queryFromSearch', // 衍生指标查询技术口径
            manualJob: HTTP_BASE_URL + '/quantchiAPI/api/manualJob', // 生成任务
            getManualJob: HTTP_BASE_URL + '/quantchiAPI/api/getManualJob', // 任务列表查询
            deleteManualJob: HTTP_BASE_URL + '/quantchiAPI/api/deleteManualJob', // 任务列表查询
            selectStandardRelation: HTTP_BASE_URL + '/quantchiAPI/api/selectStandardRelation', // 查询指标-标准映射
            insertStandardRelation: HTTP_BASE_URL + '/quantchiAPI/api/insertStandardRelation', // 保存指标-标准映射
            insertStandardRelationBatch: HTTP_BASE_URL + '/quantchiAPI/api/insertStandardRelationBatch', // 保存指标-标准映射
            deleteStandardRelation: HTTP_BASE_URL + '/quantchiAPI/api/deleteStandardRelation', // 删除指标-标准映射
            getStandardTree: HTTP_BASE_URL + '/quantchiAPI/api/getStandardTree', // 懒加载标准树
            businessTypeView: HTTP_BASE_URL + '/quantchiAPI/api/businessTypeView', // 实用业务模型图片
            logicModel: HTTP_BASE_URL + '/quantchiAPI/api/logicModel', // 逻辑模型图片
            LogicFieldLineage: HTTP_BASE_URL + '/quantchiAPI/api/LogicFieldLineage', // 逻辑血缘图片
            logicField: HTTP_BASE_URL + '/quantchiAPI/api/model/logicField', // 逻辑血缘图片
            upgradeMetrics: HTTP_BASE_URL + '/quantchiAPI/api/upgradeMetrics', // 指标升级标准接口
            getStandardList: HTTP_BASE_URL + '/quantchiAPI/api/standard', // 指标升级标准接口
            apiMetrics: HTTP_BASE_URL + '/quantchiAPI/api/metrics', // 新增或修改指标接口
            metricsPublish: HTTP_BASE_URL + '/quantchiAPI/api/metrics/publish', // 新增或修改指标接口
            metricsCategory: HTTP_BASE_URL + '/quantchiAPI/api/metrics/category', // 指标分类树
            metricsCategoryDelete: HTTP_BASE_URL + '/quantchiAPI/api/metrics/category/delete', // 删除指标分类树
            columnDetail: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/columnDetail', // 获取报表指标详情
            caliberSql: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/column/caliberSql', // 获取报表字段的口径Sql

            metricsSimpleList: HTTP_BASE_URL + '/quantchiAPI/api/metrics/list', // 获取指标简要信息
            metricsBindStatistic: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/metricsBind/statistic', // 获取指标绑定统计(若不需根据列表中的选择事实变化，则无需传入参)
            metricsBindList: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/metricsBind/list', // 获取指标简要信息
            completeReport: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/', // 修改报表信息(包括字段信息)
            unbindMetrics: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/column/unbindMetrics', // 解除显示列与指标间的关系

            techInfo: HTTP_BASE_URL + '/quantchiAPI/api/metrics/techInfo', // 获取指标技术口径
            confirmTechInfo: HTTP_BASE_URL + '/quantchiAPI/api/metrics/techInfo/confirm', // 确认技术口径
            parseTechInfo: HTTP_BASE_URL + '/quantchiAPI/api/metrics/techInfo/parse', // 解析指标技术口径
            saveRelateColumn: HTTP_BASE_URL + '/quantchiAPI/api/metrics/techInfo/saveRelateColumn', // 保存技术口径字段关联关系
            deleteRelateColumn: HTTP_BASE_URL + '/quantchiAPI/api/metrics/techInfo/deleteRelateColumn', // 删除指标技术口径关联字段

            columnRelation: HTTP_BASE_URL + '/quantchiAPI/api/metrics/columnRelation', // 指标-字段关联接口
            columnRelationStatistics: HTTP_BASE_URL + '/quantchiAPI/api/metrics/columnRelation/statistics', // 指标-字段关联统计接口
            listMetricsQaResult: HTTP_BASE_URL + '/quantchiAPI/api/metrics/listMetricsQaResult', // 指标详情页：指标质量监控列表
            statisticsMetricsQaMonitor: HTTP_BASE_URL + '/quantchiAPI/api/metrics/statisticsMetricsQaMonitor', // 指标监控：质量监控接口
            statisticsMetricsQaRuleDefine: HTTP_BASE_URL + '/quantchiAPI/api/metrics/statisticsMetricsQaRuleDefine', // 指标监控：规则定义接口
            statisticsMetricsRuleExecute: HTTP_BASE_URL + '/quantchiAPI/api/metrics/statisticsMetricsRuleExecute', // 指标监控：规则执行接口
            listMetricsColumnRelated: HTTP_BASE_URL + '/quantchiAPI/api/metrics/listMetricsColumnRelated', // 指标监控：字段指标关联接口
            getColumnExtInfo: HTTP_BASE_URL + '/quantchiAPI/api/metadata/field/getColumnExtInfo', // 获取规则源库表字段信息

            atomicMetricsSearch: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/atomicMetrics/search', // 查询原子指标列表
            suggestColumnType: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/atomicMetrics/suggestColumnType', // 根据字段ID和计算逻辑推荐字段类型
            saveOrUpdate: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/atomicMetrics/saveOrUpdate', // 保存或者修改原子指标
            listFunctions: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/atomicMetrics/listFunctions', // 获取计算逻辑列表
            getSearchConditionBizProcess: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/atomicMetrics/getSearchConditionBizProcess', // 获取原子指标列表查询条件-业务过程
            getSearchConditionBizModuleAndTheme: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/atomicMetrics/getSearchConditionBizModuleAndTheme', // 获取原子指标列表查询条件-业务板块和主题域
            getClassifyFilters: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/atomicMetrics/filter/classifyFilters', // 获取原子指标列表查询条件-业务板块和主题域
            getAtomicMetricsById: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/atomicMetrics/getById', // 根据Id获取原子指标详细信息
            existsAtomicMetrics: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/atomicMetrics/existsAtomicMetrics', // 是否存在原子指标
            deleteAtomicMetricsById: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/atomicMetrics/deleteById', // 根据Id删除原子指标
            factassetsSimple: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/factassets/simple', // 获取事实资产简要信息
            factassetsColumns: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/factassets/columns', // 事实资产字段简要信息
            getBizClassifyById: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/factassets/getBizClassifyById', // 获取事实资产对应的分类信息
            getClassifyById: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/factassets/getClassifyById', // 获取事实资产对应的分类信息
            getDatasourceId: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/atomicMetrics/getDatasourceId', // 根据physicalColumnId获取数据源ID

            derivativeMetricsSearch: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/derivativeMetrics/search', // 查询衍生指标列表
            getDerBizModuleAndTheme: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/derivativeMetrics/getSearchConditionBizModuleAndTheme', // 获取衍生指标列表查询条件-业务板块和主题域
            getDerClassifyFilters: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/derivativeMetrics/filter/classifyFilters', // 获取衍生指标列表查询条件-业务板块和主题域
            getDerBizProcess: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/derivativeMetrics/getSearchConditionBizProcess', // 获取衍生指标列表查询条件-业务板块和主题域
            deleteDerById: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/derivativeMetrics/deleteById', // 删除衍生指标
            getDerById: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/derivativeMetrics/getById', // 根据ID查询衍生指标数据
            updateDerivativeMetrics: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/derivativeMetrics/update', // 修改衍生指标
            preCreateDerivativeMetrics: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/derivativeMetrics/preCreate', // 预生成衍生指标
            createDerivativeMetrics: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/derivativeMetrics/create', // 保存衍生指标
            statisticalperiodSimple: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/metrics/statisticalperiod/simple', // 查询统计周期简要信息
            derivativeMetricsSql: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/derivativeMetrics/sql', // 获取衍生指标的Sql信息

            getRelatedMetrics: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/atomicMetrics/getRelatedMetrics', // 获取衍生指标的Sql信息
            getDeriveRelatedMetrics: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/derivativeMetrics/getRelatedMetrics', // 获取衍生指标的Sql信息
            metricsTree: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataassets/search/metrics/tree', // 指标 - 左侧目录树
            metricsSearch: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataassets/search/metrics', // 指标 - 搜索接口
            businessSearch: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataassets/search/business', // 业务 - 搜索接口
            businessTree: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataassets/search/business/tree', // 业务 - 左侧目录树
        },
        standard: {
            getChangeDetail: HTTP_BASE_URL + '/service-workflow/StandardChangeTask', // 任务详情
            submitChange: HTTP_BASE_URL + '/quantchiAPI/api/metadata/standardChange/submit', // 发起审核流程
            applyInfo: HTTP_BASE_URL + '/quantchiAPI/api/metadata/standard', // 查询标准原始内容

            getTaskTodo: HTTP_BASE_URL + '/service-workflow/StandardChangeTask/tasks/todo', // 我的标准变更待办任务
            taskGo: HTTP_BASE_URL + '/service-workflow/StandardChangeTask/task/go', // 提交任务结果

            standardHistoryRecord: HTTP_BASE_URL + '/quantchiAPI/api/standardHistoryRecord', // 获取标准变更
            standardHistoryRecords: HTTP_BASE_URL + '/quantchiAPI/api/standardHistoryRecords', // 获取标准变更详情

            standardList: HTTP_BASE_URL + '/quantchiAPI/api/standard', // 标准查询接口
            standardCategory: HTTP_BASE_URL + '/quantchiAPI/api/standard/category', // 标准类目获取
            codeDefinition: HTTP_BASE_URL + '/quantchiAPI/api/codeDefinition', // 代码定义获取
            standardDiscard: HTTP_BASE_URL + '/quantchiAPI/api/standard/discard', // 代码定义获取
            standardMapField: HTTP_BASE_URL + '/quantchiAPI/api/standard/field', // 标准的字段映射列表
            standardMapTarget: HTTP_BASE_URL + '/quantchiAPI/api/selectStandardRelation', // 标准的字段映射列表
            addStandardMapField: HTTP_BASE_URL + '/quantchiAPI/api/metadata/field/standard', // 新增标准-字段映射
            addStandardMapFieldBatch: HTTP_BASE_URL + '/quantchiAPI/api/metadata/field/standard/batch', // 新增标准-字段映射批量
            addStandardMapTarget: HTTP_BASE_URL + '/quantchiAPI/api/insertStandardRelation', // 新增标准-指标映射
            delStandardMapField: HTTP_BASE_URL + '/quantchiAPI/api/standard/field/delete', // 删除标准-字段映射
            delStandardMapTarget: HTTP_BASE_URL + '/quantchiAPI/api/deleteStandardRelation', // 刪除标准-指标的映射
            editStandardCategory: HTTP_BASE_URL + '/quantchiAPI/api/standard/category', // 标准分类树的增改
            deleteStandardCategory: HTTP_BASE_URL + '/quantchiAPI/api/standard/category/delete', // 刪除标准分类树的节点
            addOrModifyStandard: HTTP_BASE_URL + '/quantchiAPI/api/addOrModifyStandard', // 刪除标准分类树的节点
            standardMapping: HTTP_BASE_URL + '/quantchiAPI/api/standard/mapping', // 查看标准引用列表
            standardCodeValue: HTTP_BASE_URL + '/quantchiAPI/api/standard/codeValue', // 获取代码值
            deleteStandardCodeValue: HTTP_BASE_URL + '/quantchiAPI/api/standard/codeValue/delete', // 删除代码值
            queryDefaultBizRule: HTTP_BASE_URL + '/quantchiAPI/api/standard/queryDefaultBizRule', // 校验规则类型
            standardCodeMap: HTTP_BASE_URL + '/quantchiAPI/api/standard/codeValue/mapping', // 标准代码值映射
            fromStandard: HTTP_BASE_URL + '/quantchiAPI/api/metadata/codeItem', // 获取标准代码项关联的元数据代码项
            standardCodeValueTree: HTTP_BASE_URL + '/quantchiAPI/api/standard/codeValue/tree', // 获取代码项树
            metadataCodeValueMapList: HTTP_BASE_URL + '/quantchiAPI/api/metadata/codeValue/mappingList', // 获取映射列表
            codeValueMap: HTTP_BASE_URL + '/quantchiAPI/api/governance/code/value/mapping', // 代码值映射
            codeMap: HTTP_BASE_URL + '/quantchiAPI/api/governance/code/mapping', // 代码项映射
            exportModelExcel: HTTP_BASE_URL + '/quantchiAPI/api/model/exportModelExcel', // 代码项映射
            standardDelete: HTTP_BASE_URL + '/quantchiAPI/api/standard/delete', // 标准删除
            downloadExeclTemplate: HTTP_BASE_URL + '/quantchiAPI/api/metamodel/manager/downloadExeclTemplate', // 标准删除

            getTree: HTTP_BASE_URL + '/quantchiAPI/api/commontree/getTree', // 获取树
            deleteTreeNode: HTTP_BASE_URL + '/quantchiAPI/api/commontree/deleteTreeNode', // 删除节点
            addTreeNode: HTTP_BASE_URL + '/quantchiAPI/api/commontree/addTreeNode', // 添加节点
            updateTreeNode: HTTP_BASE_URL + '/quantchiAPI/api/commontree/updateTreeNode', // 更新节点
            checkNodeCode: HTTP_BASE_URL + '/quantchiAPI/api/commontree/checkNodeCode', // 检查树内编号是否重复
            checkNodeName: HTTP_BASE_URL + '/quantchiAPI/api/commontree/checkNodeName', // 检查同级名称是否重复
            getNodeSourceCountByNodeId: HTTP_BASE_URL + '/quantchiAPI/api/tree/getNodeSourceCountByNodeId', // 获取节点资源数量

            getNameCnManualAddSearchCondition: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/namecn/getNameCnManualAddSearchCondition', // 获取数仓层级和数据库列表接口
            listManualAddTableData: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/namecn/listManualAddTableData', // 手动添加中文信息页面：列表查询接口
            getDatabaseByLevelId: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/namecn/getDatabaseByLevelId', // 获取手动添加中文信息页面的数据库(联动)搜索条件：数据库列表
            getManualTableDetail: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/namecn/getManualTableDetail', // 手动添加中文信息页面：表详情数据展示接口
            saveManualData: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/namecn/saveManualData', // 手动添加中文信息页面：提交保存接口
            listEtlExtractTableData: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/namecn/listEtlExtractTableData', // 中文信息自动抽取页面：列表查询接口
            getNameCnEtlSearchCondition: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/namecn/getNameCnEtlSearchCondition', // 中文信息自动抽取页面：获取数仓层级和数据库列表接口
            getEtlStatisticsData: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/namecn/getEtlStatisticsData', // 中文信息自动抽取页面：统计数据接口
            getEtlTableDetail: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/namecn/getEtlTableDetail', // 中文信息自动抽取页面：表详情数据展示接口
            saveEtlData: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/namecn/saveEtlData', // 中文信息自动抽取页面：提交保存接口

            dwappStandard: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/standard', // 标准对标：标准列表
            dwappStandardStatistic: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/standard/statistic', // 标准对标：指定标准统计信息
            dwappStandardDetail: HTTP_BASE_URL + '/quantchiAPI/api/getStandard', // 标准对标：标准详情
            dwappStandardColumn: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/standard/column', // 标准对标：标准下的字段信息
            dwappTagInLevel: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/standard/column/dwLevelTag', // 标准对标：数仓层次下的标签信息
            dwappDatabase: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/standard/column/database', // 标准对标：关联字段的下数据库信息
            dwappDatasource: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/standard/column/datasource', // 标准对标：关联字段的下数据源信息
            deleteRelation: HTTP_BASE_URL + '/quantchiAPI/api/standard/relation/', // 标准对标：删除标准与字段关系
            dwappColumnSearch: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/standard/column/search', // 标准对标：搜索字段过滤器
            columnFilters: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/standard/column/filters', // 血缘文件重写
            lineageDatasource: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/lineage/file/datasource', // 拥有血缘文件的数据源信息
            standardRewrite: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/lineage/file/standardRewrite', // 血缘文件重写

            getColumnStandardMatchStatistics: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/columnstandardmatch/getColumnStandardMatchStatistics', // 获取统计数据(图标等数据)
            searchJobResult: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/columnstandardmatch/searchJobResult', // 搜索落标详情任务执行结果
            executeJob: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/columnstandardmatch/executeJob', // 执行任务
            exportJobResult: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/columnstandardmatch/exportJobResult', // 导出落标详情
            saveJob: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/columnstandardmatch/saveJob', // 保存配置任务
            tagInLevel: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/level/tagInLevel', // 数仓层次下的标签信息
            levelDatabase: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/level/database', // 数仓标签下的数据库信息

            standardCluster: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/standard/cluster/smart/page', // 智能对标列表(簇对标)
            clusterStatistic: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/standard/cluster/statistic', // 智能对标完成率
            clusterColumn: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/standard/cluster/column', // 智能对标簇字段
            clusterConfirm: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/standard/cluster/confirm', // 确认簇对应标准

            dwappCluster: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/cluster', // 获取所有簇
            dwappClusterStatistic: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/cluster/statistic', // 统计信息
            editStandard: HTTP_BASE_URL + '/quantchiAPI/api/standard/editStandard', // 编辑标准
            queryCheckRuleByStandardId: HTTP_BASE_URL + '/quantchiAPI/api/standard/queryCheckRuleByStandardId', // 	根据标准id查询关联的规则列表
            queryUdcCode: HTTP_BASE_URL + '/quantchiAPI/api/standardEstimate/queryUdcCode', // 	根据标准id查询关联的规则列表
            clusterDetail: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/cluster/detail/', // 簇详情
            clusterSave: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/cluster/save', // 修改簇信息
            dwappClusterColumn: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/cluster/column', // 簇下字段信息
            dwappClusterColumnWithStatus: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/cluster/columnWithStatus', // 簇下字段信息(包含状态)
            dwLevelTag: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/cluster/dwLevelTag', // 簇下数仓层级信息
            dwDatabase: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/cluster/database', // 簇下数据库信息
            dwDatasource: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/cluster/datasource', // 簇下数据源信息
            dwTable: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/cluster/table', // 簇下表信息
            relateWhenDelete: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/cluster/column/relateWhenDelete', // 所删字段的相关字段
            deleteCluster: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/cluster/delete', // 删除簇下字段
            fillChinese: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/cluster/fillChinese', // 补充中文信息

            searchJobResultCondition: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/columnstandardmatch/searchJobResultCondition', // 获取落标详情数仓层级-库-表查询条件

            changeStandardStatus: HTTP_BASE_URL + '/quantchiAPI/api/standard/changeStatus', // 标准状态变更
            getStandardDataType: HTTP_BASE_URL + '/quantchiAPI/api/getStandardDataType', // 获取数据类型
            getStandardLevel: HTTP_BASE_URL + '/quantchiAPI/api/getStandardLevel', // 获取标准等级
            getStdSrc: HTTP_BASE_URL + '/quantchiAPI/api/getStdSrc', // 获取标准来源
            standardEdit: HTTP_BASE_URL + '/quantchiAPI/api/standard/edit', // 编辑标准

            dicDsList: HTTP_BASE_URL + '/quantchiAPI/api/dic/ds/list', // 查询数据字典-数据源列表
            dicDsInfo: HTTP_BASE_URL + '/quantchiAPI/api/dic/ds/info/', // 查询数据字典-数据源数据概览
            dicDsOverview: HTTP_BASE_URL + '/quantchiAPI/api/dic/ds/overview/', // 查询数据字典-数据源数据概览
            dicDsTable: HTTP_BASE_URL + '/quantchiAPI/api/dic/ds/table/page', // 分页查询数据字典-数据源表的列表
            dicTableInfo: HTTP_BASE_URL + '/quantchiAPI/api/dic/table/info/', // 查询数据字典-表信息
            dicTableOverview: HTTP_BASE_URL + '/quantchiAPI/api/dic/table/overview/', // 查询数据字典-表信息
            dicField: HTTP_BASE_URL + '/quantchiAPI/api/dic/table/field/list', // 查询数据字典-表字段列表
            saveDicField: HTTP_BASE_URL + '/quantchiAPI/api/dic/table/field/save', // 保存字段信息信息
            saveDicTable: HTTP_BASE_URL + '/quantchiAPI/api/dic/table/info/save', // 保存表信息
            dicWordSpecs: HTTP_BASE_URL + '/quantchiAPI/api/dic/word/specs', // 规范化中文分词
            specSwitch: HTTP_BASE_URL + '/quantchiAPI/api/dic/ds/specs/switch', // 获取数据字典-数据源规范开关是否开启
            specSwitchOpera: HTTP_BASE_URL + '/quantchiAPI/api/dic/ds/specs/switch/opera', // 启用/关闭数据源规范化检查-开关
            dicFieldRefresh: HTTP_BASE_URL + '/quantchiAPI/api/dic/table/field/refresh', // 查询数据字典-表字段列表刷新
            queryDetailInfo: HTTP_BASE_URL + '/quantchiAPI/api/standard/queryDetailInfo', // 查询数据字典-表字段列表刷新
            estimateSystemTree: HTTP_BASE_URL + '/quantchiAPI/api/standardEstimate/estimateSystemTree', //查询已经落标过的系统
            estimateOverview: HTTP_BASE_URL + '/quantchiAPI/api/standardEstimate/estimateOverview', //查询已经落标过的系统
            queryEstimateTableList: HTTP_BASE_URL + '/quantchiAPI/api/standardEstimate/queryEstimateTableList', //查询已经落标过的系统
            queryNotEstimateSystemList: HTTP_BASE_URL + '/quantchiAPI/api/standardEstimate/queryNotEstimateSystemList', //查询未落标过的系统
            saveConfig: HTTP_BASE_URL + '/quantchiAPI/api/standardEstimate/saveConfig', //新增保存系统评估配置
            queryConfigBySystemId: HTTP_BASE_URL + '/quantchiAPI/api/standardEstimate/queryConfigBySystemId', //新增保存系统评估配置
            queryEstimateColumnList: HTTP_BASE_URL + '/quantchiAPI/api/standardEstimate/queryEstimateColumnList', //查询表下字段的落标明细
            estimateHistoryOverview: HTTP_BASE_URL + '/quantchiAPI/api/standardEstimate/estimateHistoryOverview', //查询表下字段的落标明细
            queryTableSource: HTTP_BASE_URL + '/quantchiAPI/api/standardEstimate/queryTableSource', //查询表下字段的落标明细
            executeEstimate: HTTP_BASE_URL + '/quantchiAPI/api/standardEstimate/executeEstimate', //执行落标评估
            deleteEstimateInfo: HTTP_BASE_URL + ' /quantchiAPI/api/standardEstimate/deleteEstimateInfo', //执行落标评估

            queryRowsNumByDatasourceId: HTTP_BASE_URL + '/service-qa/dataAnalysis/queryRowsNumByDatasourceId',
            queryTablesRowNumByTableIds: HTTP_BASE_URL + '/service-qa/dataAnalysis/queryTablesRowNumByTableIds',

        },
        intelligent: {
            getBusiCate: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/getBusiCate', // 智能取数获取业务接口
            getRecommendQuery: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/getRecommendQuery', // 获取推荐问句接口
            getRelatedQuery: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/getRelatedQuery', // 获取相关问句接口
            intelDownload: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/download', // 智能取数下载接口
            basicQuery: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/basicQuery', // 智能取数查询接口
            associateQuery: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/associateQuery', // 智能取数联想语句查询接口
            stepsQuery: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/stepsQuery', // 智能取数步骤查询接口
            likenum: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/likenum', // 点赞接口
            queryInstance: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/queryInstance', // 即时查询(精灵键盘)
            favouriteList: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/question/favourite', // 获取结果页 右下角已加入的报表
            deletefavouriteList: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/question/favourite/delete', // 获取结果页 右下角已加入的报表 删除
            favouriteDownload: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/question/favourite/download', // 获取结果页 右下角已加入的报表 下载
            getBusinessModel: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/business/getBusinessModel', // 获取模型关系图数据
            checkBusinessName: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/business/checkName', // 获取模型关系图数据
            switch: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/basicQuery/switch', // 图形切换接口
            aggregation: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/basicQuery/aggregation', // 聚合接口
        },
        // 'systemManage': {
        //     'auditLog': HTTP_BASE_URL + '/quantchiAPI/api/audit/log', // 日志审计-获取表格
        //     'auditOperation': HTTP_BASE_URL + '/quantchiAPI/api/audit/operation', // 日志审计-获取表格
        //     'deleteMessage': HTTP_BASE_URL + '/quantchiAPI/api/msgcenter/delete', // 消息中心-删除消息
        //     'readMessage': HTTP_BASE_URL + '/quantchiAPI/api/msgcenter/marked', // 消息中心-标记已读
        //     'msgcenter': HTTP_BASE_URL + '/quantchiAPI/api/msgcenter', // 消息中心-获取消息
        //     'msgDetail': HTTP_BASE_URL + '/quantchiAPI/api/msgcenter/detail', // 消息中心-消息详情
        //     'unread': HTTP_BASE_URL + '/quantchiAPI/api/msgcenter/unread/count' // 消息中心-消息未读
        // },
        manage: {
            getUserTree: HTTP_BASE_URL + '/quantchiAPI/api/departments', // 查询用户列表左侧树
            // "getUserByUserName": HTTP_BASE_URL + "/quantchiAPI/api/getUserByUserName", //查询用户列表
            getUserList: HTTP_BASE_URL + '/quantchiAPI/api/users', // 查询用户列表
            authorityRole: HTTP_BASE_URL + '/quantchiAPI/api/roles', // 查询所有角色
            selectAllAuth: HTTP_BASE_URL + '/quantchiAPI/api/selectAuthByFilter', // 查询所有权限
            addRole: HTTP_BASE_URL + '/quantchiAPI/api/addRole', // 插入角色
            modifyRole: HTTP_BASE_URL + '/quantchiAPI/api/modifyRole', // 修改角色
            listRoleByRoleid: HTTP_BASE_URL + '/quantchiAPI/api/listRoleByRoleid', // 获取角色详情
            getTableColumn: HTTP_BASE_URL + '/quantchiAPI/api/getTableColumn', // 修改权限
            deleAuth: HTTP_BASE_URL + '/quantchiAPI/api/deleAuth', // 删除权限
            getDataAuthDetail: HTTP_BASE_URL + '/quantchiAPI/api/getDataAuthDetail', // 查询权限明细
            addDataAuth: HTTP_BASE_URL + '/quantchiAPI/api/addDataAuth', // 添加新权限
            usersList: HTTP_BASE_URL + '/quantchiAPI/api/users', // 用户列表
            userGroupsList: HTTP_BASE_URL + '/quantchiAPI/api/usergroups', // 用户组列表
            delGroupsList: HTTP_BASE_URL + '/quantchiAPI/api/usergroups/delete', // 删除用户组
            addRoles: HTTP_BASE_URL + '/quantchiAPI/api/users/addRoles', // 添加用户到角色
            addAllToRoles: HTTP_BASE_URL + '/quantchiAPI/api/users/addAllToRoles', // 添加符合条件的所有用户到角色
            deleteRoles: HTTP_BASE_URL + '/quantchiAPI/api/users/deleteRoles', // 删除用户从角色
            deleteAllFromRoles: HTTP_BASE_URL + '/quantchiAPI/api/users/deleteAllFromRoles', // 删除符合条件的所有用户从角色
            opRoleAuthRelation: HTTP_BASE_URL + '/quantchiAPI/api/users/opRoleAuthRelation', // 添加角色到权限的映射
            authorities: HTTP_BASE_URL + '/quantchiAPI/api/users/authorities', // 获取权限列表
            addGroups: HTTP_BASE_URL + '/quantchiAPI/api/users/addGroups', // 添加用户到用户组
            addAllToGroups: HTTP_BASE_URL + '/quantchiAPI/api/users/addAllToGroups', // 添加符合条件的所有用户到用户组
            deleteGroups: HTTP_BASE_URL + '/quantchiAPI/api/users/deleteGroups', // 删除用户从用户组
            deleteAllFromGroups: HTTP_BASE_URL + '/quantchiAPI/api/users/deleteAllFromGroups', // 删除符合条件的所有用户从用户组
            departments: HTTP_BASE_URL + '/quantchiAPI/api/departments',
            rolesList: HTTP_BASE_URL + '/quantchiAPI/api/roles',
            resetPassword: HTTP_BASE_URL + '/quantchiAPI/api/umg/user/changePassword',
            roleMenu: HTTP_BASE_URL + '/quantchiAPI/api/role/menu',
            deleteUsers: HTTP_BASE_URL + '/quantchiAPI/api/users/delete', // 用户删除
            deleteRolesApi: HTTP_BASE_URL + '/quantchiAPI/api/roles/delete', // 删除角色
            saveRolesApi: HTTP_BASE_URL + '/quantchiAPI/api/roles', // 新增修改角色
        },
        systemManage: {
            auditLog: HTTP_BASE_URL + '/quantchiAPI/api/audit/log', // 日志审计-获取表格
            auditOperation: HTTP_BASE_URL + '/quantchiAPI/api/audit/operation', // 日志审计-获取表格
            deleteMessage: HTTP_BASE_URL + '/quantchiAPI/api/msgcenter/delete', // 消息中心-删除消息
            readMessage: HTTP_BASE_URL + '/quantchiAPI/api/msgcenter/marked', // 消息中心-标记已读
            msgcenter: HTTP_BASE_URL + '/quantchiAPI/api/msgcenter', // 消息中心-获取消息
            msgDetail: HTTP_BASE_URL + '/quantchiAPI/api/msgcenter/detail', // 消息中心-消息详情
            unread: HTTP_BASE_URL + '/quantchiAPI/api/msgcenter/unread/count', // 消息中心-消息未读
            getTree: HTTP_BASE_URL + '/quantchiAPI/api/commontree/getTree', // 获取树
            getStandardTree: HTTP_BASE_URL + '/quantchiAPI/api/standard/getStandardTree', // 获取树
            getSourcePathStr: HTTP_BASE_URL + ' /quantchiAPI/api/standard/getSourcePathStr', // 获取路径

            deleteTreeNode: HTTP_BASE_URL + '/quantchiAPI/api/commontree/deleteTreeNode', // 删除节点
            addTreeNode: HTTP_BASE_URL + '/quantchiAPI/api/commontree/addTreeNode', // 添加节点
            updateTreeNode: HTTP_BASE_URL + '/quantchiAPI/api/commontree/updateTreeNode', // 更新节点
            checkNodeCode: HTTP_BASE_URL + '/quantchiAPI/api/commontree/checkNodeCode', // 检查树内编号是否重复
            checkNodeName: HTTP_BASE_URL + '/quantchiAPI/api/commontree/checkNodeName', // 检查同级名称是否重复
            getNodeSourceCountByNodeId: HTTP_BASE_URL + '/quantchiAPI/api/tree/getNodeSourceCountByNodeId', // 获取节点资源数量

            datasourceMapping: HTTP_BASE_URL + '/quantchiAPI/api/compareConfig/datasourceMapping', // 获取数据源映射规则列表
            execute: HTTP_BASE_URL + '/quantchiAPI/api/compareConfig/datasourceMapping/execute', // 执行数据源映射规则
            delete: HTTP_BASE_URL + '/quantchiAPI/api/compareConfig/datasourceMapping/delete', // 删除数据源映射规则
            columnTypeMapping: HTTP_BASE_URL + '/quantchiAPI/api/compareConfig/columnTypeMapping', // 获取字段类型映射规则列表
            datasourceType: HTTP_BASE_URL + '/quantchiAPI/api/compareConfig/datasourceType', // 获取数据源类型列表
            deleteColumnTypeMapping: HTTP_BASE_URL + '/quantchiAPI/api/compareConfig/columnTypeMapping/delete', // 删除字段类型映射规则
            ignorePattern: HTTP_BASE_URL + '/quantchiAPI/api/compareConfig/ignorePattern', // 对比时字段忽略的配置列表
            deleteIgnorePattern: HTTP_BASE_URL + '/quantchiAPI/api/compareConfig/ignorePattern/delete', // 删除字段忽略的配置
            diffFilter: HTTP_BASE_URL + '/quantchiAPI/api/compareConfig/diffFilter', // 获取所有忽略和表字段的比对属性的规则
            checkDatasourceMapping: HTTP_BASE_URL + '/quantchiAPI/api/compareConfig/datasourceMapping/check', // 检查数据源映射是否存在
            columnTypeMappingFilter: HTTP_BASE_URL + '/quantchiAPI/api/compareConfig/columnTypeMapping/filter', //

            addSystem: HTTP_BASE_URL + '/quantchiAPI/api/businessSystem/add', // 增加业务系统
            deleteSystem: HTTP_BASE_URL + '/quantchiAPI/api/businessSystem/delete', // 删除业务系统
            findSystem: HTTP_BASE_URL + '/quantchiAPI/api/businessSystem/find', // 查找业务系统
            updateSystem: HTTP_BASE_URL + '/quantchiAPI/api/businessSystem/update', // 更新业务系统
            findById: HTTP_BASE_URL + '/quantchiAPI/api/businessSystem/findById', // 查询单个业务系统

            addDeveloper: HTTP_BASE_URL + '/quantchiAPI/api/developer/add', // 创建开发主体
            deleteDeveloper: HTTP_BASE_URL + '/quantchiAPI/api/developer/delete', // 删除开发主体
            findDeveloper: HTTP_BASE_URL + '/quantchiAPI/api/developer/find', // 查询开发主体
            updateDeveloper: HTTP_BASE_URL + '/quantchiAPI/api/developer/update', // 更新开发主体
            checkCodeAndName: HTTP_BASE_URL + '/quantchiAPI/api/developer/checkCodeAndName', // 更新开发主体

            statistics: HTTP_BASE_URL + '/service-qa/api/check/datasource/statistics',

            dwappLevel: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/level',
            dwappLevelTags: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/level/tags',
            dwappLevelSave: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/level/batchSave',

            bizClassifyDefSearch: HTTP_BASE_URL + '/quantchiAPI/api/metrics/bizModuleDef/search', // 查询数据板块定义列表
            bizClassifyDefDelete: HTTP_BASE_URL + '/quantchiAPI/api/metrics/bizModuleDef/deleteById', // 删除数据板块定义数据
            createOrUpdate: HTTP_BASE_URL + '/quantchiAPI/api/metrics/bizModuleDef/createOrUpdate', // 创建或者更新数据板块定义数据

            themeDefSearch: HTTP_BASE_URL + '/quantchiAPI/api/metrics/themeDef/search', // 查询主题域定义列表
            themeDefDelete: HTTP_BASE_URL + '/quantchiAPI/api/metrics/themeDef/deleteById', // 删除主题域定义
            themeDefCreateOrUpdate: HTTP_BASE_URL + '/quantchiAPI/api/metrics/themeDef/createOrUpdate', // 创建或者更新主题域定义数据

            bizProcessDefSearch: HTTP_BASE_URL + '/quantchiAPI/api/metrics/bizProcessDef/search', // 查询业务过程定义列表
            bizProcessDefDelete: HTTP_BASE_URL + '/quantchiAPI/api/metrics/bizProcessDef/deleteById', // 删除业务过程定义
            bizProcessDefCreateOrUpdate: HTTP_BASE_URL + '/quantchiAPI/api/metrics/bizProcessDef/createOrUpdate', // 创建或者更新业务过程定义数据
        },
        examination: {
            getQualityTaskJobById: HTTP_BASE_URL + '/service-task/taskJob/getQualityTaskJobById', // 获取质量检核调度任务
            saveQualityTaskJob: HTTP_BASE_URL + '/service-task/taskJob/saveQualityTaskJob', // 保存质量检核调度任务
            selectRule: HTTP_BASE_URL + '/service-qa/rule/select', // 获取检核规则
            getTaskRuleListByTaskId: HTTP_BASE_URL + '/service-qa/task/getTaskRuleListByTaskId', // 获取任务规则
            getReports: HTTP_BASE_URL + '/service-qa/report/getReports', // 查询报告列表
            saveEvaluation: HTTP_BASE_URL + '/service-qa/report/evaluation/save', // 保存单个评估指标
            getReportIndex: HTTP_BASE_URL + '/service-qa/report/getReportIndex', // 获取报告单个指标
            getReportProblemList: HTTP_BASE_URL + '/service-qa/report/getReportProblemList', // 获取报告问题清单
            getReportChart: HTTP_BASE_URL + '/service-qa/report/getReportChart', // 查询检核报告
            getRuleHisInfo: HTTP_BASE_URL + '/service-qa/report/getRuleHisInfo', // 查询规则历史明细
            getRuleHisChart: HTTP_BASE_URL + '/service-qa/report/getRuleHisChart', // 查询规则历史趋势
            selectRuleById: HTTP_BASE_URL + '/service-qa/rule/selectRuleById', // 查询单个规则信息
            getCheckResltItemList: HTTP_BASE_URL + '/service-qa/report/getCheckResltItemList', // 查询问题清单
            getTaskRuleTypeTree: HTTP_BASE_URL + '/service-qa/task/getTaskRuleTypeTree', // 获取任务下规则类型树
            refreshReport: HTTP_BASE_URL + '/service-qa/report/refreshReport', // 刷新报告
            getTaskResultById: HTTP_BASE_URL + '/service-qa/report/getTaskResultById', // 查询单个规则检核结果

            generalStatistic: HTTP_BASE_URL + '/examination/general_report/statistic', // 常规检测-通过率统计
            generalAbnormal: HTTP_BASE_URL + '/examination/general_report/abnormal_table', // 常规检测-异常详细列表
            // "generalAbnormal":HTTP_BASE_URL + "/examination/general_report/abnormal_table", //常规检测-异常详细列表
            generalHistoryStatistic: HTTP_BASE_URL + '/examination/general_report/history_statistic', // 常规检测-历史报告-统计数据
            generalHistoryList: HTTP_BASE_URL + '/examination/general_report/history_list', // 常规检测-历史报告-详细列表
            generalFieldDesc: HTTP_BASE_URL + '/examination/general_report/field_desc', // 常规检测-字段详情

            reportDesc: HTTP_BASE_URL + '/examination/report/desc', // 报告详情
            definitionTask: HTTP_BASE_URL + '/examination/definition/task', // 自定义检核-任务列表
            definitionStatistic: HTTP_BASE_URL + '/examination/definition/Statistic', // 自定义检核-任务列表
            userList: HTTP_BASE_URL + '/examination/user/list', // 用户列表
            rulesList: HTTP_BASE_URL + '/examination/rule/list', // 规则列表
            rulesBusinessDesc: HTTP_BASE_URL + '/examination/rule/business_detail', // 业务详情
            rulesTechnologyDesc: HTTP_BASE_URL + '/examination/rule/technology_detail', // 技术详情
            searchBusin: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/searchBusin', // 查询业务规则
            searchRule: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/searchTech', // 查询技术规则
            systemList: HTTP_BASE_URL + '/quantchiAPI/api/getBusinSystemList', // 查询技术规则
            editJob: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job', // 增加或修改自动或手动核检任务
            searchJob: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/search', // 查询技术规则
            deleteJob: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/delete', // 删除自动或手动核检任务
            statisticHistory: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/history/statistic', // 获取核检任务统计
            statisticHistoryGeneral: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/history/statistic/general', // 获取核检任务统计
            statisticHistoryTopN: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/history/statistic/topN', // 获取核检任务统计top
            statisticResult: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/result/', // 历史任务统计信息
            execute: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/execute', // 历史任务统计信息
            checkDelete: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/delete', // 删除业务规则
            addCheck: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/', // 新增或更新检核规则 查看
            searchCheck: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/search', // 获取检核规则
            getSql: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/getSql', // 获取检核规则-获取sql
            checkExec: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/exec', // 执行
            checkHistory: HTTP_BASE_URL + '/service-qa/api/metadata/check/history', // 检核概要  获取核检任务历史列表 （按天统计页面同一个接口调两次 参数不一样）
            checkRuleList: HTTP_BASE_URL + '/service-qa/api/metadata/check/ruleList', // 检核概要  获取核检规则列表概要
            checkRuleListExport: HTTP_BASE_URL + '/service-qa/api/metadata/check/ruleList/export', // 检核概要  获取核检规则列表概要 导出
            exceptionDetail: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/exceptionDetail', // 检核概要  获取核检规则异常结果明细
            exceptionDetailExport: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/exceptionDetail/export', // 检核概要  获取核检规则异常结果明细 导出
            ruleSubscribeList: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/ruleSubscribeList', // 订阅规则 我的订阅列表
            subscribeList: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/subscribe', // 订阅规则 订阅列表
            subscribeDetail: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/subscribeDetail', // 订阅规则 订阅列表 查看详情
            deleteSubscribe: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/subscribe/delete', // 订阅规则 订阅列表 删除订阅
            getSchedule: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/schedule', // 新增修改规则组 获取调度组列表
            execHistory: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/execHistory', // 获取规则执行日志
            execLog: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/execLog',
            jobExec: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/exec',
            jobAbort: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/abort',

            scheduleDetail: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/scheduleDetail', // 获取任务明细
            checkAbort: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/abort', // 停止任务
            checkJobHang: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/hang', // 挂起任务
            checkJobActive: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/active', // 激活任务
            checkJobDelete: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/delete', // 删除任务
            checkOwner: HTTP_BASE_URL + '/quantchiAPI/api/check/owner', // 责任人维护列表
            checkOwnerDetail: HTTP_BASE_URL + '/quantchiAPI/api/check/owner/detail', // 责任人维护明细
            checkOwnerDelete: HTTP_BASE_URL + '/quantchiAPI/api/check/owner/delete', // 责任人维护删除
            evaluationReport: HTTP_BASE_URL + '/quantchiAPI/api/evaluation/report',
            evaluationReportTitle: HTTP_BASE_URL + '/quantchiAPI/api/evaluation/report/title',
            evaluationReportToggle: HTTP_BASE_URL + '/quantchiAPI/api/evaluation/report/toggle',
            evaluationReportDelete: HTTP_BASE_URL + '/quantchiAPI/api/evaluation/report/delete',
            evaluationReportPreview: HTTP_BASE_URL + '/quantchiAPI/api/evaluation/report/preview',
            evaluationReportSqlParse: HTTP_BASE_URL + '/quantchiAPI/api/evaluation/report/sqlparse',
            evaluationReportField: HTTP_BASE_URL + '/quantchiAPI/api/evaluation/report/field',
            reportStatisticInstitution: HTTP_BASE_URL + '/quantchiAPI/api/report/statistic/list/institution',
            reportStatisticLatest: HTTP_BASE_URL + '/quantchiAPI/api/report/statistic/latest',
            reportStatisticGeneral: HTTP_BASE_URL + '/quantchiAPI/api/report/statistic/list/general',
            reportStatisticPeriod: HTTP_BASE_URL + '/quantchiAPI/api/report/statistic/period',
            evaluationReportInstitutions: HTTP_BASE_URL + '/quantchiAPI/api/evaluation/report/institutions',
            evaluationReportExec: HTTP_BASE_URL + '/quantchiAPI/api/evaluation/report/exec',
            exTableAnalysisTopN: HTTP_BASE_URL + '/quantchiAPI/api/check/analysis/topN',
            timeLibraryShow: HTTP_BASE_URL + '/quantchiAPI/api/check/analysis/general',
            errorRule: HTTP_BASE_URL + '/quantchiAPI/api/check/analysis/checkRule',
            errorField: HTTP_BASE_URL + '/quantchiAPI/api/check/analysis/column',
            getAbnormalData: HTTP_BASE_URL + '/quantchiAPI/api/check/analysis',
            getPeriodData: HTTP_BASE_URL + '/quantchiAPI/api/report/statistic/period',
            getGeneral: HTTP_BASE_URL + '/quantchiAPI/api/check/analysis/general',
            getExceptionDetail: HTTP_BASE_URL + '/quantchiAPI/api/check/analysis/exceptionDetail',
            getExceptionColumn: HTTP_BASE_URL + '/quantchiAPI/api/check/analysis/exceptionColumn',
            getReportSource: HTTP_BASE_URL + '/service-qa/api/check/system/detail',
            getReportRule: HTTP_BASE_URL + '/service-qa/api/check/datasource/detail',
            getReportSystemSelect: HTTP_BASE_URL + '/service-qa/api/metadata/check/system',
            getReportManager: HTTP_BASE_URL + '/service-qa/api/metadata/check/datasource/manager',
            getReportDatasource: HTTP_BASE_URL + '/service-qa/api/metadata/check/datasource',
            getReportDatabase: HTTP_BASE_URL + '/service-qa/api/metadata/check/database',
            getReportDataTable: HTTP_BASE_URL + '/service-qa/api/metadata/check/table',
            getReportSummary: HTTP_BASE_URL + '/service-qa/api/check/summary', // 质量报告
            getReportRuleTrend: HTTP_BASE_URL + '/service-qa/api/check/rule/detail', // 规则趋势
            getReportSystemSummary: HTTP_BASE_URL + '/service-qa/api/check/system/summary',
            getReportCheckDate: HTTP_BASE_URL + '/service-qa/api/check/date', // 质量报告时间数据获取

            checkRuleTree: HTTP_BASE_URL + '/quantchiAPI/api/commontree/getTree', // 检核依据值获取
            getMetadataTreeForRule: HTTP_BASE_URL + '/service-qa/rule/getMetadataTreeForRule',

            generalHistoryStatistic: HTTP_BASE_URL + '/examination/general_report/history_statistic', // 常规检测-历史报告-统计数据
            generalHistoryList: HTTP_BASE_URL + '/examination/general_report/history_list', // 常规检测-历史报告-详细列表
            generalFieldDesc: HTTP_BASE_URL + '/examination/general_report/field_desc', // 常规检测-字段详情

            reportDesc: HTTP_BASE_URL + '/examination/report/desc', // 报告详情
            definitionTask: HTTP_BASE_URL + '/examination/definition/task', // 自定义检核-任务列表
            definitionStatistic: HTTP_BASE_URL + '/examination/definition/Statistic', // 自定义检核-任务列表
            userList: HTTP_BASE_URL + '/examination/user/list', // 用户列表
            rulesList: HTTP_BASE_URL + '/examination/rule/list', // 规则列表
            rulesBusinessDesc: HTTP_BASE_URL + '/examination/rule/business_detail', // 业务详情
            rulesTechnologyDesc: HTTP_BASE_URL + '/examination/rule/technology_detail', // 技术详情
            searchBusin: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/searchBusin', // 查询业务规则
            searchRule: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/searchTech', // 查询技术规则
            systemList: HTTP_BASE_URL + '/quantchiAPI/api/getBusinSystemList', // 查询技术规则
            editJob: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job', // 增加或修改自动或手动核检任务
            searchJob: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/search', // 查询技术规则
            deleteJob: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/delete', // 删除自动或手动核检任务
            statisticHistory: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/history/statistic', // 获取核检任务统计
            statisticHistoryGeneral: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/history/statistic/general', // 获取核检任务统计
            statisticHistoryTopN: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/history/statistic/topN', // 获取核检任务统计top
            statisticResult: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/result/', // 历史任务统计信息
            execute: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/execute', // 历史任务统计信息
            checkDelete: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/delete', // 删除业务规则
            addCheck: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/', // 新增或更新检核规则 查看
            searchCheck: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/search', // 获取检核规则
            getSql: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/getSql', // 获取检核规则-获取sql
            checkExec: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/exec', // 执行
            checkHistory: HTTP_BASE_URL + '/service-qa/api/metadata/check/history', // 检核概要  获取核检任务历史列表 （按天统计页面同一个接口调两次 参数不一样）
            checkRuleList: HTTP_BASE_URL + '/service-qa/api/metadata/check/ruleList', // 检核概要  获取核检规则列表概要
            checkRuleListExport: HTTP_BASE_URL + '/service-qa/api/metadata/check/ruleList/export', // 检核概要  获取核检规则列表概要 导出
            exceptionDetail: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/exceptionDetail', // 检核概要  获取核检规则异常结果明细
            exceptionDetailExport: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/exceptionDetail/export', // 检核概要  获取核检规则异常结果明细 导出
            ruleSubscribeList: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/ruleSubscribeList', // 订阅规则 我的订阅列表
            subscribeList: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/subscribe', // 订阅规则 订阅列表
            subscribeDetail: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/subscribeDetail', // 订阅规则 订阅列表 查看详情
            deleteSubscribe: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/subscribe/delete', // 订阅规则 订阅列表 删除订阅
            getSchedule: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/schedule', // 新增修改规则组 获取调度组列表
            execHistory: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/execHistory', // 获取规则执行日志
            execLog: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/execLog',
            jobExec: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/exec',
            jobAbort: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/abort',

            scheduleDetail: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/scheduleDetail', // 获取任务明细
            checkAbort: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/abort', // 停止任务
            checkJobHang: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/hang', // 挂起任务
            checkJobActive: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/active', // 激活任务
            checkJobDelete: HTTP_BASE_URL + '/quantchiAPI/api/metadata/check/job/delete', // 删除任务
            checkOwner: HTTP_BASE_URL + '/quantchiAPI/api/check/owner', // 责任人维护列表
            checkOwnerDetail: HTTP_BASE_URL + '/quantchiAPI/api/check/owner/detail', // 责任人维护明细
            checkOwnerDelete: HTTP_BASE_URL + '/quantchiAPI/api/check/owner/delete', // 责任人维护删除
            evaluationReport: HTTP_BASE_URL + '/quantchiAPI/api/evaluation/report',
            evaluationReportTitle: HTTP_BASE_URL + '/quantchiAPI/api/evaluation/report/title',
            evaluationReportToggle: HTTP_BASE_URL + '/quantchiAPI/api/evaluation/report/toggle',
            evaluationReportDelete: HTTP_BASE_URL + '/quantchiAPI/api/evaluation/report/delete',
            evaluationReportPreview: HTTP_BASE_URL + '/quantchiAPI/api/evaluation/report/preview',
            evaluationReportSqlParse: HTTP_BASE_URL + '/quantchiAPI/api/evaluation/report/sqlparse',
            evaluationReportField: HTTP_BASE_URL + '/quantchiAPI/api/evaluation/report/field',
            reportStatisticInstitution: HTTP_BASE_URL + '/quantchiAPI/api/report/statistic/list/institution',
            reportStatisticLatest: HTTP_BASE_URL + '/quantchiAPI/api/report/statistic/latest',
            reportStatisticGeneral: HTTP_BASE_URL + '/quantchiAPI/api/report/statistic/list/general',
            reportStatisticPeriod: HTTP_BASE_URL + '/quantchiAPI/api/report/statistic/period',
            evaluationReportInstitutions: HTTP_BASE_URL + '/quantchiAPI/api/evaluation/report/institutions',
            evaluationReportExec: HTTP_BASE_URL + '/quantchiAPI/api/evaluation/report/exec',
            exTableAnalysisTopN: HTTP_BASE_URL + '/quantchiAPI/api/check/analysis/topN',
            timeLibraryShow: HTTP_BASE_URL + '/quantchiAPI/api/check/analysis/general',
            errorRule: HTTP_BASE_URL + '/quantchiAPI/api/check/analysis/checkRule',
            errorField: HTTP_BASE_URL + '/quantchiAPI/api/check/analysis/column',
            getAbnormalData: HTTP_BASE_URL + '/quantchiAPI/api/check/analysis',
            getPeriodData: HTTP_BASE_URL + '/quantchiAPI/api/report/statistic/period',
            getGeneral: HTTP_BASE_URL + '/quantchiAPI/api/check/analysis/general',
            getExceptionDetail: HTTP_BASE_URL + '/quantchiAPI/api/check/analysis/exceptionDetail',
            getExceptionColumn: HTTP_BASE_URL + '/quantchiAPI/api/check/analysis/exceptionColumn',
            getReportSource: HTTP_BASE_URL + '/service-qa/api/check/system/detail',
            getReportRule: HTTP_BASE_URL + '/service-qa/api/check/datasource/detail',
            getReportSystemSelect: HTTP_BASE_URL + '/service-qa/api/metadata/check/system',
            getReportManager: HTTP_BASE_URL + '/service-qa/api/metadata/check/datasource/manager',
            getReportDatasource: HTTP_BASE_URL + '/service-qa/api/metadata/check/datasource',
            getReportDatabase: HTTP_BASE_URL + '/service-qa/api/metadata/check/database',
            getReportDataTable: HTTP_BASE_URL + '/service-qa/api/metadata/check/table',
            getReportSummary: HTTP_BASE_URL + '/service-qa/api/check/summary', // 质量报告
            getReportRuleTrend: HTTP_BASE_URL + '/service-qa/api/check/rule/detail', // 规则趋势
            getReportSystemSummary: HTTP_BASE_URL + '/service-qa/api/check/system/summary',
            getReportCheckDate: HTTP_BASE_URL + '/service-qa/api/check/date', // 质量报告时间数据获取

            checkRuleTree: HTTP_BASE_URL + '/quantchiAPI/api/commontree/getTree', // 检核依据值获取
            getMetadataTreeForRule: HTTP_BASE_URL + '/service-qa/rule/getMetadataTreeForRule',

            // 新-检核业务规则接口
            bizRuleSearch: HTTP_BASE_URL + '/service-qa/bizRule/search',
            bizRuleToggleStatus: HTTP_BASE_URL + '/service-qa/bizRule/toggleStatus',
            bizRuleDelete: HTTP_BASE_URL + '/service-qa/bizRule/delete',
            baseconfig: HTTP_BASE_URL + '/quantchiAPI/api/baseconfig/listByGroup',
            getBizRuleById: HTTP_BASE_URL + '/service-qa/bizRule/getById',
            bizRuleSaveOrEdit: HTTP_BASE_URL + '/service-qa/bizRule/saveOrEdit',
            databaseList: HTTP_BASE_URL + '/quantchiAPI/api/metadata/database/list',
            listAllDatasourceData: HTTP_BASE_URL + '/quantchiAPI/api/metadata/listAllDatasourceData',
            listAllDatabaseDataByDatasourceId: HTTP_BASE_URL + '/quantchiAPI/api/metadata/listAllDatabaseDataByDatasourceId',

            techRuleList: HTTP_BASE_URL + '/service-qa/rule/search',
            deleteRuleList: HTTP_BASE_URL + '/service-qa/rule/delete',
            getTechRuleById: HTTP_BASE_URL + '/service-qa/rule/getTechRuleById',
            createTechRule: HTTP_BASE_URL + '/service-qa/rule/batchSave',
            updateTechRule: HTTP_BASE_URL + '/service-qa/rule/updateTechRule',
            searchColumnField: HTTP_BASE_URL + '/quantchiAPI/api/metadata/field/searchColumnField',
            toSql: HTTP_BASE_URL + '/service-qa/rule/toSql',
            checkExpression: HTTP_BASE_URL + '/service-qa/rule/checkExpression',
            getDatasourceCondition: HTTP_BASE_URL + '/service-qa/rule/getDatasourceCondition',
            getDatabaseCondition: HTTP_BASE_URL + '/service-qa/rule/getDatabaseCondition',

            bizTypeList: HTTP_BASE_URL + '/service-qa/bizType/list',
            bizTypeSaveOrEdit: HTTP_BASE_URL + '/service-qa/bizType/saveOrEdit',
            bizTypeDelete: HTTP_BASE_URL + '/service-qa/bizType/delete',
            bizTypeReorder: HTTP_BASE_URL + '/service-qa/bizType/reorder',
            getQaTaskList: HTTP_BASE_URL + '/service-task/task/getQaTaskList',
            getTaskExecutorList: HTTP_BASE_URL + '/service-task/task/getTaskExecutorList',
            getQaTaskExeRuleList: HTTP_BASE_URL + '/service-task/task/getQaTaskExeRuleList',
            getManagerListByTableId: HTTP_BASE_URL + '/service-qa/task/getManagerListByTableId',
            getTablePartitionSearchCondition: HTTP_BASE_URL + '/quantchiAPI/api/metadata/table/getTablePartitionSearchCondition',
            dateColumns: HTTP_BASE_URL + '/service-qa/rule/dateColumns',
            ruleToggleStatus: HTTP_BASE_URL + '/service-qa/rule/toggleStatus',
            periodExample: HTTP_BASE_URL + '/service-qa/rule/periodExample',
            producePeriodFunc: HTTP_BASE_URL + '/service-qa/rule/producePeriodFunc',

            resultList: HTTP_BASE_URL + '/service-qa/result/list',
            getCheckResultList: HTTP_BASE_URL + '/service-qa/result/getCheckResultList',
            getCheckResultItemList: HTTP_BASE_URL + '/service-qa/result/getCheckResultItemList',
            getResultSearchCondition: HTTP_BASE_URL + '/service-qa/result/getSearchCondition',
            getCheckResultById: HTTP_BASE_URL + '/service-qa/result/getCheckResultById',
            getSearchCondition4CheckResultList: HTTP_BASE_URL + '/service-qa/result/getSearchCondition4CheckResultList',

            getCheckHistoryItemList: HTTP_BASE_URL + '/service-qa/result/getCheckHistoryItemList',
            getCheckHistoryStatisticsData: HTTP_BASE_URL + '/service-qa/result/getCheckHistoryStatisticsData',

            queryBizRuleGroup: HTTP_BASE_URL + '/service-qa/bizRule/queryBizRuleGroup', // 业务规则分类查询
            saveBizRuleGroup: HTTP_BASE_URL + '/service-qa/bizRule/saveBizRuleGroup', // 创建业务规则分类
            updateBizRuleGroupName: HTTP_BASE_URL + '/service-qa/bizRule/updateBizRuleGroupName', // 更新业务规则分类
            deleteBizRuleGroup: HTTP_BASE_URL + '/service-qa/bizRule/deleteBizRuleGroup', // 删除业务规则分类

            taskGroupList: HTTP_BASE_URL + '/service-qa/taskGroup/list', // 检核任务组列表
            createTaskGroup: HTTP_BASE_URL + '/service-qa/taskGroup/create', // 新增检核任务组
            updateTaskGroup: HTTP_BASE_URL + '/service-qa/taskGroup/update', // 修改检核任务组
            deleteTaskGroup: HTTP_BASE_URL + '/service-qa/taskGroup/delete', // 删除检核任务组
            taskGroupDetail: HTTP_BASE_URL + '/service-qa/taskGroup/detail', // 检核任务组列表
            runJobNow: HTTP_BASE_URL + '/service-task/taskJob/runJobNow', // 检核任务手动执行
            searchTables: HTTP_BASE_URL + '/service-qa/result/searchTables', // 检核任务手动执行
            changeTaskGroupStatus: HTTP_BASE_URL + '/service-qa/taskGroup/changeTaskGroupStatus', // 更改检核任务的状态
            taskGroupTableList: HTTP_BASE_URL + '/service-qa/taskGroup/tableList', // 条件查询检核任务中的表(左边)
            addTableToTaskGroup: HTTP_BASE_URL + '/service-qa/taskGroup/addTableToTaskGroup', // 添加检核表
            removeTableFromTaskGroup: HTTP_BASE_URL + '/service-qa/taskGroup/removeTableFromTaskGroup', // 删除检核表
            updateTableInfo: HTTP_BASE_URL + '/service-qa/taskGroup/updateTableInfo', // 更新检核表
            changeTableStatus: HTTP_BASE_URL + '/service-qa/taskGroup/changeTableStatus', // 更改检核表的状态
            changeTechRuleStatus: HTTP_BASE_URL + '/service-qa/taskGroup/changeTechRuleStatus', // 更改检核技术规则的状态
            batchRunTest: HTTP_BASE_URL + '/service-qa/taskGroup/batchRunTest', // 技术规则批量试跑
            changeTableFocusState: HTTP_BASE_URL + '/service-qa/taskGroup/changeTableFocusState', // 变更表的关注状态
            queryCheckRangeList: HTTP_BASE_URL + '/service-qa/result/queryCheckRangeList', // 查询检核范围列表
            queryTableSource: HTTP_BASE_URL + '/service-qa/result/queryTableSource', // 表路径选择

            queryExecRecords: HTTP_BASE_URL + '/service-qa/result/queryExecRecords', // 条件查询检核执行记录
            queryExecInfoDetail: HTTP_BASE_URL + '/service-qa/result/queryExecInfoDetail', // 条件查询检核执行记录

            getColumnByTableId: HTTP_BASE_URL + '/quantchiAPI/api/metadata/field/getColumnByTableId', //
            queryLatestRecords: HTTP_BASE_URL + '/service-qa/result/queryLatestRecords', // 技术规则检核结果最新记录列表
            queryWrongRecord: HTTP_BASE_URL + '/service-qa/result/queryWrongRecord', // 检核结果-失败
            queryHistoryRecords: HTTP_BASE_URL + '/service-qa/result/queryHistoryRecords', // 条件搜索检核结果历史记录列表
            queryHistoryRecordDetails: HTTP_BASE_URL + '/service-qa/result/queryHistoryRecordDetails', // 技术规则检核结果历史-查看结果
            queryTableRecordsDetail: HTTP_BASE_URL + '/service-qa/result/queryTableRecordsDetail',
            queryRuleOverview: HTTP_BASE_URL + '/service-qa/result/queryRuleOverview', // 查询技术规则数量及错误数信息
        },
        dimension: {
            list: HTTP_BASE_URL + '/quantchiAPI/api/dimension', // 维度列表
            addEdit: HTTP_BASE_URL + '/quantchiAPI/api/dimension', // 维度添加修改接口
            delDomain: HTTP_BASE_URL + '/quantchiAPI/api/dimension/delete', // 删除维度
            dimensionDomain: HTTP_BASE_URL + '/quantchiAPI/api/dimension/domain', // 维度主题
            standardDomain: HTTP_BASE_URL + '/quantchiAPI/api/dimension/standard', // 维度列接口
            dimensionCategory: HTTP_BASE_URL + '/quantchiAPI/api/dimension/domain/category', // 维度类别
            dimensionValue: HTTP_BASE_URL + '/quantchiAPI/api/dimension/value',
            standardCode: HTTP_BASE_URL + '/quantchiAPI/api/standard/code',
        },
        common: {
            selectOption: HTTP_BASE_URL + '/quantchiAPI/api/option/', // 请求下拉框数据
        },
        globalsearch: {
            searchConditionSelect: HTTP_BASE_URL + '/quantchiAPI/api/metadata/advanceSearch/category', // 全局搜索 下拉框条件获取
            globalSearch: HTTP_BASE_URL + '/quantchiAPI/api/metadata/advanceSearch', // 获取全局搜索结果
            quickTip: HTTP_BASE_URL + '/quantchiAPI/api/search/quickTip', // 键盘精灵接口
            export: HTTP_BASE_URL + '/quantchiAPI/api/metadata/advanceSearch/export', // 导出接口
            exportAll: HTTP_BASE_URL + '/quantchiAPI/api/metadata/advanceSearch/exportAll', // exportAllSearchData
            getFilterBoxData: HTTP_BASE_URL + '/quantchiAPI/api/metadata/advanceSearch/getFilterBoxData', // 获取筛选内容和筛选搜索接口
            config: HTTP_BASE_URL + '/quantchiAPI/api/metadata/advanceSearch/table/config', // 获取表头接口
        },
        modelManage: {
            getSnowflakeModel: HTTP_BASE_URL + '/quantchiAPI/api/model/getSnowflakeModel', // 请求下拉框数据
            getTableRelation: HTTP_BASE_URL + '/quantchiAPI/api/model/getTableRelation', // 表关联关系
            delTableRelation: HTTP_BASE_URL + '/quantchiAPI/api/model/deleteTableRelation', // 删除表关联关系
            addRelation: HTTP_BASE_URL + '/quantchiAPI/api/model/insertTableRelation',
            relationTableFiltrate: HTTP_BASE_URL + '/quantchiAPI/api/model/relationTableFiltrate', // 表中文名、英文名搜索
            getBusiness: HTTP_BASE_URL + '/quantchiAPI/api/business/getBusiness',
            deleteBusiness: HTTP_BASE_URL + '/quantchiAPI/api/business/deleteBusiness',
            insertBusiness: HTTP_BASE_URL + '/quantchiAPI/api/business/insertBusiness',
            insertBusinessRelation: HTTP_BASE_URL + '/quantchiAPI/api/business/insertBusinessRelation', // 添加业务和表的关联关系
            deleteBusinessRelation: HTTP_BASE_URL + '/quantchiAPI/api/business/deleteBusinessRelation', // 删除业务和表的关联关系
            getBusinessRelation: HTTP_BASE_URL + '/quantchiAPI/api/business/getBusinessRelation', // 查询业务和表的关联关系
            editTable: HTTP_BASE_URL + '/quantchiAPI/api/metadata/table/editTable', // 修改表属性或者添加表属性（后端通过id区分是添加还是更新）
            snowflakeTableFiltrate: HTTP_BASE_URL + '/quantchiAPI/api/model/snowflakeTableFiltrate', // 模型管理页面键盘精灵表中文名、英文名搜索
            addModel: HTTP_BASE_URL + '/quantchiAPI/api/model/v2', // 创建模型
            deleteModel: HTTP_BASE_URL + '/quantchiAPI/api/model/v2/delete', // 删除模型
            checkModelName: HTTP_BASE_URL + '/quantchiAPI/api/model/v2/checkModelName', // 模型名称检查
            advSearch: HTTP_BASE_URL + '/quantchiAPI/api/model/v2/advSearch', // 模型表搜索
            advSearchGroup: HTTP_BASE_URL + '/quantchiAPI/api/model/v2/advSearchGroup', // 模型表搜索分组
            checkModel: HTTP_BASE_URL + '/quantchiAPI/api/model/v2/check', // 模型表检查
            getSnowflakeModelV2: HTTP_BASE_URL + '/quantchiAPI/api/model/v2/getSnowflakeModel', // 数据源模型数据接口新的
            getRelation: HTTP_BASE_URL + '/quantchiAPI/api/model/v2/relation', // 获取模型关系列表
            deleteRelation: HTTP_BASE_URL + '/quantchiAPI/api/model/v2/relation/delete', // 删除模型表关系
            govColumns: HTTP_BASE_URL + '/quantchiAPI/api/model/v2/govColumns/', // 获取表已治理的字段
            getDetailTableList: HTTP_BASE_URL + '/quantchiAPI/api/model/v2/table', // 获取模型表详情列表
            getDetailTableColumnList: HTTP_BASE_URL + '/quantchiAPI/api/model/v2/table/column', // 获取模型表下字段列表
            modelTableDomain: HTTP_BASE_URL + '/quantchiAPI/api/business/modelTable/domain', // 获取模型表信息设置主体表
            modelTableFact: HTTP_BASE_URL + '/quantchiAPI/api/business/modelTable/fact', //  获取模型表信息设置事实表
            modelTableFull: HTTP_BASE_URL + '/quantchiAPI/api/business/modelTable', // 获取模型表信息设置全部表
            business: HTTP_BASE_URL + '/quantchiAPI/api/business', // 查询业务
            businessDelete: HTTP_BASE_URL + '/quantchiAPI/api/business/delete',
            modelTableColumn: HTTP_BASE_URL + '/quantchiAPI/api/business/modelTable/column',
            modelIndex: HTTP_BASE_URL + '/quantchiAPI/api/business/model/index',
            modelUsage: HTTP_BASE_URL + '/quantchiAPI/api/model/v2/usage',
            modelRelation: HTTP_BASE_URL + '/quantchiAPI/api/metadata/stat/relation',
        },
        tagManage: {
            bizObjectRecord: HTTP_BASE_URL + '/quantchiAPI/api/stat/system/bizObjectRecord', // 获取列表信息
            leftTreeFromApp: HTTP_BASE_URL + '/quantchiAPI/api/leftTreeFromApp', // 获取左侧树
            baseTableRecord: HTTP_BASE_URL + '/quantchiAPI/api/stat/database/tableRecord', // 数据库下扁平化表信息
            sourceTableRecord: HTTP_BASE_URL + '/quantchiAPI/api/stat/datasource/tableRecord', // 数据源下扁平化表信息
            systemTableRecord: HTTP_BASE_URL + '/quantchiAPI/api/stat/system/tableRecord', // 数据源下扁平化表信息
            untaggle: HTTP_BASE_URL + '/quantchiAPI/api/untaggle', // 删除标签对象的标签值
            taggleTagObject: HTTP_BASE_URL + '/quantchiAPI/api/taggleTagObject', // 添加标签值
            createTag: HTTP_BASE_URL + '/quantchiAPI/api/tagType/value', // 创建标签值
            allTagValue: HTTP_BASE_URL + '/quantchiAPI/api/stat/allTagValue', // 查询当前域中可添加的标签值
            deleteableTagValue: HTTP_BASE_URL + '/quantchiAPI/api/stat/deleteableTagValue', // 查询当前域中可删除的标签值,
            tagTypeAppliableScene: HTTP_BASE_URL + '/quantchiAPI/api/tagTypeAppliableScene', // 标签应用场景
            tagTypeManagementTree: HTTP_BASE_URL + '/quantchiAPI/api/tagTypeManagementTree', // 标签类型
            saveTagType: HTTP_BASE_URL + '/quantchiAPI/api/tagType', // 标签类型添加
            tagValueApi: HTTP_BASE_URL + '/quantchiAPI/api/tagType/', // 标签相关 API // /quantchiAPI/api/tagType/{tagTypeId}/tagValues
            tagModify: HTTP_BASE_URL + '/quantchiAPI/api/tagType/value/modify', // 标签修改
        },
        login: {
            loadPageCasLogin: HTTP_BASE_URL + '/quantchiAPI/loadPage/user',
        },
        dataWarehouse: {
            fullchainOverviewStat: HTTP_BASE_URL + '/quantchiAPI/api/dataWarehouse/fullchainOverviewStat', // 全链概览统计数
            isolatedTable: HTTP_BASE_URL + '/quantchiAPI/api/dataWarehouse/isolatedTable', // 孤立表
            getSourceTrackTaskJob: HTTP_BASE_URL + '/service-task/taskJob/getSourceTrackTaskJob', // 获取标签溯源任务列表
            saveSourceTrackJob: HTTP_BASE_URL + '/service-task/taskJob/saveSourceTrackJob', // 保存标签溯源任务列表
            noBizTagTable: HTTP_BASE_URL + '/quantchiAPI/api/dataWarehouse/noBizTagTable', // 无业务标签表
            noHierrachyTagTable: HTTP_BASE_URL + '/quantchiAPI/api/dataWarehouse/noHierrachyTagTable', // 无分级标签表
            noSourceFromTable: HTTP_BASE_URL + '/quantchiAPI/api/dataWarehouse/noSourceFromTable', // 无来向表
            noTargetToTable: HTTP_BASE_URL + '/quantchiAPI/api/dataWarehouse/noTargetToTable', // 无去向表
            sourceTraceOverviewStat: HTTP_BASE_URL + '/quantchiAPI/api/dataWarehouse/sourceTraceOverviewStat', // 溯源概览统计数
            dbModelRelationList: HTTP_BASE_URL + '/quantchiAPI/api/dataWarehouse/dbModelRelationList', // 库模型关系列表
            dbModelList: HTTP_BASE_URL + '/quantchiAPI/api/dataWarehouse/dbModelList', // 库模型列表
            dbModelRelationGraph: HTTP_BASE_URL + '/quantchiAPI/api/dataWarehouse/dbModelRelationGraph', // 库模型图示
            saveInferenceJob: HTTP_BASE_URL + '/service-task/taskJob/saveInferenceJob', // 保存关系推理任务列表
            getInferenceTaskJob: HTTP_BASE_URL + '/service-task/taskJob/getInferenceTaskJob', // 获取关系推理任务列表
            tableSearch: HTTP_BASE_URL + '/quantchiAPI/api/dataWarehouse/table/search', // 表名筛选
            dbModelIsolatedTable: HTTP_BASE_URL + '/quantchiAPI/api/dataWarehouse/dbModelIsolatedTable', // 库模型孤立表
            deleteRelation: HTTP_BASE_URL + '/quantchiAPI/api/dataWarehouse/deleteRelation', // 删除关联关系
            needRelationInference: HTTP_BASE_URL + '/quantchiAPI/api/dataWarehouse/needRelationInference', // 判断是否需要关系推理
            appModelList: HTTP_BASE_URL + '/quantchiAPI/api/dataWarehouse/appModelList', // 应用模型列表
            appModelRelationList: HTTP_BASE_URL + '/quantchiAPI/api/dataWarehouse/appModelRelationList', // 应用模型关系列表
            appModelModify: HTTP_BASE_URL + '/quantchiAPI/api/dataWarehouse/appModelModify', // 应用模型修改
            appModelReference: HTTP_BASE_URL + '/quantchiAPI/api/dataWarehouse/appModelReference', // 应用模型引用
            appModelRelationGraph: HTTP_BASE_URL + '/quantchiAPI/api/dataWarehouse/appModelRelationGraph', // 应用模型图示
            appModelOverview: HTTP_BASE_URL + '/quantchiAPI/api/dataWarehouse/appModelOverview', // 应用模型概览数据
            diffDetailTable: HTTP_BASE_URL + '/quantchiAPI/api/diffDetail/table', // 元数据版本变更对数仓的表级影响详情
            diffDetailColumn: HTTP_BASE_URL + '/quantchiAPI/api/diffDetail/column', // 元数据版本变更对数仓的字段级影响详情
            diffDetailItem: HTTP_BASE_URL + '/quantchiAPI/api/diffDetail/item/', // 详情页面(源|目标)—(源|库|表|字段)的搜索接口
            diffDetailLineages: HTTP_BASE_URL + '/quantchiAPI/api/diffDetail/lineages', // 影响详情页面的影响血缘列表
            diffDetailLineagesSelects: HTTP_BASE_URL + '/quantchiAPI/api/diffDetail/lineages/', // 影响血缘列表的(源|目标)—(源|库|表|字段)的搜索接口
            diffDetailDownload: HTTP_BASE_URL + '/quantchiAPI/api/diffDetail/download', // 变更导出
            diffDetailLineagesDownload: HTTP_BASE_URL + '/quantchiAPI/api/diffDetail/lineages/download', // 影响分析变更导出
            inferenceMaindata: HTTP_BASE_URL + '/quantchiAPI/api/inference/maindata', // 主数据推理列表
            inferenceMaindataLastInferenceTime: HTTP_BASE_URL + '/quantchiAPI/api/inference/maindata/lastInferenceTime',
            inferenceMaindataAddByTableIds: HTTP_BASE_URL + '/quantchiAPI/api/inference/maindata/addByTableIds', // 新增主数据推理记录
            inferenceMaindataCanAddTables: HTTP_BASE_URL + '/quantchiAPI/api/inference/maindata/canAddTables', // 可添加的表
            inferenceMaindataModifyColumn: HTTP_BASE_URL + '/quantchiAPI/api/inference/maindata/modifyColumn', // 修改绑定字段
            inferenceMaindataOperation: HTTP_BASE_URL + '/quantchiAPI/api/inference/maindata/operation', // 操作主数据推理记录
            searchField: HTTP_BASE_URL + '/quantchiAPI/api/metadata/field/searchField', //  字段搜索接口
            inferenceMaindataNotConfirmNumber: HTTP_BASE_URL + '/quantchiAPI/api/inference/maindata/notConfirmNumber', // 未确认数量

            getCodeItemTaskJob: HTTP_BASE_URL + '/service-task/taskJob/getCodeItemTaskJob', // 码值推理记录
            saveCodeItemJob: HTTP_BASE_URL + '/service-task/taskJob/saveCodeItemJob', // 保存代码项推理任务
            rcolumncode: HTTP_BASE_URL + '/quantchiAPI/api/inference/rcolumncode', // 代码项推理列表
            canAddColumn: HTTP_BASE_URL + '/quantchiAPI/api/inference/rcolumncode/canAddColumn', // 可添加的字段
            notConfirmNumber: HTTP_BASE_URL + '/quantchiAPI/api/inference/rcolumncode/notConfirmNumber', // 未确认数量
            lastInferenceTime: HTTP_BASE_URL + '/quantchiAPI/api/inference/rcolumncode/lastInferenceTime', // 获取最近推理时间
            addByColumnIds: HTTP_BASE_URL + '/quantchiAPI/api/inference/rcolumncode/addByColumnIds', // 新增代码项推理逻辑
            operation: HTTP_BASE_URL + '/quantchiAPI/api/inference/rcolumncode/operation', // 操作代码项推理记录
            rcolumncodeDetail: HTTP_BASE_URL + '/quantchiAPI/api/inference/rcolumncode', // 代码项推理详情
            codeItem: HTTP_BASE_URL + '/quantchiAPI/api/metadata/codeItem', // 获取代码项列表
            modifyCode: HTTP_BASE_URL + '/quantchiAPI/api/inference/rcolumncode/modifyCode', // 修改绑定代码项
            addCodeItem: HTTP_BASE_URL + '/quantchiAPI/api/metadata/codeItem', // 新增/修改代码项
            codeItemNameExist: HTTP_BASE_URL + '/quantchiAPI/api/metadata/codeItemNameExist', // 代码项名称是否存在
            codeItemDetail: HTTP_BASE_URL + '/quantchiAPI/api/metadata/codeItem', // 根据ID获取代码项
            deleteCodeItem: HTTP_BASE_URL + '/quantchiAPI/api/metadata/codeItemRef/delete', // 解除代码项绑定
            tablePartitionStats: HTTP_BASE_URL + '/quantchiAPI/api/metadata/table/tablePartitionStats', // 分区表统计数
            tablePartitionOverview: HTTP_BASE_URL + '/quantchiAPI/api/metadata/table/tablePartitionOverview', // 分区信息概览
            tablePartitionItem: HTTP_BASE_URL + '/quantchiAPI/api/metadata/table/tablePartitionItem', // 分区列表
            tableListForPartition: HTTP_BASE_URL + '/quantchiAPI/api/metadata/table/tableListForPartition', // 不同类型分区表统计列表
            editConfigureOfTablePartition: HTTP_BASE_URL + '/quantchiAPI/api/metadata/table/editConfigureOfTablePartition', // 修改分区配置内容
            ignoreProblems: HTTP_BASE_URL + '/quantchiAPI/api/metadata/table/ignoreProblems', // 选择要忽略的问题
            queryConfigureOfTablePartition: HTTP_BASE_URL + '/quantchiAPI/api/metadata/table/queryConfigureOfTablePartition', // 查看分区配置内容
            partitionKeyFormat: HTTP_BASE_URL + '/quantchiAPI/api/metadata/table/partitionKeyFormat', // 查看分区键格式

            chineaseName: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/statistic/chineaseName', // 中文信息完整度
            columnMapStandard: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/statistic/columnMapStandard', // 字段对标统计
            columnMatchStandard: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/statistic/columnMatchStandard', // 字段落标统计
            dwLevelInfoStatistic: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/statistic/dwLevelInfo', // 数仓建设规范性评估
            nameSpecification: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/statistic/nameSpecification', // 数仓命名规范统计
            metadataAndLineage: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/statistic/metadataAndLineage', // 元数据及血缘统计

            initializeProgress: HTTP_BASE_URL + '/quantchiAPI/api/system/initialize/progress', // 系统初始化进度信息
            initializeNextStep: HTTP_BASE_URL + '/quantchiAPI/api/system/initialize/nextStep', // 进入下一步
        },
        solrManage: {
            searchTableByKeyword: HTTP_BASE_URL + '/dmp-sync/api/solrData/searchTableByKeyword', // 查询同步任务列表
            searchBusinessByKeyword: HTTP_BASE_URL + '/dmp-sync/api/solrData/searchBusinessByKeyword', // 查询同步任务列表
            getSyncTaskInfo: HTTP_BASE_URL + '/dmp-sync/api/syncManage/getSyncTaskInfo', // 查询单个任务
            createSyncTask: HTTP_BASE_URL + '/dmp-sync/api/syncManage/createSyncTask', // 创建同步任务
            getSyncTaskList: HTTP_BASE_URL + '/dmp-sync/api/syncManage/getSyncTaskList', // 查询同步任务列表
            getSyncTaskDetailList: HTTP_BASE_URL + '/dmp-sync/api/syncManage/getSyncTaskDetailList', // 查询同步任务明细
            changeSyncTaskStatus: HTTP_BASE_URL + '/dmp-sync/api/syncManage/changeSyncTaskStatus', // 更新任务状态
            quickTip: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/search/quickTip', // 键盘精灵接口
            getSyncDiscoverResult: HTTP_BASE_URL + '/dmp-sync/api/syncManage/getSyncDiscoverResult', // 一致性检测结果获取
            doSyncDiscover: HTTP_BASE_URL + '/dmp-sync/api/syncManage/doSyncDiscover', // 执行一致性检测
        },
        dataAsset: {
            getDataSetDetial: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataset/detail', // 请求数据集详情
            getDataSetColumn: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataset/column', // 请求数据集详情
            datasetSearch: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataset/search', // 数据集搜索
            categoriesFirst: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataset/categories/first', // 一级业务列表
            categoriesAll: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataset/categories/all', // 业务类别树
            cartList: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataset/cart/list', // 购物车列表
            cartAdd: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataset/cart/add', //  添加数据集至购物
            cartSelect: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataset/cart/select', // 购物车内个人选中记录
            cartUse: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataset/cart/use', // 数据集使用接口
            cartDelete: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataset/cart/delete', // 购物车内删除
            favoritesList: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataset/favorites/list', // 收藏夹列表
            favoritesAdd: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataset/favorites/add', // 添加至收藏夹
            favoritesDelete: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataset/favorites/delete', // 收藏夹删除
            getDataSetPreview: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataset/preview', // 请求数据集详情表格preview
            adminSearch: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataset/admin/search', // 请求数据集后台搜索数据
            adminPublish: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataset/admin/publish', // 数据集发布
            adminCancel: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataset/admin/cancel', // 数据集取消发布
            hotSearch: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataset/hotword', // 数据集推荐热搜
            relatedSearch: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataset/related', // 相关数据集
            getDataSetTable: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataset/table', // 获取数据集表列表
            editDataSet: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataset/admin/modify', // 数据集修改
            getDataAssetTable: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/metadata/table/listTableByDatabaseId/notInDataset', // 获取雪花模型添加第一步下拉列表
            getSnowflakeMode: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataset/getSnowflakeModel', // 获取雪花模型
            deleteTableRelaton: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataset/admin/deleteTable', // 删除表关系

            dataAssetSearch: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataassets/search', // 资产搜索
            wareAssetSearch: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/search', // 数仓搜索
            datamanager: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager', // 我的资产
            addToMyAssets: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataassets/addToMyAssets', // 加入我的资产
            recommendModel: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataassets/recommendModel', // 获取推荐模型
            removeFromMyAssets: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataassets/removeFromMyAssets/', // 从我的资产移除
            assetTree: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataassets/search/tree', // 搜索目录树
            wareAssetTree: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/search/tree', // 搜索数仓目录树
            assetSelected: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/selected', // 选中/取消选中
            sharedWith: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/sharedWith', // 共享对象列表
            shareData: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/share', // 共享业务
            classTree: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/classTree', // 业务分类树
            assetDetail: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/detail', // 获取业务线详情
            saveAsset: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/save', // 业务线数据保存
            allTags: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/allTags', // 业务标签列表
            tagFilter: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dataassets/search/tagFilter', // 标签过滤器
            wareTagFilter: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/search/filters', // 数仓标签过滤器
            configComplete: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/configComplete/', // 配置完成接口
            mainData: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/mainData', // 获取主数据列表
            codeItem: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/codeItem', // 获取代码项列表
            sync: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/sync/', // 同步物理信息

            relationGraph: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/relation/graph', // 获取业务线的关系图

            suggestDataset: HTTP_BASE_URL + '/quantchiAPI/api/suggestDataset', // 推荐数据集

            materializeInfo: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/materialize/info', // 获取物化表信息
            executeDdl: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/materialize/executeDdl', // 创建物化表
            previewDdl: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/materialize/previewDdl', // 预览物化表建表语句
            schedule: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/materialize/schedule', // 获取物化表的调度周期
            metricsLineage: HTTP_BASE_URL + '/quantchiAPI/api/metrics/lineage', // 指标血缘
            columnCheckDetail: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/columnCheckDetail', // 字段检核表
            dataAssetLineage: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/lineage', // 数据集血缘
            reportsCheckDetail: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/column/checkDetail', // 字段检核详情

            standardTree: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dstemplate/standardTree', // 获取数据集模板的标准树
            saveDstemplate: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dstemplate/save', // 保存数据集模板（增/改）
            dstemplateDetail: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/dstemplate/detail', // 获取数据模板详情
            standardByParam: HTTP_BASE_URL + '/quantchiAPI/api/standard/byParam', // 标准列表 新

            docmanager: HTTP_BASE_URL + '/quantchiAPI/api/docmanager', // 文档列表
            deleteDocmanager: HTTP_BASE_URL + '/quantchiAPI/api/docmanager/delete', // 删除文档
            updateDocmanager: HTTP_BASE_URL + '/quantchiAPI/api/docmanager/update', // 更新文档信息
            uploadDocmanager: HTTP_BASE_URL + '/quantchiAPI/api/docmanager/upload', // 上传文档
            downloadDocmanager: HTTP_BASE_URL + '/quantchiAPI/api/docmanager/download', // 下载文档
            attachment: HTTP_BASE_URL + '/quantchiAPI/api/docmanager/attachment', // 附件列表
            recordDocmanager: HTTP_BASE_URL + '/quantchiAPI/api/docmanager/record', // 操作记录列表
            docmanagerDeleteTreeNode: HTTP_BASE_URL + '/quantchiAPI/api/docmanager/deleteTreeNode', // 删除文档树节点
            sysBasic: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/table', // 系统表的基础信息
            sysBasicOverview: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/table/overview', // 系统表的基础统计信息
            getSysColumn: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/table/column/normal', // 系统表的普通字段信息
            getSysPartitionColumn: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/table/column/partition', // 系统表的分区字段信息
            getBloodScript: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/table/lineageFiles', // 系统表的使用血缘脚本
            getBloodHot: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/table/column/usage/detail', // 系统表的使用血缘脚本热度
            getRelation: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/table/relations', // 系统表的关联关系
            getSqlBasic: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/lineage/file', // sql的基本信息
            getReportBasic: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/report', // 报表基本信息
            getBloodTable: HTTP_BASE_URL + '/quantchiAPI/api/lineage/graph/report/table', // 物理表关联表信息
            getRelationTable: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/table/relation/report', // 报表血缘表
            getRecord: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/lineage/file/usedRecord', // sql的使用记录
            getTableFilters: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/table/lineage/tableFilters', // 表血缘中过滤的表
            getLineageColumnFilters: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/table/column/lineage/columns', // 表血缘中过滤的字段
            getTableLineage: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/table/lineage', // 表血缘
            getColumnLineageColumns: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/table/column/lineage/columns', // 字段血缘的可选字段
            getColumnLineage: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/table/column/lineage', // 字段血缘表
            getSqlLineage: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/lineage/file/lineage', // 获取文件的血缘
            getTraceabilityDatabase: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/traceability/database', // 数仓库
            getTraceabilityTable: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/traceability/table', // 数仓表
            getTraceabilityColumn: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/traceability/column', // 数仓字段
            getResultTableList: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/traceability/table/sheet', // 表溯源-表
            getResultColumnList: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/traceability/column/sheet', // 字段溯源-表
            getTableGraph: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/traceability/table/graph', // 表溯源-图
            getColumnGraph: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/traceability/column/graph', // 字段溯源-图
            getDwLevel: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/level', // 所有数仓层次信息
            getTableLevel: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/traceability/table/levels', // 表溯源-层级
            getColumnLevel: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/traceability/column/levels', // 字段溯源-层级
            getTableDown: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/traceability/table/sheet/download', // 表溯源-下载
            getColumnDown: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/traceability/column/sheet/download', // 字段溯源-层级

            foreignRelation: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/table/foreign/relation/', // 分页查询表字段主外键关联关系
        },
        eastReport: {
            upload: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/east/file/upload', // 文件上传
            fileDetail: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/east/file/detail', // 文件上传详情
            fileRecord: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/east/file/record', // 文件上传记录
            eastList: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/east/all', // 获取EAST列表
            eastClassNames: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/east/classNames', // 所有分类名称
            dataQuality: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/east/dataQuality', // 获取EAST下的检核规则状态
            dataSpecification: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/east/dataSpecification', // 获取EAST下的数据规范
            eastDetail: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/east/detail', // 获取EAST详情
            downloadErrorCheck: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/east/downloadErrorCheck', // 下载
            eastRecheck: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/east/recheck', // 重新检核

            eastColumn: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/east/column', // East下的所有字段信息
            east: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/east', // 修改East信息
        },
        reportActive: {
            activeList: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/active/list', // 报表激活列表
            statistic: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/active/statistic', // 获取报表激活统计信息
            lastOptReports: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/active/lastOptReports', // 用户上次操作的报表(返回可能为空)
            enterActive: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/active/enter', // 用户进入激活界面
            activeViews: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/active/views', // 获取报表下的视图信息
            activeMetrics: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/active/metrics', // 获取报表下的指标
            activeSearch: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/active/search', // 搜索
            match: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/active/search/match', // 节点匹配
            quickTip: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/active/search/quickTip', // 键盘精灵
            saveMtrics: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/active/metrics/save', // 保存指标口径
            bindViews: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/active/views/bind', // 视图绑定数据集
            saveSqlTable: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/active/sqltable/save', // 创建数据集
            deleteMetrics: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/active/metrics', // 解绑报表与指标
            clearQuery: HTTP_BASE_URL + '/quantchiAPI/api/metrics/clearQuery', // clearMetricsQueryInfo
            changeReport: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/', // 修改报表信息(包括字段信息)
            externalTag: HTTP_BASE_URL + '/quantchiAPI/api/reports/external/tag', // 为报表打标签
        },
        keywordSearch: {
            getkewordsearchData: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/kewordsearch/data', // 数据管理列表
            uploadFile: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/kewordsearch/data/uploadFile', // 数据管理列表
            checkFileName: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/kewordsearch/data/uploadFile/checkFileName', // 上传校验
            creatTableWithColumn: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/kewordsearch/data/creatTableWithColumn', // 字段类型配置提交
            columnSetting: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/setting', // 数据配置列表
            preview: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/preview', // 数据配置列表
            downloadError: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/kewordsearch/data/error', // 数据配置列表
            search: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/keywordsearch/search', // 搜索结果
            match: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/keywordsearch/match', // 搜索结果
            searchDetail: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/keywordsearch/detail', // 明细
            inspector: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/keywordsearch/search/inspector', // inspector
            aggregation: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/keywordsearch/aggregation', // 聚合接口
            getBusiness: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/keywordsearch/business', // 查询业务线及数据集使用记录
            quickTip: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/keywordsearch/search/quickTip', // keywordsearch键盘精灵
            switch: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/keywordsearch/switch', // 图形切换接口
            getMetrics: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/intelquery/metrics/all', // 获取业务线下的内容
            leftQuickTip: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/intelquery/metrics/business/quickTip', // 获取业务线下的内容
            leftQuickTipOld: HTTP_BASE_URL + '/quantchiAPI/iqAPI//api/intelquery/metrics/quickTip', // 老的获取业务线下的内容
            searchMetrics: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/intelquery/metrics/search', // 获取业务线下的内容
            searchMetricsBusiness: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/intelquery/metrics/business', // 获取业务线下的内容
            download: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/keywordsearch/download', // 表格数据下载接口
            indexSample: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/keywordsearch/mainSample', // 首页示例接口
            logSuggestion: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/keywordsearch/logSuggestion', // 记录推荐
            drillIndexList: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/keywordsearch/drillDown/metrics', // 下钻指标列表
            drillDownSearch: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/keywordsearch/drillDown', // 下钻指标列表
            datamanagerCategory: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/category', // 业务线分类接口
            datamanagerBusiness: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager', // 业务线接口
            searchViewAdd: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/view', // 搜索视图添加接口
            searchViewList: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/view/searchview',

            usingBusinessIds: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/usingBusinessIds', // 当前在使用业务线
        },
        dashboard: {
            getBoardList: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/pinboard', // 请求看板列表
            delete: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/pinboard/delete', // 删除看板
            // 'getBoardDetial': HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/pinboard', // 看板详情
            addBoardView: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/pinboard/view/add', // 添加至数据看板
            createBoard: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/pinboard/create', // 增加看板
            boardUpdate: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/pinboard/update', // 编辑看板
            boardAdd: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/pinboard/create', // 增加看板
            getBoardDetial: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/pinboard/one', // 看板详情
            getPinboardFilter: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/pinboard/filter/one', // 获取单个过滤条件详情
            getMetrics: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/pinboard/metrics', // 获取看板所有指标信息
            getMetricsSearch: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/pinboard/metrics/search', // 获取看板所有指标信息
            quickTip: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/pinboard/metrics/quickTip', // 获取看板所有指标信息键盘精灵
            filterCreate: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/pinboard/filter/create', // 创建过滤条件
            filterUpdate: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/pinboard/filter/update', // 更新过滤条件
            filterDelete: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/pinboard/filter/delete', // 删除过滤条件
            viewDelete: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/pinboard/view/delete', // 删除看板视图
            viewInfo: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/pinboard/view/one', // 获取某一视图数据
            viewEdit: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/pinboard/view/update', // 编辑看板视图,
            viewSearchInfo: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/pinboard/view/searchResult', // 视图对应的查询相关信息
            getTableList: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/reports', // 查询报表列表
            duplicate: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/reports/duplicate', // 报表重名校验
            deleteTable: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/reports/delete', // 删除报表
            createTable: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/reports', // 新增/修改报表
            mergeSuggestion: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/reports/mergeColumn/suggestion', // 合并字段推荐
            getPreviewData: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/reports/preview', // 合并预览接口
            getPinBoardView: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/pinboard/view',
            getReportDetail: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/reports/detail', // 报表详情
            getReportContent: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/reports/view/content',
            eTableHead: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/reports/view/tableHead', // 表头信息修改
        },
        addNewCol: {
            addFormula: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/keywordsearch/formula/column', // 新增列保存接口
            formulaFunction: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/keywordsearch/formula/function', // 获取支持的函数清单
            formulaTable: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/keywordsearch/formula/table', // 获取支持的表及表下的字段
            getPartitionRecommend: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/keywordsearch/formula/partitionRecommend', // 获取某字段的推荐分区
            getColumn: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/keywordsearch/formula/column', // 获取某类字段
            getFormula: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/keywordsearch/formula/temporary', // 获取某类字段
            suggestion: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/keywordsearch/formula/suggestion', // 获取推荐
            delFormula: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/keywordsearch/formula/temporary/delete',

            factassetsFormulaLeftTree: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/factassets/formula/leftTree',
            dimassetsFormulaLeftTree: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimassets/formula/leftTree',
            generateFormulaColumn: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/factassets/formula/generateFormulaColumn',
            DimassetsGenerateFormulaColumn: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimassets/formula/generateFormulaColumn',
            columnBeUsed: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/factassets/columnBeUsed',
            dimassetsColumnBeUsed: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/dimassets/columnBeUsed',
        },
        scheduleManage: {
            queryList: HTTP_BASE_URL + '/api/schedule/all', // 新增列保存接口
            sourceList: HTTP_BASE_URL + '/quantchiAPI/api/metadata/datasource/manage',
            addSchedule: HTTP_BASE_URL + '/api/schedule/add',
            getSchedule: HTTP_BASE_URL + '/api/schedule/', // 调度查询接口统称
            checkScheduleCron: HTTP_BASE_URL + '/api/schedule/checkScheduleCron', // 检查表达式是否合法
        },
        createETL: {
            getETLStatus: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager', // 数据集状态
            getETLName: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/etldataset', // 获取etl数据集名称
            saveETLData: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/etldataset/save', // 数据集状态
            getCategoryAndTable: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/etldataset/categoryAndTable', // 获取所有分组和表
            getColumns: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/etldataset/allColumn', // 获取所有字段
            addColumns: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/etldataset/related/column', // 新增相关字段
            getTableAndColumn: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/etldataset/related/tableAndColumn', // 新增相关字段
            delETLdataSet: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/etldataset/related', // 删除字段/表
            quickTip: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/etldataset/related/tableAndColumn/quickTip', // 左侧键盘精灵
            editShowName: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/etldataset/related/column', // 左侧键盘精灵
            getMatchData: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/etldataset/query/match', // 节点匹配
            getSearchData: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/etldataset/query/search', // 节点匹配
            getQuickTip: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/etldataset/query/quickTip', // 节点匹配
            searchView: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/etldataset/view', // 搜索视图，中间结果表
            searchViewList: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/etldataset/view/searchview', // 获取搜索视图
            tableRelation: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/etldataset/related/tableRelation', // 表间关系数据
            etlprocess: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/etldataset/related/table', // 中间过程表获取
            etlRefresh: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/etldataset/refresh', // 刷新中间数据集信息
        },
        createSql: {
            checkEname: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/sqltable/checkEname', // 表英文名校验
            exec: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/sqltable/exec', // 执行Sql(预览数据)
            format: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/sqltable/format', // Sql格式化
            tableInfo: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/sqltable/info', // 获取Sql表信息
            sqlModel: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/sqltable/model', // ER模型
            sqlParse: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/sqltable/parse', // Sql解析接口
            saveSql: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/sqltable/save', // 保存Sql表
            areUsed: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datamanager/areUsed', // 被使用列表
        },
        dataSecurity: {

            getTableData: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/audit/searchLineageColumn',

            datasecuritySearchTree: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/search/tree', // 左侧树信息
            datasecuritySearchFilters: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/search/filters', // 过滤器信息
            datasecuritySearch: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/search', // 搜索数据

            dataSecurityLevelList: HTTP_BASE_URL + '/quantchiAPI/api/baseconfig/securityLevel', // 获取数据安全级别列表
            dsColumnInfoList: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/config/getDsColumnInfoList', // 获取单个配置分类分级列表数据
            saveSingleConfig: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/config/saveSingleConfig', // 保存单个配置数据
            saveTableBatchConfig: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/config/saveTableBatchConfig', // 保存表配置数据
            getDsColumnInfoList: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/config/getDsColumnInfoList', // 获取单个配置分类分级列表数据
            dataSecurityDownload: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/search/download', // 保存单个配置数据

            getDsColumnDetail: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/getDsColumnDetail', // 获取字段最新发布版本和未发布数据
            listColumnHistory: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/listColumnHistory', // 获取字段定版历史列表
            getDsTableDetail: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/getDsTableDetail', // 获取表最新发布版本和未发布数据
            listTableDetailDsData: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/listTableDetailDsData', // 获取表的字段的安全级别数据
            listTableHistory: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/listTableHistory', // 获取表定版历史列表

            searchDsVersion: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/searchDsVersion', // 获取历史版本列表接口
            getFixVersionStatisticsData: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/getFixVersionStatisticsData', // 获取统计信息接口
            queryDsTableClassifyFixVersionData: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/queryDsTableClassifyFixVersionData', // 获取统计信息接口
            queryDsColumnClassifyFixVersionData: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/queryDsColumnClassifyFixVersionData', // 获取统计信息接口
            getSystemInfo: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/getSystemInfo', // 获取历史版本列表接口
            confirmFixVersion: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/confirmFixVersion', // 确认发布接口
            listAllAuditUser: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/listAllAuditUser', // 获取审核人列表接口
            searchActiveDsTableClassifyData: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/searchActiveDsTableClassifyData', // 获取差异明细查询分页数据接口
            confirmAudit: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/confirmAudit', // 确认审核接口(批量审核接口)
            getAuditContentByTableId: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/getAuditContentByTableId', // 获取审核数据接口
            getDsAuditLogById: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/getDsAuditLogById', // 查看审核数据接口
            searchDsAuditLog: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/searchDsAuditLog', // 查看审核数据接口

            listAllConfigedDatabase: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/listAllConfigedDatabase', // 获取配置过的数据库列表接口
            listAllConfigedDatasource: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/listAllConfigedDatasource', // 获取配置过的数据源列表接口

            getDsVersionById: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/getDsVersionById', // 获取指定历史版本信息接口
            searchDsTableFixVersionData: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/searchDsTableFixVersionData', // 查询指定版本数据表历史列表接口
            searchDsColumnFixVersionData: HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/datasecurity/searchDsColumnFixVersionData', // 查询指定版本字段历史列表接口

            desensitizerule: HTTP_BASE_URL + '/quantchiAPI/api/desensitizerule', // 获取所有脱敏规则
            toggleRuleStatus: HTTP_BASE_URL + '/quantchiAPI/api/desensitizerule/toggleRuleStatus', // 切换规则状态
            saveDesensitizerule: HTTP_BASE_URL + '/quantchiAPI/api/desensitizerule/save', // 增/改脱敏规则
            columnDesensitizerule: HTTP_BASE_URL + '/quantchiAPI/api/desensitizerule/column', // 脱敏字段列表'''''
            addColumnRule: HTTP_BASE_URL + '/quantchiAPI/api/desensitizerule/column/add', // 新增脱敏字段信息
            updateColumnRule: HTTP_BASE_URL + '/quantchiAPI/api/desensitizerule/column/update', // 修改脱敏字段信息
            desensitizeruleDatasource: HTTP_BASE_URL + '/quantchiAPI/api/desensitizerule/datasource', // 获取可配置的数据源
            desensitizeruleDatabase: HTTP_BASE_URL + '/quantchiAPI/api/desensitizerule/database', // 获取可配置的数据库

            getSystemTree: HTTP_BASE_URL + '/quantchiAPI/api/tree/system', // 获取系统分类

            sortNodes: HTTP_BASE_URL + '/quantchiAPI/api/commontree/sortNodes', // 对节点进行排序
            listByCodes: HTTP_BASE_URL + '/quantchiAPI/api/commontree/listByCodes', // 获取树信息
            flatPreview: HTTP_BASE_URL + '/quantchiAPI/api/tree/flatPreview', // 预览分类树信息
            replaceBizTree: HTTP_BASE_URL + '/quantchiAPI/api/tree/business/replace', // 业务分类-用备用树替换主树, 备用树code，仅支持BZB001 BZB002
            suggestPath: HTTP_BASE_URL + '/quantchiAPI/api/tree/suggestPath', // 推荐节点路径
            addBizTree: HTTP_BASE_URL + '/quantchiAPI/api/tree/business/add', // 业务分类-新增业务节点信息
            updateBizTree: HTTP_BASE_URL + '/quantchiAPI/api/tree/business/update', // 业务分类-编辑业务节点信息
            bizTree: HTTP_BASE_URL + '/quantchiAPI/api/tree/business/', // 业务分类-删除业务节点信息

            dataWarehouseTree: HTTP_BASE_URL + '/quantchiAPI/api/tree/dataWarehouse/', // 数仓分类-获取数仓分类树
            addDataWarehouseTree: HTTP_BASE_URL + '/quantchiAPI/api/tree/dataWarehouse/add', // 数仓分类-获取数仓分类树
            updateDataWarehouseTree: HTTP_BASE_URL + '/quantchiAPI/api/tree/dataWarehouse/update', // 数仓分类-获取数仓分类树

            analysisThemeTree: HTTP_BASE_URL + '/quantchiAPI/api/tree/analysisTheme/', // 分析主题-获取分析主题
            addAnalysisThemeTree: HTTP_BASE_URL + '/quantchiAPI/api/tree/analysisTheme/add', //
            updateAnalysisThemeTree: HTTP_BASE_URL + '/quantchiAPI/api/tree/analysisTheme/update', //

            desensitiseTagClass: HTTP_BASE_URL + '/quantchiAPI/api/desensitiseTag/class/', // 类别 - 获取敏感标签类别信息
            saveDesensitiseTagClass: HTTP_BASE_URL + '/quantchiAPI/api/desensitiseTag/class/save', // 类别 - 保存敏感标签类别信息
            desensitiseTag: HTTP_BASE_URL + '/quantchiAPI/api/desensitiseTag/', // 标签列表 - 获取所有标签信息
            saveDesensitiseTag: HTTP_BASE_URL + '/quantchiAPI/api/desensitiseTag/save', // 标签编辑 - 保存敏感标签信息
            changeTagStatus: HTTP_BASE_URL + '/quantchiAPI/api/desensitiseTag/changeStatus', // 标签列表 - 修改标签状态
            sensitiveLevel: HTTP_BASE_URL + '/quantchiAPI/api/desensitiseTag/sensitiveLevel', // 获取筛选敏感等级
            tagSecurityLevel: HTTP_BASE_URL + '/quantchiAPI/api/desensitiseTag/securityLevel', // 标签列表 - 获取数据安全等级过滤器
            allSensitiveLevel: HTTP_BASE_URL + '/quantchiAPI/api/baseconfig/sensitiveLevel', // 获取所有敏感等级

            delDesensitiseTagColumn: HTTP_BASE_URL + '/quantchiAPI/api/desensitiseTag/detail/columns/delete', // 标签详情 - 解除映射字段
            desensitiseTagColumnPreview: HTTP_BASE_URL + '/quantchiAPI/api/desensitiseTag/detail/columns/preview', // 标签详情 - 脱敏预览
            systemFilter: HTTP_BASE_URL + '/quantchiAPI/api/desensitiseTag/detail/column/filter/system/', // 标签详情 - 系统过滤器
            databaseFilter: HTTP_BASE_URL + '/quantchiAPI/api/desensitiseTag/detail/column/filter/database/', // 标签详情 - 系统过滤器
            desensitiseTagColumns: HTTP_BASE_URL + '/quantchiAPI/api/desensitiseTag/detail/columns', // 标签详情 - 映射字段列表
            saveDesensitiseTagColumns: HTTP_BASE_URL + '/quantchiAPI/api/desensitiseTag/detail/columns/save', // 标签详情 - 保存映射字段
            desensitiseTagColumnSearchFilter: HTTP_BASE_URL + '/quantchiAPI/api/desensitiseTag/detail/columns/search/filter', // 标签详情 - 搜索字段过滤器
            desensitiseTagColumnSearch: HTTP_BASE_URL + '/quantchiAPI/api/desensitiseTag/detail/columns/search', // 标签详情 - 搜索字段信息

            mappingSystem: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/level/mapping/system', // 映射 - 获取所有系统信息
            mappingDatabase: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/level/mapping/database', // 映射 - 获取系统下数据库分层信息
            saveMappingDatabase: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/level/mapping/database/save', // 映射 - 保存系统下数据库分层信息
            defTagInLevel: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/level/defTagInLevel', // 定义到数仓层次下的标签信息

            catalogSystemTree: HTTP_BASE_URL + '/quantchiAPI/api/tree/catalog/systemTree', // 左侧树-系统树（包含系统分类）
            systemCatalog: HTTP_BASE_URL + '/quantchiAPI/api/tree/catalog/system/', // 系统信息
            catalogNondwTable: HTTP_BASE_URL + '/quantchiAPI/api/tree/catalog/nonDw/table', // 非数仓 - 获取表信息
            catalogNondwTableFilter: HTTP_BASE_URL + '/quantchiAPI/api/tree/catalog/nonDw/table/filters', // 非数仓 - 获取表过滤器
            catalogNondwBizTree: HTTP_BASE_URL + '/quantchiAPI/api/tree/catalog/nonDw/bizTree', // 非数仓 - 获取业务分类树
            suggestClassifyByDept: HTTP_BASE_URL + '/quantchiAPI/api/tree/catalog/suggestClassifyByDept', // 根据部门ID推荐分类
            nonDwSaveSys: HTTP_BASE_URL + '/quantchiAPI/api/tree/catalog/nonDw/saveSys', // 非数仓 - 保存系统分类
            nonDwSaveTable: HTTP_BASE_URL + '/quantchiAPI/api/tree/catalog/nonDw/saveTable', // 非数仓 - 保存表分类
            nonDwTableSearch: HTTP_BASE_URL + '/quantchiAPI/api/tree/catalog/nonDw/table/search', // 非数仓 - 高级搜索表信息
            nonDwTableSearchSuggest: HTTP_BASE_URL + '/quantchiAPI/api/tree/catalog/nonDw/table/search/suggest', // 非数仓 - 非数仓 - 搜索表信息的推荐

            sysLevelConfig: HTTP_BASE_URL + '/quantchiAPI/api/tree/catalog/dw/sysLevelConfig', // 数仓 - 系统配置信息
            catalogDwTable: HTTP_BASE_URL + '/quantchiAPI/api/tree/catalog/dw/table', // 数仓 - 获取表信息
            dwSaveSys: HTTP_BASE_URL + '/quantchiAPI/api/tree/catalog/dw/saveSys', // 数仓 - 保存系统分类
            catalogDwTableFilter: HTTP_BASE_URL + '/quantchiAPI/api/tree/catalog/dw/table/filters', // 数仓 - 获取表过滤器
            dwTableSearch: HTTP_BASE_URL + '/quantchiAPI/api/tree/catalog/dw/table/search', // 数仓 - 高级搜索表信息
            dwTableSearchSuggest: HTTP_BASE_URL + '/quantchiAPI/api/tree/catalog/dw/table/search/suggest', // 数仓 - 搜索表信息的推荐
            catalogDwTree: HTTP_BASE_URL + '/quantchiAPI/api/tree/catalog/dw/dwTree', // 数仓 - 获取数仓分类树
            dwAnalysisThemeTree: HTTP_BASE_URL + '/quantchiAPI/api/tree/catalog/dw/analysisThemeTree', // 数仓 - 获取分析主题分类
            saveDwTable: HTTP_BASE_URL + '/quantchiAPI/api/tree/catalog/dw/saveDwTable', // 数仓 - 保存表的数仓分类
            saveThemeTable: HTTP_BASE_URL + '/quantchiAPI/api/tree/catalog/dw/saveThemeTable', // 数仓 - 保存表的分析主题分类
            // 分类分级
            datasecurityTree: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/level/search/tree', // 搜索 - 左侧树
            datasecurityLevelSearch: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/level/search', // 搜索
            datasecurityLevelSearchFilter: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/level/search/filters', // 搜索 - 过滤器
            saveTableBatchConfigForLevel: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/config/saveTableBatchConfigForLevel', // 批量表配置页面：保存表配置分级数据
            previewTableBatchConfig: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/config/previewTableBatchConfig', // 批量表配置页面：获取表配置预览数据
            getTableInfoWithDs: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/config/getTableInfoWithDs', // 分级配置页面：获取表安全配置的信息
            getDsColumnLevelList: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/config/getDsColumnLevelList', // 分级配置/详情页面：获取字段分级列表数据
            getDsColumnLevelListFilters: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/config/getDsColumnLevelList/filters', // 分级配置/详情页面：获取字段分级列表数据
            getDsTagInfoList: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/config/getDsTagInfoList', // 分级配置页面：获取字段脱敏规则列表数据
            saveLevelAndTagInfo: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/config/saveLevelAndTagInfo', // 分级配置页面：保存分级+敏感标签数据
            levelSearchConfirm: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/level/search/confirm', // 批量确认
            saveColumnBatchConfig: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/config/saveColumnBatchConfig', // 批量字段配置页面：保存字段配置数据
            previewColumnBatchConfig: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/config/previewColumnBatchConfig', // 批量字段配置页面：获取字段配置预览数据
            saveColumnTagBatch: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/config/saveColumnTagBatch', // 批量脱敏：保存字段脱敏标签
            previewColumnTagBatch: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/config/previewColumnTagBatch', // 批量字段配置页面：获取字段配置预览数据
            levelDatasourceFilter: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/level/search/filters/datasource', // 搜索 - 数据源过滤器
            levelDatabaseFilter: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/level/search/filters/database', // 搜索 - 数据库过滤器
            levelTableFilter: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/level/search/filters/table', // 搜索 - 表过滤器
            securityLevelFilter: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/level/search/filters/securityLevel', // 搜索 - 安全等级过滤器
            desensitizeTagFilter: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/level/search/filters/desensitizeTag', // 搜索 - 安全等级过滤器

            securityTree: HTTP_BASE_URL + '/quantchiAPI/api/tree/security', // 安全等级分类-获取安全等级分类树
            addSecurityTree: HTTP_BASE_URL + '/quantchiAPI/api/tree/security/add', // 安全等级分类-获取安全等级分类树
            updateSecurityTree: HTTP_BASE_URL + '/quantchiAPI/api/tree/security/update', // 安全等级分类-获取安全等级分类树
            addEigen: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/classify/eigen/add', // 添加特征
            editEigen: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/classify/eigen/edit', // 编辑特征
            eigenList: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/classify/eigen/list', // 获取分类下的特征列表
            removeEigen: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/classify/eigen/remove', // 删除特征
            sortEigen: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/classify/eigen/sort', // 特征排序

            auditListDs: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/audit/listDs', // 待审核数据源列表
            listTableByds: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/audit/listTableByds', // 给定数据源ID查询待审核表List
            listByDs: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/audit/listByDs', // 给定数据源Id查询待审核库
            listAuditColumn: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/audit/listAuditColumn', // list指定表的待审核字段
            columnConfirmAudit: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/audit/confirm', // 确认审核
            columnSampling: HTTP_BASE_URL + '/quantchiAPI/api/metadata/datasource/columnSampling', // 抽样预览

            dsSysTree: HTTP_BASE_URL + '/quantchiAPI/api/tree/catalog/dsSysTree', // 数据分布左侧树
            tableClassifyLvByDatasourceId: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/level/tableClassifyLvByDatasourceId', // 通过数据源查询受控表等级分布
            levelListTableByDs: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/level/listTableByDs', // 通过数据源ID查询表分级List
            columnClassifyLvByDatasourceId: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/level/columnClassifyLvByDatasourceId', // 通过数据源查询受控字段等级分布
            levelStatistic: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/level/statistic', // 查询数据源下的统计信息
            listColumnByTableId: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/level/listColumnByTableId', // 通过表ID查询字段分级List
            bindEigenWithColumn: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/level/bindEigenWithColumn', // 为字段添加特征

            eigenFilters: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/level/search/filters/eigen', // 搜索 - 特征过滤器
            levelSecurityTree: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/level/search/securityTree', // 分布总览左侧树
            levelColumnSearch: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/level/search/columnSearch', // 搜索 - 特征过滤器
            statisticByClassIds: HTTP_BASE_URL + '/quantchiAPI/api/datasecurity/classify/eigen/statisticByClassIds', // 获取分类List下特征统计详情
        },
        autoManage: {
            addManualJob: HTTP_BASE_URL + '/quantchiAPI/api/manualJob', // 上传自动治理文件
            getManualJob: HTTP_BASE_URL + '/quantchiAPI/api/getManualJob', // 获取自动治理文件
            getDataSource: HTTP_BASE_URL + '/quantchiAPI/api/getDataSource', // 获取自动治理文件数据源筛选
            getDGDLJobLog: HTTP_BASE_URL + '/quantchiAPI/api/getDGDLJobLog', // 自动治理文件日志

            getGenFileDataSource: HTTP_BASE_URL + '/quantchiAPI/api/getGenFileDataSource', // 获取自动治理文件生成数据源筛选
            addDgdlGen: HTTP_BASE_URL + '/quantchiAPI/api/manualJob/dgdlGen', // 自动治理文件生成
            getDGDLFile: HTTP_BASE_URL + '/quantchiAPI/api/dgdl/getDGDLFile', // downloadDGDLFile

            displayTableCountsByPartOfDataSourceName: HTTP_BASE_URL + '/quantchiAPI/api/dgdl/displayTableCountsByPartOfDataSourceName', // 智能治理列表
            displayItemCountsGroupByTable: HTTP_BASE_URL + '/quantchiAPI/api/dgdl/displayItemCountsGroupByTable', // 统计表下的治理项
            displayAuditRecordsByItem: HTTP_BASE_URL + '/quantchiAPI/api/dgdl/displayAuditRecordsByItem', // 展示审核确认记录
            GovByDatasourceManually: HTTP_BASE_URL + '/quantchiAPI/api/dgdl/GovByDatasourceManually', // 存量治理
            displayColumnInfoByDGDLItem: HTTP_BASE_URL + '/quantchiAPI/api/dgdl/displayColumnInfoByDGDLItem', // 列出指定表指定项的字段治理信息
            dgdlItemConfirm: HTTP_BASE_URL + '/quantchiAPI/api/dgdl/confirm', // 审核确认
            displayTableInfoByDGDLItem: HTTP_BASE_URL + '/quantchiAPI/api/dgdl/displayTableInfoByDGDLItem', // 列出指定表的治理信息
            tableDGDLconfirm: HTTP_BASE_URL + '/quantchiAPI/api/dgdl/tableDGDLconfirm', // 表治理信息审核确认

            latestVersionList: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiff/latestVersionList', // 获取最新版本列表
            latestDiffStatistic: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiff/latestDiffStatistic', // 最新版本统计信息
            latestDiffDetail: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiff/latestDiffDetail', // 最新版本详情信息
            latestDiffDetailFilters: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiff/latestDiffDetail/filters', // 最新版本详情信息-版本过滤器
            updateVerInfo: HTTP_BASE_URL + '/quantchiAPI/api/updateVerInfo', // 元数据变更版本发布
            fixedVersionList: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiff/fixedVersionList', // 获取定版历史列表
            submitter: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiff/fixedVersionList/filter/submitter', // 获取定版历史列表-定版人过滤器
            versionDiffStatistic: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiff/versionDiffStatistic', // 版本对比统计信息
            versionDiffDetail: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiff/versionDiffDetail', // 版本对比详细信息
            versionDiffDetailFilters: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiff/versionDiffDetail/filters', // 版本对比详细信息
            latestDiffTree: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiff/latestDiff/tree', // 最新版本左侧树
            schemaDiffTree: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiff/tree', // 对比任务 - 系统分类列表
            tableVersionList: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/table/versionList/', // 表下定版信息
            fixedVersionTree: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiff/fixedVersion/tree', // 获取定版历史左侧树
            datasourceMappingFilter: HTTP_BASE_URL + '/quantchiAPI/api/compareConfig/datasourceMapping/filters', // 获取定版历史左侧树

            getLatestDiff: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiff/getLatestDiff', // 获取指定时间段内的版本变更概要列表
            domainTypes: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiff/domainTypes', // 获取变更元数据类型
            subscribe: HTTP_BASE_URL + '/quantchiAPI/api/metadata/alter/subscribe', // 获取数据源订阅信息
            pushTypes: HTTP_BASE_URL + '/quantchiAPI/api/metadata/alter/subscribe/pushTypes', // 推送类型
            saveSubscribe: HTTP_BASE_URL + '/quantchiAPI/api/metadata/alter/subscribe/save', // 更新数据源订阅信息
            manageSubscribe: HTTP_BASE_URL + '/quantchiAPI/api/metadata/alter/subscribe/manage', // 管理 - 获取订阅信息列表
            manageSubscribeFilter: HTTP_BASE_URL + '/quantchiAPI/api/metadata/alter/subscribe/manage/filter/dept', // 管理 - 获取订阅信息部门过滤器
            removeSubsUser: HTTP_BASE_URL + '/quantchiAPI/api/metadata/alter/subscribe/manage/subsUser/remove', // 管理 - 移除订阅信息人员
            subsUserList: HTTP_BASE_URL + '/quantchiAPI/api/metadata/alter/subscribe/manage/subsUser', // 管理 - 获取订阅信息人员
            saveSubsUserList: HTTP_BASE_URL + '/quantchiAPI/api/metadata/alter/subscribe/manage/subsUser/save', // 管理 - 新增订阅信息人员
            pushRecord: HTTP_BASE_URL + '/quantchiAPI/api/metadata/alter/subscribe/manage/pushRecord', // 管理 - 变更推送记录
            pushRecordUsers: HTTP_BASE_URL + '/quantchiAPI/api/metadata/alter/subscribe/manage/pushRecord/users', // 管理 - 变更推送记录详情

            dsSetting: HTTP_BASE_URL + '/quantchiAPI/api/governance/filter/dsSetting', // 列表 - 数据源配置
            saveDsSetting: HTTP_BASE_URL + '/quantchiAPI/api/governance/filter/dsSetting/save', // 保存数据源配置
            filterTable: HTTP_BASE_URL + '/quantchiAPI/api/governance/filter/dsSetting/filterTable', // 详情 - 过滤/移除表明细
            filterTableDb: HTTP_BASE_URL + '/quantchiAPI/api/governance/filter/dsSetting/filterTable/filter/db', // 详情 - 过滤/移除表明细 - 库过滤器
            changeFilterStatus: HTTP_BASE_URL + '/quantchiAPI/api/governance/filter/dsSetting/filterTable/filter/changeStatus', // 编辑 - 修改过滤表的状态
            filterRule: HTTP_BASE_URL + '/quantchiAPI/api/governance/filter/rule', // 列表 - 过滤规则
            saveFilterRule: HTTP_BASE_URL + '/quantchiAPI/api/governance/filter/rule/save', // 列表 - 过滤规则
            filterTypes: HTTP_BASE_URL + '/quantchiAPI/api/governance/filter/rule/filterTypes', // 编辑 - 过滤类型列表
            filterOpts: HTTP_BASE_URL + '/quantchiAPI/api/governance/filter/rule/filterOpts', // 编辑 - 过滤类型列表

            schemaDiffTask: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiff/task', // 对比任务 - 列表
            taskFilters: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiff/task/filters', // 对比任务列表 - 过滤器
            diffStatistic: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiff/task/diffStatistic', // 元数据对比 - 统计信息
            diffDetail: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiff/task/diffDetail', // 版本对比详细信息
            diffDetailFilters: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiff/task/diffDetail/filters', // 版本对比详细信息 - 过滤器
            taskDetailForEdit: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiff/task/forEdit/', // 对比任务列表 - 编辑详情
            saveTask: HTTP_BASE_URL + '/quantchiAPI/api/schemaDiff/task/save', // 对比任务 - 保存
            getTables: HTTP_BASE_URL + '/quantchiAPI/api/metadata/table/getTables', // 获取指定数据库的表列表
            getDatabaselist: HTTP_BASE_URL + '/quantchiAPI/api/metadata/database/list', // 获取指定数据源的数据库列表  
            whitelistTableSave: HTTP_BASE_URL + '/quantchiAPI/api/governance/filter/whitelistTable/save', // 获取指定数据源的数据库列表
            inputWhitelistTableByFile: HTTP_BASE_URL + '/quantchiAPI/api/governance/filter/inputWhitelistTableByFile', // 获取指定数据源的数据库列表  
            databaseList: HTTP_BASE_URL + '/quantchiAPI/api/metadata/database/list',
            whiteListTableDelete: HTTP_BASE_URL + '/quantchiAPI//api/governance/filter/whiteListTable', // 治理表移除

        },
        dataModeling: {
            governTable: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/govern', // 列表 - 获取数据表治理列表
            applicantFilter: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/govern/filter/applicant', // 列表 - 申请人过滤器
            governColumns: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/govern/columns', // 编辑 - 获取字段的治理信息
            governPartitionColumns: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/govern/partitionColumns', // 编辑 - 获取字段的治理信息
            saveGovern: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/govern/save', // 编辑 - 保存
            sensitiveTagRule: HTTP_BASE_URL + '/quantchiAPI/api/desensitiseTag/rule/', // 获取敏感标签下的规则
            foreignSelectorSuggest: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/foreignSelector/suggest', // 编辑 - 外键选择器 - 提示内容
            foreignSelectorDb: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/foreignSelector/db', // 编辑 - 外键选择器 - 数据库
            foreignSelectorTable: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/foreignSelector/table', // 编辑 - 外键选择器 - 表
            foreignSelectorColumn: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/foreignSelector/column', // 编辑 - 外键选择器 - 表

            auditRecord: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/root/audit/record', // 审核列表
            auditRecordFilter: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/root/audit/record/filter/sourceTable', // 审核列表- 来源表过滤器

            datamodelingTable: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table', // 列表 - 获取数据表列表
            datasourceFilter: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/filter/datasource', // 列表 - 获取数据源过滤器
            groupFilter: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/filter/group', // 列表 - 获取数据源过滤器
            creatorFilter: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/filter/creator', // 列表 - 获取数据源过滤器
            tableGroup: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/group', // 分组 - 列表
            tableColumns: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/columns', // 详情 - 字段
            partitionColumns: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/partitionColumns', // 详情 - 分区字段
            dataTypeFilters: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/columns/dataTypeFilters', // 详情 - 字段类型过滤器
            tableDdlDownload: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/ddl/download', // ddl下载
            rootAudit: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/root/audit', // 词根审核
            parseDDL: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/parseDDL', // 词根审核
            detailForEdit: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/detailForEdit', // 编辑 - 获取数据表编辑详情
            candidateRootCheck: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/candidateRootCheck', // 编辑 - 候选词根 - 检查
            candidateRootReplace: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/candidateRootReplace', // 编辑 - 候选词根 - 替换
            suffixRoots: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/suffixRoots', // 编辑 - 后缀词根列表
            simpleLevel: HTTP_BASE_URL + '/quantchiAPI/api/dwapp/level/simple', // 仅获取数仓层次
            generatePrefixOrSuffix: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/generatePrefixOrSuffix', // 编辑 - 生成前缀/后缀信息
            partitionExpMeSql: HTTP_BASE_URL + '/quantchiAPI/api/datamodeling/table/partitionExpMeSql', // MySql分区字段表达式

        },
        systemSetting: {
            // 用户
            requestUserList: HTTP_BASE_URL + '/quantchiAPI/api/umg/user/page',
            listAuth: HTTP_BASE_URL + '/resource/listAuth',
            requestAddUser: HTTP_BASE_URL + '/quantchiAPI/api/umg/user/create',
            requestEditUser: HTTP_BASE_URL + '/quantchiAPI/api/umg/user/update',
            requestDeleteUser: HTTP_BASE_URL + '/quantchiAPI/api/umg/user/delete',
            requestImportUser: HTTP_BASE_URL + '/quantchiAPI/api/umg/user/importUser',
            batchUpdateStaus: HTTP_BASE_URL + '/quantchiAPI/api/umg/user/setStatus',
            downloadTemplate: HTTP_BASE_URL + '/quantchiAPI/api/umg/user/downloadTemplate',
            // 部门
            requestDepartmentTree: HTTP_BASE_URL + '/quantchiAPI/api/umg/dept/deptTree',
            requestAddDepartment: HTTP_BASE_URL + '/quantchiAPI/api/umg/dept/create',
            requestEditDepartment: HTTP_BASE_URL + '/quantchiAPI/api/umg/dept/update',
            requestDepartmentDetail: HTTP_BASE_URL + '/quantchiAPI/api/umg/dept/getById',
            requestImportDepartment: HTTP_BASE_URL + '/quantchiAPI/api/umg/dept/importDept',
            requestDeleteDepartment: HTTP_BASE_URL + '/quantchiAPI/api/umg/dept/delete',
            requestRemoveDepartmentFromUsers: HTTP_BASE_URL + '/quantchiAPI/api/umg/dept/removeDeptUsers',
            requestAddDepartmentToUser: HTTP_BASE_URL + '/quantchiAPI/api/umg/dept/setDeptUsers',
            listDepartmentAvailableUsers: HTTP_BASE_URL + '/quantchiAPI/api/umg/dept/pageAvailableUsers',
            // 角色
            requestRoleList: HTTP_BASE_URL + '/quantchiAPI/api/umg/role/list',
            requestAddRole: HTTP_BASE_URL + '/quantchiAPI/api/umg/role/create',
            requestEditRole: HTTP_BASE_URL + '/quantchiAPI/api/umg/role/update',
            requestDeleteRole: HTTP_BASE_URL + '/quantchiAPI/api/umg/role/delete',
            requestRemoveRoleFromUsers: HTTP_BASE_URL + '/quantchiAPI/api/umg/role/removeRoleUsers',
            requestAddRoleToUser: HTTP_BASE_URL + '/quantchiAPI/api/umg/role/setRoleUsers',
            listRoleAvailableUsers: HTTP_BASE_URL + '/quantchiAPI/api/umg/role/pageAvailableUsers',
            listUsedRoles: HTTP_BASE_URL + '/quantchiAPI/api/umg/role/listRoles',
            // 权限
            requestPermissionList: HTTP_BASE_URL + '/quantchiAPI/api/umg/auth/page',
            requestRolePermissionList: HTTP_BASE_URL + '/quantchiAPI/api/umg/role/getRoleAuths',
            requestUserPermissionList: HTTP_BASE_URL + '/quantchiAPI/api/umg/user/getUserAuths',
            requestDepartmentPermissionList: HTTP_BASE_URL + '/quantchiAPI/api/umg/dept/getDeptAuths',
            saveUserPermissionList: HTTP_BASE_URL + '/quantchiAPI/api/umg/user/setUserAuths',
            saveDepartmentPermissionList: HTTP_BASE_URL + '/quantchiAPI/api/umg/dept/setDeptAuths',
            saveRolePermissionList: HTTP_BASE_URL + '/quantchiAPI/api/umg/role/setRoleAuths',
            resetUserPermission: HTTP_BASE_URL + '/quantchiAPI/api/umg/user/resetUserAuth',
            getUserSystemAuth: HTTP_BASE_URL + '/quantchiAPI/api/dop/auth/user/system',
            getUserTaskAuth: HTTP_BASE_URL + '/quantchiAPI/api/dop/auth/user/task',
            getResource: HTTP_BASE_URL + '/service-auth/resource/default',
            setResourceAuth: HTTP_BASE_URL + '/service-auth/resource/setAuth',
            resourceReset: HTTP_BASE_URL + '/service-auth/resource/reset',
            getSystemDs: HTTP_BASE_URL + '/quantchiAPI/api/dop/auth/system/ds',
            getTaskDs: HTTP_BASE_URL + '/quantchiAPI/api/dop/auth/qa/taskGroup',
            getAllAuth: HTTP_BASE_URL + '/quantchiAPI/api/dop/auth/all/auth',

        },
    },
    // 请求数据接口(后端接口没好，但文档出来的时候再easy-mock上造假数据时用)
    TEST_API_LIST: {
        intelligent: {
            // 'getBusiCate': 'https://www.easy-mock.com/mock/5b6940e28733b43c01e2685d/quantchiAPI/iqAPI/api/getBusiCate', // 智能取数获取业务接口
            // 'getRecommendQuery': 'https://www.easy-mock.com/mock/5b6940e28733b43c01e2685d/quantchiAPI/iqAPI/api/getRecommendQuery', // 获取推荐问句接口
            // 'getRelatedQuery': 'https://www.easy-mock.com/mock/5b6940e28733b43c01e2685d/quantchiAPI/iqAPI/api/getRelatedQuery', // 获取相关问句接口
            // 'intelDownload': HTTP_BASE_URL + '/quantchiAPI/iqAPI/api/download', // 智能取数下载接口
            // 'basicQuery': 'https://www.easy-mock.com/mock/5b6940e28733b43c01e2685d/quantchiAPI/iqAPI/api/basicQuery', // 智能取数查询接口
            // 'likenum': 'https://www.easy-mock.com/mock/5b6940e28733b43c01e2685d/quantchiAPI/iqAPI/api/likenum', // 点赞接口
        },
    },
    // 下拉框配置（目前前端写死）
    SELECT_OPTION: {
        dataType: ['布尔型', '枚举型', '时间型', '数值型', '日期型', '字符型'], // 数据类型
        metricUnit: ['元', '%', '空', '次', '人', '次'], // 度量单位
        status: [{
                key: '1',
                value: '生效',
            },
            {
                key: '0',
                value: '失效',
            },
        ], // 指标状态
        standardSystem: ['国际标准', '国内标准', '行业标准（SDOM模型）', 'EAST标准'], // 标准系统
        standardLevel: ['基础指标标准', '衍生指标标准'], // 标准层次
        logicType: ['营业部', '客户', '交易市场', '产品类型', '销售方式', '发行人类型'], // 常用维度
        frequency: ['日', '周', '月', '季', '年'], // 统计频率
        systemUsed: ['风控系统', '国内标准', '行业标准（SDOM模型）'], // 落地系统
        indexType: ['基础指标', '衍生指标'], // 指标类型
        controlDept: ['风险管理部', '合规部', '信息技术部', '机构管理部', '财富管理部', '零售业务部', '金融衍生品部', '电子商务部', '融资融券部', '机构业务部', '运营管理部', '各分公司及营业部'], // 管理部门
        coSector: ['风险管理部', '合规部', '信息技术部', '机构管理部', '财富管理部', '零售业务部', '金融衍生品部', '电子商务部', '融资融券部', '机构业务部', '运营管理部', '各分公司及营业部'], // 协办部门
    },
    SELECT_PAGE_SIZE: 50,
    TIME_OUT: 500, // 函数节流或者去抖的时间
}
export default CONSTANTS