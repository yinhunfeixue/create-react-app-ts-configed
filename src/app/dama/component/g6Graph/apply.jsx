import G6 from '@antv/g6'
import { Circle, createNodeFromReact, Group, Rect, Text } from '@antv/g6-react-node'
import _ from 'lodash'
import React, { Component } from 'react'
import './index.less'

// 文本溢出
const fittingString = (str = '', maxWidth, fontSize) => {
    const ellipsis = '...'
    const ellipsisLength = G6.Util.getTextSize(ellipsis, fontSize)[0]
    let currentWidth = 0
    let res = str
    const pattern = new RegExp('[\u4E00-\u9FA5]+') // distinguish the Chinese charactors and letters
    str.split('').forEach((letter, i) => {
        if (currentWidth > maxWidth - ellipsisLength) return
        if (pattern.test(letter)) {
            // Chinese charactors
            currentWidth += fontSize
        } else {
            // get the width of single letter according to the fontSize
            currentWidth += G6.Util.getLetterWidth(letter, fontSize)
        }
        if (currentWidth > maxWidth - ellipsisLength) {
            res = `${str.substr(0, i)}${ellipsis}`
        }
    })
    return res
}

// rel 1:父节点 2:当前节点
// 只导出当前根节点 自己唯一子节点
function listToTree(arr, id) {
    const map = {}
    for (const iterator of arr) {
        iterator.collapsed = false
        map[iterator['key']] = _.assign(iterator, {
            id: iterator['key'],
        })
    }
    for (const iterator of arr) {
        const key = iterator['parent']
        if (!(key in map)) continue
        map[key].children = (map[key].children || []).concat(iterator)
    }

    return map[id]
}

const numberMar = (count) => {
    // return [-_.size(count), 0, 0, -_.size(count)]
    let len = 1
    switch (_.size(count)) {
        case 1: {
            len = 2
            break
        }
        case 2: {
            len = 4
            break
        }

        case 3: {
            len = 6
            break
        }
    }

    return [-3, 0, 0, -len]
}

const Card = ({ cfg }) => {
    const isTable = cfg.myType === 'table'
    let configStyle = {
        boxFill: '#fff',
        circle: '#41BFD9',
        nameFill: '#333',
        nameSize: 6,
        boxStroke: 'rgba(102, 102, 102, 0.1)',
    }
    if (cfg.dir === 'left') {
        configStyle = _.assign(configStyle, {
            circle: '#FF9933',
        })
    } else if (cfg.dir === 'mid') {
        configStyle = _.assign(configStyle, {
            // boxFill: '#E6F7FF',
            circle: '#41BFD9',
            nameFill: '#333',
            nameSize: 7,
            // boxStroke: '#1890FF',
        })
    }

    if (cfg.myType === 'close') {
        return (
            <Group draggable>
                <Rect
                    style={{
                        width: 100,
                        lineWidth: 1,
                        height: 'auto',
                        fill: configStyle.boxFill,
                        stroke: configStyle.boxStroke,
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        padding: [8, 0, 4, 0],
                    }}
                    draggable
                >
                    <Text
                        className='tooltipTitle'
                        style={{
                            fill: configStyle.nameFill,
                            fontSize: configStyle.nameSize,
                        }}
                    >
                        {cfg.ename}
                    </Text>
                    <Text
                        style={{
                            fill: '#b3b3b3',
                            fontSize: 6,
                            margin: [4, 0, 0, 0],
                        }}
                    >
                        展开全链可查看
                    </Text>
                </Rect>
            </Group>
        )
    }

    return (
        <Group draggable>
            <Rect
                style={{
                    width: 100,
                    lineWidth: 1,
                    height: 'auto',
                    fill: configStyle.boxFill,
                    stroke: configStyle.boxStroke,
                    // justifyContent: 'center',
                    // alignContent: 'center',
                    // alignItems: 'center',
                }}
                draggable
            >
                <Rect
                    style={{
                        // alignItems: 'center',
                        margin: [5, 0, 0, 8],
                    }}
                >
                    <Text
                        className='tooltipTitle'
                        style={{
                            fill: configStyle.nameFill,
                            fontSize: configStyle.nameSize,
                        }}
                    >
                        {isTable ? fittingString(cfg.ename, 90, 7) : fittingString(cfg.tableEname, 90, 7)}
                    </Text>
                </Rect>
                <Rect
                    style={{
                        alignItems: 'center',
                        position: 'relative',
                        margin: [4, 0, 6, 8],
                        flexDirection: 'row',
                    }}
                >
                    {_.isEmpty(_.get(cfg, 'dataType')) && (
                        <Rect
                            style={{
                                width: 20,
                                height: 8,
                                fill: configStyle.circle,
                                stroke: configStyle.circle,
                                next: 'inline',
                                justifyContent: 'center',
                                alignItems: 'center',
                                lineWidth: 1,
                                margin: [0, 5, 0, 0],
                            }}
                        >
                            <Text
                                style={{
                                    fill: '#fff',
                                    fontSize: 4,
                                }}
                            >
                                {`${_.get(cfg, 'dwLevelTagName', '')}`}
                            </Text>
                        </Rect>
                    )}

                    <Text
                        style={{
                            fill: '#666',
                            fontSize: 6,
                        }}
                    >
                        /{isTable ? _.get(cfg, 'databaseEname', '') : _.get(cfg, 'ename', '')}
                    </Text>
                </Rect>
                {cfg.leftCount == 0 ? null : (
                    <Circle
                        style={{
                            position: 'absolute',
                            x: -6,
                            y: 14,
                            r: 6,
                            stroke: configStyle.circle,
                            fill: cfg.leftCount != 0 ? configStyle.circle : '#fff',
                            alignItems: 'center',
                            lineWidth: 1,
                        }}
                    >
                        <Text
                            style={{
                                fill: cfg.leftCount == 0 ? configStyle.circle : '#fff',
                                fontSize: 8,
                                margin: numberMar(cfg.leftCount),
                            }}
                        >
                            {cfg.leftCount}
                        </Text>
                    </Circle>
                )}
                {cfg.rightCount == 0 ? null : (
                    <Circle
                        style={{
                            position: 'absolute',
                            x: 106,
                            y: 14,
                            r: 6,
                            stroke: configStyle.circle,
                            flexDirection: 'row',
                            fill: cfg.rightCount != 0 ? configStyle.circle : '#fff',
                            lineWidth: 1,
                        }}
                    >
                        <Text
                            style={{
                                fill: cfg.rightCount == 0 ? configStyle.circle : '#fff',
                                fontSize: 8,
                                margin: numberMar(cfg.rightCount),
                                cursor: 'pointer',
                            }}
                        >
                            {cfg.rightCount}
                        </Text>
                    </Circle>
                )}
            </Rect>
        </Group>
    )
}

