import IPageProps from '@/base/interfaces/IPageProps';
import React, { Component, ReactText } from 'react';

interface IBasicLayoutState {
  openMenuKeys: ReactText[];
  selectedMenuKeys: ReactText[];
}

/**
 * 基础布局
 */
class BasicLayout extends Component<IPageProps, IBasicLayoutState> {
  constructor(props: IPageProps) {
    super(props);
    this.state = {
      openMenuKeys: [],
      selectedMenuKeys: [],
    };
  }

  render() {
    const { children } = this.props;
    return <div>{children}</div>;
  }
}
export default BasicLayout;
