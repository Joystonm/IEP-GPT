import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaArrowLeft, FaArrowRight, FaEdit, FaSave, FaCheck, FaPlus } from 'react-icons/fa';

const CalendarView = ({ learningPlan, calendarData, onCalendarUpdate }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [activities, setActivities] = useState([]);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  
  // Time slots for the calendar (8 AM to 5 PM)
  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];
  
  // Load activities from learning plan or existing calendar data
  useEffect(() => {
    if (calendarData && calendarData.activities && calendarData.activities.length > 0) {
      // Use existing calendar data if available
      setActivities(calendarData.activities);
    } else if (learningPlan && learningPlan.dailyPlans) {
      // Otherwise, initialize from learning plan
      const newActivities = [];
      
      learningPlan.dailyPlans.forEach((day, dayIndex) => {
        if (!day.timeBlocks) return;
        
        day.timeBlocks.forEach((block, blockIndex) => {
          // Convert day index to actual day of week (0 = Monday, 6 = Sunday)
          const dayOfWeek = dayIndex % 7;
          
          // Parse the time from the block
          let hour = 9; // Default hour if parsing fails
          
          if (block.time) {
            // Try to parse time formats like "9:00-9:30" or "9:00 AM - 9:30 AM"
            const timeMatch = block.time.match(/(\d+):(\d+)/);
            if (timeMatch) {
              hour = parseInt(timeMatch[1], 10);
              // Adjust for PM times
              if (block.time.toLowerCase().includes('pm') && hour < 12) {
                hour += 12;
              }
            }
          }
          
          // Ensure hour is within our time slots (8 AM to 5 PM)
          if (hour < 8) hour = 8;
          if (hour > 17) hour = 17;
          
          // Map to our time slot index (8 AM = 0, 9 AM = 1, etc.)
          const timeSlotIndex = hour - 8;
          
          newActivities.push({
            id: `activity-${dayIndex}-${blockIndex}`,
            subject: block.subject || 'General',
            description: block.activity || 'Learning activity',
            day: dayOfWeek,
            hour: timeSlotIndex,
            color: getSubjectColor(block.subject),
            approach: block.approach || '',
            materials: block.materials || ''
          });
        });
      });
      
      setActivities(newActivities);
    }
  }, [learningPlan, calendarData]);
  
  // Generate calendar days for the current week
  useEffect(() => {
    const today = new Date(currentDate);
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Start from Monday
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    setCalendarDays(days);
  }, [currentDate]);
  
  // Get a color for each subject
  const getSubjectColor = (subject) => {
    if (!subject) return '#6c757d';
    
    const subjectColors = {
      'Math': '#4a6fa5',
      'Reading': '#4cb5ae',
      'Science': '#f6ae2d',
      'Social Studies': '#f26419',
      'Writing': '#9c27b0',
      'Art': '#e91e63',
      'Technology': '#2196f3',
      'Morning Meeting': '#8bc34a',
      'Movement Break': '#ff9800'
    };
    
    // Check if the subject contains any of the keys
    for (const key in subjectColors) {
      if (subject.includes(key)) {
        return subjectColors[key];
      }
    }
    
    // If no match, use a hash-based color
    let hash = 0;
    for (let i = 0; i < subject.length; i++) {
      hash = subject.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 40%)`;
  };
  
  // Navigate to previous week
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };
  
  // Navigate to next week
  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };
  
  // Handle drag start
  const handleDragStart = (e, activity) => {
    setDraggedItem(activity);
  };
  
  // Handle drag over
  const handleDragOver = (e, day, hour) => {
    e.preventDefault();
    setDropTarget({ day, hour });
  };
  
  // Handle drop
  const handleDrop = (e, day, hour) => {
    e.preventDefault();
    
    if (!draggedItem) return;
    
    // Update the activity with new day and hour
    const updatedActivities = activities.map(activity => {
      if (activity.id === draggedItem.id) {
        return {
          ...activity,
          day,
          hour
        };
      }
      return activity;
    });
    
    setActivities(updatedActivities);
    setDraggedItem(null);
    setDropTarget(null);
    
    // Save the updated calendar data
    if (onCalendarUpdate) {
      onCalendarUpdate({
        activities: updatedActivities,
        lastUpdated: new Date().toISOString()
      });
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };
  
  // Handle edit activity
  const handleEditActivity = (activity) => {
    setEditingActivity({...activity});
  };
  
  // Handle save edited activity
  const handleSaveEditedActivity = () => {
    if (!editingActivity) return;
    
    const updatedActivities = activities.map(activity => {
      if (activity.id === editingActivity.id) {
        return editingActivity;
      }
      return activity;
    });
    
    setActivities(updatedActivities);
    
    // Save the updated calendar data
    if (onCalendarUpdate) {
      onCalendarUpdate({
        activities: updatedActivities,
        lastUpdated: new Date().toISOString()
      });
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    
    setEditingActivity(null);
  };
  
  // Handle add new activity
  const handleAddActivity = (day, hour) => {
    const newActivity = {
      id: `activity-new-${Date.now()}`,
      subject: 'New Activity',
      description: 'Description',
      day,
      hour,
      color: '#6c757d',
      approach: '',
      materials: ''
    };
    
    setEditingActivity(newActivity);
  };
  
  // Handle save new activity
  const handleSaveNewActivity = () => {
    if (!editingActivity) return;
    
    const updatedActivities = [...activities, editingActivity];
    setActivities(updatedActivities);
    
    // Save the updated calendar data
    if (onCalendarUpdate) {
      onCalendarUpdate({
        activities: updatedActivities,
        lastUpdated: new Date().toISOString()
      });
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    
    setEditingActivity(null);
  };
  
  // Handle delete activity
  const handleDeleteActivity = (activityId) => {
    const updatedActivities = activities.filter(activity => activity.id !== activityId);
    setActivities(updatedActivities);
    
    // Save the updated calendar data
    if (onCalendarUpdate) {
      onCalendarUpdate({
        activities: updatedActivities,
        lastUpdated: new Date().toISOString()
      });
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
    
    setEditingActivity(null);
  };
  
  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };
  
  // Save calendar data
  const handleSaveCalendar = () => {
    if (onCalendarUpdate) {
      onCalendarUpdate({
        activities,
        lastUpdated: new Date().toISOString()
      });
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <div className="calendar-navigation">
          <button className="nav-button" onClick={goToPreviousWeek}>
            <FaArrowLeft /> Previous Week
          </button>
          <span className="current-week">
            {calendarDays.length > 0 && (
              `${formatDate(calendarDays[0])} - ${formatDate(calendarDays[6])}`
            )}
          </span>
          <button className="nav-button" onClick={goToNextWeek}>
            Next Week <FaArrowRight />
          </button>
        </div>
        
        <button 
          className={`save-calendar-button ${saveSuccess ? 'success' : ''}`}
          onClick={handleSaveCalendar}
        >
          {saveSuccess ? <><FaCheck /> Saved!</> : <><FaSave /> Save Calendar</>}
        </button>
      </div>
      
      {/* Activity Editor Modal */}
      {editingActivity && (
        <div className="activity-editor-overlay">
          <div className="activity-editor">
            <h3>{editingActivity.id.includes('new') ? 'Add New Activity' : 'Edit Activity'}</h3>
            
            <div className="form-group">
              <label>Subject</label>
              <input 
                type="text" 
                value={editingActivity.subject} 
                onChange={(e) => setEditingActivity({...editingActivity, subject: e.target.value})}
              />
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea 
                value={editingActivity.description} 
                onChange={(e) => setEditingActivity({...editingActivity, description: e.target.value})}
                rows={3}
              />
            </div>
            
            <div className="form-group">
              <label>Approach</label>
              <textarea 
                value={editingActivity.approach} 
                onChange={(e) => setEditingActivity({...editingActivity, approach: e.target.value})}
                rows={2}
              />
            </div>
            
            <div className="form-group">
              <label>Materials</label>
              <textarea 
                value={editingActivity.materials} 
                onChange={(e) => setEditingActivity({...editingActivity, materials: e.target.value})}
                rows={2}
              />
            </div>
            
            <div className="form-group">
              <label>Color</label>
              <input 
                type="color" 
                value={editingActivity.color} 
                onChange={(e) => setEditingActivity({...editingActivity, color: e.target.value})}
              />
            </div>
            
            <div className="editor-actions">
              {editingActivity.id.includes('new') ? (
                <button className="primary-button" onClick={handleSaveNewActivity}>
                  <FaPlus /> Add Activity
                </button>
              ) : (
                <button className="primary-button" onClick={handleSaveEditedActivity}>
                  <FaSave /> Save Changes
                </button>
              )}
              
              {!editingActivity.id.includes('new') && (
                <button className="delete-button" onClick={() => handleDeleteActivity(editingActivity.id)}>
                  Delete Activity
                </button>
              )}
              
              <button className="secondary-button" onClick={() => setEditingActivity(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      {calendarDays.length > 0 ? (
        <div className="calendar-grid">
          {/* Time column */}
          <div className="time-column">
            <div className="day-header"></div>
            {timeSlots.map((time, index) => (
              <div key={index} className="time-slot">
                {time}
              </div>
            ))}
          </div>
          
          {/* Day columns */}
          {calendarDays.map((day, dayIndex) => (
            <div 
              key={dayIndex} 
              className={`day-column ${isToday(day) ? 'today' : ''}`}
            >
              <div className="day-header">
                <span className="day-name">
                  {day.toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
                <span className="day-number">{day.getDate()}</span>
              </div>
              
              {timeSlots.map((time, hourIndex) => {
                const activitiesForSlot = activities.filter(
                  activity => activity.day === dayIndex && activity.hour === hourIndex
                );
                
                return (
                  <div 
                    key={hourIndex} 
                    className={`calendar-slot ${
                      dropTarget && dropTarget.day === dayIndex && dropTarget.hour === hourIndex 
                        ? 'drop-target' 
                        : ''
                    }`}
                    onDragOver={(e) => handleDragOver(e, dayIndex, hourIndex)}
                    onDrop={(e) => handleDrop(e, dayIndex, hourIndex)}
                    onDoubleClick={() => handleAddActivity(dayIndex, hourIndex)}
                  >
                    {activitiesForSlot.map(activity => (
                      <div 
                        key={activity.id}
                        className="calendar-activity"
                        style={{ backgroundColor: activity.color }}
                        draggable
                        onDragStart={(e) => handleDragStart(e, activity)}
                      >
                        <div className="activity-header">
                          <span className="activity-subject">{activity.subject}</span>
                          <button 
                            className="edit-button"
                            onClick={() => handleEditActivity(activity)}
                          >
                            <FaEdit />
                          </button>
                        </div>
                        <div className="activity-content">
                          {activity.description}
                        </div>
                      </div>
                    ))}
                    
                    {activitiesForSlot.length === 0 && (
                      <div className="empty-slot-indicator">
                        <span className="add-activity-hint">Double-click to add</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      ) : (
        <div className="calendar-placeholder">
          <FaCalendarAlt />
          <p>Loading calendar...</p>
        </div>
      )}
      
      <div className="calendar-instructions">
        <p>
          <strong>Tips:</strong> 
          <ul>
            <li>Drag and drop activities to reschedule them</li>
            <li>Click the edit icon to modify activity details</li>
            <li>Double-click on an empty time slot to add a new activity</li>
          </ul>
        </p>
      </div>
    </div>
  );
};

export default CalendarView;
