import IconFont from '@/component/IconFont'
import { TreeSelect } from 'antd'
import React, { useEffect, useState } from 'react'

import { queryTreeDepart } from '../Service'

const { TreeNode } = TreeSelect

export default function DepartTreeSelect(
    props: React.PropsWithChildren<{
        onChange?: (value: any, option: any) => void
        value?: string
        placeholder?: string
        width?: number
        mode?: 'multiple' | 'tags'
        excludeId?: string
        initEmpty?: boolean
        multiple?: boolean
    }>
) {
    const { value, onChange, width, placeholder, excludeId, initEmpty, multiple } = props
    const [loading, setLoading] = useState(false)

    const [data, setData] = useState([])

    useEffect(() => {
        if (initEmpty && !excludeId) return
        setLoading(true)
        queryTreeDepart()
            .then((res) => {
                let data = res.data
                // 如果有排除id，排除之
                if (excludeId) {
                    data = data.filter((v: any) => {
                        if (v.children && v.children.length > 0) {
                            v.children = v.children.filter((k: any) => k.id !== excludeId)
                        }
                        return v.id !== excludeId
                    })
                }
                setData(data || [])
            })
            .finally(() => {
                setLoading(false)
            })
    }, [excludeId])

    const renderTreeNode = (data: any[]): any => {
        return data.map((v) => {
            return (
                <TreeNode
                    key={v.id}
                    value={v.id}
                    title={
                        <span>
                            <IconFont style={{ color: '#227FDC', marginRight: 5 }} type='e69d' useCss />
                            {v.title}
                        </span>
                    }
                >
                    {v.children && v.children.length > 0 && renderTreeNode(v.children)}
                </TreeNode>
            )
        })
    }

    return (
        <TreeSelect loading={loading} style={{ width }} placeholder={placeholder} value={value} onChange={onChange} multiple={!!multiple} showCheckedStrategy={TreeSelect.SHOW_ALL}>
            {renderTreeNode(data)}
        </TreeSelect>
    )
}
