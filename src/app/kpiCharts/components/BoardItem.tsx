import BoardChart from '@/app/kpiCharts/components/BoardChart'
import DimType from '@/app/kpiCharts/enum/DimType'
import TimeEnum from '@/app/kpiCharts/enum/TimeEnum'
import { IBoardOverview } from '@/app/kpiCharts/interface/IBoard'
import IBoardData from '@/app/kpiCharts/interface/IBoardData'
import IComponentProps from '@/base/interfaces/IComponentProps'
import IconFont from '@/component/IconFont'
import ProjectUtil from '@/utils/ProjectUtil'
import { Tooltip } from 'antd'
import classNames from 'classnames'
import React, { Component } from 'react'
import './BoardItem.less'

interface IBoardItemState {}
interface IBoardItemProps extends IComponentProps {
    data: IBoardData
}

/**
 * BoardItem
 */
class BoardItem extends Component<IBoardItemProps, IBoardItemState> {
    private renderOverviewItem(item: IBoardOverview, statPeriod: TimeEnum) {
        const { name, value, unit = '个', ratio } = item
        return (
            <div className='OverviewItem' key={name}>
                <header>{name}</header>
                <main>
                    <em>{ProjectUtil.formatBigNumber(value)}</em>
                    <span>{unit}</span>
                </main>
                <footer>
                    <span>较前一{TimeEnum.toString(statPeriod)}</span>
                    <span className={classNames('Rate', ratio > 0 ? 'RateAdd' : 'RateSub')}>
                        {isNaN(ratio) ? (
                            ratio
                        ) : (
                            <>
                                <IconFont type={ratio > 0 ? 'e66d' : 'e66c'} useCss />
                                {Math.abs(ratio)}%
                            </>
                        )}
                    </span>
                </footer>
            </div>
        )
    }

    render() {
        const { previewData, settingData } = this.props.data
        const { name, indexDataList, statPeriod, statRange, description, graphDataList } = previewData
        console.log("graphDataList", graphDataList)
        console.log("settingData", settingData)

        const paramList = [
            {
                label: '统计周期',
                content: TimeEnum.toString(statPeriod),
            },
            {
                label: '统计维度',
                content: DimType.toString(statRange),
            },
        ]
        return (
            <div className='BoardItem'>
                {description && (
                    <Tooltip title={<span dangerouslySetInnerHTML={{ __html: description }} />}>
                        <IconFont className='iconTip' type='e677' useCss />
                    </Tooltip>
                )}

                <header>
                    <h3>{name || '--'}</h3>
                    {/* 统计参数 */}
                    <div className='ParamGroup'>
                        {paramList &&
                            paramList.map((item) => {
                                if (item.content) {
                                    return (
                                        <span>
                                            <label>{item.label}：</label>
                                            <span>{item.content}</span>
                                        </span>
                                    )
                                }
                                return null
                            })}
                    </div>
                </header>
                <main>
                    {/* 概览 */}
                    <div className='OverviewGroup'>{indexDataList && indexDataList.map((item) => this.renderOverviewItem(item, statPeriod))}</div>
                    {/* 图表 */}
                    {graphDataList && graphDataList.length ? (
                        <div className='ChartGroup'>
                            {graphDataList.map((item, index) => {
                                if (item) {
                                    return <BoardChart setting={settingData} data={item} key={index} />
                                }
                                return null
                            })}
                        </div>
                    ) : null}
                </main>
            </div>
        )
    }
}

export default BoardItem
