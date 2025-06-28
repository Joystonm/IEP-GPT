const tavilyService = require('../services/tavilyService');

// Get educational resources based on student needs
exports.getResources = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { needs } = req.query;
    
    if (!needs) {
      return res.status(400).json({
        success: false,
        message: 'Student needs must be specified'
      });
    }
    
    // Search for relevant resources using Tavily
    const resources = await tavilyService.searchResources(needs);
    
    return res.status(200).json({
      success: true,
      data: resources
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch educational resources',
      error: error.message
    });
  }
};

// Get specific teaching strategies for a learning challenge
exports.getStrategies = async (req, res) => {
  try {
    const { challenge } = req.params;
    
    // Search for teaching strategies using Tavily
    const strategies = await tavilyService.searchStrategies(challenge);
    
    return res.status(200).json({
      success: true,
      data: strategies
    });
  } catch (error) {
    console.error('Error fetching strategies:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch teaching strategies',
      error: error.message
    });
  }
};
