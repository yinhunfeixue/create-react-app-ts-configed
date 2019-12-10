import IComponentProps from '@/Base/Interfaces/IComponentProps';
import React, { Component } from 'react';

interface IPage1State {}
interface IPage1Props extends IComponentProps {}

/**
 * Page1
 */
class Page1 extends Component<IPage1Props, IPage1State> {
  render() {
    return <div>Page1</div>;
  }
}

export default Page1;
