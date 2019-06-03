import React, { Component } from 'react';
import ISearchTableProps from './Interfaces/ISearchTableProps';
import { Table, message } from 'antd';
import Axios from 'axios';

interface ISearchTableState {
  current: number;
  selectedRows?: any[],
  selectedRowKeys?: string[] | number[];
  total: number;
  dataSource: any[];
  loading: boolean;
}

const DEFAULT_PAGE_SIZE = 20;

class SearchTable extends Component<ISearchTableProps, ISearchTableState>{
  static defaultProps = {
    pageSize: 20,
    rowKey: 'id',
    requestErrorHandler: (error: any) => {
      let msg = '未知错误';
      if (error) {
        if (error.toString) {
          msg = error.toString();
        }
        else {
          msg = error;
        }
      }
      message.error(msg);
    }
  };

  componentDidMount() {
    this.requestData();
  }

  componentDidUpdate(prevProps: ISearchTableProps) {
    if (this.props.pageSize !== prevProps.pageSize) {
      this.requestData();
    }
  }

  constructor(props: ISearchTableProps) {
    super(props);
    this.state = {
      current: 1,
      total: 0,
      dataSource: [],
      loading: false,
      selectedRowKeys: [],
      selectedRows: [],
    };
  }

  public refresh() {
    this.requestData();
  }

  public reset() {
    this.setState({ current: 1 }, () => this.requestData());
  }

  private requestData() {
    if (this.props.createSearchRequest) {
      this.setState({ loading: true });
      const requestData = this.props.createSearchRequest(this.state.current, this.props.pageSize || DEFAULT_PAGE_SIZE, this.props.searchParams);
      Axios.request(requestData)
        .then((response) => {
          if (this.props.parseResponse) {
            const { total, dataSource } = this.props.parseResponse(response);
            this.setState({ total, dataSource });
          }
          this.setState({ loading: false });
        })
        .catch((error) => {
          this.setState({ loading: false });
          if (this.props.requestErrorHandler) {
            this.props.requestErrorHandler(error);
          }
        });
    }
  }

  render() {
    const tableProps: { [key: string]: any } = {};
    if (this.props.selectEnable) {
      tableProps.rowSelection = {
        onChange: (selectedRowKeys: string[] | number[], selectedRows: any[]) => {
          this.setState({ selectedRowKeys, selectedRows });
          if (this.props.onSelectedChange) {
            this.props.onSelectedChange(selectedRowKeys, selectedRows);
          }
        },
      }
    }
    return (
      <Table
        rowKey={this.props.rowKey}
        columns={this.props.columns}
        dataSource={this.state.dataSource}
        loading={this.state.loading}
        pagination={{
          total: this.state.total,
          onChange: (current: number) => {
            this.setState({ current }, () => this.requestData());
          },
          current: this.state.current,
          pageSize: this.props.pageSize,
        }}
        {...tableProps}
        {...this.props.tableProps}
      />
    );
  }
}

export default SearchTable;