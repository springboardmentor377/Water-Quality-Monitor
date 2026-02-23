/**
 * Authentication utilities
 */

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has a valid, non-expired token
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return false;
  }
  
  try {
    // Decode JWT payload (base64 decode the middle part)
    const payload = JSON.parse(atob(token.split(".")[1]));
    
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    
    if (payload.exp && payload.exp < now) {
      // Token expired, remove it
      logout();
      return false;
    }
    
    return true;
  } catch (error) {
    // Invalid token format
    console.error("Invalid token format:", error);
    logout();
    return false;
  }
};

/**
 * Get user role from token
 * @returns {string|null} User role or null if not authenticated
 */
export const getUserRole = () => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return null;
  }
  
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
};

/**
 * Get user email from token
 * @returns {string|null} User email or null if not authenticated
 */
export const getUserEmail = () => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return null;
  }
  
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub || null;
  } catch (error) {
    console.error("Error getting user email:", error);
    return null;
  }
};

/**
 * Logout user by removing tokens
 */
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};

/**
 * Check if token will expire soon (within 5 minutes)
 * @returns {boolean} True if token expires within 5 minutes
 */
export const isTokenExpiringSoon = () => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    return false;
  }
  
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Math.floor(Date.now() / 1000);
    const fiveMinutes = 5 * 60;
    
    return payload.exp && (payload.exp - now) < fiveMinutes;
  } catch (error) {
    return false;
  }
};