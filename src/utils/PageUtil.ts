import UrlUtil from '@/utils/UrlUtil';

/**
 * PageUtil
 */
class PageUtil {
  static openLoginPage(back?: string) {
    if (back === undefined) {
      back = window.location.href;
    }
    UrlUtil.toUrl('/Login', { back: encodeURIComponent(back) });
  }
}
export default PageUtil;
