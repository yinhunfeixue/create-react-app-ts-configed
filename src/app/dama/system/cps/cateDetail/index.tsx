import { Spin } from 'antd';
import { Empty, LzTable } from 'cps';
import React, { useEffect, useMemo, useState } from 'react';

import { querySystemListByCate } from '../../Service';

import EMPTY from './empty.png';

import style from './index.lees';

const typeMap = {
  1: '报表系统',
  2: '数据仓库',
  3: '其他'
}

export default function CateDetail(props: React.PropsWithChildren<{
  node: any,
  tableRowClick: (event: any) => void,
  update?: boolean
}>) {

  const { node = {}, tableRowClick, update } = props;
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState([]);
  const columns = useMemo(() => {
    return [
      {
        title: '系统',
        dataIndex: 'name',
        render: (text: any, record: any) => {
          return (
            <span>
              {record.icon && <span style={{ backgroundImage: `url(${record.icon})` }} className={style.img}></span>}
              {text}
            </span>
          )
        }
      }, {
        title: '系统类型',
        dataIndex: 'systemType',
        render: (text: any) =>  {
          return typeMap[text];
        }
      }, {
        title: '系统ID',
        dataIndex: 'id'
      }, {
        title: '供应商',
        dataIndex: 'systemSupplier',
        width: 200,
        render: (text: any) => {
          return text || <span style={{ color: '#C4C8CC' }}>-</span>
        }
      }
    ]
  },[])

  useEffect(() => {
    if(!node.id) return;
    setLoading(true);
    querySystemListByCate({ categoryId: node.id }).then(res => {
      setList(res.data || [])
      setLoading(false);
    })
  }, [node.id, update])

  return (
    <Spin spinning={loading}>
      {
        list.length <= 0 ? <Empty image={EMPTY} desc="暂无数据">你可以点击右上角按钮，添加系统</Empty> :
        <LzTable
          className={style.table}
          dataSource={list}
          columns={columns}
          pagination={false}
          onRow={
            
            record => {
              return {
                style:{cursor:'pointer'},
                onClick: () => { console.log('tableRowClick1');
                 tableRowClick && tableRowClick(record) }
              }
            }
          }
        />
      }
    </Spin>
  )
}