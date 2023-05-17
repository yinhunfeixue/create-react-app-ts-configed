import Model from '@/model/Model';
import axios from 'axios';

/**
 * KeyService
 */
class KeyService {
  static async getStatus(key: string): Promise<boolean> {
    const res = await axios.get(`key_status`, { params: { key } });
    return res.data.code === 1000;
  }

  static async activeKey(key: string): Promise<boolean> {
    const res = await axios.get(`activate`, { params: { key } });

    const result = res.data.code === 1000;
    if (result) {
      Model.token = key;
    }
    return result;
  }
}
export default KeyService;
