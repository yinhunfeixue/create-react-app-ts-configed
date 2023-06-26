
import { useEffect, useState } from 'react';
import { readTablePath, readBusinessClassify, readDwTheme, readAnalizeTheme } from './service';
/* 
  数据源-库路径
*/
export function useTablePathData(systemId: string, dwLevel: 'none' | 'ods' | 'dw' | 'app') {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    if(!systemId) {
      setData([]);
      return;
    };
    readTablePath(systemId, dwLevel).then(res => {
      const { data = [] } = res;
      setData(data);
    })
  }, [systemId, dwLevel])

  return data;

}

/* 业务分类 */
export function useBusinessClassify(filter?: boolean) {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    readBusinessClassify({ attrFilter: filter }).then(res => {
      const { data = {} } = res;
      setData({...data})
    })
  }, [])

  return data;

}
/* 数仓主题 */
export function useDwTheme(filter?: boolean) {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    readDwTheme({ attrFilter: filter }).then(res => {
      const { data = {} } = res;
      setData({...data})
    })
  }, [])

  return data;

}

/* 分析主题 */
export function useAnalizeTheme(filter?: boolean) {
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    readAnalizeTheme({ attrFilter: false }).then(res => {
      const { data = {} } = res;
      setData({...data})
    })
  }, [])

  return data;

}