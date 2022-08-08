import IComponentProps from '@/base/interfaces/IComponentProps';
import { Button, Drawer } from 'antd';
import Axios from 'axios';
import { Component } from 'react';

interface IPage1State {
  visibleDrawer: boolean;
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
    };
  }
  componentDidMount() {
    Axios.get('baiduApi?wd=create-react-app');
  }

  render() {
    const { visibleDrawer } = this.state;
    return (
      <div>
        <Button onClick={() => this.setState({ visibleDrawer: true })}>
          打开drawer
        </Button>
        <Drawer
          // key={Math.random()}
          title="drawer"
          visible={visibleDrawer}
          closable
          onClose={() => {
            this.setState({ visibleDrawer: false });
          }}
        >
          aa
        </Drawer>
      </div>
    );
  }
}

export default Page1;
