/**
 * Centralized API Configuration
 * Pulls base URL from Vite environment variables (VITE_API_URL)
 * Fallback to default local development backend URL (http://localhost:8001)
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';

export const API_ENDPOINTS = {
    // Auth endpoints
    LOGIN: `${API_BASE_URL}/api/v1/auth/login`,
    REGISTER: `${API_BASE_URL}/api/v1/auth/register`,

    // Resume endpoints
    UPLOAD_RESUME: `${API_BASE_URL}/api/v1/resume/upload`,

    // Recommendation endpoints
    PREDICT_RECOMMEND: `${API_BASE_URL}/api/v1/recommend/predict`,

    // Dashboard endpoints
    DASHBOARD_METRICS: `${API_BASE_URL}/api/v1/dashboard/metrics`,
};

export default API_ENDPOINTS;
