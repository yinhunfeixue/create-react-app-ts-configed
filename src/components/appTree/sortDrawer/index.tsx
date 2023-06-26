import DragSortingTable from '@/app/datamodeling/ddl/dragSortTable';
import DrawerLayout from '@/component/layout/DrawerLayout';
import { Button } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import '../index.less';

export default function SortDrawer(props: {
  visible: boolean,
  onClose: () => void,
  dataSource: any[],
  onOk?: (data: any) => void
}) {

  const { visible, onClose, dataSource = [], onOk } = props;

  const [tableData, setTableData] = useState([...dataSource]);

  const columns = useMemo(() => (
    [
      { title: '序号', dataIndex: 'key', render: (text: any,record: any, index: number) => <span>{index + 1}</span> },
      { title: '名称', dataIndex: 'name' }
    ]
  ), [])

  useEffect(() => {
    setTableData([...dataSource])
  }, [JSON.stringify(dataSource)])

  const getSortData = (data: any) => {
    setTableData([...data]);
  }

  const ok = () => {
    onOk && onOk(tableData);
    onClose();
  }

  return (
    <DrawerLayout
      drawerProps={{
        className: 'categoryDetailDrawer',
        title: '排序',
        width: 480,
        visible: visible,
        onClose: onClose,
        maskClosable: true
      }}
      renderFooter={() => {
          return (
              <React.Fragment>
                  <Button onClick={ok} type='primary'>
                      保存
                  </Button>
                  <Button onClick={onClose}>取消</Button>
              </React.Fragment>
          )
      }}
    >
      <div style={{ color: '#9EA3A8', marginBottom: 16 }}>长按可拖拽列表顺序</div>
        {
          visible && (
            <DragSortingTable
              rowkey='id'
              columns={columns}
              dataSource={tableData}
              getSortData={getSortData}
              canMove={true}
              from='dataTable'
            />
          )
        }
    </DrawerLayout>
  )
}
