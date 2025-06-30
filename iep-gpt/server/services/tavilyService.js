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
      console.log('Searching for resources related to:', needs);
      
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
          },
          timeout: 30000 // 30 second timeout
        }
      );
      
      console.log('Tavily API response received');
      
      // Process and format the search results
      return this.formatResources(response.data.results);
    } catch (error) {
      console.error('Error calling Tavily API:', error.message);
      if (error.response) {
        console.error('Tavily API error response:', error.response.data);
      }
      
      // Return fallback resources if API call fails
      return this.getFallbackResources(needs);
    }
  }
  
  /**
   * Search for teaching strategies for specific learning challenges
   * @param {string} challenge - Learning challenge description
   * @returns {Array} List of teaching strategies
   */
  async searchStrategies(challenge) {
    try {
      console.log('Searching for strategies related to:', challenge);
      
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
          },
          timeout: 30000 // 30 second timeout
        }
      );
      
      console.log('Tavily API response received for strategies');
      
      // Process and format the search results
      return this.formatResources(response.data.results);
    } catch (error) {
      console.error('Error calling Tavily API for strategies:', error.message);
      if (error.response) {
        console.error('Tavily API error response:', error.response.data);
      }
      
      // Return fallback strategies if API call fails
      return this.getFallbackStrategies(challenge);
    }
  }
  
  /**
   * Format and structure the raw search results
   * @param {Array} results - Raw search results from Tavily
   * @returns {Array} Formatted resources
   */
  formatResources(results) {
    if (!results || !Array.isArray(results)) {
      console.log('No results or invalid results format from Tavily');
      return [];
    }
    
    return results.map(result => ({
      title: result.title || 'Educational Resource',
      url: result.url || 'https://www.understood.org',
      description: result.content ? result.content.substring(0, 200) + '...' : 'Educational resource for students with learning differences.',
      source: result.url ? new URL(result.url).hostname.replace('www.', '') : 'educational-resource.org',
      type: this.determineResourceType(result.title, result.url),
      difficulty: 'intermediate',
      ageGroup: 'all'
    }));
  }
  
  /**
   * Determine the type of resource based on title and URL
   * @param {string} title - Resource title
   * @param {string} url - Resource URL
   * @returns {string} Resource type
   */
  determineResourceType(title, url) {
    if (!title || !url) return 'article';
    
    title = title.toLowerCase();
    url = url.toLowerCase();
    
    if (url.includes('youtube.com') || url.includes('vimeo.com') || title.includes('video')) {
      return 'video';
    } else if (title.includes('worksheet') || title.includes('printable') || url.includes('pdf')) {
      return 'worksheet';
    } else if (title.includes('game') || title.includes('interactive') || title.includes('activity')) {
      return 'interactive';
    } else {
      return 'article';
    }
  }
  
  /**
   * Get fallback resources when API call fails
   * @param {string} needs - Description of student needs
   * @returns {Array} List of fallback resources
   */
  getFallbackResources(needs) {
    console.log('Using fallback resources for:', needs);
    
    return [
      {
        title: `Understanding ${needs} in the Classroom`,
        description: `A comprehensive guide for educators working with students who have ${needs}. Includes practical strategies, accommodations, and resources.`,
        url: "https://www.understood.org/articles/en/classroom-accommodations-guide",
        source: "understood.org",
        type: "article",
        difficulty: "intermediate",
        ageGroup: "all"
      },
      {
        title: `Visual Supports for Students with ${needs}`,
        description: `Learn how to create and implement visual supports to help students with ${needs} succeed in the classroom.`,
        url: "https://www.edutopia.org/article/visual-supports-students-special-needs",
        source: "edutopia.org",
        type: "article",
        difficulty: "beginner",
        ageGroup: "all"
      },
      {
        title: `Assistive Technology Tools for ${needs}`,
        description: `Discover the latest assistive technology tools that can help students with ${needs} access the curriculum and demonstrate their knowledge.`,
        url: "https://www.readingrockets.org/article/assistive-technology-kids-learning-disabilities",
        source: "readingrockets.org",
        type: "article",
        difficulty: "intermediate",
        ageGroup: "all"
      }
    ];
  }
  
  /**
   * Get fallback strategies when API call fails
   * @param {string} challenge - Learning challenge description
   * @returns {Array} List of fallback strategies
   */
  getFallbackStrategies(challenge) {
    console.log('Using fallback strategies for:', challenge);
    
    return [
      {
        title: `Evidence-Based Strategies for ${challenge}`,
        description: `Research-backed teaching strategies specifically designed for students with ${challenge}. Includes classroom implementation tips.`,
        url: "https://www.interventioncentral.org/academic-interventions",
        source: "interventioncentral.org",
        type: "article",
        difficulty: "intermediate",
        ageGroup: "all"
      },
      {
        title: `Differentiated Instruction for ${challenge}`,
        description: `Learn how to differentiate instruction to meet the needs of students with ${challenge} in inclusive classrooms.`,
        url: "https://www.teachthought.com/pedagogy/differentiation/",
        source: "teachthought.com",
        type: "article",
        difficulty: "intermediate",
        ageGroup: "all"
      },
      {
        title: `Behavior Management Strategies for ${challenge}`,
        description: `Effective behavior management approaches for supporting students with ${challenge} in the classroom.`,
        url: "https://www.scholastic.com/teachers/articles/teaching-content/behavior-management-strategies/",
        source: "scholastic.com",
        type: "article",
        difficulty: "intermediate",
        ageGroup: "all"
      }
    ];
  }
}

module.exports = new TavilyService();
