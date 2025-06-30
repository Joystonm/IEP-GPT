const axios = require('axios');

/**
 * Service for interacting with Mem0 API to store and retrieve student profiles
 */
class Mem0Service {
  constructor() {
    this.apiKey = process.env.MEM0_API_KEY;
    this.apiUrl = 'https://api.mem0.ai/v1';
    this.collectionId = process.env.MEM0_COLLECTION_ID;
    
    // In-memory storage as fallback
    this.memoryStorage = [];
  }

  /**
   * Save student profile to Mem0
   * @param {Object} studentData - Student profile data
   * @returns {Object} Saved student profile with ID
   */
  async saveStudentProfile(studentData) {
    try {
      console.log('Saving student profile to Mem0:', studentData.name);
      
      // Add timestamp to student data
      const dataToSave = {
        ...studentData,
        updatedAt: new Date().toISOString()
      };
      
      if (!dataToSave.createdAt) {
        dataToSave.createdAt = new Date().toISOString();
      }
      
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
          },
          timeout: 30000 // 30 second timeout
        }
      );
      
      console.log('Student profile saved to Mem0 successfully');
      
      // Return the saved data with the document ID
      return {
        ...dataToSave,
        id: response.data.id
      };
    } catch (error) {
      console.error('Error saving to Mem0:', error.message);
      if (error.response) {
        console.error('Mem0 API error response:', error.response.data);
      }
      
      // Fallback to in-memory storage
      console.log('Using in-memory storage as fallback');
      return this.saveToMemory(studentData);
    }
  }
  
  /**
   * Retrieve student profile from Mem0
   * @param {string} studentId - ID of the student profile to retrieve
   * @returns {Object} Student profile data
   */
  async getStudentProfile(studentId) {
    try {
      console.log('Retrieving student profile from Mem0:', studentId);
      
      // Call Mem0 API to retrieve the document
      const response = await axios.get(
        `${this.apiUrl}/documents/${studentId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          },
          timeout: 30000 // 30 second timeout
        }
      );
      
      console.log('Student profile retrieved from Mem0 successfully');
      
      // Parse the content from the document
      const studentData = JSON.parse(response.data.content);
      
      return {
        ...studentData,
        id: response.data.id
      };
    } catch (error) {
      console.error('Error retrieving from Mem0:', error.message);
      if (error.response) {
        console.error('Mem0 API error response:', error.response.data);
      }
      
      // Fallback to in-memory storage
      console.log('Using in-memory storage as fallback');
      return this.getFromMemory(studentId);
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
      console.log('Updating student profile in Mem0:', studentId);
      
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
          },
          timeout: 30000 // 30 second timeout
        }
      );
      
      console.log('Student profile updated in Mem0 successfully');
      
      // Return the updated data
      return {
        ...dataToSave,
        id: studentId
      };
    } catch (error) {
      console.error('Error updating in Mem0:', error.message);
      if (error.response) {
        console.error('Mem0 API error response:', error.response.data);
      }
      
      // Fallback to in-memory storage
      console.log('Using in-memory storage as fallback');
      return this.updateInMemory(studentId, updatedData);
    }
  }
  
  /**
   * Get all student profiles
   * @returns {Array} List of student profiles
   */
  async getAllStudentProfiles() {
    try {
      console.log('Retrieving all student profiles from Mem0');
      
      // Call Mem0 API to list all documents in the collection
      const response = await axios.get(
        `${this.apiUrl}/collections/${this.collectionId}/documents`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          },
          timeout: 30000 // 30 second timeout
        }
      );
      
      console.log('All student profiles retrieved from Mem0 successfully');
      
      // Parse and return the profiles
      return response.data.documents.map(doc => {
        try {
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
        } catch (parseError) {
          console.error('Error parsing document content:', parseError);
          return {
            id: doc.id,
            name: 'Unknown Student',
            createdAt: doc.created_at
          };
        }
      });
    } catch (error) {
      console.error('Error listing documents in Mem0:', error.message);
      if (error.response) {
        console.error('Mem0 API error response:', error.response.data);
      }
      
      // Fallback to in-memory storage
      console.log('Using in-memory storage as fallback');
      return this.getAllFromMemory();
    }
  }
  
  /**
   * Search for student profiles by name
   * @param {string} name - Student name to search for
   * @returns {Array} Matching student profiles
   */
  async searchStudentsByName(name) {
    try {
      console.log('Searching for student profiles by name:', name);
      
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
          },
          timeout: 30000 // 30 second timeout
        }
      );
      
      console.log('Search results retrieved from Mem0 successfully');
      
      // Parse and return the search results
      return response.data.results.map(result => {
        try {
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
        } catch (parseError) {
          console.error('Error parsing search result content:', parseError);
          return {
            id: result.id,
            name: 'Unknown Student',
            createdAt: result.created_at
          };
        }
      });
    } catch (error) {
      console.error('Error searching Mem0:', error.message);
      if (error.response) {
        console.error('Mem0 API error response:', error.response.data);
      }
      
      // Fallback to in-memory storage
      console.log('Using in-memory storage as fallback');
      return this.searchInMemory(name);
    }
  }
  
  // In-memory storage methods as fallback
  
  /**
   * Save student data to in-memory storage
   * @param {Object} studentData - Student data to save
   * @returns {Object} Saved student data with ID
   */
  saveToMemory(studentData) {
    console.log('Saving student data to in-memory storage');
    
    // Check if student already exists
    const existingIndex = this.memoryStorage.findIndex(s => s.id === studentData.id);
    
    if (existingIndex >= 0) {
      // Update existing student
      const updatedStudent = {
        ...studentData,
        updatedAt: new Date().toISOString()
      };
      
      this.memoryStorage[existingIndex] = updatedStudent;
      return updatedStudent;
    } else {
      // Create new student
      const newStudent = {
        ...studentData,
        id: studentData.id || `mem-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      this.memoryStorage.push(newStudent);
      return newStudent;
    }
  }
  
  /**
   * Get student data from in-memory storage
   * @param {string} studentId - Student ID
   * @returns {Object} Student data
   */
  getFromMemory(studentId) {
    console.log('Getting student data from in-memory storage');
    return this.memoryStorage.find(s => s.id === studentId);
  }
  
  /**
   * Update student data in in-memory storage
   * @param {string} studentId - Student ID
   * @param {Object} updatedData - Updated student data
   * @returns {Object} Updated student data
   */
  updateInMemory(studentId, updatedData) {
    console.log('Updating student data in in-memory storage');
    
    const existingIndex = this.memoryStorage.findIndex(s => s.id === studentId);
    
    if (existingIndex >= 0) {
      const updatedStudent = {
        ...this.memoryStorage[existingIndex],
        ...updatedData,
        id: studentId,
        updatedAt: new Date().toISOString()
      };
      
      this.memoryStorage[existingIndex] = updatedStudent;
      return updatedStudent;
    } else {
      // If student doesn't exist, create a new one
      return this.saveToMemory({
        ...updatedData,
        id: studentId
      });
    }
  }
  
  /**
   * Get all student data from in-memory storage
   * @returns {Array} All student data
   */
  getAllFromMemory() {
    console.log('Getting all student data from in-memory storage');
    return this.memoryStorage;
  }
  
  /**
   * Search for students by name in in-memory storage
   * @param {string} name - Student name
   * @returns {Array} Matching student data
   */
  searchInMemory(name) {
    console.log('Searching for students by name in in-memory storage');
    
    const lowercaseName = name.toLowerCase();
    return this.memoryStorage.filter(s => 
      s.name && s.name.toLowerCase().includes(lowercaseName)
    );
  }
}

module.exports = new Mem0Service();
  /**
   * Delete a student profile
   * @param {string} studentId - ID of the student profile to delete
   * @returns {boolean} Success status
   */
  async deleteStudentProfile(studentId) {
    try {
      console.log('Deleting student profile from Mem0:', studentId);
      
      // Call Mem0 API to delete the document
      await axios.delete(
        `${this.apiUrl}/documents/${studentId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          },
          timeout: 30000 // 30 second timeout
        }
      );
      
      console.log('Student profile deleted from Mem0 successfully');
      return true;
    } catch (error) {
      console.error('Error deleting from Mem0:', error.message);
      if (error.response) {
        console.error('Mem0 API error response:', error.response.data);
      }
      
      // Fallback to in-memory storage
      console.log('Using in-memory storage as fallback');
      return this.deleteFromMemory(studentId);
    }
  }
  
  /**
   * Delete student data from in-memory storage
   * @param {string} studentId - Student ID
   * @returns {boolean} Success status
   */
  deleteFromMemory(studentId) {
    console.log('Deleting student data from in-memory storage');
    
    const initialLength = this.memoryStorage.length;
    this.memoryStorage = this.memoryStorage.filter(s => s.id !== studentId);
    
    return this.memoryStorage.length < initialLength;
  }
