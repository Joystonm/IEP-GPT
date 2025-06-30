/**
 * Mock service to generate learning plans and resources without external API calls
 * Used when API keys aren't configured or for development/testing
 */

class MockService {
  constructor() {
    // Initialize empty storage for student profiles
    this.studentProfiles = [];
  }

  /**
   * Generate a mock 7-day learning plan
   * @param {Object} studentData - Student information
   * @returns {Object} Generated learning plan
   */
  generateLearningPlan(studentData) {
    console.log('Using mock service to generate learning plan for:', studentData.name);
    
    // Create a structured learning plan based on the student data
    const plan = {
      studentName: studentData.name,
      studentAge: studentData.age,
      studentGrade: studentData.grade || '5',
      diagnosis: studentData.diagnosis || 'ADHD',
      studentProfile: this.generateStudentProfile(studentData),
      learningApproach: this.generateLearningApproach(studentData),
      dailyPlans: this.generateDailyPlans(studentData),
      accommodations: this.generateAccommodations(studentData),
      progressMonitoring: this.generateProgressMonitoring(studentData),
      resources: this.generateResources(studentData.diagnosis || 'ADHD'),
      createdAt: new Date().toISOString(),
      id: 'mock-' + Date.now()
    };
    
    return plan;
  }
  
  /**
   * Generate a student profile summary
   */
  generateStudentProfile(studentData) {
    return `${studentData.name} is a ${studentData.age}-year-old student in grade ${studentData.grade || '5'} 
    with ${studentData.diagnosis || 'ADHD'}. ${studentData.name} demonstrates strengths in ${studentData.strengths || 'verbal communication and creative problem-solving'}, 
    while facing challenges with ${studentData.struggles || 'maintaining focus and reading comprehension'}. 
    ${studentData.name} has a ${studentData.learningStyle || 'visual'} learning style and typically maintains focus for 
    ${studentData.attentionSpan || 'short (10-20 minute)'} periods. ${studentData.name} is particularly interested in 
    ${studentData.interests || 'science topics and technology'}, which can be leveraged to increase engagement.`;
  }
  
  /**
   * Generate learning approach recommendations
   */
  generateLearningApproach(studentData) {
    return `For ${studentData.name}, a structured yet flexible approach is recommended, with the following key strategies:
    
    1. Use visual supports extensively, including graphic organizers, color-coding, and visual schedules
    
    2. Break learning into 15-20 minute chunks to match attention span, with brief movement breaks between activities
    
    3. Incorporate high-interest topics like ${studentData.interests || 'science and technology'} into lessons across subjects
    
    4. Provide immediate feedback and positive reinforcement, using a points system for motivation
    
    5. Use multisensory teaching methods that combine visual, auditory, and kinesthetic elements
    
    6. Minimize writing demands by offering alternatives like voice recording, typing, or verbal responses
    
    7. Create a predictable routine with clear transitions and expectations`;
  }
  
  /**
   * Generate daily plans for 7 days
   */
  generateDailyPlans(studentData) {
    const interests = studentData.interests || 'dinosaurs, space, and technology';
    const dailyPlans = [];
    
    // Day 1 - Monday
    dailyPlans.push({
      title: "Day 1 - Monday",
      timeBlocks: [
        {
          time: "9:00-9:20",
          subject: "Morning Meeting",
          activity: "Visual schedule review and daily goals",
          approach: "Use visual schedule cards and interactive goal-setting",
          materials: "Visual schedule, goal chart, stickers"
        },
        {
          time: "9:25-9:45",
          subject: "Math",
          activity: `Number patterns with ${interests.split(',')[0]} theme`,
          approach: "Visual aids and manipulatives with high-interest theme",
          materials: "Pattern blocks, themed worksheets, tablet for interactive math game"
        },
        {
          time: "9:50-10:10",
          subject: "Movement Break",
          activity: "Structured movement game with math concepts",
          approach: "Kinesthetic learning with clear rules and boundaries",
          materials: "Open space, number cards, music"
        },
        {
          time: "10:15-10:35",
          subject: "Reading",
          activity: `Guided reading with book about ${interests.split(',')[0]}`,
          approach: "Pre-teaching vocabulary with visual supports, chunked reading passages",
          materials: "Highlighted text, vocabulary cards, fidget tools"
        },
        {
          time: "10:40-11:00",
          subject: "Science",
          activity: "Interactive video and discussion",
          approach: "Visual learning with structured discussion prompts",
          materials: "Short video segments, discussion cards, response board"
        }
      ],
      notes: "Ensure fidget tools are available throughout the day. Use visual timer for all activities. Provide specific praise for on-task behavior."
    });
    
    // Day 2 - Tuesday
    dailyPlans.push({
      title: "Day 2 - Tuesday",
      timeBlocks: [
        {
          time: "9:00-9:20",
          subject: "Morning Meeting",
          activity: "Review schedule and set daily goals",
          approach: "Interactive check-in with visual supports",
          materials: "Visual schedule, goal chart, feelings cards"
        },
        {
          time: "9:25-9:45",
          subject: "Writing",
          activity: `Create a comic strip about ${interests.split(',')[1]}`,
          approach: "Visual storytelling with minimal writing",
          materials: "Comic templates, colored pencils, word bank"
        },
        {
          time: "9:50-10:10",
          subject: "Movement Break",
          activity: "Simon Says with academic concepts",
          approach: "Structured movement with clear directions",
          materials: "Open space, visual cue cards"
        },
        {
          time: "10:15-10:35",
          subject: "Social Studies",
          activity: "Interactive map exploration",
          approach: "Hands-on learning with visual supports",
          materials: "Interactive maps, colored markers, tablet for virtual exploration"
        },
        {
          time: "10:40-11:00",
          subject: "Math",
          activity: "Problem-solving with visual models",
          approach: "Step-by-step visual problem solving",
          materials: "Math manipulatives, visual problem-solving template"
        }
      ],
      notes: "Check in frequently during writing activity. Provide extra visual supports for transitions between activities."
    });
    
    // Generate remaining days with similar structure
    for (let i = 3; i <= 7; i++) {
      dailyPlans.push(this.generateGenericDay(i, studentData));
    }
    
    return dailyPlans;
  }
  
