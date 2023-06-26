import React from 'react'
import { Form, Button, Input, Select, Row } from 'antd'
import { fieldSearch } from 'app_api/metadataApi'

const { TextArea } = Input
const { Option } = Select
let timeout

class HorizontalLoginForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectOption: [],
            value: this.props.value || []
        }
    }

    componentDidMount() {
        this.getData({ page: 1, page_size: 50, table_id: this.props.tableId })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.tableId === this.props.tableId) { return false }
        this.getData({ page: 1, page_size: 50, table_id: nextProps.tableId })
    }

    getData = async (param) => {
        if (!param.table_id) { return }
        let res = await fieldSearch(param)
        if (res.code == 200) {
            this.setState({
                selectOption: res.data
            })
        }
    }
    onSearch = (value) => {
        if (timeout) {
            clearTimeout(timeout)
            timeout = null
        }
        currentValue = value
        timeout = setTimeout(() => this.search(value), 300)
        const { onSearch } = this.props
        onSearch && onSearch(value)
    }

    search = async (value) => {
        let res = await fieldSearch({ keywords: value, page: 1, page_size: 50, table_id: this.props.tableId })
        if (res.code == 200 && currentValue === value) {
            this.setState({
                selectOption: res.data
            })
        }
    }
  handleSubmit = (e) => {
      e.preventDefault()
      this.props.form.validateFields((err, fieldsValue) => {
          if (err) {
              return
          }
          let params = { tableId: this.props.tableId, ...fieldsValue }
          if (params.domainColumn) {
              params.domainColumn = params.domainColumn.join(',')
          }
          this.props.saveModelTable(params)
      })
  };

  handleCancel = () => {
      this.props.handleCancel()
  }
  render() {
      const { selectOption } = this.state
      const { getFieldDecorator } = this.props.form
      const formItemLayout = {
          labelCol: {
              xs: { span: 8 },
              sm: { span: 6 },
          },
          wrapperCol: {
              xs: { span: 16 },
              sm: { span: 18 },
          },
      }

      return (
          <Form onSubmit={this.handleSubmit}>
              <Form.Item {...formItemLayout} label='主体名称'>
                  {getFieldDecorator('domainName', {
                      rules: [{ required: true, message: '请输入主体名称' }]
                  })(<Input />)}
              </Form.Item>
              <Form.Item {...formItemLayout} label='主体名称字段'>
                  {getFieldDecorator('domainColumn', {
                      rules: [{ required: true, message: '请输入主体名称字段' }]
                  })(
                      <Select
                          placeholder='默认显示50条，支持搜索'
                          showSearch mode={this.props.mode || 'multiple'}
                          filterOption={false}
                          onSearch={this.onSearch}
                      >
                          {
                              selectOption.map((item) => <Option value={item['physical_field']}>{item.physical_field}{item.physical_field_desc ? `(${item.physical_field_desc})` : ''}</Option>)
                          }
                      </Select>
                  )}
              </Form.Item>
              <Form.Item {...formItemLayout} label='条件'>
                  {getFieldDecorator('filter', {
                      rules: [{ required: false, message: '请输入条件' }]
                  })(<TextArea />)}
              </Form.Item>
              <Form.Item>
                  <Row style={{ textAlign: 'center' }}>
                      <Button type='primary' htmlType='submit' style={{ marginRight: '20px' }}>
                        确定
                      </Button>
                      <Button onClick={this.handleCancel}>
                        取消
                      </Button>
                  </Row>
              </Form.Item>
          </Form>
      )
  }
}

const WrappedHorizontalLoginForm = Form.create()(HorizontalLoginForm)
export default WrappedHorizontalLoginForm
