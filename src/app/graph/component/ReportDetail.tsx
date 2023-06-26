import GraphDrawer from '@/app/graph/component/GraphDrawer'
import IReport from '@/app/graph/interface/IReport'
import IComponentProps from '@/base/interfaces/IComponentProps'
import IconFont from '@/component/IconFont'
import PageUtil from '@/utils/PageUtil'
import RenderUtil from '@/utils/RenderUtil'
import { Form } from 'antd'
import React, { Component } from 'react'
import './ReportDetail.less'

interface IReportDetailState {}
interface IReportDetailProps extends IComponentProps {
    visible: boolean
    onClose: () => void
    data?: IReport
}

/**
 * ReportDetail
 */
class ReportDetail extends Component<IReportDetailProps, IReportDetailState> {
    private renderContent() {
        const { data } = this.props
        if (!data) {
            return
        }
        const { reportName, belongSystem, reportCatalog, reportLevel, technologyManager } = data
        return (
            <div className='ReportDetail'>
                <div className='PaddinWrap'>
                    <h4>{reportName}</h4>
                    <Form className='HMiniForm'>
                        {RenderUtil.renderFormItems([
                            {
                                label: '所属系统',
                                content: belongSystem,
                            },
                            {
                                label: '报表目录',
                                content: reportCatalog,
                            },
                            {
                                label: '报表等级',
                                content: reportLevel,
                            },
                            {
                                label: '技术负责人',
                                content: technologyManager,
                            },
                        ])}
                    </Form>
                </div>
            </div>
        )
    }

    render() {
        const { visible, onClose, data } = this.props

        return (
            <GraphDrawer
                title='报表详情'
                visible={visible}
                onClose={onClose}
                createExtraElement={() => {
                    return [
                        <IconFont
                            type='icon-link'
                            onClick={() => {
                                if (data) {
                                    const { reportId } = data
                                    PageUtil.addTab('reportDetail', { id: reportId }, true)
                                }
                            }}
                        />,
                    ]
                }}
            >
                {this.renderContent()}
            </GraphDrawer>
        )
    }
}

export default ReportDetail
