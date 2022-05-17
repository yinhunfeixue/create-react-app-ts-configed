import IPageProps from '@/base/interfaces/IPageProps';
import MoveController from '@/pages/MoveController';
import { Button, Input, Table } from 'antd';
import { ColumnType } from 'antd/lib/table';
import React, { Component } from 'react';
import styles from './Page2.less';

interface IPage2Sate {
  columns: ColumnType<any>[];
  dataSource: any[];
}

/**
 * Page2
 */
class Page2 extends Component<IPageProps, IPage2Sate> {
  constructor(props: IPageProps) {
    super(props);
    this.state = {
      columns: [
        {
          title: 'name',
          dataIndex: 'name',
          width: 123,
          render: (_, record) => {
            if (record.edit) {
              return <Input />;
            }
            return (
              <span
                onClick={() => {
                  record.edit = true;
                  this.forceUpdate();
                }}
              >
                {record.name}
              </span>
            );
          },
        },
        {
          title: 'des',
          dataIndex: 'des',
          width: 123,
        },
        {
          title: 'des2',
          dataIndex: 'des',
          width: 123,
        },
        {
          title: 'des3',
          dataIndex: 'des',
          width: 123,
        },
        {
          title: 'des4',
          dataIndex: 'des',
          width: 123,
        },
        {
          title: 'des5',
          dataIndex: 'des',
          width: 123,
        },
        {
          title: '我是固定的',
          fixed: 'right',
        },
      ],
      dataSource: [
        {
          id: 1,
          name: 'aaa',
          des: 'des',
        },
      ],
    };
  }
  render() {
    const { columns, dataSource } = this.state;
    return (
      <div className={styles.Page2}>
        <Button
          onClick={() => {
            dataSource.push({
              id: 2,
              name: 'name2',
              des: 'des2',
            });
            this.setState({
              dataSource: dataSource.concat(),
            });
          }}
        >
          add
        </Button>
        <div className={styles.TableWrap}>
          <Table
            style={{
              width: 'unset',
              maxWidth: 'unset',
            }}
            scroll={{
              x: true,
            }}
            bordered
            components={{
              header: {
                cell: (props: any) => {
                  const { children, ...restProps } = props;
                  return (
                    <th
                      {...restProps}
                      className={styles.DraggerTh}
                      ref={(target) => {
                        if (target && !target.getAttribute('bind')) {
                          target.setAttribute('bind', '1');
                          new MoveController(target, (value) => {
                            target.style.width = `${value.x}px`;
                          });
                        }
                      }}
                    >
                      {children}
                    </th>
                  );
                },
              },
            }}
            rowKey="id"
            columns={columns}
            dataSource={dataSource}
          />
        </div>
      </div>
    );
  }
}

export default Page2;
