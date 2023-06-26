import { requestBoardPreview, requestDimValueList } from '@/api/kpiChartApi'
import Assets from '@/app/kpiCharts/Assets'
import BoardItem from '@/app/kpiCharts/components/BoardItem'
import DimType from '@/app/kpiCharts/enum/DimType'
import TimeEnum from '@/app/kpiCharts/enum/TimeEnum'
import IBoard from '@/app/kpiCharts/interface/IBoard'
import IBoardSetting from '@/app/kpiCharts/interface/IBoardSetting'
import IBoardType from '@/app/kpiCharts/interface/IBoardType'
import IComponentProps from '@/base/interfaces/IComponentProps'
import IconFont from '@/component/IconFont'
import RenderUtil from '@/utils/RenderUtil'
import { Checkbox, Empty, Form, message, Modal, Radio, Select, Skeleton } from 'antd'
import React, { Component, CSSProperties, ReactNode, useEffect, useRef, useState } from 'react'
import './BoardEdit.less'

interface IBoardEditState {
    previewData?: IBoard

    visibleDes: boolean

    loadingDimValue: boolean
    dimValueOption: { label: string; value: any }[]
    formData: {
        cycle?: number
        dim?: number
        dimValue?: string[]
        chartIdDic: {
            [key: string]: true
        }
    }

    loadingPreview: boolean
}
interface IBoardEditProps extends IComponentProps {
    visible: boolean
    boardType: IBoardType
    onCancel: () => void
    onSave: (data: { previewData: IBoard; settingData: IBoardSetting }) => void
}

/**
 * BoardEdit
 */
class BoardEdit extends Component<IBoardEditProps, IBoardEditState> {
    constructor(props: IBoardEditProps) {
        super(props)
        this.init()
    }

    private init() {
        const { boardType } = this.props

        const { timeSelectList, rangeSelectList } = boardType

        let cycle = undefined
        let dim = undefined
        if (this.hasTimeSelect) {
            cycle = Number(timeSelectList.split(',')[0])
        }

        if (this.hasDimSelect) {
            dim = Number(rangeSelectList.split(',')[0])
        }

        this.state = {
            formData: {
                cycle,
                dim,
                chartIdDic: {},
            },
            dimValueOption: [],
            visibleDes: true,
            loadingPreview: false,
            loadingDimValue: false,
        }

        this.requestDimValueOptions()
    }

    componentDidMount() {
        this.requestPreviewData()
    }

    private requestDimValueOptions() {
        const { formData } = this.state
        const { boardType } = this.props
        if (formData.dim) {
            this.setState({ loadingDimValue: true })
            requestDimValueList(boardType.type, formData.dim)
                .then((res) => {
                    const data = res.data
                    this.setState({
                        dimValueOption: data
                            ? data.map((item: any) => {
                                  return {
                                      label: item.name,
                                      value: item.id,
                                  }
                              })
                            : [],
                    })
                })
                .finally(() => {
                    this.setState({ loadingDimValue: false })
                })
        } else {
            this.setState({
                dimValueOption: [],
            })
        }
    }

    private requestPreviewData() {
        this.checkFormData()
            .then(() => {
                this.setState({ loadingPreview: true })
                requestBoardPreview(this.parseToBoardData())
                    .then((res) => {
                        this.setState({ previewData: res.data })
                    })
                    .finally(() => {
                        this.setState({ loadingPreview: false })
                    })
            })
            .catch(() => {
                this.setState({ previewData: undefined })
            })
    }

    private parseToBoardData(): Partial<IBoardSetting> {
        const { formData } = this.state
        const { boardType } = this.props
        const { dimValue } = formData

        return {
            name: boardType.name,
            panelTypeId: boardType.id,
            description: boardType.description,
            statPeriod: formData.cycle,
            statRange: formData.dim || '0',
            rangeIdList: dimValue ? dimValue.join() : '',
            graphSelectList: Object.keys(formData.chartIdDic).join(),
        }
    }

    private async checkFormData() {
        const { formData } = this.state
        const { cycle, dim } = formData
        if (!cycle && this.hasTimeSelect) {
            return Promise.reject('请选择周期')
        } else if (!dim && this.hasDimSelect) {
            return Promise.reject('请选择维度')
        }
        return Promise.resolve()
    }

