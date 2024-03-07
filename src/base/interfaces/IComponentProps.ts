import { CSSProperties, MouseEventHandler } from 'react';

export default interface IComponentProps extends React.DOMAttributes<any> {
  className?: string;
  style?: CSSProperties;
  data?: any;
  onClick?: MouseEventHandler;
}
