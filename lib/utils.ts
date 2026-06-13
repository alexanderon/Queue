/**
 * Utility functions for Queue application
 */

/**
 * Format phone number to standard format
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  return cleaned;
};

/**
 * Generate unique booking ID
 */
export const generateBookingId = (): string => {
  return `BK${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
};

/**
 * Calculate estimated wait time based on queue position and service duration
 */
export const calculateEstimatedTime = (
  queuePosition: number,
  avgServiceTime: number,
  currentlyServing: number = 0
): number => {
  if (queuePosition <= currentlyServing) {
    return 0; // Currently being served
  }
  return (queuePosition - currentlyServing - 1) * avgServiceTime;
};

/**
 * Format time to readable format (HH:MM)
 */
export const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

/**
 * Format date to readable format (DD/MM/YYYY)
 */
export const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Check if time is within business hours
 */
export const isWithinBusinessHours = (
  time: Date,
  startTime: string,
  endTime: string
): boolean => {
  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);
  const timeHour = time.getHours();
  const timeMin = time.getMinutes();

  const startTotalMin = startHour * 60 + startMin;
  const endTotalMin = endHour * 60 + endMin;
  const timeTotalMin = timeHour * 60 + timeMin;

  return timeTotalMin >= startTotalMin && timeTotalMin <= endTotalMin;
};

/**
 * Get human readable queue position
 */
export const getQueuePositionText = (position: number): string => {
  if (position <= 0) return 'Being served';
  if (position === 1) return 'Next in queue';
  return `#${position} in queue`;
};

/**
 * Validate WhatsApp number format
 */
export const isValidWhatsAppNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^(\+\d{1,3})?\s?(\d{10}|\d{12})$/;
  return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

/**
 * Validate password strength (min 6 chars)
 */
export const isValidPassword = (password: string): boolean => {
  return password.trim().length >= 6;
};

/**
 * Validate Indian pincode (6 digits)
 */
export const isValidPincode = (pincode: string): boolean => {
  return /^\d{6}$/.test(pincode.trim());
};

/**
 * Validate booking ID format
 */
export const isValidBookingId = (id: string): boolean => {
  return /^BK[A-Z0-9]{10,20}$/i.test(id.trim());
};

/**
 * Calculate remaining time until appointment
 */
export const getRemainingTime = (appointmentTime: Date): string => {
  const now = new Date();
  const diffMs = appointmentTime.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 0) return 'Appointment time has passed';
  if (diffMins === 0) return 'Now';
  if (diffMins < 60) return `${diffMins} minutes`;
  
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return `${hours}h ${mins}m`;
};
