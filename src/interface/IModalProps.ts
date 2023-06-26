/**
 * IModalProps
 */
export default interface IModalProps {
    open: boolean
    onCancel: () => void
    onSuccess?: () => void
}
