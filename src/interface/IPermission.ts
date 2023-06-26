import IPermissionLevel from '@/enums/PermissionLevel'

export interface IPermission {
    id: string
    selected?: boolean
    title: string
    children?: IPermission[]
    islock?: boolean
    code: string
    rwType?: IPermissionLevel
    authType?: string
    columnClass: string;
}
