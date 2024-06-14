import ScrollBar from '@/pages/component/ScrollBar';
import ScrollBarDirection from '@/pages/component/ScrollBarDirection';
import ScrollContainer from '@/pages/component/ScrollContainer';
import classNames from 'classnames';
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

  const [scrollValue, setScrollValue] = useState(0);
  return (
    <div className={classNames(className)} style={style}>
      <ScrollContainer
        onScrollSizeChange={(width, height) => {}}
        style={{ width: 600, border: '1px solid gray', overflow: 'hidden' }}
        scrollLeft={scrollValue}
      >
        <div style={{ width: 2000, height: 200, border: '1px solid red' }}>
          aabbbbbbbbcccddd
        </div>
      </ScrollContainer>
      <ScrollBar
        maxValue={200}
        direction={ScrollBarDirection.H}
        onChange={(value) => setScrollValue(value)}
      />
    </div>
  );
}
export default Page1;
