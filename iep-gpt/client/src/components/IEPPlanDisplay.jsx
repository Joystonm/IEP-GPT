import React, { useState } from 'react';
import { FaDownload, FaSave, FaCheck, FaCalendarAlt } from 'react-icons/fa';
import { saveStudentProfile } from '../services/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const IEPPlanDisplay = ({ plan, onPlanSaved }) => {
  const [activeDay, setActiveDay] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  if (!plan) {
    return null;
  }

  // Function to handle downloading as PDF
  const handleDownload = () => {
    setIsDownloading(true);
    
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text(`7-Day Learning Plan for ${plan.studentName}`, 14, 20);
      
      // Add student info
      doc.setFontSize(12);
      doc.text(`Age: ${plan.studentAge} | Grade: ${plan.studentGrade} | Created: ${new Date(plan.createdAt).toLocaleDateString()}`, 14, 30);
      
      // Add student profile
      doc.setFontSize(14);
      doc.text('Student Profile', 14, 40);
      doc.setFontSize(10);
      
      // Split long text into multiple lines
      const splitProfile = doc.splitTextToSize(plan.studentProfile || "", 180);
      doc.text(splitProfile, 14, 50);
      
      // Add learning approach
      let yPos = 50 + (splitProfile.length * 5);
      doc.setFontSize(14);
      doc.text('Recommended Learning Approach', 14, yPos);
      doc.setFontSize(10);
      
      const splitApproach = doc.splitTextToSize(plan.learningApproach || "", 180);
      yPos += 10;
      doc.text(splitApproach, 14, yPos);
      
      // Add daily plans
      yPos += (splitApproach.length * 5) + 10;
      
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.text('Daily Learning Plans', 14, yPos);
      
      // Add each day's plan
      if (plan.dailyPlans && Array.isArray(plan.dailyPlans)) {
        plan.dailyPlans.forEach((day, index) => {
          yPos += 10;
          
          // Check if we need a new page
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }
          
          doc.setFontSize(12);
          doc.text(day.title || `Day ${index + 1}`, 14, yPos);
          
          // Add time blocks as a table
          if (day.timeBlocks && Array.isArray(day.timeBlocks)) {
            const tableData = day.timeBlocks.map(block => [
              block.time || "",
              block.subject || "",
              block.activity || "",
              block.approach || ""
            ]);
            
            const tableHeaders = [['Time', 'Subject', 'Activity', 'Approach']];
            
            yPos += 5;
            doc.autoTable({
              startY: yPos,
              head: tableHeaders,
              body: tableData,
              theme: 'striped',
              headStyles: { fillColor: [74, 111, 165] },
              margin: { left: 14, right: 14 }
            });
            
            yPos = doc.lastAutoTable.finalY + 10;
          }
          
          // Check if we need a new page
          if (yPos > 250) {
            doc.addPage();
            yPos = 20;
          }
          
          // Add notes
          if (day.notes) {
            doc.setFontSize(10);
            doc.text('Notes & Accommodations:', 14, yPos);
            
            const splitNotes = doc.splitTextToSize(day.notes, 180);
            yPos += 5;
            doc.text(splitNotes, 14, yPos);
            
            yPos += (splitNotes.length * 5) + 10;
          }
        });
      }
      
      // Add accommodations
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.text('General Accommodations', 14, yPos);
      
      yPos += 10;
      doc.setFontSize(10);
      
      if (plan.accommodations && Array.isArray(plan.accommodations)) {
        plan.accommodations.forEach((accommodation, index) => {
          // Check if we need a new page
          if (yPos > 280) {
            doc.addPage();
            yPos = 20;
          }
          
          doc.text(`• ${accommodation}`, 14, yPos);
          yPos += 7;
        });
      }
      
      // Save the PDF
      doc.save(`Learning_Plan_${plan.studentName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Function to handle saving to database
  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    
    try {
      // Create a student data object with the plan
      const studentData = {
        name: plan.studentName,
        age: plan.studentAge,
        grade: plan.studentGrade,
        diagnosis: plan.diagnosis || '',
        needs: plan.needs || [],
        strengths: plan.strengths || [],
        interests: plan.interests || [],
        accommodations: plan.accommodations || [],
        latestPlan: plan,
        id: plan.studentId || plan.id
      };
      
      // Save the student profile with the plan
      const savedData = await saveStudentProfile(studentData);
      
      setSaveSuccess(true);
      
      // Call the onPlanSaved callback to update the parent component
      if (onPlanSaved) {
        onPlanSaved(savedData);
      }
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving plan:', error);
      setSaveError('Failed to save plan. Please try again.');
    } finally {
      setIsSaving(false);
    }
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
          {plan.dailyPlans && plan.dailyPlans.map((day, index) => (
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
          {plan.dailyPlans && plan.dailyPlans[activeDay] && (
            <>
              <h4>{plan.dailyPlans[activeDay].title}</h4>
              
              <div className="time-blocks">
                {plan.dailyPlans[activeDay].timeBlocks && plan.dailyPlans[activeDay].timeBlocks.map((block, index) => (
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
          {plan.accommodations && plan.accommodations.map((accommodation, index) => (
            <li key={index}>{accommodation}</li>
          ))}
        </ul>
      </div>
      
      {plan.resources && plan.resources.length > 0 && (
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
      )}
      
      <div className="plan-section progress-monitoring">
        <h3>Progress Monitoring</h3>
        <p>{plan.progressMonitoring}</p>
      </div>
      
      <div className="plan-actions">
        <button 
          onClick={handleDownload} 
          className={`action-button ${isDownloading ? 'downloading' : ''}`}
          disabled={isDownloading}
        >
          {isDownloading ? 'Generating PDF...' : <><FaDownload /> Download PDF</>}
        </button>
        <button 
          onClick={handleSave} 
          className={`action-button ${isSaving ? 'saving' : ''} ${saveSuccess ? 'success' : ''}`}
          disabled={isSaving}
        >
          {isSaving ? (
            <>Saving...</>
          ) : saveSuccess ? (
            <><FaCheck /> Saved!</>
          ) : (
            <><FaSave /> Save Plan</>
          )}
        </button>
        <button onClick={() => window.location.href = '#calendar'} className="action-button">
          <FaCalendarAlt /> View in Calendar
        </button>
      </div>
      
      {saveError && (
        <div className="error-message">
          {saveError}
        </div>
      )}
    </div>
  );
};

export default IEPPlanDisplay;