  /**
   * Generate a generic day plan
   */
  generateGenericDay(dayNumber, studentData) {
    const dayNames = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const interests = studentData.interests ? studentData.interests.split(',').map(i => i.trim()) : ['dinosaurs', 'space', 'technology'];
    const subjects = ["Math", "Reading", "Science", "Social Studies", "Writing", "Art", "Technology"];
    
    // Shuffle the subjects array for variety
    const shuffledSubjects = [...subjects].sort(() => Math.random() - 0.5);
    
    // Select a random interest for the day
    const dayInterest = interests[Math.floor(Math.random() * interests.length)];
    
    return {
      title: `Day ${dayNumber} - ${dayNames[dayNumber % 7 || 7]}`,
      timeBlocks: [
        {
          time: "9:00-9:20",
          subject: "Morning Meeting",
          activity: "Visual schedule review and goal setting",
          approach: "Interactive check-in with visual supports",
          materials: "Visual schedule, goal chart, timer"
        },
        {
          time: "9:25-9:45",
          subject: shuffledSubjects[0],
          activity: `${shuffledSubjects[0]} activity with ${dayInterest} theme`,
          approach: "Visual learning with high-interest content",
          materials: `${shuffledSubjects[0]} materials, visual aids, fidget tools`
        },
        {
          time: "9:50-10:10",
          subject: "Movement Break",
          activity: "Structured movement activity",
          approach: "Kinesthetic learning with clear boundaries",
          materials: "Open space, movement cards, music"
        },
        {
          time: "10:15-10:35",
          subject: shuffledSubjects[1],
          activity: `Interactive ${shuffledSubjects[1]} lesson`,
          approach: "Multisensory approach with visual supports",
          materials: `${shuffledSubjects[1]} materials, tablet for interactive elements`
        },
        {
          time: "10:40-11:00",
          subject: shuffledSubjects[2],
          activity: `${shuffledSubjects[2]} exploration with visual aids`,
          approach: "Hands-on learning with frequent check-ins",
          materials: `${shuffledSubjects[2]} materials, visual supports, timer`
        }
      ],
      notes: `Focus on providing immediate feedback and positive reinforcement throughout the day. Incorporate ${dayInterest} into activities when possible to increase engagement.`
    };
  }
  
  /**
   * Generate accommodations based on student data
   */
  generateAccommodations(studentData) {
    return [
      "Provide visual schedule and checklists for daily activities and transitions",
      "Allow use of fidget tools during seated work to support focus",
      "Break assignments into smaller chunks with clear visual markers for each section",
      "Provide extra time for reading tasks and comprehension activities",
      "Offer alternatives to handwriting (typing, voice recording, scribe)",
      "Seat near teacher for frequent check-ins and redirection",
      "Use visual timer for all activities to support time management",
      "Provide quiet headphones during independent work to reduce auditory distractions",
      "Use color-coding system for organizing materials and information",
      "Incorporate movement breaks between learning activities",
      "Provide step-by-step visual instructions for multi-step tasks",
      "Allow preferential seating away from distractions (windows, doors, high traffic areas)"
    ];
  }
  
