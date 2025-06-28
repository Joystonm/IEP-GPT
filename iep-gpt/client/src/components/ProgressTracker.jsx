import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaMinusCircle, FaChartLine } from 'react-icons/fa';
import { updateStudentProgress } from '../services/api';

const ProgressTracker = ({ studentId, learningPlan, onProgressUpdate }) => {
  const [progressData, setProgressData] = useState({
    weeklyProgress: {},
    whatWorked: '',
    challenges: '',
    nextSteps: '',
    overallRating: 3
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  
  // Initialize progress data from learning plan if available
  useEffect(() => {
    if (learningPlan && learningPlan.dailyPlans) {
      const initialProgress = {};
      
      learningPlan.dailyPlans.forEach((day, dayIndex) => {
        initialProgress[`day${dayIndex + 1}`] = {};
        
        day.timeBlocks.forEach((block, blockIndex) => {
          initialProgress[`day${dayIndex + 1}`][`block${blockIndex + 1}`] = {
            completed: false,
            rating: 0,
            notes: ''
          };
        });
      });
      
      setProgressData(prev => ({
        ...prev,
        weeklyProgress: initialProgress
      }));
    }
  }, [learningPlan]);
  
  const handleProgressChange = (day, block, field, value) => {
    setProgressData(prev => ({
      ...prev,
      weeklyProgress: {
        ...prev.weeklyProgress,
        [day]: {
          ...prev.weeklyProgress[day],
          [block]: {
            ...prev.weeklyProgress[day][block],
            [field]: value
          }
        }
      }
    }));
  };
  
  const handleTextChange = (field, value) => {
    setProgressData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);
    
    try {
      await updateStudentProgress(studentId, progressData);
      setFeedback({
        type: 'success',
        message: 'Progress updated successfully!'
      });
      
      if (onProgressUpdate) {
        onProgressUpdate(progressData);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      setFeedback({
        type: 'error',
        message: 'Failed to update progress. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!learningPlan || !learningPlan.dailyPlans) {
    return <div className="no-plan-message">No learning plan available to track progress.</div>;
  }
  
  return (
    <div className="progress-tracker">
      <h2>Weekly Progress Tracker</h2>
      <p className="tracker-description">
        Track the student's progress through their 7-day learning plan to help generate more effective future plans.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="progress-days">
          {learningPlan.dailyPlans.map((day, dayIndex) => (
            <div key={`day-${dayIndex}`} className="progress-day">
              <h3>{day.title}</h3>
              
              <div className="time-block-progress">
                {day.timeBlocks.map((block, blockIndex) => {
                  const dayKey = `day${dayIndex + 1}`;
                  const blockKey = `block${blockIndex + 1}`;
                  const progressEntry = progressData.weeklyProgress[dayKey]?.[blockKey] || {
                    completed: false,
                    rating: 0,
                    notes: ''
                  };
                  
                  return (
                    <div key={`block-${blockIndex}`} className="block-progress-item">
                      <div className="block-info">
                        <div className="block-time">{block.time}</div>
                        <div className="block-subject">{block.subject}</div>
                      </div>
                      
                      <div className="block-progress-controls">
                        <div className="completion-toggle">
                          <label>
                            <input
                              type="checkbox"
                              checked={progressEntry.completed}
                              onChange={(e) => handleProgressChange(dayKey, blockKey, 'completed', e.target.checked)}
                            />
                            Completed
                          </label>
                        </div>
                        
                        <div className="engagement-rating">
                          <span>Engagement:</span>
                          <div className="rating-buttons">
                            <button
                              type="button"
                              className={progressEntry.rating === 1 ? 'active negative' : ''}
                              onClick={() => handleProgressChange(dayKey, blockKey, 'rating', 1)}
                            >
                              <FaTimesCircle /> Low
                            </button>
                            <button
                              type="button"
                              className={progressEntry.rating === 2 ? 'active neutral' : ''}
                              onClick={() => handleProgressChange(dayKey, blockKey, 'rating', 2)}
                            >
                              <FaMinusCircle /> Medium
                            </button>
                            <button
                              type="button"
                              className={progressEntry.rating === 3 ? 'active positive' : ''}
                              onClick={() => handleProgressChange(dayKey, blockKey, 'rating', 3)}
                            >
                              <FaCheckCircle /> High
                            </button>
                          </div>
                        </div>
                        
                        <div className="block-notes">
                          <textarea
                            placeholder="Notes about this activity..."
                            value={progressEntry.notes}
                            onChange={(e) => handleProgressChange(dayKey, blockKey, 'notes', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="overall-feedback">
          <h3>Weekly Reflection</h3>
          
          <div className="feedback-field">
            <label htmlFor="whatWorked">What worked well this week?</label>
            <textarea
              id="whatWorked"
              value={progressData.whatWorked}
              onChange={(e) => handleTextChange('whatWorked', e.target.value)}
              placeholder="Which activities, approaches, or strategies were most effective?"
            />
          </div>
          
          <div className="feedback-field">
            <label htmlFor="challenges">What challenges were encountered?</label>
            <textarea
              id="challenges"
              value={progressData.challenges}
              onChange={(e) => handleTextChange('challenges', e.target.value)}
              placeholder="What difficulties or obstacles did the student face?"
            />
          </div>
          
          <div className="feedback-field">
            <label htmlFor="nextSteps">Suggested next steps</label>
            <textarea
              id="nextSteps"
              value={progressData.nextSteps}
              onChange={(e) => handleTextChange('nextSteps', e.target.value)}
              placeholder="What would you like to focus on in the next learning plan?"
            />
          </div>
          
          <div className="overall-rating">
            <label>Overall progress this week:</label>
            <div className="rating-slider">
              <input
                type="range"
                min="1"
                max="5"
                value={progressData.overallRating}
                onChange={(e) => handleTextChange('overallRating', parseInt(e.target.value))}
              />
              <div className="rating-labels">
                <span>Needs improvement</span>
                <span>Excellent</span>
              </div>
            </div>
          </div>
        </div>
        
        {feedback && (
          <div className={`feedback-message ${feedback.type}`}>
            {feedback.message}
          </div>
        )}
        
        <div className="form-actions">
          <button type="submit" className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Progress'}
          </button>
          <button 
            type="button" 
            className="secondary-button"
            onClick={() => onProgressUpdate && onProgressUpdate(progressData)}
          >
            <FaChartLine /> Generate Progress Report
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProgressTracker;
