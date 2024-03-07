import IComponentProps from '@/base/interfaces/IComponentProps';
import IconFont from '@/component/IconFont';
import { Component } from 'react';

interface IPage1State {}
interface IPage1Props extends IComponentProps {}

/**
 * Page1
 */
class Page1 extends Component<IPage1Props, IPage1State> {
  render() {
    return (
      <div style={{ whiteSpace: 'pre' }}>
        page1
        <IconFont type="icon-hotfill" />
        <IconFont type="e757" useCss />
      </div>
    );
  }
}

export default Page1;
