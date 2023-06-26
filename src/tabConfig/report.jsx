const tabConfigs = [
    /* {
        'name': '报表采集',
        'path': 'dama/report/reportCollection/index',
        'route': '/reportCollection/index',
        children: [
            {
                name: '报表采集-详情',
                title: '任务详情',
                path: 'dama/report/reportCollection/detail',
                route: '/reportCollection/detail',
                children: [
                    {
                        name: '任务详情-报表编辑',
                        title: '报表编辑',
                        path: 'dama/report/reportCollection/fileDetail',
                        route: '/reportCollection/task_file_detail'
                    }
                ]
            }
        ]
    }, */
    {
        'name': '报表列表',
        'path': 'dama/report/reportCollection/fileList',
        'route': '/reportCollection/fileList',
        children: [
            {
                name: '报表编辑',
                path: 'dama/report/reportCollection/fileDetail',
                route: '/reportCollection/fileDetail'
            }
        ]
    },
    {
        'name': '报表分类',
        'path': 'dama/report/reportCollection/category',
        'route': '/reportCollection/category'
    },
]
export default tabConfigs