    private get hasTimeSelect() {
        const { boardType } = this.props
        const { timeSelectList } = boardType

        return timeSelectList && timeSelectList !== '0'
    }

    private get hasDimSelect() {
        const { boardType } = this.props
        const { rangeSelectList } = boardType

        return rangeSelectList && rangeSelectList !== '0'
    }

    private get hasGraphSelect() {
        const { boardType } = this.props
        const { graphSelectList } = boardType

        return Boolean(graphSelectList && graphSelectList.length)
    }

    private get needSetting() {
        return this.hasTimeSelect || this.hasDimSelect || this.hasGraphSelect
    }

    private renderContent() {
        const { formData, dimValueOption, visibleDes, loadingDimValue } = this.state
        const { boardType } = this.props
        const { iconUrl, name, description, timeSelectList, rangeSelectList, graphSelectList } = boardType
        const { cycle, dim, dimValue, chartIdDic } = formData

        const timeList = this.hasTimeSelect ? timeSelectList.split(',').map((item) => Number(item)) : null
        const rangList = this.hasDimSelect ? rangeSelectList.split(',').map((item) => Number(item)) : null

        return (
            <div className='BoardEditContent' id='BoardEditContent'>
                {/* 左侧编辑区 */}
                <div className='Left'>
                    <div className='Part'>
                        <header className='TypeTitle'>
                            <img src={Assets[iconUrl]} />
                            <h2>{name}</h2>
                            {description && (
                                <a onClick={() => this.setState({ visibleDes: !visibleDes })}>
                                    {visibleDes ? '收起' : '展开'} <IconFont type={visibleDes ? 'e646' : 'e636'} useCss />
                                </a>
                            )}
                        </header>
                        {visibleDes && <div className='Des' dangerouslySetInnerHTML={{ __html: description }} />}
                    </div>
                    {this.needSetting && (
                        <div className='Part'>
                            <h3>图表配置</h3>
                            <Form layout='vertical'>
                                {RenderUtil.renderFormItems([
                                    {
                                        label: '统计周期',
                                        required: true,
                                        hide: !this.hasTimeSelect,
                                        content: (
                                            <Radio.Group
                                                value={cycle}
                                                onChange={(event) =>
                                                    this.setState(
                                                        {
                                                            formData: {
                                                                ...formData,
                                                                cycle: event.target.value,
                                                            },
                                                        },
                                                        () => this.requestPreviewData()
                                                    )
                                                }
                                                options={
                                                    timeList
                                                        ? timeList.map((item) => {
                                                              return {
                                                                  label: TimeEnum.toString(item as TimeEnum),
                                                                  value: item,
                                                              }
                                                          })
                                                        : []
                                                }
                                            />
                                        ),
                                    },
                                    {
                                        label: '统计维度',
                                        required: true,
                                        hide: !this.hasDimSelect,
                                        content: (
                                            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                                <Select
                                                    getPopupContainer={() => {
                                                        return document.getElementById('BoardEditContent') || document.body
                                                    }}
                                                    style={{ width: 100, marginRight: -1 }}
                                                    value={dim}
                                                    onChange={(value) =>
                                                        this.setState(
                                                            {
                                                                formData: {
                                                                    ...formData,
                                                                    dim: value,
                                                                    dimValue: undefined,
                                                                },
                                                            },
                                                            () => {
                                                                this.requestDimValueOptions()
                                                                this.requestPreviewData()
                                                            }
                                                        )
                                                    }
                                                    options={
                                                        rangList
                                                            ? rangList.map((item) => {
                                                                  return {
                                                                      label: DimType.toString(item as DimType),
                                                                      value: item,
                                                                  }
                                                              })
                                                            : []
                                                    }
                                                />
                                                <Select
                                                    allowClear
                                                    placeholder='维度值，不选表示全部'
                                                    getPopupContainer={() => {
                                                        return document.getElementById('BoardEditContent') || document.body
                                                    }}
                                                    loading={loadingDimValue}
                                                    showSearch
                                                    mode='multiple'
                                                    value={dimValue}
                                                    filterOption={(input, option) => {
                                                        if (!option || !option.label) {
                                                            return true
                                                        }
                                                        return (option.label as string).toLowerCase().includes(input)
                                                    }}
                                                    onChange={(value) => {
                                                        this.setState(
                                                            {
                                                                formData: {
                                                                    ...formData,
                                                                    dimValue: value,
                                                                },
                                                            },
                                                            () => this.requestPreviewData()
                                                        )
                                                    }}
                                                    options={dimValueOption}
                                                />
                                            </div>
                                        ),
                                    },
                                    {
                                        label: '图表选择',
                                        hide: !this.hasGraphSelect,
                                        content: (
                                            <div>
                                                {graphSelectList &&
                                                    graphSelectList.map((item) => {
                                                        const selected = Boolean(chartIdDic[item.id])
                                                        return (
                                                            <div
                                                                className='ChartItem'
                                                                onClick={() => {
                                                                    if (selected) {
                                                                        delete chartIdDic[item.id]
                                                                    } else {
                                                                        chartIdDic[item.id] = true
                                                                    }
                                                                    this.requestPreviewData()
                                                                    this.forceUpdate()
                                                                }}
                                                            >
                                                                <Checkbox checked={selected} />
                                                                <main>
                                                                    <label>{item.title}</label>
                                                                    <div dangerouslySetInnerHTML={{ __html: item.description }} />
                                                                </main>
                                                            </div>
                                                        )
                                                    })}
                                            </div>
                                        ),
                                    },
                                ])}
                            </Form>
                        </div>
                    )}
                </div>
                {/* 右侧预览区 */}
                <div className='Right'>
                    <h2>看板预览</h2>
                    <div>{this.renderPreivew()}</div>
                </div>
            </div>
        )
    }

