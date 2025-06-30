const groqService = require('../services/groqService');
const mem0Service = require('../services/mem0Service');
const tavilyService = require('../services/tavilyService');

/**
 * Generate a 7-day IEP plan based on student data
 * @route POST /api/iep/generate
 */
exports.generateIEPPlan = async (req, res) => {
  try {
    console.log('Received request to generate IEP plan');
    const studentData = req.body;
    
    // Validate required fields
    if (!studentData.name || !studentData.age) {
      console.log('Missing required fields in request');
      return res.status(400).json({
        success: false,
        message: 'Name and age are required'
      });
    }
    
    console.log('Generating IEP plan for student:', studentData.name);
    
    // Generate IEP plan using Groq
    const plan = await groqService.generateIEPPlan(studentData);
    console.log('IEP plan generated successfully');
    
    // Get educational resources using Tavily
    console.log('Fetching educational resources');
    let resources = [];
    try {
      resources = await tavilyService.searchResources(studentData.diagnosis || 'learning needs');
      console.log('Resources fetched successfully');
    } catch (resourceError) {
      console.error('Error fetching resources:', resourceError);
      // Continue without resources if there's an error
    }
    
    // Add resources to the plan
    plan.resources = resources;
    
    // Return the generated plan
    console.log('Sending response with generated plan');
    return res.status(200).json({
      success: true,
      data: plan
    });
  } catch (error) {
    console.error('Error generating IEP plan:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate IEP plan',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Generate an adapted learning plan based on progress
 * @route POST /api/iep/adapt/:id
 */
exports.generateAdaptedPlan = async (req, res) => {
  try {
    console.log('Received request to generate adapted plan');
    const { id } = req.params;
    
    // Get student data from Mem0
    console.log('Fetching student data for ID:', id);
    let studentData;
    
    try {
      studentData = await mem0Service.getStudentProfile(id);
    } catch (memError) {
      console.error('Error fetching student profile from Mem0:', memError);
      
      // Try to use the request body as fallback
      if (req.body && req.body.name) {
        console.log('Using request body as fallback for student data');
        studentData = req.body;
      } else {
        return res.status(404).json({
          success: false,
          message: 'Student profile not found'
        });
      }
    }
    
    if (!studentData) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }
    
    // Get progress data
    const progressData = studentData.progressData || req.body;
    console.log('Using progress data for adaptation');
    
    // Generate adapted plan using Groq
    console.log('Generating adapted plan');
    const adaptedPlan = await groqService.generateAdaptedPlan(studentData, progressData);
    console.log('Adapted plan generated successfully');
    
    // Get educational resources using Tavily
    console.log('Fetching educational resources');
    let resources = [];
    try {
      resources = await tavilyService.searchResources(studentData.diagnosis || 'learning needs');
      console.log('Resources fetched successfully');
    } catch (resourceError) {
      console.error('Error fetching resources:', resourceError);
      // Continue without resources if there's an error
    }
    
    // Add resources to the plan
    adaptedPlan.resources = resources;
    
    // Return the adapted plan
    console.log('Sending response with adapted plan');
    return res.status(200).json({
      success: true,
      data: adaptedPlan
    });
  } catch (error) {
    console.error('Error generating adapted plan:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate adapted plan',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
