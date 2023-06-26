import React, { useEffect, useMemo, useState } from 'react'
import { ContentLayout, Wrap, SectionTitle, LzTable, ListVertical, Select as LocalSelect, DrawerWrap } from 'cps'
import { Button, Table, Drawer, Form, Input, Space, message, Select } from 'antd'
import { useParams } from 'react-router-dom'

import { queryReportDetail, TreportDetail, queryReportTable, editReport } from '../../Service'
import style from './index.lees'
import CODE from './code.png'
import TABLE from './table.png'
import PermissionWrap from '@/component/PermissionWrap'

export default function (props: React.PropsWithChildren<{ addTab: any }>) {
    const params = useParams()
    const [form] = Form.useForm()

    const [visible, setVisible] = useState(false)
    const [detail, setDetail] = useState<TreportDetail>({})
    const [update, setUpdate] = useState(false)

    console.log('props', props)

    const toDetail = (id: any) => {
        props.addTab && props.addTab('sysDetail', { id }, true)
    }

    const columns = useMemo(
        () => [
            {
                title: '表名称',
                dataIndex: 'name',
                render: (text: any) => (
                    <span className={style.tableIcon}>
                        <img width={15} src={TABLE} />
                        {text}
                    </span>
                ),
            },
            { title: '表描述', dataIndex: 'chineseName' },
            { title: '路径', dataIndex: 'systemPath' },
            {
                title: '操作',
                width: 100,
                fixed: 'right',
                dataIndex: '',
                render: (_: any, record: any) => (
                    <a
                        onClick={() => {
                            toDetail(record.mdTableId || '')
                        }}
                    >
                        详情
                    </a>
                ),
            },
        ],
        []
    )

    useEffect(() => {
        queryReportDetail({ reportId: params.id }).then((res) => {
            setDetail(res.data || {})
        })
    }, [params.id, update])

    const expandedRowRender = (record: any) => {
        const subColumns = [
            { title: '', dataIndex: '占位符', width: 60 },
            {
                title: '英文名',
                dataIndex: 'name',
                render: (text: any) => (
                    <span className={style.tableIcon}>
                        <img width={15} src={CODE} />
                        {text}
                    </span>
                ),
            },
            { title: '中文名', dataIndex: 'chineseName' },
            { title: '路径', dataIndex: 'path___' },
            { title: '操作', dataIndex: 'operation___' },
        ]
        return <Table scroll={{ y: 380 }} columns={subColumns} dataSource={record.fieldList || []} pagination={false} showHeader={false} />
    }

    const openDrawer = () => {
        setVisible(true)
        let values = { ...detail }

        values.reportCategoryId = values.reportCategoryId ? (values.reportCategoryId as string).split(',') : undefined
        values.tech = [values.techniqueDepartment, values.techniqueManagerId]
        values.business = [values.businessDepartment, values.businessMangerId]
        console.log('values', values)
        form.setFieldsValue({ ...values })
    }

    const submit = async () => {
        const values = form.getFieldsValue()
        console.log('values submit', values)
        // 数据转换
        values.techniqueDepartment = (values.tech || [])[0]
        values.techniqueManagerId = (values.tech || [])[1]
        values.businessMangerId = (values.business || [])[1]
        values.businessDepartment = (values.business || [])[0]
        values.reportCategoryId = (values.reportCategoryId || []).join(',')

        values.id = detail.id

        delete values.business
        delete values.tech
        delete values.reportCategoryId

        const res = await editReport(values)
        if (res.code === 200) {
            message.success('更新成功')
            setVisible(false)
        } else {
            message.error(res.msg || '操作失败')
        }
        setUpdate((v) => !v)
    }

    const setExpandedRowClassName = () => {
        return style.expandRow
    }

    console.log('params', params)

    return (
        <ContentLayout
            title={
                <div className={style.title}>
                    报表详情<span></span>{' '}
                    <PermissionWrap funcCode='/reportNew/directory/detailedit'>
                        <Button onClick={openDrawer}>编辑</Button>
                    </PermissionWrap>
                </div>
            }
            //back
            init
            footer
        >
            <Wrap marginBottom={16}>
                <SectionTitle title='基本信息' style={{ marginBottom: 20 }} />
                <div className={style.flex}>
                    <ListVertical label='报表名称' value={detail.name} />
                    <ListVertical label='报表分类' value={detail.systemPath} />
                    <ListVertical label='报表等级' value={detail.levelName} />
                    <ListVertical label='报表周期' value={detail.periodName} />
                </div>
                <div className={style.flex}>
                    <ListVertical label='业务归属部门' value={detail.businessDepartmentName} />
                    <ListVertical label='业务负责人' value={detail.businessMangerName} />
                    <ListVertical label='技术归属部门' value={detail.techniqueDepartmentName} />
                    <ListVertical label='技术负责人' value={detail.techniqueManagerName} />
                </div>
                <div className={style.flex}>
                    <ListVertical label='描述' value={detail.desc} />
                </div>
            </Wrap>
            <Wrap>
                <SectionTitle title='依赖表/字段' style={{ marginBottom: 16 }} />
                <LzTable
                    rowKey={'id'}
                    columns={columns}
                    request={async (param = {}) => {
                        const res = await queryReportTable({
                            reportId: params.id || '',
                            pageNum: param.current as number,
                            pageSize: param.pageSize || 10,
                        })
                        return {
                            data: res.data.list || [],
                            total: res.data.total,
                        }
                    }}
                    updateDependencies={[params.id]}
                    expandedRowRender={expandedRowRender}
                    showExpandIcon
                    expandedRowClassName={setExpandedRowClassName}
                />
            </Wrap>
            <DrawerWrap
                title='报表编辑'
                onClose={() => {
                    setVisible(false)
                }}
                visible={visible}
                onOk={submit}
            >
                <Form form={form} layout={'vertical'}>
                    <Form.Item label='报表名称' name='name' rules={[{ required: true }]}>
                        <Input placeholder='请输入' disabled />
                    </Form.Item>
                    <Form.Item label='报表描述' name='desc'>
                        <Input.TextArea placeholder='请输入' maxLength={128} showCount />
                    </Form.Item>
                    {/* <Form.Item label="报表分类" name="systemPath">
            <LocalSelect.CateSelect disabled placeholder='请选择报表分类' />
          </Form.Item> */}
                    <Form.Item label='报表分类' name='systemPath'>
                        <Select disabled placeholder='请选择报表分类' />
                    </Form.Item>
                    <Form.Item label='报表等级' name='levelId'>
                        <LocalSelect.LevelSelect placeholder='请选择报表等级' />
                    </Form.Item>
                    <Form.Item label='报表周期' name='periodId'>
                        <LocalSelect.CycleSelect placeholder='请选择报表周期' />
                    </Form.Item>
                    <Form.Item label='技术归属方' name='tech'>
                        <LocalSelect.DepartUser placeholder={['技术部门', '技术负责人']} />
                    </Form.Item>
                    <Form.Item label='业务归属方' name='business'>
                        <LocalSelect.DepartUser placeholder={['业务部门', '业务负责人']} />
                    </Form.Item>
                </Form>
            </DrawerWrap>
        </ContentLayout>
    )
}
