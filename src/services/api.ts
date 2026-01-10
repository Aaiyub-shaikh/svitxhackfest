// API client for backend authentication
// Replaces Supabase client calls

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ApiError {
  message: string;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

// Helper function to make API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    // Check if response has content before parsing JSON
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // If not JSON, return error
      return {
        data: null,
        error: { message: 'Invalid response from server' }
      };
    }

    if (!response.ok) {
      return {
        data: null,
        error: data.error || { message: 'An error occurred' }
      };
    }

    return {
      data: data.data || data,
      error: null
    };
  } catch (error) {
    console.error('API request error:', error);
    
    // Provide more helpful error messages
    let errorMessage = 'Network error. Please check your connection.';
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      // Fetch failed - likely backend not running or wrong URL
      errorMessage = `Cannot connect to backend server at ${API_BASE_URL}. Please ensure the backend is running on port 3001.`;
    } else if (error instanceof Error) {
      errorMessage = `Connection error: ${error.message}`;
    }
    
    return {
      data: null,
      error: { message: errorMessage }
    };
  }
}

// Auth API functions
export const authApi = {
  signUp: async (
    email: string,
    password: string,
    userType: 'farmer' | 'buyer',
    profileData: any
  ) => {
    const response = await apiRequest<{
      user: any;
      session: any;
    }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, userType, profileData }),
    });

    if (response.data?.session?.access_token) {
      localStorage.setItem('auth_token', response.data.session.access_token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
    }

    return response;
  },

  signIn: async (email: string, password: string) => {
    const response = await apiRequest<{
      user: any;
      session: any;
    }>('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.data?.session?.access_token) {
      localStorage.setItem('auth_token', response.data.session.access_token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
    }

    return response;
  },

  signOut: async () => {
    const response = await apiRequest('/auth/signout', {
      method: 'POST',
    });

    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');

    return response;
  },

  getSession: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return {
        data: { session: null },
        error: null
      };
    }

    const response = await apiRequest<{
      session: any;
    }>('/auth/session', {
      method: 'GET',
    });

    // If session is invalid, clear storage
    if (response.error) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      return {
        data: { session: null },
        error: null
      };
    }

    if (response.data?.session?.user) {
      localStorage.setItem('user_data', JSON.stringify(response.data.session.user));
    }

    return response;
  },
};

// Buyer needs API
export const buyerNeedsApi = {
  create: async (payload: any) => {
    return await apiRequest<any>('/buyer-needs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getAll: async () => {
    return await apiRequest<any>('/buyer-needs', { method: 'GET' });
  },

  getMine: async () => {
    return await apiRequest<any>('/buyer-needs/mine', { method: 'GET' });
  }
};

// Assistant API
export const assistantApi = {
  chat: async (payload: { message: string; language: string; user_role: 'farmer' | 'buyer'; needs_translation?: boolean; original_text?: string }) => {
    return await apiRequest<any>('/assistant/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }
};
