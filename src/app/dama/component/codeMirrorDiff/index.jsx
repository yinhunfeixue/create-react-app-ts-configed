import React, { Component } from 'react'
import { Col, Row } from 'antd'
import './index.less'

import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.js'
import 'codemirror/lib/codemirror.css'
// 主题风格
import 'codemirror/theme/solarized.css'
import 'codemirror/mode/sql/sql'
// // 代码高亮
import 'codemirror/addon/selection/active-line'
// // 折叠代码
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldcode.js'
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/comment-fold.js'
import 'codemirror/addon/edit/closebrackets'

import 'codemirror/addon/merge/merge.css';
import 'codemirror/addon/merge/merge.js';

export default class CodeMirrorDiff extends Component {
    constructor(props) {
        super(props)
        this.state = {
            codeBefore: this.props.newValue,
            codeAfter: this.props.oldValue
        }
    }
    componentDidMount = () => {
        this.initUI()
    }
    initUI = () => {
        let { codeBefore, codeAfter } = this.state
        var target = this.refs['react-diff-code-view'];//获取dom元素
        console.log(target, 'target')
        target.innerHTML = "";//每次dom元素的内容清空
        CodeMirror.MergeView(target, Object.assign({}, {
            readOnly: true,//只读
            lineNumbers: true, // 显示行号
            theme: 'eclipse', //设置主题
            value: codeAfter,//左边的内容（新内容）
            orig: codeBefore,//右边的内容（旧内容）
            mode: "javascript",//代码模式为js模式，这里还可以是xml，python，java，等等，会根据不同代码模式实现代码高亮
            highlightDifferences: "highlight",//有差异的地方是否高亮
            connect: null,
            revertButtons: false,//revert按钮设置为true可以回滚
            styleActiveLine: true,//光标所在的位置代码高亮
            lineWrap: 'wrap',// 文字过长时，是换行(wrap)还是滚动(scroll),默认是滚动
            smartIndent: true, // 智能缩进
            matchBrackets: true, // 括号匹配
            foldGutter:true,//代码折叠
            // gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
            // 智能提示
            // extraKeys: {
            //     "Alt-/": "autocomplete", "F11": function (cm) {
            //         cm.setOption("fullScreen", !cm.getOption("fullScreen"));
            //     }
            // }
            }))
    }
    render() {
        const { codeBefore, codeAfter } = this.state
        return (
            <div className="react-diff-code-view" style={{height: '100%'}}>
                <div ref="react-diff-code-view" style={{height: '100%'}}></div>
            </div>
        )
    }
}