  /**
   * Generate progress monitoring recommendations
   */
  generateProgressMonitoring(studentData) {
    return `Progress for ${studentData.name} should be monitored using the following approaches:

1. Daily check-in/check-out system with visual tracking of goals
2. Weekly progress chart for specific target behaviors (task completion, focus time, etc.)
3. Point system tied to specific learning objectives with visual tracking
4. Bi-weekly assessment of reading fluency and comprehension using leveled passages
5. Math skill checks using visual problem-solving templates
6. Self-monitoring tools where ${studentData.name} rates own focus and effort after activities
7. Regular communication between home and school using a visual communication log
8. Monthly review of accommodations to determine effectiveness and make adjustments as needed`;
  }
  
  /**
   * Generate mock educational resources
   */
  generateResources(diagnosis) {
    const resources = [
      {
        title: "Visual Schedules and Task Organization for Students with ADHD",
        description: "A comprehensive guide to creating effective visual schedules and organizational systems for students with attention challenges.",
        url: "https://www.understood.org/articles/en/classroom-accommodations-for-adhd",
        source: "understood.org",
        type: "article",
        ageGroup: "all",
        difficulty: "intermediate"
      },
      {
        title: "Math Visualization Strategies for Neurodiverse Learners",
        description: "Video tutorial showing effective ways to teach math concepts using visual supports and manipulatives.",
        url: "https://www.youtube.com/watch?v=example",
        source: "teachingchannel.org",
        type: "video",
        ageGroup: "elementary",
        difficulty: "beginner"
      },
      {
        title: "Interactive Reading Comprehension Games",
        description: "Collection of digital games that support reading comprehension through visual cues and interactive elements.",
        url: "https://www.education.com/games/reading/",
        source: "education.com",
        type: "interactive",
        ageGroup: "elementary",
        difficulty: "intermediate"
      },
      {
        title: "Sensory Break Activities for the Classroom",
        description: "Printable cards with structured movement activities designed for classroom brain breaks.",
        url: "https://www.teacherspayteachers.com/Product/Sensory-Break-Cards",
        source: "teacherspayteachers.com",
        type: "worksheet",
        ageGroup: "all",
        difficulty: "beginner"
      },
      {
        title: "Executive Function Skills: Building Attention and Focus",
        description: "Research-based strategies for developing executive function skills in students with attention challenges.",
        url: "https://chadd.org/for-educators/classroom-management/",
        source: "chadd.org",
        type: "article",
        ageGroup: "all",
        difficulty: "advanced"
      }
    ];
    
    return resources;
  }
  
  /**
   * Generate mock student profiles
   * @returns {Array} List of student profiles
   */
  getStudentProfiles() {
    // Return the stored student profiles instead of hardcoded ones
    return this.studentProfiles;
  }
  
  /**
   * Get a specific student profile
   * @param {string} studentId - Student ID
   * @returns {Object} Student profile
   */
  getStudentProfile(studentId) {
    // Find the student in our stored profiles
    const profile = this.studentProfiles.find(p => p.id === studentId);
    
    if (!profile) {
      return null;
    }
    
    return profile;
  }
  
  /**
   * Save a student profile (mock implementation)
   * @param {Object} studentData - Student data
   * @returns {Object} Saved student data with ID
   */
  saveStudentProfile(studentData) {
    console.log('Mock saving student profile:', studentData.name);
    
    // Check if this is an update to an existing student
    const existingIndex = this.studentProfiles.findIndex(p => p.id === studentData.id);
    
    if (existingIndex >= 0) {
      // Update existing student
      const updatedStudent = {
        ...studentData,
        updatedAt: new Date().toISOString()
      };
      
      this.studentProfiles[existingIndex] = updatedStudent;
      return updatedStudent;
    }
    
    // Create a new student profile
    const newStudent = {
      ...studentData,
      id: studentData.id || `mock-student-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Add to our stored profiles
    this.studentProfiles.push(newStudent);
    
    return newStudent;
  }
  
  /**
   * Update a student profile (mock implementation)
   * @param {string} studentId - Student ID
   * @param {Object} updatedData - Updated student data
   * @returns {Object} Updated student data
   */
  updateStudentProfile(studentId, updatedData) {
    console.log('Mock updating student profile:', studentId);
    
    // Find the student in our stored profiles
    const existingIndex = this.studentProfiles.findIndex(p => p.id === studentId);
    
    if (existingIndex >= 0) {
      // Update existing student
      const updatedStudent = {
        ...this.studentProfiles[existingIndex],
        ...updatedData,
        id: studentId,
        updatedAt: new Date().toISOString()
      };
      
      this.studentProfiles[existingIndex] = updatedStudent;
      return updatedStudent;
    }
    
    // If student doesn't exist, create a new one
    return this.saveStudentProfile({
      ...updatedData,
      id: studentId
    });
  }
}

module.exports = new MockService();
