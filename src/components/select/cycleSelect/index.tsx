import React, { useEffect, useState } from "react";
import { Select } from 'antd';

import { queryCycle } from '../Service'

export default function CycleSelect(props: React.PropsWithChildren<{
  onChange?: (value: any, option: any) => void,
  value?: string,
  placeholder?: string,
  width?: number,
  mode?: 'multiple'|'tags',
}>) {

  const { onChange, value, placeholder, width = 290, mode } = props;

  const [list, setList] = useState<any[]>([]);

  useEffect(() => {
    queryCycle().then((data) => {
      const _data = data as unknown as any[];
      setList(_data);
    })
  }, [])

  return (
    <Select
      style={{ width }}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
      mode={mode}
    >
      {
        list.map((v, i) => <Select.Option value={v.id}>{v.name}</Select.Option>)
      }
    </Select>
  )
}
