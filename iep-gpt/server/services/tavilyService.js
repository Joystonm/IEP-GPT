const axios = require('axios');

/**
 * Service for interacting with Tavily API to search for educational resources
 */
class TavilyService {
  constructor() {
    this.apiKey = process.env.TAVILY_API_KEY;
    this.apiUrl = 'https://api.tavily.com/v1/search';
  }

  /**
   * Search for educational resources based on student needs
   * @param {string} needs - Description of student needs
   * @returns {Array} List of relevant resources
   */
  async searchResources(needs) {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          api_key: this.apiKey,
          query: `educational resources for students with ${needs}`,
          search_depth: 'advanced',
          include_domains: [
            'understood.org',
            'edutopia.org',
            'teachthought.com',
            'scholastic.com',
            'readingrockets.org',
            'ldaamerica.org',
            'chadd.org',
            'autismspeaks.org'
          ],
          max_results: 5
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Process and format the search results
      return this.formatResources(response.data.results);
    } catch (error) {
      console.error('Error calling Tavily API:', error);
      throw new Error('Failed to search for educational resources');
    }
  }
  
  /**
   * Search for teaching strategies for specific learning challenges
   * @param {string} challenge - Learning challenge description
   * @returns {Array} List of teaching strategies
   */
  async searchStrategies(challenge) {
    try {
      const response = await axios.post(
        this.apiUrl,
        {
          api_key: this.apiKey,
          query: `evidence-based teaching strategies for students with ${challenge}`,
          search_depth: 'advanced',
          include_domains: [
            'edutopia.org',
            'teachthought.com',
            'scholastic.com',
            'readingrockets.org',
            'understood.org',
            'teachervision.com',
            'interventioncentral.org'
          ],
          max_results: 5
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Process and format the search results
      return this.formatResources(response.data.results);
    } catch (error) {
      console.error('Error calling Tavily API:', error);
      throw new Error('Failed to search for teaching strategies');
    }
  }
  
  /**
   * Format and structure the raw search results
   * @param {Array} results - Raw search results from Tavily
   * @returns {Array} Formatted resources
   */
  formatResources(results) {
    return results.map(result => ({
      title: result.title,
      url: result.url,
      description: result.content.substring(0, 200) + '...',
      source: new URL(result.url).hostname.replace('www.', ''),
      relevanceScore: result.score
    }));
  }
}

module.exports = new TavilyService();
