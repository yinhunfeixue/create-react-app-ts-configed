import { ParsedUrlQuery } from 'querystring';
import { Location, RouteProps } from 'react-router';

/**
 * 页面props
 */
export default interface IPageProps {
  route?: RouteProps;
  [key: string]: any;
  query?: ParsedUrlQuery;
  location: Location;
}
