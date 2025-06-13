export const API_BASE_URL = 'http://127.0.0.1:8000';

// Helper function to get full image URL
export const getFullImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  if (imageUrl.startsWith('/media')) return `${API_BASE_URL}${imageUrl}`;
  if (imageUrl.startsWith('/')) return `${API_BASE_URL}${imageUrl}`;
  return `${API_BASE_URL}/media/${imageUrl}`;
};

// Helper function to handle API errors
export const handleApiError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    console.error('API Error:', error.response.data);
    return error.response.data.error || 'An error occurred';
  } else if (error.request) {
    // The request was made but no response was received
    console.error('API Error: No response received');
    return 'No response from server';
  } else {
    // Something happened in setting up the request
    console.error('API Error:', error.message);
    return error.message;
  }
};