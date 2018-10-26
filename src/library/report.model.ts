import {ReportRecord} from "./report-record.model";
export interface Report {
  name: string;
  slug_id: string;
  records: ReportRecord[];
}
