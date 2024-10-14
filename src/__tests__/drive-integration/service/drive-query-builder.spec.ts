import { DriveQuery } from "../../../drive-integration/service/drive-query-builder";

const payrollReportQuery = new DriveQuery();

payrollReportQuery
.addName('PayrollReport')
.and().is().equalTo()
.addMimeType('application/pdf');