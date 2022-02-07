import PageView1 from "@/pages/mobile/PageView1";
import { Button, Modal, Switch } from "antd";
import {
  Page,
  PageItem, PageManager
} from "h5-webview";
import { IPageProps } from "h5-webview/lib/Page";
import React from "react";

interface IPageView2State {
  checked: boolean;
}
interface IPageView2Props extends IPageProps {
  index: any;
}

/**
 * PageView2
 */
class PageView2 extends Page<IPageView2Props, IPageView2State> {
  get title() {
    return this.props.index;
  }

  constructor(props: IPageView2Props) {
    super(props);
    this.state = {
      checked: false,
    };
  }

  renderChildren() {
    const index = this.props.index;
    return (
      <div style={{ padding: "5vw" }}>
        <a
          onClick={() => {
            PageManager.openPage(
              new PageItem(index % 2 === 0 ? PageView1 : PageView2, {
                index: index + 1,
              })
            );
          }}
        >
          打开下一个窗口
        </a>
        <Switch
          onChange={(checked) => this.setState({ checked })}
          checked={this.state.checked}
        />
        <Button
          onClick={() => {
            Modal.success({
              content: this.state.checked ? "true" : "false",
            });
          }}
        >
          显示选中状态
        </Button>
        {(() => {
          const result = [];
          for (let i = 0; i < 1000; i++) {
            result.push(<li key={i}>{i}</li>);
          }
          return result;
        })()}
      </div>
    );
  }
}

export default PageView2;
