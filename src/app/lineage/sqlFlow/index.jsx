import EmptyLabel from '@/component/EmptyLabel'
import TableLayout from '@/component/layout/TableLayout'
import { message } from 'antd'
import { getExtractjobLineageInfo } from 'app_api/metadataApi'
import DataLoading from 'app_component_main/loading'
import RelationChart from 'app_component_main/lzChart/relation'
import 'codemirror/addon/edit/closebrackets'
import 'codemirror/addon/fold/brace-fold.js'
import 'codemirror/addon/fold/comment-fold.js'
import 'codemirror/addon/fold/foldcode.js'
// // 折叠代码
import 'codemirror/addon/fold/foldgutter.css'
import 'codemirror/addon/fold/foldgutter.js'
// // ctrl+空格代码提示补全
// import 'codemirror/addon/hint/show-hint.css'
// import 'codemirror/addon/hint/show-hint'
// import 'codemirror/addon/hint/anyword-hint.js'
// // 代码高亮
import 'codemirror/addon/selection/active-line'
import 'codemirror/lib/codemirror.css'
import 'codemirror/lib/codemirror.js'
// 代码模式，clike是包含java,c++等模式的
// import 'codemirror/mode/clike/clike'
import 'codemirror/mode/sql/sql'
// 主题风格
import 'codemirror/theme/solarized.css'
import React, { Component } from 'react'
import { UnControlled as CodeMirror } from 'react-codemirror2'
import _ from 'underscore'
import './index.less'

// import 'codemirror/addon/edit/matchBrackets'

export default class SqlFlow extends Component {
    constructor(props) {
        super(props)
        this.instance = null
        this.state = {
            sqlObjsText: '',
            loading: false,
            latestUpdateTime: '',
        }

        this.typeConfig = {
            select: {
                color: '#F26D6D',
                visible: false,
            },
            2: {
                color: '#636399',
                visible: false,
            },
            physical: {
                color: '#8CBF73',
                visible: true,
            },
        }

        this.markTextObj = []
        this.markTextObjSave = []
    }

    componentDidMount = () => {
        this.init()
    }

    init = () => {
        //console.log(this.props.location.state)
        this.setState(
            {
                loading: true,
            },
            () => {
                this.getFlowData({
                    fileId: this.props.location ? this.props.location.state.id : this.props.fileId,
                })
            }
        )
    }

    getFlowData = async (param) => {
        let res = await getExtractjobLineageInfo(param)
        this.setState(
            {
                loading: false,
            },
            () => {
                if (res.code == 200) {
                    this.chart.bindNodeData({
                        nodeDataArray: res.data.nodes,
                        linkDataArray: res.data.edges,
                    })

                    // let sqlObjs = ''

                    // _.map(res.data.sqlObjs, (n, k) => {
                    //     sqlObjs += '\n' + n.sql
                    // })
                    this.setState(
                        {
                            sqlObjsText: res.data.text,
                            latestUpdateTime: res.data.latestUpdateTime,
                        },
                        () => {
                            this.instance.setSize('100%', '100%')
                        }
                    )
                }
            }
        )
    }

