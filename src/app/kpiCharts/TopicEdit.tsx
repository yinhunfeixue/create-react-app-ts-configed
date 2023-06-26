import { requestAddTopic, requestBoardList, requestBoardSettingList, requestEditTopic } from '@/api/kpiChartApi'
import AddBoard from '@/app/kpiCharts/components/AddBoard'
import BoardEdit from '@/app/kpiCharts/components/BoardEdit'
import BoardGroup from '@/app/kpiCharts/components/BoardGroup'
import IBoard from '@/app/kpiCharts/interface/IBoard'
import IBoardData from '@/app/kpiCharts/interface/IBoardData'
import IBoardSetting from '@/app/kpiCharts/interface/IBoardSetting'
import IBoardType from '@/app/kpiCharts/interface/IBoardType'
import ITopic from '@/app/kpiCharts/interface/ITopic'
import IComponentProps from '@/base/interfaces/IComponentProps'
import IconFont from '@/component/IconFont'
import DrawerLayout from '@/component/layout/DrawerLayout'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Empty, Form, FormInstance, Input, message, Select, Skeleton } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import React, { Component } from 'react'
import './TopicEdit.less'

interface ITopicEditState {
    visibleAddBoard: boolean
    selectedBoardType?: IBoardType
    loadingSave: boolean
    loadingData: boolean
    boardDataList: IBoardData[]
}
interface ITopicEditProps extends IComponentProps {
    targetTopic?: ITopic
    onClose: () => void
    onSuccess: () => void
}

/**
 * TopicEdit
 */
class TopicEdit extends Component<ITopicEditProps, ITopicEditState> {
    private topicForm = React.createRef<FormInstance>()
    constructor(props: ITopicEditProps) {
        super(props)
        this.state = {
            visibleAddBoard: false,
            loadingSave: false,
            loadingData: false,
            boardDataList: [],
        }
    }

    componentDidMount() {
        this.requestBoardList()
    }

    private async requestBoardList() {
        const { targetTopic } = this.props
        if (targetTopic) {
            const { id } = targetTopic
            this.setState({ loadingData: true })
            const boardRes = await requestBoardList(id)
            const settingRes = await requestBoardSettingList(id)
            const boardData: IBoard[] = boardRes.data
            const settingData: IBoardSetting[] = settingRes.data

            const boardDataList = boardData.map((item) => {
                return {
                    previewData: item,
                    settingData: settingData.find((settingItem) => settingItem.id === item.id) as IBoardSetting,
                }
            })
            this.setState({
                boardDataList,
                loadingData: false,
            })
        } else {
            this.setState({
                boardDataList: [],
            })
        }
    }

    btnSaveClickHandler = () => {
        const { onSuccess, targetTopic } = this.props
        const { boardDataList } = this.state
        if (this.topicForm.current) {
            this.topicForm.current.validateFields().then((value) => {
                if (!value.name) {
                    message.error('请填写主题名称')
                    return
                }

                if (!boardDataList.length) {
                    message.error('请至少添加 1 个看板')
                    return
                }

                this.setState({ loadingSave: true })
                let promise: Promise<any> | undefined
                if (targetTopic) {
                    promise = requestEditTopic({
                        ...value,
                        panelList: boardDataList.map((item) => item.settingData),
                        id: targetTopic.id,
                    })
                } else {
                    promise = requestAddTopic({
                        ...value,
                        panelList: boardDataList.map((item) => item.settingData),
                    })
                }

                if (promise) {
                    promise
                        .then((res) => {
                            const { code, msg } = res
                            if (code === 200) {
                                message.success(msg)
                                onSuccess()
                            } else {
                                message.error(msg)
                            }
                        })
                        .finally(() => {
                            this.setState({ loadingSave: false })
                        })
                }
            })
        }
    }