    private renderPreivew() {
        const { loadingPreview, previewData } = this.state

        if (loadingPreview) {
            return <Skeleton loading active />
        } else if (!previewData) {
            return <Empty description='请设置参数' />
        }

        const scale = 1.5
        return (
            <this.AjustScale scale={scale} style={{ width: '100%' }}>
                <div style={{ width: `${scale * 100}%`, transformOrigin: 'left top', transform: `scale(${1 / scale})` }}>
                    <BoardItem
                        data={{
                            previewData,
                            settingData: this.parseToBoardData() as IBoardSetting,
                        }}
                    />
                </div>
            </this.AjustScale>
        )
    }

    private AjustScale(props: { style?: CSSProperties; scale: number; className?: string; children: ReactNode }) {
        const { style, className, children, scale } = props

        const ref = useRef<HTMLDivElement>(null)
        const [height, setHeight] = useState<number | undefined>(undefined)

        useEffect(() => {
            function updateWrapHeight() {
                if (ref.current) {
                    const refHeight = ref.current.clientHeight
                    setHeight(refHeight / scale)
                }
            }
            const observer = new ResizeObserver(() => {
                console.log('ResizeObservercallback')
                updateWrapHeight()
            })
            if (ref.current) {
                observer.observe(ref.current)
            }

            updateWrapHeight()

            return () => {
                observer.disconnect()
            }
        }, [])

        return (
            <div style={{ ...style, overflow: 'hidden', height }} className={className}>
                <div ref={ref} style={{ width: '100%' }}>
                    {children}
                </div>
            </div>
        )
    }

    render() {
        const { visible, onCancel, onSave } = this.props
        const { previewData } = this.state
        return (
            <Modal
                width={900}
                onCancel={onCancel}
                onOk={() => {
                    this.checkFormData()
                        .then(() => {
                            const settingData = this.parseToBoardData()

                            if (!previewData) {
                                message.warn('预览失败，请调整参数或联系管理员处理')
                                return
                            }
                            onSave({
                                settingData: settingData as IBoardSetting,
                                previewData,
                            })
                        })
                        .catch((msg) => {
                            message.warn(msg)
                        })
                }}
                className='BoardEdit'
                wrapClassName='BoardEditWrap'
                visible={visible}
                title='看板信息'
            >
                {this.renderContent()}
            </Modal>
        )
    }
}

export default BoardEdit
