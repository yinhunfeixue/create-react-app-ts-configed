import React, { Component, ReactNode } from "react";
const URL = require('url');

const CACHE = new Map();

export default function async(importComponent: any) {
  let key = importComponent.toString();
  if (CACHE.has(key)) {
    return CACHE.get(key);
  }
  /**
   * 类方法
   */
  class AsyncComponent extends Component<any, any> {
    constructor(props: any) {
      super(props);

      this.state = {
        component: null
      };
    }

    async componentDidMount() {
      const component: ReactNode = (await importComponent()).default;

      this.setState({
        component: component
      });
    }

    render() {
      const C = this.state.component;

      return C ? <C {...this.props} query={URL.parse(this.props.location.search, true).query} /> : null;
    }
  }

  CACHE.set(key, AsyncComponent);
  return AsyncComponent;
}