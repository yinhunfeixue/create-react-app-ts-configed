import IText from '@/pages/component/slateDoc/interface/IText';
import { Key } from 'react';
import { Element } from 'slate';

/**
 * IElement
 */
// @ts-ignore
export default interface IElement<T = any> extends Element {
  id?: Key;
  type: string;
  children: (IElement | IText)[];
  data?: T;
  props?: React.HTMLAttributes<any>;
  orgType?: string;
}
