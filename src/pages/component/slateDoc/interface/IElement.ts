import IText from '@/pages/component/slateDoc/interface/IText';
import { CSSProperties } from 'react';
import { Element } from 'slate';

/**
 * IElement
 */
export default interface IElement<T = any> extends Element {
  id?: string;
  data?: T;
  style?: CSSProperties;
  type: string;
  children: IText[];
}
