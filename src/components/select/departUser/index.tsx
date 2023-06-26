import React, { useState } from 'react';
import { Space } from 'antd';
import DepartSelect from "../departSelect";
import UserSelect from '../userSelect';
import DepartTreeSelect from '../departTreeSelect';


export default function DepartUser(props: React.PropsWithChildren<{
  placeholder?: string[],
  width?: number[],
  onChange?: (value: string[]) => void,
  value?: any
}>) {

  const { placeholder = [], width = [], onChange } = props;
  const [values, setValues] = useState<string[]>([...(props.value || [])]);
  const [loadCount, setLoadCount] = useState(0);

  const [departId, setDepartId] = useState(undefined);

  const departChange = (value: any) => {
    console.log('departChange', value);
    setDepartId(value);
    values[0] = value;
    // departchange 时，置空user
    values[1] = undefined;
    setValues([...values]);
    onChange && onChange([...values]);
    setLoadCount(c => c++);
  }

  const userChange = (value: any) => {
    console.log('userChange', value);
    values[1] = value;
    values[0] = props.value[0] || values[0];
    setValues([...values]);
    onChange && onChange([...values]);
  }
  console.log('props.value', props.value);
  return (
    <Space>
      {/* <DepartSelect width={width[0] || 290} placeholder={placeholder[0]} onChange={departChange}/> */}
      <DepartTreeSelect value={(props.value || [])[0]} width={width[0] || 290} placeholder={placeholder[0]} onChange={departChange} />
      <UserSelect value={(props.value || [])[1]} width={width[1] || 290} placeholder={placeholder[1]} onChange={userChange} departId={departId || (props.value || [])[0]}  />
    </Space>
  )
}
