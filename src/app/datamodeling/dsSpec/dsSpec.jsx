import RichTableLayout from '@/component/layout/RichTableLayout'
import { Button, Input, message, Modal, Radio, Select, Tooltip } from 'antd'
import { configCategory, delDsspecification, dsspecificationList } from 'app_api/metadataApi'
import React, { Component } from 'react'
import ProjectUtil from '@/utils/ProjectUtil'
import ReactDOM from 'react-dom'
import AddDs from './addDs'
import PermissionWrap from '@/component/PermissionWrap'

const { Option } = Select
const RadioGroup = Radio.Group
const { TextArea } = Input
const confirm = Modal.confirm

const dataSourceTypeMap = {
    HIVE: 'HIVE',
    MYSQL: 'MYSQL',
    ORACLE: 'ORACLE',
    SQLSERVER: 'SQLSERVER',
    DB2: 'DB2',
    MONGODB: 'MONGODB',
    POSTGRESQL: 'POSTGRESQL',
    MARIADB: 'MARIADB',
    IMPALA: 'IMPALA',
    // JDBC: 'JDBC连接'
}

export default class eastReport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            tableData: [],
            keyword: '',
            datasourceType: undefined,
            rootCategory: undefined,
            categoryList: [],
            editProps: undefined,
        }
        this.columns = [
            {
                title: '数据源名称',
                dataIndex: 'datasourceNameEn',
                key: 'datasourceNameEn',
                width: '20%',
                render: (text) => (
                    <Tooltip title={text}>
                        <span className='LineClamp'>{text}</span>
                    </Tooltip>
                ),
            },
            {
                title: '数据源类型',
                dataIndex: 'datasourceType',
                key: 'datasourceType',
                width: '14%',
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: '词根类别',
                dataIndex: 'rootCategoryName',
                key: 'rootCategoryName',
                width: '16%',
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: '拼写方式',
                dataIndex: 'spellTypeName',
                key: 'spellTypeName',
                width: '16%',
                render: (text, record) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: '连接方式',
                dataIndex: 'joinTypeName',
                key: 'joinTypeName',
                width: '20%',
                render: (text, record) => <Tooltip title={text}>{text}</Tooltip>,
            },
            {
                title: '词根排序',
                dataIndex: 'rootOrderTypeName',
                key: 'rootOrderTypeName',
                width: '18%',
                render: (text) => <Tooltip title={text}>{text}</Tooltip>,
            },
            // {
            //     title: '操作',
            //     dataIndex: 'x',
            //     key: 'x',
            //     width: 100,
            //     render: (text, record) => {
            //         return (
            //             <span onClick={(e) => e.stopPropagation()}>
            //                 <Tooltip title='编辑'>
            //                     <img
            //                         style={{ width: '24px', background: '#e6f7ff', borderRadius: '50%', marginRight: '4px' }}
            //                         onClick={this.openEditModal.bind(this, record)}
            //                         src={require('app_images/edit.png')}
            //                     />
            //                 </Tooltip>
            //                 <Tooltip title='删除'>
            //                     <img
            //                         style={{ width: '24px', background: '#e6f7ff', borderRadius: '50%', marginRight: '4px' }}
            //                         onClick={this.deleteRule.bind(this, record)}
            //                         src={require('app_images/delete.png')}
            //                     />
            //                 </Tooltip>
            //             </span>
            //         )
            //     },
            // },
        ]
    }
    componentWillMount = () => {
        this.getTableList({})
        this.getConfigCategory()
        if (this.pageParam.query) {
            if (JSON.parse(this.pageParam.query).from == 'ddl') {
                this.setState({ visibleEdit: true, editProps: { ...JSON.parse(this.pageParam.query) } })
            }
        }
    }
    deleteRule = (data) => {
        return delDsspecification({ id: data.datasourceId }).then((res) => {
            if (res.code == 200) {
                message.success('删除成功')
            } else {
                message.error('删除失败')
            }
        })
    }
    openEditModal = (data) => {
        this.setState({ visibleEdit: true, editProps: { title: '编辑词根组合规范', ...data } })
    }
    getTableList = async (params = {}) => {
        let query = {
            ...params.filterSelectedList,
            page: params.pagination ? params.pagination.page : 1,
            pageSize: params.pagination ? params.pagination.page_size : 20,
            datasourceType: this.state.datasourceType,
            keyword: this.state.keyword,
            rootCategory: this.state.rootCategory,
        }
        this.setState({ loading: true })
        let res = await dsspecificationList(query)
        if (res.code == 200) {
            let param = {
                ...params.filterSelectedList,
                page: params.pagination ? params.pagination.page : 1,
                pageSize: params.pagination ? params.pagination.page_size : 20,
                // dataIndex
            }
            let data = {
                data: res.data,
                total: res.total,
            }
            this.setState({
                tableData: res.data,
            })
            this.lzTableDom && this.lzTableDom.setTableData(data, param)
            return {
                dataSource: res.data,
                total: res.total,
            }
        }
        this.setState({ loading: false })
    }
    reset = async () => {
        await this.setState({
            keyword: '',
            rootCategory: undefined,
            datasourceType: undefined,
        })
        this.search()
    }
    changeType = async (e) => {
        await this.setState({
            datasourceType: e,
        })
        this.search()
    }
    changeKeyword = (e) => {
        this.setState({
            keyword: e.target.value,
        })
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    changeRootCategory = async (e) => {
        await this.setState({
            rootCategory: e,
        })
        this.search()
    }
    openAddPage = () => {
        // this.props.addTab('新增词根组合规范')
        this.setState({ visibleEdit: true, editProps: {} })
    }
    get pageParam() {
        return ProjectUtil.getPageParam(this.props)
    }
    getConfigCategory = async () => {
        let res = await configCategory()
        if (res.code == 200) {
            this.setState({
                categoryList: res.data,
            })
        }
    }

    render() {
        const { tableData, loading, classList, keyword, rootCategory, datasourceType, categoryList, editProps, visibleEdit } = this.state
        return (
            <React.Fragment>
                <RichTableLayout
                    title='词根组合规范'
                    renderHeaderExtra={() => {
                        return (
                            <Tooltip title='词根组合规范按数据源进行添加'>
                                <PermissionWrap funcCode='/norm/rootword/comborules/add'>
                                    <Button type='primary' onClick={this.openAddPage}>
                                        新增规范
                                    </Button>
                                </PermissionWrap>
                            </Tooltip>
                        )
                    }}
                    renderSearch={(controller) => {
                        this.controller = controller
                        return (
                            <React.Fragment>
                                <Input.Search value={keyword} onSearch={this.search} onChange={this.changeKeyword} placeholder='输入数据源名称' allowClear />
                                <Select allowClear onChange={this.changeType} value={datasourceType} placeholder='数据源类型'>
                                    {_.map(dataSourceTypeMap, (node, index) => {
                                        return (
                                            <Option key={index} value={index}>
                                                {node}
                                            </Option>
                                        )
                                    })}
                                </Select>
                                <Select allowClear onChange={this.changeRootCategory} value={rootCategory} placeholder='词根类别'>
                                    {categoryList.map((item) => {
                                        return (
                                            <Option value={item.id} key={item.id}>
                                                {item.name}
                                            </Option>
                                        )
                                    })}
                                </Select>
                                <Button onClick={this.reset} className='searchBtn'>
                                    重置
                                </Button>
                            </React.Fragment>
                        )
                    }}
                    tableProps={{
                        columns: this.columns,
                    }}
                    requestListFunction={(page, pageSize) => {
                        return this.getTableList({
                            pagination: {
                                page,
                                page_size: pageSize,
                            },
                        })
                    }}
                    deleteFunction={(_, rows) => {
                        return this.deleteRule(rows[0])
                    }}
                    createDeletePermissionData={(record) => {
                        return {
                            funcCode: '/norm/rootword/comborules/delete',
                        }
                    }}
                    editColumnProps={{
                        width: '14%',
                        createEditColumnElements: (_, record, defaultElements) => {
                            return RichTableLayout.renderEditElements([
                                {
                                    label: '编辑',
                                    onClick: this.openEditModal.bind(this, record),
                                    funcCode: '/norm/rootword/comborules/edit'
                                },
                            ]).concat(defaultElements)
                        },
                    }}
                />
                {visibleEdit && (
                    <AddDs
                        visible={visibleEdit}
                        param={{ ...editProps }}
                        onClose={() => this.setState({ visibleEdit: false })}
                        onSuccess={() => {
                            this.setState({ visibleEdit: false })
                            this.search()
                        }}
                    />
                )}
            </React.Fragment>
        )
    }
}
