import React, { useState } from 'react';
import { FaDownload, FaShare, FaSave, FaPrint, FaCalendarAlt } from 'react-icons/fa';

const IEPPlanDisplay = ({ plan }) => {
  const [activeDay, setActiveDay] = useState(0);
  
  if (!plan) {
    return null;
  }

  // Function to handle downloading as PDF
  const handleDownload = () => {
    // PDF generation would be implemented here
    alert('Downloading PDF...');
  };

  // Function to handle sharing
  const handleShare = () => {
    // Sharing functionality would be implemented here
    alert('Sharing plan...');
  };

  // Function to handle saving to Mem0
  const handleSave = () => {
    // Save to Mem0 functionality would be implemented here
    alert('Plan saved to student profile!');
  };

  return (
    <div className="iep-plan">
      <div className="plan-header">
        <h2>7-Day Learning Plan for {plan.studentName}</h2>
        <p className="plan-meta">
          Age: {plan.studentAge} | Grade: {plan.studentGrade} | 
          Created: {new Date(plan.createdAt).toLocaleDateString()}
        </p>
      </div>
      
      <div className="plan-section student-profile">
        <h3>Student Profile</h3>
        <p>{plan.studentProfile}</p>
      </div>
      
      <div className="plan-section learning-approach">
        <h3>Recommended Learning Approach</h3>
        <p>{plan.learningApproach}</p>
      </div>
      
      <div className="plan-section daily-plans">
        <h3>Daily Learning Plans</h3>
        
        <div className="day-tabs">
          {plan.dailyPlans.map((day, index) => (
            <button 
              key={index}
              className={`day-tab ${activeDay === index ? 'active' : ''}`}
              onClick={() => setActiveDay(index)}
            >
              Day {index + 1}
            </button>
          ))}
        </div>
        
        <div className="daily-plan-content">
          {plan.dailyPlans[activeDay] && (
            <>
              <h4>{plan.dailyPlans[activeDay].title}</h4>
              
              <div className="time-blocks">
                {plan.dailyPlans[activeDay].timeBlocks.map((block, index) => (
                  <div key={index} className="time-block">
                    <div className="time-block-header">
                      <span className="time">{block.time}</span>
                      <span className="subject">{block.subject}</span>
                    </div>
                    <div className="time-block-content">
                      <p className="activity">{block.activity}</p>
                      <p className="approach"><strong>Approach:</strong> {block.approach}</p>
                      {block.materials && (
                        <p className="materials"><strong>Materials:</strong> {block.materials}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="daily-notes">
                <h5>Notes & Accommodations</h5>
                <p>{plan.dailyPlans[activeDay].notes}</p>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="plan-section accommodations">
        <h3>General Accommodations</h3>
        <ul>
          {plan.accommodations.map((accommodation, index) => (
            <li key={index}>{accommodation}</li>
          ))}
        </ul>
      </div>
      
      <div className="plan-section resources">
        <h3>Helpful Resources</h3>
        <div className="resource-cards">
          {plan.resources.map((resource, index) => (
            <div key={index} className="resource-card">
              <h4>{resource.title}</h4>
              <p>{resource.description}</p>
              <a href={resource.url} target="_blank" rel="noopener noreferrer" className="resource-link">
                View Resource
              </a>
              <span className="resource-source">Source: {resource.source}</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="plan-section progress-monitoring">
        <h3>Progress Monitoring</h3>
        <p>{plan.progressMonitoring}</p>
      </div>
      
      <div className="plan-actions">
        <button onClick={handleDownload} className="action-button">
          <FaDownload /> Download PDF
        </button>
        <button onClick={handlePrint} className="action-button">
          <FaPrint /> Print Plan
        </button>
        <button onClick={handleSave} className="action-button">
          <FaSave /> Save Plan
        </button>
        <button onClick={handleShare} className="action-button">
          <FaShare /> Share Plan
        </button>
        <button onClick={handleCalendar} className="action-button">
          <FaCalendarAlt /> Add to Calendar
        </button>
      </div>
    </div>
  );
  
  function handlePrint() {
    window.print();
  }
  
  function handleCalendar() {
    alert('Calendar integration coming soon!');
  }
};

export default IEPPlanDisplay;
