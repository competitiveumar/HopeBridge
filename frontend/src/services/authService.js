import api from './api';

// Regular email/password authentication
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login/', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Login failed');
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register/', userData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Registration failed');
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Social authentication
export const socialAuth = async (provider, token, userData) => {
  try {
    console.log('Social auth data:', { provider, token, userData });
    
    // Prepare data for backend
    const authData = {
      provider,
      token,
      email: userData.email,
      first_name: userData.displayName ? userData.displayName.split(' ')[0] : '',
      last_name: userData.displayName ? userData.displayName.split(' ').slice(1).join(' ') : '',
      photo_url: userData.photoURL || '',
      uid: userData.uid
    };
    
    // Use the social-auth endpoint
    const response = await api.post('/users/social-auth/', authData);
    
    if (response.data.access) {
      // Store tokens and user data
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      console.log('Social auth successful:', response.data);
    }
    
    return response.data;
  } catch (error) {
    console.error('Social auth error:', error.response || error);
    throw error.response ? error.response.data : new Error('Social authentication failed');
  }
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
}; 