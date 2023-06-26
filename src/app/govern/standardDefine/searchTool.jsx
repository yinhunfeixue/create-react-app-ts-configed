import { Button, Form, Input, Select, Tooltip } from 'antd';
import { observer } from 'mobx-react';
import React from 'react';
import _ from 'underscore';
// import './style.less'

const FormItem = Form.Item
const Option = Select.Option

const fileTplMap = {
    basicsStandardNew: '01_基础数据标准模板',
    targetStandard: '02_指标数据标准模板',
    codeStandardNew: '03_标准代码项采集模板',
    standardFieldMapping: '04_标准-字段映射关系采集模板',
    standardMapping: '05_标准-指标映射关系采集模板',
    codeStandardMapping: '06_源系统代码值和标准代码值映射模板',
}
const strategyMap = {
    1: '全量',
    2: '激进全量',
    3: '增量',
}
@observer
class SearchTool extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            strategy: undefined,
            fileTpl: undefined,
            jobName: '',
        }
    }
    componentDidMount() {
        // To disabled submit button at the beginning.
    }

    //搜索按钮查询方法
    handleSubmit = () => {
        this.form.validateFields().then((values)=>{
            if (!values.fileTpl) {
                values.fileTpl = []
                values.fileTpl = values.fileTpl.concat(['codeStandardNew', 'basicsStandardNew', 'targetStandard', 'codeStandardMapping', 'codeStandardValue', 'standardMapping', 'standardFieldMapping'])
            } else {
                let x = _.clone(values.fileTpl)
                values.fileTpl = []
                values.fileTpl.push(x)
            }
            values = { ...values, keyword: values.jobName, page: 1 }
            this.props.refresh(values)
        })
    }

    handleReset = async () => {
        this.form.setFieldsValue({
            jobName: undefined,
            strategy: undefined,
            fileTpl: undefined,
        })
        this.setState({
            jobName: '',
            strategy: undefined,
            fileTpl: undefined,
        })
        this.handleSubmit()
    }
    changeStatus = async (name, e) => {
        await this.setState({
            [name]: e,
        })
        this.handleSubmit()
    }
    changeKeyword = (e) => {
        this.setState({
            jobName: e.target.value,
        })
    }

    render() {
        const { strategy, fileTpl, jobName } = this.state
        const formItemStyle = { marginBottom: 0 }

        return (
            <Form layout='horizontal' ref={(target) => (this.form = target)}>
                <div className='HControlGroup'>
                    <FormItem style={formItemStyle} label='' name='jobName'>
                        <Input.Search value={jobName} onChange={this.changeKeyword} onSearch={this.handleSubmit} placeholder='请输入任务名称' />
                    </FormItem>
                    <FormItem style={formItemStyle} name='fileTpl'>
                        <Select value={fileTpl} onChange={this.changeStatus.bind(this, 'fileTpl')} allowClear placeholder='文件模板'>
                            {_.map(fileTplMap, (item, key) => {
                                return (
                                    <Option key={key} value={key}>
                                        <Tooltip title={item}>{item}</Tooltip>
                                    </Option>
                                )
                            })}
                        </Select>
                    </FormItem>
                    <Button onClick={this.handleReset}>重置</Button>
                </div>
            </Form>
        )
    }
}

export default SearchTool
