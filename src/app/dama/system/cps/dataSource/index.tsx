import React, { useEffect, useState, useCallback } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Modal, Button, Input, Checkbox, Tooltip, List, Skeleton, Divider, message } from 'antd';

import style from './index.lees';

import { queryDataSourceList, TdataSource, createSystemDataSource } from '../../Service';
import InfiniteScroll from 'react-infinite-scroll-component';

const Svg = <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7691" width="14" height="14"><path d="M512 64a448 448 0 1 1 0 896A448 448 0 0 1 512 64z m256 396.8H256v102.4h512V460.8z" fill="#9EA3A8" p-id="7692"></path></svg>


export default function DataSource(props: React.PropsWithChildren<{
  visible: boolean,
  onCancel: () => void,
  onChange?: () => void,
  sysId?: string
  submitChange?: () => void,
}>) {

  const { visible, onCancel, sysId, submitChange } = props;
  const [list, setList] = useState<TdataSource[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchValue, setSearchValue] = useState('');
  const [changeValue, setChangeValue] = useState('');

  const [selecedList, setSelectedList] = useState(new Map());

  const loadMoreData = useCallback((initPage?: number) => {
    console.log('loadMoreData', hasMore, page, list);
    if(!sysId) return;
    if(loading) return;
    setLoading(true);
    setHasMore(true);
    queryDataSourceList({ systemId: sysId, pageSize: 10, pageNum: searchValue ? 1 : initPage || page, keyword: searchValue }).then(res => {
      if(res.code === 200) {
        const data = res.data || [];
        if (data) {
          const _data = [...(initPage == 1 ? [] : list), ...res.data];
          if(_data.length >= (res.total || 0)) {
            setHasMore(false);
          }
          setList(_data);
          setPage(page => ++page);
        } else {
          setHasMore(false);
        }
      }
      setLoading(false);
    })
  }, [list, page, sysId, searchValue, loading])

  useEffect(() => {
    if(!visible) {
      setList([])
      setChangeValue(undefined);
      setSearchValue('');
    }
    if(!visible) return;
    // 置空状态
    setSelectedList(new Map());
    setPage(1);
    setList([])
    setHasMore(true);

    loadMoreData(1);
  }, [visible])

  useEffect(() => {
    setPage(1);
    loadMoreData(1);
  }, [searchValue])

  const change = (checked: boolean, item: any) => {
    if(checked) { selecedList.set(item.id, item) }
    if(!checked) { selecedList.delete(item.id) };
    setSelectedList(new Map(Array.from(selecedList)));
  }

  const remove = (value: any) => {
    selecedList.delete(value.id);
    setSelectedList(new Map(Array.from(selecedList)));
  }

  const submit = async () => {
    const res = await createSystemDataSource({ systemId: sysId, datasourceIds: Array.from(selecedList.keys()) })
    if (res.code === 200) {
      message.success(`成功关联${selecedList.size}条数据`);
      onCancel();
      submitChange && submitChange();
    } else {
      message.error(res.msg || '操作失败')
    }
  }

  const search = (value: string) => {
    setSearchValue(value);
  }

  return (
    <Modal
      width={800}
      title={<>关联数据源<Tooltip title='默认关联关系，想切换为直属关系，需在"数据源编辑页"操作'><InfoCircleOutlined /></Tooltip></>}
      visible={visible}
      onCancel={onCancel}
      wrapClassName={style.modal}
      onOk={submit}
    >
      <div className={style.wrap}>
        <div className={style.left}>
          <Input.Search placeholder='搜索数据源' width={431} onSearch={search} value={changeValue} onChange={(e) => { setChangeValue(e.target.value) }} />
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
              //loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
              endMessage={<Divider plain>没有更多数据了</Divider>}
              scrollableTarget="cate-system-dataSource"
            >
              <List
                dataSource={list}
                renderItem={item => (
                  <div className={style.listItem}>
                    <Checkbox disabled={item.selected} checked={selecedList.has(item.id) || item.selected} onChange={(e) => { change(e.target.checked, item) }} ><span className={style.text}>{item.dsName}</span></Checkbox>
                    <span><Tooltip title={item.identifier}>{item.identifier}</Tooltip></span>
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
                <div key={v.id}><span onClick={() => { remove(v) }}>{Svg}</span>{v.dsName}</div>
              ))
            }
          </div>
        </div>
      </div>
    </Modal>
  )
}
