/**
 * API client for Queue application
 */

import { ApiResponse, BookingCreateResponse } from './types';

const API_BASE_URL =
  typeof window !== 'undefined'
    ? ''
    : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/**
 * Generic fetch wrapper with error handling
 */
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || `API Error: ${response.status}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Booking API calls
 */
export const bookingAPI = {
  create: async (bookingData: {
    shopId: string;
    shopName: string;
    serviceId: string;
    service: string;
    customerName: string;
    customerPhone: string;
    date: string;
    time: string;
    customerEmail?: string;
  }) => {
    return apiCall<BookingCreateResponse>('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  getStatus: async (bookingId: string) => {
    return apiCall(`/api/bookings/${bookingId}`, {
      method: 'GET',
    });
  },

  list: async (params?: { shopId?: string; status?: string; phone?: string; limit?: number; skip?: number }) => {
    const query = new URLSearchParams();
    if (params?.shopId) query.set('shopId', params.shopId);
    if (params?.status) query.set('status', params.status);
    if (params?.phone) query.set('phone', params.phone);
    if (params?.limit) query.set('limit', String(params.limit));
    if (params?.skip) query.set('skip', String(params.skip));
    const qs = query.toString();
    return apiCall(`/api/bookings${qs ? `?${qs}` : ''}`, { method: 'GET' });
  },
};

/**
 * Notification API calls
 */
export const notificationAPI = {
  sendWhatsApp: async (notificationData: any) => {
    return apiCall('/api/notifications/whatsapp', {
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  },
};

/**
 * Vendor API calls
 */
export const vendorAPI = {
  list: async () => {
    return apiCall<{ success: boolean; data: { id: string; shopName: string }[] }>(
      '/api/vendors',
      { method: 'GET' }
    );
  },

  create: async (data: {
    shopName: string;
    email: string;
    password: string;
    businessPhone: string;
    whatsappNumber?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
    location?: { lat: number; lng: number };
  }) => {
    return apiCall('/api/vendors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (identifier: string, password: string) => {
    return apiCall('/api/vendors/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
  },

  getServices: async (vendorId: string) => {
    return apiCall<{
      success: boolean;
      data: { id: string; name: string; estimatedTime: number; price: number }[];
    }>(`/api/vendors/${vendorId}/services`, { method: 'GET' });
  },

  getQueue: async (vendorId: string) => {
    return apiCall(`/api/vendors/${vendorId}/queue`, {
      method: 'GET',
    });
  },

  updateQueue: async (vendorId: string, queueData: any) => {
    return apiCall(`/api/vendors/${vendorId}/queue`, {
      method: 'PUT',
      body: JSON.stringify(queueData),
    });
  },

  createService: async (vendorId: string, data: { name: string; estimatedTime: number; price: number }) => {
    return apiCall(`/api/vendors/${vendorId}/services`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateService: async (vendorId: string, data: { id: string; name?: string; estimatedTime?: number; price?: number; active?: boolean }) => {
    return apiCall(`/api/vendors/${vendorId}/services`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getSettings: async (vendorId: string) => {
    return apiCall(`/api/vendors/${vendorId}/settings`, {
      method: 'GET',
    });
  },

  updateSettings: async (vendorId: string, data: any) => {
    return apiCall(`/api/vendors/${vendorId}/settings`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  getAnalytics: async (vendorId: string) => {
    return apiCall(`/api/vendors/${vendorId}/analytics`, {
      method: 'GET',
    });
  },
};

const apiClient = { bookingAPI, notificationAPI, vendorAPI };
export default apiClient;
