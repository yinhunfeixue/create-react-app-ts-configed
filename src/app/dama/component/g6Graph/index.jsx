import G6 from '@antv/g6'
import { Circle, createNodeFromReact, Group, Rect, Text } from '@antv/g6-react-node'
import _ from 'lodash'
import React, { Component } from 'react'
import './index.less'

const MAX_NUM_EACH_SUBTREE = 10

const MAX_NUM_LEN = MAX_NUM_EACH_SUBTREE - 1

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
function listToTree(arr, id, type) {
    let resultTree = null
    const map = {}
    for (const iterator of arr) {
        iterator.collapsed = true
        if (iterator['key'] == id) {
            iterator.collapsed = false
        }

        if (iterator.open) {
            iterator.collapsed = false
        }

        map[iterator['key']] = _.assign(iterator, {
            id: iterator['key'],
        })
    }
    for (const iterator of arr) {
        const key = iterator['parent']
        if (!(key in map)) continue
        map[key].children = (map[key].children || []).concat(iterator)
    }

    // 左右分页
    if (_.get(map[id], 'children.length', 0) > 10) {
        const leftTree = []
        const rightTree = []
        _.get(map[id], 'children', []).forEach((item) => {
            if (item.dir == 'left') {
                leftTree.push({
                    ...item,
                    parent: `left${id}`,
                })
            } else {
                rightTree.push({
                    ...item,
                    parent: `right${id}`,
                })
            }
        })

        resultTree = {
            ...map[id],
            children: [],
        }
        if (leftTree.length > 0) {
            resultTree.children.push({
                id: `left${id}`,
                ename: '',
                key: `left${id}`,
                parent: id,
                children: leftTree,
                // 文本必须为字符串
                rightCount: '1',
                leftCount: leftTree.length.toString(),
                dwLevelTagName: '',
                techniqueManager: '',
                databaseEname: '',
                cname: '',
                datasourceType: '',
                dataType: '',
                tableEname: '',
                dir: 'left',
                myType: 'none',
                targetTableInfo: [],
                anchorPoints: [
                    [0, 0.5],
                    [1, 0.5],
                ],
            })
        }
        console.log(rightTree.length.toString(), 'rightTree.length.toString()')
        if (rightTree.length > 0) {
            resultTree.children.push({
                id: `right${id}`,
                ename: '',
                key: `right${id}`,
                parent: id,
                children: rightTree,
                // 文本必须为字符串
                rightCount: rightTree.length.toString(),
                leftCount: '1',
                dwLevelTagName: '',
                techniqueManager: '',
                databaseEname: '',
                cname: '',
                datasourceType: '',
                dataType: '',
                tableEname: '',
                dir: 'right',
                myType: 'none',
                targetTableInfo: [],
                anchorPoints: [
                    [0, 0.5],
                    [1, 0.5],
                ],
            })
        }
    } else {
        resultTree = _.clone(map[id])
    }

    return resultTree
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
        circle: '#2E8AE6',
        nameFill: '#333',
        nameSize: 7,
        boxStroke: 'rgba(102, 102, 102, 0.1)',
    }
    if (cfg.myType === 'none') {
        return (
            <Rect
                style={{
                    display: 'none',
                }}
            ></Rect>
        )
    }

    if (cfg.dir === 'left') {
        configStyle = _.assign(configStyle, {
            circle: '#FF9933',
        })
    } else if (cfg.dir === 'mid') {
        configStyle = _.assign(configStyle, {
            boxFill: '#E6F7FF',
            circle: '#41BFD9',
            nameFill: '#41BFD9',
            nameSize: 7,
            // boxStroke: '#1890FF',
        })
    }

    if (cfg.realKey) {
        configStyle = _.assign(configStyle, {
            boxFill: '#F5F5F5',
        })
    }

    if (cfg.myType === 'sql') {
        return (
            <Group draggable>
                <Rect
                    style={{
                        width: 100,
                        lineWidth: 1,
                        height: 20,
                        fill: configStyle.boxFill,
                        stroke: configStyle.boxStroke,
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
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
                        {fittingString(cfg.ename, 90, 7)}
                    </Text>
                    <Circle
                        style={{
                            position: 'absolute',
                            x: -6,
                            y: 10,
                            r: 6,
                            stroke: cfg.realKey && cfg.dir === 'left' ? 'rgba(102, 102, 102, 0.1)' : configStyle.circle,
                            fill: cfg.realKey && cfg.dir === 'left' ? '#F5F5F5' : cfg.leftCount != 0 ? configStyle.circle : '#fff',
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
                    <Circle
                        style={{
                            position: 'absolute',
                            x: 106,
                            y: 10,
                            r: 6,
                            stroke: cfg.realKey && cfg.dir === 'right' ? 'rgba(102, 102, 102, 0.1)' : configStyle.circle,
                            flexDirection: 'row',
                            fill: cfg.realKey && cfg.dir === 'right' ? '#F5F5F5' : cfg.rightCount != 0 ? configStyle.circle : '#fff',
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
                        {fittingString(cfg.ename, 90, 7)}
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
                        {isTable ? `/${_.get(cfg, 'databaseEname', '')}` : fittingString(_.get(cfg, 'tableEname', ''), 90, 7)}
                    </Text>
                </Rect>
                {cfg.realKey && cfg.dir === 'left' ? (
                    <Circle
                        style={{
                            position: 'absolute',
                            x: -6,
                            y: 14,
                            r: 6,
                            stroke: 'rgba(102, 102, 102, 0.1)',
                            flexDirection: 'row',
                            fill: '#F5F5F5',
                            lineWidth: 1,
                        }}
                    >
                        <Text
                            style={{
                                fill: '#B7B7B7',
                                fontSize: 8,
                                margin: numberMar(cfg.leftCount),
                                cursor: 'pointer',
                            }}
                        >
                            {cfg.leftCount}
                        </Text>
                    </Circle>
                ) : (
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

                {cfg.realKey && cfg.dir === 'right' ? (
                    <Circle
                        style={{
                            position: 'absolute',
                            x: 106,
                            y: 14,
                            r: 6,
                            stroke: 'rgba(102, 102, 102, 0.1)',
                            flexDirection: 'row',
                            fill: '#F5F5F5',
                            lineWidth: 1,
                        }}
                    >
                        <Text
                            style={{
                                fill: '#B7B7B7',
                                fontSize: 8,
                                margin: numberMar(cfg.rightCount),
                                cursor: 'pointer',
                            }}
                        >
                            {cfg.rightCount}
                        </Text>
                    </Circle>
                ) : (
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

const nodePre = (children) => {
    if (_.isEmpty(children)) {
        return [50, 20]
    }
    return [children[0].x + 50, children[0].y - 20]
}

const nodeNext = (children) => {
    const len = children.length - 1
    return [children[len].x + 50, children[len].y + 40]
}

function ToolTips() {
    return new G6.Tooltip({
        offsetX: 10,
        offsetY: 10,
        shouldBegin: (e) => {
            if (e.target.cfg.className == 'tooltipTitle') {
                return true
            }
        },
        // the types of items that allow the tooltip show up
        // 允许出现 tooltip 的 item 类型
        itemTypes: ['node'],
        className: 'my_tooltip',
        fixToNode: [0.2, 0.2],
        // custom the tooltip's content
        // 自定义 tooltip 内容
        getContent: (e) => {
            const item = e.item.getModel()
            const outDiv = document.createElement('div')
            // outDiv.style.width = "240px";
            let html = ''
            let tableName = []
            _.get(item, 'targetTableInfo', []).forEach((item) => {
                tableName.push(item.tableEname)
            })

            let myRealHtml = ''
            if (item.realKey) {
                myRealHtml = `<div class="real_key">${item.realKeyTitle}</div>`
            }
            if (item.selfCirculation) {
                myRealHtml = `<div class="real_key">${item.selfCirculationTitle}</div>`
            }

            const tableHtml = `<div class="g6_tooltip_box">
            ${myRealHtml}
            <h4 class="table_title" >${_.get(item, 'ename')}</h4>
            <p><span class="pre">类型:</span>${_.get(item, 'datasourceType', '-')}</p>
            <p><span class="pre">数据库:</span>/${_.get(item, 'databaseEname', '-')}</p>
            <p><span class="pre">数仓层级:</span>${_.get(item, 'dwLevelTagName', '-')}</p>
            <p><span class="pre">表中文名:</span>${_.get(item, 'cname', '-')}</p>
            <p><span class="pre">负责人:</span>${_.get(item, 'techniqueManager', '-')}</p>
            </div>`
            const columnHtml = `<div class="g6_tooltip_box">
            ${myRealHtml}
            <h4 class="column_title">/${_.get(item, 'ename', '-')}</h4>
            <p><span class="pre">字段类型：</span>${_.get(item, 'dataType', '-')}</p>
            <p><span class="pre">字段中文名：</span>${_.get(item, 'cname', '-')}</p>
            
            <h4 class="title_for">所属表信息</h4>
            <p><span class="pre">表名称:</span><span class="content">${_.get(item, 'tableEname', '-')}</span></p>
            <p><span class="pre">类型:</span>${_.get(item, 'datasourceType', '-')}</p>
            <p><span class="pre">数据库:</span>/${_.get(item, 'databaseEname', '-')}</p>
            <p><span class="pre">数仓层级:</span>${_.get(item, 'dwLevelTagName', '-')}</p>
            <p><span class="pre">表中文名:</span>${_.get(item, 'tableCname', '-')}</p>
            <p><span class="pre">负责人:</span>${_.get(item, 'techniqueManager', '-')}</p>
            </div>`

            const sqlHtml = `<div class="g6_tooltip_box">
            <p><span class="pre">脚本名称:</span><span class="content">${_.get(item, 'ename', '-')}</span></p>
            <p><span class="pre">类型:</span>${_.get(item, 'datasourceType', '-')}</p>
            <p><span class="pre">负责人:</span>${_.get(item, 'techniqueManager', '-')}</p>
            <p><span class="pre">目标表:</span><span class="content">${tableName.join(' ')}</span></p>
            </div>`

            if (item.myType === 'table') {
                html = tableHtml
            } else if (item.myType === 'column') {
                html = columnHtml
            } else if (item.myType === 'sql') {
                html = sqlHtml
            }

            outDiv.innerHTML = html
            return outDiv
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
            tableCname: item.tableCname,
            realKey: item.realKey,
            selfCirculation: item.selfCirculation,
            selfCirculationTitle: `此节点引用${_.get(item, 'ename', '')}`,
            realKeyTitle: item.realKey ? `${_.get(item, 'dir') === 'right' ? '后面' : '前面'}节点已在表:${_.get(item, 'tableEname', '')} 字段:${_.get(item, 'ename', '')}后展示` : '',
            open: item.open, // 是否展开的状态
            // anchorPoints:  [[0, 0.5], [1, 0.5]],
            anchorPoints:
                _.get(item, 'dir', '') === 'left'
                    ? [
                          [0, 0.5],
                          [1, 0.5],
                      ]
                    : [
                          [1, 0.5],
                          [0, 0.5],
                      ],
        })
    })
    return result
}
export default class App extends Component {
    constructor(props) {
        super(props)

        this.state = {}

        this.graph = null
        this.ref = React.createRef()

        this.propsData = []

        this.stashSubtrees = {}

        // 收拢状态
        this.collapsedMap = {}
    }

    renderG6 = () => {
        this.renderData(this.props.data, this.props.id, this.props.type, this.props.width, this.props.height)
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
        //  this.graph.fitView();
    }

    small = () => {
        const currentZoom = this.graph.getZoom()
        const ratioIn = 1 - 0.05 * 5
        if (ratioIn * currentZoom < 0.3) {
            return
        }
        this.graph.zoomTo(currentZoom * 0.9)
        // this.graph.fitView();
    }

    renderData = (beforeData, id, type, width, height) => {
        this.propsData = _.clone(beforeData)
        const data = _.clone(listToTree(filterData([...beforeData], type), id, type))

        console.log('data', data)
        if (_.isEmpty(data)) {
            return
        }
        // this.stashSubtrees = {}
        // const stashSubtrees = {};
        G6.Util.traverseTreeUp(data, (subtree) => {
            // process the label
            // (subtree.label = subtree.id),
            // (subtree.description = subtree.databaseEname),
            subtree.labelCfg = {
                offset: 10,
                position: subtree.children && subtree.children.length > 0 ? 'left' : 'right',
            }

            // stash the origin children for the subtree to be pruned
            if (subtree.children && subtree.children.length > MAX_NUM_EACH_SUBTREE) {
                subtree.overflow = true
                const stashChildren = []
                subtree.children.forEach((child) => {
                    stashChildren.push(Object.assign({}, child))
                })
                this.stashSubtrees[subtree.id] = {
                    oriChildren: stashChildren,
                    curBeginIdx: 0,
                    curEndIdx: MAX_NUM_EACH_SUBTREE,
                }
            }
        })

        // pruning the tree
        G6.Util.traverseTree(data, (subtree) => {
            if (subtree.overflow) subtree.children = subtree.children.slice(0, MAX_NUM_EACH_SUBTREE)
        })

        if (!this.graph) {
            const tooltip = ToolTips()
            const toolbar = new G6.ToolBar()
            const self = this
            this.graph = new G6.TreeGraph({
                container: this.ref.current,
                width: width || 1080,
                height: height || 800,
                plugins: [tooltip],
                enabledStack: 5,
                enabledStack: false,
                // maxZoom: 1,
                modes: {
                    default: [
                        {
                            type: 'collapse-expand',
                            onChange: function onChange(item, collapsed) {
                                const key = item.getModel().id
                                self.collapsedMap[key] = {
                                    collapsed,
                                }

                                item.getModel().collapsed = collapsed
                                Object.keys(iconMap).forEach((parentId) => {
                                    if (!iconMap[parentId] || iconMap[parentId].destroyed) return
                                    destroyIcons(parentId)
                                })

                                // try {

                                //     let myId = null
                                //     if(_.get(self.stashSubtrees, `[${key}].oriChildren.length`) > 10){
                                //         myId = key
                                //     }else if(_.get(self.stashSubtrees, `[right${key}].oriChildren.length`) > 10){
                                //         myId = `right${key}`
                                //     }

                                //     if(_.isEmpty(myId)){
                                //         return true
                                //     }
                                //     const stashSubtree = self.stashSubtrees[myId];

                                //     const oriChildren = stashSubtree.oriChildren;
                                //     const newChildren = oriChildren.slice(stashSubtree.curBeginIdx, stashSubtree.curEndIdx);
                                //     newChildren.forEach((childTree) => {
                                //         G6.Util.traverseTreeUp(childTree, (subChildTree) => {
                                //             if (subChildTree.children && subChildTree.children.length > MAX_NUM_EACH_SUBTREE) {
                                //                 subChildTree.children = subChildTree.children.slice(0, MAX_NUM_EACH_SUBTREE);
                                //             }
                                //         });
                                //     });
                                //     const currentZoom = this.graph.getZoom();
                                //     console.log('currentZoom', currentZoom);
                                //     this.graph.updateChildren(newChildren, key);
                                //     this.graph.zoomTo(currentZoom );
                                // } catch (e) {
                                //     console.log('e', e);
                                //     return true
                                // }

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
                        if (_.get(d, 'myType') === 'none') {
                            return 0
                        }
                        return 80
                    },
                    getSide: (d) => {
                        if (_.get(d, 'data.dir') === 'left') {
                            return 'left'
                        }
                        return 'right'
                    },
                },
                fitView: true,
            })

            this.graph.edge((edge) => {
                const targetId = _.get(edge, 'target')
                const item = _.find(this.propsData, (inItem) => inItem.key == targetId)
                let stroke = 'rgba(102, 102, 102, 0.1)'
                let sourceAnchor
                let targetAnchor
                // 当前节点
                if (_.get(item, 'dir') === 'left') {
                    sourceAnchor = 0
                    targetAnchor = 1
                    stroke = '#F6BA95'
                } else if (_.get(item, 'dir') === 'right' && _.get(item, 'parent') == id) {
                    // 根节点
                    sourceAnchor = 1
                    targetAnchor = 0
                    stroke = '#91D4FA'
                }

                if (targetId === `left${id}`) {
                    stroke = '#F6BA95'
                } else if (targetId === `right${id}`) {
                    stroke = '#91D4FA'
                }

                return {
                    id: edge.id,
                    type: 'cubic-horizontal',
                    sourceAnchor,
                    targetAnchor,
                    style: {
                        stroke,
                    },
                }
            })

            const iconMap = {}

            // draw the icons on the root graphics group of the graph
            const drawIcons = (parentId) => {
                const parentNode = this.graph.findById(parentId)
                const model = parentNode.getModel()
                delayDestroyIcons(parentId, 2000)
                if (model.overflow) {
                    if (iconMap[parentId] && !iconMap[parentId].destroyed) return
                    const graphicsGroup = this.graph.getGroup()
                    const children = model.children
                    const stashSubtree = this.stashSubtrees[parentId]
                    const prePos = nodePre(children)
                    const nextPos = nodeNext(children)
                    const preIcon = graphicsGroup.addShape('marker', {
                        attrs: {
                            symbol: 'triangle',
                            x: prePos[0],
                            y: prePos[1],
                            r: 6,
                            fill: '#333',
                            opacity: 0,
                            cursor: 'pointer',
                        },
                        name: `pre-icon`,
                        subtreeID: model.id,
                    })
                    const nextIcon = graphicsGroup.addShape('marker', {
                        attrs: {
                            symbol: 'triangle-down',
                            x: nextPos[0],
                            y: nextPos[1],
                            r: 6,
                            fill: '#333',
                            opacity: 0,
                            cursor: 'pointer',
                        },
                        name: `next-icon`,
                        subtreeID: model.id,
                    })

                    if (_.get(stashSubtree, 'curBeginIdx', 0) > 0) {
                        preIcon.animate(
                            {
                                opacity: 0.5,
                            },
                            {
                                duration: 150,
                                repeat: false,
                            }
                        )
                    }
                    if (_.get(stashSubtree, 'curEndIdx', 0) < _.get(stashSubtree, 'oriChildren.length', 0)) {
                        nextIcon.animate(
                            {
                                opacity: 0.5,
                            },
                            {
                                duration: 150,
                                repeat: false,
                            }
                        )
                    }

                    iconMap[parentId] = {
                        preIcon,
                        nextIcon,
                        destroyed: false,
                    }
                    return true
                }
                return false
            }

            // update the icons
            const updateIcons = (parentId) => {
                if (!parentId || !iconMap[parentId]) return
                const preIcon = iconMap[parentId].preIcon
                const nextIcon = iconMap[parentId].nextIcon
                const stashSubtree = this.stashSubtrees[parentId]

                const parentModel = this.graph.findById(parentId).getModel()
                const children = parentModel.children
                if (!children) return
                const prePos = nodePre(children)
                const nextPos = nodeNext(children)
                preIcon.attr({
                    opacity: stashSubtree.curBeginIdx <= 0 || parentModel.collapsed ? 0 : 0.5,
                    x: prePos[0],
                    y: prePos[1],
                })
                nextIcon.attr({
                    opacity: stashSubtree.curEndIdx >= stashSubtree.oriChildren.length || parentModel.collapsed ? 0 : 0.5,
                    x: nextPos[0],
                    y: nextPos[1],
                })
            }

            // destroy the icons
            const destroyIcons = (parentId) => {
                if (!iconMap[parentId]) return
                const preIcon = iconMap[parentId].preIcon
                const nextIcon = iconMap[parentId].nextIcon
                if (preIcon && !preIcon.destroyed) {
                    preIcon.animate(
                        {
                            opacity: 0,
                        },
                        {
                            duration: 150,
                            repeat: false,
                        }
                    )
                    setTimeout(() => {
                        preIcon.remove()
                        preIcon.destroy()
                    }, 150)
                }
                if (nextIcon && !nextIcon.destroyed) {
                    nextIcon.animate(
                        {
                            opacity: 0,
                        },
                        {
                            duration: 150,
                            repeat: false,
                        }
                    )
                    setTimeout(() => {
                        nextIcon.remove()
                        nextIcon.destroy()
                    }, 150)
                }
                iconMap[parentId].destroyed = true
            }

            // destroy the icons with delay
            const delayDestroyIcons = (parentId, delay = 2000) => {
                if (!iconMap[parentId] || window || typeof window === 'undefined') return
                if (iconMap[parentId].timeouter) {
                    window.clearTimeout(iconMap[parentId].timeouter)
                }
                iconMap[parentId].timeouter = window.setTimeout(() => {
                    destroyIcons(parentId)
                }, delay)
            }

            // mouseenter the node to show the previous/next icons
            this.graph.on('node:mouseenter', (e) => {
                const parentNode = e.item.get('parent')
                if (!parentNode) return
                const parentId = parentNode.getID()
                drawIcons(parentId)
            })

            // mouseleave the node to destroy the icons
            this.graph.on('node:mouseleave', (e) => {
                const parentNode = e.item.get('parent')
                if (!parentNode) return
                const parentId = parentNode.getID()
                delayDestroyIcons(parentId, 2000)
            })

            // click the icon to changeData
            this.graph.on('click', (e) => {
                if (e.name === 'click') return
                const target = e.target
                const targetName = target.get('name')
                if (targetName !== 'pre-icon' && targetName !== 'next-icon') return
                const parentId = target.get('subtreeID')
                const stashSubtree = this.stashSubtrees[parentId]
                const oriChildren = stashSubtree.oriChildren

                if (targetName === 'pre-icon') {
                    // 收拢状态 翻页无效
                    if (_.get(this.collapsedMap, `${parentId}.collapsed`)) {
                        return
                    }
                    if (stashSubtree.curBeginIdx <= 0) return // touch the top
                    // stashSubtree.curBeginIdx--;
                    // stashSubtree.curEndIdx--;
                    stashSubtree.curBeginIdx = stashSubtree.curBeginIdx - 10
                    stashSubtree.curEndIdx = stashSubtree.curEndIdx - 10
                } else {
                    // 收拢状态 翻页无效
                    if (_.get(this.collapsedMap, `${parentId}.collapsed`)) {
                        return
                    }
                    if (stashSubtree.curEndIdx >= oriChildren.length) return // touch the bottom
                    // stashSubtree.curBeginIdx++;
                    // stashSubtree.curEndIdx++;

                    stashSubtree.curBeginIdx = stashSubtree.curBeginIdx + 10
                    stashSubtree.curEndIdx = stashSubtree.curEndIdx + 10
                }
                const newChildren = oriChildren.slice(stashSubtree.curBeginIdx, stashSubtree.curEndIdx)
                newChildren.forEach((childTree) => {
                    G6.Util.traverseTreeUp(childTree, (subChildTree) => {
                        if (subChildTree.children && subChildTree.children.length > MAX_NUM_EACH_SUBTREE) {
                            subChildTree.children = subChildTree.children.slice(0, MAX_NUM_EACH_SUBTREE)
                        }
                    })
                })
                this.graph.updateChildren(newChildren, parentId)
                this.graph.set('fitView', false)
            })
            this.graph.on('afterlayout', (e) => {
                Object.keys(iconMap).forEach((parentId) => {
                    if (!iconMap[parentId] || iconMap[parentId].destroyed) return
                    updateIcons(parentId)
                })
            })
            this.graph.data(data)
            this.graph.render()
            // this.graph.zoomTo(2)
            this.graph.fitView()
        } else {
            this.graph.destroyLayout()
            this.graph.changeData(data)
            // this.graph.zoomTo(2)
            this.graph.fitView()
        }
    }

    componentWillMount = () => {}

    componentDidMount = () => {
        this.renderG6()
        this.props.onRef(this)
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