    markText = (data) => {
        const { centerNode, markNodes, operate } = data
        console.log(data, '----------data--------')

        if (operate == 'saveCenter') {
            if (this.markTextObjSave.length > 0) {
                _.map(this.markTextObjSave, (markObj, kv) => {
                    markObj.clear()
                })
                this.markTextObjSave = []
            }
        } else {
            if (this.markTextObj.length > 0) {
                // this.markTextObj.clear()
                _.map(this.markTextObj, (markObj, kv) => {
                    markObj.clear()
                })
                this.markTextObj = []
            }
        }

        // 高亮非中心字符
        _.map(markNodes, (node, k) => {
            let coordinates = node.data.coordinates || []
            if (centerNode.key !== node.data.key) {
                _.map(coordinates, (coordinate, ck) => {
                    let cKey = k + '_' + ck
                    if (coordinate.fromLine >= 0 && coordinate.fromLineIndex >= 0 && coordinate.toLine >= 0 && coordinate.toLineIndex >= 0) {
                        let from = { line: coordinate.fromLine, ch: coordinate.fromLineIndex }
                        let to = { line: coordinate.toLine, ch: coordinate.toLineIndex }
                        console.log(from, to, operate, '---------------------------')
                        let markObj = this.instance.markText(from, to, { className: 'highLight' })
                        if (operate == 'saveCenter') {
                            this.markTextObjSave.push(markObj)
                        } else {
                            this.markTextObj.push(markObj)
                        }
                    }
                })
            }
        })

        // 主节点高亮，主节点即 操作的当前节点，主节点的高亮得在非中心之后处理，因为有可能会高亮同一段字符导致样式重置
        if (centerNode.coordinates && centerNode.coordinates.length > 0) {
            let centerNodeCoordinates = centerNode.coordinates
            let moveNodeMarked = false
            _.map(centerNodeCoordinates, (coordinate, ck) => {
                if (coordinate.fromLine >= 0 && coordinate.fromLineIndex >= 0 && coordinate.toLine >= 0 && coordinate.toLineIndex >= 0) {
                    let from = { line: coordinate.fromLine, ch: coordinate.fromLineIndex }
                    let to = { line: coordinate.toLine, ch: coordinate.toLineIndex }
                    // console.log(from, to, operate, '---------------------------')
                    let markObj = null

                    if (!moveNodeMarked) {
                        markObj = this.instance.markText(from, to, { className: 'mouseover' })
                        this.instance.scrollIntoView({ line: coordinate.fromLine, ch: coordinate.fromLineIndex })
                        moveNodeMarked = true
                    } else {
                        markObj = this.instance.markText(from, to, { className: 'mouseover' })
                    }

                    if (operate == 'saveCenter') {
                        this.markTextObjSave.push(markObj)
                    } else {
                        this.markTextObj.push(markObj)
                    }
                }
            })
        }
    }

    clearMarkText = () => {
        if (this.markTextObj.length > 0) {
            // this.markTextObj.clear()
            _.map(this.markTextObj, (markObj, kv) => {
                markObj.clear()
            })
            this.markTextObj = []
        }
    }

    render() {
        const { sqlObjsText, loading, latestUpdateTime } = this.state
        let that = this
        return (
            <TableLayout
                title='血缘可视化'
                disabledDefaultFooter
                renderTable={() => {
                    return (
                        <div className='SQLGraph'>
                            <div style={{ textAlign: 'left', marginBottom: 15 }}>仅展示最新版本 更新时间：{latestUpdateTime || <EmptyLabel />}</div>
                            {loading ? (
                                <DataLoading />
                            ) : (
                                <div className='SQLFlow' style={{ border: '1px solid #d3d3d3' }}>
                                    <div className='SQLFlowEditorCodeMirror'>
                                        <CodeMirror
                                            editorDidMount={(editor) => {
                                                this.instance = editor
                                            }}
                                            value={sqlObjsText}
                                            options={{
                                                mode: { name: 'text/x-sql' },
                                                readOnly: true,
                                                autofocus: false, // 自动获取焦点
                                                styleActiveLine: false, // 当前行背景高亮
                                                lineNumbers: true, // 显示行号
                                                lineWrapping: true, // 自动换行
                                                foldGutter: true,
                                                gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'], // end
                                                matchBrackets: true, // 括号匹配，光标旁边的括号都高亮显示
                                                autoCloseBrackets: true, // 键入时将自动关闭()[]{}''""
                                            }}
                                        />
                                    </div>
                                    <div className='SQLFlowTab'>
                                        <RelationChart
                                            ref={(dom) => {
                                                this.chart = dom
                                            }}
                                            clearMarkText={this.clearMarkText}
                                            markText={this.markText}
                                            typeConfig={this.typeConfig}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                }}
            ></TableLayout>
        )
    }
}
