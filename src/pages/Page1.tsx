import ProSelect from '@/procomponent/ProSelect';
import classNames from 'classnames';
import { CSSProperties } from 'react';

interface IPage1Props {
  className?: string;
  style?: CSSProperties;
}
/**
 * Page1
 */
function Page1(props: IPage1Props) {
  const { className, style } = props;
  return (
    <div className={classNames(className)} style={style}>
      <ProSelect
        placeholder="单选"
        style={{ width: 300 }}
        options={['aaaa', 'bbbbb', 'ccc'].map((item) => ({
          value: item,
          label: item,
        }))}
      />

      <ProSelect
        placeholder="多选"
        mode="multiple"
        style={{ width: 300 }}
        options={[
          'aaaaaaaa',
          'bbbbbbbb',
          'ccccccc',
          'ddddddddd',
          'eeeeeeeeeeeeee',
        ].map((item) => ({
          value: item,
          label: item,
        }))}
      />
    </div>
  );
}
export default Page1;
