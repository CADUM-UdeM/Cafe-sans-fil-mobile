import AsyncStorage from '@react-native-async-storage/async-storage';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const STAYING_KEY = 'access_token';
const REFRESHING_KEY = 'refresh_token';


export const displayTokens = async () => {
  try {
    const accessToken = await AsyncStorage.getItem(STAYING_KEY);
    const refreshToken = await AsyncStorage.getItem(REFRESHING_KEY);
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);
  } catch (error) {
    console.error('Error displaying tokens:', error);
  }
}

// Store access token
export const setToken = async (token: string) => {
    console.log('Storing token:', token);
  try {
    await AsyncStorage.setItem(STAYING_KEY, token);
  } catch (error) {
    console.error('Error storing token:', error);
    throw error;
  }
};

// Store refresh token
export const setRefreshToken = async (refreshToken: string) => {
  try {
    await AsyncStorage.setItem(REFRESHING_KEY, refreshToken);
  } catch (error) {
    console.error('Error storing refresh token:', error);
    throw error;
  }
};

export const updateToken = async (refreshToken: string) => {
  try {
    const response = await fetch('https://cafesansfil-api-r0kj.onrender.com/api/auth/refresh', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(refreshToken)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Assuming the API returns a new access token
    if (data.access_token || data.accessToken || data.token) {
      const newToken = data.access_token || data.accessToken || data.token;
      await setToken(newToken);
      return newToken;
    }
    
    throw new Error('No access token received from refresh endpoint');
  } catch (error) {
    console.error('Error updating token:', error);
    throw error;
  }
};

export const getInfoFromToken = async (token: string) => {
  try {
    const response = await fetch('https://cafesansfil-api-r0kj.onrender.com/api/users/@me', {
      method: 'GET',
      headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const userInfo = await response.json();
    return userInfo;
    } catch (error) {
    return false
    throw error;
    
    }
}


export const deleteAccount = async (token: string) => {
  const userInfo = await getInfoFromToken(token);
  if (!userInfo) {
    console.error('Failed to get user info');
    alert("Error deleting account, please try again later");
    return false;
  }

  const id = userInfo.id;
  try{
    const response = await fetch(`https://cafesansfil-api-r0kj.onrender.com/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    console.log("Response from delete account: ", response);
    
    if (response.ok) {
      console.log("Account deleted successfully");
      await clearTokens();
      return true;
    } else {
      console.error(`Delete failed with status: ${response.status}`);
      const errorText = await response.text();
      console.error('Error response:', errorText);
      alert("Error deleting account, please try again later");
      return false;
    }
  }
  catch (error) {
    alert("Error deleting account, please try again later");
    console.error('Error deleting account:', error);
    return false;
  }
}





// Get access token
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(STAYING_KEY);
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

// Get refresh token
export const getRefreshToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem(REFRESHING_KEY);
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
      AsyncStorage.setItem(STAYING_KEY, accessToken),
      AsyncStorage.setItem(REFRESHING_KEY, refreshToken)
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
      AsyncStorage.getItem(STAYING_KEY),
      AsyncStorage.getItem(REFRESHING_KEY)
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
    await AsyncStorage.removeItem(STAYING_KEY);
  } catch (error) {
    console.error('Error removing token:', error);
    throw error;
  }
};

// Remove refresh token
export const removeRefreshToken = async () => {
  try {
    await AsyncStorage.removeItem(REFRESHING_KEY);
  } catch (error) {
    console.error('Error removing refresh token:', error);
    throw error;
  }
};

// Clear all tokens (logout)
export const clearTokens = async () => {
  try {
    await Promise.all([
      AsyncStorage.removeItem(STAYING_KEY),
      AsyncStorage.removeItem(REFRESHING_KEY)
    ]);
  } catch (error) {
    console.error('Error clearing tokens:', error);
    throw error;
  }
};



// Check if user is authenticated
export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem(STAYING_KEY);
    return token !== null;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};