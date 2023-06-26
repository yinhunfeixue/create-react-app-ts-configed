import React, { useEffect, useState } from "react";
import { Select, SelectProps } from 'antd';
import classnames from 'classnames';

import styles from './index.lees';


const mock = [{ id: 1, name: 1 }, { id: 2, name: 2 }];

interface SearchOptions extends SelectProps {
  className?: string,
  style?: React.CSSProperties,
  searchRequest?: (params: any) => Promise<{ data: any[] }>,
}

export default function AppTreeSearch (props: React.PropsWithChildren<SearchOptions>) {

  const { className, searchRequest, style, ...otherParams } = props;

  /* state */
  const [searchValue, setSearchValue] = useState<string>('');
  const [data, setData] = useState<any[]>([]);
  const [count, setCount] = useState<number>(0);


  /* effect */
  useEffect(() => {
    if(count === 0) return;
    requestData();
    setCount(c => c + 1);
  }, [searchValue])

  const change = (e: any) => {
    console.log('change',e)
  }

  const search = (value: any) => {
    console.log('search', value);
    setSearchValue(value);
  }

  const requestData = () => {
    searchRequest && searchRequest({ searchValue: '' }).then(res => {
      const { data } = res;
      setData(mock || [...data]);
    })
  }

  return (
    <div className={classnames(styles.wrap, { [`${className}`]: className })} style={style}>
      <Select
        {...otherParams}
        allowClear
        showSearch
        filterOption={false}
        style={{ minWidth: '280px' }}
        suffixIcon={<span className='iconfont icon-sousuo'></span>}
        onChange={change}
        onSearch={search}
      >
        {
          mock.map((v, i) => (
            <Select.Option key={v.id}>
              {v.name}
            </Select.Option>
          ))
        }
      </Select>
    </div>
  )
}
