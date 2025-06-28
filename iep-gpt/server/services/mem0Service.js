const axios = require('axios');

/**
 * Service for interacting with Mem0 API to store and retrieve student profiles
 */
class Mem0Service {
  constructor() {
    this.apiKey = process.env.MEM0_API_KEY;
    this.apiUrl = 'https://api.mem0.ai/v1';
    this.collectionId = process.env.MEM0_COLLECTION_ID;
  }

  /**
   * Save student profile to Mem0
   * @param {Object} studentData - Student profile data
   * @returns {Object} Saved student profile with ID
   */
  async saveStudentProfile(studentData) {
    try {
      // Add timestamp to student data
      const dataToSave = {
        ...studentData,
        createdAt: new Date().toISOString()
      };
      
      // Call Mem0 API to store the data
      const response = await axios.post(
        `${this.apiUrl}/collections/${this.collectionId}/documents`,
        {
          content: JSON.stringify(dataToSave),
          metadata: {
            studentName: studentData.name,
            studentAge: studentData.age,
            studentGrade: studentData.grade,
            diagnosis: studentData.diagnosis
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Return the saved data with the document ID
      return {
        ...dataToSave,
        id: response.data.id
      };
    } catch (error) {
      console.error('Error saving to Mem0:', error);
      throw new Error('Failed to save student profile');
    }
  }
  
  /**
   * Retrieve student profile from Mem0
   * @param {string} studentId - ID of the student profile to retrieve
   * @returns {Object} Student profile data
   */
  async getStudentProfile(studentId) {
    try {
      // Call Mem0 API to retrieve the document
      const response = await axios.get(
        `${this.apiUrl}/documents/${studentId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      
      // Parse the content from the document
      const studentData = JSON.parse(response.data.content);
      
      return {
        ...studentData,
        id: response.data.id
      };
    } catch (error) {
      console.error('Error retrieving from Mem0:', error);
      throw new Error('Failed to retrieve student profile');
    }
  }
  
  /**
   * Update an existing student profile
   * @param {string} studentId - ID of the student profile to update
   * @param {Object} updatedData - Updated student data
   * @returns {Object} Updated student profile
   */
  async updateStudentProfile(studentId, updatedData) {
    try {
      // Add updated timestamp
      const dataToSave = {
        ...updatedData,
        updatedAt: new Date().toISOString()
      };
      
      // Call Mem0 API to update the document
      const response = await axios.put(
        `${this.apiUrl}/documents/${studentId}`,
        {
          content: JSON.stringify(dataToSave),
          metadata: {
            studentName: updatedData.name,
            studentAge: updatedData.age,
            studentGrade: updatedData.grade,
            diagnosis: updatedData.diagnosis,
            lastUpdated: new Date().toISOString()
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Return the updated data
      return {
        ...dataToSave,
        id: studentId
      };
    } catch (error) {
      console.error('Error updating in Mem0:', error);
      throw new Error('Failed to update student profile');
    }
  }
  
  /**
   * Get all student profiles
   * @returns {Array} List of student profiles
   */
  async getAllStudentProfiles() {
    try {
      // Call Mem0 API to list all documents in the collection
      const response = await axios.get(
        `${this.apiUrl}/collections/${this.collectionId}/documents`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      
      // Parse and return the profiles
      return response.data.documents.map(doc => {
        const content = JSON.parse(doc.content);
        return {
          id: doc.id,
          name: content.name,
          age: content.age,
          grade: content.grade,
          diagnosis: content.diagnosis,
          createdAt: content.createdAt,
          updatedAt: content.updatedAt
        };
      });
    } catch (error) {
      console.error('Error listing documents in Mem0:', error);
      throw new Error('Failed to retrieve student profiles');
    }
  }
  
  /**
   * Search for student profiles by name
   * @param {string} name - Student name to search for
   * @returns {Array} Matching student profiles
   */
  async searchStudentsByName(name) {
    try {
      // Call Mem0 API to search for documents
      const response = await axios.post(
        `${this.apiUrl}/collections/${this.collectionId}/search`,
        {
          query: name,
          filter: {
            metadata: {
              studentName: name
            }
          },
          limit: 10
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Parse and return the search results
      return response.data.results.map(result => {
        const content = JSON.parse(result.content);
        return {
          id: result.id,
          name: content.name,
          age: content.age,
          grade: content.grade,
          diagnosis: content.diagnosis,
          createdAt: content.createdAt,
          updatedAt: content.updatedAt
        };
      });
    } catch (error) {
      console.error('Error searching Mem0:', error);
      throw new Error('Failed to search for student profiles');
    }
  }
}

module.exports = new Mem0Service();
