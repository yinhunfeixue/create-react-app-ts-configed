import SearchTable from '@/base/components/ManagerPage/SearchTable';

/**
 * 表格相关的控制组件props
 */
interface ITableControlProps {
  /**
   * 选中的行
   */
  selectedRows: any[];

  /**
   * 选中的key列表
   */
  selectedRowsKeys: any[];

  /**
   * 重置表格到第一页，并刷新数据
   */
  resetTable: () => void;

  /**
   * 在当前页刷新数据
   */
  refreshTable: () => void;

  /**
   * 表格实例，如需要更多操作，可使用table.***
   */
  table: SearchTable;
}

export default ITableControlProps;
