export default interface IPageResponse<T> {
  total: number
  dataSource: T[]
}
