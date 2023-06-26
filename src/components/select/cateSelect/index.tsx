import React, { useEffect, useState } from "react";
import { Select, Cascader } from 'antd';

import { queryCate, Tdepart } from '../Service'

function loop(arr: any[]) {
  arr.forEach(v => {
    v.label = v.name;
    v.value = v.id;
    if(v.children && v.children.length > 0) {
      loop(v.children);
    }
  })   
}

export default function CateSelect(props: React.PropsWithChildren<{
  onChange?: (value: any, option: any) => void,
  value?: string[] | number[],
  placeholder?: string,
  width?: number,
}>) {

  const { onChange, value, placeholder, width = 290, ...otherParams } = props;

  const [list, setList] = useState<Tdepart[]>([]);

  useEffect(() => {
    queryCate().then(res => {
      const data = [res.data];
      loop(data);
      setList(data)
    })
  }, [])

  console.log('value', value);

  return (
    <Cascader options={list} onChange={onChange} placeholder={placeholder} style={{ width }} value={value} />
  )
}
