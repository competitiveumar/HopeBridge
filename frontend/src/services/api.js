import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('authToken');
    
    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 errors (unauthorized)
    if (error.response && error.response.status === 401) {
      console.log('Unauthorized request - token may be invalid or expired');
      // You can redirect to login or refresh token here if needed
    }
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

// Donation API services
export const donationService = {
  // Create a payment intent
  createPaymentIntent: (paymentData) => {
    return api.post('/donations/create-payment-intent/', paymentData);
  },
  
  // Update project donation total
  updateProjectTotal: (projectId, amount) => {
    return api.post('/donations/update-project-total/', { 
      projectId,
      amount
    });
  },
  
  // Get project donations
  getProjectDonations: (projectId) => {
    return api.get(`/donations/projects/${projectId}/donations/`);
  },
  
  // Get all user donations
  getUserDonations: () => {
    return api.get('/donations/user/');
  },
  
  // Record a new donation
  recordDonation: (donationData) => {
    return api.post('/donations/record/', donationData);
  },
  
  // Get donation statistics
  getStatistics: () => {
    return api.get('/donations/statistics/');
  }
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