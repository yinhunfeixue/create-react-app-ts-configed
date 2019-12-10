import { ReactNode } from '@/base/interfaces/node_modules/react';
import ITableControlProps from './ITableControlProps';

interface ISearchTableProps {
  /**
   * 表格的列数据
   */
  columns: {
    dataIndex: string;
    title: string;
    render?: (text: string, record: any) => ReactNode;
    [propsName: string]: any;
  }[];

  /**
   * 搜索参数
   */
  searchParams?: { [key: string]: any };

  /**
   * 创建搜索请求数据
   */
  createSearchRequest: (
    currentPage: number,
    pageSize: number,
    searchValues: any
  ) => any;

  /**
   * 每页最大条数
   */
  pageSize?: number;

  /**
   * 解析返回值的方法
   */
  parseResponse?: (response: any) => { total: number; dataSource: any[] };

  rowKey?: string;

  /**
   * 创建控制区组件
   */
  createControl?: (props: ITableControlProps) => ReactNode;

  /**
   * 是否可选
   */
  selectEnable: boolean;

  onSelectedChange: (
    selectedRowKeys: string[] | number[],
    selectedRows: any[]
  ) => void;

  requestErrorHandler: (error: any) => void;

  /**
   * 其它给table设置的props
   */
  tableProps: { [key: string]: any };
}

export default ISearchTableProps;
