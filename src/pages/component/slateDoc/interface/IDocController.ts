import IElement from './IElement';

/**
 * IDocController
 */
export default interface IDocController {
  insertItem<T = any>(element: Partial<IElement<T>>, inline?: boolean): void;
  insertItemList<T = any>(element: IElement<T>[]): void;
  removeItem(match: (n: IElement) => boolean): void;
  updateItem<T = any>(
    match: (n: IElement) => boolean,
    data: Partial<IElement<T>>
  ): void;
  getValue(): IElement[];
}
