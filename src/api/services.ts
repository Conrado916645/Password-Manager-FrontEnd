import { apiClient } from './client';
import { ENDPOINTS } from './urls';

export const AuthService = {
  login: async (credentials: any) => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await apiClient.post(ENDPOINTS.auth.login, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    
    return response.data;
  },
  // Inside your AuthService
verifyMfa: async (payload: { mfa_token: string; code: string }) => {
  const response = await apiClient.post(ENDPOINTS.auth.mfaVerify, payload);
  console.log(payload)
  if (response.data.access_token) {
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
  }
  
  return response.data;
}
};

export const SystemService = {
  getUserList: async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.users.list);
      return response.data;
    } catch (error: any) {
      console.error("UserService Error:", error.response?.data || error.message);
      throw error;
    }
  },
  getDashboardMetrics: async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.system.dashboard);
      
      return {
        metrics: response.data.metrics,
        apps: response.data.installed_apps,
        logs: response.data.recent_logs,
        fetchedAt: new Date().toISOString()
      };
    } catch (error: any) {
      console.error("SystemService Error:", error.response?.data || error.message);
      throw error;
    }
  },
  pingSystem: async () => {
    const response = await apiClient.get('/api/v1/system/health');
    return response.data;
  },
  getUserById: async (userId: string) => {
    const response = await apiClient.get(`${ENDPOINTS.users.list}${userId}`);
    return response.data;
  },
  deleteUser: async (userId: string | number) => {
    const response = await apiClient.delete(`/system/users/${userId}`);
    return response.data;
  },
  updateUser: async (userId: string | number, payload: { 
    is_active?: boolean, 
    permissions?: Record<string, string[]> 
  }) => {
    const response = await apiClient.patch(`/system/users/${userId}`, payload);
    return response.data;
  },
  unlockUser: async (userId: string | number) => {
    const response = await apiClient.post(`/system/users/${userId}/unlock`);
    return response.data;
  }
};

export const UserService = {
  getKey2FA: async () => {
    const reponse = await apiClient.get(ENDPOINTS.users.mfa);
    return reponse.data
  },
  getMe: async () => {
    const response = await apiClient.get(ENDPOINTS.users.me);
    return response.data;
  },

  setupMfa: async () => {
    const response = await apiClient.post('/users/me/mfa/setup');
    return response.data;
  },
  
  verifyMfaSetup: async (code: string) => {
    const response = await apiClient.post(ENDPOINTS.users.mfaVerify, { code });
    return response.data;
  },

  disableMFA: async(password: string ) =>{
        const response = await apiClient.post(ENDPOINTS.users.mfaDisable, { password });
    return response.data;
  },

  updateProfile: async (payload: {
    email: string;
    full_name: string;
    date_of_birth: string;
    phone_number: string;
  }) => {
    const response = await apiClient.patch(ENDPOINTS.users.me, payload);
    return response.data;
  },
};

export const UserRegistrationService = {
  registerUser: async (userData: { 
    username: string; 
    password: string; 
    confirm_password: string; 
    permissions: Record<string, any> 
  }) => {
    const response = await apiClient.post(ENDPOINTS.users.register, userData);
    return response.data;
  }
};

export const InstalledAppsService = {
  getInstalledApps: async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.system.installedApps);
      return response.data.installed_apps; 
    } catch (error: any) {
      console.error("System Registry Error:", error.response?.data || error.message);
      throw error;
    }
  }
};

export const GenerateApiKeyService = {
  generateApiKey: async (id: string | number) => {
    const response = await apiClient.post(ENDPOINTS.users.generateAPIKey(id));
    return response.data;
  }
};

export const ChangePasswordService = {
  resetPassword: async (id: string | number, newPassword: string) => {
    const response = await apiClient.post(`/system/users/${id}/reset-password`, {
      new_password: newPassword 
    });
    return response.data;
  }
};