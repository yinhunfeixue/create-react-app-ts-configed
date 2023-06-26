import TableLayout from '@/component/layout/TableLayout'
import React, { Component } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Select, message } from 'antd'
import './index.less'
import { dwappLevel, dwappLevelTags, dwappLevelSave } from 'app_api/systemManage'
import DrawerLayout from '@/component/layout/DrawerLayout'
import DragSortingTable from '@/app/datamodeling/ddl/dragSortTable'
import PermissionWrap from '@/component/PermissionWrap'
import moment from 'moment'

export default class DataWareLevel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            levelInfo: [],
            tagList: [],
            existTagList: [],
            loading: false,
            btnLoading: false,
            modalVisible: false,
            editInfo: {
                tagInfos: [],
            },
            editIndex: 0,
            dragTableLoading: false,
        }
        this.columns = [
            {
                dataIndex: 'tagValueId',
                key: 'tagValueId',
                title: '业务描述',
                render: (text, record, index) => {
                    return (
                        <Select style={{ width: '100%' }} onChange={this.changeSelect.bind(this, index)} value={text} placeholder='请选择'>
                            {this.state.tagList.map((item) => {
                                return (
                                    <Select.Option disabled={item.disabled == true} value={item.tagValueId} key={item.tagValueId}>
                                        {item.tagValueName}
                                    </Select.Option>
                                )
                            })}
                        </Select>
                    )
                },
            },
            {
                dataIndex: 'x',
                key: 'x',
                title: '操作',
                width: 80,
                render: (text, record, index) => {
                    return <a onClick={this.delData.bind(this, index)}>删除</a>
                },
            },
        ]
    }
    componentWillMount = () => {
        this.getDwappLevel()
        this.getTags()
    }
    getDwappLevel = async () => {
        let { existTagList } = this.state
        existTagList = []
        let res = await dwappLevel()
        if (res.code == 200) {
            res.data.map((item, index) => {
                item.tagInfos = item.tagInfos ? item.tagInfos : []
                item.tagInfos.map((tag) => {
                    tag.tagIndex = index
                    existTagList.push(tag)
                })
            })
            this.setState({
                levelInfo: res.data,
                existTagList,
            })
        }
    }
    getTags = async () => {
        let res = await dwappLevelTags()
        if (res.code == 200) {
            this.setState({
                tagList: res.data,
            })
        }
    }
    getDisableTag = () => {
        let { existTagList, tagList, editInfo, editIndex } = this.state
        let array = []
        existTagList.map((item) => {
            if (item.tagIndex !== editIndex) {
                array.push(item)
            }
        })
        array = array.concat(editInfo.tagInfos)
        tagList.map((item) => {
            item.disabled = false
        })
        tagList.map((item) => {
            array.map((tag) => {
                if (item.tagValueId == tag.tagValueId) {
                    item.disabled = true
                }
            })
        })
        console.log(array, 'getDisableTag')
        this.setState({
            tagList,
            existTagList: array,
        })
    }
    changeSelect = async (index, e) => {
        let { editInfo } = this.state
        // let hasTag = false
        // editInfo.tagInfos.map((tag) => {
        //     if (tag.tagValueId == e) {
        //         hasTag = true
        //     }
        // })
        // if (hasTag) {
        //     message.info('标签不能重复')
        //     return
        // }
        editInfo.tagInfos[index].tagValueId = e
        await this.setState({
            editInfo,
        })
        this.getDisableTag()
    }
    cancel = () => {
        this.setState({
            modalVisible: false,
        })
        this.getDwappLevel()
    }
    openModal = async (data, index) => {
        console.log(data, 'openModal')
        let { editInfo, levelInfo } = this.state
        data.tagInfos = data.tagInfos ? data.tagInfos : []
        editInfo.id = data.id
        editInfo.name = data.name
        editInfo.size = data.size
        editInfo.tagInfos = []
        data.tagInfos.map((item) => {
            item.id = item.tagValueId
            editInfo.tagInfos.push(item)
        })
        await this.setState({
            modalVisible: true,
            editInfo,
            editIndex: index,
        })
        this.getDisableTag()
    }
    postData = async () => {
        let { editInfo, editIndex, levelInfo } = this.state
        let hasEmpty = false
        editInfo.size = editInfo.tagInfos.length
        if (editInfo.tagInfos.length) {
            editInfo.tagInfos.map((tag) => {
                if (!tag.tagValueId) {
                    hasEmpty = true
                }
            })
        } else {
            hasEmpty = true
        }
        if (hasEmpty) {
            message.info('有未设置的层级')
            return
        }
        let query = [...levelInfo]
        query[editIndex] = editInfo
        this.setState({ btnLoading: true })
        let res = await dwappLevelSave(query)
        this.setState({ btnLoading: false })
        if (res.code == 200) {
            message.success('保存成功')
            this.cancel()
            this.getTags()
        }
    }
    delData = async (index) => {
        let { editInfo, existTagList, editIndex } = this.state
        this.setState({ dragTableLoading: true })
        editInfo.tagInfos.splice(index, 1)
        await this.setState({
            editInfo,
            existTagList,
        })
        this.setState({ dragTableLoading: false })
        this.getDisableTag()
    }
    addData = async () => {
        let { editInfo, editIndex } = this.state
        this.setState({ dragTableLoading: true })
        editInfo.tagInfos.push({ tagValueId: undefined, id: moment().format('X'), tagIndex: editIndex })
        await this.setState({
            editInfo,
        })
        this.setState({ dragTableLoading: false })
        this.getDisableTag()
    }
    getSortData = (data) => {
        let { editInfo } = this.state
        editInfo.tagInfos = [...data]
        this.setState({
            editInfo,
        })
    }
    render() {
        const { levelInfo, dragTableLoading, btnLoading, modalVisible, editInfo } = this.state
        return (
            <div className='dataWareLevel'>
                <TableLayout
                    title='数仓层级'
                    renderDetail={() => {
                        return (
                            <div style={{ display: 'flex', marginBottom: 20 }}>
                                {levelInfo.map((item, index) => {
                                    return (
                                        <div className='levelContainer'>
                                            <div className='levelItem'>
                                                <div className='borderTop'></div>
                                                <div className='levelTitle'>
                                                    <span>
                                                        {item.name}（{item.tagInfos ? item.tagInfos.length : 0}）
                                                    </span>
                                                    <PermissionWrap funcCode='/setting/dw_layer/def/edit'>
                                                        <div onClick={this.openModal.bind(this, item, index)} className='iconfont icon-bianjifill'></div>
                                                    </PermissionWrap>
                                                </div>
                                                <div style={{ padding: '4px 16px' }}>
                                                    {item.tagInfos &&
                                                        item.tagInfos.map((tag, index1) => {
                                                            return <div className='tagItem'>{tag.tagValueName}</div>
                                                        })}
                                                    {!item.tagInfos.length ? <div style={{ color: '#666', fontSize: '14px', marginTop: 30, textAlign: 'center' }}>当前层级没有内容</div> : null}
                                                </div>
                                            </div>
                                            {index + 1 !== levelInfo.length ? (
                                                <div className='arrowArea'>
                                                    <img src={require('app_images/dataWareLevel/arrow.png')} />
                                                </div>
                                            ) : null}
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    }}
                />
                <DrawerLayout
                    drawerProps={{
                        className: 'addLevelDrawer',
                        title: editInfo.name + '编辑',
                        width: 480,
                        visible: modalVisible,
                        onClose: this.cancel,
                        maskClosable: false,
                    }}
                    renderFooter={() => {
                        return (
                            <React.Fragment>
                                <Button loading={btnLoading} onClick={this.postData} type='primary'>
                                    确定
                                </Button>
                                <Button onClick={this.cancel}>取消</Button>
                            </React.Fragment>
                        )
                    }}
                >
                    {modalVisible && (
                        <React.Fragment>
                            <div style={{ color: '#9EA3A8', marginBottom: 16 }}>长按可拖拽列表顺序</div>
                            {!dragTableLoading && (
                                <DragSortingTable
                                    className='dataTableColumn'
                                    rowkey='id'
                                    columns={this.columns}
                                    dataSource={editInfo.tagInfos}
                                    getSortData={this.getSortData}
                                    canMove={true}
                                    from='dataTable'
                                />
                            )}
                            <Button onClick={this.addData} className='tableAddBtn' type='link' icon={<PlusOutlined />}>
                                添加
                            </Button>
                        </React.Fragment>
                    )}
                </DrawerLayout>
            </div>
        )
    }
}
