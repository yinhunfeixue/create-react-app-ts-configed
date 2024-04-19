import { ModelContext } from '@/base/model/Model';
import ProjectUtil from '@/utils/ProjectUtil';
import { useContext, useEffect } from 'react';

function ModelInit() {
  const { setData, data } = useContext(ModelContext);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setData({
        token,
      });
    }
  }, []);

  useEffect(() => {
    console.log('update data');

    ProjectUtil.setModelData = setData;
    ProjectUtil.getModelData = () => {
      return data;
    };
  }, [data]);
}

export default ModelInit;
