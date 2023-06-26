const tabConfigs = [
    {
        name: '治理文件上传',
        path: 'dama/autoManage/uploadFile/index.jsx',
        route: '/auto_gov/import/manage'
    },
    {
        name: '治理文件生成',
        path: 'dama/autoManage/generateFile/index.jsx',
        route: '/auto_gov/export/manage'
    },
    {
        name: '智能治理审核',
        path: 'dama/autoManage/manage/index.jsx',
        route: '/auto_gov/manage',
        children: [
            {
                name: '推荐审核',
                path: 'dama/autoManage/manage/check.jsx',
                route: '/auto_gov/check'
            },
        ]
    },
    {
        name: '表命名规则',
        path: 'dama/autoManage/nameRule/index.jsx',
        route: '/autoManage/nameRule'
    },
    {
        name: '治理过滤',
        path: 'dama/versionManage/manageFilter/index.jsx',
        route: '/setting/gov_filter/manage'
    },
    {
        name: '过滤规则列表',
        path: 'dama/versionManage/manageFilter/filterRuleList.jsx',
        route: '/setting/gov_filter/rules'
    },
    {
        name: '元数据对比',
        path: 'dama/versionManage/dataCompare/index.jsx',
        route: '/md/compare/manage',
        children: [
            {
                name: '对比结果详情',
                path: 'dama/versionManage/dataCompare/result.jsx',
                route: '/md/compare/details'
            },
            {
                name: '新增对比任务',
                path: 'dama/versionManage/dataCompare/addCompareTask.jsx',
                route: '/md/compare/add'
            },
            {
                name: '编辑对比任务',
                path: 'dama/versionManage/dataCompare/addCompareTask.jsx',
                route: '/md/compare/edit'
            },
        ]
    },
    {
        name: '系统映射关系',
        path: 'dama/versionManage/dataCompare/systemMap/index.jsx',
        route: '/setting/md/system_mapping',
        children: [
            {
                name: '新增系统映射',
                path: 'dama/versionManage/dataCompare/systemMap/addSystemMap.jsx',
                route: '/setting/md/addSystemMap'
            },
            {
                name: '编辑系统映射',
                path: 'dama/versionManage/dataCompare/systemMap/addSystemMap.jsx',
                route: '/setting/md/editSystemMap'
            },
        ]
    },
    {
        name: '字段类型映射关系',
        path: 'dama/versionManage/dataCompare/columnMap/index.jsx',
        route: '/setting/md/datatype_mapping',
        children: [
            {
                name: '新增字段类型映射',
                path: 'dama/versionManage/dataCompare/columnMap/addColumnMap.jsx',
                route: '/setting/md/addColumnMap'
            },
            {
                name: '编辑字段类型映射',
                path: 'dama/versionManage/dataCompare/columnMap/addColumnMap.jsx',
                route: '/setting/md/editColumnMap'
            },
        ]
    },
    {
        name: '定版记录',
        path: 'dama/versionManage/version/index.jsx',
        route: '/md/version/history',
        children: [
            {
                name: '版本对比结果',
                path: 'dama/versionManage/version/result.jsx',
                route: '/md/version/compare',
            }
        ]
    },
    {
        name: '版本管理',
        path: 'dama/versionManage/version/manage.jsx',
        route: '/md/version/manage',
        children: [
        ]
    },
    {
        name: '变更管理',
        path: 'dama/versionManage/change/manage.jsx',
        route: '/md/changes/manage',
        children: [
            {
                name: '变更历史记录',
                path: 'dama/versionManage/change/changeRecord.jsx',
                route: '/md/changes/history',
            },
            {
                name: '变更结果',
                path: 'dama/versionManage/change/changeResult.jsx',
                route: '/md/changes/details',
            },
        ]
    },
    {
        name: '变更订阅',
        path: 'dama/versionManage/change/subscribe.jsx',
        route: '/md/changes/subscribe/manage',
    },
    {
        name: '变更设置',
        path: 'dama/versionManage/change/changeSet.jsx',
        route: '/setting/md/changes',
        children: [
        ]
    },
    {
        name: '变更推送记录',
        path: 'dama/versionManage/change/sendRecord.jsx',
        route: '/md/changes/subscribe/push',
        children: [
        ]
    },
    {
        name: '订阅明细',
        path: 'dama/versionManage/change/subscribeUserManage.jsx',
        route: '/md/changes/subscribe/user_manage',
        children: [
        ]
    },
    {
        name: '系统管理',
        route: '/system/manage',
        path: 'dama/system/systemManage/index.tsx',
        children: []
    },
    {
        name: '系统目录',
        route: '/system/directory',
        path: 'dama/system/systemDirectory/index.tsx',
        children: []
    }, {
        name: '报表目录',
        route: '/reportNew/directory',
        path: 'dama/reportNew/directory/index.tsx',
        children: [
            {
                name: '报表目录详情',
                route: '/reportNew/detail/:id',
                path: 'dama/reportNew/directory/directoryDetail/index.tsx',
            }
        ]
    }, {
        name: '报表目录 ',
        route: '/reportNew/directory/:id',
        path: 'dama/reportNew/directory/index.tsx',
    }, {
        name: '报表采集',
        route: '/reportNew/collection',
        path: 'dama/reportNew/collection/index.tsx',
        children: [
            {
                name: '采集详情',
                route: '/reportNew/collection/:id',
                path: 'dama/reportNew/collection/collectionDetail/index.tsx',
            }
        ]
    },
    {
        name: '元模型',
        route: '/md/meta_model/manage',
        path: 'dama/metaModel/index.jsx',
        children: [
            {
                name: '属性管理',
                route: '/md/meta_model/attribute',
                path: 'dama/metaModel/attributeManage/index.jsx',
            }
        ]
    }
]
export default tabConfigs