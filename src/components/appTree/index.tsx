
import React, { ReactNode, useEffect, useRef, useState, useLayoutEffect } from 'react';

import App, { ToverlayMenuItems } from './app';

import './index.less';

export default function AppTree(props: React.PropsWithChildren<{

  treeData: any[],
  moreOverlayMenuItem?: (data: any) => ToverlayMenuItems[],
  selectedKeys?: string[],
  footer?: boolean,
  hideAdd?: boolean
  hideSort?: boolean
  fieldNames?: Record<string, any>,
  height?: number | string,
  renderNode?: (data: any) => ReactNode,
  renderNodeMore?: (data: any) => ReactNode,
  renderTitle?: (index: number) => ReactNode
  renderEmpty?: (index: number, parentId?: number) => ReactNode,
  onAdd?: (appIndex: number, parentId: number) => void,
  onSelect?: (data: any, index: number) => void,
  sortChange?: (data: any) => void,
  width?: number|string,
  firstTitle?: ReactNode,

}>) {

  const ref = useRef<{parent: Record<string, any>}>({parent: {}})

  /* value */
  const {
    width,
    treeData = [],
    renderNode,
    renderNodeMore,
    moreOverlayMenuItem,
    selectedKeys = [],
    footer = true,
    hideAdd,
    hideSort,
    fieldNames = {},
    renderTitle,
    height = 526,
    renderEmpty,
    onAdd,
    onSelect,
    sortChange,
    firstTitle
  } = props;

  /* 标识 */
  const fieldName_children = fieldNames['children'] || 'children';

  /* state */
  const [renderData, setRenderData] = useState<any[]>([treeData]);
  const [renderKeys, setRenderKeys] = useState<any[]>([]);

  /* effect */
  useEffect(() => {
    console.log('selectedKeys effect', selectedKeys);
    // props传递进来的selectedKeys变化时，重置renderKeys
    // 此时也需生成新的renderData
    let _renderData = [treeData];
    let level = 0;
    let current = treeData;

    // 搜索置空时，没有选中key
    if(selectedKeys.length <= 0) {
      setRenderKeys([...selectedKeys]);
      setRenderData(_renderData);
      return;
    }

    while(level < selectedKeys.length) {
      // 空数据的render要加上
      if (current && current.length > 0) {
        current.forEach(v => {
          if (v.id == selectedKeys[level]) {
            _renderData.push(v[fieldName_children] || []);
            current = v[fieldName_children] || [];
          }
        })
      }
      level++;
    }

    setRenderData(_renderData);
    setRenderKeys([...selectedKeys]);

  }, [selectedKeys.join(',')]);

  useEffect(() => {
    // props传递进来的treeData变化时，重置renderData
    // treeData变化时，根据renderKeys构建出新的renderData
    let _renderData = [treeData];
    let level = 0;
    let current = treeData;

    while(level < renderKeys.length) {
      if (current && current.length > 0) {
        current.forEach(v => {
          if (v.id == renderKeys[level]) {
            _renderData.push( v[fieldName_children] || []);
            current = v[fieldName_children] || [];
          }
        })
      }
      level++;
    }
    setRenderData(_renderData);
  }, [JSON.stringify(treeData)])

  /* event */
  const selectChange = (_data: any, index: number) => {

    const data = JSON.parse(JSON.stringify(_data));
    const _renderData = [...renderData.slice(0, index+1)];

    renderKeys[index] = _data.id;
    const _renderKeys = [...renderKeys.slice(0, index+1)]

    // 添加parent, 子级空数据也要添加
    ref.current.parent[index+1] = data;

    if (data[fieldName_children] && data[fieldName_children].length > 0) {

      _renderData.push(data[fieldName_children])

    } else if(renderEmpty) {
      // 允许选中节点展示空数据
      _renderData.push([])
    }

    setRenderData(_renderData);
    setRenderKeys(_renderKeys);
  }

  const handleAdd = (dataIndex: number, parentId: number) => {
    onAdd && onAdd(dataIndex, parentId);
  }
  
  return (
    <div className='lz-rc-appTree'>
      <div className="lz-rc-appTree-wrap" style={{ height }}>
        {
          renderData.map((v, i) => (
            <App
              key={`${v.id}_${i}`}
              appIndex={i}
              title={renderTitle ? renderTitle(i) : `第${i}层级`}
              dataSource={[...v]}
              selectedKey={renderKeys[i]}
              selectChange={selectChange}
              renderNode={ renderNode || ((data) => <span>{data.name}</span>)}
              renderNodeMore={renderNodeMore}
              renderEmpty={renderEmpty}
              moreOverlayMenuItem={moreOverlayMenuItem}
              footer={footer}
              hideAdd={hideAdd}
              hideSort={hideSort}
              onAdd={handleAdd}
              parent={ref.current.parent[i]}
              sortConfirm={sortChange}
              firstTitle={firstTitle}
            />
          ))
        }
      </div>
    </div>
  )
}
