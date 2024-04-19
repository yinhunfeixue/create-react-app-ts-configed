import { IModel } from '@/base/model/Model';

/**
 * ProjectUtil
 */
class ProjectUtil {
  static setModelData: (data: Partial<IModel>) => void;
  static getModelData: () => IModel;
}
export default ProjectUtil;
