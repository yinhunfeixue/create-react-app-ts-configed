import React, {Component} from 'react';
import {Pagination} from 'antd';


export default class GeneralPagination extends Component {

  constructor(props) {
    super(props);
    this.pageSizeOptions = this.props.paginationProps.pageSizeOptions || ['10', '20', '30', '40', '50']
  }

  // 展示多少页
  showTotal = (total)=> {
    const totalPageNum = Math.ceil(total / this.props.paginationProps.pagination.page_size);
    return `共${totalPageNum}页，${total}条数据`;
  }
  // 页码改变
  changePagination = async (page)=> {
    const param = {page}
    this.props.paginationProps.getTableData(param)
  }
  // 一页显示尺寸改变
  onShowSizeChange =  (current, page_size)=> {
    const param = {current,page_size}
    this.props.paginationProps.getTableData(param);
  }

  render() {
    const { pagination , ...restProps} = this.props.paginationProps
    return (
      <Pagination
        style = {{
          float: "right",
          marginTop: 30,
          display:pagination.paginationDisplay
        }}
        {...restProps}
        total={pagination.total}
        pageSize={pagination.page_size}
        current={pagination.page}
        onChange={this.changePagination}
        onShowSizeChange={this.onShowSizeChange}
        pageSizeOptions={this.pageSizeOptions}
        showTotal={this.showTotal}
      />
    );
  }
}
