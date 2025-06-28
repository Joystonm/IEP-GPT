import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import StudentForm from '../components/StudentForm';
import IEPPlanDisplay from '../components/IEPPlanDisplay';
import Loader from '../components/Loader';
import { generateIEPPlan, getStudentProfiles, getStudentProfile } from '../services/api';
import { FaPlus, FaUser, FaCalendarAlt, FaChartLine } from 'react-icons/fa';

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [iepPlan, setIepPlan] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('create');
  const [studentProfiles, setStudentProfiles] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    highContrast: false,
    largeText: false,
    reducedMotion: false
  });

  // Fetch student profiles on component mount
  useEffect(() => {
    const fetchStudentProfiles = async () => {
      try {
        const profiles = await getStudentProfiles();
        setStudentProfiles(profiles);
      } catch (err) {
        console.error('Error fetching student profiles:', err);
      }
    };

    fetchStudentProfiles();
  }, []);

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const plan = await generateIEPPlan(formData);
      setIepPlan(plan);
      setActiveTab('view-plan');
    } catch (err) {
      setError('Failed to generate learning plan. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentSelect = async (studentId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const student = await getStudentProfile(studentId);
      setSelectedStudent(student);
      
      if (student.latestPlan) {
        setIepPlan(student.latestPlan);
        setActiveTab('view-plan');
      } else {
        setActiveTab('create');
      }
    } catch (err) {
      setError('Failed to load student profile. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewPlan = () => {
    setIepPlan(null);
    setSelectedStudent(null);
    setActiveTab('create');
  };

  const toggleAccessibilityMenu = () => {
    setShowAccessibilityMenu(!showAccessibilityMenu);
  };

  const updateAccessibilitySetting = (setting) => {
    setAccessibilitySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  // Apply accessibility classes to the dashboard
  const dashboardClasses = `dashboard ${accessibilitySettings.highContrast ? 'high-contrast' : ''} ${accessibilitySettings.largeText ? 'large-text' : ''} ${accessibilitySettings.reducedMotion ? 'reduced-motion' : ''}`;

  return (
    <div className={dashboardClasses}>
      <Header />
      
      <main className="dashboard-content">
        <div className="dashboard-container">
          <div className="dashboard-sidebar">
            <div className="sidebar-section">
              <h3>Navigation</h3>
              <ul className="sidebar-nav">
                <li>
                  <button 
                    className={`sidebar-button ${activeTab === 'create' ? 'active' : ''}`}
                    onClick={() => setActiveTab('create')}
                  >
                    <FaPlus /> Create New Plan
                  </button>
                </li>
                <li>
                  <button 
                    className={`sidebar-button ${activeTab === 'students' ? 'active' : ''}`}
                    onClick={() => setActiveTab('students')}
                  >
                    <FaUser /> Student Profiles
                  </button>
                </li>
                <li>
                  <button 
                    className={`sidebar-button ${activeTab === 'calendar' ? 'active' : ''}`}
                    onClick={() => setActiveTab('calendar')}
                  >
                    <FaCalendarAlt /> Calendar View
                  </button>
                </li>
                <li>
                  <button 
                    className={`sidebar-button ${activeTab === 'progress' ? 'active' : ''}`}
                    onClick={() => setActiveTab('progress')}
                  >
                    <FaChartLine /> Progress Tracking
                  </button>
                </li>
              </ul>
            </div>
            
            <div className="sidebar-section">
              <h3>Recent Students</h3>
              {studentProfiles.length > 0 ? (
                <ul className="student-list">
                  {studentProfiles.slice(0, 5).map(student => (
                    <li key={student.id}>
                      <button 
                        className="student-button"
                        onClick={() => handleStudentSelect(student.id)}
                      >
                        {student.name}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-data-message">No student profiles yet</p>
              )}
            </div>
            
            <div className="sidebar-section">
              <button 
                className="accessibility-button"
                onClick={toggleAccessibilityMenu}
              >
                Accessibility Options
              </button>
              
              {showAccessibilityMenu && (
                <div className="accessibility-menu">
                  <label>
                    <input 
                      type="checkbox"
                      checked={accessibilitySettings.highContrast}
                      onChange={() => updateAccessibilitySetting('highContrast')}
                    />
                    High Contrast Mode
                  </label>
                  <label>
                    <input 
                      type="checkbox"
                      checked={accessibilitySettings.largeText}
                      onChange={() => updateAccessibilitySetting('largeText')}
                    />
                    Large Text
                  </label>
                  <label>
                    <input 
                      type="checkbox"
                      checked={accessibilitySettings.reducedMotion}
                      onChange={() => updateAccessibilitySetting('reducedMotion')}
                    />
                    Reduced Motion
                  </label>
                </div>
              )}
            </div>
          </div>
          
          <div className="dashboard-main">
            {error && <div className="error-message">{error}</div>}
            
            {isLoading ? (
              <Loader />
            ) : (
              <>
                {activeTab === 'create' && (
                  <div className="form-container">
                    <h2>Create New Learning Plan</h2>
                    <StudentForm 
                      onSubmit={handleFormSubmit} 
                      isLoading={isLoading}
                      initialData={selectedStudent}
                    />
                  </div>
                )}
                
                {activeTab === 'view-plan' && iepPlan && (
                  <div className="plan-container">
                    <IEPPlanDisplay plan={iepPlan} />
                    <button 
                      className="new-plan-button"
                      onClick={handleCreateNewPlan}
                    >
                      Create New Plan
                    </button>
                  </div>
                )}
                
                {activeTab === 'students' && (
                  <div className="students-container">
                    <h2>Student Profiles</h2>
                    {studentProfiles.length > 0 ? (
                      <div className="student-cards">
                        {studentProfiles.map(student => (
                          <div key={student.id} className="student-card">
                            <h3>{student.name}</h3>
                            <p>Age: {student.age} | Grade: {student.grade}</p>
                            <p>Diagnosis: {student.diagnosis}</p>
                            <button 
                              onClick={() => handleStudentSelect(student.id)}
                              className="view-button"
                            >
                              View Profile
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-data-message">No student profiles yet. Create your first learning plan to get started!</p>
                    )}
                  </div>
                )}
                
                {activeTab === 'calendar' && (
                  <div className="calendar-container">
                    <h2>Calendar View</h2>
                    <p className="coming-soon">Calendar view with drag-and-drop functionality coming soon!</p>
                    {/* Calendar component would be implemented here */}
                  </div>
                )}
                
                {activeTab === 'progress' && (
                  <div className="progress-container">
                    <h2>Progress Tracking</h2>
                    <p className="coming-soon">Progress tracking and reporting features coming soon!</p>
                    {/* Progress tracking component would be implemented here */}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
