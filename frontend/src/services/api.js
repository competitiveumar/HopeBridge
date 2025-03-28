import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for handling cookies if needed
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 (Unauthorized) and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          // No refresh token available, user needs to login again
          return Promise.reject(error);
        }
        
        // Try to refresh the token
        const response = await axios.post(
          process.env.NODE_ENV === 'production' 
            ? '/api/users/token/refresh/' 
            : 'http://localhost:8000/api/users/token/refresh/', 
          {
            refresh: refreshToken
          }
        );
        
        const { access } = response.data;
        
        // Update the access token in localStorage
        localStorage.setItem('accessToken', access);
        
        // Update the Authorization header for the original request
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        // Retry the original request with the new token
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear tokens and reject the promise
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        console.error('Token refresh failed:', refreshError);
        return Promise.reject(error);
      }
    }
    
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Application form API services
export const applicationService = {
  // Get all focus areas
  getFocusAreas: () => {
    return api.get('/applications/focus-areas/');
  },
  
  // Get all organization types
  getOrganizationTypes: () => {
    return api.get('/applications/organization-types/');
  },
  
  // Submit application form
  submitApplication: (applicationData) => {
    return api.post('/applications/applications/', applicationData);
  },
  
  // Get user's applications (requires authentication)
  getUserApplications: () => {
    return api.get('/applications/applications/');
  },
  
  // Get application details (requires authentication)
  getApplicationDetails: (id) => {
    return api.get(`/applications/applications/${id}/`);
  },
  
  // Upload document for an application (requires authentication)
  uploadDocument: (applicationId, documentData) => {
    const formData = new FormData();
    formData.append('application', applicationId);
    formData.append('document_type', documentData.documentType);
    formData.append('file', documentData.file);
    formData.append('description', documentData.description || '');
    
    return api.post('/applications/documents/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Nonprofits API services
export const nonprofitsService = {
  // Get all nonprofits
  getAllNonprofits: (params = {}) => {
    return api.get('/nonprofits/', { params });
  },
  
  // Get nonprofit details by ID
  getNonprofitDetails: (id) => {
    return api.get(`/nonprofits/${id}/`);
  },
  
  // Get nonprofit projects
  getNonprofitProjects: (nonprofitId) => {
    return api.get(`/nonprofits/${nonprofitId}/projects/`);
  },
  
  // Get nonprofit testimonials
  getNonprofitTestimonials: () => {
    return api.get('/nonprofits/testimonials/');
  },
  
  // Submit nonprofit survey
  submitSurvey: (surveyData) => {
    return api.post('/nonprofits/surveys/', surveyData);
  },
  
  // Get nonprofit resources
  getResources: () => {
    return api.get('/nonprofits/resources/');
  },
};

// Gift Cards API services
export const giftCardService = {
  // Get all gift card designs
  getDesigns: () => {
    return api.get('/gift-cards/designs/');
  },
  
  // Purchase a gift card
  purchaseGiftCard: (giftCardData) => {
    return api.post('/gift-cards/cards/', giftCardData);
  },
  
  // Validate a gift card code
  validateCode: (code) => {
    return api.post('/gift-cards/cards/validate/', { code });
  },
  
  // Get user's gift cards
  getUserGiftCards: () => {
    return api.get('/gift-cards/cards/user/');
  },
  
  // Get gift cards redeemed by the user
  getRedeemedGiftCards: () => {
    return api.get('/gift-cards/cards/redeemed/');
  },
  
  // Redeem a gift card
  redeemGiftCard: (redemptionData) => {
    return api.post('/gift-cards/redemptions/', redemptionData);
  },
};

// User API services
export const userService = {
  // Get user profile data
  getProfile: () => {
    return api.get('/users/profile/');
  },
  
  // Update user profile
  updateProfile: (profileData) => {
    return api.patch('/users/profile/', profileData);
  },
  
  // Change user password
  changePassword: (passwordData) => {
    return api.put('/users/change-password/', passwordData);
  },
  
  // Update notification settings
  updateNotificationSettings: (notificationData) => {
    return api.patch('/users/notification-settings/', notificationData);
  },
  
  // Get user account details including profile
  getUserDetails: () => {
    return api.get('/users/me/');
  },
  
  // Upload profile image
  uploadProfileImage: (imageFile) => {
    const formData = new FormData();
    formData.append('profile_image', imageFile);
    
    return api.patch('/users/profile/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api; 