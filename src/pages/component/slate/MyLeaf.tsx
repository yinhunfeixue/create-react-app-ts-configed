import { Empty } from 'antd';
import React, { CSSProperties, ReactNode } from 'react';
interface IMyLeafProps {
  style?: CSSProperties;
  children?: ReactNode;
}
/**
 * MyLeaf
 */
const MyLeaf: React.FC<IMyLeafProps> = (props) => {
  return (
    <div contentEditable={false}>
      <Empty />
    </div>
  );
};
export default MyLeaf;
