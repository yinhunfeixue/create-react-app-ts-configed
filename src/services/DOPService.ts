import IFriendLink from '@/interfaces/IFriendLink';
import axios from 'axios';

/**
 * DOPService
 */
class DOPService {
  static async requestOutSystemList(): Promise<IFriendLink[]> {
    const res = await axios.get(`/quantchiAPI/admin/opt/component/list`);
    return res.data;
  }

  static async requestSyncTypeList(): Promise<any[]> {
    const res = await axios.get(`/quantchiAPI/admin/index/sync/help/json`);
    return res.data.data;
  }

  static async runIndexSync(value: string): Promise<string> {
    const res = await axios.get(`/quantchiAPI/admin/index/sync/${value}`);
    return res.data;
  }

  /**
   * 治理过滤推理
   * @param id
   * @returns
   */
  static async governingFilterReasoning(id: string): Promise<string> {
    const res = await axios.get(
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
    const res = await axios.get(
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
      const res = await axios.get(url);
      return res.data;
    }
    return '';
  }
}
export default DOPService;
