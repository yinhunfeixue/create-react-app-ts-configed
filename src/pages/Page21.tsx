import IPageProps from '@/base/interfaces/IPageProps';
import React, { Component } from 'react';

interface IPage21Sate {}

/**
 * Page21
 */
class Page21 extends Component<IPageProps, IPage21Sate> {
  render() {
    console.log('props', this.props);

    return <div>Page21</div>;
  }
}

export default Page21;
