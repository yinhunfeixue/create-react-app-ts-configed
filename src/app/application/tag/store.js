import { observable } from 'mobx'

class Store {
    // 表格loading
    @observable tableLoading = true
    // 表格数据
    @observable tableData = []
    // 表格选择的项
    @observable selectedRows = []
    // 表格选择的项
    @observable selectedRowKeys = []

    @observable tablePagination = {
        total: '',
        page: 1,
        page_size: 10,
        paginationDisplay: 'none',
    }
}

const store = new Store()
export default store
