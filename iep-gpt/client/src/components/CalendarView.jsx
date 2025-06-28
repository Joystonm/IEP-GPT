import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaArrowLeft, FaArrowRight, FaEdit } from 'react-icons/fa';

const CalendarView = ({ learningPlan, onEditActivity }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  
  // Generate calendar days for the current week
  useEffect(() => {
    if (!learningPlan) return;
    
    const today = new Date(currentDate);
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)); // Start from Monday
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      // Map learning plan days to calendar days
      const planDay = learningPlan.dailyPlans[i];
      
      days.push({
        date,
        dayOfMonth: date.getDate(),
        dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
        isToday: date.toDateString() === new Date().toDateString(),
        planDay: planDay || null
      });
    }
    
    setCalendarDays(days);
  }, [currentDate, learningPlan]);
  
  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };
  
  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };
  
  const handleDragStart = (e, activity, dayIndex, blockIndex) => {
    setDraggedItem({ activity, dayIndex, blockIndex });
    e.dataTransfer.setData('text/plain', JSON.stringify({ dayIndex, blockIndex }));
    e.dataTransfer.effectAllowed = 'move';
  };
  
  const handleDragOver = (e, dayIndex, hour) => {
    e.preventDefault();
    setDropTarget({ dayIndex, hour });
  };
  
  const handleDrop = (e, targetDayIndex, targetHour) => {
    e.preventDefault();
    
    if (!draggedItem) return;
    
    const { activity, dayIndex, blockIndex } = draggedItem;
    
    // Here you would implement the logic to update the learning plan
    // For now, we'll just show an alert
    alert(`Moved "${activity.subject}" from Day ${dayIndex + 1} to Day ${targetDayIndex + 1} at ${targetHour}:00`);
    
    // Reset drag state
    setDraggedItem(null);
    setDropTarget(null);
    
    // Call the edit callback if provided
    if (onEditActivity) {
      onEditActivity({
        sourceDayIndex: dayIndex,
        sourceBlockIndex: blockIndex,
        targetDayIndex,
        targetHour
      });
    }
  };
  
  const handleDragEnd = () => {
    setDraggedItem(null);
    setDropTarget(null);
  };
  
  if (!learningPlan || !calendarDays.length) {
    return (
      <div className="calendar-placeholder">
        <FaCalendarAlt />
        <p>No learning plan available to display in calendar view.</p>
      </div>
    );
  }
  
  // Generate time slots for the calendar (8 AM to 6 PM)
  const timeSlots = [];
  for (let hour = 8; hour <= 18; hour++) {
    timeSlots.push({
      hour,
      label: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`
    });
  }
  
  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <h2>Weekly Schedule</h2>
        <div className="calendar-navigation">
          <button onClick={handlePreviousWeek} className="nav-button">
            <FaArrowLeft /> Previous Week
          </button>
          <span className="current-week">
            {calendarDays[0]?.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
            {calendarDays[6]?.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <button onClick={handleNextWeek} className="nav-button">
            Next Week <FaArrowRight />
          </button>
        </div>
      </div>
      
      <div className="calendar-grid">
        {/* Time column */}
        <div className="time-column">
          <div className="day-header"></div>
          {timeSlots.map((slot) => (
            <div key={`time-${slot.hour}`} className="time-slot">
              {slot.label}
            </div>
          ))}
        </div>
        
        {/* Day columns */}
        {calendarDays.map((day, dayIndex) => (
          <div key={`day-${dayIndex}`} className={`day-column ${day.isToday ? 'today' : ''}`}>
            <div className="day-header">
              <span className="day-name">{day.dayOfWeek}</span>
              <span className="day-number">{day.dayOfMonth}</span>
            </div>
            
            {timeSlots.map((slot) => {
              // Find activities that fall within this time slot
              const activities = day.planDay?.timeBlocks.filter(block => {
                const blockTime = block.time;
                // Simple parsing for time ranges like "9:00-10:00" or "Morning Block"
                if (blockTime.includes('-')) {
                  const startTime = parseInt(blockTime.split('-')[0].trim());
                  return startTime === slot.hour;
                } else if (blockTime.toLowerCase().includes('morning') && slot.hour >= 8 && slot.hour <= 11) {
                  return true;
                } else if (blockTime.toLowerCase().includes('afternoon') && slot.hour >= 12 && slot.hour <= 15) {
                  return true;
                } else if (blockTime.toLowerCase().includes('evening') && slot.hour >= 16) {
                  return true;
                }
                return false;
              });
              
              return (
                <div 
                  key={`slot-${dayIndex}-${slot.hour}`} 
                  className={`calendar-slot ${dropTarget && dropTarget.dayIndex === dayIndex && dropTarget.hour === slot.hour ? 'drop-target' : ''}`}
                  onDragOver={(e) => handleDragOver(e, dayIndex, slot.hour)}
                  onDrop={(e) => handleDrop(e, dayIndex, slot.hour)}
                >
                  {activities && activities.map((activity, blockIndex) => (
                    <div 
                      key={`activity-${dayIndex}-${blockIndex}`}
                      className="calendar-activity"
                      draggable
                      onDragStart={(e) => handleDragStart(e, activity, dayIndex, blockIndex)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="activity-header">
                        <span className="activity-subject">{activity.subject}</span>
                        <button 
                          className="edit-button"
                          onClick={() => onEditActivity && onEditActivity({ dayIndex, blockIndex })}
                        >
                          <FaEdit />
                        </button>
                      </div>
                      <div className="activity-content">
                        {activity.activity}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="calendar-instructions">
        <p><strong>Tip:</strong> Drag and drop activities to reschedule them. Click the edit icon to modify an activity.</p>
      </div>
    </div>
  );
};

export default CalendarView;