G6.registerNode('myNode', createNodeFromReact(Card))

function ToolTips() {
    return new G6.Tooltip({
        offsetX: 10,
        offsetY: 10,
        shouldBegin: (e) => {
            console.log(e.target, 'shouldBegin')
            if (e.target.cfg.className == 'tooltipTitle') {
                return true
            }
        },
        // the types of items that allow the tooltip show up
        // 允许出现 tooltip 的 item 类型
        itemTypes: ['node'],
        fixToNode: [0.2, 0.2],
        // custom the tooltip's content
        // 自定义 tooltip 内容
        getContent: (e) => {
            const item = e.item.getModel()
            let html = ''
            let tableName = []
            _.get(item, 'targetTableInfo', []).forEach((item) => {
                tableName.push(item.tableEname)
            })

            const tableHtml = `<div class="g6_tooltip_box">
            <h4 class="table_title" >${_.get(item, 'ename')}</h4>
            <p><span class="pre">类型:</span>${_.get(item, 'datasourceType', '-')}</p>
            <p><span class="pre">数据库:</span>/${_.get(item, 'databaseEname', '-')}</p>
            <p><span class="pre">数仓层级:</span>${_.get(item, 'dwLevelTagName', '-')}</p>
            <p><span class="pre">表中文名:</span>${_.get(item, 'cname', '-')}</p>
            <p><span class="pre">负责人:</span>${_.get(item, 'techniqueManager', '-')}</p>
            </div>`
            const columnHtml = `<div class="g6_tooltip_box">
            <h4 class="column_title">/${_.get(item, 'ename', '-')}</h4>
            <p><span class="pre">字段类型：</span>${_.get(item, 'dataType', '-')}</p>
            <p><span class="pre">字段中文名：</span>-</p>
            
            <h4 class="title_for">所属表信息</h4>
            <p class="table_name"><span class="pre">表名称:</span><span class="content">${_.get(item, 'tableEname', '-')}</span></p>
            <p><span class="pre">类型:</span>${_.get(item, 'datasourceType', '-')}</p>
            <p><span class="pre">数据库:</span>/${_.get(item, 'databaseEname', '-')}</p>
            <p><span class="pre">数仓层级:</span>${_.get(item, 'dwLevelTagName', '-')}</p>
            <p><span class="pre">表中文名:</span>${_.get(item, 'cname', '-')}</p>
            <p><span class="pre">负责人:</span>${_.get(item, 'techniqueManager', '-')}</p>
            </div>`
            if (item.myType === 'table') {
                html = tableHtml
            } else if (item.myType === 'column') {
                html = columnHtml
            }

            if (html) {
                const outDiv = document.createElement('div')
                outDiv.innerHTML = html
                return outDiv
            }
        },
    })
}

