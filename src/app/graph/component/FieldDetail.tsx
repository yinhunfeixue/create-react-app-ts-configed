import GraphDrawer from '@/app/graph/component/GraphDrawer'
import ITable from '@/app/graph/interface/ITable'
import IComponentProps from '@/base/interfaces/IComponentProps'
import IconFont from '@/component/IconFont'
import PageUtil from '@/utils/PageUtil'
import RenderUtil from '@/utils/RenderUtil'
import { Collapse, Divider, Form, Input, Switch, Tooltip } from 'antd'
import React, { Component } from 'react'
import './FieldDetail.less'

const { Panel } = Collapse

interface IFieldDetailState {
    selectedFieldId?: string | number
    loadingUpdatePath: boolean

    fieldSearchKey?: string
}
interface IFieldDetailProps extends IComponentProps {
    visible: boolean
    onClose: () => void
    data?: ITable
    onPathFieldChange: (tableId?: string | number, fieldId?: string) => Promise<void>
}

/**
 * FieldDetail
 */
class FieldDetail extends Component<IFieldDetailProps, IFieldDetailState> {
    constructor(props: IFieldDetailProps) {
        super(props)
        this.state = {
            loadingUpdatePath: false,
            selectedFieldId: undefined,
        }
    }

    private reset() {
        this.setState({
            loadingUpdatePath: false,
            selectedFieldId: undefined,
        })
    }

    componentDidUpdate(prevProps: IFieldDetailProps) {
        if (this.props.data !== prevProps.data) {
            this.reset()
        }
    }

    private renderContent() {
        const { data, onPathFieldChange } = this.props
        if (!data) {
            return null
        }

        const { fields } = data
        const { selectedFieldId, loadingUpdatePath, fieldSearchKey } = this.state
        const showSearch = fields && fields.length >= 10
        return (
            <div className='FieldDetail'>
                {/* 搜索 */}
                {showSearch && (
                    <div className='PaddingWrap'>
                        <Input.Search
                            placeholder='字段名'
                            onChange={(event) => {
                                this.setState({ fieldSearchKey: event.target.value })
                            }}
                        />
                    </div>
                )}
                {/* 字段列表 */}
                <div className='FieldList'>
                    {fields && fields.length ? (
                        <Collapse ghost>
                            {fields
                                .filter((item) => !fieldSearchKey || item.fieldEName.includes(fieldSearchKey))
                                .map((item) => {
                                    const selected = selectedFieldId === item.fieldId
                                    return (
                                        <Panel
                                            key={item.fieldId}
                                            header={
                                                <span>
                                                    <IconFont type='icon-ziduan1' style={{ marginRight: 4, fontSize: 16 }} />
                                                    {item.fieldEName}
                                                </span>
                                            }
                                            extra={<IconFont type='icon-you' className='CollapseItemHeaderArrow' />}
                                            showArrow={false}
                                        >
                                            <Form className='HMiniForm'>
                                                {RenderUtil.renderFormItems(
                                                    [
                                                        {
                                                            label: '中文名',
                                                            content: item.fieldCName,
                                                        },
                                                        {
                                                            label: '类型',
                                                            content: item.dataType,
                                                        },
                                                        {
                                                            label: '血缘路径',
                                                            content: (
                                                                <div className='HControlGroup'>
                                                                    <Switch
                                                                        loading={loadingUpdatePath}
                                                                        checked={selected}
                                                                        onChange={async (checked) => {
                                                                            this.setState({ loadingUpdatePath: true })
                                                                            if (checked) {
                                                                                this.setState({ selectedFieldId: item.fieldId })
                                                                                await onPathFieldChange(data.tableId, item.fieldId)
                                                                            } else {
                                                                                this.setState({ selectedFieldId: undefined })
                                                                                await onPathFieldChange()
                                                                            }
                                                                            this.setState({ loadingUpdatePath: false })
                                                                        }}
                                                                    />
                                                                    {selected ? <IconFont type='icon-dingwei' /> : null}
                                                                </div>
                                                            ),
                                                        },
                                                    ],
                                                    {
                                                        colon: false,
                                                        labelCol: { span: 9 },
                                                        wrapperCol: { span: 15 },
                                                    }
                                                )}
                                            </Form>
                                        </Panel>
                                    )
                                })}
                        </Collapse>
                    ) : null}
                </div>
                <Divider style={{ marginTop: 0 }} />
                {/* 表详情 */}
                <div className='PaddingWrap'>
                    <h4>表信息</h4>
                    <Form className='HMiniForm'>
                        {RenderUtil.renderFormItems(
                            [
                                {
                                    label: '表名',
                                    content: (
                                        <Tooltip title={data.tableEName}>
                                            <a
                                                onClick={() => {
                                                    PageUtil.addTab('sysDetail', { id: data.tableId, tabValue: 'graph' }, true)
                                                }}
                                            >
                                                {data.tableEName}
                                            </a>
                                        </Tooltip>
                                    ),
                                },
                                {
                                    label: '表中文名',
                                    content: data.tableCName,
                                },
                                {
                                    label: '数据源',
                                    content: <Tooltip title={data.datasourceCName}>{data.datasourceCName}</Tooltip>,
                                },
                                {
                                    label: '类型',
                                    content: data.datasourceType,
                                },
                                {
                                    label: '数仓层级',
                                    content: data.dwLevelTagName,
                                },
                                {
                                    label: '数据库',
                                    content: data.databaseEname,
                                },
                                {
                                    label: '技术负责人',
                                    content: data.techniqueManager,
                                },
                            ],
                            {
                                colon: false,
                                labelCol: { span: 9 },
                                wrapperCol: { span: 15 },
                            }
                        )}
                    </Form>
                </div>
            </div>
        )
    }

    render() {
        const { visible, onClose } = this.props
        return (
            <GraphDrawer title='字段详情' visible={visible} onClose={onClose}>
                {this.renderContent()}
            </GraphDrawer>
        )
    }
}

export default FieldDetail
