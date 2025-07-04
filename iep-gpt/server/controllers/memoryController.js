const mem0Service = require('../services/mem0Service');

/**
 * Save student profile and IEP plan to memory
 * @route POST /api/memory/save
 */
exports.saveStudentData = async (req, res) => {
  try {
    const studentData = req.body;
    
    // Validate required fields
    if (!studentData.name) {
      return res.status(400).json({
        success: false,
        message: 'Student name is required'
      });
    }
    
    // Check if this is an update or a new profile
    let savedData;
    
    if (studentData.id) {
      // Update existing profile
      savedData = await mem0Service.updateStudentProfile(studentData.id, studentData);
    } else {
      // Create new profile
      savedData = await mem0Service.saveStudentProfile(studentData);
    }
    
    return res.status(201).json({
      success: true,
      data: savedData
    });
  } catch (error) {
    console.error('Error saving student data:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to save student data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Retrieve student profile from memory
 * @route GET /api/memory/student/:id
 */
exports.getStudentData = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Retrieve student data
    const studentData = await mem0Service.getStudentProfile(id);
    
    if (!studentData) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: studentData
    });
  } catch (error) {
    console.error('Error retrieving student data:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve student data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get all student profiles
 * @route GET /api/memory/students
 */
exports.getAllStudents = async (req, res) => {
  try {
    // Get all student profiles
    const students = await mem0Service.getAllStudentProfiles();
    
    return res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error('Error retrieving student profiles:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve student profiles',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update student progress
 * @route POST /api/memory/student/:id/progress
 */
exports.updateStudentProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const progressData = req.body;
    
    // Validate progress data
    if (!progressData) {
      return res.status(400).json({
        success: false,
        message: 'Progress data is required'
      });
    }
    
    // Get existing student data
    const studentData = await mem0Service.getStudentProfile(id);
    
    if (!studentData) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Update student data with progress
    const updatedData = {
      ...studentData,
      progressData: progressData,
      lastUpdated: new Date().toISOString()
    };
    
    // Save updated student data
    const savedData = await mem0Service.updateStudentProfile(id, updatedData);
    
    return res.status(200).json({
      success: true,
      data: savedData
    });
  } catch (error) {
    console.error('Error updating student progress:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update student progress',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Search for students by name
 * @route GET /api/memory/search
 */
exports.searchStudents = async (req, res) => {
  try {
    const { name } = req.query;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    // Search for students by name
    const students = await mem0Service.searchStudentsByName(name);
    
    return res.status(200).json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error('Error searching for students:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search for students',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
/**
 * Delete student profile
 * @route DELETE /api/memory/student/:id
 */
exports.deleteStudentData = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete student data
    await mem0Service.deleteStudentProfile(id);
    
    return res.status(200).json({
      success: true,
      message: 'Student profile deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting student data:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete student data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
