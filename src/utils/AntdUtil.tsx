import { Form } from 'antd';
import { Rule } from 'antd/lib/form';
import { ReactNode } from 'react';

/**
 * AntdUtil
 */
class AntdUtil {
  static renderFormItems(
    dataSource: {
      name?: string;
      label?: ReactNode;
      content: ReactNode;
      rules?: Rule[];
    }[]
  ) {
    return dataSource.map((item, index) => {
      const { label, content, rules, name } = item;
      return (
        <Form.Item name={name} key={index} label={label} rules={rules}>
          {content}
        </Form.Item>
      );
    });
  }
}
export default AntdUtil;
