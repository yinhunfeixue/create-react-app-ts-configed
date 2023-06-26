import AutoTip from '@/component/AutoTip'
import IconFont from '@/component/IconFont'
import RichTableLayout from '@/component/layout/RichTableLayout'
import SliderLayout from '@/component/layout/SliderLayout'
import SliderLayout2 from '@/component/layout/SliderLayout2'
import TableLayout from '@/component/layout/TableLayout'
import Module from '@/component/Module'
import ModuleTitle from '@/component/module/ModuleTitle'
import TimingSelect from '@/component/timingSelect/TimingSelect'
import SearchTree, { defaultTitleRender, ISearchTreeRef } from '@/components/trees/SearchTree'
import ProjectUtil from '@/utils/ProjectUtil'
import { CheckCircleOutlined, InfoCircleOutlined, LikeOutlined, SmileOutlined, UploadOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Cascader, Checkbox, DatePicker, Divider, Form, Input, InputNumber, Menu, message, Modal, Radio, Select, Switch, Table, Tooltip, Upload } from 'antd'
import FormItem from 'antd/es/form/FormItem'
import { INTERNAL_SELECTION_ITEM } from 'antd/lib/table/hooks/useSelection'
import { DataNode } from 'antd/lib/tree'
import React, { Component, useState } from 'react'
import './ComponentTest.less'

interface IComponentTestSate {
    renderFun: React.FC
}

/**
 * ComponentTest
 */
class ComponentTest extends Component<any, IComponentTestSate> {
    constructor(props: any) {
        super(props)
        this.state = {
            renderFun: this.renderTimingSelect,
        }
    }
    componentDidMount() {}

    renderAutoTip() {
        return (
            <Card title='自动tip组件, 请拖动窗口宽度，只有显示...的文字有tooltip'>
                {[
                    '文字短,无tip',
                    '文字长,有tip,落霞与孤鹜齐飞，秋水共长天一色',
                    '富文本,<span style="color:red">无</span>tip',
                    '富文本,有tip, <span style="color:red">渔舟唱晚</span>，响穷彭蠡之滨；<span style="color:red">雁阵惊寒</span>，声断衡阳之浦',
                    <span>
                        我是reactNode, 天高地迥，觉<span style={{ fontWeight: 'bold', color: '#00ff00' }}>宇宙之无穷</span>；兴尽悲来，识盈虚之有数
                    </span>,
                ].map((item, index) => {
                    return <AutoTip content={item} key={index} style={{ width: '20%', border: '1px solid #eeeeee', marginBottom: 10 }} />
                })}
            </Card>
        )
    }

