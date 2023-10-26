import DraggerContext from '@/pages/DraggerContext';
import DraggerItem from '@/pages/DraggerItem';
import { DragOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
interface IPage2Props {}
/**
 * Page2
 */
const Page2: React.FC<IPage2Props> = (props) => {
  const [list, setList] = useState([
    {
      id: 'a',
    },
    {
      id: 'b',
    },
    {
      id: 'c',
    },
    {
      id: 'd',
    },
    {
      id: 'e',
    },
  ]);
  return (
    <DraggerContext
      dataSource={list}
      onChange={(value) => setList(value)}
      keyField="id"
    >
      {list.map((item, index) => {
        return (
          <DraggerItem
            key={item.id}
            uid={item.id}
            renderItem={(params: {
              nodeProps: any;
              activatorNodeProps: any;
            }) => {
              return (
                <div {...params.nodeProps}>
                  <DragOutlined {...params.activatorNodeProps} />
                  {item.id}
                </div>
              );
            }}
          />
        );
      })}
    </DraggerContext>
  );
};
export default Page2;
