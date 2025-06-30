/**
 * Utility for building prompts for the Groq API
 */

/**
 * Build a prompt for 7-day learning plan generation based on student data
 * @param {Object} studentData - Student information
 * @returns {string} Formatted prompt for Groq
 */
exports.buildIEPPrompt = (studentData) => {
  // Extract learning style information
  let learningStyleInfo = '';
  
  if (studentData.learningStyleResults) {
    // Use detailed learning style results if available
    const results = studentData.learningStyleResults;
    learningStyleInfo = `
Primary Learning Style: ${results.primaryLearningStyle}
Secondary Learning Style: ${results.secondaryLearningStyle}
Learning Style Profile: ${JSON.stringify(results.styles || [])}
Recommended Strategies: ${JSON.stringify(results.recommendations?.strategies || [])}
Recommended Activities: ${JSON.stringify(results.recommendations?.activities || [])}
Recommended Accommodations: ${JSON.stringify(results.recommendations?.accommodations || [])}
`;
  } else {
    // Use basic learning style if detailed results aren't available
    let learningStyleDesc = '';
    switch (studentData.learningStyle) {
      case 'visual':
        learningStyleDesc = 'Visual (learns best through seeing)';
        break;
      case 'auditory':
        learningStyleDesc = 'Auditory (learns best through hearing)';
        break;
      case 'kinesthetic':
        learningStyleDesc = 'Kinesthetic (learns best through hands-on activities)';
        break;
      case 'reading/writing':
        learningStyleDesc = 'Reading/Writing (learns best through text)';
        break;
      case 'multimodal':
        learningStyleDesc = 'Multimodal (combination of styles)';
        break;
      default:
        learningStyleDesc = studentData.learningStyle || 'Not specified';
    }
    
    learningStyleInfo = `Learning Style: ${learningStyleDesc}`;
  }

  // Extract attention span description
  let attentionSpanDesc = '';
  switch (studentData.attentionSpan) {
    case 'very-short':
      attentionSpanDesc = 'Very short (5-10 minutes)';
      break;
    case 'short':
      attentionSpanDesc = 'Short (10-20 minutes)';
      break;
    case 'moderate':
      attentionSpanDesc = 'Moderate (20-30 minutes)';
      break;
    case 'long':
      attentionSpanDesc = 'Long (30+ minutes)';
      break;
    case 'variable':
      attentionSpanDesc = 'Highly variable (depends on interest)';
      break;
    default:
      attentionSpanDesc = studentData.attentionSpan || 'Not specified';
  }
  
  // Extract cultural information if available
  let culturalInfo = '';
  if (studentData.culturalData && studentData.culturalData.culturalProfile) {
    const profile = studentData.culturalData.culturalProfile;
    culturalInfo = `
CULTURAL BACKGROUND:
Cultural Background: ${profile.culturalBackground || 'Not specified'}
Language: ${profile.language || 'Not specified'}
Cultural Traditions: ${profile.traditions || 'Not specified'}
Cultural Values: ${profile.values || 'Not specified'}
Community Context: ${profile.communityContext || 'Not specified'}
Cultural Strengths: ${profile.culturalStrengths || 'Not specified'}

CULTURAL ADAPTATIONS:
${studentData.culturalData.adaptations ? JSON.stringify(studentData.culturalData.adaptations) : 'None specified'}
`;
  }

  return `
Create a comprehensive 7-day personalized learning plan for the following neurodiverse student:

STUDENT INFORMATION:
Name: ${studentData.name}
Age: ${studentData.age}
Grade: ${studentData.grade}
Diagnosis/Condition: ${studentData.diagnosis}${studentData.diagnosisOther ? ` (${studentData.diagnosisOther})` : ''}

LEARNING PROFILE:
Strengths: ${studentData.strengths || 'Not specified'}
Struggles: ${studentData.struggles || 'Not specified'}
${learningStyleInfo}
Attention Span: ${attentionSpanDesc}
Known Triggers: ${studentData.triggers || 'None specified'}
Interests & Motivators: ${studentData.interests || 'None specified'}
Current Accommodations: ${studentData.currentAccommodations || 'None currently in place'}
${culturalInfo}

Please create a detailed 7-day learning plan with the following sections:

1. Student Profile: A comprehensive summary of the student's learning profile, including strengths, challenges, learning style, and cultural background (if provided).

2. Learning Approach: Overall recommended teaching approach for this student, considering their diagnosis, learning style, attention span, and cultural background. Be specific about strategies that will work best for this particular student.

3. Daily Plans (for 7 days): For each day, create a structured schedule with:
   - Time blocks based on the student's attention span
   - Subject focus for each block
   - Specific activities that leverage strengths, address challenges, and incorporate interests
   - Teaching methods/approaches for each activity that align with the student's learning style
   - Required materials or resources
   - Cultural adaptations where appropriate

4. Accommodations: Specific classroom and testing accommodations that will help the student access the curriculum, based on their diagnosis, learning style, and cultural background.

5. Progress Monitoring: How to track and measure the student's progress toward their learning goals, with consideration for their specific needs and strengths.

Format your response with clear headings for each section. Be specific and practical in your recommendations. Focus on evidence-based strategies for students with ${studentData.diagnosis}.

For the daily plans, please structure each day with clear time blocks and ensure activities are engaging and appropriate for the student's age, grade level, attention span, and incorporate their interests (${studentData.interests || 'general age-appropriate interests'}).

IMPORTANT: Make this plan HIGHLY PERSONALIZED to ${studentData.name}'s specific needs, strengths, interests, and learning style. Avoid generic recommendations that could apply to any student with ${studentData.diagnosis}. Instead, create a plan that feels custom-designed specifically for ${studentData.name}.
`;
};

