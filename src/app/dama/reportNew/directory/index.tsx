import { LzTable, TreeLayout, Wrap } from 'cps'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { queryDirectoryReport, querySystemDirectory } from '../Service'

import ProjectUtil from '@/utils/ProjectUtil'
import { useParams } from 'react-router-dom'

function getValueFromStringArray(str: string, code: string) {
    if (!str) {
        return []
    }
    return str.split(code)
}

export default function Collection(props: React.PropsWithChildren<{}>) {
    const ref = useRef<Record<string, any>>({})

    const [systemDirectoryList, setSystemDirectoryList] = useState<any[]>([])

    const [selectedKey, setSelectedKey] = useState<string>('')

    const [currentNode, setCurrentNode] = useState<Record<string, any>>({})

    const navigate = useNavigate()
    const params = useParams()
    console.log('params', params)
    const useTable = (params: any) => {
        ref.current.setPage = params.setPage
    }

    const columns = useMemo(
        () => [
            { title: '报表名称', dataIndex: 'name', width: 400, textWrap: 'word-break' },
            { title: '路径', dataIndex: 'systemPath' },
            { title: '最新采集时间', dataIndex: 'updateTime' },
            {
                title: '操作',
                fixed: 'right',
                width: 80,
                render: (_: any, record: Record<string, any>) => {
                    return (
                        <a href={`/reportNew/detail/${record.id}`} target='_blank'>
                            详情
                        </a>
                    )
                },
            },
        ],
        []
    )

    useEffect(() => {
        querySystemDirectory().then((res) => {
            const data = res.data || []
            data.forEach((v: any) => {
                v.title = v.name
                v.key = `systemId_${v.systemId}`
                v.pathList = v.pathList || []
                function loop(arr: any[] = []) {
                    arr.forEach((k) => {
                        k.title = k.name
                        k.key = `pathId_${k.pathId}`
                        if (k.childList && (k.childList || []).length > 0) {
                            loop(k.childList)
                            k.children = k.childList
                        }
                    })
                }
                loop(v.pathList)

                v.children = v.pathList
            })
            setSystemDirectoryList([...data])
            const defaultKey = (data[0] || {}).key
            setSelectedKey(params.id ? `systemId_${params.id}` : defaultKey)
        })
    }, [])

    const selectChange = (value: string, e: any) => {
        console.log('values', value, e)
        ref.current.setPage({ current: 1 })
        setCurrentNode(e)
        setSelectedKey(value[0])
    }

    console.log('data', systemDirectoryList[0])

    return (
        <TreeLayout
            rightTitle={(currentNode.node || {}).name || (systemDirectoryList[0] || {}).name}
            leftTitle={<div>报表分类</div>}
            leftContent={ProjectUtil.renderSystemTree(systemDirectoryList, selectChange, { fieldNames: undefined, disableNodeSelect: undefined, defaultSelectedEqual: (node) => node.key })}
        >
            <Wrap padding={'12px 20px'}>
                <LzTable
                    tableLayout='fixed'
                    columns={columns}
                    pagination={{
                        pageSize: 10,
                    }}
                    request={async (params = {}) => {
                        if (!selectedKey) {
                            return {
                                data: [],
                                total: 0,
                            }
                        }
                        return queryDirectoryReport({
                            ...{
                                [getValueFromStringArray(selectedKey, '_')[0] === 'systemId' ? 'systemId' : 'systemPathId']: getValueFromStringArray(selectedKey, '_')[1],
                            },
                            reportName: params.search,
                            pageNum: params.current,
                            pageSize: params.pageSize,
                        }).then((res) => {
                            return {
                                data: (res.data || {}).list || [],
                                total: (res.data || {}).total || 0,
                            }
                        })
                    }}
                    searchDataSource={[
                        {
                            type: 'inputSearch',
                            placeholder: '搜索报表',
                            name: 'search',
                            width: 360,
                        },
                    ]}
                    updateDependencies={[selectedKey]}
                    useTable={useTable}
                />
            </Wrap>
        </TreeLayout>
    )
}
