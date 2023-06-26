import { httpObj } from '@/api/base'
import DOPService from '@/api/DOPService'
import IFriendLink from '@/interface/IFriendLink'
import { Card, Drawer, DrawerProps, message } from 'antd'
import React, { Component, ReactNode, ReactText } from 'react'
import Blood from './components/Blood'
import Classification from './components/Classification'
import Dictionary from './components/Dictionary'
import Er from './components/Er'
import GoverningFilteringReasoning from './components/GoverningFilteringReasoning'
import IndexSync from './components/IndexSync'
import IndicatorStatistics from './components/IndicatorStatistics'
import SynonymInferenceReasoning from './components/SynonymInferenceReasoning'
import './Dopmanage.less'

interface IFunction extends IFriendLink {
    component?: ReactNode
}

interface IBasicLayoutState {
    openMenuKeys: ReactText[]
    selectedMenuKeys: ReactText[]
    columnsCount: number
    selectedFunction?: IFunction
    outSystemList?: IFriendLink[]
}

/**
 * 基础布局
 */
class BasicLayout extends Component<any, IBasicLayoutState> {
    constructor(props: any) {
        super(props)
        this.state = {
            openMenuKeys: [],
            selectedMenuKeys: [],
            columnsCount: 4,
        }
    }

    componentDidMount() {
        this.updateColumnCount()
        this.requestOutSystemList()
        window.addEventListener('resize', this.windowResizeHandler)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.windowResizeHandler)
    }

    private windowResizeHandler = () => {
        this.updateColumnCount()
    }

    private updateColumnCount() {
        const { offsetWidth } = document.body
        const columnsCount = Math.max(1, Math.floor(offsetWidth / 330))
        this.setState({ columnsCount })
    }

    private requestUrl(url: string) {
        const close = message.loading(`触发操作中，请稍候...`, 0)
        httpObj
            .httpGet(url)
            .then((res) => {
                const { code, msg } = res.data
                if (code === 200) {
                    message.success(msg || '操作成功')
                } else {
                    message.error(msg || '操作失败，错误未知')
                }
            })
            .finally(() => {
                close()
            })
    }

    private renderContent() {
        const { columnsCount, outSystemList } = this.state

        const groups: {
            groupTitle: string
            dataSource: (IFunction | IFriendLink)[]
        }[] = [
            {
                groupTitle: '运维管理',
                dataSource: [
                    {
                        name: '索引同步',
                        component: <IndexSync />,
                    },
                    {
                        name: '治理过滤推理',
                        component: <GoverningFilteringReasoning />,
                    },
                    {
                        name: '可信数据认证',
                        onClick: async () => {
                            this.requestUrl(`/quantchiAPI/api/dwapp/trust/dataAuth`)
                        },
                    },
                    {
                        name: '同义簇推理',
                        component: <SynonymInferenceReasoning />,
                    },
                    {
                        name: '指标统计',
                        component: <IndicatorStatistics />,
                    },
                    {
                        name: '分类分级推理',
                        component: <Classification />,
                    },
                    {
                        name: 'ER图刷新',
                        component: <Er />,
                    },
                    {
                        name: '血缘图刷新',
                        component: <Blood />,
                    },
                    {
                        name: '数据字典初始化任务',
                        component: <Dictionary />,
                    },
                    {
                        name: '同步权限用户',
                        onClick: async () => {
                            this.requestUrl(`/service-auth/policy/information/pull/dop/user`)
                        },
                    },
                    {
                        name: 'er关系推理任务接口',
                        onClick: async () => {
                            this.requestUrl(`/quantchiAPI/er/graph/execInference`)
                        },
                    },
                    {
                        name: '模型推理任务接口',
                        onClick: async () => {
                            this.requestUrl(`/quantchiAPI//model/admin/modelInference`)
                        },
                    },
                ],
            },
            {
                groupTitle: '工具组件',
                dataSource: outSystemList || [],
            },
        ]

        return (
            <div>
                {groups.map((item) => {
                    const { groupTitle, dataSource } = item
                    return (
                        <Card className='Group' key={groupTitle} title={groupTitle}>
                            <div
                                className='FunGroup'
                                style={{
                                    gridTemplateColumns: `repeat(${columnsCount}, 1fr)`,
                                }}
                            >
                                {dataSource.map((item) => {
                                    const { name, url, onClick } = item

                                    if (url) {
                                        const useUrl = url.indexOf('http') === 0 ? url : `http://${url}`
                                        return (
                                            <a key={name} className='FunItemLink' href={useUrl} target='_blank'>
                                                {name}
                                            </a>
                                        )
                                    }
                                    return (
                                        <div
                                            className='FunItem'
                                            key={name}
                                            onClick={() => {
                                                if (onClick) {
                                                    onClick()
                                                } else {
                                                    this.setState({ selectedFunction: item })
                                                }
                                            }}
                                        >
                                            {name}
                                        </div>
                                    )
                                })}
                            </div>
                        </Card>
                    )
                })}
            </div>
        )
    }

    private requestOutSystemList() {
        DOPService.requestOutSystemList().then((data) => {
            this.setState({ outSystemList: data })
        })
    }

    private renderDrawer() {
        const { selectedFunction } = this.state
        const visible = Boolean(selectedFunction)
        let props: DrawerProps = {}
        if (selectedFunction) {
            const { name } = selectedFunction
            props = {
                title: name,
            }
        }
        return (
            <Drawer
                maskClosable={false}
                visible={visible}
                destroyOnClose
                width={400}
                onClose={() => {
                    this.setState({ selectedFunction: undefined })
                }}
                {...props}
            >
                {selectedFunction ? selectedFunction.component : undefined}
            </Drawer>
        )
    }

    render() {
        return (
            <div className='Dopmanage'>
                <main>{this.renderContent()}</main>
                {this.renderDrawer()}
            </div>
        )
    }
}
export default BasicLayout
