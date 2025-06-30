import React, { useState, useEffect } from 'react';
import { FaChartBar, FaCheck, FaArrowRight, FaLightbulb, FaInfoCircle, FaRedo } from 'react-icons/fa';

/**
 * Learning Style Assessment Component
 * 
 * A visual, interactive tool to assess a student's learning style preferences
 * using research-based questions and adaptive scoring.
 */
const LearningStyleAssessment = ({ onComplete, studentData, existingResults }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [showExistingResults, setShowExistingResults] = useState(false);

  // Check if we have existing results
  useEffect(() => {
    if (existingResults) {
      setShowExistingResults(true);
      setResults(existingResults.learningStyleResults);
    }
  }, [existingResults]);

  // Learning style categories
  const learningStyles = {
    visual: { name: "Visual", score: 0, color: "#4a6fa5", icon: "👁️" },
    auditory: { name: "Auditory", score: 0, color: "#4cb5ae", icon: "👂" },
    kinesthetic: { name: "Kinesthetic", score: 0, color: "#f6ae2d", icon: "👐" },
    reading: { name: "Reading/Writing", score: 0, color: "#f26419", icon: "📝" }
  };

  // Research-based assessment questions
  const questions = [
    {
      text: "When learning something new, the student prefers to:",
      options: [
        { text: "See diagrams or demonstrations", style: "visual", weight: 3 },
        { text: "Listen to explanations", style: "auditory", weight: 3 },
        { text: "Try it hands-on", style: "kinesthetic", weight: 3 },
        { text: "Read instructions or write notes", style: "reading", weight: 3 }
      ]
    },
    {
      text: "When concentrating, the student is most distracted by:",
      options: [
        { text: "Visual disorder or movement", style: "visual", weight: 2 },
        { text: "Noises or sounds", style: "auditory", weight: 2 },
        { text: "Physical discomfort or need to move", style: "kinesthetic", weight: 2 },
        { text: "Disorganized text or materials", style: "reading", weight: 2 }
      ]
    },
    {
      text: "When explaining something to others, the student tends to:",
      options: [
        { text: "Show pictures or diagrams", style: "visual", weight: 2 },
        { text: "Explain verbally in detail", style: "auditory", weight: 2 },
        { text: "Demonstrate or use gestures", style: "kinesthetic", weight: 2 },
        { text: "Write it down or refer to written materials", style: "reading", weight: 2 }
      ]
    },
    {
      text: "When remembering information, the student most easily recalls:",
      options: [
        { text: "Visual details and images", style: "visual", weight: 3 },
        { text: "Things they've heard or discussed", style: "auditory", weight: 3 },
        { text: "Activities they've performed", style: "kinesthetic", weight: 3 },
        { text: "Notes they've written or read", style: "reading", weight: 3 }
      ]
    },
    {
      text: "When solving problems, the student prefers to:",
      options: [
        { text: "Visualize or draw the problem", style: "visual", weight: 2 },
        { text: "Talk through the problem", style: "auditory", weight: 2 },
        { text: "Use physical objects or movement", style: "kinesthetic", weight: 2 },
        { text: "Make lists or follow written steps", style: "reading", weight: 2 }
      ]
    },
    {
      text: "During free time, the student often chooses to:",
      options: [
        { text: "Watch videos or look at pictures", style: "visual", weight: 1 },
        { text: "Listen to music or talk with others", style: "auditory", weight: 1 },
        { text: "Play sports or do crafts", style: "kinesthetic", weight: 1 },
        { text: "Read books or write stories", style: "reading", weight: 1 }
      ]
    },
    {
      text: "When giving directions, the student typically:",
      options: [
        { text: "Draws a map or shows pictures", style: "visual", weight: 2 },
        { text: "Gives verbal instructions", style: "auditory", weight: 2 },
        { text: "Takes you there or gestures", style: "kinesthetic", weight: 2 },
        { text: "Writes down the directions", style: "reading", weight: 2 }
      ]
    },
    {
      text: "When the student is angry or excited, they tend to:",
      options: [
        { text: "Show facial expressions but stay quiet", style: "visual", weight: 1 },
        { text: "Express feelings verbally", style: "auditory", weight: 1 },
        { text: "Use body language or physical expression", style: "kinesthetic", weight: 1 },
        { text: "Write about feelings or read to calm down", style: "reading", weight: 1 }
      ]
    },
    {
      text: "When learning math concepts, the student does best with:",
      options: [
        { text: "Visual models and graphs", style: "visual", weight: 2 },
        { text: "Verbal explanations and discussions", style: "auditory", weight: 2 },
        { text: "Manipulatives and hands-on examples", style: "kinesthetic", weight: 2 },
        { text: "Written problems and formulas", style: "reading", weight: 2 }
      ]
    },
    {
      text: "When recalling a past event, the student typically:",
      options: [
        { text: "Remembers how things looked", style: "visual", weight: 2 },
        { text: "Remembers conversations and sounds", style: "auditory", weight: 2 },
        { text: "Remembers actions and feelings", style: "kinesthetic", weight: 2 },
        { text: "Remembers written details or notes", style: "reading", weight: 2 }
      ]
    }
  ];

  // Update progress bar as user advances through questions
  useEffect(() => {
    const newProgress = ((currentQuestion) / questions.length) * 100;
    setProgressPercent(newProgress);
  }, [currentQuestion, questions.length]);

  // Handle answer selection
  const handleAnswerSelect = (optionIndex) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    const selectedOption = questions[currentQuestion].options[optionIndex];
    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);
    
    // Animate transition to next question
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        calculateResults(newAnswers);
      }
      setIsAnimating(false);
    }, 500);
  };

  // Calculate learning style results based on answers
  const calculateResults = (finalAnswers) => {
    const styles = { ...learningStyles };
    
    finalAnswers.forEach(answer => {
      styles[answer.style].score += answer.weight;
    });
    
    // Calculate percentages
    const totalScore = Object.values(styles).reduce((sum, style) => sum + style.score, 0);
    
    Object.keys(styles).forEach(key => {
      styles[key].percentage = Math.round((styles[key].score / totalScore) * 100);
    });
    
    // Sort styles by score (highest first)
    const sortedStyles = Object.keys(styles)
      .map(key => ({
        id: key,
        ...styles[key]
      }))
      .sort((a, b) => b.score - a.score);
    
    // Determine primary and secondary styles
    const primaryStyle = sortedStyles[0];
    const secondaryStyle = sortedStyles[1];
    
    // Generate recommendations based on learning styles
    const recommendations = generateRecommendations(primaryStyle.id, secondaryStyle.id);
    
    setResults({
      styles: sortedStyles,
      primaryStyle,
      secondaryStyle,
      recommendations
    });
    
    setShowResults(true);
    setShowExistingResults(false);
  };

  // Generate personalized recommendations based on learning styles
  const generateRecommendations = (primary, secondary) => {
    const recommendations = {
      strategies: [],
      activities: [],
      accommodations: []
    };
    
    // Strategies based on primary learning style
    switch (primary) {
      case 'visual':
        recommendations.strategies = [
          "Use color-coding for organizing information",
          "Provide visual schedules and checklists",
          "Use graphic organizers and mind maps",
          "Include diagrams, charts, and pictures in lessons",
          "Demonstrate concepts with visual models"
        ];
        recommendations.activities = [
          "Create visual timelines for projects",
          "Use drawing to represent concepts",
          "Watch educational videos on topics",
          "Create visual flashcards for review",
          "Use visual note-taking techniques"
        ];
        recommendations.accommodations = [
          "Provide written instructions with visual cues",
          "Allow use of visual timers",
          "Reduce visual clutter in learning environment",
          "Offer visual alternatives to written assignments",
          "Use highlighters for important information"
        ];
        break;
      case 'auditory':
        recommendations.strategies = [
          "Use verbal instructions and explanations",
          "Incorporate discussion-based learning",
          "Read content aloud or use audiobooks",
          "Use rhythmic mnemonics and songs",
          "Encourage verbal repetition of key concepts"
        ];
        recommendations.activities = [
          "Record lessons for later review",
          "Participate in group discussions",
          "Create songs or rhymes about content",
          "Use verbal question-and-answer sessions",
          "Listen to educational podcasts"
        ];
        recommendations.accommodations = [
          "Provide verbal instructions",
          "Allow verbal responses instead of written",
          "Use noise-cancelling headphones when needed",
          "Offer quiet spaces for focused listening",
          "Allow audio recording of assignments"
        ];
        break;
      case 'kinesthetic':
        recommendations.strategies = [
          "Incorporate hands-on activities and manipulatives",
          "Use movement breaks between learning activities",
          "Create physical models of concepts",
          "Allow fidget tools during seated work",
          "Teach through games and physical activities"
        ];
        recommendations.activities = [
          "Build models to demonstrate understanding",
          "Use role-play and simulations",
          "Create physical timelines or sequences",
          "Take field trips related to content",
          "Use manipulatives for math concepts"
        ];
        recommendations.accommodations = [
          "Allow standing or movement while working",
          "Provide fidget tools and sensory items",
          "Break learning into active, shorter sessions",
          "Offer alternative seating options",
          "Allow breaks for physical movement"
        ];
        break;
      case 'reading':
        recommendations.strategies = [
          "Provide written instructions and materials",
          "Encourage note-taking and journaling",
          "Use written outlines and lists",
          "Assign reading materials with comprehension questions",
          "Encourage written summaries of learning"
        ];
        recommendations.activities = [
          "Create written study guides",
          "Keep a learning journal or log",
          "Write summaries of concepts",
          "Use workbooks and written exercises",
          "Create written plans before projects"
        ];
        recommendations.accommodations = [
          "Provide written instructions",
          "Allow extra time for reading and writing",
          "Offer templates for written work",
          "Provide access to word processing tools",
          "Allow written responses for assessments"
        ];
        break;
      default:
        break;
    }
    
    // Add some recommendations based on secondary style
    switch (secondary) {
      case 'visual':
        recommendations.strategies.push("Supplement with visual aids and diagrams");
        recommendations.activities.push("Create visual representations of written content");
        break;
      case 'auditory':
        recommendations.strategies.push("Include opportunities for discussion and verbal processing");
        recommendations.activities.push("Verbally explain concepts after reading or writing about them");
        break;
      case 'kinesthetic':
        recommendations.strategies.push("Add hands-on components to reading/writing activities");
        recommendations.activities.push("Take movement breaks between reading/writing tasks");
        break;
      case 'reading':
        recommendations.strategies.push("Provide written summaries of visual or verbal information");
        recommendations.activities.push("Keep written records of hands-on or discussion activities");
        break;
      default:
        break;
    }
    
    return recommendations;
  };

  // Handle completion of assessment
  const handleComplete = () => {
    if (onComplete) {
      onComplete({
        learningStyleResults: results,
        primaryLearningStyle: results.primaryStyle.id,
        secondaryLearningStyle: results.secondaryStyle.id,
        recommendations: results.recommendations
      });
    }
  };

  // Restart the assessment
  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setResults(null);
    setShowResults(false);
    setShowExistingResults(false);
  };

  // Start a new assessment when there are existing results
  const handleStartNewAssessment = () => {
    setShowExistingResults(false);
    setCurrentQuestion(0);
    setAnswers([]);
  };

  // Render existing results
  const renderExistingResults = () => {
    if (!results) return null;
    
    return (
      <div className="results-container">
        <div className="existing-results-header">
          <h3 className="results-title">
            <FaChartBar /> Existing Learning Style Profile
          </h3>
          <button className="secondary-button" onClick={handleStartNewAssessment}>
            <FaRedo /> Take New Assessment
          </button>
        </div>
        
        <div className="results-summary">
          <p>
            Based on previous assessment, {studentData?.name || "the student"} has a 
            <strong> {results.primaryStyle.name} </strong> 
            primary learning style, with a 
            <strong> {results.secondaryStyle.name} </strong> 
            secondary preference.
          </p>
        </div>
        
        <div className="style-bars-container">
          {results.styles.map((style) => (
            <div key={style.id} className="style-bar-item">
              <div className="style-label">
                <span className="style-icon">{style.icon}</span>
                <span>{style.name}</span>
              </div>
              <div className="style-bar-wrapper">
                <div 
                  className="style-bar-fill" 
                  style={{ 
                    width: `${style.percentage}%`,
                    backgroundColor: style.color 
                  }}
                ></div>
              </div>
              <div className="style-percentage">{style.percentage}%</div>
            </div>
          ))}
        </div>
        
        <div className="recommendations-section">
          <h3>Recommended Teaching Strategies</h3>
          <div className="recommendations-list">
            {results.recommendations.strategies.slice(0, 5).map((strategy, index) => (
              <div key={index} className="recommendation-item">
                <FaCheck className="check-icon" /> {strategy}
              </div>
            ))}
          </div>
          
          <h3>Suggested Activities</h3>
          <div className="recommendations-list">
            {results.recommendations.activities.slice(0, 5).map((activity, index) => (
              <div key={index} className="recommendation-item">
                <FaCheck className="check-icon" /> {activity}
              </div>
            ))}
          </div>
          
          <h3>Helpful Accommodations</h3>
          <div className="recommendations-list">
            {results.recommendations.accommodations.slice(0, 5).map((accommodation, index) => (
              <div key={index} className="recommendation-item">
                <FaCheck className="check-icon" /> {accommodation}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="learning-style-assessment">
      <div className="assessment-header">
        <h2><FaLightbulb /> Learning Style Assessment</h2>
        <p className="assessment-description">
          This research-based assessment helps identify how {studentData?.name || "the student"} learns best. 
          Answer the questions based on your observations of the student's preferences and behaviors.
        </p>
      </div>
      
      {showExistingResults ? (
        renderExistingResults()
      ) : !showResults ? (
        <div className="assessment-container">
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className="progress-text">
              Question {currentQuestion + 1} of {questions.length}
            </div>
          </div>
          
          <div className={`question-container ${isAnimating ? 'fade-out' : 'fade-in'}`}>
            <h3 className="question-text">{questions[currentQuestion].text}</h3>
            
            <div className="options-container">
              {questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  className={`option-button ${option.style}`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="results-container">
          <h3 className="results-title">
            <FaChartBar /> Learning Style Profile
          </h3>
          
          <div className="results-summary">
            <p>
              Based on your responses, {studentData?.name || "the student"} has a 
              <strong> {results.primaryStyle.name} </strong> 
              primary learning style, with a 
              <strong> {results.secondaryStyle.name} </strong> 
              secondary preference.
            </p>
          </div>
          
          <div className="style-bars-container">
            {results.styles.map((style) => (
              <div key={style.id} className="style-bar-item">
                <div className="style-label">
                  <span className="style-icon">{style.icon}</span>
                  <span>{style.name}</span>
                </div>
                <div className="style-bar-wrapper">
                  <div 
                    className="style-bar-fill" 
                    style={{ 
                      width: `${style.percentage}%`,
                      backgroundColor: style.color 
                    }}
                  ></div>
                </div>
                <div className="style-percentage">{style.percentage}%</div>
              </div>
            ))}
          </div>
          
          <div className="recommendations-section">
            <h3>Recommended Teaching Strategies</h3>
            <div className="recommendations-list">
              {results.recommendations.strategies.slice(0, 5).map((strategy, index) => (
                <div key={index} className="recommendation-item">
                  <FaCheck className="check-icon" /> {strategy}
                </div>
              ))}
            </div>
            
            <h3>Suggested Activities</h3>
            <div className="recommendations-list">
              {results.recommendations.activities.slice(0, 5).map((activity, index) => (
                <div key={index} className="recommendation-item">
                  <FaCheck className="check-icon" /> {activity}
                </div>
              ))}
            </div>
            
            <h3>Helpful Accommodations</h3>
            <div className="recommendations-list">
              {results.recommendations.accommodations.slice(0, 5).map((accommodation, index) => (
                <div key={index} className="recommendation-item">
                  <FaCheck className="check-icon" /> {accommodation}
                </div>
              ))}
            </div>
          </div>
          
          <div className="info-box">
            <FaInfoCircle className="info-icon" />
            <p>
              This assessment is based on VARK (Visual, Auditory, Reading/Writing, Kinesthetic) 
              learning style theory and adapted for educational planning. While learning styles 
              provide helpful insights, effective instruction typically combines multiple approaches.
            </p>
          </div>
          
          <div className="results-actions">
            <button className="primary-button" onClick={handleComplete}>
              Apply to Learning Plan <FaArrowRight />
            </button>
            <button className="secondary-button" onClick={handleRestart}>
              Restart Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningStyleAssessment;
