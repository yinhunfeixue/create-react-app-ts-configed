import IComponentProps from '@/base/interfaces/IComponentProps';
import { Drawer, Form } from 'antd';
import { FormInstance } from 'antd/lib';
import React, { Component } from 'react';

interface IFormDrawerState {}
interface IFormDrawerProps extends IComponentProps {}

/**
 * FormDrawer
 */
class FormDrawer extends Component<IFormDrawerProps, IFormDrawerState> {
  private formRef = React.createRef<FormInstance>();

  componentDidMount(): void {
    console.log('formref', this.formRef);
  }

  render() {
    return (
      <Drawer open forceRender>
        <Form ref={this.formRef}></Form>
      </Drawer>
    );
  }
}

export default FormDrawer;