/**
 * Build a prompt for adapting a learning plan based on progress
 * @param {Object} studentData - Student information
 * @param {Object} progressData - Progress information
 * @returns {string} Formatted prompt for Groq
 */
exports.buildAdaptedPlanPrompt = (studentData, progressData) => {
  // Extract the previous plan
  const previousPlan = studentData.latestPlan || {};
  
  // Extract weekly progress data
  let weeklyProgressDetails = '';
  if (progressData.weeklyProgress) {
    try {
      // Try to format the weekly progress data
      const progressDetails = Object.entries(progressData.weeklyProgress).map(([day, data]) => {
        return `${day}: ${JSON.stringify(data)}`;
      }).join('\n');
      
      weeklyProgressDetails = progressDetails;
    } catch (error) {
      // If there's an error, just use the raw data
      weeklyProgressDetails = JSON.stringify(progressData.weeklyProgress);
    }
  }
  
  // Extract learning style information
  let learningStyleInfo = '';
  
  if (studentData.learningStyleResults) {
    // Use detailed learning style results if available
    const results = studentData.learningStyleResults;
    learningStyleInfo = `
Primary Learning Style: ${results.primaryLearningStyle}
Secondary Learning Style: ${results.secondaryLearningStyle}
Learning Style Profile: ${JSON.stringify(results.styles || [])}
`;
  } else {
    // Use basic learning style if detailed results aren't available
    learningStyleInfo = `Learning Style: ${studentData.learningStyle || 'Not specified'}`;
  }
  
  // Extract cultural information if available
  let culturalInfo = '';
  if (studentData.culturalData && studentData.culturalData.culturalProfile) {
    const profile = studentData.culturalData.culturalProfile;
    culturalInfo = `
CULTURAL BACKGROUND:
Cultural Background: ${profile.culturalBackground || 'Not specified'}
Language: ${profile.language || 'Not specified'}
Cultural Traditions: ${profile.traditions || 'Not specified'}
Cultural Values: ${profile.values || 'Not specified'}
`;
  }

  return `
Create an adapted 7-day learning plan for the following neurodiverse student based on their progress:

STUDENT INFORMATION:
Name: ${studentData.name}
Age: ${studentData.age}
Grade: ${studentData.grade}
Diagnosis/Condition: ${studentData.diagnosis}

LEARNING PROFILE:
Strengths: ${studentData.strengths || 'Not specified'}
Struggles: ${studentData.struggles || 'Not specified'}
${learningStyleInfo}
Attention Span: ${studentData.attentionSpan || 'Not specified'}
Interests & Motivators: ${studentData.interests || 'Not specified'}
${culturalInfo}

PROGRESS INFORMATION:
${weeklyProgressDetails}

WHAT WORKED WELL:
${progressData.whatWorked || 'Not specified'}

CHALLENGES ENCOUNTERED:
${progressData.challenges || 'Not specified'}

SUGGESTED NEXT STEPS:
${progressData.nextSteps || 'Not specified'}

OVERALL EFFECTIVENESS RATING:
${progressData.overallRating || 'Not specified'} out of 5

PREVIOUS PLAN SUMMARY:
${previousPlan.studentProfile || 'No previous plan available'}

Please create an updated 7-day learning plan that builds on what worked well and addresses the challenges. Include the following sections:

1. Student Profile: An updated summary of the student's learning profile based on progress data.

2. Learning Approach: Refined teaching approach based on what worked well and what didn't. Be specific about which strategies to continue, which to modify, and which to replace.

3. Daily Plans (for 7 days): For each day, create a structured schedule with:
   - Time blocks based on the student's attention span and engagement patterns
   - Subject focus for each block
   - Specific activities that leverage strengths, address challenges, and incorporate interests
   - Teaching methods/approaches for each activity that align with the student's learning style
   - Required materials or resources
   - Cultural adaptations where appropriate

4. Accommodations: Updated accommodations based on progress data, focusing on what was most effective.

5. Progress Monitoring: How to track and measure the student's progress, with adjustments based on previous monitoring results.

Format your response with clear headings for each section. Be specific and practical in your recommendations. Focus on evidence-based strategies for students with ${studentData.diagnosis}.

IMPORTANT: Make this adapted plan HIGHLY PERSONALIZED to ${studentData.name}'s specific needs, strengths, interests, and learning style, with particular attention to the progress data provided. The plan should clearly show how it has been adapted based on what worked well and what didn't in the previous implementation.
`;
};

/**
 * Build a prompt for searching educational resources
 * @param {string} needs - Description of student needs
 * @returns {string} Formatted prompt for search
 */
exports.buildResourceSearchPrompt = (needs) => {
  return `Find educational resources, tools, and materials for students with the following needs: ${needs}`;
};

/**
 * Build a prompt for searching teaching strategies
 * @param {string} challenge - Learning challenge description
 * @returns {string} Formatted prompt for search
 */
exports.buildStrategySearchPrompt = (challenge) => {
  return `Find evidence-based teaching strategies and interventions for students with: ${challenge}`;
};