const filterData = (list, type) => {
    const result = []
    list.forEach((item) => {
        result.push({
            id: item.key,
            ename: item.ename,
            key: item.key,
            parent: item.parent,
            // 文本必须为字符串
            rightCount: _.get(item, 'rightCount', 0).toString(),
            leftCount: _.get(item, 'leftCount', 0).toString(),
            dwLevelTagName: item.dwLevelTagName,
            techniqueManager: item.techniqueManager,
            databaseEname: item.databaseEname,
            cname: item.cname,
            datasourceType: item.datasourceType,
            dataType: item.dataType,
            tableEname: item.tableEname,
            dir: _.get(item, 'dir', 'mid'),
            myType: type,
            targetTableInfo: item.targetTableInfo,
            // anchorPoints:  [[0, 0.5], [1, 0.5]],
            anchorPoints: [
                [0, 0.5],
                [1, 0.5],
            ],
        })
    })
    return result
}

const filterCloseData = (list, type, id) => {
    let result = []
    const parentId = `${id}_666`
    const typeText = type === 'table' ? '张表' : '个字段'
    list.forEach((item) => {
        if (id === item.key || _.get(item, 'leftCount', 0) === 0) {
            result.push({
                id: item.key,
                ename: item.ename,
                key: item.key,
                parent: id === item.key ? item.parent : parentId,
                // 文本必须为字符串
                rightCount: _.get(item, 'rightCount', 0).toString(),
                leftCount: _.get(item, 'leftCount', 0).toString(),
                dwLevelTagName: item.dwLevelTagName,
                techniqueManager: item.techniqueManager,
                databaseEname: item.databaseEname,
                cname: item.cname,
                datasourceType: item.datasourceType,
                dataType: item.dataType,
                tableEname: item.tableEname,
                dir: _.get(item, 'dir', 'mid') === 'mid' ? 'right' : _.get(item, 'dir', 'mid'),
                myType: type,
                targetTableInfo: item.targetTableInfo,
                anchorPoints: [
                    [0, 0.5],
                    [1, 0.5],
                ],
            })
        }
    })

    if (_.size(result) > 1) {
        const closeLen = _.size(list) - _.size(result)
        if (!closeLen) {
            result = []
            list.forEach((item) => {
                result.push({
                    id: item.key,
                    ename: item.ename,
                    key: item.key,
                    parent: item.parent,
                    // 文本必须为字符串
                    rightCount: _.get(item, 'rightCount', 0).toString(),
                    leftCount: _.get(item, 'leftCount', 0).toString(),
                    dwLevelTagName: item.dwLevelTagName,
                    techniqueManager: item.techniqueManager,
                    databaseEname: item.databaseEname,
                    cname: item.cname,
                    datasourceType: item.datasourceType,
                    dataType: item.dataType,
                    tableEname: item.tableEname,
                    dir: _.get(item, 'dir', 'mid'),
                    myType: type,
                    targetTableInfo: item.targetTableInfo,
                    // anchorPoints:  [[0, 0.5], [1, 0.5]],
                    anchorPoints: [
                        [0, 0.5],
                        [1, 0.5],
                    ],
                })
            })
        } else {
            result.push({
                id: parentId,
                ename: `中间过程包含${closeLen}${typeText}`,
                key: parentId,
                parent: id,
                myType: 'close',
                rightCount: '',
                leftCount: '',
                dwLevelTagName: '',
                techniqueManager: '',
                databaseEname: '',
                cname: '',
                datasourceType: '',
                dataType: '',
                tableEname: '',
                dir: 'mid',
                targetTableInfo: [],
                anchorPoints: [
                    [0, 0.5],
                    [1, 0.5],
                ],
            })
        }
    }
    return result
}

export default class App extends Component {
    constructor(props) {
        super(props)

        this.state = {}

        this.graph = null
        this.ref = React.createRef()

        this.propsData = []
        this.status = false // true 打开 false 关闭
    }

    showOpen = () => {
        this.status = true
        this.renderData(this.props.data, this.props.id, this.props.type, this.props.width, this.props.height)
    }

