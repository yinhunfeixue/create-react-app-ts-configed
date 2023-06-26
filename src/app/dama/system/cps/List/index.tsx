import React, { useEffect, useRef, useState } from 'react';
import { Input, Tree } from 'antd';
import { querySystemList, Tsystem } from '../../Service';
import type { DataNode, TreeProps } from 'antd/lib/tree';
import classnames from 'classnames';

import style from './index.lees';

let mock: Tsystem[] = [
  {
    id: 1,
    name: '报表系统',
    desc: '这是分类的描述',
    systemList: [
      {
        hasPath: false,
        icon: '',
        id: 12,
        name: '帆软报表',
        outSysId: 1,
        
      }, {
        hasPath: false,
        icon: '',
        id: 13,
        name: 'smartbi报表',
        outSysId: 1,
      }
    ]
  },{
    id: 2,
    name: '业务系统',
    desc: '这是业务系统分类的描述',
    systemList: [
      {
        hasPath: false,
        icon: '',
        id: 14,
        name: 'dashu报表',
        outSysId: 1,
      },       {
        hasPath: false,
        icon: '',
        id: 15,
        name: '报表',
        outSysId: 1,
      }
    ]
  }
]

export default function List(props: React.PropsWithChildren<{
  dataChange: (data: any) => void,
  className?: string,
  selectChange: (e: any) => void
}>) {

  /* value */
  const { dataChange, className, selectChange } = props;
  const ref = useRef<{ init?: boolean }>({});

  /* state */
  const [systemList, setSystemList] = useState([]);
  const [value, setValue] = useState<string>('');
  

  /* effect */
  useEffect(() => {
    console.log('effect');
    querySystemList({ keyword: value }).then(data => {
      const treeData = mock.map(v => {
        let children = v.systemList.map(k => ({
          title: k.name,
          key: k.id,
          isLeaf: true,
          ...k
        }))
        return {
          title: v.name,
          key: v.id,
          desc: v.desc,
          children,
        }
      })
      setSystemList(treeData);
      // 数据获取监听
      dataChange && dataChange(treeData);
      if (!ref.current.init) {
        selectChange({ node: treeData[0] });
      }
      ref.current.init = true;
    })
  }, [value, selectChange])

  /* event */
  const search = (value: string) => {
    console.log('value', value)
  }

  const onDragEnter: TreeProps['onDragEnter'] = info => {
    //console.log(info);
    // expandedKeys 需要受控时设置
    // setExpandedKeys(info.expandedKeys)
  };

  const onDrop: TreeProps['onDrop'] = info => {
    console.log(info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    // 子节点不能拖动到父节点之外
    if (!info.dragNode.children && info.node.children) {
      return;
    }
    // 子节点不能拖动到其它父节点下面



    console.log('dropKey', dropKey);
    console.log('dragKey', dragKey);
    console.log('dropPosition', dropPosition);

    const loop = (
      data: DataNode[],
      key: React.Key,
      callback: (node: DataNode, i: number, data: DataNode[]) => void,
    ) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children!, key, callback);
        }
      }
    };
    const data = [...systemList];

    // Find dragObject
    let dragObj: DataNode;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      ((info.node as any).props.children || []).length > 0 && // Has children
      (info.node as any).props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar: DataNode[] = [];
      let i: number;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i!, 0, dragObj!);
      } else {
        ar.splice(i! + 1, 0, dragObj!);
      }
    }
    setSystemList(data);
  };

  const nodeSelect = (selectedKeys: number, e: any) => {
    console.log(selectedKeys, e);
    selectChange && selectChange(e)
  }

  return (
    <div className={classnames(style.wrap, className)}>
      <div className={style.header}>
        <h2>系统目录</h2>
        <span>拖拽可排序</span>
        <i>+</i>
      </div>
      <div className={style.search}>
        <Input.Search placeholder='分类、应用搜索' onSearch={search} />
      </div>
      <Tree
        className={style.treeWrap}
        treeData={systemList}
        showLine={false}
        draggable
        blockNode
        onDrop={onDrop}
        onDragEnter={onDragEnter}
        onSelect={nodeSelect}
      />
    </div>
  )

}

