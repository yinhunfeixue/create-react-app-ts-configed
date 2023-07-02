import Tooltip from 'antd/es/tooltip';
import React, { CSSProperties, ReactNode } from 'react';
interface IMyLeafProps {
  style?: CSSProperties;
  children?: ReactNode;
}
/**
 * MyLeaf
 */
const MyLeaf: React.FC<IMyLeafProps> = (props) => {
  const { style, children } = props;
  return (
    <Tooltip title="antd tip">
      <span style={style}>{children}</span>
    </Tooltip>
  );
};
export default MyLeaf;
