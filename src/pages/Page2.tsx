import IPageProps from '@/base/interfaces/IPageProps';
import DraggerTable from '@/pages/DraggerTable';
import { Button, Input } from 'antd';
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
          render: (_: any, record: any) => {
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
        },
        {
          title: 'des2',
          dataIndex: 'des',
        },
        {
          title: 'des3',
          dataIndex: 'des',
          width: 800,
        },
        {
          title: 'des4',
          dataIndex: 'des',
          width: 400,
        },
        {
          title: 'des5',
          dataIndex: 'des',
          width: 300,
        },
        {
          title: '我是固定的',
          width: 200,
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
        <DraggerTable
          enableDrag
          bordered
          rowKey="id"
          columns={columns}
          dataSource={dataSource}
        />
      </div>
    );
  }
}

export default Page2;
