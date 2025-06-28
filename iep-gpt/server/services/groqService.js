const axios = require('axios');
const config = require('../config/groq.config');
const promptBuilder = require('../utils/promptBuilder');

/**
 * Service for interacting with Groq API to generate IEP plans
 */
class GroqService {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    this.model = config.model || 'llama3-70b-8192';
  }

  /**
   * Generate a 7-day learning plan based on student data
   * @param {Object} studentData - Student information
   * @returns {Object} Generated 7-day learning plan
   */
  async generateIEPPlan(studentData) {
    try {
      // Build prompt for Groq
      const prompt = promptBuilder.buildIEPPrompt(studentData);
      
      // Call Groq API
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: config.systemPrompt
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: config.temperature,
          max_tokens: config.maxTokens
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Parse and structure the response
      const completion = response.data.choices[0].message.content;
      return this.parseIEPResponse(completion, studentData);
    } catch (error) {
      console.error('Error calling Groq API:', error);
      throw new Error('Failed to generate IEP plan');
    }
  }
  
  /**
   * Generate an adapted learning plan based on student progress
   * @param {Object} studentData - Student information
   * @param {Object} progressData - Progress information
   * @returns {Object} Adapted learning plan
   */
  async generateAdaptedPlan(studentData, progressData) {
    try {
      // Build prompt for adapted plan
      const prompt = promptBuilder.buildAdaptedPlanPrompt(studentData, progressData);
      
      // Call Groq API
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            {
              role: 'system',
              content: config.systemPrompt
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: config.temperature,
          max_tokens: config.maxTokens
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Parse and structure the response
      const completion = response.data.choices[0].message.content;
      return this.parseIEPResponse(completion, studentData);
    } catch (error) {
      console.error('Error calling Groq API for adapted plan:', error);
      throw new Error('Failed to generate adapted learning plan');
    }
  }
  
  /**
   * Parse and structure the raw response from Groq
   * @param {string} rawResponse - Raw text response from Groq
   * @param {Object} studentData - Original student data
   * @returns {Object} Structured 7-day learning plan
   */
  parseIEPResponse(rawResponse, studentData) {
    try {
      // For a production app, we would use a more sophisticated parsing approach
      // This is a simplified version for the prototype
      
      // Extract the main sections from the response
      const studentProfile = this.extractSection(rawResponse, 'Student Profile');
      const learningApproach = this.extractSection(rawResponse, 'Learning Approach');
      const accommodations = this.extractListItems(rawResponse, 'Accommodations');
      const progressMonitoring = this.extractSection(rawResponse, 'Progress Monitoring');
      
      // Extract daily plans
      const dailyPlans = [];
      
      // Look for Day 1, Day 2, etc. sections
      for (let i = 1; i <= 7; i++) {
        const dayPattern = new RegExp(`Day ${i}[:\\s]+(.*?)(?=\\s*Day ${i+1}|\\s*Progress Monitoring|$)`, 's');
        const dayMatch = rawResponse.match(dayPattern);
        
        if (dayMatch) {
          const dayContent = dayMatch[1].trim();
          
          // Parse time blocks from the day content
          const timeBlocks = this.parseTimeBlocks(dayContent);
          
          dailyPlans.push({
            title: `Day ${i}`,
            timeBlocks: timeBlocks,
            notes: this.extractSection(dayContent, 'Notes') || this.extractSection(dayContent, 'Accommodations') || ''
          });
        }
      }
      
      // Create a structured IEP object
      const iepPlan = {
        studentName: studentData.name,
        studentAge: studentData.age,
        studentGrade: studentData.grade,
        diagnosis: studentData.diagnosis,
        studentProfile: studentProfile,
        learningApproach: learningApproach,
        dailyPlans: dailyPlans,
        accommodations: accommodations,
        progressMonitoring: progressMonitoring,
        resources: [], // Will be populated by Tavily service
        createdAt: new Date().toISOString()
      };
      
      return iepPlan;
    } catch (error) {
      console.error('Error parsing IEP response:', error);
      
      // Fallback to returning a basic structure with the raw response
      return {
        studentName: studentData.name,
        studentAge: studentData.age,
        studentGrade: studentData.grade,
        diagnosis: studentData.diagnosis,
        studentProfile: "Could not parse student profile.",
        learningApproach: "Could not parse learning approach.",
        dailyPlans: [
          {
            title: "Day 1",
            timeBlocks: [
              {
                time: "Morning",
                subject: "General",
                activity: "Please see the raw content below.",
                approach: "N/A"
              }
            ],
            notes: "Error parsing the plan."
          }
        ],
        accommodations: ["Could not parse accommodations."],
        progressMonitoring: "Could not parse progress monitoring.",
        rawContent: rawResponse,
        createdAt: new Date().toISOString()
      };
    }
  }
  
  /**
   * Parse time blocks from day content
   * @param {string} dayContent - Content for a specific day
   * @returns {Array} Array of time blocks
   */
  parseTimeBlocks(dayContent) {
    const timeBlocks = [];
    
    // Look for time patterns like "9:00-9:30" or "Morning Block" or "Block 1"
    const timeBlockPattern = /(?:(\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2})|(?:Morning|Afternoon|Evening)\s+Block|Block\s+\d+)([^:]*):(.*?)(?=(?:\d{1,2}:\d{2}\s*-\s*\d{1,2}:\d{2})|(?:Morning|Afternoon|Evening)\s+Block|Block\s+\d+|$)/gs;
    
    let match;
    while ((match = timeBlockPattern.exec(dayContent)) !== null) {
      const timeBlock = match[1] || match[2];
      const blockContent = match[3].trim();
      
      // Extract subject, activity, and approach
      const subject = this.extractFirstLine(blockContent);
      const approach = this.extractSection(blockContent, 'Approach') || 
                      this.extractSection(blockContent, 'Method') || 
                      this.extractSection(blockContent, 'Strategy');
      
      // Everything else is the activity
      let activity = blockContent;
      if (approach) {
        activity = activity.replace(new RegExp(`Approach[:\\s]+${approach}`, 'i'), '');
        activity = activity.replace(new RegExp(`Method[:\\s]+${approach}`, 'i'), '');
        activity = activity.replace(new RegExp(`Strategy[:\\s]+${approach}`, 'i'), '');
      }
      
      // Clean up the activity
      activity = activity.replace(subject, '').trim();
      if (activity.startsWith(':')) {
        activity = activity.substring(1).trim();
      }
      
      timeBlocks.push({
        time: timeBlock.trim(),
        subject: subject,
        activity: activity,
        approach: approach || 'Not specified',
        materials: this.extractSection(blockContent, 'Materials') || ''
      });
    }
    
    // If no time blocks were found, create a generic one
    if (timeBlocks.length === 0) {
      timeBlocks.push({
        time: "Full Day",
        subject: "General",
        activity: dayContent,
        approach: "Not specified"
      });
    }
    
    return timeBlocks;
  }
  
  /**
   * Extract the first line from text
   * @param {string} text - Text to extract from
   * @returns {string} First line
   */
  extractFirstLine(text) {
    const lines = text.split('\n');
    return lines[0].trim();
  }
  
  /**
   * Extract a section from the raw response
   * @param {string} text - Raw text
   * @param {string} sectionName - Name of section to extract
   * @returns {string} Extracted section text
   */
  extractSection(text, sectionName) {
    const regex = new RegExp(`${sectionName}[:\\s]+(.*?)(?=\\n\\s*\\n|\\n\\s*[A-Z]|$)`, 's');
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  }
  
  /**
   * Extract list items from a section
   * @param {string} text - Raw text
   * @param {string} sectionName - Name of section containing list
   * @returns {Array} List of extracted items
   */
  extractListItems(text, sectionName) {
    const sectionText = this.extractSection(text, sectionName);
    if (!sectionText) return [];
    
    // Extract items that start with numbers, bullets, or dashes
    const itemRegex = /(?:^|\n)\s*(?:[-•*]|\d+\.?)\s*(.*?)(?=(?:\n\s*[-•*]|\n\s*\d+\.?)|$)/g;
    const items = [];
    let match;
    
    while ((match = itemRegex.exec(sectionText)) !== null) {
      if (match[1].trim()) {
        items.push(match[1].trim());
      }
    }
    
    // If no items were found but there is section text, return the whole text as one item
    if (items.length === 0 && sectionText) {
      return [sectionText];
    }
    
    return items;
  }
}

module.exports = new GroqService();
