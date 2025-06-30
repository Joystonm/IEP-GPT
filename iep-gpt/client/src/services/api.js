import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 120000, // 2 minute timeout
});

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    
    // Create a more user-friendly error message
    let errorMessage = 'An unexpected error occurred. Please try again.';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else {
        errorMessage = `Server error: ${error.response.status}`;
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server. Please check your connection.';
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message;
    }
    
    // Create a new error with the friendly message
    const enhancedError = new Error(errorMessage);
    enhancedError.originalError = error;
    
    return Promise.reject(enhancedError);
  }
);

/**
 * Generate a 7-day IEP plan based on student data
 * @param {Object} studentData - Student information
 * @returns {Object} Generated IEP plan
 */
export const generateIEPPlan = async (studentData) => {
  try {
    console.log('Generating IEP plan for:', studentData.name);
    const response = await api.post('/iep/generate', studentData);
    console.log('IEP plan generated successfully');
    return response.data.data;
  } catch (error) {
    console.error('Error generating IEP plan:', error);
    throw error;
  }
};

/**
 * Get educational resources for a student based on their needs
 * @param {string} studentId - Student ID
 * @param {string} needs - Description of student needs
 * @returns {Array} List of resources
 */
export const getResourcesForStudent = async (studentId, needs) => {
  try {
    const response = await api.get(`/tavily/resources/${studentId}`, {
      params: { needs }
    });
    return response.data.data;
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
};

/**
 * Get teaching strategies for a specific learning challenge
 * @param {string} challenge - Learning challenge description
 * @returns {Array} List of teaching strategies
 */
export const getTeachingStrategies = async (challenge) => {
  try {
    const response = await api.get(`/tavily/strategies/${encodeURIComponent(challenge)}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching teaching strategies:', error);
    throw error;
  }
};

/**
 * Save student profile and IEP plan
 * @param {Object} studentData - Student profile data
 * @returns {Object} Saved student profile
 */
export const saveStudentProfile = async (studentData) => {
  try {
    console.log('Saving student profile:', studentData.name);
    const response = await api.post('/memory/save', studentData);
    console.log('Student profile saved successfully');
    return response.data.data;
  } catch (error) {
    console.error('Error saving student profile:', error);
    throw error;
  }
};

/**
 * Get a specific student profile
 * @param {string} studentId - Student ID
 * @returns {Object} Student profile
 */
export const getStudentProfile = async (studentId) => {
  try {
    console.log('Fetching student profile:', studentId);
    const response = await api.get(`/memory/student/${studentId}`);
    console.log('Student profile fetched successfully');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching student profile:', error);
    throw error;
  }
};

/**
 * Get all student profiles
 * @returns {Array} List of student profiles
 */
export const getStudentProfiles = async () => {
  try {
    console.log('Fetching all student profiles');
    const response = await api.get('/memory/students');
    console.log('Student profiles fetched successfully');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching student profiles:', error);
    throw error;
  }
};

/**
 * Update student progress
 * @param {string} studentId - Student ID
 * @param {Object} progressData - Progress data
 * @returns {Object} Updated student profile
 */
export const updateStudentProgress = async (studentId, progressData) => {
  try {
    console.log('Updating student progress:', studentId);
    const response = await api.post(`/memory/student/${studentId}/progress`, progressData);
    console.log('Student progress updated successfully');
    return response.data.data;
  } catch (error) {
    console.error('Error updating student progress:', error);
    throw error;
  }
};

/**
 * Generate an adapted learning plan based on progress
 * @param {string} studentId - Student ID
 * @returns {Object} Adapted IEP plan
 */
export const generateAdaptedPlan = async (studentId) => {
  try {
    console.log('Generating adapted plan for:', studentId);
    const response = await api.post(`/iep/adapt/${studentId}`);
    console.log('Adapted plan generated successfully');
    return response.data.data;
  } catch (error) {
    console.error('Error generating adapted plan:', error);
    throw error;
  }
};

export default api;
/**
 * Delete a student profile
 * @param {string} studentId - Student ID
 * @returns {Object} Response data
 */
export const deleteStudentProfile = async (studentId) => {
  try {
    console.log('Deleting student profile:', studentId);
    const response = await api.delete(`/memory/student/${studentId}`);
    console.log('Student profile deleted successfully');
    return response.data;
  } catch (error) {
    console.error('Error deleting student profile:', error);
    throw error;
  }
};
