export interface StatusNotificationData {
    type: 'success' | 'error',
    message?: string,
    errors?: Record<string, string[]>;
}