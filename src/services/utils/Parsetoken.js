// Add this utility to parse the JWT token and extract the user ID
// Place this in: src/services/utils/parseToken.js

/**
 * Parses a JWT token and returns its payload as an object.
 * Used to extract user ID (sub / NameIdentifier) from the token.
 */
export const parseToken = (token) => {
  try {
    const base64Payload = token.split(".")[1];
    const payload = JSON.parse(atob(base64Payload));
    return payload;
  } catch {
    return {};
  }
};

/**
 * Extracts the user ID from a JWT token.
 * ASP.NET Identity stores it under:
 * "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
 * or just "sub"
 */
export const getUserIdFromToken = (token) => {
  const payload = parseToken(token);
  return (
    payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
    payload["sub"] ||
    null
  );
};