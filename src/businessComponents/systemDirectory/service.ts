
import Request from "@/api/request";

interface Tlist extends Record<string, any> {
  hasPath: boolean,
  icon: string,
  id: number,
  name: string,
  outSysId: number,
}
/* 系统分类 */
export interface Tsystem extends Record<string, any> {
  id: number,
  name: string,
  desc: string,
  systemList: Tlist[]
}

export function querySystemList(params?: { keyword?: string }) {
  return Request.get<any, Tsystem[]>('/quantchiAPI/api/dwapp/dataConfirm/listSystems', params);
}
