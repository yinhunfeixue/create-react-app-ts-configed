import { ReactText } from 'react';

/**
 * IMenu
 */
export default interface IMenu {
  id: ReactText;
  code: string;
  columnClass: string;
  title: string;
  children?: IMenu[];
  type?: string;
  rwType?: string;
}