    private renderFormComponent() {
        return (
            <Form>
                <Card title='选择'>
                    <Radio>常规</Radio>
                    <Radio disabled>禁用</Radio>
                    <Radio checked>选中</Radio>
                    <Radio checked disabled>
                        选中 + 禁用
                    </Radio>

                    <Checkbox>常规</Checkbox>
                    <Checkbox disabled>禁用</Checkbox>
                    <Checkbox checked>选中</Checkbox>
                    <Checkbox checked disabled>
                        选中 + 禁用
                    </Checkbox>
                    <Switch />
                    <Switch checked />
                </Card>
                <Card title='按钮'>
                    <table>
                        <tr>
                            <td>状态</td>
                            <td>主要</td>
                            <td>次要</td>
                            <td>幽灵</td>
                            <td>文字（背景）</td>
                            <td>文字</td>
                        </tr>
                        <tr>
                            <td>默认</td>
                            <td>
                                <Button type='primary'>primary-主要按钮</Button>
                            </td>
                            <td>
                                <Button>默认-次要按钮</Button>
                            </td>
                            <td>
                                <Button type='primary' ghost>
                                    primary ghost按钮
                                </Button>
                            </td>
                            <td>
                                <Button type='link'>文字按钮</Button>
                            </td>
                            <td>
                                <Button type='text' ghost>
                                    文字按钮
                                </Button>
                            </td>
                        </tr>
                        <tr>
                            <td>悬浮</td>
                            <td>
                                <Button type='primary' className='DemoHover'>
                                    primary-主要按钮
                                </Button>
                            </td>
                            <td>
                                <Button className='DemoHover'>默认-次要按钮</Button>
                            </td>
                            <td>
                                <Button type='primary' ghost className='DemoHover'>
                                    primary ghost按钮
                                </Button>
                            </td>
                            <td>
                                <Button type='link' className='DemoHover'>
                                    文字按钮
                                </Button>
                            </td>
                            <td>
                                <Button type='text' className='DemoHover' ghost>
                                    文字按钮
                                </Button>
                            </td>
                        </tr>
                        <tr>
                            <td>禁用</td>
                            <td>
                                <Button type='primary' disabled>
                                    primary-主要按钮
                                </Button>
                            </td>
                            <td>
                                <Button disabled>默认-次要按钮</Button>
                            </td>
                            <td>
                                <Button type='primary' ghost disabled>
                                    primary ghost按钮
                                </Button>
                            </td>
                            <td>
                                <Button type='link' disabled>
                                    文字按钮
                                </Button>
                            </td>
                            <td>
                                <Button type='text' disabled>
                                    文字按钮
                                </Button>
                            </td>
                        </tr>
                    </table>
                </Card>
                <Card title='输入框'>
                    <table>
                        <tr>
                            <td>状态</td>
                            <td>默认</td>
                            <td>悬停</td>
                            <td>焦点</td>
                            <td>禁用</td>
                            <td>错误</td>
                        </tr>
                        {[
                            {
                                label: '单行输入框',
                                value: [
                                    <Input />,
                                    <Input className='DemoHover' />,
                                    <Input className='DemoFocus' />,
                                    <Input disabled />,
                                    <FormItem validateStatus='error' help='错误'>
                                        <Input />
                                    </FormItem>,
                                ],
                            },
                            {
                                label: '多行输入框',
                                value: [
                                    <Input.TextArea />,
                                    <Input.TextArea className='DemoHover' />,
                                    <Input.TextArea className='DemoFocus' />,
                                    <Input.TextArea disabled />,
                                    <FormItem validateStatus='error' help='错误'>
                                        <Input.TextArea />
                                    </FormItem>,
                                ],
                            },
                            {
                                label: '搜索',
                                value: [
                                    <Input.Search />,
                                    '',
                                    '',
                                    <Input.Search disabled />,
                                    <FormItem validateStatus='error' help='错误'>
                                        <Input.Search />
                                    </FormItem>,
                                ],
                            },
                            {
                                label: '数字',
                                value: [
                                    <InputNumber />,
                                    '',
                                    '',
                                    <InputNumber disabled />,
                                    <FormItem validateStatus='error' help='错误'>
                                        <InputNumber />
                                    </FormItem>,
                                ],
                            },
                            {
                                label: '下拉框',
                                value: [
                                    <Select style={{ width: 180 }} showSearch>
                                        {new Array(10).fill(0).map((_, index) => {
                                            return <Select.Option value={index}>选项{index}</Select.Option>
                                        })}
                                    </Select>,
                                    '',
                                    '',
                                    <Select style={{ width: 180 }} disabled />,
                                    <FormItem validateStatus='error' help='错误'>
                                        <Select />
                                    </FormItem>,
                                ],
                            },
                            {
                                label: '级联下拉框',
                                value: [
                                    <Cascader
                                        value={['1-1', '1-2-1']}
                                        options={[
                                            {
                                                label: '1-1',
                                                value: '1-1',
                                                children: [
                                                    {
                                                        label: '1-2-1',
                                                        value: '1-2-1',
                                                    },
                                                ],
                                            },
                                            {
                                                label: '2-1',
                                                children: [
                                                    {
                                                        label: '2-2-1',
                                                    },
                                                ],
                                            },
                                        ]}
                                    />,
                                    '',
                                    '',
                                    <Cascader disabled />,
                                    <FormItem validateStatus='error' help='错误'>
                                        <Cascader />
                                    </FormItem>,
                                ],
                            },
                            {
                                label: '日期选择',
                                value: [
                                    <DatePicker style={{ width: 180 }} />,
                                    '',
                                    '',
                                    <DatePicker style={{ width: 180 }} disabled />,
                                    <FormItem validateStatus='error' help='错误'>
                                        <DatePicker />
                                    </FormItem>,
                                ],
                            },
                        ].map((item) => {
                            return (
                                <tr key={item.label}>
                                    <td>{item.label}</td>
                                    {item.value.map((valueItem, index) => {
                                        return <td key={index}>{valueItem}</td>
                                    })}
                                </tr>
                            )
                        })}
                    </table>
                </Card>
                <Card title='上传'>
                    <div className='VControlGroup'>
                        <Upload>
                            <Button icon={<UploadOutlined />} type='primary' ghost>
                                上传
                            </Button>
                        </Upload>
                        <Upload.Dragger>
                            <p className='ant-upload-drag-icon'>
                                <UploadOutlined />
                            </p>
                            <p className='ant-upload-text'>请点击或拖拽进行上传！</p>
                        </Upload.Dragger>
                    </div>
                </Card>
            </Form>
        )
    }

