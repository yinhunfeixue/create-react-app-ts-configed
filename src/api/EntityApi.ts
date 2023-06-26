import { httpObj } from '@/api/base'
import EntityType from '@/app/dataArchitect/enum/EntityType'
import IEntity from '@/app/dataArchitect/interface/IEntity'
import ITopicField from '@/app/entity/interface/ITopicField'
import { Key } from 'react'

/**
 * EntityApi
 */
class EntityApi {
    static async requestEntityList(params: { page: number; pageSize: number; topicId?: Key; entityName?: string; type?: EntityType }) {
        const res = await httpObj.httpPost(`/quantchiAPI/entity/query/page`, params)
        return res.data
    }

    static async addEntity(data: IEntity) {
        const res = await httpObj.httpPost(`/quantchiAPI/entity/command/save`, data)
        return res.data
    }

    static async deleteEntity(entityId: Key) {
        const res = await httpObj.httpGet(`/quantchiAPI/entity/command/${entityId}`)
        return res.data
    }

    static async editEntity(data: IEntity) {
        const res = await httpObj.httpPost(`/quantchiAPI/entity/command/edit`, data)
        return res.data
    }

    static async requestTopicTree() {
        const res = await httpObj.httpGet(`/quantchiAPI/api/tree/dst`)
        return res.data
    }

    static async addTopic(data: ITopicField) {
        const res = await httpObj.httpPost(`/quantchiAPI/api/tree/dst/add`, data)
        return res.data
    }

    static async updateTopic(data: ITopicField) {
        const res = await httpObj.httpPost(`/quantchiAPI/api/tree/dst/update`, data)
        return res.data
    }

    static async deleteTopic(id: Key) {
        const res = await httpObj.httpGet(`/quantchiAPI/api/tree/dst/delete/${id}`)
        return res.data
    }
    static async relatedBusiness(data: { businessDepartmentId: Key; businessManagerId: Key; treeNodeId: Key }) {
        const res = await httpObj.httpPost(`/quantchiAPI/api/tree/dataWarehouse/payload/update`, data)
        return res.data
    }
}
export default EntityApi
