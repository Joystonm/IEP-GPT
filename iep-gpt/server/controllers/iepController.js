const groqService = require('../services/groqService');
const tavilyService = require('../services/tavilyService');
const mem0Service = require('../services/mem0Service');

/**
 * Generate a 7-day learning plan based on student data
 * @route POST /api/iep/generate
 */
exports.generateIEP = async (req, res) => {
  try {
    const studentData = req.body;
    
    // Validate required fields
    if (!studentData.name || !studentData.age || !studentData.diagnosis || 
        !studentData.strengths || !studentData.struggles) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required student information' 
      });
    }
    
    // 1. Generate IEP plan using Groq
    const iepPlan = await groqService.generateIEPPlan(studentData);
    
    // 2. Enhance with educational resources from Tavily
    const searchQuery = `teaching strategies for ${studentData.age} year old with ${studentData.diagnosis}`;
    const resources = await tavilyService.searchResources(searchQuery);
    
    // 3. Add resources to the plan
    const enhancedPlan = {
      ...iepPlan,
      resources: resources
    };
    
    // 4. Save the plan to Mem0
    const savedData = await mem0Service.saveStudentProfile({
      ...studentData,
      latestPlan: enhancedPlan
    });
    
    return res.status(200).json({
      success: true,
      data: enhancedPlan
    });
  } catch (error) {
    console.error('Error generating IEP plan:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate IEP plan',
      error: error.message
    });
  }
};

/**
 * Get a previously generated IEP plan
 * @route GET /api/iep/:id
 */
exports.getIEP = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Retrieve student profile from Mem0
    const studentData = await mem0Service.getStudentProfile(id);
    
    if (!studentData || !studentData.latestPlan) {
      return res.status(404).json({
        success: false,
        message: 'No IEP plan found for this student'
      });
    }
    
    return res.status(200).json({
      success: true,
      data: studentData.latestPlan
    });
  } catch (error) {
    console.error('Error retrieving IEP plan:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve IEP plan',
      error: error.message
    });
  }
};

/**
 * Generate an adapted learning plan based on student progress
 * @route POST /api/iep/adapt/:id
 */
exports.adaptIEP = async (req, res) => {
  try {
    const { id } = req.params;
    const progressData = req.body;
    
    // Retrieve student profile from Mem0
    const studentData = await mem0Service.getStudentProfile(id);
    
    if (!studentData) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Generate adapted plan using Groq
    const adaptedPlan = await groqService.generateAdaptedPlan(studentData, progressData);
    
    // Enhance with educational resources from Tavily
    const searchQuery = `teaching strategies for ${studentData.age} year old with ${studentData.diagnosis} based on progress`;
    const resources = await tavilyService.searchResources(searchQuery);
    
    // Add resources to the plan
    const enhancedPlan = {
      ...adaptedPlan,
      resources: resources
    };
    
    // Update the student profile with the new plan
    const updatedData = await mem0Service.updateStudentProfile(id, {
      ...studentData,
      latestPlan: enhancedPlan,
      previousPlans: [...(studentData.previousPlans || []), studentData.latestPlan]
    });
    
    return res.status(200).json({
      success: true,
      data: enhancedPlan
    });
  } catch (error) {
    console.error('Error adapting IEP plan:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to adapt IEP plan',
      error: error.message
    });
  }
};
