export default interface ITabPage {
  removeTab: (key: string) => void
  addTab: (key: string, params?: any) => void
  reloadTab: (key: string) => void
  param: any
}
