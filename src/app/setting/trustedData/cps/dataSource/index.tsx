import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Input, Checkbox, Tooltip, List, Divider, message } from 'antd';

import style from './index.lees';

import { readDataSource } from '@/api/trustData';
import InfiniteScroll from 'react-infinite-scroll-component';
import AutoTip from '@/component/AutoTip';

const Svg = <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7691" width="14" height="14"><path d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m256 396.8H256v102.4h512V460.8z" fill="#9EA3A8" p-id="7692"></path></svg>

/* 
  这个组件状态记录很强劲，destory不起作用，还要手动置空状态
*/

export default function DataSource(props: React.PropsWithChildren<{
  values?: any[],
  visible: boolean,
  onCancel: () => void,
  onChange?: (data: any[]) => void,
}>) {

  const { visible, onCancel, onChange, values = [] } = props;

  /* state */
  const [list, setList] = useState<any[]>([]);
  const [selecedList, setSelectedList] = useState(new Map());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  const loadMoreData = useCallback((initPage: number, initList: any[]) => {
    readDataSource({ page: initPage || page , pageSize: 10, keyword: searchValue }).then(res => {
      const newList = [...(initList || list), ...(res.data || [])];
      setList([...newList]);
      setPage(page => (initPage || page) + 1);
      setHasMore(newList.length < (res.total || 0))
    })
  }, [page, searchValue])



  useEffect(() => {
    if(!visible) {
      setPage(1);
      setList([]);
      setSelectedList(new Map());
      return;
    }
    loadMoreData(1, []);
  }, [searchValue, visible])

  useEffect(() => {
    let m = new Map();
    values.forEach(v => m.set(v.id*1, v));
    setSelectedList(m);
  }, [JSON.stringify(values)])

  /* action */
  const submit = () => {
    onChange && onChange([...(selecedList.values())])
    onCancel();
  }

  const remove = (value: any) => {
    if(value.flag) return;
    selecedList.delete(value.id*1);
    selecedList.delete(`${value.id}`);
    setSelectedList(new Map(Array.from(selecedList)));
  }

  const change = (checked: boolean, item: any) => {
    if(checked) { selecedList.set(item.id, item) }
    if(!checked) { selecedList.delete(item.id) };
    setSelectedList(new Map(Array.from(selecedList)));
  }

  const inputSearch = (value: string) => {
    setSearchValue(value);
  }

  return (
    <Modal
      width={800}
      title="添加数据源"
      visible={visible}
      onCancel={onCancel}
      wrapClassName={style.modal}
      onOk={submit}
      destroyOnClose
    >
      {
        visible ? (
          <div className={style.wrap}>
            <div className={style.left}>
              <Input.Search onSearch={inputSearch} placeholder='搜索数据源' width={431} />
              <div
                className={style.list}
                id="cate-system-dataSource" 
                style={{
                  height: 400,
                  overflow: 'auto',
                  padding: '0 16px',
                }}
              >
                <InfiniteScroll
                  dataLength={list.length}
                  next={loadMoreData}
                  hasMore={hasMore}
                  loader={<></>}
                  endMessage={list.length ? <Divider plain>没有更多数据了</Divider> : ''}
                  scrollableTarget="cate-system-dataSource"
                >
                  <List
                    dataSource={list}
                    renderItem={item => (
                      <div className={style.listItem}>
                        <Checkbox onChange={(e) => { change(e.target.checked, item) }} disabled={item.selected} checked={selecedList.has(item.id) || item.selected} >
                          <span className={style.text}>
                            <AutoTip content={item.name} />
                          </span>
                        </Checkbox>
                        <span><AutoTip content={item.type} /></span>
                      </div>
                    )}
                  />
                </InfiniteScroll>
              </div>
            </div>
            <div className={style.right}>
              <p className={style.title}>已选数据源（{selecedList.size}）</p>
              <div className={style.selectedList}>
                {
                  Array.from(selecedList.values()).map(v => (
                    <div key={v.id}><span onClick={() => { remove(v) }}>{Svg}</span>{v.name}</div>
                  ))
                }
              </div>
            </div>
          </div>
        ) : null
      }
    </Modal>
  )
}
