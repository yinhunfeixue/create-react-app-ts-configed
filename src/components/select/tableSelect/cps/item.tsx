import { Input, Spin } from 'antd'
import classnames from 'classnames'
import React, { ReactNode } from 'react'
import style from './item.lees'

const Right = (
    <svg width='1em' height='1em' viewBox='0 0 1024 1024'>
        <path fill='currentColor' d='M386.844444 170.666667l-45.511111 39.822222L597.333333 512 341.333333 813.511111l39.822223 39.822222L682.666667 512z'></path>
    </svg>
)

export default function Item(
    props: React.PropsWithChildren<{
        index: number
        title: string
        dataSource: Record<string, any>[] | 'loading'
        sourceData: Record<string, any>[]
        fieldNames: { id: string; name: string }
        onSelect: (data: any, index: number) => void
        selectedData: Record<string, any>
        searchOnChange: (value: string, index: number) => void
        itemRender?: (data: any) => ReactNode
    }>
) {
    const { index, title = '', dataSource = [], fieldNames = { id: 'id', name: 'name' }, itemRender, onSelect, selectedData = {}, searchOnChange, sourceData } = props

    /* action */
    const click = (data: any) => {
        console.log('select data', data)
        onSelect && onSelect(data, index)
    }

    const change = (e: React.ChangeEvent<HTMLInputElement>) => {
        searchOnChange && searchOnChange(e.target.value, index)
    }

    return (
        <div className={style.wrap}>
            <div className={style.title}>{title}</div>
            <div className={style.list}>
                {dataSource.length > 0 || sourceData.length > 0 ? (
                    <Spin spinning={dataSource === 'loading'}>
                        <div className={style.search}>
                            <Input.Search onChange={change} placeholder='搜索' />
                        </div>
                        <div className={style.itemWrap}>
                            {Array.isArray(dataSource) &&
                                dataSource.map((v, i) => (
                                    <div
                                        onClick={() => {
                                            click(v)
                                        }}
                                        className={classnames(style.item, {
                                            [style.itemSelect]: selectedData[fieldNames['id']] == v[fieldNames['id']],
                                            itemSelect: selectedData[fieldNames['id']] == v[fieldNames['id']],
                                        })}
                                        key={v[fieldNames['id']]}
                                    >
                                        {itemRender ? itemRender(v) : <span>{v[fieldNames['name']]}</span>}
                                        {index !== 2 && Right}
                                    </div>
                                ))}
                        </div>
                    </Spin>
                ) : (
                    <span className={style.empty}>暂无数据</span>
                )}
            </div>
        </div>
    )
}
