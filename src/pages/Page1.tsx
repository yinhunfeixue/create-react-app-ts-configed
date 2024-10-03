import { Input } from 'antd';
import classNames from 'classnames';
import { MySQL } from 'dt-sql-parser';
import { CSSProperties, useState } from 'react';

interface IPage1Props {
  className?: string;
  style?: CSSProperties;
}
/**
 * Page1
 */
function Page1(props: IPage1Props) {
  const { className, style } = props;

  const [inputValue, setInputValue] = useState<string>(
    'select x as x123 from aaa'
  );
  const [sqlError, setSqlError] = useState<any[]>();

  console.log('sqlError', sqlError);

  const updateInputValue = (value: string) => {
    setInputValue(value);
    updateSqlError(value);
  };

  const updateSqlError = (sql: string) => {
    const error: any[] = [];
    if (inputValue) {
      try {
        const parser = new MySQL();
        const ast = parser.parse(inputValue);
        console.log('ast', ast);
      } catch (error) {
        console.log('error', error);
      }
    }
    setSqlError(error);
    return error;
  };
  return (
    <div className={classNames(className)} style={style}>
      <Input.TextArea
        value={inputValue}
        onChange={(event) => {
          updateInputValue(event.target.value);
        }}
      />
    </div>
  );
}
export default Page1;
