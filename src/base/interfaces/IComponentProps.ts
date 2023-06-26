/**
 * 组件接口
 */
export interface IComponentTempleteProps<T> extends React.DOMAttributes<T>, React.HTMLAttributes<T> {
    data?: any
}

/**
 * 默认组件接口，以div为默认元素
 */
export default interface IComponentProps extends IComponentTempleteProps<HTMLElement> {}