    showClose = () => {
        this.status = false
        this.renderData(this.props.data, this.props.id, this.props.type, this.props.width, this.props.height)
    }

    renderG6 = () => {
        this.renderData(this.props.data, this.props.id, this.props.type, this.props.width, this.props.height)
    }

    renderData = (beforeData, id, type, width, height) => {
        this.propsData = _.clone(beforeData)
        // let list = [...beforeData]
        // let result = []
        // list.forEach(item => {
        //     if (id === item.key || _.get(item, 'leftCount', 0) === 0) {
        //         result.push({
        //             id: item.key,
        //             ename: item.ename,
        //             key: item.key
        //         })
        //     }
        // })
        // const closeLen = _.size(list) - _.size(result)
        // console.log(closeLen,'closeLen+++')
        // let filterList = []
        // if (closeLen.length > 0) {
        const filterList = this.status ? filterData([...beforeData], type) : filterCloseData([...beforeData], type, id)
        // } else {
        //     filterList = filterData([...beforeData], type)
        // }
        const data = _.clone(listToTree(filterList, id))
        if (_.isEmpty(data)) {
            return
        }

        console.log('data', data)

        if (!this.graph) {
            const tooltip = ToolTips()
            const toolbar = new G6.ToolBar()
            this.graph = new G6.TreeGraph({
                container: this.ref.current,
                width: width || 1080,
                height: height || 800,
                plugins: [tooltip],
                enabledStack: 5,
                enabledStack: true,
                modes: {
                    default: [
                        {
                            type: 'collapse-expand',
                            onChange: function onChange(item, collapsed) {
                                item.getModel().collapsed = collapsed
                                return true
                            },
                        },
                        'drag-canvas',
                        'zoom-canvas',
                    ],
                },
                defaultNode: {
                    // size: 26,
                    // anchorPoints: [
                    //     [0, 0.5],
                    //     [1, 0.5],
                    // ],
                    // size: [120, 40],
                    type: 'myNode',
                    // style: {
                    //     fill: '#C6E5FF',
                    //     stroke: '#5B8FF9',
                    // },
                },
                defaultEdge: {
                    // type: 'polyline',
                    // style: {
                    //     stroke: '#91D4FA',
                    // },
                },
                layout: {
                    type: 'mindmap',
                    direction: 'H',
                    getId: function getId(d) {
                        return d.id
                    },
                    getHeight: function getHeight() {
                        return 16
                    },
                    getWidth: function getWidth() {
                        return 16
                    },
                    getVGap: function getVGap() {
                        return 10
                    },

                    // 一定要设置的长一点 不然设置的anchorPoints 的锚点会从各种地方冒出来 真坑
                    getHGap: function getHGap(d) {
                        return 80
                    },
                    getSide: (d) => {
                        return 'left'
                    },
                },
                fitView: true,
            })

            this.graph.edge((edge) => {
                const targetId = _.get(edge, 'target')

                // const item = _.find(this.propsData, inItem => inItem.key === targetId)
                const item = this.graph.findById(targetId).getModel()

                return {
                    id: edge.id,
                    type: 'cubic-horizontal',
                    sourceAnchor: 0,
                    targetAnchor: 1,
                    style: {
                        stroke: _.get(item, 'dir') === 'mid' ? '#91D4FA' : '#F6BA95',
                    },
                }
            })

            this.graph.data(data)
            this.graph.render()
            this.graph.fitView()
        } else {
            this.graph.destroyLayout()
            this.graph.changeData(data)
            this.graph.fitView()
        }
    }

    refresh = () => {
        this.graph.zoomTo(1)
        this.graph.fitView()
    }

    large = () => {
        const currentZoom = this.graph.getZoom()
        const ratioOut = 1 + 0.05 * 5
        if (ratioOut * currentZoom > 5) {
            return
        }
        this.graph.zoomTo(currentZoom * 1.1)
    }

    small = () => {
        const currentZoom = this.graph.getZoom()
        const ratioIn = 1 - 0.05 * 5
        if (ratioIn * currentZoom < 0.3) {
            return
        }
        this.graph.zoomTo(currentZoom * 0.9)
    }

    componentWillMount = () => {}

    componentDidMount = () => {
        this.props.onRef(this)
        this.renderG6()
    }

    componentWillReceiveProps = (nextProps, preProps) => {
        if (!_.isEqual(nextProps.data, this.props.data)) {
            this.renderData(nextProps.data, nextProps.id, nextProps.type, nextProps.width, nextProps.height)
        }
    }

    render() {
        return <div ref={this.ref} style={{ marginTop: '40px' }}></div>
    }
}
