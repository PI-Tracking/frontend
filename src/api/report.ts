import { Report } from "@Types/Report";
import apiClient from "./api";
import { AxiosResponse } from "axios";
import { NewReportDTO } from "@Types/NewReportDTO";
import { UUID } from "@Types/Base";
import { ReportResponseDTO } from "@Types/ReportResponseDTO";
import { ApiError } from "./ApiError";
import { ReportAnalysisResponseDTO } from "@Types/ReportAnalysisResponseDTO";

const baseEndpoint = "/reports";

async function getAllReports(): Promise<AxiosResponse<Report[] | ApiError>> {
  /**
   * GET /reports
   * Return:
   *    SUCCESS
   *     { data: Report[]; status: OK }
   *
   *    FAILURE
   *     status: BAD_REQUEST | UNAUTHORIZED | FORBIDDEN
   */
  const endpoint = baseEndpoint;
  return apiClient.get(endpoint);
}

async function createNewReport(
  report: NewReportDTO
): Promise<AxiosResponse<ReportResponseDTO | ApiError>> {
  /**
   * POST /reports
   * Return:
   *    SUCCESS
   *     { status: OK }
   *
   *    FAILURE
   *     status: BAD_REQUEST | UNAUTHORIZED | FORBIDDEN
   */
  const endpoint = baseEndpoint;
  return apiClient.post(endpoint, report);
}
async function getReport(
  report_id: UUID
): Promise<AxiosResponse<ReportResponseDTO | ApiError>> {
  /**
   * GET /reports/{report_id}
   * Return:
   *    SUCCESS
   *     { data: Report, status: OK }
   *
   *    FAILURE
   *     status: BAD_REQUEST | UNAUTHORIZED | FORBIDDEN
   */
  const endpoint = `${baseEndpoint}/${report_id}`;
  return apiClient.get(endpoint);
}

async function getAnalysisByReportId(
  report_id: UUID
): Promise<AxiosResponse<ReportAnalysisResponseDTO>> {
  /**
   * GET /reports/{report_id}/analysis
   * Return:
   *    SUCCESS
   *     { data: AnalysisList, status: OK }
   *
   *    FAILURE
   *     status: BAD_REQUEST | UNAUTHORIZED | FORBIDDEN
   */
  const endpoint = `${baseEndpoint}/${report_id}/analysis`;
  return apiClient.get(endpoint);
}

export { getAllReports, createNewReport, getReport, getAnalysisByReportId };
