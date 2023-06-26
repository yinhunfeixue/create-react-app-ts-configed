/**
 * IMenu
 */
export default interface IMenu {
    tempId: string
    column_class: string
    column_name: string
    column_url: string
    rw_type: number
    type: string
    children?: IMenu[]
}
