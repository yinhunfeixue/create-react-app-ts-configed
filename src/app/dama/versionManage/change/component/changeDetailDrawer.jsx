import CollapseLabel from '@/component/collapseLabel/CollapseLabel';
import EmptyLabel from '@/component/EmptyLabel';
import IconFont from '@/component/IconFont';
import DrawerLayout from '@/component/layout/DrawerLayout';
import RichTableLayout from '@/component/layout/RichTableLayout';
import RenderUtil from '@/utils/RenderUtil';
import { Button, Collapse, Divider, Input, Popover, Select, Skeleton, Spin, Tooltip } from 'antd';
import { latestDiffDetail, versionDiffDetail } from 'app_api/autoManage';
import React, { Component } from 'react';
import '../index.less';
import InfiniteScroll from 'react-infinite-scroll-component';


const { Panel } = Collapse;

export default class ChangeDetailDrawer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalVisible: false,
            detailInfo: {
                diffDetail: {
                    itemDiff: [],
                    keyDiff: [],
                    subItemDiff: []
                }
            },
            loading: false,
            folded: true,
            queryInfo: {
                keyword: '',
            },
            treeQueryInfo: {
                keyword: '',
            },
            showInput: true,
            tableData: [],
            changeType: [],
            treeData: [],
            treeTotal: 0,
            typeList: [],
            filterVisible: false,
            drawerTitle: '',
            databaseFilters: [],
            statusFilters: [],
            versionFilters: [],
            treeLoading: false,
            apiName: ''
        }
        this.columns = []
        this.changeColumns = [
            {
                title: '字段名',
                dataIndex: 'name',
                key: 'name',
                width: 180,
                render: (text, record, index) =>
                    text ? (
                        <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>
                                <span style={{ display: 'flex' }}>
                                    <span
                                        className={record.status == 'UPDATED' ? 'typeTag updateTag' : (record.status == 'DELETED' ? 'typeTag deleteTag' : (record.status == 'REMAIN' ? 'typeTag remainTag' : 'typeTag'))}
                                    >
                                        {record.status == 'UPDATED' ? '改' : (record.status == 'DELETED' ? '删' : (record.status == 'REMAIN' ? '同' : '增'))}
                                    </span>
                                    <span>{text}</span>
                                </span>
                            </span>
                        </Tooltip>
                    ) : <EmptyLabel />
            },
            {
                title: '新／旧',
                dataIndex: 'ds_name',
                key: 'ds_name',
                width: 80,
                render: (text, record) => {
                    return (
                        <div>
                            {
                                record.status !== 'UPDATED' ?
                                    <div className='rowSpanTable'>
                                        <div>{record.status == 'DELETED' ? '旧' : '新'}</div>
                                    </div>
                                    :
                                    <div  className='rowSpanTable'>
                                        <div>新</div>
                                        <div>旧</div>
                                    </div>
                            }
                        </div>
                    )
                }
            },
            {
                title: '备注',
                dataIndex: 'ds_name',
                key: 'ds_name',
                render: (text, record) => {
                    return (
                        <div>
                            {
                                record.status !== 'UPDATED' ?
                                    <div className='rowSpanTable'>
                                        <div>
                                            <Tooltip title={record.status == 'DELETED' ? record.diffDetail['字段备注'].before : record.diffDetail['字段备注'].after}>
                                                <span className='LineClamp'>{record.status == 'DELETED' ? (record.diffDetail['字段备注'].before || <EmptyLabel />) : (record.diffDetail['字段备注'].after || <EmptyLabel />)}</span>
                                            </Tooltip>
                                        </div>
                                    </div>
                                    :
                                    <div  className='rowSpanTable'>
                                        <div>
                                            <Tooltip title={record.diffDetail['字段备注'].after}>
                                                <span className='LineClamp'>{record.diffDetail['字段备注'].after || <EmptyLabel />}</span>
                                            </Tooltip>
                                        </div>
                                        <div>
                                            <Tooltip title={record.diffDetail['字段备注'].before}>
                                                <span className='LineClamp'>{record.diffDetail['字段备注'].before || <EmptyLabel />}</span>
                                            </Tooltip>
                                        </div>
                                    </div>
                            }
                        </div>
                    )
                }
            },
            {
                title: '主键',
                dataIndex: 'ds_name',
                key: 'ds_name',
                width: 80,
                render: (text, record) => {
                    return (
                        <div>
                            {
                                record.status !== 'UPDATED' ?
                                    <div className='rowSpanTable'>
                                        <div>{record.status == 'DELETED' ? (record.diffDetail['主键'].before == 'true' ? '主键' : <EmptyLabel />) : (record.diffDetail['主键'].after == 'true' ? '主键' : <EmptyLabel />)}</div>
                                    </div>
                                    :
                                    <div  className='rowSpanTable'>
                                        <div>{record.diffDetail['主键'].after == 'true' ? '主键' : <EmptyLabel />}</div>
                                        <div>{record.diffDetail['主键'].before == 'true' ? '主键' : <EmptyLabel />}</div>
                                    </div>
                            }
                        </div>
                    )
                }
            },
            {
                title: '类型',
                dataIndex: 'ds_name',
                key: 'ds_name',
                width: 120,
                render: (text, record) => {
                    return (
                        <div>
                            {
                                record.status !== 'UPDATED' ?
                                    <div className='rowSpanTable'>
                                        <div>{record.status == 'DELETED' ? (record.diffDetail['字段类型'].before || <EmptyLabel />) : (record.diffDetail['字段类型'].after || <EmptyLabel />)}</div>
                                    </div>
                                    :
                                    <div  className='rowSpanTable'>
                                        <div>{record.diffDetail['字段类型'].after || <EmptyLabel />}</div>
                                        <div>{record.diffDetail['字段类型'].before || <EmptyLabel />}</div>
                                    </div>
                            }
                        </div>
                    )
                }
            },
            {
                title: '长度',
                dataIndex: 'ds_name',
                key: 'ds_name',
                width: 80,
                render: (text, record) => {
                    return (
                        <div>
                            {
                                record.status !== 'UPDATED' ?
                                    <div className='rowSpanTable'>
                                        <div>{record.status == 'DELETED' ? (record.diffDetail['字段长度'].before || <EmptyLabel />) : (record.diffDetail['字段长度'].after || <EmptyLabel />)}</div>
                                    </div>
                                    :
                                    <div  className='rowSpanTable'>
                                        <div>{record.diffDetail['字段长度'].after || <EmptyLabel />}</div>
                                        <div>{record.diffDetail['字段长度'].before || <EmptyLabel />}</div>
                                    </div>
                            }
                        </div>
                    )
                }
            },
            {
                title: '精度',
                dataIndex: 'ds_name',
                key: 'ds_name',
                width: 80,
                render: (text, record) => {
                    return (
                        <div>
                            {
                                record.status !== 'UPDATED' ?
                                    <div className='rowSpanTable'>
                                        <div>{record.status == 'DELETED' ? (record.diffDetail['字段精度'].before || <EmptyLabel />) : (record.diffDetail['字段精度'].after || <EmptyLabel />)}</div>
                                    </div>
                                    :
                                    <div  className='rowSpanTable'>
                                        <div>{record.diffDetail['字段精度'].after || <EmptyLabel />}</div>
                                        <div>{record.diffDetail['字段精度'].before || <EmptyLabel />}</div>
                                    </div>
                            }
                        </div>
                    )
                }
            },
            {
                title: '非空',
                dataIndex: 'ds_name',
                key: 'ds_name',
                width: 80,
                render: (text, record) => {
                    return (
                        <div>
                            {
                                record.status !== 'UPDATED' ?
                                    <div className='rowSpanTable'>
                                        <div>{record.status == 'DELETED' ? (record.diffDetail['非空'].before !== 'true' ? '非空' : <EmptyLabel />) : (record.diffDetail['非空'].after !== 'true' ? '非空' : <EmptyLabel />)}</div>
                                    </div>
                                    :
                                    <div  className='rowSpanTable'>
                                        <div>{record.diffDetail['非空'].after !== 'true' ? '非空' : <EmptyLabel />}</div>
                                        <div>{record.diffDetail['非空'].before !== 'true' ? '非空' : <EmptyLabel />}</div>
                                    </div>
                            }
                        </div>
                    )
                }
            },
            {
                title: '字段位置',
                dataIndex: 'ds_name',
                key: 'ds_name',
                width: 100,
                render: (text, record) => {
                    return (
                        <div>
                            {
                                record.status !== 'UPDATED' ?
                                    <div className='rowSpanTable'>
                                        <div>
                                            <Tooltip title={record.status == 'DELETED' ? record.diffDetail['字段位置'].before : record.diffDetail['字段位置'].after}>
                                                <span className='LineClamp'>{record.status == 'DELETED' ? (record.diffDetail['字段位置'].before || <EmptyLabel />) : (record.diffDetail['字段位置'].after || <EmptyLabel />)}</span>
                                            </Tooltip>
                                        </div>
                                    </div>
                                    :
                                    <div  className='rowSpanTable'>
                                        <div>
                                            <Tooltip title={record.diffDetail['字段位置'].after}>
                                                <span className='LineClamp'>{record.diffDetail['字段位置'].after || <EmptyLabel />}</span>
                                            </Tooltip>
                                        </div>
                                        <div>
                                            <Tooltip title={record.diffDetail['字段位置'].before}>
                                                <span className='LineClamp'>{record.diffDetail['字段位置'].before || <EmptyLabel />}</span>
                                            </Tooltip>
                                        </div>
                                    </div>
                            }
                        </div>
                    )
                }
            },
        ]
        this.codeItemColumns = []
        this.changeCodeItemColumns = [
            {
                title: '代码值',
                dataIndex: 'name',
                key: 'name',
                width: 180,
                render: (text, record, index) => text ? (
                    <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>
                                <span style={{ display: 'flex' }}>
                                    <span
                                        className={record.status == 'UPDATED' ? 'typeTag updateTag' : (record.status == 'DELETED' ? 'typeTag deleteTag' : (record.status == 'REMAIN' ? 'typeTag remainTag' : 'typeTag'))}
                                    >
                                        {record.status == 'UPDATED' ? '改' : (record.status == 'DELETED' ? '删' : (record.status == 'REMAIN' ? '同' : '增'))}
                                    </span>
                                    <span>{text}</span>
                                </span>
                            </span>
                    </Tooltip>
                ) : <EmptyLabel />
            },
            {
                title: '新／旧',
                dataIndex: 'ds_name',
                key: 'ds_name',
                render: (text, record) => {
                    return (
                        <div>
                            {
                                record.status !== 'UPDATED' ?
                                    <div className='rowSpanTable'>
                                        <div>{record.status == 'DELETED' ? '旧' : '新'}</div>
                                    </div>
                                    :
                                    <div  className='rowSpanTable'>
                                        <div>新</div>
                                        <div>旧</div>
                                    </div>
                            }
                        </div>
                    )
                }
            },
            {
                title: '属性名称',
                dataIndex: 'ds_name',
                key: 'ds_name',
                render: (text, record) => {
                    return (
                        <div>
                            {
                                record.status !== 'UPDATED' ?
                                    <div className='rowSpanTable'>
                                        <div>
                                            <Tooltip title={record.status == 'DELETED' ? record.diffDetail['代码值名称'].before : record.diffDetail['代码值名称'].after}>
                                                <span className='LineClamp'>{record.status == 'DELETED' ? (record.diffDetail['代码值名称'].before || <EmptyLabel />) : (record.diffDetail['代码值名称'].after || <EmptyLabel />)}</span>
                                            </Tooltip>
                                        </div>
                                    </div>
                                    :
                                    <div  className='rowSpanTable'>
                                        <div>
                                            <Tooltip title={record.diffDetail['代码值名称'].after}>
                                                <span className='LineClamp'>{record.diffDetail['代码值名称'].after || <EmptyLabel />}</span>
                                            </Tooltip>

                                        </div>
                                        <div>
                                            <Tooltip title={record.diffDetail['代码值名称'].before}>
                                                <span className='LineClamp'>{record.diffDetail['代码值名称'].before || <EmptyLabel />}</span>
                                            </Tooltip>
                                        </div>
                                    </div>
                            }
                        </div>
                    )
                }
            },
        ]
    }
    componentDidMount = () => {
        // let that = this
        // document.onclick = () => {
        //     that.setState({
        //         showInput: false
        //     })
        // }
    }
    openModal = async (data, treeQueryInfo, drawerTitle, filterInfo, apiName) => {
        console.log(this.props.from, 'from++++++')
        let { queryInfo } = this.state
        data.diffDetail.itemDiff&&data.diffDetail.itemDiff.map((item) => {
            data.diffDetail[item.property] = {
                before: item.before,
                after: item.after,
                altered: item.altered
            }
        })
        treeQueryInfo.page = 1
        queryInfo = {
            keyword: '',
        }
        this.columns = [
            {
                title: '字段名',
                dataIndex: 'name',
                key: 'name',
                width: 180,
                render: (text, record, index) => text ? (
                    <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>
                                <span style={{ display: 'flex' }}>
                                    <span
                                        className={record.status == 'UPDATED' ? 'typeTag updateTag' : (record.status == 'DELETED' ? 'typeTag deleteTag' : (record.status == 'REMAIN' ? 'typeTag remainTag' : 'typeTag'))}
                                    >
                                        {record.status == 'UPDATED' ? '改' : (record.status == 'DELETED' ? '删' : (record.status == 'REMAIN' ? '同' : '增'))}
                                    </span>
                                    <span>{text}</span>
                                </span>
                            </span>
                    </Tooltip>
                ) : <EmptyLabel />
            },
            {
                title: '来源',
                dataIndex: 'ds_name',
                key: 'ds_name',
                render: (text, record) => {
                    return (
                        <div>
                            {
                                this.state.queryInfo.source ?
                                    <div className='rowSpanTable'>
                                        <div>{this.state.queryInfo.source == 1 ? '参照系统' : '对比系统'}</div>
                                    </div>
                                    :
                                    <div  className='rowSpanTable'>
                                        <div>参照系统</div>
                                        <div>对比系统</div>
                                    </div>
                            }
                        </div>
                    )
                }
            },
            {
                title: '备注',
                dataIndex: 'ds_name',
                key: 'ds_name',
                render: (text, record) => {
                    return (
                        <div>
                            {
                                record.status !== 'UPDATED' ?
                                    <div className='rowSpanTable'>
                                        <div>
                                            <Tooltip title={record.status == 'DELETED' ? record.diffDetail['字段备注'].before : record.diffDetail['字段备注'].after}>
                                                <span className='LineClamp'>{record.status == 'DELETED' ? (record.diffDetail['字段备注'].before || <EmptyLabel />) : (record.diffDetail['字段备注'].after || <EmptyLabel />)}</span>
                                            </Tooltip>
                                        </div>
                                    </div>
                                    :
                                    <div>
                                        {
                                            this.state.queryInfo.source ?
                                                <div className='rowSpanTable'>
                                                    <div>
                                                        {this.state.queryInfo.source == 1 ?
                                                        <div>
                                                            <Tooltip title={record.diffDetail['字段备注'].before}>
                                                                <span className={record.diffDetail['字段备注'].altered ? 'diffItem LineClamp' : 'LineClamp'}>{record.diffDetail['字段备注'].before || <EmptyLabel />}</span>
                                                            </Tooltip>
                                                        </div>
                                                        :
                                                        <div>
                                                            <Tooltip title={record.diffDetail['字段备注'].after}>
                                                                <span className={record.diffDetail['字段备注'].altered ? 'diffItem LineClamp' : 'LineClamp'}>{record.diffDetail['字段备注'].after || <EmptyLabel />}</span>
                                                            </Tooltip>
                                                        </div>
                                                }
                                                    </div>
                                                </div>
                                                :
                                                <div  className='rowSpanTable'>
                                                    <div>
                                                        <Tooltip title={record.diffDetail['字段备注'].before}>
                                                            <span className={record.diffDetail['字段备注'].altered ? 'diffItem LineClamp' : 'LineClamp'}>{record.diffDetail['字段备注'].before || <EmptyLabel />}</span>
                                                        </Tooltip>
                                                    </div>
                                                    <div>
                                                        <Tooltip title={record.diffDetail['字段备注'].after}>
                                                            <span className={record.diffDetail['字段备注'].altered ? 'diffItem LineClamp' : 'LineClamp'}>{record.diffDetail['字段备注'].after || <EmptyLabel />}</span>
                                                        </Tooltip>
                                                    </div>
                                                </div>
                                        }
                                    </div>

                            }
                        </div>
                    )
                }
            },
            {
                title: '主键',
                dataIndex: 'ds_name',
                key: 'ds_name',
                width: 80,
                render: (text, record) => {
                    return (
                        <div>
                            {
                                record.status !== 'UPDATED' ?
                                    <div className='rowSpanTable'>
                                        <div className='LineClamp'>{record.status == 'DELETED' ? (record.diffDetail['主键'].before == 'true' ? '主键' : <EmptyLabel />) : (record.diffDetail['主键'].after == 'true' ? '主键' : <EmptyLabel />)}</div>
                                    </div>
                                    :
                                    <div>
                                        {
                                            this.state.queryInfo.source ?
                                                <div className='rowSpanTable'>
                                                    <div>
                                                        {this.state.queryInfo.source == 1 ?
                                                            <div className='LineClamp'><span className={record.diffDetail['主键'].altered ? 'diffItem' : ''}>{record.diffDetail['主键'].before == 'true' ? '主键' : <EmptyLabel />}</span></div>
                                                            :
                                                            <div className='LineClamp'><span className={record.diffDetail['主键'].altered ? 'diffItem' : ''}>{record.diffDetail['主键'].after == 'true' ? '主键' : <EmptyLabel />}</span></div>
                                                        }
                                                    </div>
                                                </div>
                                                :
                                                <div  className='rowSpanTable'>
                                                    <div className='LineClamp'><span className={record.diffDetail['主键'].altered ? 'diffItem' : ''}>{record.diffDetail['主键'].before == 'true' ? '主键' : <EmptyLabel />}</span></div>
                                                    <div className='LineClamp'><span className={record.diffDetail['主键'].altered ? 'diffItem' : ''}>{record.diffDetail['主键'].after == 'true' ? '主键' : <EmptyLabel />}</span></div>
                                                </div>
                                        }
                                    </div>
                            }
                        </div>
                    )
                }
            },
            {
                title: '类型',
                dataIndex: 'ds_name',
                key: 'ds_name',
                width: 120,
                render: (text, record) => {
                    return (
                        <div>
                            {
                                record.status !== 'UPDATED' ?
                                    <div className='rowSpanTable'>
                                        <div className='LineClamp'>{record.status == 'DELETED' ? (record.diffDetail['字段类型'].before || <EmptyLabel />) : (record.diffDetail['字段类型'].after || <EmptyLabel />)}</div>
                                    </div>
                                    :
                                    <div>
                                    {
                                        this.state.queryInfo.source ?
                                        <div className='rowSpanTable'>
                                            <div>
                                                {this.state.queryInfo.source == 1 ?
                                                    <div className='LineClamp'><span className={record.diffDetail['字段类型'].altered ? 'diffItem' : ''}>{record.diffDetail['字段类型'].before || <EmptyLabel />}</span></div>
                                                    :
                                                    <div className='LineClamp'><span className={record.diffDetail['字段类型'].altered ? 'diffItem' : ''}>{record.diffDetail['字段类型'].after || <EmptyLabel />}</span></div>
                                                }
                                            </div>
                                        </div>
                                        :
                                        <div  className='rowSpanTable'>
                                            <div className='LineClamp'><span className={record.diffDetail['字段类型'].altered ? 'diffItem' : ''}>{record.diffDetail['字段类型'].before || <EmptyLabel />}</span></div>
                                            <div className='LineClamp'><span className={record.diffDetail['字段类型'].altered ? 'diffItem' : ''}>{record.diffDetail['字段类型'].after || <EmptyLabel />}</span></div>
                                        </div>
                            }
                                </div>
                            }
                        </div>
                    )
                }
            },
            {
                title: '长度',
                dataIndex: 'ds_name',
                key: 'ds_name',
                width: 80,
                render: (text, record) => {
                    return (
                        <div>
                            {
                                record.status !== 'UPDATED' ?
                                    <div className='rowSpanTable'>
                                        <div className='LineClamp'>{record.status == 'DELETED' ? (record.diffDetail['字段长度'].before || <EmptyLabel />) : (record.diffDetail['字段长度'].after || <EmptyLabel />)}</div>
                                    </div>
                                    :
                                    <div>
                                    {
                                        this.state.queryInfo.source ?
                                        <div className='rowSpanTable'>
                                            <div>
                                                {this.state.queryInfo.source == 1 ?
                                                    <div className='LineClamp'><span className={record.diffDetail['字段长度'].altered ? 'diffItem' : ''}>{record.diffDetail['字段长度'].before || <EmptyLabel />}</span></div>
                                                    :
                                                    <div className='LineClamp'><span className={record.diffDetail['字段长度'].altered ? 'diffItem' : ''}>{record.diffDetail['字段长度'].after || <EmptyLabel />}</span></div>
                                                }
                                            </div>
                                        </div>
                                        :
                                        <div  className='rowSpanTable'>
                                            <div className='LineClamp'><span className={record.diffDetail['字段长度'].altered ? 'diffItem' : ''}>{record.diffDetail['字段长度'].before || <EmptyLabel />}</span></div>
                                            <div className='LineClamp'><span className={record.diffDetail['字段长度'].altered ? 'diffItem' : ''}>{record.diffDetail['字段长度'].after || <EmptyLabel />}</span></div>
                                        </div>
                            }
                                </div>
                            }
                        </div>
                    )
                }
            },
            {
                title: '精度',
                dataIndex: 'ds_name',
                key: 'ds_name',
                width: 80,
                render: (text, record) => {
                    return (
                        <div>
                            {
                                record.status !== 'UPDATED' ?
                                    <div className='rowSpanTable'>
                                        <div className='LineClamp'>{record.status == 'DELETED' ? (record.diffDetail['字段精度'].before || <EmptyLabel />) : (record.diffDetail['字段精度'].after || <EmptyLabel />)}</div>
                                    </div>
                                    :
                                    <div>
                                    {
                                        this.state.queryInfo.source ?
                                        <div className='rowSpanTable'>
                                            <div>
                                                {this.state.queryInfo.source == 1 ?
                                                    <div className='LineClamp'><span className={record.diffDetail['字段精度'].altered ? 'diffItem' : ''}>{record.diffDetail['字段精度'].before || <EmptyLabel />}</span></div>
                                                    :
                                                    <div className='LineClamp'><span className={record.diffDetail['字段精度'].altered ? 'diffItem' : ''}>{record.diffDetail['字段精度'].after || <EmptyLabel />}</span></div>
                                                }
                                            </div>
                                        </div>
                                        :
                                        <div  className='rowSpanTable'>
                                            <div className='LineClamp'><span className={record.diffDetail['字段精度'].altered ? 'diffItem' : ''}>{record.diffDetail['字段精度'].before || <EmptyLabel />}</span></div>
                                            <div className='LineClamp'><span className={record.diffDetail['字段精度'].altered ? 'diffItem' : ''}>{record.diffDetail['字段精度'].after || <EmptyLabel />}</span></div>
                                        </div>
                            }
                                </div>
                            }
                        </div>
                    )
                }
            },
            {
                title: '非空',
                dataIndex: 'ds_name',
                key: 'ds_name',
                width: 80,
                render: (text, record) => {
                    return (
                        <div>
                            {
                                record.status !== 'UPDATED' ?
                                    <div className='rowSpanTable'>
                                        <div className='LineClamp'>{record.status == 'DELETED' ? (record.diffDetail['非空'].before !== 'true' ? '非空' : <EmptyLabel />) : (record.diffDetail['非空'].after !== 'true' ? '非空' : <EmptyLabel />)}</div>
                                    </div>
                                    :
                                    <div>
                                        {
                                            this.state.queryInfo.source ?
                                                <div className='rowSpanTable'>
                                                    <div>
                                                        {this.state.queryInfo.source == 1 ?
                                                            <div className='LineClamp'><span className={record.diffDetail['非空'].altered ? 'diffItem' : ''}>{record.diffDetail['非空'].before !== 'true' ? '非空' : <EmptyLabel />}</span></div>
                                                            :
                                                            <div className='LineClamp'><span className={record.diffDetail['非空'].altered ? 'diffItem' : ''}>{record.diffDetail['非空'].after !== 'true' ? '非空' : <EmptyLabel />}</span></div>
                                                        }
                                                    </div>
                                                </div>
                                                :
                                                <div  className='rowSpanTable'>
                                                    <div className='LineClamp'><span className={record.diffDetail['非空'].altered ? 'diffItem' : ''}>{record.diffDetail['非空'].before !== 'true' ? '非空' : <EmptyLabel />}</span></div>
                                                    <div className='LineClamp'><span className={record.diffDetail['非空'].altered ? 'diffItem' : ''}>{record.diffDetail['非空'].after !== 'true' ? '非空' : <EmptyLabel />}</span></div>
                                                </div>
                                        }
                                    </div>
                            }
                        </div>
                    )
                }
            },
            {
                title: '字段位置',
                dataIndex: 'ds_name',
                key: 'ds_name',
                width: 100,
                render: (text, record) => {
                    return (
                        <div>
                            {
                                record.status !== 'UPDATED' ?
                                    <div className='rowSpanTable'>
                                        <div>
                                            <Tooltip title={record.status == 'DELETED' ? record.diffDetail['字段位置'].before : record.diffDetail['字段位置'].after}>
                                                <span className='LineClamp'>{record.status == 'DELETED' ? (record.diffDetail['字段位置'].before || <EmptyLabel />) : (record.diffDetail['字段位置'].after || <EmptyLabel />)}</span>
                                            </Tooltip>
                                        </div>
                                    </div>
                                    :
                                    <div>
                                    {
                                        this.state.queryInfo.source ?
                                        <div className='rowSpanTable'>
                                            <div>
                                                {this.state.queryInfo.source == 1 ?
                                                    <div>
                                                        <Tooltip title={record.diffDetail['字段位置'].before}>
                                                            <span className={record.diffDetail['字段位置'].altered ? 'diffItem LineClamp' : 'LineClamp'}>{record.diffDetail['字段位置'].before || <EmptyLabel />}</span>
                                                        </Tooltip>
                                                    </div>
                                                    :
                                                    <div>
                                                        <Tooltip title={record.diffDetail['字段位置'].after}>
                                                            <span className={record.diffDetail['字段位置'].altered ? 'diffItem LineClamp' : 'LineClamp'}>{record.diffDetail['字段位置'].after || <EmptyLabel />}</span>
                                                        </Tooltip>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        :
                                        <div  className='rowSpanTable'>
                                            <div>
                                                <Tooltip title={record.diffDetail['字段位置'].before}>
                                                    <span className={record.diffDetail['字段位置'].altered ? 'diffItem LineClamp' : 'LineClamp'}>{record.diffDetail['字段位置'].before || <EmptyLabel />}</span>
                                                </Tooltip>
                                            </div>
                                            <div>
                                                <Tooltip title={record.diffDetail['字段位置'].after}>
                                                    <span className={record.diffDetail['字段位置'].altered ? 'diffItem LineClamp' : 'LineClamp'}>{record.diffDetail['字段位置'].after || <EmptyLabel />}</span>
                                                </Tooltip>
                                            </div>
                                        </div>
                            }
                                </div>
                            }
                        </div>
                    )
                }
            },
        ]
        this.codeItemColumns = [
            {
                title: '代码值',
                dataIndex: 'name',
                key: 'name',
                width: 180,
                render: (text, record, index) => text ? (
                    <Tooltip placement='topLeft' title={text}>
                            <span className='LineClamp'>
                                <span style={{ display: 'flex' }}>
                                    <span
                                        className={record.status == 'UPDATED' ? 'typeTag updateTag' : (record.status == 'DELETED' ? 'typeTag deleteTag' : (record.status == 'REMAIN' ? 'typeTag remainTag' : 'typeTag'))}
                                    >
                                        {record.status == 'UPDATED' ? '改' : (record.status == 'DELETED' ? '删' : (record.status == 'REMAIN' ? '同' : '增'))}
                                    </span>
                                    <span>{text}</span>
                                </span>
                            </span>
                    </Tooltip>
                ) : <EmptyLabel />
            },
            {
                title: '来源',
                dataIndex: 'ds_name',
                key: 'ds_name',
                render: (text, record) => {
                    return (
                        <div>
                            {
                                this.state.queryInfo.source ?
                                    <div className='rowSpanTable'>
                                        <div>{this.state.queryInfo.source == 1 ? '参照系统' : '对比系统'}</div>
                                    </div>
                                    :
                                    <div  className='rowSpanTable'>
                                        <div>参照系统</div>
                                        <div>对比系统</div>
                                    </div>
                            }
                        </div>
                    )
                }
            },
            {
                title: '属性名称',
                dataIndex: 'ds_name',
                key: 'ds_name',
                render: (text, record) => {
                    return (
                        <div>
                            {
                                record.status !== 'UPDATED' ?
                                    <div className='rowSpanTable'>
                                        <div>
                                            <Tooltip title={record.status == 'DELETED' ? record.diffDetail['代码值名称'].before : record.diffDetail['代码值名称'].after}>
                                                <span className='LineClamp'>{record.status == 'DELETED' ? (record.diffDetail['代码值名称'].before || <EmptyLabel />) : (record.diffDetail['代码值名称'].after || <EmptyLabel />)}</span>
                                            </Tooltip>
                                        </div>
                                    </div>
                                    :
                                    <div>
                                    {
                                        this.state.queryInfo.source ?
                                        <div className='rowSpanTable'>
                                            <div>
                                                {this.state.queryInfo.source == 1 ?
                                                    <div>
                                                        <Tooltip title={record.diffDetail['代码值名称'].before}>
                                                            <span className={record.diffDetail['代码值名称'].altered ? 'diffItem LineClamp' : 'LineClamp'}>{record.diffDetail['代码值名称'].before || <EmptyLabel />}</span>
                                                        </Tooltip>
                                                    </div>
                                                    :
                                                    <div>
                                                        <Tooltip title={record.diffDetail['代码值名称'].after}>
                                                            <span className={record.diffDetail['代码值名称'].altered ? 'diffItem LineClamp' : 'LineClamp'}>{record.diffDetail['代码值名称'].after || <EmptyLabel />}</span>
                                                        </Tooltip>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                        :
                                        <div  className='rowSpanTable'>
                                            <div>
                                                <Tooltip title={record.diffDetail['代码值名称'].before}>
                                                    <span className={record.diffDetail['代码值名称'].altered ? 'diffItem LineClamp' : 'LineClamp'}>{record.diffDetail['代码值名称'].before || <EmptyLabel />}</span>
                                                </Tooltip>
                                            </div>
                                            <div>
                                                <Tooltip title={record.diffDetail['代码值名称'].after}>
                                                    <span className={record.diffDetail['代码值名称'].altered ? 'diffItem LineClamp' : 'LineClamp'}>{record.diffDetail['代码值名称'].after || <EmptyLabel />}</span>
                                                </Tooltip>
                                            </div>
                                        </div>
                            }
                                </div>
                            }
                        </div>
                    )
                }
            },
        ]
        await this.setState({
            modalVisible: true,
            detailInfo: data,
            treeQueryInfo,
            drawerTitle,
            treeData: [],
            databaseFilters: filterInfo.databaseFilters,
            statusFilters: filterInfo.statusFilters,
            versionFilters: filterInfo.versionFilters ? filterInfo.versionFilters : [],
            apiName,
            queryInfo
        })

        if (this.props.from !== 'dataCompare') {
            this.getLeftTreeData()
        } else {
            if (data.status !== 'UPDATED') {
                this.columns.splice(1, 1)
                this.codeItemColumns.splice(1, 1)
            }
        }
    }
    getLeftTreeData = async () => {
        let { treeQueryInfo, treeData, apiName } = this.state
        treeQueryInfo.pageSize = 30
        let res = {}
        this.setState({treeLoading: true})
        if (apiName == 'latestDiffDetail') {
            res = await latestDiffDetail(treeQueryInfo)
        } else {
            res = await versionDiffDetail(treeQueryInfo)
        }
        this.setState({treeLoading: false})
        if (res.code == 200) {
            treeData = treeData.concat(res.data)
            this.setState({
                treeData,
                treeTotal: res.total
            })
        }
    }
    onScrollEvent = async () => {
        // let { treeQueryInfo } = this.state
        // console.log(this.scrollRef.scrollTop, this.scrollRef.clientHeight, this.scrollRef.scrollHeight)
        // if (this.scrollRef.scrollTop + this.scrollRef.clientHeight == this.scrollRef.scrollHeight) {
        //     console.info('到底了！');
        //     treeQueryInfo.page ++
        //     await this.setState({treeQueryInfo})
        //     this.getLeftTreeData()
        // }
    }
    nextPage = async () => {
        let { treeQueryInfo } = this.state
        treeQueryInfo.page ++
        await this.setState({treeQueryInfo})
        this.getLeftTreeData()
    }
    cancel = () => {
        this.setState({
            modalVisible: false
        })
    }
    getTableList = async (params = {}) => {
        let { queryInfo, detailInfo } = this.state
        let query = {
            ...queryInfo,
        }
        let array = []
        detailInfo.diffDetail.subItemDiff.map((item) => {
            item.diffDetail.itemDiff&&item.diffDetail.itemDiff.map((node) => {
                item.diffDetail[node.property] = {
                    before: node.before,
                    after: node.after,
                    altered: node.altered
                }
            })
            if (item.name.includes(queryInfo.keyword)) {
                array.push(item)
            }
        })
        let array1 = []
        if (queryInfo.status !== undefined) {
            array.map((item) => {
                if (queryInfo.status == item.status) {
                    array1.push(item)
                }
            })
        } else {
            array1 = array
        }
        console.log(array1, 'detailInfo.diffDetail.subItemDiff')
        this.setState({
            tableData: array1,
        })
        return {
            total: array1.length,
            dataSource: array1,
        }
    }
    reset = async () => {
        let { queryInfo } = this.state
        queryInfo = {
            keyword: '',
        }
        await this.setState({
            queryInfo,
        })
        this.search()
    }
    treeReset = async () => {
        let { treeQueryInfo } = this.state
        treeQueryInfo.keyword = ''
        treeQueryInfo.page = 1
        treeQueryInfo.status = undefined
        treeQueryInfo.filterDbId = undefined
        treeQueryInfo.filterVersion = undefined
        await this.setState({
            treeQueryInfo,
            // treeData: []
        })
        this.treeSearch()
    }
    changeStatus = async (name, e) => {
        let { queryInfo } = this.state
        queryInfo[name] = e
        await this.setState({
            queryInfo
        })
        this.search()
    }
    changeKeyword = async (e) => {
        let { queryInfo } = this.state
        queryInfo.keyword = e.target.value
        await this.setState({
            queryInfo
        })
        if (!e.target.value) {
            this.search()
        }
    }
    changeTreeKeyword = async (e) => {
        let { treeQueryInfo } = this.state
        treeQueryInfo.keyword = e.target.value
        await this.setState({
            treeQueryInfo,
            // treeData: []
        })
        if (!e) {
            this.treeSearch()
        }
    }
    changeTreeSelect = async (name, e) => {
        let { treeQueryInfo } = this.state
        treeQueryInfo[name] = e
        await this.setState({
            treeQueryInfo,
        })
        this.treeSearch()
    }
    treeSearch = async () => {
        let { treeQueryInfo } = this.state
        treeQueryInfo.page = 1
        document.querySelector(".tableArea").scrollTop = 0
        await this.setState({
            filterVisible: false,
            treeQueryInfo,
            treeData: []
        })
        this.getLeftTreeData()
    }
    search = () => {
        if (this.controller) {
            this.controller.reset()
        }
    }
    onSelect = async (data) => {
        data.diffDetail.itemDiff&&data.diffDetail.itemDiff.map((item) => {
            data.diffDetail[item.property] = {
                before: item.before,
                after: item.after,
                altered: item.altered
            }
        })
        await this.setState({
            detailInfo: data
        })
        this.reset()
    }
    renderTreeFilter = () => {
        let { treeQueryInfo, databaseFilters, statusFilters, versionFilters } = this.state
        return (
            <div className='EditMiniForm Grid1' style={{ width: 280 }}>
                {RenderUtil.renderFormItems([
                    {
                        label: '变更状态',
                        content: <Select
                            style={{width: '100%'}}
                            onChange={this.changeTreeSelect.bind(this, 'status')}
                            value={treeQueryInfo.status}
                            placeholder='请选择'
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                        >
                            {
                                statusFilters.map((item) => {
                                    return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                                })
                            }
                        </Select>,
                    },
                    {
                        label: '数据库',
                        content: <Select
                            style={{width: '100%'}}
                            onChange={this.changeTreeSelect.bind(this, 'filterDbId')}
                            value={treeQueryInfo.filterDbId}
                            placeholder='请选择'
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                        >
                            {
                                databaseFilters.map((item) => {
                                    return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                                })
                            }
                        </Select>,
                    },
                    {
                        label: '系统版本',
                        hide: this.props.from !== 'version',
                        content: <Select
                            style={{width: '100%'}}
                            onChange={this.changeTreeSelect.bind(this, 'filterVersion')}
                            value={treeQueryInfo.filterVersion}
                            placeholder='请选择'
                            getPopupContainer={triggerNode => triggerNode.parentNode}
                        >
                            {
                                versionFilters.map((item) => {
                                    return (<Option key={item.id} value={item.id}>{item.name}</Option>)
                                })
                            }
                        </Select>,
                    },
                ])}
                <div className='Grid2' style={{ columnGap: '8px' }}>
                    <Button type='primary' onClick={this.treeSearch}>确定</Button>
                    <Button onClick={this.treeReset}>重置</Button>
                </div>
            </div>
        )
    }
    changeFilterVisible = (e) => {
        this.setState({
            filterVisible: e
        })
    }
    openInput = (e) => {
        e.nativeEvent.stopImmediatePropagation()
        this.setState({showInput: true})
        this.searchInput.focus()
    }
    renderDesc = (value, name) => {
        return <CollapseLabel ref={(dom) => (this[name] = dom)} value={value}/>
    }
    render() {
        const {
            modalVisible,
            detailInfo,
            loading,
            folded,
            queryInfo,
            treeQueryInfo,
            tableData,
            treeData,
            showInput,
            filterVisible,
            drawerTitle,
            treeLoading,
            treeTotal
        } = this.state
        const { showSlider, from } = this.props
        let remained = 0
        let created = 0
        let deleted = 0
        let updated = 0
        tableData.map((item) => {
            if (item.status == 'REMAIN') {
                remained ++
            }
            if (item.status == 'CREATED') {
                created ++
            }
            if (item.status == 'UPDATED') {
                updated ++
            }
            if (item.status == 'DELETED') {
                deleted ++
            }
        })
        let targetDsName = drawerTitle.split('/')[0]
        return (
            <DrawerLayout
                drawerProps={{
                    className: 'changeDetailDrawer changeManage',
                    title: drawerTitle,
                    width: 1180,
                    visible: modalVisible,
                    onClose: this.cancel,
                    maskClosable: true
                }}
            >
                {modalVisible && (
                    <React.Fragment>
                        <div className={folded ? 'sliderLayoutFoled sliderLayout' : 'sliderLayout'}>
                            {/* 左侧 */}
                            {
                                showSlider ?
                                    <div className='slider'>
                                        {/* 搜索 */}
                                        <div className='leftHeader'>
                                            {!showInput ? <div className='headerTitle'>{detailInfo.type == 'table' ? '变更数据表' : '变更代码项'}</div> : null}
                                            <div style={{ height: 48 }}>
                                                <div className='collapseInput' style={{ width: showInput ? '180px' : '0px' }} onClick={(e) => e.nativeEvent.stopImmediatePropagation()}>
                                                    <Input.Search
                                                        allowClear
                                                        style={{ width: '99%' }}
                                                        value={treeQueryInfo.keyword}
                                                        onChange={this.changeTreeKeyword}
                                                        onSearch={this.treeSearch}
                                                        ref={(refs) => this.searchInput = refs}
                                                        placeholder={detailInfo.type == 'table' ? '请输入表名称' : '请输入代码项'}
                                                    />
                                                </div>
                                                {
                                                    !showInput ? <span onClick={this.openInput} className='iconfont icon-sousuo'></span> : null
                                                }
                                                <Popover
                                                    onVisibleChange={this.changeFilterVisible}
                                                    visible={filterVisible}
                                                    placement='bottom'
                                                    arrowPointAtCenter={true}
                                                    content={this.renderTreeFilter()}
                                                    title=""
                                                    overlayClassName='filterPopover'
                                                    trigger='click'
                                                >
                                                    <span className='iconfont icon-Filter'></span>
                                                </Popover>
                                            </div>
                                        </div>
                                        {treeQueryInfo.filterDbId || treeQueryInfo.status || treeQueryInfo.filterVersion ? <div className='triangle'></div> : null}
                                        {/* 列表 */}
                                        <div className='HideScroll tableArea' id='scroller'>
                                            <InfiniteScroll
                                                dataLength={treeTotal}
                                                hasMore={treeData.length < treeTotal}
                                                scrollableTarget='scroller'
                                                loader={<Skeleton/>}
                                                next={() => {
                                                    this.nextPage()
                                                }}
                                                endMessage={<Divider plain>我是有底线的</Divider>}
                                            >
                                                <Spin spinning={treeLoading}>
                                                    {
                                                        treeData.map((item) => {
                                                            return (
                                                                <div onClick={this.onSelect.bind(this, item)} className={detailInfo.id == item.id ? 'tableItem tableItemSelected' : 'tableItem'}>
                                                                    {item.name}
                                                                    {
                                                                        from == 'change' ?
                                                                            <div style={{ color: '#5E6266', marginTop: 2 }}>
                                                                                <span style={{ marginRight: 8 }} className='iconfont icon-ku'></span>{item.databaseName}
                                                                            </div>
                                                                            :
                                                                            <div style={{ color: '#5E6266', marginTop: 2 }}>
                                                                                <span style={{ marginRight: 8 }} className='iconfont icon-banben'></span>{item.version}
                                                                            </div>
                                                                    }
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </Spin>
                                            </InfiniteScroll>
                                        </div>
                                    </div>
                                    : null
                            }
                            <main>
                                {
                                    showSlider ?
                                        <IconFont
                                            type={folded ? 'icon-you' : 'icon-zuo'}
                                            className='IconFold'
                                            onClick={() => {
                                                this.setState({ folded: !folded })
                                            }}
                                        />
                                        : null
                                }
                                <div className='ContentContainer commonScroll'>
                                    <div className='detailHeader'>
                                        <div className='iconHead'
                                             style={{ background: detailInfo.status == 'UPDATED' ? '#FF9900' : (detailInfo.status == 'DELETED' ? '#FF4D4F' : (detailInfo.status == 'REMAIN' ? '#3A9DFF' : '#28AE52')) }}
                                        >{detailInfo.status == 'UPDATED' ? '修改' : (detailInfo.status == 'DELETED' ? '删除' : (detailInfo.status == 'REMAIN' ? '相同' : '新增'))}</div>
                                        <div className={from == 'dataCompare' ? 'diffItemContent' : ''}>
                                            <div className='detailTitle'>{detailInfo.name}{detailInfo.databaseName ? <Tooltip title="数据库">（{detailInfo.databaseName}）</Tooltip> : null}</div>
                                            {
                                                detailInfo.type == 'table' ?
                                                    <div className='detailContent'>
                                                        <div>
                                                            <span className='label'>备注</span>
                                                            <span className='value'>
                                                                {detailInfo.status == 'UPDATED' ? <span>
                                                                    {
                                                                        detailInfo.diffDetail['表备注'].altered ?
                                                                            <span>
                                                                                <Tooltip title={'旧数据：' + detailInfo.diffDetail['表备注'].before}>
                                                                                    <span className={detailInfo.diffDetail['表备注'].altered ? 'diffItem collapseLabel' : 'collapseLabel'}>{detailInfo.diffDetail['表备注'].before || <EmptyLabel />}</span>
                                                                                </Tooltip>
                                                                                <span style={{ margin: '0 8px' }} className="iconfont icon-jiantou"></span>
                                                                                <Tooltip title={'新数据：' + detailInfo.diffDetail['表备注'].after}>
                                                                                    <span className={detailInfo.diffDetail['表备注'].altered ? 'diffItem collapseLabel' : 'collapseLabel'}>{detailInfo.diffDetail['表备注'].after || <EmptyLabel />}</span>
                                                                                </Tooltip>
                                                                            </span>
                                                                            :
                                                                            <Tooltip title={'新数据：' + detailInfo.diffDetail['表备注'].after}>
                                                                                <span className={detailInfo.diffDetail['表备注'].altered ? 'diffItem collapseLabel' : 'collapseLabel'}>{detailInfo.diffDetail['表备注'].after || <EmptyLabel />}</span>
                                                                            </Tooltip>
                                                                    }
                                                                </span> : null}
                                                                {detailInfo.status == 'DELETED' || detailInfo.status == 'REMAIN' ? <Tooltip title={'旧数据：' + detailInfo.diffDetail['表备注'].before}><span className='collapseLabel'>{detailInfo.diffDetail['表备注'].before || <EmptyLabel />}</span></Tooltip> : null}
                                                                {detailInfo.status == 'CREATED' ? <Tooltip title={'新数据：' + detailInfo.diffDetail['表备注'].after}><span className='collapseLabel'>{detailInfo.diffDetail['表备注'].after || <EmptyLabel />}</span></Tooltip> : null}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className='label'>主键字段</span>
                                                            <span className='value'>
                                                                {detailInfo.status == 'UPDATED' ? <span>
                                                                    {
                                                                        detailInfo.diffDetail['表主键字段'].altered ?
                                                                            <span>
                                                                                <Tooltip title={'旧数据：' + detailInfo.diffDetail['表主键字段'].before}>
                                                                                    <span className={detailInfo.diffDetail['表主键字段'].altered ? 'diffItem' : ''}>{detailInfo.diffDetail['表主键字段'].before || <EmptyLabel />}</span>
                                                                                </Tooltip>
                                                                                <span style={{ margin: '0 8px' }} className="iconfont icon-jiantou"></span>
                                                                                <Tooltip title={'新数据：' + detailInfo.diffDetail['表主键字段'].after}>
                                                                                    <span className={detailInfo.diffDetail['表主键字段'].altered ? 'diffItem' : ''}>{detailInfo.diffDetail['表主键字段'].after || <EmptyLabel />}</span>
                                                                                </Tooltip>
                                                                            </span>
                                                                            :
                                                                            <Tooltip title={'新数据：' + detailInfo.diffDetail['表主键字段'].after}>
                                                                                <span className={detailInfo.diffDetail['表主键字段'].altered ? 'diffItem' : ''}>{detailInfo.diffDetail['表主键字段'].after || <EmptyLabel />}</span>
                                                                            </Tooltip>
                                                                    }
                                                                </span> : null}
                                                                {detailInfo.status == 'DELETED' || detailInfo.status == 'REMAIN' ? <Tooltip title={'旧数据：' + detailInfo.diffDetail['表主键字段'].before}>{detailInfo.diffDetail['表主键字段'].before || <EmptyLabel />}</Tooltip> : null}
                                                                {detailInfo.status == 'CREATED' ? <Tooltip title={'新数据：' + detailInfo.diffDetail['表主键字段'].after}>{detailInfo.diffDetail['表主键字段'].after || <EmptyLabel />}</Tooltip> : null}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className='label'>字段个数</span>
                                                            <span className='value'>
                                                                {detailInfo.status == 'UPDATED' ? <span>
                                                                    {
                                                                        detailInfo.diffDetail['字段个数'].altered ?
                                                                            <span>
                                                                               <Tooltip title={'旧数据：' + detailInfo.diffDetail['字段个数'].before}>
                                                                                   <span className={detailInfo.diffDetail['字段个数'].altered ? 'diffItem' : ''}>{detailInfo.diffDetail['字段个数'].before || <EmptyLabel />}</span>
                                                                               </Tooltip>
                                                                                <span style={{ margin: '0 8px' }} className="iconfont icon-jiantou"></span>
                                                                                <Tooltip title={'新数据：' + detailInfo.diffDetail['字段个数'].after}>
                                                                                    <span className={detailInfo.diffDetail['字段个数'].altered ? 'diffItem' : ''}>{detailInfo.diffDetail['字段个数'].after || <EmptyLabel />}</span>
                                                                                </Tooltip>
                                                                            </span>
                                                                            :
                                                                            <Tooltip title={'新数据：' + detailInfo.diffDetail['字段个数'].after}>
                                                                                <span className={detailInfo.diffDetail['字段个数'].altered ? 'diffItem' : ''}>{detailInfo.diffDetail['字段个数'].after || <EmptyLabel />}</span>
                                                                            </Tooltip>
                                                                    }
                                                                </span> : null}
                                                                {detailInfo.status == 'DELETED' || detailInfo.status == 'REMAIN' ? <Tooltip title={'旧数据：' + detailInfo.diffDetail['字段个数'].before}>{detailInfo.diffDetail['字段个数'].before || <EmptyLabel />}</Tooltip> : null}
                                                                {detailInfo.status == 'CREATED' ? <Tooltip title={'新数据：' + detailInfo.diffDetail['字段个数'].after}>{detailInfo.diffDetail['字段个数'].after || <EmptyLabel />}</Tooltip> : null}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div className='detailContent'>
                                                        <div>
                                                            <span className='label'>代码值数量</span>
                                                            <span className='value'>
                                                                {detailInfo.status == 'UPDATED' ? <span>
                                                                    <Tooltip title={'旧数据：' + detailInfo.diffDetail['代码值个数'].before}>
                                                                        <span className={detailInfo.diffDetail['代码值个数'].altered ? 'diffItem' : ''}>{detailInfo.diffDetail['代码值个数'].before || <EmptyLabel />}</span>
                                                                    </Tooltip>
                                                                    <span style={{ margin: '0 8px' }} className="iconfont icon-jiantou"></span>
                                                                    <Tooltip title={'新数据：' + detailInfo.diffDetail['代码值个数'].after}>
                                                                        <span className={detailInfo.diffDetail['代码值个数'].altered ? 'diffItem' : ''}>{detailInfo.diffDetail['代码值个数'].after || <EmptyLabel />}</span>
                                                                    </Tooltip>
                                                                </span> : null}
                                                                {detailInfo.status == 'DELETED' || detailInfo.status == 'REMAIN' ? <Tooltip title={'旧数据：' + detailInfo.diffDetail['代码值个数'].before}>{detailInfo.diffDetail['代码值个数'].before || <EmptyLabel />}</Tooltip> : null}
                                                                {detailInfo.status == 'CREATED' ? <Tooltip title={'新数据：' + detailInfo.diffDetail['代码值个数'].after}>{detailInfo.diffDetail['代码值个数'].after || <EmptyLabel />}</Tooltip> : null}
                                                            </span>
                                                        </div>
                                                    </div>
                                            }
                                        </div>
                                    </div>
                                    <RichTableLayout
                                        disabledDefaultFooter
                                        renderDetail={() => {
                                            return (
                                                <div className='desc'>
                                                    {
                                                        from == 'dataCompare' ?
                                                            <div>
                                                                {
                                                                    detailInfo.type == 'table' ?
                                                                        <span>
                                                                            {detailInfo.status == 'UPDATED' ? <span>相同字段 {remained} 项，差异字段 {updated} 项，增多字段 {created} 项，减少字段 {deleted} 项</span> : null}
                                                                            {detailInfo.status == 'REMAIN' ? <span>相同字段 {remained} 项</span> : null}
                                                                            {detailInfo.status == 'DELETED' ? <span>缺少字段 {deleted} 项</span> : null}
                                                                            {detailInfo.status == 'CREATED' ? <span>增多字段 {created} 项</span> : null}
                                                                        </span>
                                                                        :
                                                                        <span>
                                                                            {detailInfo.status == 'UPDATED' ? <span>代码值：相同 {remained} 项，差异 {updated} 项，增多 {created} 项，减少 {deleted} 项</span> : null}
                                                                            {detailInfo.status == 'REMAIN' ? <span>相同 {remained} 项</span> : null}
                                                                            {detailInfo.status == 'DELETED' ? <span>缺少 {deleted} 项</span> : null}
                                                                            {detailInfo.status == 'CREATED' ? <span>增多 {created} 项</span> : null}
                                                                        </span>
                                                                }
                                                                {
                                                                    detailInfo.status == 'CREATED' || detailInfo.status == 'DELETED' ? <span style={{ float: 'right', color: '#5E6266' }}>来源于对比系统：{targetDsName}</span> : null
                                                                }
                                                            </div>
                                                            :
                                                            <div>
                                                                {
                                                                    detailInfo.type == 'table' ?
                                                                        <span>
                                                                            {detailInfo.status == 'UPDATED' ? <span>新增字段 {created} 项，删除字段 {deleted} 项，修改字段 {updated} 项</span> : null}
                                                                            {detailInfo.status == 'DELETED' ? <span>删除字段 {deleted} 项</span> : null}
                                                                            {detailInfo.status == 'CREATED' ? <span>新增字段 {created} 项</span> : null}
                                                                        </span>
                                                                        :
                                                                        <span>
                                                                            {detailInfo.status == 'UPDATED' ? <span>新增代码值 {created} 项，删除代码值 {deleted} 项，修改代码值 {updated} 项</span> : null}
                                                                            {detailInfo.status == 'DELETED' ? <span>删除代码值 {deleted} 项</span> : null}
                                                                            {detailInfo.status == 'CREATED' ? <span>新增代码值 {created} 项</span> : null}
                                                                        </span>
                                                                }
                                                                {
                                                                    detailInfo.status == 'UPDATED' ? <span style={{ float: 'right', color: '#5E6266' }}>说明：表格只显示有变更的内容</span> : null
                                                                }
                                                            </div>
                                                    }
                                                </div>
                                            )
                                        }}
                                        editColumnProps={{
                                            hidden: true
                                        }}
                                        tableProps={{
                                            // columns:this.changeColumns,
                                            columns: from == 'dataCompare' ? (detailInfo.type == 'table' ? this.columns : this.codeItemColumns) : (detailInfo.type == 'table' ? this.changeColumns : this.changeCodeItemColumns),
                                            key: 'id',
                                            dataSource: tableData,
                                            extraTableProps: {
                                                bordered: true,
                                                scroll: {x: 'auto' }
                                            }
                                        }}
                                        renderSearch={(controller) => {
                                            this.controller = controller
                                            return (
                                                <React.Fragment>
                                                    <Input.Search
                                                        allowClear
                                                        style={{ width: 380 }}
                                                        value={queryInfo.keyword}
                                                        onChange={this.changeKeyword}
                                                        onSearch={this.search}
                                                        placeholder={detailInfo.type == 'table' ? '请输入字段名' : '请输入代码值'}
                                                    />
                                                    {
                                                        from !== 'dataCompare' && detailInfo.status == 'UPDATED' ?
                                                            <Select
                                                                allowClear
                                                                onChange={this.changeStatus.bind(
                                                                    this,
                                                                    'status'
                                                                )}
                                                                value={queryInfo.status}
                                                                placeholder='变更类型'
                                                            >
                                                                <Select.Option key={1} value='CREATED'>新增</Select.Option>
                                                                <Select.Option key={2} value='DELETED'>删除</Select.Option>
                                                                <Select.Option key={3} value='UPDATED'>修改</Select.Option>
                                                            </Select>
                                                            : null
                                                    }
                                                    {
                                                        from == 'dataCompare' && detailInfo.status == 'UPDATED' ?
                                                            <Select
                                                                allowClear
                                                                onChange={this.changeStatus.bind(
                                                                    this,
                                                                    'status'
                                                                )}
                                                                value={queryInfo.status}
                                                                placeholder='对比结果'
                                                            >
                                                                <Select.Option key={1} value='CREATED'>新增</Select.Option>
                                                                <Select.Option key={2} value='DELETED'>删除</Select.Option>
                                                                <Select.Option key={3} value='UPDATED'>修改</Select.Option>
                                                                <Select.Option key={4} value='REMAIN'>相同</Select.Option>
                                                            </Select>
                                                            : null
                                                    }
                                                    {
                                                        from == 'dataCompare' && detailInfo.status == 'UPDATED' ?
                                                            <Select
                                                                allowClear
                                                                onChange={this.changeStatus.bind(
                                                                    this,
                                                                    'source'
                                                                )}
                                                                value={queryInfo.source}
                                                                placeholder='来源'
                                                            >
                                                                <Select.Option key={1} value={1}>参照系统</Select.Option>
                                                                <Select.Option key={2} value={2}>对比系统</Select.Option>
                                                            </Select>
                                                            : null
                                                    }
                                                    <Button onClick={this.reset}>重置</Button>
                                                </React.Fragment>
                                            )
                                        }}
                                        requestListFunction={(page, pageSize, filter, sorter) => {
                                            return this.getTableList({
                                                pagination: {
                                                    page,
                                                    page_size: pageSize,
                                                }
                                            })
                                        }}
                                    />
                                </div>
                            </main>
                        </div>
                    </React.Fragment>
                )}
            </DrawerLayout>
        )
    }
}