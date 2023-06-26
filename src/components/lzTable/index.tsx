
import AutoTip from "@/component/AutoTip";
import { CaretDownOutlined, CaretRightOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { TableProps } from 'antd/lib/table';
import classNames from 'classnames';
import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import FormTool, { TFormToolItem } from '../formTool';

import DraggerTable from "@/component/draggerTable/DraggerTable";
import style from './index.lees';

interface Tdata<T> {
  data: T[],
  total?: number,
  success?: boolean,
}

interface Tpage{
  current?: number,
  pageSize?: number,
}

interface TableHook {
  setPage: React.Dispatch<React.SetStateAction<Tpage>>
}

interface TlzTable<T> extends TableProps<any> {
  // 是否展示搜索栏 默认true
  search?: boolean,
  searchDataSource?: TFormToolItem[],
  request?: undefined | ((params?: Tpage & Record<string, any>) => Promise<Tdata<T>>),
  empty?: ReactNode,
  updateDependencies?: any[],
  useTable?: (hook: TableHook) => void,
  showExpandIcon?: boolean,
  // 是否支持拖动
  enableDrag?: boolean,
  wrapStyle?: React.CSSProperties
  // 获取formTool的form实例
  getForm?: (form: any) => void
}

const EmptyLabel = () => <span className={style.tableEmptyLabel}>-</span>;

export default function LzTable<T extends Record<string, any>>(props: React.PropsWithChildren<TlzTable<T>>) {

  const {
    search = true,
    searchDataSource = [],
    request,
    empty,
    updateDependencies,
    useTable,
    showExpandIcon = false,
    enableDrag = true,
    wrapStyle = {},
    getForm,
    ...params
  } = props;

  const ref = useRef();
  const [tableWrapWidth, setTableWrapWidth] = useState<number>(0);

  const [loadCount, setLoadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formValue, setFormValue] = useState({});
  const [data, setData] = useState<Tdata<T>>({ data: [], });
  const [pageParams, setPageParams] = useState<Tpage>({
    current: (props.pagination || {}).current || 1,
    pageSize: (props.pagination || {}).pageSize || 10,
  });
  const [update, setUpdate] = useState<boolean>(false);

  const [staticUpdate, setStaticUpdate] = useState<boolean>(false);
  // sort
  const [sortParams, setSortParams] = useState<Record<string, any>>({});

  // 展开行控制
  const [expandedRowKeys, setExpandedRowKeys] = useState<any[]>([]);

  const paginationParams = useMemo(() => {
    return  {
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total: number) => <>总数 <b>{total}</b> 条</>  ,
              ...(props.pagination || {}),
            }
  }, [])

  useEffect(() => {
    useTable && useTable({ setPage: (params) => { setPageParams({ ...pageParams, ...(params || {}) }) }, })
  }, [])

  /* effect */
  useEffect(() => {
    request && requestData();
  }, [pageParams.current, pageParams.pageSize, update, ...[updateDependencies]]);

  useEffect(() => {
    if(loadCount == 0) return;
    setPageParams({
      ...pageParams,
      current: 1,
    })
    setUpdate(v => !v);
  }, [JSON.stringify(formValue), JSON.stringify(sortParams)])

  useEffect(() => {
    if(data.data.length <= 0) { return };
    setData({ ...data })
  }, [staticUpdate])

  useEffect(() => {
    setTableWrapWidth(ref.current.offsetWidth);
  }, [])

  const formChange = (values: Record<string, any>) => {
    setFormValue(values);
  }

  const paginationChange = (page: number, pageSize?: number) => {
    //console.log('page', page, pageSize);
    pageParams.current = page;
    pageParams.pageSize = pageSize;
    setPageParams({...pageParams});
  }

  const requestData = (params?: Record<string, any>) => {
    setLoading(true);
    request && request(
      {
        ...pageParams,
        ...sortParams,
        ...formValue,
        ...(params || {}),
      }
    ).then(res => {
      setLoadCount(c => ++c);
      setLoading(false);
      setData(res)
    })
  }

  const expandedRowsChange = (expandRows: React.Key[]) => {
    setExpandedRowKeys(expandRows)
  }

  const expandAll = () => {
    if (expandedRowKeys.length > 0) {
      setExpandedRowKeys([]);
    } else {
      const keys = ((data || {}).data || []).map(v => v[props.rowKey as string || 'id']);
      setExpandedRowKeys(keys)
    }
  }

  const customExpandIcon = (props: any) => {
    console.log('props', props);
    return (
      <a style={{ color: '#5E6266' }} onClick={e => { props.onExpand(props.record, e) }}>
        {
          props.expanded ? <CaretDownOutlined style={{ fontSize: 12 }} /> : <CaretRightOutlined style={{ fontSize: 12 }} />
        }
      </a>
    )
  }

  // 添加拖拽信息，添加空标签信息
  const useColumns = (props.columns || []).map((item, index) => {
    const { fixed } = item
    if (enableDrag) {
        item.onHeaderCell = (data) => {
            return {
                fixed,
                index,
            } as any
        }
    }
    /* if(item.render) {
      item.render = (text, record, index) => {
        return item.render(text, record, index) || <EmptyLabel/>
      }
    } */
    if(!item.render) {
      item.render = (text, record, index) => {
        return <AutoTip content={text}>{text}</AutoTip> || <EmptyLabel/>
      }
    }
    // 固定
    item.ellipsis = item.ellipsis == false ? false : true
    return item
  })

  const tableChange = (pagination: any, filters: any, sorter: { field: string, order: 'ascend' | 'descend' } = {}, extra: any) => {
    // 监听排序
    const { field, order } = sorter;
    setSortParams({ [`${field}_order`]: order })
  }

  const getScrollValue = () => {
    const tableWrap = ref.current;
    if(!tableWrap) return 0;
    const content = tableWrap.getElementsByClassName('ant-table-content')[0] as HTMLElement
    if (content) {
        return content.scrollWidth - content.offsetWidth
    }
}

  const scrolling = getScrollValue() > 0

  const dataSource = props.dataSource || (data || {}).data || [];

  return (
    <div style={{ ...wrapStyle }}>
      <Spin spinning={loadCount === 0 && !!empty}>
        {
          loadCount ===1 && ((data || {}).data || []).length <= 0 && empty ? empty :
          <>
            { search && <FormTool bottom={16} dataSource={searchDataSource} onChange={formChange} getForm={getForm} /> }
            <div ref={ref} className={classNames(style.tableWrap, { [`${style.expandWrap}`]: showExpandIcon })}>
              {
                showExpandIcon && (
                  <span>
                    <span onClick={expandAll} className={`expandIcon iconfont ${(expandedRowKeys.length === dataSource.length) && expandedRowKeys.length > 0 ? 'icon-shouqi3' : 'icon-zhankai3'}`}></span>
                  </span>
                )
                }
                <DraggerTable
                  key={scrolling ? 1 : 0}
                  dataSource={dataSource}
                  {...params}
                  pagination={props.pagination === false ? false : {
                    ...paginationParams,
                    onChange: paginationChange,
                    total: (data || {}).total || 0,
                    pageSize: pageParams.pageSize,
                    current: pageParams.current
                  }}
                  loading={loading}
                  expandedRowKeys={expandedRowKeys}
                  onExpandedRowsChange={expandedRowsChange}
                  expandIcon={(props) => customExpandIcon(props)}
                  expandedRowClassName={props.expandedRowClassName}
                  onChange={tableChange}
                />
           
            </div>
          </>
        }
      </Spin>
    </div>
  )
}
