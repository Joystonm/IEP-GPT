const tavilyService = require('../services/tavilyService');

/**
 * Get educational resources for a student
 * @route GET /api/tavily/resources/:studentId
 */
exports.getResources = async (req, res) => {
  try {
    const { needs } = req.query;
    
    if (!needs) {
      return res.status(400).json({
        success: false,
        message: 'Student needs are required'
      });
    }
    
    // Search for resources using Tavily
    const resources = await tavilyService.searchResources(needs);
    
    return res.status(200).json({
      success: true,
      data: resources
    });
  } catch (error) {
    console.error('Error fetching resources:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch resources',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Get teaching strategies for a specific learning challenge
 * @route GET /api/tavily/strategies/:challenge
 */
exports.getStrategies = async (req, res) => {
  try {
    const { challenge } = req.params;
    
    if (!challenge) {
      return res.status(400).json({
        success: false,
        message: 'Learning challenge is required'
      });
    }
    
    // Search for strategies using Tavily
    const strategies = await tavilyService.searchStrategies(challenge);
    
    return res.status(200).json({
      success: true,
      data: strategies
    });
  } catch (error) {
    console.error('Error fetching strategies:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch strategies',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
