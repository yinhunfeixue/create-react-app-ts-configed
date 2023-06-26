// 模型历史版本
import DataArchitectApi from '@/api/DataArchitectApi'
import RichTableLayout from '@/component/layout/RichTableLayout'
import { Tag } from 'antd'
import React, { Key } from 'react'
interface IModelHistoryListProps {
    modelId: Key
}
/**
 * ModelHistoryList
 */
const ModelHistoryList: React.FC<IModelHistoryListProps> = (props) => {
    const { modelId } = props
    return (
        <RichTableLayout
            smallLayout
            disabledDefaultFooter
            editColumnProps={{
                hidden: true,
            }}
            requestListFunction={async (page, pageSize) => {
                const res = await DataArchitectApi.requestModelHistoryList({ page, pageSize, modelId })
                const { total, data } = res
                return { total, dataSource: data }
            }}
            tableProps={{
                columns: [
                    {
                        title: '版本号',
                        dataIndex: 'version',
                        render(value, record, index) {
                            return (
                                <span>
                                    {record.lastFlag && <Tag color='rgba(255, 153, 0, 1)'>最新</Tag>}
                                    {record.version}
                                </span>
                            )
                        },
                    },
                    {
                        title: '版本日志',
                        dataIndex: 'versionLog',
                    },
                    {
                        title: '发版人',
                        dataIndex: 'deployer',
                    },
                    {
                        title: '发版时间',
                        dataIndex: 'deployerTime',
                    },
                ],
            }}
        />
    )
}
export default ModelHistoryList
