import api from "./axios";

export const getOpsDashboardSummary = () =>
    api.get("/ops/dashboard/summary");

export const getOpsAlerts = (params) =>
    api.get("/ops/alerts", { params });

export const getOpsQueueSummary = () =>
    api.get("/ops/queue/summary");

export const getOpsQueueHourly = (params) =>
    api.get("/ops/queue/hourly", { params });

export const getOpsIssues = (params) =>
    api.get("/admin/issues", { params });

export const getOpsIssueDetail = (issueId) =>
    api.get(`/admin/issues/${issueId}`);

export const getOpsIssueLogs = (issueId, params) =>
    api.get(`/admin/issues/${issueId}/logs`, { params });

export const getOpsLogDetail = (logId) =>
    api.get(`/admin/logs/${logId}`);

export const updateOpsIssueStatus = (issueId, status) =>
    api.patch(`/admin/error-issues/${issueId}/status`, { status });