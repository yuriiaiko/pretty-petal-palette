// JWT utility functions
export const isTokenValid = (token: string): boolean => {
  if (!token || typeof token !== 'string') return false;
  
  try {
    // Basic JWT structure validation
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Check if token is expired (if it has an exp claim)
    let payload;
    try {
      // Use a more robust base64 decode
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      payload = JSON.parse(jsonPayload);
    } catch (decodeError) {
      // Fallback for simpler base64 decode
      try {
        payload = JSON.parse(atob(parts[1]));
      } catch (fallbackError) {
        console.error('Failed to decode JWT payload:', fallbackError);
        return false;
      }
    }
    
    // Check if payload is valid
    if (!payload || typeof payload !== 'object') {
      return false;
    }
    
    // Check expiration
    if (payload.exp && typeof payload.exp === 'number') {
      const currentTime = Date.now() / 1000;
      if (payload.exp < currentTime) {
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
};

export const decodeToken = (token: string): any | null => {
  if (!token || typeof token !== 'string') return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    let payload;
    try {
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      payload = JSON.parse(jsonPayload);
    } catch (decodeError) {
      try {
        payload = JSON.parse(atob(parts[1]));
      } catch (fallbackError) {
        console.error('Failed to decode JWT payload:', fallbackError);
        return null;
      }
    }
    
    return payload;
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
}; 