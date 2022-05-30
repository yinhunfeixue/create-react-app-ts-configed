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
    const res = await axios.get(`/quantchiAPI/admin/index/sync/help`);
    return res.data;
  }

  static async governingFilterReasoning(id: string): Promise<string> {
    const res = await axios.get(
      `/quantchiAPI/api/governance/filter/admin/runFilter/${id}`
    );
    return res.data.msg;
  }
}
export default DOPService;
