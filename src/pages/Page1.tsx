import IComponentProps from '@/base/interfaces/IComponentProps';
import ScrollBar from '@/pages/component/ScrollBar';
import ScrollBarDirection from '@/pages/component/ScrollBarDirection';
import { Button } from 'antd';
import Axios from 'axios';
import { Component } from 'react';

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
  }

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
      </div>
    );
  }
}

export default Page1;
