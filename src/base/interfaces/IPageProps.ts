import { match, RouteProps } from '@/base/interfaces/node_modules/react-router';

/**
 * 页面props
 */
export default interface IPageProps {
  match?: match;
  route?: RouteProps;
  [key: string]: any;
}