    private renderSearchTree() {
        const treeData = [
            {
                key: 1,
                title: '1',
                children: [
                    {
                        key: 11,
                        title: '11',
                    },
                    {
                        key: 12,
                        title: '12',
                        children: [
                            {
                                key: 121,
                                title: '121',
                            },
                            {
                                key: 122,
                                title: '122',
                            },
                        ],
                    },
                ],
            },
            {
                key: 2,
                title: '2',
                children: [
                    {
                        key: 21,
                        title: '21',
                    },
                    {
                        key: 22,
                        title: '22',
                    },
                ],
            },
        ]

        const defaultRef = React.createRef<ISearchTreeRef>()
        return (
            <Card title='树'>
                <ol>
                    <li>内置搜索</li>
                    <li>内置空状态</li>
                    <li>搜索时，自动展开节点</li>
                    <li>搜索词自动标红</li>
                    <li>自动省略号</li>
                    <li>点击结点也可展开</li>
                    <li>点击结点，不能取消选中</li>
                </ol>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 300px)', rowGap: 10, columnGap: 10 }}>
                    <Card title='默认树'>
                        <div className='HControlGroup' style={{ marginBottom: 16 }}>
                            <Button
                                onClick={() => {
                                    if (defaultRef.current) {
                                        defaultRef.current.expandAll()
                                    }
                                }}
                            >
                                展开全部
                            </Button>
                            <Button
                                onClick={() => {
                                    if (defaultRef.current) {
                                        defaultRef.current.expand([])
                                    }
                                }}
                            >
                                收回全部
                            </Button>
                            <Button
                                onClick={() => {
                                    if (defaultRef.current) {
                                        defaultRef.current.expand([1, 12])
                                    }
                                }}
                            >
                                展开1、12
                            </Button>
                        </div>
                        <div style={{ border: '1px solid #eee' }}>
                            <SearchTree
                                ref={defaultRef}
                                treeProps={{
                                    treeData,
                                    onExpand: (keys) => {
                                        message.info(`展开了：${JSON.stringify(keys)}`)
                                    },
                                    onSelect: (keys) => {
                                        message.success(`选中了: ${JSON.stringify(keys)}`)
                                    },
                                }}
                            />
                        </div>
                    </Card>
                    <Card title='自定义结点是否可选中'>
                        <Alert message='不可选中的结点，点击标题也展开，点111试试' description='disableNodeSelect' />
                        <div style={{ border: '1px solid #eee' }}>
                            <SearchTree
                                treeProps={{
                                    treeData,
                                    onExpand: (keys) => {
                                        message.info(`展开了：${JSON.stringify(keys)}`)
                                    },
                                    onSelect: (keys) => {
                                        message.success(`选中了: ${JSON.stringify(keys)}`)
                                    },
                                }}
                                disableNodeSelect={(node) => node.key === 1}
                            />
                        </div>
                    </Card>
                    <Card title='渲染为：图标/文字/菜单'>
                        <Alert message='treeTitleRender==>defaultTitleRender' />
                        <SearchTree
                            equalNode={(searchKey, node) => Boolean(searchKey && node.title && node.title.toString().includes(searchKey))}
                            treeTitleRender={(node, searchKey) => {
                                return defaultTitleRender(
                                    node,
                                    (data) => {
                                        return {
                                            icon: data.children ? <LikeOutlined /> : <SmileOutlined />,
                                            title: data.title + '额外内容' + (data.key === 1 ? '很长很长很长的标题' : ''),
                                            extra: <span style={{ color: data.key === 1 ? 'red' : '' }}>{data.key === 1 ? 'abcdefghijklmn' : '99'}</span>,
                                            menuList: data.children
                                                ? [
                                                      {
                                                          label: '你敢点我？',
                                                          key: '1',
                                                          onClick: () => message.success('点我干啥'),
                                                      },

                                                      {
                                                          label: '你还敢点我?',
                                                          key: '2',
                                                          onClick: () => message.success('怕你了'),
                                                      },
                                                  ]
                                                : undefined,
                                        }
                                    },
                                    searchKey
                                )
                            }}
                            treeProps={{
                                treeData,
                            }}
                        />
                    </Card>
                    <Card title='完全自定义渲染'>
                        <SearchTree<DataNode>
                            equalNode={(searchKey, node) => Boolean(searchKey && node.title && node.title.toString().includes(searchKey))}
                            treeTitleRender={(node, searchKey) => {
                                if (!node.children) {
                                    return <span>前缀-{node.title}-后缀</span>
                                }
                                return <span>{node.title}我把标题加的很长很长很长很长很长很长很长，服不服</span>
                            }}
                            treeProps={{
                                treeData,
                            }}
                        />
                    </Card>

                    <Card title='禁用搜索'>
                        <SearchTree<DataNode>
                            equalNode={(searchKey, node) => Boolean(searchKey && node.title && node.title.toString().includes(searchKey))}
                            disabledSearch
                            treeProps={{
                                treeData,
                            }}
                        />
                    </Card>
                    <Card title='默认展开全部'>
                        <SearchTree<DataNode>
                            equalNode={(searchKey, node) => Boolean(searchKey && node.title && node.title.toString().includes(searchKey))}
                            treeProps={{
                                treeData,
                                defaultExpandAll: true,
                            }}
                        />
                    </Card>
                </div>
            </Card>
        )
    }

    private renderMessage() {
        return (
            <>
                <Card title='提示'>
                    <div className='VControlGroup'>
                        <Alert showIcon message='默认提示' closable />
                        <Alert closable showIcon icon={<InfoCircleOutlined />} message='默认提示' description='描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述' />
                        <Alert showIcon type='success' message='成功' />
                        <Alert showIcon icon={<CheckCircleOutlined />} type='success' message='成功' description='描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述' />
                        <Alert showIcon type='warning' message='警告' />
                        <Alert showIcon type='warning' message='警告' description='描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述' />
                        <Alert showIcon type='error' message='错误' />
                        <Alert showIcon type='error' message='错误' description='描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述描述' />
                    </div>
                </Card>

                <Card title='消息'>
                    <div className='HControlGroup'>
                        <Button onClick={() => message.info('普通消息')}>普通</Button>
                        <Button onClick={() => message.success('成功消息')}>成功</Button>
                        <Button onClick={() => message.warn('警告消息')}>警告</Button>
                        <Button onClick={() => message.error('错误消息')}>错误</Button>
                    </div>
                </Card>
            </>
        )
    }

    private renderOther() {
        return (
            <Card title='其它'>
                <div className='HControlGroup'>
                    <Tooltip visible title='气泡气泡气泡气泡气泡气泡' placement='right'>
                        <Button>气泡</Button>
                    </Tooltip>
                    <div className='iconfont icon-kongzhuangtai2' />
                </div>
            </Card>
        )
    }

    private renderLayout() {
        const [showTableLayoutFooter, setShowTableLayoutFooter] = useState(false)
        return (
            <>
                <Card title='模块' extra='标题左侧有竖线'>
                    <Module
                        title='标题'
                        renderHeaderExtra={() => {
                            return <Button>扩展区</Button>
                        }}
                    >
                        <div>内容区</div>
                    </Module>
                    <Divider />
                    <ModuleTitle title='我是单独的模块标题' />
                </Card>
                <Card title='侧边栏布局1' bodyStyle={{ height: 200 }}>
                    <SliderLayout
                        style={{ height: '100%' }}
                        renderSliderHeader={() => {
                            return '侧边栏标题'
                        }}
                        renderSliderBody={() => {
                            return '侧边栏内容'
                        }}
                        renderContentHeader={() => {
                            return '内容区标题'
                        }}
                        renderContentBody={() => {
                            return '内容区'
                        }}
                        renderContentHeaderExtra={() => {
                            return <Button>扩展区</Button>
                        }}
                    />
                </Card>

                <Card title='侧边栏布局2' bodyStyle={{ height: 200 }}>
                    <SliderLayout2
                        style={{ height: '100%' }}
                        renderSlider={() => {
                            return '侧边栏内容'
                        }}
                        renderContent={() => {
                            return '内容区'
                        }}
                    />
                </Card>

                <Card title='表格布局' bodyStyle={{ background: '#eee' }}>
                    <TableLayout
                        title='我只有布局'
                        showFooterControl={showTableLayoutFooter}
                        renderHeaderExtra={() => {
                            return (
                                <>
                                    <Button>扩展区</Button>
                                </>
                            )
                        }}
                        renderDetail={() => {
                            return <Button onClick={() => setShowTableLayoutFooter(!showTableLayoutFooter)}>这里是详情，点我{showTableLayoutFooter ? '隐藏' : '显示'}页脚</Button>
                        }}
                        renderTable={() => {
                            return <Table />
                        }}
                        renderFooter={() => {
                            return <div>页脚</div>
                        }}
                    />
                </Card>
            </>
        )
    }

    private renderRichTable() {
        const [selections, setSelections] = useState<INTERNAL_SELECTION_ITEM[] | boolean>([{ key: 'custom', text: '点我，把此菜单修改为默认值', onSelect: () => setSelections(true) }])
        return (
            <>
                <Card title='表格布局' bodyStyle={{ background: '#eee' }}>
                    <RichTableLayout<any>
                        title='我带表格操作逻辑，查看filter、sorter参数，请在开发者工具查看'
                        renderHeaderExtra={() => {
                            return <Button>扩展区</Button>
                        }}
                        renderFooter={(controller, defaultFooterElements) => {
                            const { selectedKeys } = controller
                            return [
                                <Button
                                    key='0'
                                    onClick={() => {
                                        if (selectedKeys) {
                                            Modal.success({
                                                content: selectedKeys.join(),
                                            })
                                        }
                                    }}
                                    type='primary'
                                    ghost
                                >
                                    点我显示选中的key
                                </Button>,
                                <Button
                                    key='reset'
                                    onClick={() => {
                                        controller.updateSelectedKeys([])
                                    }}
                                >
                                    清除选中
                                </Button>,
                                <Button
                                    key='reset'
                                    onClick={() => {
                                        controller.updateSelectedKeys(['b'])
                                    }}
                                >
                                    选中id=b
                                </Button>,
                                <Button key='1' onClick={() => {}}>
                                    批量操作2
                                </Button>,
                                <Divider type='vertical' />,
                                <span>右边是自带的元素--{'>'}</span>,
                                ...defaultFooterElements(),
                            ]
                        }}
                        tableProps={{
                            selectedEnable: true,
                            columns: [
                                {
                                    title: 'id',
                                    dataIndex: 'id',
                                },
                                {
                                    title: '属性一很长的标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题标题',
                                    dataIndex: 'a',
                                    width: 150,
                                    sorter: true,
                                },
                                {
                                    title: '属性三',
                                    dataIndex: 'b',
                                    sorter: true,
                                    filters: [
                                        {
                                            text: 'Joe',
                                            value: 'Joe',
                                        },
                                        {
                                            text: 'Jim',
                                            value: 'Jim',
                                        },
                                    ],
                                },
                                {
                                    title: '属性二',
                                    dataIndex: 'b',
                                },
                            ],
                        }}
                        requestListFunction={async (page, pageSize, filter, sorter, extra) => {
                            console.log('请求参数')
                            console.log('page=', page)
                            console.log('pageSize=', pageSize)
                            console.log('filter=', filter)
                            console.log('sorter=', sorter)
                            console.log('extra=', extra)
                            await ProjectUtil.sleep()
                            return {
                                total: 12345678,
                                dataSource: [
                                    {
                                        id: 'a',
                                        a: 'a111',
                                        b: 'a22',
                                    },
                                    {
                                        id: 'b',
                                        a: 'b1',
                                        b: 'b22',
                                    },
                                ],
                            }
                        }}
                    />

                    <RichTableLayout<any>
                        title='我自带删除功能'
                        renderHeaderExtra={() => {
                            return <Button>扩展区</Button>
                        }}
                        renderFooter={(controller, defaultFooterElements) => {
                            const { selectedKeys } = controller
                            return [
                                <Button
                                    key='0'
                                    onClick={() => {
                                        if (selectedKeys) {
                                            Modal.success({
                                                content: selectedKeys.join(),
                                            })
                                        }
                                    }}
                                    type='primary'
                                    ghost
                                >
                                    点我显示选中的key
                                </Button>,
                                <Button
                                    key='reset'
                                    onClick={() => {
                                        controller.updateSelectedKeys([])
                                    }}
                                >
                                    清除选中
                                </Button>,
                                <Button
                                    key='reset'
                                    onClick={() => {
                                        controller.updateSelectedKeys(['b'])
                                    }}
                                >
                                    选中id=b
                                </Button>,
                                <Button key='1' onClick={() => {}}>
                                    批量操作2
                                </Button>,
                                <Divider type='vertical' />,
                                <span>右边是自带的元素--{'>'}</span>,
                                ...defaultFooterElements(),
                            ]
                        }}
                        tableProps={{
                            selectedEnable: true,
                            columns: [
                                {
                                    title: 'id',
                                    dataIndex: 'id',
                                },
                                {
                                    title: '属性一',
                                    dataIndex: 'a',
                                    sorter: true,
                                },
                                {
                                    title: '属性三',
                                    dataIndex: 'b',
                                    sorter: true,
                                    filters: [
                                        {
                                            text: 'Joe',
                                            value: 'Joe',
                                        },
                                        {
                                            text: 'Jim',
                                            value: 'Jim',
                                        },
                                    ],
                                },
                                {
                                    title: '属性二',
                                    dataIndex: 'b',
                                },
                            ],
                        }}
                        deleteFunction={async () => {
                            await ProjectUtil.sleep(2000)
                            return true
                        }}
                        requestListFunction={async (page, pageSize, filter, sorter, extra) => {
                            console.log('请求参数')
                            console.log('page=', page)
                            console.log('pageSize=', pageSize)
                            console.log('filter=', filter)
                            console.log('sorter=', sorter)
                            console.log('extra=', extra)
                            await ProjectUtil.sleep()
                            return {
                                total: 12345678,
                                dataSource: [
                                    {
                                        id: 'a',
                                        a: 'a111',
                                        b: 'a22',
                                    },
                                    {
                                        id: 'b',
                                        a: 'b1',
                                        b: 'b22',
                                    },
                                ],
                            }
                        }}
                    />

                    <RichTableLayout<any>
                        title='我的多选框菜单，可自定义，也可用默认值'
                        renderHeaderExtra={() => {
                            return <Button>扩展区</Button>
                        }}
                        renderFooter={(controller, defaultFooterElements) => {
                            const { selectedKeys } = controller
                            return [
                                <Button
                                    key='0'
                                    onClick={() => {
                                        if (selectedKeys) {
                                            Modal.success({
                                                content: selectedKeys.join(),
                                            })
                                        }
                                    }}
                                    type='primary'
                                    ghost
                                >
                                    点我显示选中的key
                                </Button>,
                                <Button
                                    key='reset'
                                    onClick={() => {
                                        controller.updateSelectedKeys([])
                                    }}
                                >
                                    清除选中
                                </Button>,
                                <Button
                                    key='reset'
                                    onClick={() => {
                                        controller.updateSelectedKeys(['b'])
                                    }}
                                >
                                    选中id=b
                                </Button>,
                                <Button key='1' onClick={() => {}}>
                                    批量操作2
                                </Button>,
                                <Divider type='vertical' />,
                                <span>右边是自带的元素--{'>'}</span>,
                                ...defaultFooterElements(),
                            ]
                        }}
                        tableProps={{
                            selectedEnable: true,
                            columns: [
                                {
                                    title: 'id',
                                    dataIndex: 'id',
                                },
                                {
                                    title: '属性一',
                                    dataIndex: 'a',
                                    sorter: true,
                                },
                                {
                                    title: '属性三',
                                    dataIndex: 'b',
                                    sorter: true,
                                    filters: [
                                        {
                                            text: 'Joe',
                                            value: 'Joe',
                                        },
                                        {
                                            text: 'Jim',
                                            value: 'Jim',
                                        },
                                    ],
                                },
                                {
                                    title: '属性二',
                                    dataIndex: 'b',
                                },
                            ],
                            selections,
                        }}
                        deleteFunction={async () => {
                            await ProjectUtil.sleep(2000)
                            return true
                        }}
                        requestListFunction={async (page, pageSize, filter, sorter, extra) => {
                            console.log('请求参数')
                            console.log('page=', page)
                            console.log('pageSize=', pageSize)
                            console.log('filter=', filter)
                            console.log('sorter=', sorter)
                            console.log('extra=', extra)
                            await ProjectUtil.sleep()
                            return {
                                total: 12345678,
                                dataSource: [
                                    {
                                        id: 'a',
                                        a: 'a111',
                                        b: 'a22',
                                    },
                                    {
                                        id: 'b',
                                        a: 'b1',
                                        b: 'b22',
                                    },
                                ],
                            }
                        }}
                    />
                </Card>
            </>
        )
    }

    private renderTimingSelect() {
        return (
            <TimingSelect
                onChange={(value) => {
                    message.info(
                        `值变化: ${JSON.stringify({
                            ...value,
                            time: value.time ? value.time.format('HH:mm') : undefined,
                        })}`
                    )
                }}
            />
        )
    }

    private renderIcon() {
        return (
            <React.Fragment>
                <Card title='彩色，可设置字号，无法改颜色'>
                    <ol>
                        <li>
                            打开{' '}
                            <a href='https://www.iconfont.cn/' target='_blank'>
                                https://www.iconfont.cn/
                            </a>
                        </li>
                        <li>进入项目，并切换到 Font class</li>
                        <li>复制图片名称</li>
                        <li>使用组件IconFont</li>
                    </ol>
                    <IconFont type='icon-a-bianzu3' />
                    <IconFont type='icon-a-8' style={{ fontSize: 50 }} />
                </Card>
                <Card title='单色，支持所有css样式'>
                    <ol>
                        <li>同上，但切换到 Unicode</li>
                        <li>复制图片名称，去掉; 取后4位。例如{'&#xe728;  -->  e728'}</li>
                        <li>使用组件IconFont</li>
                    </ol>
                    <IconFont type='e726' useCss />
                    <IconFont type='e726' useCss style={{ fontSize: 50, color: 'green' }} />
                </Card>
            </React.Fragment>
        )
    }

    render() {
        const { renderFun } = this.state
        return (
            <SliderLayout2
                style={{ height: '100%' }}
                renderSlider={() => {
                    return (
                        <Menu
                            defaultSelectedKeys={['0']}
                            items={[
                                {
                                    label: '自动tooltip(AutoTip)',
                                    onClick: () => this.setState({ renderFun: this.renderAutoTip }),
                                },
                                {
                                    label: '图标',
                                    onClick: () => this.setState({ renderFun: this.renderIcon }),
                                },
                                {
                                    label: '表单组件',
                                    onClick: () => this.setState({ renderFun: this.renderFormComponent }),
                                },
                                {
                                    label: '搜索树',
                                    onClick: () => this.setState({ renderFun: this.renderSearchTree }),
                                },
                                {
                                    label: '消息提示类',
                                    onClick: () => this.setState({ renderFun: this.renderMessage }),
                                },
                                {
                                    label: '其它',
                                    onClick: () => this.setState({ renderFun: this.renderOther }),
                                },
                                {
                                    label: '布局',
                                    onClick: () => this.setState({ renderFun: this.renderLayout }),
                                },
                                {
                                    label: '多功能表格',
                                    onClick: () => this.setState({ renderFun: this.renderRichTable }),
                                },
                                {
                                    label: '定时选择器',
                                    onClick: () => this.setState({ renderFun: this.renderTimingSelect }),
                                },
                            ].map((item, index) => {
                                return {
                                    ...item,
                                    key: index.toString(),
                                }
                            })}
                        />
                    )
                }}
                renderContent={() => {
                    return <main className='VControlGroup ComponentTest'>{React.createElement(renderFun)}</main>
                }}
            />
        )
    }
}

export default ComponentTest
