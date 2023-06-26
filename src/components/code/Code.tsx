import React, { Component } from 'react'
import IComponentProps from '@/base/interfaces/IComponentProps'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs'

interface ICodeState {}
interface ICodeProps extends IComponentProps {
    code: string

    /**
     * 代码语言，默认sql
     * @see https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/HEAD/AVAILABLE_LANGUAGES_HLJS.MD
     */
    language?: string
}

/**
 * 代码组件
 *
 * 用于显示高亮显示代码
 */
class Code extends Component<ICodeProps, ICodeState> {
    render() {
        const { code, language = 'sql' } = this.props
        return (
            <SyntaxHighlighter language={language} style={docco} wrapLines wrapLongLines>
                {code}
            </SyntaxHighlighter>
        )
    }
}

export default Code
