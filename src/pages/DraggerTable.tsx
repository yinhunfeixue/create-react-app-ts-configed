import MoveController from '@/pages/MoveController';
import { Table, TableProps } from 'antd';
import { ColumnType } from 'antd/lib/table';
import React, { Component } from 'react';
import './DraggerTable.less';

interface IDraggerTableState {}
interface IDraggerTableProps<T> extends TableProps<T> {
  enableDrag?: boolean;
}

/**
 * DraggerTable
 */
class DraggerTable<T extends object = any> extends Component<
  IDraggerTableProps<T>,
  IDraggerTableState
> {
  render() {
    const { columns, enableDrag } = this.props;
    const useColumns = columns
      ? columns.map((item) => {
          return {
            ...item,
            onHeaderCell: (data) => {
              const { width } = data as any;
              const useWidth = width || '100px';
              return {
                style: {
                  width: useWidth,
                },
              };
            },
          } as ColumnType<any>;
        })
      : [];
    return (
      <Table
        {...this.props}
        className="DraggerTable"
        columns={useColumns}
        scroll={{
          x: true,
        }}
        components={{
          header: {
            cell: (props: any) => {
              const { children, ...restProps } = props;
              return (
                <th {...restProps} className="DraggerTh">
                  {children}
                  {enableDrag && (
                    <div
                      className="DragElement"
                      ref={(target) => {
                        if (target && !target.getAttribute('bind')) {
                          const th = target.parentElement;
                          if (th) {
                            target.setAttribute('bind', '1');
                            new MoveController(target, th, (value) => {
                              if (th) {
                                target.parentElement.style.width = `${value.x}px`;
                              }
                            });
                          }
                        }
                      }}
                    />
                  )}
                </th>
              );
            },
          },
        }}
      />
    );
  }
}

export default DraggerTable;
