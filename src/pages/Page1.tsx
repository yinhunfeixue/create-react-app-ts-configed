import IComponentProps from '@/base/interfaces/IComponentProps';
import { Table } from 'antd';
import { ColumnsType, ColumnType } from 'antd/lib/table/interface';
import Axios from 'axios';
import React, { Component } from 'react';
import { Resizable } from 'react-resizable';

interface IPage1State {
  columns: ColumnsType<any>;
}
interface IPage1Props extends IComponentProps {}

/**
 * Page1
 */
class Page1 extends Component<IPage1Props, IPage1State> {
  componentDidMount() {
    Axios.get('baiduApi?wd=create-react-app');
  }

  constructor(props: IPage1Props) {
    super(props);
    this.state = {
      columns: [
        {
          title: 'aaa',
          render: (_: any, record: any) => {
            return record.x;
          },
          width: 123,
        },
        {
          title: 'bbb',
          render: (_: any, record: any) => {
            return record.x;
          },
          width: 111,
        },
        {
          title: 'ccc',
          render: (_: any, record: any) => {
            return record.x;
          },
        },
      ],
    };
  }

  handleResize =
    (index: number) => (e: Event, data: { size: { width: number } }) => {
      this.setState(({ columns }) => {
        const nextColumns = [...columns];
        nextColumns[index] = {
          ...nextColumns[index],
          width: data.size.width,
        };
        return { columns: nextColumns };
      });
    };

  render() {
    const { columns } = this.state;
    return (
      <div>
        <Table
          scroll={{
            x: true,
          }}
          components={{
            header: {
              cell: (props: ColumnType<any> & { onResize: () => void }) => {
                const { onResize, width, ...restProps } = props;

                if (!width) {
                  return <th {...(restProps as any)} />;
                }

                return (
                  <Resizable
                    width={Number(width)}
                    height={0}
                    onResize={onResize}
                    draggableOpts={{ enableUserSelectHack: false }}
                  >
                    <th {...(restProps as any)} />
                  </Resizable>
                );
              },
            },
          }}
          columns={columns}
          dataSource={[
            {
              x: 1,
            },
            {
              x: 2,
            },
          ]}
        />
      </div>
    );
  }
}

export default Page1;
