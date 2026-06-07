/**
 * API client for Queue application
 */

import { ApiResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

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

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
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
  create: async (bookingData: any) => {
    return apiCall('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },

  getStatus: async (bookingId: string) => {
    return apiCall(`/api/bookings/${bookingId}`, {
      method: 'GET',
    });
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
};

export default {
  bookingAPI,
  notificationAPI,
  vendorAPI,
};
