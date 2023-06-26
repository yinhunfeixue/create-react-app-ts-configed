import { Input, Popover } from 'antd';
import React, { ReactNode, useEffect, useState } from "react";
import { arrayMove } from 'react-sortable-hoc';
import style from './index.lees';

import Sort from "./sort";

import classnames from "classnames";
import DOWN from './img/arrow_down.png';
import RIGHT from './img/arrow_right.png';

const More = (props: React.PropsWithChildren<{
  color?: string,
  bgColor?: string,
  className?: string,
  content?: ReactNode,
}>) => {
  /* const [visible, setVisible] = useState(false); */
  return (
    <Popover /* visible={visible} */ trigger="click" placement="rightBottom" content={<div /* onClick={() => setVisible(false)} */>{props.content}</div>} overlayClassName={style.popover}>
      <span /* onClick={() => setVisible(true)} */ className={classnames('more', { [`${props.className}`]: !!props.className })} style={{ backgroundColor: props.bgColor }}>
        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9228"><path width={16} height={16} d="M608 864c0 53.12-42.88 96-96 96s-96-42.88-96-96S458.88 768 512 768s96 42.88 96 96z m0-352c0 53.12-42.88 96-96 96S416 565.12 416 512 458.88 416 512 416s96 42.88 96 96z m0-352C608 213.12 565.12 256 512 256s-96-42.88-96-96S458.88 64 512 64s96 42.88 96 96z" fill={props.color} p-id="9229"></path></svg>
      </span>
    </Popover>
  )
}

export interface TsortItem extends Record<string, any> {
  title: string,
  children?: TsortItem[]
}

export default function DragDirectory(props: React.PropsWithChildren<{
  dataSource: Record<string, any>[],
  selectChange?: (value: Record<string, any>, type?: 'main' | 'sub') => void,
  expandChange?: (value: Record<string, any>) => void,
  sortChange?:(value: Record<string, any>[], type?: 'main' | 'sub') => void,
  moreContent?: (value: Record<string, any>) => ReactNode,
  subMoreContent?: (value: Record<string, any>) => ReactNode,
  defaultSelectedKey?: Set<any>,
  selectedKey?: Set<any>,
  defaultExpandKey?: Set<any>,
  expandKey?: Set<any>,
  disabledMainSelected?: boolean,
  search?: boolean,
  searchChange?: (value?: any) => void,
  searchOnChange?: (value?: any) => void,
  renderTitle?: (value?: any) => void,
  renderSubTitle?: (value?: any) => void,
}>) {

  const {
    dataSource = [],
    moreContent,
    subMoreContent,
    selectChange,
    expandChange,
    defaultSelectedKey = new Set(),
    defaultExpandKey = new Set(),
    selectedKey = new Set(),
    /* expandKey = new Set(), */
    sortChange,
    disabledMainSelected,
    search = true,
    searchChange,
    searchOnChange,
    renderTitle,
    renderSubTitle,
  } = props;
  const [sortData, setSortData] = useState(dataSource);
  /* const [selectedKey, setSelectedKey] = useState( defaultSelectedKey.size > 0 ? defaultSelectedKey : new Set()); */
  const [expandKey, setExpandkey] = useState(defaultExpandKey.size > 0 ? defaultExpandKey : new Set());

  /* effect */
  useEffect(() => {
    setSortData([...dataSource])
  }, [JSON.stringify(dataSource)])

  /* event */
  const onExpand = (value: any) => {

    // 改回内部状态
    if(expandKey.has(value.id)) {
      expandKey.delete(value.id)
    } else {
      expandKey.add(value.id);
    }
    setExpandkey(new Set([...expandKey]));

    /* expandChange && expandChange(value); */
  }
  // 选中
  const onSelect = (value: any, type: 'main' | 'sub') => {
    console.log('onSelect');
    onExpand(value);
    if(!disabledMainSelected || type === 'sub') {
      selectChange && selectChange(value);
    }
  }

  // 拖拽结束
  const sortEnd = (params: Record<string, any>) => {
    console.log('params', params);
    const data = [...arrayMove(sortData, params.oldIndex, params.newIndex)];
    // 发生排序时触发
    if (JSON.stringify(data) !== JSON.stringify(sortData)) {
      console.log('sort change');
      setSortData(data);
      sortChange && sortChange(data, 'main')
    }
  }
  // sub sort
  const sortSubItem = (params: Record<string, any>) => {
    const { value = {} } = params;
    return (
      <div className={`drag-sort-sub-item`}>
        <p className={classnames({ [style.selected]: selectedKey.has(value.key) })}>
          <span className={style.img} style={{ backgroundImage: `url(${value.icon})` }}>
            {/* {value.icon && <img width={15} height={15} src={value.icon} />} */}
          </span>
          <span
            className={style.sortText}
            onClick={() => { onSelect(value, 'sub') }}
          >
            {
              renderSubTitle ? renderSubTitle(value) : value.title
            }
          </span>
          {
            subMoreContent && (
              <More content={subMoreContent(value)} className="subMore"/>
            )
          }
        </p>
      </div>
    )
  }
  // sort
  const sortItem = (params: Record<string, any>) => {
    const { value = {} } = params;
    const subSortEnd = (params: Record<string, any>) => {
      let sorted = false;
      sortData.forEach(v => {
        if (v.key === value.key) {
          const data = arrayMove(v.children as [], params.oldIndex, params.newIndex);
          if(JSON.stringify(data) !== JSON.stringify(v.children)) {
            sorted = true;
            sortChange && sortChange([...data], 'sub');
          }
          v.children = data;
        }
      })
      if(sorted) {
        console.log('sorted change');
        setSortData([...sortData]);
      }
    }

    return (
      <div className={`drag-sort-item`}>
        <p className={classnames({ [style.selected]: selectedKey.has(value.key) })}>
          <span className={style.img}>
            {
              (value.children || []).length > 0 && <img onClick={() => { onExpand(value) }} width={15} height={15} src={ expandKey.has(value.id) ? DOWN : RIGHT} />
            }
          </span>
          <span className={style.sortText} onClick={() => { onSelect(value, 'main') }}>{value.title}</span>
          {
            moreContent && (
              <More content={moreContent(value)}/>
            )
          }
        </p>
        {
          (value.children || []).length > 0 && (
            <div className={classnames({ [style.expand]: expandKey.has(value.id) })}>
              <Sort
                className={classnames(style.subSortWrap)}
                items={value.children}
                sortItem={sortSubItem}
                onSortEnd={subSortEnd}
              />
            </div>
          )
        }
      </div>
    )
  }

  return (
    <div className={style.wrap}>
      <div className={style.search}>
        <Input.Search placeholder="分类应用搜索" onSearch={searchChange} onChange={e => { searchChange && searchChange(e.target.value) }} />
      </div>
      <Sort
        className={style.sortWrap}
        items={sortData}
        sortItem={sortItem}
        onSortEnd={sortEnd}
      />
    </div>
  )
}