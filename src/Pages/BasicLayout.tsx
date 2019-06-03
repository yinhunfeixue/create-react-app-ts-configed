import React, { Component } from 'react';
import { Button } from 'antd';

class BasicLayout extends Component {
  render() {
    return (
      <div>
        <Button>BasicLayout</Button>
        {
          this.props.children
        }
      </div>
    );
  }
}

export default BasicLayout;