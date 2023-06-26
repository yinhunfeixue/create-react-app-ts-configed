import React, { useEffect, useState } from "react";
import { Select, message } from 'antd';

import { queryDepart, Tdepart } from '../Service'

export default function DepartSelect(props: React.PropsWithChildren<{
  onChange?: (value: any, option: any) => void,
  value?: string,
  placeholder?: string,
  width?: number,
  mode?: 'multiple'|'tags',
  excludeId?: string,
  initEmpty?: boolean
}>) {

  const { onChange, value, placeholder, width = 290, mode, initEmpty, excludeId } = props;

  const [list, setList] = useState<Tdepart[]>([]);


  useEffect(() => {
    if(initEmpty && !excludeId) return;
    queryDepart().then(res => {
      if(res.code == 200) {
        let data = res.data || [];
        data = data.filter(v => v.id !== excludeId);
        setList([...data])
      } else {
        message.error(res.msg || '部门获取失败')
      }
    })
  }, [excludeId, initEmpty])

  return (
    <Select
      style={{ width }}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      mode={mode}
    >
      {
        list.map((v, i) => <Select.Option value={v.id}>{v.departName}</Select.Option>)
      }
    </Select>
  )
}
