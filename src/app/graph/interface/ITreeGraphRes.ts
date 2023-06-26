import ILinkInfo from '@/app/graph/interface/ILinkInfo'
import IReport from '@/app/graph/interface/IReport'
import ISimpleField from '@/app/graph/interface/ISimpleField'
import ITable from '@/app/graph/interface/ITable'

export default interface ITreeGraphRes {
    tableInfo: { [key: string]: ITable }
    linkWrapperPredecessors: ILinkInfo
    linkWrapperSuccessors: ILinkInfo
    fieldInfo: { [key: string]: ISimpleField }
}

export interface IReportForTableGraphRes {
    reportInfoMap: { [key: string]: IReport }
    tableReportLink: { [key: string]: (string | number)[] }
}

export interface IReportGraphRes extends IReport {
    reportLineage: {
        tableInfo: { [key: string]: ITable }
        fieldInfo: { [key: string]: ISimpleField }
        linkWrapper: ILinkInfo
    }
}
