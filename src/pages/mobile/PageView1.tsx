import PageView2 from '@/pages/mobile/PageView2';
import PageManager, { IPageViewProps, PageItem, PageView } from 'h5-webview';
import React from 'react';

interface IPageView1State {}
interface IPageView1Props extends IPageViewProps {
  index: any;
}

/**
 * PageView1
 */
class PageView1 extends PageView<IPageView1Props, IPageView1State> {
  static defaultProps = {
    title: 'PageView1Title'
  };

  get disabledBack() {
    const index = this.props.index;
    return index % 3 !== 0;
  }

  get disableTouchBack() {
    const index = this.props.index;
    return index % 3 === 0;
  }

  get showHeader() {
    const index = this.props.index;
    return index % 3 === 0;
  }

  get extra() {
    const index = this.props.index;
    if (index % 3 === 0) {
      return <div>+</div>;
    }
    return null;
  }

  get title() {
    return this.props.index;
  }

  renderChildren() {
    const index = this.props.index;
    return (
      <div>
        窗口序号：{index}
        <br />
        <a
          onClick={() => {
            PageManager.openPage(
              new PageItem(index % 2 === 0 ? PageView1 : PageView2, {
                index: index + 1
              })
            );
          }}
        >
          打开下一个窗口
        </a>
      </div>
    );
  }
}

export default PageView1;
