import { action, observable, runInAction } from 'mobx'
import { getUnread } from 'app_api/systemManage'
import Cache from 'app_utils/cache'

class Store {
    @observable ifMessage = false
    @observable messageNum = 0
    @action.bound opMessage () {
        runInAction(() => {
            this.ifMessage = true
        })
    }
    @action.bound async getMessageNum () {
        let userName = Cache.get('userName')
        let number = document.getElementById('messageCenter')
        let res = await getUnread({ 'userName': userName })
        if (res.code === 200) {
            this.messageNum = this.messageNum + 1
            if (res.data !== this.messageNum) {
                runInAction(() => {
                    number.innerHTML = res.data
                })
            }
        }
    }
}

const store = new Store()
export default store
