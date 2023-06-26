import { Input, Tree } from 'antd';
import type { TreeProps } from 'antd/lib/tree';
import classnames from 'classnames';
import React from 'react';

import style from './index.lees';

let mock = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
          {
            title: 'leaf',
            key: '0-0-0-2',
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [
          {
            title: 'leaf',
            key: '0-0-1-0',
          },
        ],
      },
      {
        title: 'parent 1-2',
        key: '0-0-2',
        children: [
          {
            title: 'leaf',
            key: '0-0-2-0',
          },
          {
            title: 'leaf',
            key: '0-0-2-1',
          },
        ],
      },
    ],
  }, {
    title: 'parent2',
    key: '1-1',
  }
]

interface ListPorps extends TreeProps {
  className?: string,
  search?: boolean,
  fieldNames?: Record<string, any>,
  searchChange?: (value: any) => void,
}

export default function List(props: React.PropsWithChildren<ListPorps>) {

  /* value */
  const { search, className, searchChange, ...params } = props;

  return (
    <div className={classnames(style.wrap, { [`${className}`]: !!className, [`${style.search}`]: search })}>
      { search && (
        <div className={style.search}>
          <Input.Search placeholder='分类、应用搜索' onChange={searchChange}  />
        </div>
      )}
      {
        (props.treeData || []).length > 0 ?
          <Tree
            style={{ height: search ? 'calc(100% - 64px)' : '100%' }}
            className={classnames(style.treeWrap)}
            {...params}
          >
            {props.children}
          </Tree> :
          null
      }
      
    </div>
  )

}

