import IComponentProps from '@/base/interfaces/IComponentProps';
import PageView1 from '@/pages/mobile/PageView1';
import PageManager, { PageItem } from 'h5-webview';
import React, { Component } from 'react';

interface IPage1State {}
interface IPage1Props extends IComponentProps {}

/**
 * Page1
 */
class Page1 extends Component<IPage1Props, IPage1State> {
  render() {
    return (
      <div>
        Page1
        <button
          onClick={() => {
            PageManager.openPage(new PageItem(PageView1, { index: 1 }));
          }}
        >
          打开新手机页面
        </button>
      </div>
    );
  }
}

export default Page1;
