import { observable } from 'mobx';
import { NotificationWrap } from 'app_common'

class Store {
    @observable modelId = ''
    @observable tableId = ''
    @observable businessId = ''
    @observable visible = false
    @observable tableEname = ''
    @observable tableCname = ''
    @observable getTableData
    @observable metaIndexStatus = 0
    @observable indexStatus = 0
    @observable latestMetaIndexTime
    @observable latestIndexTime
    @observable param
    @observable status
}

// const store = new Store();
export default Store
