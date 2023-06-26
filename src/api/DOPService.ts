import IFriendLink from '@/interface/IFriendLink';
import { httpObj } from './base';

/**
 * DOPService
 */
class DOPService {
  static async requestOutSystemList(): Promise<IFriendLink[]> {
    const res = await httpObj.httpGet(`/quantchiAPI/admin/opt/component/list`);
    return res.data;
  }

  static async requestSyncTypeList(): Promise<any[]> {
    const res = await httpObj.httpGet(`/quantchiAPI/admin/index/sync/help/json`);
    return res.data.data;
  }

  static async runIndexSync(value: string): Promise<string> {
    const res = await httpObj.httpGet(`/quantchiAPI/admin/index/sync/${value}`);
    return res.data;
  }

  /**
   * 治理过滤推理
   * @param id
   * @returns
   */
  static async governingFilterReasoning(id: string): Promise<string> {
    const res = await httpObj.httpGet(
      `/quantchiAPI/api/governance/filter/admin/runFilter/${id}`
    );
    return res.data.msg;
  }

  /**
   * 字段类型推理
   * @param id
   * @returns
   */
  static async fieldTypeReasoning(columnIds: string): Promise<string> {
    const res = await httpObj.httpGet(
      `/quantchiAPI/admin/opt/inference/columnType/${columnIds}`
    );
    return res.data;
  }

  /**
   * 字段类型推理
   * @param id
   * @returns
   */
  static async synonymInferenceReasoning(type: 1 | 2 | 3): Promise<string> {
    let url = '';
    switch (type) {
      case 1:
        // 全量同义簇推理
        url = `/quantchiAPI/api/dwapp/admin/inference/synonymousCluster`;
        break;
      case 2:
        // 仅推理同义簇名称'
        url = `/quantchiAPI/api/dwapp/admin/inference/synonymousCluster/name`;
        break;
      case 3:
        // 仅推理同义簇标准
        url = `/quantchiAPI/api/dwapp/admin/inference/synonymousCluster/standard`;
        break;

      default:
        break;
    }

    if (url) {
      const res = await httpObj.httpGet(url);
      return res.data;
    }
    return '';
  }

  /* 
   * 指标统计 
   */
  static async indicatorStatistics(): Promise<Record<string, any>> {
    const res = await httpObj.httpGet('/service-qa/dataIndexStatic/exec');
    return res.data;
  }

  /* 
   * 分类分级推理
   */
  static async classification(): Promise<Record<string, any>> {
    const res = await httpObj.httpGet('/quantchiAPI/api/datasecurity/audit/algExe');
    return res.data;
  }

  static async getClassificationConfig(params: { code: 'autoLearning'|'regexMatch' }): Promise<Record<string, any>> {
    const res = await httpObj.httpGet('/quantchiAPI/api/baseconfig/getConfigByGroupAndCode', { group: 'dataSecurityAlgConfig', ...params });
    return res.data;
  }

  static async setClassificationConfig(params: Record<string, any>): Promise<Record<string, any>> {
    const res = await httpObj.httpPost('/quantchiAPI/api/baseconfig/editConfigByGroupAndCode', params);
    return res.data;
  }

  /* 
   * ER图刷新
   */
  static async er(): Promise<Record<string, any>> {
    const res = await httpObj.httpGet('/quantchiAPI/er/graph/refreshERGraph');
    return res.data;
  }

  /* 
   * 血缘图刷新
   */
  static async blood(): Promise<Record<string, any>> {
    const res = await httpObj.httpGet('/quantchiAPI/api/lineage/graph/admin/refresh');
    return res.data;
  }

  /* 
   * 数据字典初始化任务
   */
  static async initTask(): Promise<Record<string, any>> {
    const res = await httpObj.httpGet('/quantchiAPI/api/dic/admin/doJob');
    return res.data;
  }

}
export default DOPService;
