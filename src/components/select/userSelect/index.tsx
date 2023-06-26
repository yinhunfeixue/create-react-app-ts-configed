import { message, Select } from 'antd'
import React, { useEffect, useRef, useState } from 'react'

import { queryUser, Tuser } from '../Service'

export default function UserSelect(
    props: React.PropsWithChildren<{
        onChange?: (value: any, option: any) => void
        value?: string
        departId?: string
        placeholder?: string
        width?: number
        // 过滤禁用账户
        filter?: boolean
        refData?: any
        disabled?: boolean
    }>
) {
    const { onChange, value, departId, placeholder, width, filter = true, refData, disabled = false } = props

    const ref = useRef({ count: 0 })

    const [list, setList] = useState<Tuser[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!departId) return

        // 只要departid变化，都应重置value
        ++ref.current.count

        setLoading(true)
        queryUser({ departmentId: departId })
            .then((res) => {
                if (res.code == 200) {
                    let data = res.data
                    if (filter) {
                        data = data.filter((v) => v.status == 1)
                    }
                    setList(data)
                    if (refData) {
                        refData.current = data
                    }
                } else {
                    message.error(res.msg || '人员获取失败')
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }, [departId])

    return (
        <Select
            loading={loading}
            key={ref.current.count}
            style={{ width }}
            onChange={onChange}
            value={list.length <= 0 ? undefined : list.find((v) => v.id == value) ? value : undefined}
            placeholder={placeholder}
            disabled={disabled}
        >
            {list.map((v, i) => (
                <Select.Option value={v.id}>{v.realname}</Select.Option>
            ))}
        </Select>
    )
}
