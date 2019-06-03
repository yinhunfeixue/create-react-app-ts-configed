import { ReactElement } from "react";

export default interface IRouteItem {
  name: string;
  path: string;
  component: ReactElement | Function;
  children?: IRouteItem[];
}