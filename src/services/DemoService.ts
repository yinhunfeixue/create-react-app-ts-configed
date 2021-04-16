import IDemo from '@/interfaces/IDemo';

/**
 * 示例
 */
class DemoService {
  static async requestDemo(): Promise<IDemo> {
    return {
      id: '1',
    };
  }
}

export default DemoService;
