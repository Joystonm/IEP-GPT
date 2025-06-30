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
      console.log('Generating IEP plan for student:', studentData.name);
      
      // Build prompt for Groq
      const prompt = promptBuilder.buildIEPPrompt(studentData);
      console.log('Using prompt:', prompt);
      
      // Call Groq API
      console.log('Calling Groq API with model:', this.model);
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
          },
          timeout: 60000 // 60 second timeout
        }
      );
      
      console.log('Groq API response received');
      
      // Parse and structure the response
      const completion = response.data.choices[0].message.content;
      console.log('Parsing Groq response');
      return this.parseIEPResponse(completion, studentData);
    } catch (error) {
      console.error('Error calling Groq API:', error.message);
      if (error.response) {
        console.error('Groq API error response:', error.response.data);
        console.error('Groq API error status:', error.response.status);
      }
      
      // Fallback to a basic plan if API fails
      console.log('Using fallback plan generation');
      return this.generateFallbackPlan(studentData);
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
      console.log('Generating adapted plan for student:', studentData.name);
      
      // Build prompt for adapted plan
      const prompt = promptBuilder.buildAdaptedPlanPrompt(studentData, progressData);
      console.log('Using prompt for adapted plan');
      
      // Call Groq API
      console.log('Calling Groq API for adapted plan');
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
          },
          timeout: 60000 // 60 second timeout
        }
      );
      
      console.log('Groq API response received for adapted plan');
      
      // Parse and structure the response
      const completion = response.data.choices[0].message.content;
      return this.parseIEPResponse(completion, studentData);
    } catch (error) {
      console.error('Error calling Groq API for adapted plan:', error.message);
      if (error.response) {
        console.error('Groq API error response:', error.response.data);
      }
      
      // Fallback to a basic plan if API fails
      return this.generateFallbackPlan(studentData);
    }
  }
  
  /**
   * Generate a fallback plan when API calls fail
   * @param {Object} studentData - Student information
   * @returns {Object} Basic fallback plan
   */
  generateFallbackPlan(studentData) {
    console.log('Generating fallback plan for', studentData.name);
    
    // Create a basic plan structure
    return {
      studentName: studentData.name,
      studentAge: studentData.age,
      studentGrade: studentData.grade,
      diagnosis: studentData.diagnosis,
      studentProfile: `${studentData.name} is a ${studentData.age}-year-old student in grade ${studentData.grade} with ${studentData.diagnosis}. ${studentData.name} has strengths in ${studentData.strengths || 'various areas'} and faces challenges with ${studentData.struggles || 'certain aspects of learning'}.`,
      learningApproach: `A structured approach is recommended for ${studentData.name}, with clear routines, visual supports, and frequent breaks. Activities should be broken down into manageable chunks with clear instructions.`,
      dailyPlans: [
        {
          title: "Day 1 - Monday",
          timeBlocks: [
            {
              time: "9:00-9:30",
              subject: "Morning Meeting",
              activity: "Review daily schedule and set goals",
              approach: "Visual schedule review with interactive elements",
              materials: "Visual schedule, goal chart"
            },
            {
              time: "9:35-10:05",
              subject: "Math",
              activity: "Number concepts with manipulatives",
              approach: "Hands-on learning with visual supports",
              materials: "Math manipulatives, worksheets"
            },
            {
              time: "10:10-10:30",
              subject: "Break",
              activity: "Movement break",
              approach: "Structured physical activity",
              materials: "Timer, movement cards"
            },
            {
              time: "10:35-11:05",
              subject: "Reading",
              activity: "Guided reading with comprehension activities",
              approach: "Multi-sensory reading instruction",
              materials: "Leveled books, comprehension cards"
            }
          ],
          notes: "Ensure all activities have clear beginning and end points. Use visual timer for transitions."
        },
        {
          title: "Day 2 - Tuesday",
          timeBlocks: [
            {
              time: "9:00-9:30",
              subject: "Morning Meeting",
              activity: "Review daily schedule and set goals",
              approach: "Visual schedule review with interactive elements",
              materials: "Visual schedule, goal chart"
            },
            {
              time: "9:35-10:05",
              subject: "Writing",
              activity: "Structured writing activity",
              approach: "Graphic organizers and visual prompts",
              materials: "Writing templates, pencils, markers"
            },
            {
              time: "10:10-10:30",
              subject: "Break",
              activity: "Sensory break",
              approach: "Guided sensory activities",
              materials: "Sensory tools, timer"
            },
            {
              time: "10:35-11:05",
              subject: "Science",
              activity: "Hands-on science experiment",
              approach: "Inquiry-based learning with structure",
              materials: "Science materials, observation sheet"
            }
          ],
          notes: "Provide extra support during writing activities. Use visual cues for transitions."
        }
      ],
      accommodations: [
        "Provide visual schedules and checklists",
        "Break tasks into smaller steps",
        "Allow movement breaks",
        "Use visual timers",
        "Provide fidget tools for focus",
        "Give clear, concise instructions",
        "Offer preferential seating",
        "Use visual supports for learning"
      ],
      progressMonitoring: `Monitor ${studentData.name}'s progress through daily check-ins, weekly skill assessments, and observation of engagement and task completion. Adjust strategies as needed based on progress data.`,
      createdAt: new Date().toISOString()
    };
  }
  
  /**
   * Parse and structure the raw response from Groq
   * @param {string} rawResponse - Raw text response from Groq
   * @param {Object} studentData - Original student data
   * @returns {Object} Structured 7-day learning plan
   */
  parseIEPResponse(rawResponse, studentData) {
    try {
      console.log('Parsing IEP response');
      
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
      
      // If no daily plans were found, try an alternative approach
      if (dailyPlans.length === 0) {
        console.log('No daily plans found, trying alternative parsing');
        
        // Look for sections that might contain daily plans
        const dailyPlanSection = this.extractSection(rawResponse, 'Daily Plans');
        if (dailyPlanSection) {
          // Split by day headers
          const dayRegex = /Day \d+[\s\S]*?(?=Day \d+|$)/g;
          const dayMatches = dailyPlanSection.match(dayRegex);
          
          if (dayMatches) {
            dayMatches.forEach((dayContent, index) => {
              const dayNumber = index + 1;
              const timeBlocks = this.parseTimeBlocks(dayContent);
              
              dailyPlans.push({
                title: `Day ${dayNumber}`,
                timeBlocks: timeBlocks,
                notes: this.extractSection(dayContent, 'Notes') || ''
              });
            });
          }
        }
      }
      
      // Create a structured IEP object
      const iepPlan = {
        studentName: studentData.name,
        studentAge: studentData.age,
        studentGrade: studentData.grade,
        diagnosis: studentData.diagnosis,
        studentProfile: studentProfile || `Profile for ${studentData.name}, a ${studentData.age}-year-old student with ${studentData.diagnosis}.`,
        learningApproach: learningApproach || 'Personalized learning approach based on student needs.',
        dailyPlans: dailyPlans.length > 0 ? dailyPlans : [
          {
            title: "Day 1",
            timeBlocks: [
              {
                time: "Morning",
                subject: "Various Subjects",
                activity: "Structured learning activities",
                approach: "Personalized approach based on student needs"
              }
            ],
            notes: "Implement accommodations as needed."
          }
        ],
        accommodations: accommodations.length > 0 ? accommodations : ["Provide visual supports", "Allow extra time", "Break tasks into steps"],
        progressMonitoring: progressMonitoring || 'Regular assessment of progress through observation and skill checks.',
        createdAt: new Date().toISOString()
      };
      
      console.log('Successfully created IEP plan structure');
      return iepPlan;
    } catch (error) {
      console.error('Error parsing IEP response:', error);
      
      // Fallback to returning a basic structure with the raw response
      return this.generateFallbackPlan(studentData);
    }
  }
  
  /**
   * Parse time blocks from day content
   * @param {string} dayContent - Content for a specific day
   * @returns {Array} Array of time blocks
   */
  parseTimeBlocks(dayContent) {
    const timeBlocks = [];
    
    try {
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
    } catch (error) {
      console.error('Error parsing time blocks:', error);
    }
    
    // If no time blocks were found, create a generic one
    if (timeBlocks.length === 0) {
      timeBlocks.push({
        time: "Full Day",
        subject: "General",
        activity: dayContent.substring(0, 100) + "...",
        approach: "Personalized approach"
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
    if (!text) return "General";
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
    if (!text) return "";
    try {
      const regex = new RegExp(`${sectionName}[:\\s]+(.*?)(?=\\n\\s*\\n|\\n\\s*[A-Z]|$)`, 's');
      const match = text.match(regex);
      return match ? match[1].trim() : '';
    } catch (error) {
      console.error(`Error extracting section ${sectionName}:`, error);
      return "";
    }
  }
  
  /**
   * Extract list items from a section
   * @param {string} text - Raw text
   * @param {string} sectionName - Name of section containing list
   * @returns {Array} List of extracted items
   */
  extractListItems(text, sectionName) {
    if (!text) return [];
    try {
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
        // Split by newlines and filter out empty lines
        const lines = sectionText.split('\n').filter(line => line.trim());
        if (lines.length > 0) {
          return lines;
        }
        return [sectionText];
      }
      
      return items;
    } catch (error) {
      console.error(`Error extracting list items from section ${sectionName}:`, error);
      return [];
    }
  }
}

module.exports = new GroqService();
