import { apiClient } from './client';
import { ENDPOINTS } from './urls';

export const AuthService = {
  login: async (credentials: any) => {
    // 1. Convert JSON to URL Encoded Form Data
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    // 2. Override the Content-Type header just for this request
    const response = await apiClient.post(ENDPOINTS.auth.login, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    return response.data;
  }
};

export const SystemService = {
  /**
   * Fetches the aggregated dashboard data.
   * Includes metrics, installed apps, and system logs.
   */
  getDashboardMetrics: async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.system.dashboard);
      
      // OPTIONAL: Transform the data if the backend format needs cleaning
      // before it hits your React state
      return {
        metrics: response.data.metrics,
        apps: response.data.installed_apps,
        logs: response.data.recent_logs,
        fetchedAt: new Date().toISOString()
      };
    } catch (error: any) {
      // Log the error centrally for debugging
      console.error("SystemService Error:", error.response?.data || error.message);
      
      // Re-throw so the Hook/Component can handle the UI state (e.g., set error)
      throw error;
    }
  },

  /**
   * Example of an additional admin service call 
   * to be used in the future
   */
  pingSystem: async () => {
    const response = await apiClient.get('/api/v1/system/health');
    return response.data;
  }
};

export const UserService = {
  /**
   * Fetches the list of all users.
   * Can be extended to accept pagination parameters (skip, limit).
   */
  getUserList: async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.users.list);
      return response.data;
    } catch (error: any) {
      console.error("UserService Error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Example: Fetch a specific user by ID
   */
  getUserById: async (userId: string) => {
    const response = await apiClient.get(`${ENDPOINTS.users.list}${userId}`);
    return response.data;
  },

  deleteUser: async (userId: string | number) => {
    // Sends a DELETE request to /api/v1/users/{user_id}
    const response = await apiClient.delete(`/users/${userId}`);
    return response.data;
  },

  updateUser: async (userId: string | number, payload: { 
    is_active?: boolean, 
    permissions?: Record<string, string[]> // Changed from { installed_apps: ... } to Record<string, string[]>
  }) => {
    const response = await apiClient.patch(`/users/${userId}`, payload);
    return response.data;
  },

  unlockUser: async (userId: string | number) => {
    // Sends a POST request to /api/v1/users/{user_id}/unlock
    const response = await apiClient.post(`/users/${userId}/unlock`);
    return response.data;
  }
};

export const UserRegistrationService = {

  registerUser: async (userData: { 
    username: string; 
    password: string; 
    confirm_password: string; 
    permissions: Record<string, any> 
  }) => {
    // apiClient will automatically handle the base URL and headers
    const response = await apiClient.post(ENDPOINTS.users.register, userData);
    return response.data;
  }
};


export const InstalledAppsService = {
  // ... existing methods (e.g., getDashboardMetrics)

  /**
   * Fetches the registry of installed apps and their allowed actions
   * for the permission assignment interface.
   */
  getInstalledApps: async () => {
    try {
      const response = await apiClient.get(ENDPOINTS.system.installedApps);
      return response.data.installed_apps; // Returns the dictionary of apps and actions
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
  // ... your other functions ...

  resetPassword: async (id: string | number, newPassword: string) => {
    // Make sure to add this path to your urls.ts if you are using a centralized URL dictionary
    // e.g., resetPassword: (id) => `/users/${id}/reset-password`
    
    const response = await apiClient.post(`/users/${id}/reset-password`, {
      new_password: newPassword // Adjust this key if your backend expects a different field name (e.g., 'new_password')
    });
    
    return response.data;
  }
};


