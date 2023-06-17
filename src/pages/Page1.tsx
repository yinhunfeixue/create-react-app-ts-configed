import IComponentProps from '@/base/interfaces/IComponentProps';
import ScrollBar from '@/pages/component/ScrollBar';
import ScrollBarDirection from '@/pages/component/ScrollBarDirection';
import ScrollContainer from '@/pages/component/ScrollContainer';
import Axios from 'axios';
import { Component } from 'react';

interface IPage1State {
  visibleDrawer: boolean;
  maxWidth: number;
  widthValue: number;
  maxHeight: number;
  heightValue: number;
}
interface IPage1Props extends IComponentProps {}

/**
 * Page1
 */
class Page1 extends Component<IPage1Props, IPage1State> {
  constructor(props: IPage1Props) {
    super(props);
    this.state = {
      visibleDrawer: false,
      maxWidth: 0,
      widthValue: 0,
      maxHeight: 0,
      heightValue: 0,
    };
  }
  componentDidMount() {
    Axios.get('baiduApi?wd=create-react-app');
  }

  render() {
    const { maxWidth, widthValue, maxHeight, heightValue } = this.state;
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ marginRight: 30 }}>
          <h2>下面的滚动条，控制左边元素滚动</h2>
          <h4>水平方向滚动</h4>
          <ScrollBar
            style={{ marginBottom: 10 }}
            maxValue={maxWidth}
            value={widthValue}
            direction={ScrollBarDirection.H}
            onChange={(value) => {
              this.setState({ widthValue: value });
            }}
          />
          <h4>垂直方向滚动</h4>
          <ScrollBar
            style={{ marginBottom: 10 }}
            maxValue={maxHeight}
            value={heightValue}
            direction={ScrollBarDirection.H}
            onChange={(value) => this.setState({ heightValue: value })}
          />
        </div>
        <ScrollContainer
          style={{
            border: '1px solid green',
            width: 300,
            height: 100,
            overflow: 'hidden',
          }}
          scrollLeft={widthValue}
          scrollTop={heightValue}
          onScrollSizeChange={(width, height) => {
            this.setState({ maxWidth: width, maxHeight: height });
          }}
        >
          <div
            style={{
              border: '1px solid red',
              width: 800,
              height: 200,
              background: `linear-gradient(45deg, green, red, transparent)`,
            }}
          >
            aaa
          </div>
          <div style={{ border: '1px solid red' }}>bbb</div>
        </ScrollContainer>
      </div>
    );
  }
}

export default Page1;
