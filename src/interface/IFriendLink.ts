/**
 * IFriendLink
 */
export default interface IFriendLink {
    name: string
    url?: string
    onClick?: () => Promise<void>
}
