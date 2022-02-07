import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import URL from 'url';

const CACHE = new Map();

export default function async(importComponent: any) {
  let key = importComponent.toString();
  if (CACHE.has(key)) {
    return CACHE.get(key);
  }
  /**
   * 类方法
   */
  const AsyncComponent = (props: any) => {
    const [component, setComponent] = useState<any>(null);
    const C = component?.default;

    useEffect(() => {
      importComponent().then((res: any) => {
        setComponent(res);
      });
    }, []);

    const location = useLocation();

    const query =
      location && location.search
        ? URL.parse(location.search, true).query
        : undefined;

    return C ? (
      <C {...props} location={location} query={query}>
        <Outlet />
      </C>
    ) : null;
  };

  CACHE.set(key, AsyncComponent);
  return AsyncComponent;
}
