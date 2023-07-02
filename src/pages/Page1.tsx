import IComponentProps from '@/base/interfaces/IComponentProps';
import DraftDoc from '@/pages/component/DraftDoc';
import QuillDoc from '@/pages/component/QuillDoc';
import SlateDoc from '@/pages/component/slate/SlateDoc';
import { Card } from 'antd';
import Axios from 'axios';
import React, { Component } from 'react';

interface IPage1State {}
interface IPage1Props extends IComponentProps {}

/**
 * Page1
 */
class Page1 extends Component<IPage1Props, IPage1State> {
  constructor(props: IPage1Props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    Axios.get('baiduApi?wd=create-react-app').catch((error) => {
    });
  }

  render() {
    return (
      <div>
        <Card title="slat">
          <SlateDoc />
        </Card>
        <Card title="draft">
          <DraftDoc />
        </Card>
        <Card title="quill">
          <QuillDoc />
        </Card>
      </div>
    );
  }
}

export default Page1;
