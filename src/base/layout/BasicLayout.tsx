import { APP_NAME } from '@/base/config/ProjectConfig';
import { MENU_LIST } from '@/base/config/RouteConfig';
import IPageProps from '@/base/interfaces/IPageProps';
import LayoutUtil from '@/utils/LayoutUtil';
import PageUtil from '@/utils/PageUtil';
import { Button, Menu } from 'antd';
import TreeControl from 'fb-project-component/es/utils/TreeControl';
import { pathToRegexp } from 'path-to-regexp';
import { Key, useCallback, useEffect, useState } from 'react';
import styles from './BasicLayout.module.less';

/**
 * BasicLayout
 */
function BasicLayout(props: IPageProps) {
  const { children } = props;
  const [openMenuKeys, setOpenMenuKeys] = useState<Key[]>([]);
  const [selectedMenuKeys, setSelectedMenuKeys] = useState<Key[]>([]);

  const updateSelectedKeys = useCallback(() => {
    const keys = getSelectedKeys();
    setOpenMenuKeys(keys);
    setSelectedMenuKeys(keys);
  }, []);

  useEffect(() => {
    updateSelectedKeys();
  }, [props.location.pathname, updateSelectedKeys]);

  const getSelectedKeys = () => {
    const currentPath = window.location.hash.substring(1);
    const chain = new TreeControl().searchChain(MENU_LIST, (node) => {
      const reg = pathToRegexp(node.path);
      if (reg.test(currentPath)) {
        return true;
      }
      return false;
    });
    return chain ? chain.map((item) => item.path) : [];
  };

  const createMenuItems = () => {
    return LayoutUtil.createMenuItems(MENU_LIST);
  };

  return (
    <div className={styles.BasicLayout}>
      <div className={styles.Left}>
        <div className={styles.Logo}>{APP_NAME}</div>
        <Menu
          theme="dark"
          mode="inline"
          items={createMenuItems()}
          openKeys={openMenuKeys as string[]}
          selectedKeys={selectedMenuKeys as string[]}
          onOpenChange={(keys) => {
            setOpenMenuKeys(keys);
          }}
          onSelect={(option) => {
            setSelectedMenuKeys(option.selectedKeys);
          }}
        />
      </div>
      <div className={styles.Right}>
        <header>
          header
          <Button
            onClick={() => {
              PageUtil.openLoginPage(window.location.href);
            }}
          >
            退出
          </Button>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
export default BasicLayout;
