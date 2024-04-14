import { Cascader, GetProps } from 'antd';
import { BaseOptionType, DefaultOptionType } from 'rc-cascader';
import { ValueType } from 'rc-cascader/lib/Cascader';
import { useEffect, useState } from 'react';

type IProCascaderProps<
  T extends DefaultOptionType | BaseOptionType = DefaultOptionType
> = GetProps<typeof Cascader<T>> & {
  /**
   *
   * @param level 加载第几层的数据
   * @param option 父选项
   * @returns
   */
  loadData2: (level: number, option?: T) => Promise<T[]>;
};

/**
 * 在 antd Cascader的基础上增加了
 * 1. 只需设置 loadData 即可，无需手动设置第1级 options
 * 2. 当设置了 value 时，自动依次调用 loadData 加载相关子级
 */
function ProCascader<
  T extends DefaultOptionType | BaseOptionType = DefaultOptionType
>(props: IProCascaderProps<T>) {
  const { fieldNames, options, value, loadData2, ...otherProps } = props;

  const [stateOptions, setStateOptions] = useState<T[]>();
  const effectOptions = options || stateOptions;

  useEffect(() => {
    init();
  }, []);

  const getItemKey = (item: T) => {
    return item[fieldNames?.value || 'value'];
  };

  const init = async () => {
    const data = await getInitData();
    setStateOptions(data);
  };

  const getInitData = async () => {
    const result = await loadData2(0);
    if (value) {
      await loadDataForOptions(result, value, 0);
    }
    return result;
  };

  /**
   * 取出value[0]，并据此查出 options中对应的项
   * 如果存在，则加载数据，并将数据添加到该项的 children
   * 并以 children， value.slice(1)做为参数递归
   * @param options
   * @param values
   * @param level options是第几层的数据
   */
  const loadDataForOptions = async (
    options: T[],
    values: ValueType,
    level: number
  ) => {
    if (values.length) {
      const value = values[0];
      const option = options.find((item) => getItemKey(item) === value);
      if (option) {
        const children = await loadData2(level + 1, option);
        if (children) {
          option.children = children;
          await loadDataForOptions(children, values.slice(1), level + 1);
        }
      }
    }
  };

  return (
    <Cascader
      {...otherProps}
      fieldNames={fieldNames}
      value={value}
      options={effectOptions}
      loadData={async (selectOptions) => {
        const parent = selectOptions[selectOptions.length - 1];
        const children = await loadData2(selectOptions.length, parent);
        parent.children = children;
        setStateOptions([...(stateOptions || [])]);
      }}
    />
  );
}
export default ProCascader;
