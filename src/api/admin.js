import api from "./axios";

export const getAdminDashboardSummary = () =>
    api.get("/admin/dashboard/summary");

export const getAdminRecentLogs = () =>
    api.get("/admin/dashboard/recent-logs");

export const searchAdminMembers = (params) =>
    api.get("/admin/members", { params });

export const getAdminMemberDetail = (memberId) =>
    api.get(`/admin/members/${memberId}`);

export const updateAdminMemberStatus = (memberId, body) =>
    api.patch(`/admin/members/${memberId}/status`, body);

export const adjustAdminCredit = (body) =>
    api.post("/admin/credits/adjust", body);

export const searchAdminUsageLogs = (params) =>
    api.get("/admin/usage/logs", { params });

export const getAdminDailyUsage = (date) =>
    api.get("/admin/usage/daily", { params: { date } });

export const getAdminMemberUsageSummary = (memberId) =>
    api.get(`/admin/usage/members/${memberId}/summary`);

export const getAdminServiceUsageSummary = () =>
    api.get("/admin/usage/service-summary");

export const retryAdminOperation = (body) =>
    api.post("/admin/operations/retry", body);

export const cancelAdminOperation = (body) =>
    api.post("/admin/operations/cancel", body);