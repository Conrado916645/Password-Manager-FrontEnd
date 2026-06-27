// Base URL for your backend server
export const API_BASE_URL = 'http://127.0.0.1:8000/api/v1';

// Dictionary of all available API endpoints
export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refreshToken: '/auth/refresh',
  },
  users: {
    list: '/users/',
    create: '/users',
    register : '/users/register',
    details: (id: string | number) => `/users/${id}`,
    permissions: (id: string | number) => `/users/${id}/permissions`,
    delete: (id: string | number) => `/users/${id}`,
    lock: (id: string | number) => `/users/${id}/lock`,
    unlock: (id: string | number) => `/users/${id}/unlock`,
    generateAPIKey: (id: string | number) => `/users/${id}/generate-api-key`,
  },
  apps: {
    config: '/apps/config',
    list: '/apps',
  },
  system: {
    health: '/health',
    auditLogs: '/audit-logs',
    dashboard: '/system/dashboard',
    installedApps: '/system/installed-apps'
  }
} as const;