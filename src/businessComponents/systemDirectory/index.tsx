import React, { useEffect, useState } from "react";
import { SearchTree, DirectoryTree } from 'cps';
import classnames from 'classnames';
import { querySystemList } from './service';

import style from './index.lees';

interface TsystemDirectory {
  searchChange?: (value: any) => void
  selectChange?: (selectedKeys: string[], e: any) => void
}

export default function SystemDirectory(props: React.PropsWithChildren<TsystemDirectory>) {

  const { selectChange } = props;

  const [treeData, setTreeData] = useState<any[]>([]);

  useEffect(() => {
    querySystemList({ keyword: '' }).then(res => {
      console.log('res', res);
      const { data = [] } = res;
      setTreeData(data);
    })
  }, [])

  /* event */
  const treeSelect = (selectedKeys: any, e: any) => {
    console.log('selectedKeys', selectedKeys, e);
    selectChange && selectChange(selectedKeys, e);
  }

  return (
    <div>
      {<SearchTree
        treeProps={{
          treeData: treeData,
          fieldNames: { key: 'id', children: 'systemList', title: 'name' }
        }}
      />}
      {/* <DirectoryTree
        className={style.tree}
        fieldNames={{ key: 'id', children: 'systemList', title: 'name',  }}
        treeData={treeData}
        showLine={false}
        blockNode
        search
        //searchChange={searchChange}
        titleRender={
          (node: any) => (
            <p className={classnames(style.treeTitle, style[`${node.systemType ? 'subMenu' : 'mainMenu'}`])}>
              {node.systemType && <i style={{ backgroundImage: `url(${node.icon})` }} />}
              <span className={style.text}>{node.name}</span>
            </p>
          )
        }
        onSelect={treeSelect}
      /> */}
    </div>
  )
}
