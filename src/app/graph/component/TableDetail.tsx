import { requestFieldList } from '@/api/graphApi'
import GraphDrawer from '@/app/graph/component/GraphDrawer'
import SelectedIcon from '@/app/graph/component/SelectedIcon'
import IField from '@/app/graph/interface/IField'
import ITable from '@/app/graph/interface/ITable'
import IComponentProps from '@/base/interfaces/IComponentProps'
import SimpleEmpty from '@/component/empty/SimpleEmpty'
import IconFont from '@/component/IconFont'
import PageUtil from '@/utils/PageUtil'
import RenderUtil from '@/utils/RenderUtil'
import { Button, Form, Input, message, Spin, Tabs, Tooltip } from 'antd'
import classNames from 'classnames'
import React, { Component } from 'react'
import './TableDetail.less'

enum FieldType {
    RELATED = '0',
    ALL = '1',
}

interface ITableDetailState {
    fieldList: IField[]
    relatedFieldList: IField[]
    selectedFieldKeys: { [key: string]: true }
    loading: boolean
    selectedFieldType: FieldType

    fieldSearchKey?: string
}
interface ITableDetailProps extends IComponentProps {
    visible: boolean
    onClose: () => void
    data?: ITable
    onFieldChange: (fieldIdList: string[]) => void
}

/**
 * TableDetail
 */
class TableDetail extends Component<ITableDetailProps, ITableDetailState> {
    constructor(props: ITableDetailProps) {
        super(props)
        this.state = {
            fieldList: [],
            relatedFieldList: [],
            selectedFieldKeys: {},
            loading: false,
            selectedFieldType: FieldType.RELATED,
        }
    }

    private init() {
        this.state = {
            fieldList: [],
            relatedFieldList: [],
            selectedFieldKeys: {},
            loading: false,
            selectedFieldType: FieldType.RELATED,
        }
        this.requestFieldList()
    }

    componentDidMount() {
        this.init()
    }

    componentDidUpdate(prevProps: ITableDetailProps) {
        if (this.props.data !== prevProps.data) {
            this.init()
        }
    }
    private requestFieldList() {
        const { data } = this.props
        if (data) {
            this.setState({ loading: true })
            requestFieldList(data.tableId)
                .then((res) => {
                    const fieldList: IField[] = res.data || []
                    const relatedFieldList: IField[] = []
                    const relatedFieldIdList = data.fields.map((item) => item.fieldId)
                    fieldList.forEach((item) => {
                        if (relatedFieldIdList.includes(item.id)) {
                            relatedFieldList.push(item)
                        }
                    })
                    this.setState({ fieldList, relatedFieldList })
                })
                .finally(() => {
                    this.setState({ loading: false })
                })
        }
    }

    private renderFieldList(
        list: IField[],
        searchParams?: {
            onSearchChange?: (value: string) => void
            filter?: (item: IField) => boolean
        }
    ) {
        const { loading } = this.state
        const { onSearchChange, filter } = searchParams || {}
        if (!list || !list.length) {
            return loading ? (
                <Spin spinning>
                    <div style={{ marginTop: 30 }} />
                </Spin>
            ) : (
                <SimpleEmpty />
            )
        }

        const showSearch = Boolean(onSearchChange) //&& list.length >= 10
        return (
            <>
                {showSearch && (
                    <Input.Search
                        placeholder='字段名'
                        style={{ marginBottom: 16 }}
                        onChange={(event) => {
                            if (onSearchChange) {
                                onSearchChange(event.target.value)
                            }
                        }}
                    />
                )}
                {list
                    .filter((item) => !filter || filter(item))
                    .map((item) => {
                        return this.renderFieldItem(item)
                    })}
            </>
        )
    }

    private renderFieldItem(data: IField) {
        const { selectedFieldKeys } = this.state
        const { id } = data
        const selected = selectedFieldKeys[id]
        return (
            <div
                key={id}
                className={classNames('FieldItem', selected ? 'FieldItemSelect' : '')}
                onClick={() => {
                    if (selected) {
                        delete selectedFieldKeys[id]
                    } else {
                        selectedFieldKeys[id] = true
                    }
                    this.forceUpdate()
                }}
            >
                {data.physicalField}
                {data.physicalFieldDesc ? `(${data.physicalFieldDesc})` : ''}
                {selected ? <SelectedIcon /> : null}
            </div>
        )
    }

    private renderContent() {
        const { data, onFieldChange, onClose } = this.props
        const { fieldList, relatedFieldList, loading, selectedFieldKeys, selectedFieldType, fieldSearchKey } = this.state

        if (!data) {
            return null
        }

        const { tableEName, tableCName } = data
        const hasRelatedField = Boolean(relatedFieldList && relatedFieldList.length)

        const keys = Object.keys(selectedFieldKeys)
        return (
            <div className='TableDetail'>
                <main>
                    <div className='PaddinWrap'>
                        <h4>
                            {tableEName}
                            {tableCName ? `  ${tableCName}` : ''}
                        </h4>

                        <Form className='HMiniForm'>
                            {RenderUtil.renderFormItems(
                                [
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
                                        content: <Tooltip title={data.databaseEname}>{data.databaseEname}</Tooltip>,
                                    },
                                    {
                                        label: '技术负责人',
                                        content: data.techniqueManager,
                                    },
                                ],
                                {
                                    colon: false,
                                    labelCol: { span: 10 },
                                    wrapperCol: { span: 14 },
                                }
                            )}
                        </Form>
                    </div>
                    <Tabs activeKey={selectedFieldType} onChange={(key) => this.setState({ selectedFieldType: key as FieldType })}>
                        <Tabs.TabPane key={FieldType.RELATED} tab='字段血缘'>
                            {this.renderFieldList(relatedFieldList)}
                        </Tabs.TabPane>
                        <Tabs.TabPane key={FieldType.ALL} tab='所有字段'>
                            {this.renderFieldList(fieldList, {
                                filter: (item) => !fieldSearchKey || item.physicalField.includes(fieldSearchKey),
                                onSearchChange: (value) => this.setState({ fieldSearchKey: value }),
                            })}
                        </Tabs.TabPane>
                    </Tabs>
                </main>
                <footer>
                    {selectedFieldType === FieldType.RELATED ? (
                        hasRelatedField && (
                            <Button
                                type='primary'
                                loading={loading}
                                block
                                disabled={keys.length === 0}
                                onClick={() => {
                                    if (keys.length === 0) {
                                        message.warn('至少选择一个字段')
                                        return
                                    }
                                    onFieldChange(keys)
                                    onClose()
                                }}
                            >
                                血缘分析
                            </Button>
                        )
                    ) : (
                        <Button
                            type='primary'
                            loading={loading}
                            block
                            onClick={() => {
                                PageUtil.addTab('sysDetail', { id: data.tableId, tabValue: 'graph', fields: Object.keys(selectedFieldKeys) }, true)
                            }}
                        >
                            关联查看
                        </Button>
                    )}
                </footer>
            </div>
        )
    }
    render() {
        const { visible, onClose, data } = this.props
        return (
            <GraphDrawer
                title='表详情'
                visible={visible}
                onClose={onClose}
                createExtraElement={() => {
                    return [
                        <IconFont
                            type='icon-link'
                            onClick={() => {
                                if (data) {
                                    const { tableId } = data
                                    PageUtil.addTab('sysDetail', { id: tableId }, true)
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

export default TableDetail
