import { Text } from 'slate'

/**
 * IText
 */
export default interface IText extends Text {
    type?: string
    props?: React.HTMLAttributes<any>
}
