import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Generate a 7-day IEP plan based on student data
 * @param {Object} studentData - Student information
 * @returns {Object} Generated IEP plan
 */
export const generateIEPPlan = async (studentData) => {
  try {
    const response = await api.post('/iep/generate', studentData);
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
    const response = await api.post('/memory/save', studentData);
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
    const response = await api.get(`/memory/student/${studentId}`);
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
    const response = await api.get('/memory/students');
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
    const response = await api.post(`/memory/student/${studentId}/progress`, progressData);
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
    const response = await api.post(`/iep/adapt/${studentId}`);
    return response.data.data;
  } catch (error) {
    console.error('Error generating adapted plan:', error);
    throw error;
  }
};

export default api;
