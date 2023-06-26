import { Select, Tag } from 'antd'
import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { listTableByDatabaseId, readDatabase, readDataSource, readDataTableByKeyword } from '../Service'
import Info from './cps/info'
import Item from './cps/item'

import { message } from 'antd'
import style from './index.module.less'

const { Option } = Select

/* 
    选择 数据源 => 数据库 => 表
*/

export default function TableSelect(
    props: React.PropsWithChildren<{
        height?: number
        onChange: (data: any) => void
        requestTableFun?: (param: { datasourceId: number; databaseId: number }) => Promise<{ data: any[]; code: number; msg: string }>
    }>
) {
    const { height = 500, onChange, requestTableFun } = props
    const ref = useRef<{
        dataSource: any[]
        dataBase: any[]
        dataTable: any[]
        searchValue: string[]
        searchData: any[]
        searchSelectData: Record<string, any>
    }>({ dataSource: [], dataBase: [], dataTable: [], searchValue: [], searchData: [], searchSelectData: {} })
    /* state */
    const [renderData, setRenderData] = useState<(Record<string, any>[] | 'loading')[]>(['loading'])
    const [renderSelectedData, setRenderSelectedData] = useState<Record<string, any>[]>([])
    // search
    const [value, setValue] = useState<string>()
    const [data, setData] = useState<any[]>([])

    const updateRenderSelectedData = (value: typeof renderSelectedData) => {
        setRenderSelectedData(value)
        if (onChange) {
            onChange(value)
        }
    }

    /* effect */
    // 数据源选择
    useEffect(() => {
        readDataSource().then((res) => {
            setRenderData([res.data || []])
            ref.current.dataSource = res.data || []
            if (res.code !== 200) {
                message.error(res.msg || '数据源获取失败')
            }
            setTimeout(() => {
                const nodes = document.getElementsByClassName('itemSelect')
                nodes[0] && nodes[0].scrollIntoView({ block: 'start', behavior: 'smooth', inline: 'center' })
                //nodes[1] && nodes[1].scrollIntoView({ block: "center", behavior: "smooth", inline: "center" })
                //nodes[2] && nodes[2].scrollIntoView({ block: "end", behavior: "smooth", inline: "center" })
            }, 50)
        })
    }, [])

    // 数据库选择
    useEffect(() => {
        const id = (renderSelectedData[0] || {}).id
        if (!id) return
        // 赋值loading
        renderData[1] = 'loading'
        setRenderData([...renderData])
        readDatabase({ datasourceId: id }).then((res) => {
            renderData[1] = res.data || []
            setRenderData([...renderData])
            ref.current.dataBase = res.data || []
            if (res.code !== 200) {
                message.error(res.msg || '数据库获取失败')
            }
            // 将选中项滚动到可视区域
            setTimeout(() => {
                const nodes = document.getElementsByClassName('itemSelect')
                //nodes[0] && nodes[0].scrollIntoView({ block: "start", behavior: "smooth", inline: "center" })
                nodes[1] && nodes[1].scrollIntoView({ block: 'center', behavior: 'smooth', inline: 'center' })
                //nodes[2] && nodes[2].scrollIntoView({ block: "end", behavior: "smooth", inline: "center" })
            }, 50)
        })
    }, [(renderSelectedData[0] || {}).id])

    // 数据表选择
    useEffect(() => {
        const id = (renderSelectedData[1] || {}).id
        if (!id) return
        // 赋值loading
        renderData[2] = 'loading'
        setRenderData([...renderData])
        const requestFun = requestTableFun || listTableByDatabaseId
        requestFun({ datasourceId: renderSelectedData[0].id, databaseId: id }).then((res) => {
            renderData[2] = res.data || []
            setRenderData([...renderData])
            ref.current.dataTable = res.data || []
            if (res.code !== 200) {
                message.error(res.msg || '表数据获取失败')
            }
            setTimeout(() => {
                const nodes = document.getElementsByClassName('itemSelect')
                //nodes[0] && nodes[0].scrollIntoView({ block: "start", behavior: "smooth", inline: "center" })
                //nodes[1] && nodes[1].scrollIntoView({ block: "center", behavior: "smooth", inline: "center" })
                nodes[2] && nodes[2].scrollIntoView({ block: 'end', behavior: 'smooth', inline: 'center' })
            }, 50)
        })
    }, [(renderSelectedData[1] || {}).id])

    // 搜索触发
    /* useEffect(() => {
    // 触发action
    triggerSearchSelect();
  }, [value]) */

    /* action */
    const onSelect = (data: any, index: number) => {
        // 截取长度
        const _renderData = [...renderData.slice(0, index + 1)]
        const _renderSelectedData = [...renderSelectedData.slice(0, index)]
        const _searchValue = [...ref.current.searchValue.slice(0, index)]
        // 赋值
        _renderSelectedData[index] = data

        setRenderData([..._renderData])
        setRenderSelectedData([..._renderSelectedData])
        ref.current.searchValue = [..._searchValue]

        // change
        onChange && onChange([..._renderSelectedData])

        setValue('')
    }

    const searchOnChange = (value: string, index: number) => {
        // 本地搜索
        const sourceData = [ref.current.dataSource, ref.current.dataBase, ref.current.dataTable][index] || []
        const name = ['dsName', 'physicalDatabase', 'physicalTable'][index]
        let filterData = []
        if (value) {
            filterData = sourceData.filter((v) => {
                return v[name].toLocaleLowerCase().includes(value.toLocaleLowerCase())
            })
        } else {
            filterData = [...sourceData]
        }
        renderData[index] = filterData
        ref.current.searchValue[index] = value
        setRenderData([...renderData])
    }

    // search
    const searchData = (newValue: string, callback: (data: { value: string; text: string }[]) => void) => {
        readDataTableByKeyword({ tableName: newValue }).then((res) => {
            // 组装数据
            const data = res.data || []
            data.forEach((v: any) => {
                v.label = v.tablePath
                v.value = `${v.datasourceId},${v.databaseId},${v.tableId}`
            })
            ref.current.searchData = [...data]
            console.log('search data', data)
            callback([...data])
        })
    }
    const handleChange = (newValue: string, option: any = {}) => {
        console.log('newValue', newValue, option)
        ref.current.searchSelectData = option.node || {}
        setValue(newValue)
        triggerSearchSelect(newValue)
    }
    const handleSearch = (newValue: string) => {
        console.log('search', newValue)
        if (newValue) {
            searchData(newValue, setData)
        } else {
            console.log('search empty')
            ref.current.searchData = []
            setData([])
        }
    }
    const dropdownRender = (originNode: ReactNode) => {
        const data = ref.current.searchData
        return (
            <div>
                {/* <div className={style.customRender}>搜索到<span>{data.length}</span>个结果</div> */}
                {originNode}
            </div>
        )
    }
    const triggerSearchSelect = async (value: string) => {
        const tmp = ref.current.searchSelectData
        // 触发源选中
        console.log(Date.now())
        if (value) {
            updateRenderSelectedData([
                { dsName: tmp.datasourceName, id: tmp.datasourceId },
                { physicalDatabase: tmp.databaseName, id: tmp.databaseId },
                { physicalTable: tmp.tableName, id: tmp.tableId },
            ])
            setTimeout(() => {
                const nodes = document.getElementsByClassName('itemSelect')
                nodes[0] && nodes[0].scrollIntoView({ block: 'start', behavior: 'smooth', inline: 'center' })
                nodes[1] && nodes[1].scrollIntoView({ block: 'center', behavior: 'smooth', inline: 'center' })
                nodes[2] && nodes[2].scrollIntoView({ block: 'end', behavior: 'smooth', inline: 'center' })
            }, 50)
        } else {
            updateRenderSelectedData([])
            // 手动清空数据
            const _renderData = [...renderData.slice(0, 1)]
            setRenderData(_renderData)
        }
        return
        await onSelect({ dsName: tmp.datasourceName, id: tmp.datasourceId }, 0)
        // 触发库选中
        console.log(Date.now())
        await onSelect({ physicalDatabase: tmp.databaseName, id: tmp.databaseId }, 1)
        // 触发表选中
        await onSelect({ physicalTable: tmp.tableName, id: tmp.tableId }, 2)
    }

    console.log('render data', renderSelectedData)

    return (
        <div className={style.wrap} style={{ height }}>
            <div className={style.search}>
                <Select
                    style={{ width: '100%' }}
                    placeholder='请输入表名称'
                    showSearch
                    value={value}
                    onSearch={handleSearch}
                    onChange={handleChange}
                    //showArrow={false}
                    allowClear
                    filterOption={false}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    suffixIcon={<span style={{ fontSize: 12 }} className='iconfont icon-sousuo'></span>}
                >
                    {data.map((v: any, i: number) => (
                        <Option value={`${v.datasourceId},${v.databaseId},${v.tableId}`} node={v}>
                            <span dangerouslySetInnerHTML={{ __html: v.tablePath }} />
                        </Option>
                    ))}
                </Select>
            </div>
            <div className={style.list}>
                {renderData.length > 0 &&
                    renderData.map((v, i) => (
                        <Item
                            key={i}
                            index={i}
                            title={['数据源选择', '库选择', '表选择'][i]}
                            fieldNames={
                                [
                                    { id: 'id', name: 'dsName' },
                                    { id: 'id', name: 'physicalDatabase' },
                                    { id: 'id', name: 'physicalTable' },
                                ][i]
                            }
                            dataSource={v}
                            onSelect={onSelect}
                            selectedData={renderSelectedData[i]}
                            searchOnChange={searchOnChange}
                            sourceData={[ref.current.dataSource, ref.current.dataBase, ref.current.dataTable][i]}
                            itemRender={
                                i === 0
                                    ? (data) => {
                                          const { dataWarehouse } = data
                                          return (
                                              <span>
                                                  {dataWarehouse ? (
                                                      <Tag style={{ fontSize: 12, padding: '1px 2px', lineHeight: 1 }} color='rgba(149, 169, 189, 1)'>
                                                          DW
                                                      </Tag>
                                                  ) : (
                                                      ''
                                                  )}
                                                  <span>{data.dsName}</span>
                                              </span>
                                          )
                                      }
                                    : undefined
                            }
                        />
                    ))}
            </div>
            <Info names={renderSelectedData} />
        </div>
    )
}