    private renderHeader() {
        const { onClose, targetTopic } = this.props
        const { loadingSave } = this.state
        return (
            <header>
                <div onClick={() => onClose()} className='IconBack'>
                    <IconFont type='e635' useCss />
                </div>
                <Form
                    layout='inline'
                    ref={this.topicForm}
                    initialValues={
                        targetTopic || {
                            layoutType: 0,
                        }
                    }
                >
                    <FormItem name='name'>
                        <Input placeholder='主题名称' style={{ width: 300 }} showCount maxLength={8} />
                    </FormItem>
                    <FormItem name='layoutType'>
                        <Select style={{ width: 120 }} onChange={() => this.forceUpdate()}>
                            {[
                                {
                                    label: '两栏布局',
                                    value: 0,
                                },
                                {
                                    label: '三栏布局',
                                    value: 1,
                                },
                            ].map((item) => {
                                return (
                                    <Select.Option key={item.value} value={item.value}>
                                        {item.label}
                                    </Select.Option>
                                )
                            })}
                        </Select>
                    </FormItem>
                </Form>
                <div className='Space' />
                <span className='Tip'>拖动可调整看板顺序</span>
                <Button type='primary' icon={<PlusOutlined />} disabled={loadingSave} onClick={() => this.setState({ visibleAddBoard: true })}>
                    添加面板
                </Button>
                <Button type='primary' onClick={this.btnSaveClickHandler} loading={loadingSave}>
                    保存
                </Button>
            </header>
        )
    }

    private renderTopicEdit() {
        const { selectedBoardType, boardDataList } = this.state
        return (
            selectedBoardType && (
                <BoardEdit
                    visible
                    boardType={selectedBoardType}
                    onCancel={() => {
                        this.setState({ selectedBoardType: undefined })
                    }}
                    onSave={(data) => {
                        boardDataList.push(data)
                        this.setState({ selectedBoardType: undefined, visibleAddBoard: false })
                    }}
                />
            )
        )
    }

    private renderBody() {
        const { boardDataList, loadingData } = this.state
        if (!this.topicForm.current) {
            return null
        }
        const layoutType = this.topicForm.current.getFieldValue('layoutType')
        const columnNumber = layoutType === 0 ? 2 : 3

        if (loadingData) {
            return <Skeleton active loading />
        }

        if (!boardDataList || !boardDataList.length) {
            return (
                <Empty
                    style={{ marginTop: 140 }}
                    description={
                        <div>
                            <span style={{ fontWeight: 'bold' }}>暂无卡片</span>
                            <br />
                            你可以点击右上角 添加面板
                        </div>
                    }
                    image={<IconFont type='icon-baobiaokong' style={{ fontSize: 140 }} />}
                />
            )
        }

        return (
            <div className='Body'>
                <BoardGroup
                    onDeleteItem={(id) => {
                        const newList = boardDataList.filter((item) => item.previewData.id !== id)
                        this.setState({ boardDataList: newList })
                    }}
                    dataSource={boardDataList}
                    columnNumber={columnNumber}
                    onSortChange={(oldIndex, newIndex) => {
                        const item = boardDataList[oldIndex]
                        boardDataList.splice(oldIndex, 1)
                        boardDataList.splice(newIndex, 0, item)
                        this.setState({ boardDataList: boardDataList.concat() })
                    }}
                />
            </div>
        )
    }

    render() {
        const { visibleAddBoard } = this.state
        return (
            <div className='TopicEdit'>
                {this.renderHeader()}
                {this.renderBody()}
                <DrawerLayout
                    drawerProps={{
                        className: 'AddBoardDrawer',
                        visible: visibleAddBoard,
                        title: '添加看板',
                        width: 960,
                        onClose: () => this.setState({ visibleAddBoard: false }),
                    }}
                >
                    {visibleAddBoard && (
                        <AddBoard
                            onSelect={(data) =>
                                this.setState({
                                    selectedBoardType: data,
                                })
                            }
                        />
                    )}
                </DrawerLayout>
                {this.renderTopicEdit()}
            </div>
        )
    }
}

export default TopicEdit
