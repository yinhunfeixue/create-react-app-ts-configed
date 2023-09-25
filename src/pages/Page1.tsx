import IComponentProps from '@/base/interfaces/IComponentProps';
import FormDrawer from '@/component/FormDrawer';
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
    Axios.get('baiduApi?wd=create-react-app').catch((error) => {});
  }

  render() {
    return (
      <div>
        <FormDrawer />
      </div>
    );
  }
}

export default Page1;
