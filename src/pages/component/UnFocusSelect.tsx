import { RightOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import React, { Key, ReactNode, useState } from 'react';
import './UnFocusSelect.less';

interface IToolBarSelectProps {
  value?: Key;
  options?: { label: ReactNode; value: Key }[];
  placeholder?: ReactNode;
}
/**
 * ToolBarSelect
 */
const ToolBarSelect: React.FC<IToolBarSelectProps> = (props) => {
  const { options = [], value: propsValue } = props;

  const [stateValue, setStateValue] = useState<Key>();
  const [stateVisible, setStateVisible] = useState(false);

  const value = propsValue === undefined ? stateValue : propsValue;
  const visible = stateVisible;
  const selectedItem = options.find((item) => item.value === value);

  const label = selectedItem ? selectedItem.label : value;

  return (
    <div
      className={classNames(
        'UnFocusSelect',
        visible ? 'UnFocusSelectVisible' : ''
      )}
    >
      {/* 按钮 */}
      <div
        className="UnFocusSelectBtn"
        onClick={() => setStateVisible(!stateVisible)}
      >
        <span>{label}</span>
        <RightOutlined className="UnFocusSelectArrow" />
      </div>
      {/* 下拉框 */}
      <div className="UnFocusSelectDropDown">
        {options.map((item) => {
          return (
            <div
              className="UnFocusSelectDropDownItem"
              key={item.value}
              onClick={() => setStateValue(item.value)}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default ToolBarSelect;
