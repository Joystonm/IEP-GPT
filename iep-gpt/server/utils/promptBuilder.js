/**
 * Utility for building prompts for the Groq API
 */

/**
 * Build a prompt for 7-day learning plan generation based on student data
 * @param {Object} studentData - Student information
 * @returns {string} Formatted prompt for Groq
 */
exports.buildIEPPrompt = (studentData) => {
  // Extract learning style description
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
      learningStyleDesc = studentData.learningStyle;
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
      attentionSpanDesc = studentData.attentionSpan;
  }

  return `
Create a comprehensive 7-day personalized learning plan for the following neurodiverse student:

STUDENT INFORMATION:
Name: ${studentData.name}
Age: ${studentData.age}
Grade: ${studentData.grade}
Diagnosis/Condition: ${studentData.diagnosis}${studentData.diagnosisOther ? ` (${studentData.diagnosisOther})` : ''}

LEARNING PROFILE:
Strengths: ${studentData.strengths}
Struggles: ${studentData.struggles}
Learning Style: ${learningStyleDesc}
Attention Span: ${attentionSpanDesc}
Known Triggers: ${studentData.triggers || 'None specified'}
Interests & Motivators: ${studentData.interests || 'None specified'}
Current Accommodations: ${studentData.currentAccommodations || 'None currently in place'}

Please create a detailed 7-day learning plan with the following sections:

1. Student Profile: A brief summary of the student's learning profile, including strengths, challenges, and learning style.

2. Learning Approach: Overall recommended teaching approach for this student, considering their diagnosis, learning style, and attention span.

3. Daily Plans (for 7 days): For each day, create a structured schedule with:
   - Time blocks based on the student's attention span
   - Subject focus for each block
   - Specific activities that leverage strengths and address challenges
   - Teaching methods/approaches for each activity
   - Required materials or resources

4. Accommodations: Specific classroom and testing accommodations that will help the student access the curriculum.

5. Progress Monitoring: How to track and measure the student's progress toward their learning goals.

Format your response with clear headings for each section. Be specific and practical in your recommendations. Focus on evidence-based strategies for students with ${studentData.diagnosis}.

For the daily plans, please structure each day with clear time blocks and ensure activities are engaging and appropriate for the student's age, grade level, and attention span.
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
  
  return `
Create an adapted 7-day learning plan for the following neurodiverse student based on their progress:

STUDENT INFORMATION:
Name: ${studentData.name}
Age: ${studentData.age}
Grade: ${studentData.grade}
Diagnosis/Condition: ${studentData.diagnosis}

LEARNING PROFILE:
Strengths: ${studentData.strengths}
Struggles: ${studentData.struggles}
Learning Style: ${studentData.learningStyle}
Attention Span: ${studentData.attentionSpan}

PROGRESS INFORMATION:
${progressData.weeklyProgress}

WHAT WORKED WELL:
${progressData.whatWorked || 'Not specified'}

WHAT DIDN'T WORK:
${progressData.challenges || 'Not specified'}

PREVIOUS PLAN SUMMARY:
${previousPlan.studentProfile || 'No previous plan available'}

Please create an updated 7-day learning plan that builds on what worked well and addresses the challenges. Include the following sections:

1. Student Profile: An updated summary of the student's learning profile based on progress.

2. Learning Approach: Refined teaching approach based on what worked well.

3. Daily Plans (for 7 days): For each day, create a structured schedule with:
   - Time blocks based on the student's attention span
   - Subject focus for each block
   - Specific activities that leverage strengths and address challenges
   - Teaching methods/approaches for each activity
   - Required materials or resources

4. Accommodations: Updated accommodations based on progress.

5. Progress Monitoring: How to track and measure the student's progress.

Format your response with clear headings for each section. Be specific and practical in your recommendations. Focus on evidence-based strategies for students with ${studentData.diagnosis}.
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
