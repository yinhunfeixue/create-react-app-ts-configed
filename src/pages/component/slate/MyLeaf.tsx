import { Empty } from 'antd';
import React, { CSSProperties, ReactNode } from 'react';
interface IMyLeafProps {
  style?: CSSProperties;
  children?: ReactNode;
  id?: string;
}
/**
 * MyLeaf
 */
const MyLeaf: React.FC<IMyLeafProps> = (props) => {
  return (
    <div contentEditable={false} id={props.id}>
      <div
        style={{
          background: ' linear-gradient(red, green)',
          padding: 40,
          borderRadius: 20,
        }}
      >
        我是自定义元素
        <Empty />
      </div>
    </div>
  );
};
export default MyLeaf;
