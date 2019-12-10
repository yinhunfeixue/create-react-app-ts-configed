import { MouseEventHandler } from 'react';

export default interface IComponentProps {
  className?: string;
  style?: { [key: string]: any };
  data?: any;
  onClick?: MouseEventHandler;
}
