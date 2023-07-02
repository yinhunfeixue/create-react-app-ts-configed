import IText from '@/pages/component/slateDoc/interface/IText';
import { Element } from 'slate';

/**
 * IElement
 */
export default interface IElement extends Element {
  type: string;
  children: IText[];
}
