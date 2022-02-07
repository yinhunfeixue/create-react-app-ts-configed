import UrlUtil from '@/utils/UrlUtil';

/**
 * PageUtil
 */
class PageUtil {
  static openLoginPage(back: string = '') {
    UrlUtil.toUrl('/Login', { back: encodeURI(back) });
  }
}
export default PageUtil;
