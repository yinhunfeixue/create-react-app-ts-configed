import IComponentProps from '@/base/interfaces/IComponentProps';
import ScrollBar from '@/pages/component/ScrollBar';
import ScrollBarDirection from '@/pages/component/ScrollBarDirection';
import ScrollBarUtil from '@/pages/component/ScrollBarUtil';
import { Button } from 'antd';
import Axios from 'axios';
import React, { Component } from 'react';

interface IPage1State {
  visibleDrawer: boolean;
  maxValue: number;
  value: number;
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
      maxValue: 300,
      value: 10,
    };
  }
  componentDidMount() {
    Axios.get('baiduApi?wd=create-react-app');

    if (this.divRef.current) {
      ScrollBarUtil.listenScrollChange(this.divRef.current, (data) => {
        console.log('data', data);
      });
    }
  }

  private divRef: React.RefObject<HTMLDivElement> = React.createRef();

  render() {
    const { maxValue, value } = this.state;
    return (
      <div>
        <Button
          onClick={() => this.setState({ maxValue: 200 + Math.random() * 500 })}
        >
          随机最大值{maxValue}
        </Button>
        <Button>增加当前值</Button>
        <ScrollBar
          maxValue={maxValue}
          value={value}
          direction={ScrollBarDirection.H}
          onChange={(value) => this.setState({ value })}
        />

        <Button
          onClick={() => {
            if (this.divRef.current) {
              const { scrollWidth, scrollHeight, offsetWidth, offsetHeight } =
                this.divRef.current;
              console.log(scrollWidth, scrollHeight, offsetWidth, offsetHeight);
            }
          }}
        >
          显示尺寸
        </Button>
        <div ref={this.divRef} style={{ width: 300, border: '1px solid #888' }}>
          <div style={{ width: 500, border: '1px solid red' }} contentEditable>
            content
          </div>
        </div>
      </div>
    );
  }
}

export default Page1;
