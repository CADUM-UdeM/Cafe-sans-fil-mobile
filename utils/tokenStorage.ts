import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// Store access token
export const setToken = async (token: string) => {
    console.log('Storing token:', token);
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error storing token:', error);
    throw error;
  }
};

// Store refresh token
export const setRefreshToken = async (refreshToken: string) => {
  try {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch (error) {
    console.error('Error storing refresh token:', error);
    throw error;
  }
};

// Get access token
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

// Get refresh token
export const getRefreshToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    return refreshToken;
  } catch (error) {
    console.error('Error retrieving refresh token:', error);
    return null;
  }
};

// Store both tokens at once
export const setTokens = async (accessToken: string, refreshToken: string) => {
  try {
    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEY, accessToken),
      AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    ]);
  } catch (error) {
    console.error('Error storing tokens:', error);
    throw error;
  }
};

// Get both tokens at once
export const getTokens = async () => {
  try {
    const [accessToken, refreshToken] = await Promise.all([
      AsyncStorage.getItem(TOKEN_KEY),
      AsyncStorage.getItem(REFRESH_TOKEN_KEY)
    ]);
    return {
      accessToken,
      refreshToken
    };
  } catch (error) {
    console.error('Error retrieving tokens:', error);
    return {
      accessToken: null,
      refreshToken: null
    };
  }
};

// Remove access token
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
    throw error;
  }
};

// Remove refresh token
export const removeRefreshToken = async () => {
  try {
    await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch (error) {
    console.error('Error removing refresh token:', error);
    throw error;
  }
};

// Clear all tokens (logout)
export const clearTokens = async () => {
  try {
    await Promise.all([
      AsyncStorage.removeItem(TOKEN_KEY),
      AsyncStorage.removeItem(REFRESH_TOKEN_KEY)
    ]);
  } catch (error) {
    console.error('Error clearing tokens:', error);
    throw error;
  }
};



// Check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem(TOKEN_KEY);
    return token !== null;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};