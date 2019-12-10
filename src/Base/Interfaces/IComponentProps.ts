import { MouseEventHandler } from '@/base/interfaces/node_modules/react';

export default interface IComponentProps {
  className?: string;
  style?: { [key: string]: any };
  data?: any;
  onClick?: MouseEventHandler;
}
