import { requestBoardList, requestBoardSettingList, requestSortBoards, requestTopicList } from '@/api/kpiChartApi'
import BoardGroup from '@/app/kpiCharts/components/BoardGroup'
import TopicList from '@/app/kpiCharts/components/TopicList'
import IBoard from '@/app/kpiCharts/interface/IBoard'
import IBoardData from '@/app/kpiCharts/interface/IBoardData'
import IBoardSetting from '@/app/kpiCharts/interface/IBoardSetting'
import ITopic from '@/app/kpiCharts/interface/ITopic'
import TopicEdit from '@/app/kpiCharts/TopicEdit'
import IconFont from '@/component/IconFont'
import { Dropdown, message, Radio, Skeleton, Spin } from 'antd'
import React, { Component } from 'react'
import './KpiCharts.less'

interface IKpiChartsSate {
    topicList: ITopic[]
    selectTopicId?: string
    visibleEditTopic: boolean
    editTopic?: ITopic
    visibleTopicList: boolean

    loadingTopicList: boolean
    loadingBoardList: boolean

    boardDataList: IBoardData[]
}

/**
 * KpiCharts
 */
class KpiCharts extends Component<any, IKpiChartsSate> {
    constructor(props: any) {
        super(props)
        this.state = {
            topicList: [],
            visibleEditTopic: false,
            visibleTopicList: false,
            loadingTopicList: false,
            loadingBoardList: false,
            boardDataList: [],
        }
    }

    componentDidMount() {
        this.requestTopicList()
    }

    private requestTopicList() {
        const { selectTopicId } = this.state
        this.setState({ loadingTopicList: true })
        return requestTopicList()
            .then((res) => {
                const topicList = res.data || []
                this.setState({
                    topicList,
                })
                if (!selectTopicId && topicList.length) {
                    this.setSelectTopicId(topicList[0].id)
                }
            })
            .finally(() => {
                this.setState({ loadingTopicList: false })
            })
    }

    private async requestBoardList() {
        const { selectTopicId } = this.state
        if (selectTopicId) {
            this.setState({ loadingBoardList: true })
            const boardRes = await requestBoardList(selectTopicId)
            const settingRes = await requestBoardSettingList(selectTopicId)
            const boardData: IBoard[] = boardRes.data
            const settingData: IBoardSetting[] = settingRes.data
            if (boardData && settingData) {
                const boardDataList = boardData.map((item) => {
                    return {
                        previewData: item,
                        settingData: settingData.find((settingItem) => settingItem.id === item.id) as IBoardSetting,
                    }
                })
                this.setState({
                    boardDataList,
                    loadingBoardList: false,
                })
            } else {
                this.setState({
                    boardDataList: [],
                    loadingBoardList: false,
                })
            }
        }
    }

    private getSelectedTopic(): ITopic | undefined {
        const { topicList, selectTopicId } = this.state
        if (!selectTopicId || !topicList) {
            return
        }

        return topicList.find((item) => item.id === selectTopicId)
    }

    private setSelectTopicId(value?: string) {
        this.setState({ selectTopicId: value }, () => {
            if (value) {
                this.requestBoardList()
            } else {
                this.setState({ boardDataList: [] })
            }
        })
    }

    private renderHeader() {
        const { topicList, selectTopicId, visibleTopicList, loadingTopicList, loadingBoardList } = this.state

        return (
            <Spin wrapperClassName='Header' spinning={loadingTopicList || loadingBoardList}>
                <Radio.Group
                    className='TopicRadioGroup'
                    value={selectTopicId}
                    optionType='button'
                    options={topicList.map((item) => ({ label: item.name, value: item.id }))}
                    onChange={(event) => this.setSelectTopicId(event.target.value)}
                />

                <Dropdown
                    overlayClassName='TopicManageOverlay'
                    visible={visibleTopicList}
                    onVisibleChange={(visible) => {
                        this.setState({ visibleTopicList: visible })
                    }}
                    overlay={
                        <TopicList
                            topicList={topicList}
                            onDelete={(id) => {
                                if (id === selectTopicId) {
                                    this.setSelectTopicId(undefined)
                                }
                                this.requestTopicList()
                            }}
                            onEdit={(data) => {
                                this.setState({
                                    visibleEditTopic: true,
                                    editTopic: data,
                                    visibleTopicList: false,
                                })

                                if (data) {
                                    this.setSelectTopicId(data.id)
                                }
                            }}
                            onSortChange={(data) => {
                                this.setState({ topicList: data })
                            }}
                        />
                    }
                    trigger={['hover']}
                >
                    <span className='DropDownManage'>
                        主题管理 <IconFont type='icon-arrow_down' />
                    </span>
                </Dropdown>
            </Spin>
        )
    }

    private renderBody() {
        const { boardDataList, loadingBoardList, selectTopicId } = this.state
        const currentTopic = this.getSelectedTopic()
        if (!currentTopic) {
            return
        }

        const { layoutType } = currentTopic

        const columnNumber = layoutType === 0 ? 2 : 3
        if (loadingBoardList) {
            return <Skeleton active loading />
        }

        if (!boardDataList || !boardDataList.length) {
            return <IconFont type='icon-kongshuju' />
        }

        return (
            <BoardGroup
                disableDrag
                dataSource={boardDataList}
                columnNumber={columnNumber}
                onSortChange={(oldIndex, newIndex) => {
                    const board = boardDataList[oldIndex]
                    const newBoardDataList = boardDataList.concat()
                    newBoardDataList.splice(oldIndex, 1)
                    newBoardDataList.splice(newIndex, 0, board)

                    // 先发请求，请求成功后再调整本地数据
                    requestSortBoards(
                        selectTopicId,
                        newBoardDataList.map((item, index) => {
                            return {
                                order: index,
                                panelId: item.previewData.id,
                            }
                        })
                    ).then((res) => {
                        const { code, msg } = res
                        if (code === 200) {
                            this.setState({ boardDataList: newBoardDataList })
                        } else {
                            message.error(msg)
                        }
                    })
                }}
            />
        )
    }

    render() {
        const { visibleEditTopic, editTopic, selectTopicId } = this.state
        return (
            <>
                <div className='KpiCharts'>
                    {this.renderHeader()}
                    {this.renderBody()}
                </div>
                {visibleEditTopic && (
                    <TopicEdit
                        targetTopic={editTopic}
                        onSuccess={() => {
                            // 如果编辑的主题是选中的主题，刷新看板
                            if (editTopic && editTopic.id === selectTopicId) {
                                this.requestBoardList()
                            }
                            this.setState({ visibleEditTopic: false, editTopic: undefined })
                            this.requestTopicList()
                        }}
                        onClose={() => this.setState({ visibleEditTopic: false, editTopic: undefined })}
                    />
                )}
            </>
        )
    }
}

export default KpiCharts
