import IComponentProps from '@/base/interfaces/IComponentProps';
import UnFocusSelect from '@/pages/component/UnFocusSelect';
import { Button, Input } from 'antd';
import Axios from 'axios';
import React, { Component } from 'react';

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
    return (
      <div>
        <Input placeholder="" />

        <div
          onMouseDown={(event) => {
            event.preventDefault();
          }}
        >
          <UnFocusSelect
            options={[
              { value: 1, label: '11111' },
              { value: 2, label: '222' },
            ]}
          />
          <Button>aaa</Button>
          先点输入框，再点我；焦点不消失 se
        </div>
      </div>
    );
  }
}

export default Page1;
