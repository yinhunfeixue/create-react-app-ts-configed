import { databaseList } from '@/api/examinationApi'
import { reuqestDataSourceDetail, reuqestTableList } from '@/api/graphApi'
import SelectedIcon from '@/app/graph/component/SelectedIcon'
import IDataSource from '@/app/graph/interface/IDataSource'
import ITable from '@/app/graph/interface/ITable'
import IComponentProps from '@/base/interfaces/IComponentProps'
import SimpleEmpty from '@/component/empty/SimpleEmpty'
import DrawerLayout from '@/component/layout/DrawerLayout'
import PageUtil from '@/utils/PageUtil'
import RenderUtil from '@/utils/RenderUtil'
import { FilterOutlined, SearchOutlined } from '@ant-design/icons'
import { NodeConfig } from '@antv/g6'
import { Button, Divider, Dropdown, Form, Input, Menu, Spin } from 'antd'
import classNames from 'classnames'
import React, { Component, ReactText } from 'react'
import './DataSourceDetail.less'

interface IDataSourceDetailState {
    tableList: ITable[]
    selectedTableId?: ReactText
    showSearch?: boolean
    searchKey?: string
    displayTableList: ITable[]
    dataSource?: IDataSource
    loading: boolean

    databaseList: any[]
    selectedDatabseId: string
}
interface IDataSourceDetailProps extends IComponentProps {
    visible: boolean
    id?: string
    onClose: () => void
    node?: NodeConfig
}

/**
 * DataSourceDetail
 */
class DataSourceDetail extends Component<IDataSourceDetailProps, IDataSourceDetailState> {
    constructor(props: IDataSourceDetailProps) {
        super(props)
        this.state = {
            tableList: [],
            displayTableList: [],
            loading: false,
            databaseList: [],
            selectedDatabseId: '',
        }
    }

    componentDidMount() {
        this.requestDetail()
        this.requestTableList()
        this.requestDatabase()
    }

    private requestDatabase = async () => {
        const { id } = this.props
        let res = await databaseList({ datasourceId: id, page: 1, page_size: 999999 })
        if (res.code == 200) {
            this.setState({
                databaseList: res.data,
            })
        }
    }

    private requestDetail() {
        const { id } = this.props
        if (id) {
            reuqestDataSourceDetail(id).then((res) => {
                this.setState({ dataSource: res.data })
            })
        }
    }

    private requestTableList() {
        const { id } = this.props
        if (id) {
            this.setState({
                loading: true,
            })
            reuqestTableList(id)
                .then((res) => {
                    this.setState(
                        {
                            tableList: res.data,
                        },
                        () => this.filterTableList()
                    )
                })
                .finally(() => {
                    this.setState({
                        loading: false,
                    })
                })
        }
    }

    private filterTableList() {
        const { tableList, searchKey, selectedDatabseId } = this.state
        let displayTableList = tableList
        if (selectedDatabseId) {
            displayTableList = displayTableList.filter((item) => item.databaseId === selectedDatabseId)
        }
        if (searchKey) {
            displayTableList = displayTableList.filter((item) => item.tableEName.includes(searchKey))
        }
        this.setState({ displayTableList })
    }

    private renderTableList() {
        const { displayTableList, selectedTableId, loading } = this.state
        if (loading) {
            return <Spin spinning></Spin>
        }
        if (!displayTableList || !displayTableList.length) {
            return (
                <div className='TableGroup'>
                    <SimpleEmpty />
                </div>
            )
        }

        return (
            <div className='TableGroup'>
                {displayTableList.map((item, index) => {
                    const selected = item.tableId === selectedTableId
                    return (
                        <div
                            key={index}
                            className={classNames('TableItem', selected ? 'TableItemSelected' : '')}
                            onClick={() => {
                                this.setState({ selectedTableId: item.tableId })
                            }}
                        >
                            <h4 className='ellipsisText'>{item.tableEName}</h4>
                            <div className='ellipsisText'>{item.databaseEname}</div>
                            {/* 选中图标 */}
                            {selected && <SelectedIcon />}
                        </div>
                    )
                })}
            </div>
        )
    }

    render() {
        const { visible, onClose, node } = this.props
        const { showSearch, searchKey, dataSource, selectedTableId, databaseList, selectedDatabseId, displayTableList } = this.state

        return (
            <DrawerLayout
                drawerProps={{
                    title: '数据源详情',
                    width: 280,
                    visible,
                    onClose,
                    mask: false,
                }}
            >
                {dataSource ? (
                    <div className='DataSourceDetail'>
                        <h3>
                            <div className='IconType'>DW</div>
                            {dataSource.datasourceCName}
                        </h3>
                        <Form className='HMiniForm'>
                            {RenderUtil.renderFormItems(
                                [
                                    {
                                        label: '技术负责人',
                                        content: dataSource.techniqueManager,
                                    },
                                    {
                                        label: '库数量',
                                        content: dataSource.databaseCount,
                                    },
                                    {
                                        label: '表数量',
                                        content: node ? (node.count as number) : '',
                                    },
                                ],
                                {
                                    colon: false,
                                    labelCol: { span: 9 },
                                    wrapperCol: { span: 15 },
                                }
                            )}
                        </Form>
                        <Divider />
                        <div className='HControlGroup TableHeader'>
                            {showSearch ? (
                                <Input
                                    prefix={<SearchOutlined />}
                                    value={searchKey}
                                    onBlur={() => this.setState({ showSearch: false })}
                                    onChange={(event) => {
                                        const searchKey = event.target.value
                                        this.setState({ searchKey }, () => this.filterTableList())
                                    }}
                                />
                            ) : (
                                <h3>表血缘</h3>
                            )}
                            {showSearch ? null : <SearchOutlined onClick={() => this.setState({ showSearch: true })} />}
                            <Dropdown
                                overlay={
                                    <Menu style={{ maxHeight: 500, overflow: 'auto' }} selectedKeys={selectedDatabseId ? [selectedDatabseId] : undefined}>
                                        {[
                                            {
                                                label: '不限',
                                                value: '',
                                            },
                                        ]
                                            .concat(
                                                databaseList.map((item) => {
                                                    return {
                                                        label: item.physicalDatabase,
                                                        value: item.id,
                                                    }
                                                })
                                            )
                                            .map((item) => {
                                                return (
                                                    <Menu.Item
                                                        onClick={() => {
                                                            this.setState({ selectedDatabseId: item.value }, () => this.filterTableList())
                                                        }}
                                                        key={item.value}
                                                    >
                                                        {item.label}
                                                    </Menu.Item>
                                                )
                                            })}
                                    </Menu>
                                }
                            >
                                <Button icon={<FilterOutlined />} size='small' type='text' />
                            </Dropdown>
                        </div>
                        {this.renderTableList()}
                        {Boolean(displayTableList && displayTableList.length) && (
                            <Button
                                type='primary'
                                block
                                disabled={!selectedTableId}
                                onClick={() => {
                                    PageUtil.addTab('sysDetail', { id: selectedTableId, tabValue: 'graph' }, true)
                                }}
                            >
                                血缘分析
                            </Button>
                        )}
                    </div>
                ) : (
                    <Spin spinning>
                        <div style={{ marginTop: 30 }} />
                    </Spin>
                )}
            </DrawerLayout>
        )
    }
}

export default DataSourceDetail
