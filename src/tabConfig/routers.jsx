const tabConfigs = [
    {
        name: '表格布局测试',
        path: 'test/TableLayoutTest.tsx',
        route: '/test/TableLayoutTest',
    },
    {
        name: '组件样式测试',
        path: 'test/ComponentTest.tsx',
        route: '/test/ComponentTest',
    },
    {
        name: '测试页',
        path: 'test/skyWalkingTest.jsx',
        route: '/test/skyWalkingTest',
    },
    {
        name: '分布总览',
        path: 'dama/dataSecurity/dashboard/index.jsx',
        route: '/dama/dataSecurity/dashboard',
    },
    {
        name: '数据分布',
        path: 'dama/dataSecurity/dashboard/dataDistribution/index.jsx',
        route: '/dama/dataSecurity/dataDistribution/index',
        children: [
            {
                name: '数据分布详情',
                title: '数据详情',
                path: 'dama/dataSecurity/dashboard/dataDistribution/detail.jsx',
                route: '/dama/dataSecurity/dataDistribution/detail',
            },
        ],
    },
    {
        name: '数据发现',
        path: 'dama/dataSecurity/dashboard/dataDiscovery/index.jsx',
        route: '/dama/dataSecurity/dataDiscovery/index',
        children: [
            {
                name: '数据发现表详情',
                title: '表详情',
                path: 'dama/dataSecurity/dashboard/dataDiscovery/detail.jsx',
                route: '/dama/dataSecurity/dataDiscovery/detail',
            },
        ],
    },
    {
        name: '中文信息管理',
        path: 'dataWare/govern/cnManage/manualAdd.jsx',
        route: '/md/cninfo/manage',
        children: [
            {
                name: '编辑中文信息',
                path: 'dataWare/govern/cnManage/smartAdd_column.jsx',
                route: '/md/cninfo/edit',
            },
        ],
    },
    {
        name: '智能抽取',
        path: 'dataWare/govern/cnManage/smartAdd.jsx',
        route: '/md/cninfo/auto_extract',
        children: [
            {
                name: '血缘脚本详情',
                path: 'dama/autoCompleteManage/sqlDetail.jsx',
                route: '/dataWare/govern/cnManage/sqlDetail',
            },
        ],
    },
    {
        name: '同义簇',
        path: 'dama/autoCompleteManage/clusterManage/index.jsx',
        route: '/md/syn_group/manage',
        children: [
            {
                name: '编辑同义簇',
                path: 'dama/autoCompleteManage/clusterManage/clusterEdit.jsx',
                route: '/md/syn_group/edit',
            },
            {
                name: '同义簇详情',
                path: 'dama/autoCompleteManage/clusterManage/clusterEdit.jsx',
                route: '/md/syn_group/details',
            },
        ],
    },
    {
        name: '溯源分析',
        path: 'dataWare/application/lineage/traceability.jsx',
        route: '/lineage/traceability',
    },

    {
        name: '数据源管理',
        path: 'dataWare/collect/metadata/datasource/datasource.jsx',
        route: '/sys/manage',
        children: [
            {
                name: '编辑数据源',
                path: 'dataWare/collect/metadata/datasource/addSource.jsx',
                route: '/sys/edit',
            },
            {
                name: '数据源详情',
                path: 'dataWare/collect/metadata/datasource/look.jsx',
                route: '/sys/details',
            },
        ],
    },
    {
        name: '数据源发现',
        path: 'dataWare/collect/metadata/discovery/index.jsx',
        route: '/sys/discover',
        children: [
            {
                name: '数据源发现-数据源详情',
                title: '数据源详情',
                path: 'dataWare/collect/metadata/datasource/look.jsx',
                route: '/sys/discover/details',
            },
        ],
    },
    {
        name: '模板采集',
        path: 'dataWare/collect/metadata/manual.jsx',
        route: '/sys/collect/import/manage',
    },
    {
        name: 'autoTask',
        title: '采集任务',
        path: 'dataWare/collect/metadata/auto/auto.jsx',
        route: '/sys/collect/task/manage',
        children: [
            {
                name: '编辑采集任务',
                path: 'dataWare/collect/metadata/auto/autoEdit.jsx',
                route: '/sys/collect/task/edit',
            },
        ],
    },
    {
        name: '采集日志',
        path: 'dataWare/collect/metadata/log.jsx',
        route: '/sys/collect/logs',
        params: {
            area: 'metadata',
        },
    },

    {
        name: '血缘文件',
        path: 'lineage/management/file.jsx',
        route: '/lineage/files/manage',
        children: [
            {
                name: '血缘文件详情',
                path: 'lineage/management/fileDetail.jsx',
                route: '/lineage/files/details',
            },
        ],
    },

    {
        name: '采集任务',
        path: 'lineage/management/collectTaskList.jsx',
        route: '/lineage/collect/task/manage',
        children: [
            {
                name: '任务详情',
                path: 'lineage/management/collectTaskDetail.jsx',
                route: '/lineage/collect/task/details',
            },
            {
                name: 'sqlFlow',
                title: '血缘可视化',
                path: 'lineage/sqlFlow/index.jsx',
                route: '/lineage/files/sqlflow',
            },
        ],
    },

    {
        name: '标准映射',
        path: 'dataWare/govern/standardMap/manual/manual.jsx',
        route: '/dtstd/mapping/manage',
        children: [
            {
                name: '标准详情',
                path: 'dataWare/govern/standardMap/manual/standardDetail.jsx',
                route: '/dtstd/details',
            },
            {
                name: '映射管理',
                path: 'dataWare/govern/standardMap/manual/standardMap.jsx',
                route: '/dtstd/mapping/details',
            },
        ],
    },

    {
        name: '智能对标',
        path: 'dataWare/govern/standardMap/smart/smart.jsx',
        route: '/dtstd/mapping/auto',
        children: [],
    },

    {
        name: '数据标准',
        path: 'metadata/standard/info.jsx',
        route: '/dtstd/list',
    },
    {
        name: '落标评估',
        path: 'dtstd/assessment/index.jsx',
        route: '/dtstd/assessment',
    },
    {
        name: '标准维护',
        path: 'metadata/standard/index.jsx',
        route: '/dtstd/management/list',
        children: [
            {
                name: '编辑标准',
                path: 'metadata/standard/edit.jsx',
                route: '/dtstd/management/edit',
            },
            {
                title: '标准详情',
                name: '标准维护-标准详情',
                path: 'dataWare/govern/standardMap/manual/standardDetail.jsx',
                route: '/dtstd/management/details',
            },
        ],
    },
    {
        name: '数据字典',
        path: 'dama/dataDictionary/index.jsx',
        route: '/dataDictionary/list',
        children: [
            {
                name: '数据字典-表详情',
                title: '表详情',
                path: 'dama/dataDictionary/detail.jsx',
                route: '/dataDictionary/detail',
            },
        ],
    },

    {
        name: '标准采集',
        path: 'govern/standardDefine/manualCollect.jsx',
        route: '/dtstd/collect/manage',
        children: [
            {
                name: '标准采集日志',
                path: 'govern/standardDefine/collectLog.jsx',
                route: '/govern/standardDefine/collectLog',
            },
        ],
    },

    {
        name: '标签映射',
        path: 'application/tag/manage.jsx',
        route: '/md/tags/mapping',
        children: [],
    },
    {
        name: '标签管理',
        path: 'dataWare/application/tag/classManage.jsx',
        route: '/md/tags/manage',
        children: [],
    },
    {
        name: '落标检核',
        path: 'dataWare/govern/standardMatch/check.jsx',
        route: '/dtstd/mapping/check',
        children: [
            {
                name: '落标检核-标准-查看详情',
                title: '标准-查看详情',
                path: 'dataWare/govern/standardMap/manual/standardDetail.jsx',
                route: '/dataWare/govern/standardMap/check_standard_detail',
            },
        ],
    },
    {
        name: '标准化改写',
        path: 'dataWare/govern/standardMatch/rewrite.jsx',
        route: '/dtstd/rewrite',
        children: [],
    },
    {
        name: '标准分类',
        path: 'govern/standardDefine/classSetting.jsx',
        route: '/dtstd/categroy',
        children: [],
    },

    {
        name: '维度管理',
        path: 'datamanager/dimensiondef.jsx',
        route: '/dmm/dim/manage',
        children: [
            {
                name: '定义维度',
                path: 'datamanager/dimensionEdit.jsx',
                route: '/dmm/dim/edit',
            },
            {
                name: '维度详情',
                path: 'datamanager/dimensionDetail.jsx',
                route: '/dmm/dim/detials',
            },
            {
                name: '编辑维度资产',
                path: 'datamanager/addDimensionAsset.jsx',
                route: '/dmm/dim_logic/edit',
            },
            {
                name: '维度资产详情',
                path: 'datamanager/assetDetail.jsx',
                route: '/dmm/dim_logic/detials',
            },
        ],
    },

    {
        name: '事实资产',
        path: 'datamanager/fact/factmanage.jsx',
        route: '/dmm/fact_logic/manage',
        children: [
            {
                name: '定义事实资产',
                path: 'datamanager/fact/factEdit.jsx',
                route: '/dmm/fact_logic/edit',
                children: [],
            },
            {
                name: '事实资产详情',
                path: 'datamanager/fact/factDetail.jsx',
                route: '/dmm/fact_logic/detials',
                children: [],
            },
        ],
    },

    {
        name: '汇总资产',
        path: 'datamanager/metricsSummary/metricsSummary.jsx',
        route: '/dmm/dws/manage',
        children: [
            {
                name: '编辑汇总资产',
                path: 'datamanager/metricsSummary/addSummaryAsset.jsx',
                route: '/dmm/dws/edit',
            },
            {
                name: '汇总资产详情',
                path: 'datamanager/metricsSummary/detail.jsx',
                route: '/dmm/dws/details',
            },
        ],
    },
    {
        name: '原子指标',
        path: 'datamanager/metricsdef/atomIndexma.jsx',
        route: '/metrics/atmc/manage',
        children: [],
    },
    {
        name: '衍生指标',
        path: 'datamanager/metricsdef/deriveIndexma.jsx',
        route: '/metrics/drvs/manage',
        children: [
            {
                name: '定义衍生指标',
                path: 'dama/newIndexma/addDeriveIndexma.jsx',
                route: '/metrics/drvs/edit',
            },
        ],
    },
    {
        name: '统计周期',
        path: 'datamanager/statisticalperioddef/statisticalperioddef.jsx',
        route: '/metrics/statpd/manage',
        children: [],
    },
    {
        name: '业务限定',
        path: 'datamanager/bizlimitdef/index.jsx',
        route: '/metrics/bizlimit/manage',
        children: [
            {
                name: '定义业务限定',
                path: 'datamanager/bizlimitdef/addBusiness.jsx',
                route: '/metrics/bizlimit/edit',
            },
        ],
    },

    // {
    //     name: 'DDL生成',
    //     path: 'datamodeling/ddl/table.jsx',
    //     route: '/norm/ddl/manage',
    //     children: [
    //         {
    //             name: '新建表',
    //             path: 'datamodeling/ddl/tableAdd.jsx',
    //             route: '/norm/ddl/edit',
    //         },
    //         {
    //             name: '表详情',
    //             path: 'datamodeling/ddl/tableAdd.jsx',
    //             route: '/norm/ddl/details',
    //         },
    //     ],
    // },
    {
        name: '治理列表',
        path: 'datamodeling/dgdl/manageList.jsx',
        route: '/norm/ddl_gov/manage',
        children: [
            {
                name: 'dgdl表治理',
                title: '表治理',
                path: 'datamodeling/dgdl/tableManage.jsx',
                route: '/norm/ddl_gov/edit',
            },
            {
                name: '治理表详情',
                title: '表详情',
                path: 'datamodeling/dgdl/dgdlDetail.jsx',
                route: '/norm/dgdl/manageDgdlDetail',
            },
        ],
    },
    {
        name: '治理表生成',
        path: 'datamodeling/newDdl/ddlList.jsx',
        route: '/norm/ddl/manage',
        children: [
            {
                name: 'DDL新增表',
                title: '新增表',
                path: 'datamodeling/newDdl/addDdl.jsx',
                route: '/norm/ddl/add',
            },
            {
                name: 'DDL编辑表',
                title: '编辑表',
                path: 'datamodeling/newDdl/addDdl.jsx',
                route: '/norm/ddl/edit',
            },
            {
                name: 'dgdl表详情',
                title: '表详情',
                path: 'datamodeling/dgdl/dgdlDetail.jsx',
                route: '/norm/ddl/detail',
            },
        ],
    },
    {
        name: '规范性检查',
        path: 'datamodeling/dsSpecCheck/dsSpecCheck.jsx',
        route: '/norm/check/manage',
        children: [
            {
                name: '历史记录',
                path: 'datamodeling/dsSpecCheck/history.jsx',
                route: '/norm/check/history',
            },
            {
                name: '结果详情',
                path: 'datamodeling/dsSpecCheck/resultDetail.jsx',
                route: '/norm/check/details',
            },
            {
                name: '批量新增词根',
                path: 'datamodeling/dsSpecCheck/batchAddRoot.jsx',
                route: '/datamodeling/dsSpecCheck_batchAddRoot',
            },
        ],
    },
    {
        name: '词根组合规范',
        path: 'datamodeling/dsSpec/dsSpec.jsx',
        route: '/norm/rootword/comborules',
        children: [],
    },
    {
        name: '词根库',
        path: 'datamodeling/wordRoot/wordRoot.jsx',
        route: '/norm/rootword/manage',
        children: [],
    },
    {
        name: '词根审批',
        path: 'datamodeling/wordRoot/checkRecord.jsx',
        route: '/norm/rootword/checkRecord',
        children: [],
    },
    {
        name: '元数据搜索',
        path: 'metadataCenter/MetaDataCenterPage.tsx',
        route: '/dc/metaDataCenter',
        layout: 'full',
        children: [
            {
                name: 'sysDetail',
                title: '数据详情',
                layout: 'full',
                path: 'assets/dataWare/SysDetailPage.tsx',
                route: '/dc/systb_details',
                layout: 'fullScreen',
            },
            {
                name: 'sqlDetail',
                title: '血缘脚本详情',
                layout: 'full',
                path: 'assets/dataWare/SqlDetailPage.tsx',
                route: '/dc/sql_details',
                layout: 'fullScreen',
            },
            {
                name: 'rptDetail',
                title: '报表详情',
                layout: 'full',
                path: 'assets/dataWare/SysReportDetail.tsx',
                route: '/dc/report_details',
                layout: 'fullScreen',
            },
            {
                name: 'physicalModelDetail',
                title: '物理模型详情',
                layout: 'full',
                path: 'assets/dataWare/PhysicalModeDetail.tsx',
                route: '/dc/physicalModeDetail',
                layout: 'fullScreen',
            },
        ],
    },
    {
        name: '业务资产搜索',
        layout: 'full',
        path: 'assets/assetsSearch/asset.jsx',
        route: '/dc/biz_search',
        children: [
            {
                name: '模型资产详情',
                layout: 'full',
                path: 'assets/assetsSearch/businessDetail.jsx',
                route: '/dc/model_details',
            },
            {
                name: '资产详情',
                layout: 'full',
                path: 'assets/assetsSearch/detail.jsx',
                route: '/dc/admin/dws/details',
            },
        ],
    },
    {
        name: '模型资产',
        path: 'assets/assetsPublish/businessAsset.jsx',
        route: '/dc/admin/model/manage',
    },
    {
        name: '指标资产',
        path: 'assets/assetsPublish/indexmaAsset.jsx',
        route: '/dc/admin/dws/manage',
    },

    {
        name: 'userList',
        title: '用户列表',
        path: 'setting/user/userListPage.jsx',
        route: '/setting/user/manage',
    },
    {
        name: 'roleList',
        title: '角色列表',
        path: 'setting/role/roleIndexPage.tsx',
        route: '/setting/role/manage',
    },
    {
        name: 'departmentList',
        title: '组织结构',
        path: 'setting/department/DepartmentIndexPage.tsx',
        route: '/setting/department/manage',
    },
    {
        name: 'PermissionIndex',
        title: '权限管理',
        path: 'setting/permission/PermissionSetting.tsx',
        route: '/setting/authorize/manage',
    },
    {
        name: 'userAuthorize',
        title: '用户权限汇总',
        path: 'setting/permission/permissionIndex/all.jsx',
        route: '/setting/user/authorize/manage',
    },
    {
        name: 'systemAuthorize',
        title: '系统权限',
        path: 'setting/permission/permissionSystem/index.jsx',
        route: '/setting/system/authorize/manage',
    },
    {
        name: 'functionuthorize',
        title: '功能权限',
        path: 'setting/permission/permissionFunction/index.jsx',
        route: '/setting/function/authorize/manage',
    },
    {
        name: 'taskAuthorize',
        title: '任务权限',
        path: 'setting/permission/permissionTask/index.jsx',
        route: '/setting/task/authorize/manage',
    },
    {
        name: 'MenuEdit',
        title: '权限编辑',
        path: 'setting/permission/MenuEdit.tsx',
        route: '/setting/permission/MenuEdit',
    },
    {
        name: 'DopManage',
        title: 'DOP运维管理',
        path: 'dopmanage/Dopmanage.tsx',
        layout: 'full',
        route: '/dopmanage',
    },
    {
        name: '数据地图',
        layout: 'full',
        path: 'graph/DataMapPage.tsx',
        route: '/dataGraph/dataMap',
    },
    {
        title: '指标可视化',
        name: 'kpiCharts',
        path: 'kpiCharts/KpiCharts.tsx',
        route: '/kpiCharts',
    },
    {
        title: '血缘映射',
        name: 'bloodMapping',
        path: 'setting/bloodMapping/index.tsx',
        route: '/lineage/sys_mapping/list',
        children: [
            {
                title: '映射详情',
                name: 'bloodMappingDetail',
                path: 'setting/bloodMapping/detail/index.tsx',
                route: '/lineage/sys_mapping/detail/:id',
            },
        ],
    },
    {
        title: '可信数据',
        name: 'trustedData',
        path: 'setting/trustedData/index.tsx',
        route: '/data_cert/list',
    },
    {
        title: '待认证数据',
        name: 'pendingCft',
        path: 'setting/pendingCftData/index.tsx',
        route: '/data_cert/check',
    },
    {
        title: '确权',
        name: 'calssification',
        path: 'setting/confirmNotDw/index.tsx',
        route: '/dt_calssification/mapping/manage',
    },
    {
        title: '数据剖析',
        name: 'dataDissect',
        path: 'dataDissect/DataDissectListPage',
        route: '/dqm/dataDissect',
        children: [
            {
                title: '数据剖析结果',
                name: 'dataDissectDetail',
                path: 'dataDissect/DataDissectDetailPage',
                route: '/dqm/dataDissectDetail',
                layout: 'fullScreen',
            },
        ],
    },
    {
        title: '数据架构',
        name: 'dataArchitect',
        path: 'dataArchitect/OverviewPage',
        route: '/dqm/dataArchitect',
        children: [
            {
                title: '数据库模型',
                name: 'dataArchitectDatabase',
                path: 'dataArchitect/DatabaseDetailPage',
                route: '/dqm/dataArchitect/databaseDetail',
                children: [
                    {
                        title: '模型详情',
                        name: 'dataArchitectModel',
                        path: 'dataArchitect/ModelDetailPage',
                        route: '/dqm/dataArchitect/ModelDetail',
                    },
                ],
            },
        ],
    },
    {
        title: '实体管理',
        name: 'entityList',
        path: 'entity/EntityListPage',
        route: '/entity/entityList',
    },
]

export default tabConfigs
