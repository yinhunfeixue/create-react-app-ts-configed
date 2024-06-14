import classNames from 'classnames';
import { CSSProperties } from 'react';

const img = require('../assets/a.png');
console.log(img);
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
      Page1
    </div>
  );
}
export default Page1;
