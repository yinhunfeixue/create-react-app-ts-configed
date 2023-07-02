import IStyle from '@/pages/component/slateDoc/interface/IStyle';
import IText from '@/pages/component/slateDoc/interface/IText';
import { Element } from 'slate';

/**
 * IElement
 */
export default interface IElement<T = any> extends Element, IStyle {
  id?: string;
  data?: T;
  type: string;
  children: IText[];
}
