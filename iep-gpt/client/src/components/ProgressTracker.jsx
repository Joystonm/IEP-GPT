import React, { useState, useEffect, useCallback } from 'react';
import { FaCheckCircle, FaTimesCircle, FaMinusCircle, FaChartLine, FaCheck } from 'react-icons/fa';
import { updateStudentProgress } from '../services/api';

const ProgressTracker = ({ studentId, learningPlan, onProgressUpdate, existingProgress }) => {
  const [progressData, setProgressData] = useState({
    weeklyProgress: {},
    whatWorked: '',
    challenges: '',
    nextSteps: '',
    overallRating: 3,
    lastUpdated: new Date().toISOString()
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  
  // Initialize progress data from existing progress or learning plan if available
  useEffect(() => {
    if (existingProgress) {
      // Use existing progress data if available
      setProgressData(existingProgress);
    } else if (learningPlan && learningPlan.dailyPlans) {
      // Otherwise initialize from learning plan
      const initialProgress = {};
      
      learningPlan.dailyPlans.forEach((day, dayIndex) => {
        initialProgress[`day${dayIndex + 1}`] = {
          blocks: day.timeBlocks ? day.timeBlocks.map(() => ({
            completed: false,
            engagement: 'neutral',
            notes: ''
          })) : []
        };
      });
      
      setProgressData(prev => ({
        ...prev,
        weeklyProgress: initialProgress
      }));
    }
  }, [learningPlan, existingProgress]);
  
  // Handle completion toggle for a time block with debounce
  const handleCompletionToggle = useCallback((dayIndex, blockIndex) => {
    const dayKey = `day${dayIndex + 1}`;
    
    setProgressData(prev => {
      const updatedWeeklyProgress = { ...prev.weeklyProgress };
      
      if (!updatedWeeklyProgress[dayKey]) {
        updatedWeeklyProgress[dayKey] = {
          blocks: []
        };
      }
      
      if (!updatedWeeklyProgress[dayKey].blocks[blockIndex]) {
        updatedWeeklyProgress[dayKey].blocks[blockIndex] = {
          completed: false,
          engagement: 'neutral',
          notes: ''
        };
      }
      
      const newCompleted = !updatedWeeklyProgress[dayKey].blocks[blockIndex].completed;
      
      updatedWeeklyProgress[dayKey].blocks[blockIndex] = {
        ...updatedWeeklyProgress[dayKey].blocks[blockIndex],
        completed: newCompleted
      };
      
      return {
        ...prev,
        weeklyProgress: updatedWeeklyProgress,
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);
  
  // Handle engagement rating for a time block
  const handleEngagementRating = useCallback((dayIndex, blockIndex, rating) => {
    const dayKey = `day${dayIndex + 1}`;
    
    setProgressData(prev => {
      const updatedWeeklyProgress = { ...prev.weeklyProgress };
      
      if (!updatedWeeklyProgress[dayKey]) {
        updatedWeeklyProgress[dayKey] = {
          blocks: []
        };
      }
      
      if (!updatedWeeklyProgress[dayKey].blocks[blockIndex]) {
        updatedWeeklyProgress[dayKey].blocks[blockIndex] = {
          completed: false,
          engagement: 'neutral',
          notes: ''
        };
      }
      
      updatedWeeklyProgress[dayKey].blocks[blockIndex] = {
        ...updatedWeeklyProgress[dayKey].blocks[blockIndex],
        engagement: rating
      };
      
      return {
        ...prev,
        weeklyProgress: updatedWeeklyProgress,
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);
  
  // Handle notes for a time block
  const handleNotesChange = useCallback((dayIndex, blockIndex, notes) => {
    const dayKey = `day${dayIndex + 1}`;
    
    setProgressData(prev => {
      const updatedWeeklyProgress = { ...prev.weeklyProgress };
      
      if (!updatedWeeklyProgress[dayKey]) {
        updatedWeeklyProgress[dayKey] = {
          blocks: []
        };
      }
      
      if (!updatedWeeklyProgress[dayKey].blocks[blockIndex]) {
        updatedWeeklyProgress[dayKey].blocks[blockIndex] = {
          completed: false,
          engagement: 'neutral',
          notes: ''
        };
      }
      
      updatedWeeklyProgress[dayKey].blocks[blockIndex] = {
        ...updatedWeeklyProgress[dayKey].blocks[blockIndex],
        notes
      };
      
      return {
        ...prev,
        weeklyProgress: updatedWeeklyProgress,
        lastUpdated: new Date().toISOString()
      };
    });
  }, []);
  
  // Handle overall feedback fields
  const handleFeedbackChange = useCallback((e) => {
    const { name, value } = e.target;
    
    setProgressData(prev => ({
      ...prev,
      [name]: value,
      lastUpdated: new Date().toISOString()
    }));
  }, []);
  
  // Submit progress data
  const handleSubmitProgress = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    
    try {
      // Calculate completion percentage
      const totalBlocks = Object.values(progressData.weeklyProgress).reduce(
        (total, day) => total + (day.blocks ? day.blocks.length : 0), 
        0
      );
      
      const completedBlocks = Object.values(progressData.weeklyProgress).reduce(
        (total, day) => {
          if (!day.blocks) return total;
          return total + day.blocks.filter(block => block && block.completed).length;
        }, 
        0
      );
      
      const completionPercentage = totalBlocks > 0 
        ? Math.round((completedBlocks / totalBlocks) * 100) 
        : 0;
      
      // Add completion percentage and timestamp to progress data
      const finalProgressData = {
        ...progressData,
        completionPercentage,
        submittedAt: new Date().toISOString()
      };
      
      // Call the API to update student progress
      if (onProgressUpdate) {
        await onProgressUpdate(finalProgressData);
      }
      
      setFeedback({
        type: 'success',
        message: 'Progress data saved successfully!'
      });
      
      // Update last saved timestamp
      setLastSaved(new Date());
      
      // Reset feedback after 3 seconds
      setTimeout(() => {
        setFeedback(null);
      }, 3000);
    } catch (error) {
      console.error('Error submitting progress:', error);
      
      setFeedback({
        type: 'error',
        message: 'Failed to save progress data. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Auto-save progress data when it changes
  const debouncedSave = useCallback(
    debounce((data) => {
      if (autoSaveEnabled && onProgressUpdate) {
        onProgressUpdate(data)
          .then(() => {
            setLastSaved(new Date());
          })
          .catch(error => {
            console.error('Error auto-saving progress:', error);
          });
      }
    }, 2000),
    [autoSaveEnabled, onProgressUpdate]
  );
  
  // Call debounced save when progress data changes
  useEffect(() => {
    if (Object.keys(progressData.weeklyProgress).length > 0) {
      debouncedSave(progressData);
    }
    
    return () => {
      debouncedSave.cancel();
    };
  }, [progressData, debouncedSave]);
  
  // Calculate completion statistics
  const calculateStats = () => {
    const stats = {
      totalBlocks: 0,
      completedBlocks: 0,
      positiveEngagement: 0,
      neutralEngagement: 0,
      negativeEngagement: 0
    };
    
    Object.values(progressData.weeklyProgress).forEach(day => {
      if (!day.blocks) return;
      
      day.blocks.forEach(block => {
        if (!block) return;
        
        stats.totalBlocks++;
        
        if (block.completed) {
          stats.completedBlocks++;
        }
        
        if (block.engagement === 'positive') {
          stats.positiveEngagement++;
        } else if (block.engagement === 'neutral') {
          stats.neutralEngagement++;
        } else if (block.engagement === 'negative') {
          stats.negativeEngagement++;
        }
      });
    });
    
    stats.completionPercentage = stats.totalBlocks > 0 
      ? Math.round((stats.completedBlocks / stats.totalBlocks) * 100) 
      : 0;
    
    return stats;
  };
  
  const stats = calculateStats();

  return (
    <div className="progress-tracker">
      <div className="tracker-description">
        <p>
          Track progress through the learning plan to identify what's working well and where adjustments 
          are needed. This information will help generate more effective future plans.
        </p>
        
        {existingProgress && (
          <div className="existing-progress-info">
            <FaCheck className="check-icon" />
            <span>Progress data last updated: {new Date(existingProgress.lastUpdated).toLocaleString()}</span>
          </div>
        )}
        
        {lastSaved && (
          <div className="auto-save-info">
            <FaCheck className="check-icon" />
            <span>Auto-saved: {lastSaved.toLocaleString()}</span>
            <label className="auto-save-toggle">
              <input
                type="checkbox"
                checked={autoSaveEnabled}
                onChange={() => setAutoSaveEnabled(!autoSaveEnabled)}
              />
              Auto-save
            </label>
          </div>
        )}
      </div>
      
      <div className="progress-stats">
        <div className="stat-item completion">
          <div className="stat-label">Completion</div>
          <div className="stat-value">{stats.completionPercentage}%</div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${stats.completionPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="stat-item engagement">
          <div className="stat-label">Engagement</div>
          <div className="engagement-bars">
            <div className="engagement-bar positive">
              <div className="bar-label">Positive</div>
              <div className="bar-container">
                <div 
                  className="bar-fill" 
                  style={{ 
                    width: stats.totalBlocks > 0 
                      ? `${(stats.positiveEngagement / stats.totalBlocks) * 100}%` 
                      : '0%' 
                  }}
                ></div>
              </div>
              <div className="bar-value">{stats.positiveEngagement}</div>
            </div>
            <div className="engagement-bar neutral">
              <div className="bar-label">Neutral</div>
              <div className="bar-container">
                <div 
                  className="bar-fill" 
                  style={{ 
                    width: stats.totalBlocks > 0 
                      ? `${(stats.neutralEngagement / stats.totalBlocks) * 100}%` 
                      : '0%' 
                  }}
                ></div>
              </div>
              <div className="bar-value">{stats.neutralEngagement}</div>
            </div>
            <div className="engagement-bar negative">
              <div className="bar-label">Negative</div>
              <div className="bar-container">
                <div 
                  className="bar-fill" 
                  style={{ 
                    width: stats.totalBlocks > 0 
                      ? `${(stats.negativeEngagement / stats.totalBlocks) * 100}%` 
                      : '0%' 
                  }}
                ></div>
              </div>
              <div className="bar-value">{stats.negativeEngagement}</div>
            </div>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmitProgress}>
        {learningPlan && learningPlan.dailyPlans && learningPlan.dailyPlans.map((day, dayIndex) => {
          if (!day || !day.timeBlocks) return null;
          
          return (
            <div key={dayIndex} className="progress-day">
              <h3>{day.title || `Day ${dayIndex + 1}`}</h3>
              
              <div className="time-block-progress">
                {day.timeBlocks.map((block, blockIndex) => {
                  if (!block) return null;
                  
                  const dayKey = `day${dayIndex + 1}`;
                  const blockProgress = progressData.weeklyProgress[dayKey]?.blocks?.[blockIndex] || {
                    completed: false,
                    engagement: 'neutral',
                    notes: ''
                  };
                  
                  return (
                    <div key={blockIndex} className="block-progress-item">
                      <div className="block-info">
                        <span className="block-time">{block.time || 'Time not specified'}</span>
                        <span className="block-subject">{block.subject || 'Subject not specified'}</span>
                      </div>
                      
                      <div className="block-activity">
                        {block.activity || 'Activity not specified'}
                      </div>
                      
                      <div className="block-progress-controls">
                        <div className="completion-toggle">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              checked={blockProgress.completed || false}
                              onChange={() => handleCompletionToggle(dayIndex, blockIndex)}
                            />
                            <span className="checkbox-text">Completed</span>
                          </label>
                        </div>
                        
                        <div className="engagement-rating">
                          <label>Engagement Level:</label>
                          <div className="rating-buttons">
                            <button
                              type="button"
                              className={`${blockProgress.engagement === 'positive' ? 'active positive' : ''}`}
                              onClick={() => handleEngagementRating(dayIndex, blockIndex, 'positive')}
                            >
                              <FaCheckCircle /> High
                            </button>
                            <button
                              type="button"
                              className={`${blockProgress.engagement === 'neutral' ? 'active neutral' : ''}`}
                              onClick={() => handleEngagementRating(dayIndex, blockIndex, 'neutral')}
                            >
                              <FaMinusCircle /> Medium
                            </button>
                            <button
                              type="button"
                              className={`${blockProgress.engagement === 'negative' ? 'active negative' : ''}`}
                              onClick={() => handleEngagementRating(dayIndex, blockIndex, 'negative')}
                            >
                              <FaTimesCircle /> Low
                            </button>
                          </div>
                        </div>
                        
                        <div className="block-notes">
                          <label>Notes:</label>
                          <textarea
                            value={blockProgress.notes || ''}
                            onChange={(e) => handleNotesChange(dayIndex, blockIndex, e.target.value)}
                            placeholder="Add notes about this activity..."
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        
        <div className="overall-feedback">
          <h3>Overall Weekly Feedback</h3>
          
          <div className="feedback-field">
            <label htmlFor="whatWorked">What worked well this week?</label>
            <textarea
              id="whatWorked"
              name="whatWorked"
              value={progressData.whatWorked || ''}
              onChange={handleFeedbackChange}
              placeholder="Describe strategies, activities, or approaches that were particularly effective..."
            />
          </div>
          
          <div className="feedback-field">
            <label htmlFor="challenges">Challenges encountered:</label>
            <textarea
              id="challenges"
              name="challenges"
              value={progressData.challenges || ''}
              onChange={handleFeedbackChange}
              placeholder="Describe any difficulties or obstacles faced during implementation..."
            />
          </div>
          
          <div className="feedback-field">
            <label htmlFor="nextSteps">Suggested next steps:</label>
            <textarea
              id="nextSteps"
              name="nextSteps"
              value={progressData.nextSteps || ''}
              onChange={handleFeedbackChange}
              placeholder="Recommend adjustments or focus areas for the coming week..."
            />
          </div>
          
          <div className="overall-rating">
            <label htmlFor="overallRating">Overall effectiveness of this week's plan:</label>
            <input
              type="range"
              id="overallRating"
              name="overallRating"
              min="1"
              max="5"
              value={progressData.overallRating || 3}
              onChange={handleFeedbackChange}
              className="rating-slider"
            />
            <div className="rating-labels">
              <span>Not effective</span>
              <span>Somewhat effective</span>
              <span>Very effective</span>
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              className="primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Progress'}
            </button>
            
            <label className="generate-adapted-plan">
              <input
                type="checkbox"
                name="generateAdaptedPlan"
                checked={progressData.generateAdaptedPlan || false}
                onChange={(e) => {
                  setProgressData(prev => ({
                    ...prev,
                    generateAdaptedPlan: e.target.checked,
                    lastUpdated: new Date().toISOString()
                  }));
                }}
              />
              Generate adapted plan based on progress
            </label>
          </div>
          
          {feedback && (
            <div className={`feedback-message ${feedback.type}`}>
              {feedback.message}
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

// Debounce function to prevent too many API calls
function debounce(func, wait) {
  let timeout;
  
  const debounced = function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
  
  debounced.cancel = function() {
    clearTimeout(timeout);
  };
  
  return debounced;
}

export default ProgressTracker;
