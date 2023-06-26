import ITable from "@/app/graph/interface/ITable";

/**
* IReport
*/
export default interface IReport extends ITable{
  belongSystem: string;
  reportCatalog: string;
  reportId: string;
  reportName: string;
  reportLevel: string;
  technologyManager: string;
}