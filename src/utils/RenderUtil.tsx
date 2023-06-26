import EmptyLabel from '@/component/EmptyLabel'
import { Divider, Radio, Select, Tooltip, Tree } from 'antd'
import FormItem, { FormItemProps } from 'antd/es/form/FormItem'
import { Rule } from 'antd/lib/form'
import React, { ReactNode, ReactText } from 'react'

class RenderUtil {
    static renderRadioList(valueList: any[], labelFunction: (value: any) => ReactNode, onClick?: (value: any) => void) {
        if (!valueList || !valueList.length) {
            return null
        }

        return (
            <div>
                {valueList.map((item) => {
                    return (
                        <Radio
                            onClick={() => {
                                if (onClick) {
                                    onClick(item)
                                }
                            }}
                            value={item}
                            key={item}
                        >
                            {labelFunction(item)}
                        </Radio>
                    )
                })}
            </div>
        )
    }

    static renderSelectOptionList<T>(valueList: T[], labelFunction: (value: T) => any, valueFunction?: (item: T) => any): ReactNode {
        if (!valueList || !valueList.length) {
            return null
        }

        return valueList.map((item) => {
            const value = valueFunction ? valueFunction(item) : item
            const label = labelFunction(item)
            return (
                <Select.Option value={value} key={value} title={label}>
                    {label}
                </Select.Option>
            )
        })
    }

    static renderFormItems(
        data: { label?: ReactNode; content: ReactNode; required?: boolean; extra?: ReactNode; hide?: boolean; name?: string; rules?: Rule[]; valuePropName?: string }[],
        itemProps?: FormItemProps
    ) {
        if (!data) {
            return null
        }

        return data
            .filter((item) => !item.hide)
            .map((item, index) => {
                const props: any = {}
                if (item.required !== undefined) {
                    props.required = item.required
                }
                if (item.valuePropName) {
                    props.valuePropName = item.valuePropName
                }
                return (
                    <FormItem key={index} label={item.label} extra={item.extra} {...props} name={item.name} rules={item.rules} {...itemProps}>
                        {item.content === undefined || item.content === null || item.content === '' ? <EmptyLabel /> : item.content}
                    </FormItem>
                )
            })
    }

    /**
     *
     * @param {{label:string, content:any}[]} list
     * @returns
     */
    static renderSplitList(list: { label: string; content: ReactNode }[], className: string = '', tipRender?: (content: string) => string, hide?: boolean) {
        if (!list || !list.length) {
            return null
        }

        return list
            .filter((item) => !item.hide)
            .map((item, index, array) => {
                const tip = typeof item.content === 'string' ? (tipRender ? tipRender(item.content) : item.content) : ''
                const content = typeof item.content === 'string' ? item.content ? <span dangerouslySetInnerHTML={{ __html: item.content }}></span> : <EmptyLabel /> : item.content
                const element = (
                    <Tooltip title={tip}>
                        <span className={className}>
                            <label>{item.label}</label>
                            {content || <EmptyLabel />}
                        </span>
                    </Tooltip>
                )

                if (index < array.length - 1) {
                    return [element, <Divider type='vertical' />]
                }
                return element
            })
            .flat()
    }

    static removeTypographyTitle() {
        setTimeout(() => {
            const list = document.getElementsByClassName('ant-typography')
            if (list && list.length) {
                for (let i = 0; i < list.length; i++) {
                    const item = list[i]
                    item.removeAttribute('aria-label')
                    const targetElement = item.children[0]
                    if (targetElement && targetElement.getAttribute('title')) {
                        targetElement.removeAttribute('title')
                    }
                }
            }
        }, 500)
    }

    static renderTree(treeData: any[], labelFunction: (item: any) => ReactNode, valueFunction: (item: any) => ReactText, childrenFunction?: (item: any) => any[]) {
        if (!treeData) {
            return
        }
        return treeData.map((item) => {
            const value = valueFunction(item)
            const label = labelFunction(item)
            const children = childrenFunction ? childrenFunction(item) : item.children

            return (
                <Tree.TreeNode key={value as string} value={value} title={label} data={item}>
                    {children ? RenderUtil.renderTree(children, labelFunction, valueFunction, childrenFunction) : undefined}
                </Tree.TreeNode>
            )
        })
    }
}

export default RenderUtil
