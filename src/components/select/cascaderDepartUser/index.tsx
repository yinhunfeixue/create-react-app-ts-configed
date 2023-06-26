import { Cascader, CascaderProps } from 'antd'
import React, { useEffect, useState } from 'react'
import { recursiveByCb } from 'utils'
import { queryTreeDepart, queryUser } from '../Service'

export default function CascaderDepartUser(props: React.PropsWithChildren<{} & CascaderProps<any>>) {
    const { ...otherProps } = props

    const [departData, setDepartData] = useState<any[]>([])
    const [options, setOptions] = useState<any[]>([])

    /* effect */
    useEffect(() => {
        queryTreeDepart().then((res) => {
            const { data = [] } = res
            // 加叶子节点标识
            recursiveByCb(data, (v) => {
                v.isLeaf = false
                v.isDepart = true
            })
            setDepartData(data)
            setOptions([...data])
        })
    }, [])

    /* event */
    const loadData = (selectedOptions: any[]) => {
        console.log('selectedOptions', selectedOptions)
        const targetOption = selectedOptions[selectedOptions.length - 1]

        if (targetOption.isDepart && (!targetOption.children || targetOption.children.length <= 0)) {
            targetOption.loading = true

            queryUser({ departmentId: targetOption.id }).then((res) => {
                targetOption.loading = false

                const { data = [] } = res

                if (data.length > 0) {
                    recursiveByCb(data, (v) => {
                        v.title = (
                            <span>
                                {' '}
                                <span style={{ fontSize: 14 }} className='iconfont icon-user3' /> {v.realname}
                            </span>
                        )
                        v.isUser = true
                        //v.label = v.relaname;
                    })
                    console.log('data', data)
                    targetOption.children = data
                    setOptions((data) => [...data])
                } else {
                    targetOption.isLeaf = true
                    setOptions((data) => [...data])
                }
            })
        }
    }

    return (
        <Cascader
            changeOnSelect
            fieldNames={{
                label: 'title',
                value: 'id',
            }}
            {...otherProps}
            loadData={loadData}
            options={options}
        />
    )
}
