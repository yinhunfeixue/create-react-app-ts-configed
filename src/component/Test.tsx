import { Button } from 'antd';
import React from 'react';
import './Test.less';
import styles from './Test.module.less';

interface ITestProps {}
/**
 * Test
 */
const Test: React.FC<ITestProps> = (props) => {
  return (
    <div>
      <div className={styles.ModuleName}>red module name</div>
      <div className="TestName">green name</div>
      <Button>antd 的按钮</Button>
    </div>
  );
};
export default Test;
