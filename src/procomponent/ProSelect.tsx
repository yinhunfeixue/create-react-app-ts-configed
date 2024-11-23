import { Checkbox, GetProps, Select } from 'antd';
import React, { useMemo, useState } from 'react';
import './ProSelect.less';

interface IProSelectProps extends GetProps<typeof Select> {}
/**
 * ProSelect
 */
function ProSelect(props: IProSelectProps) {
  const { options, value, mode, onChange } = props;

  const [stateValue, setStateValue] = useState<any[] | any>();

  const effectValue = value === undefined ? stateValue : value;

  const selectedAll = useMemo(() => {
    if (!effectValue) {
      return false;
    }
    if (!Array.isArray(effectValue)) {
      return false;
    }

    return effectValue.length === options?.length;
  }, [effectValue, options]);

  // 是否部分选中
  const selectedPart = useMemo(() => {
    if (!effectValue) {
      return false;
    }
    if (!Array.isArray(effectValue)) {
      return false;
    }
    return effectValue.length > 0 && effectValue.length !== options?.length;
  }, [effectValue, options]);

  const dropdownRender = (defaultElement: React.ReactElement) => {
    if (mode) {
      return (
        <>
          <div className="ProSelectDropDownItem">
            <Checkbox
              indeterminate={selectedPart}
              className="ProSelectDropDownItemCheckbox"
              checked={selectedAll}
              onChange={(event) => {
                const checked = event.target.checked;
                const newValue = checked
                  ? options?.map((item) => item.value)
                  : undefined;
                const newOptions = checked ? options : undefined;
                setStateValue(newValue);
                onChange?.(value, newOptions || []);
              }}
            >
              全选
            </Checkbox>
          </div>
          {defaultElement}
        </>
      );
    } else {
      return defaultElement;
    }
  };

  return (
    <Select
      popupClassName="ProSelect"
      maxTagCount={2}
      maxTagTextLength={5}
      {...props}
      onChange={(value) => {
        setStateValue(value);
      }}
      value={effectValue}
      dropdownRender={dropdownRender}
    />
  );
}
export default ProSelect;
