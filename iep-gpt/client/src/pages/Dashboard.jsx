import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StudentForm from "../components/StudentForm";
import IEPPlanDisplay from "../components/IEPPlanDisplay";
import ProgressTracker from "../components/ProgressTracker";
import CalendarView from "../components/CalendarView";
import ResourceLibrary from "../components/ResourceLibrary";
import LearningStyleAssessment from "../components/LearningStyleAssessment";
import CulturalResponsiveness from "../components/CulturalResponsiveness";
import ExpertConsultation from "../components/ExpertConsultation";
import Loader from "../components/Loader";
import {
  generateIEPPlan,
  getStudentProfiles,
  getStudentProfile,
  generateAdaptedPlan,
  saveStudentProfile,
  updateStudentProgress,
  deleteStudentProfile,
} from "../services/api";
import {
  FaPlus,
  FaUser,
  FaCalendarAlt,
  FaChartLine,
  FaBook,
  FaLightbulb,
  FaCog,
  FaGlobe,
  FaUserMd,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [iepPlan, setIepPlan] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("create");
  const [studentProfiles, setStudentProfiles] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
  });
  const [progressData, setProgressData] = useState(null);
  const [showAssessment, setShowAssessment] = useState(false);
  const [learningStyleResults, setLearningStyleResults] = useState(null);
  const [culturalData, setCulturalData] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch student profiles on component mount
  useEffect(() => {
    const fetchStudentProfiles = async () => {
      try {
        const profiles = await getStudentProfiles();
        setStudentProfiles(profiles || []);
      } catch (err) {
        console.error("Error fetching student profiles:", err);
        setStudentProfiles([]);
      }
    };

    fetchStudentProfiles();
  }, []);

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      // If we have learning style results, add them to the form data
      const enhancedFormData = {
        ...formData,
        ...(learningStyleResults && { learningStyleResults }),
        ...(culturalData && { culturalData }),
      };

      const plan = await generateIEPPlan(enhancedFormData);
      setIepPlan(plan);
      setActiveTab("view-plan");

      // Update selected student with the new data
      const newStudent = {
        ...formData,
        id: plan.id,
        latestPlan: plan,
        ...(learningStyleResults && { learningStyleResults }),
        ...(culturalData && { culturalData }),
      };
      
      setSelectedStudent(newStudent);
      
      // Save the new student profile
      const savedStudent = await saveStudentProfile(newStudent);
      
      // Update the student profiles list
      setStudentProfiles(prevProfiles => {
        const existingIndex = prevProfiles.findIndex(profile => profile.id === savedStudent.id);
        
        if (existingIndex >= 0) {
          // Update existing profile
          const updatedProfiles = [...prevProfiles];
          updatedProfiles[existingIndex] = savedStudent;
          return updatedProfiles;
        } else {
          // Add new profile
          return [...prevProfiles, savedStudent];
        }
      });
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setError("Failed to generate learning plan. Please try again.");
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
      
      if (!student) {
        throw new Error("Student profile not found");
      }
      
      setSelectedStudent(student);

      // Set learning style results if available
      if (student.learningStyleResults) {
        setLearningStyleResults(student.learningStyleResults);
      } else {
        setLearningStyleResults(null);
      }

      // Set cultural data if available
      if (student.culturalData) {
        setCulturalData(student.culturalData);
      } else {
        setCulturalData(null);
      }
      
      // Set progress data if available
      if (student.progressData) {
        setProgressData(student.progressData);
      } else {
        setProgressData(null);
      }

      if (student.latestPlan) {
        setIepPlan(student.latestPlan);
        setActiveTab("view-plan");
      } else {
        setActiveTab("create");
      }
    } catch (err) {
      console.error("Error loading student profile:", err);
      setError("Failed to load student profile. Please try again.");
      
      // Remove the student from the profiles list if it doesn't exist
      setStudentProfiles(prevProfiles => 
        prevProfiles.filter(profile => profile.id !== studentId)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewPlan = () => {
    setIepPlan(null);
    setSelectedStudent(null);
    setLearningStyleResults(null);
    setCulturalData(null);
    setProgressData(null);
    setActiveTab("create");
  };

  const handleProgressUpdate = async (newProgressData) => {
    if (!selectedStudent) return;
    
    setIsLoading(true);
    setError(null);
    setProgressData(newProgressData);

    try {
      // Update the student with the new progress data
      const updatedStudent = {
        ...selectedStudent,
        progressData: newProgressData
      };
      
      // Save the updated student profile
      const savedStudent = await updateStudentProgress(selectedStudent.id, newProgressData);
      
      // Update the selected student
      setSelectedStudent(savedStudent);
      
      // Update the student profiles list
      setStudentProfiles(prevProfiles => 
        prevProfiles.map(profile => 
          profile.id === savedStudent.id ? savedStudent : profile
        )
      );
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      // Generate an adapted plan based on progress if needed
      if (newProgressData.generateAdaptedPlan) {
        const adaptedPlan = await generateAdaptedPlan(selectedStudent.id);
        setIepPlan(adaptedPlan);
        
        // Update the student with the new plan
        const studentWithNewPlan = {
          ...savedStudent,
          latestPlan: adaptedPlan
        };
        
        // Save the updated student profile
        const updatedStudent = await saveStudentProfile(studentWithNewPlan);
        
        // Update the selected student
        setSelectedStudent(updatedStudent);
        
        // Update the student profiles list
        setStudentProfiles(prevProfiles => 
          prevProfiles.map(profile => 
            profile.id === updatedStudent.id ? updatedStudent : profile
          )
        );
        
        setActiveTab("view-plan");
      }
    } catch (err) {
      setError("Failed to update progress. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLearningStyleComplete = async (results) => {
    setLearningStyleResults(results);
    setShowAssessment(false);

    // If we have a selected student, update their profile with the learning style results
    if (selectedStudent) {
      try {
        const updatedStudent = {
          ...selectedStudent,
          learningStyleResults: results
        };
        
        // Save the updated student profile
        const savedStudent = await saveStudentProfile(updatedStudent);
        setSelectedStudent(savedStudent);
        
        // Show success message
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        
        // Update the student profiles list
        setStudentProfiles(prevProfiles => 
          prevProfiles.map(profile => 
            profile.id === savedStudent.id ? savedStudent : profile
          )
        );
      } catch (err) {
        console.error("Error saving learning style results:", err);
        setError("Failed to save learning style results. Please try again.");
      }
    }
  };

  const handleCulturalUpdate = async (data) => {
    setCulturalData(data);

    // If we have a selected student, update their profile with the cultural data
    if (selectedStudent) {
      try {
        const updatedStudent = {
          ...selectedStudent,
          culturalData: data
        };
        
        // Save the updated student profile
        const savedStudent = await saveStudentProfile(updatedStudent);
        setSelectedStudent(savedStudent);
        
        // Show success message
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
        
        // Update the student profiles list
        setStudentProfiles(prevProfiles => 
          prevProfiles.map(profile => 
            profile.id === savedStudent.id ? savedStudent : profile
          )
        );
      } catch (err) {
        console.error("Error saving cultural data:", err);
        setError("Failed to save cultural data. Please try again.");
      }
    }
  };

  const handlePlanSaved = (savedData) => {
    // Update the selected student with the saved data
    setSelectedStudent(savedData);
    
    // Update the student profiles list
    setStudentProfiles(prevProfiles => {
      const existingIndex = prevProfiles.findIndex(profile => profile.id === savedData.id);
      
      if (existingIndex >= 0) {
        // Update existing profile
        const updatedProfiles = [...prevProfiles];
        updatedProfiles[existingIndex] = savedData;
        return updatedProfiles;
      } else {
        // Add new profile
        return [...prevProfiles, savedData];
      }
    });
    
    // Show success message
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };
  
  const handleCalendarUpdate = async (calendarData) => {
    if (!selectedStudent) return;
    
    try {
      const updatedStudent = {
        ...selectedStudent,
        calendarData
      };
      
      // Save the updated student profile
      const savedStudent = await saveStudentProfile(updatedStudent);
      setSelectedStudent(savedStudent);
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      // Update the student profiles list
      setStudentProfiles(prevProfiles => 
        prevProfiles.map(profile => 
          profile.id === savedStudent.id ? savedStudent : profile
        )
      );
    } catch (err) {
      console.error("Error saving calendar data:", err);
      setError("Failed to save calendar data. Please try again.");
    }
  };
  
  const handleResourceUpdate = async (resourceData) => {
    if (!selectedStudent) return;
    
    try {
      const updatedStudent = {
        ...selectedStudent,
        resourceData
      };
      
      // Save the updated student profile
      const savedStudent = await saveStudentProfile(updatedStudent);
      setSelectedStudent(savedStudent);
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      // Update the student profiles list
      setStudentProfiles(prevProfiles => 
        prevProfiles.map(profile => 
          profile.id === savedStudent.id ? savedStudent : profile
        )
      );
    } catch (err) {
      console.error("Error saving resource data:", err);
      setError("Failed to save resource data. Please try again.");
    }
  };
  
  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
      setIsLoading(true);
      setError(null);
      
      try {
        // Call the API to delete the student
        await deleteStudentProfile(studentId);
        
        // Remove the student from the profiles list
        setStudentProfiles(prevProfiles => 
          prevProfiles.filter(profile => profile.id !== studentId)
        );
        
        // If the deleted student was selected, clear the selection
        if (selectedStudent && selectedStudent.id === studentId) {
          setSelectedStudent(null);
          setIepPlan(null);
          setLearningStyleResults(null);
          setCulturalData(null);
          setProgressData(null);
          setActiveTab("students");
        }
        
        // Show success message
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (err) {
        console.error("Error deleting student profile:", err);
        setError("Failed to delete student profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleAccessibilityMenu = () => {
    setShowAccessibilityMenu(!showAccessibilityMenu);
  };

  const updateAccessibilitySetting = (setting) => {
    setAccessibilitySettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  // Apply accessibility classes to the dashboard
  const dashboardClasses = `dashboard ${
    accessibilitySettings.highContrast ? "high-contrast" : ""
  } ${accessibilitySettings.largeText ? "large-text" : ""} ${
    accessibilitySettings.reducedMotion ? "reduced-motion" : ""
  }`;

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
                    className={`sidebar-button ${
                      activeTab === "create" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("create")}
                  >
                    <FaPlus /> Create New Plan
                  </button>
                </li>
                <li>
                  <button
                    className={`sidebar-button ${
                      activeTab === "students" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("students")}
                  >
                    <FaUser /> Student Profiles
                  </button>
                </li>
                <li>
                  <button
                    className={`sidebar-button ${
                      activeTab === "calendar" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("calendar")}
                    disabled={!selectedStudent}
                  >
                    <FaCalendarAlt /> Calendar View
                  </button>
                </li>
                <li>
                  <button
                    className={`sidebar-button ${
                      activeTab === "progress" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("progress")}
                    disabled={!selectedStudent}
                  >
                    <FaChartLine /> Progress Tracking
                  </button>
                </li>
                <li>
                  <button
                    className={`sidebar-button ${
                      activeTab === "resources" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("resources")}
                    disabled={!selectedStudent}
                  >
                    <FaBook /> Resource Library
                  </button>
                </li>
                <li>
                  <button
                    className={`sidebar-button ${
                      activeTab === "assessment" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("assessment")}
                  >
                    <FaLightbulb /> Learning Style
                  </button>
                </li>
                <li>
                  <button
                    className={`sidebar-button ${
                      activeTab === "cultural" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("cultural")}
                    disabled={!selectedStudent}
                  >
                    <FaGlobe /> Cultural Adaptation
                  </button>
                </li>
                <li>
                  <button
                    className={`sidebar-button ${
                      activeTab === "expert" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("expert")}
                    disabled={!selectedStudent}
                  >
                    <FaUserMd /> Expert Consultation
                  </button>
                </li>
              </ul>
            </div>

            <div className="sidebar-section">
              <h3>Recent Students</h3>
              {studentProfiles.length > 0 ? (
                <ul className="student-list">
                  {studentProfiles.slice(0, 5).map((student) => (
                    <li key={student.id}>
                      <button
                        className={`student-button ${selectedStudent && selectedStudent.id === student.id ? 'active' : ''}`}
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
                <FaCog /> Accessibility Options
              </button>

              {showAccessibilityMenu && (
                <div className="accessibility-menu">
                  <label>
                    <input
                      type="checkbox"
                      checked={accessibilitySettings.highContrast}
                      onChange={() =>
                        updateAccessibilitySetting("highContrast")
                      }
                    />
                    High Contrast Mode
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={accessibilitySettings.largeText}
                      onChange={() => updateAccessibilitySetting("largeText")}
                    />
                    Large Text
                  </label>
                  <label>
                    <input
                      type="checkbox"
                      checked={accessibilitySettings.reducedMotion}
                      onChange={() =>
                        updateAccessibilitySetting("reducedMotion")
                      }
                    />
                    Reduced Motion
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="dashboard-main">
            {error && (
              <div className="error-message">
                <FaExclamationTriangle /> {error}
              </div>
            )}
            
            {saveSuccess && (
              <div className="success-message">
                <FaCheck /> Changes saved successfully!
              </div>
            )}

            {isLoading ? (
              <Loader message={activeTab === "create" ? "Generating personalized learning plan... This may take up to 2 minutes." : "Loading..."} />
            ) : (
              <>
                {activeTab === "create" && (
                  <div className="form-container">
                    <h2>Create New Learning Plan</h2>

                    {!showAssessment ? (
                      <>
                        {learningStyleResults && (
                          <div className="assessment-summary">
                            <h3>Learning Style Assessment Results</h3>
                            <p>
                              Primary Learning Style:{" "}
                              <strong>
                                {learningStyleResults.primaryLearningStyle}
                              </strong>
                              <br />
                              Secondary Learning Style:{" "}
                              <strong>
                                {learningStyleResults.secondaryLearningStyle}
                              </strong>
                            </p>
                            <button
                              className="secondary-button"
                              onClick={() => setShowAssessment(true)}
                            >
                              Retake Assessment
                            </button>
                          </div>
                        )}

                        {!learningStyleResults && (
                          <div className="assessment-prompt">
                            <p>
                              For a more personalized learning plan, consider
                              completing a learning style assessment.
                            </p>
                            <button
                              className="secondary-button"
                              onClick={() => setShowAssessment(true)}
                            >
                              Take Learning Style Assessment
                            </button>
                          </div>
                        )}

                        <StudentForm
                          onSubmit={handleFormSubmit}
                          isLoading={isLoading}
                          initialData={selectedStudent}
                        />
                      </>
                    ) : (
                      <LearningStyleAssessment
                        onComplete={handleLearningStyleComplete}
                        studentData={selectedStudent}
                      />
                    )}
                  </div>
                )}

                {activeTab === "view-plan" && iepPlan && (
                  <div className="plan-container">
                    <IEPPlanDisplay 
                      plan={iepPlan} 
                      onPlanSaved={handlePlanSaved}
                    />
                    <div className="plan-actions-container">
                      <button
                        className="new-plan-button"
                        onClick={handleCreateNewPlan}
                      >
                        Create New Plan
                      </button>
                      <button
                        className="track-progress-button"
                        onClick={() => setActiveTab("progress")}
                      >
                        <FaChartLine /> Track Progress
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === "students" && (
                  <div className="students-container">
                    <h2>Student Profiles</h2>
                    {studentProfiles.length > 0 ? (
                      <div className="student-cards">
                        {studentProfiles.map((student) => (
                          <div 
                            key={student.id} 
                            className={`student-card ${selectedStudent && selectedStudent.id === student.id ? 'selected' : ''}`}
                          >
                            <h3>{student.name}</h3>
                            <p>
                              Age: {student.age} | Grade: {student.grade}
                            </p>
                            <p>Diagnosis: {student.diagnosis}</p>
                            <div className="student-card-details">
                              {student.learningStyleResults && (
                                <span className="student-tag learning-style">
                                  {student.learningStyleResults.primaryLearningStyle} Learner
                                </span>
                              )}
                              {student.culturalData && (
                                <span className="student-tag cultural">
                                  Cultural Profile
                                </span>
                              )}
                              {student.latestPlan && (
                                <span className="student-tag plan">
                                  Learning Plan
                                </span>
                              )}
                              {student.progressData && (
                                <span className="student-tag progress">
                                  Progress Data
                                </span>
                              )}
                            </div>
                            <div className="student-card-actions">
                              <button
                                onClick={() => handleStudentSelect(student.id)}
                                className="view-button"
                              >
                                View Profile
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteStudent(student.id);
                                }}
                                className="delete-button"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-data-message">
                        No student profiles yet. Create your first learning plan
                        to get started!
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "calendar" && (
                  <div className="calendar-container">
                    <h2>Calendar View for {selectedStudent ? selectedStudent.name : ''}</h2>
                    {selectedStudent && selectedStudent.latestPlan ? (
                      <CalendarView
                        learningPlan={selectedStudent.latestPlan}
                        calendarData={selectedStudent.calendarData}
                        onCalendarUpdate={handleCalendarUpdate}
                      />
                    ) : (
                      <p className="no-data-message">
                        {selectedStudent 
                          ? "This student doesn't have a learning plan yet. Create one first!" 
                          : "Select a student with a learning plan to view their calendar."}
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "progress" && (
                  <div className="progress-container">
                    <h2>Progress Tracking for {selectedStudent ? selectedStudent.name : ''}</h2>
                    {selectedStudent && selectedStudent.latestPlan ? (
                      <ProgressTracker
                        studentId={selectedStudent.id}
                        learningPlan={selectedStudent.latestPlan}
                        onProgressUpdate={handleProgressUpdate}
                        existingProgress={selectedStudent.progressData}
                      />
                    ) : (
                      <p className="no-data-message">
                        {selectedStudent 
                          ? "This student doesn't have a learning plan yet. Create one first!" 
                          : "Select a student with a learning plan to track progress."}
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "resources" && (
                  <div className="resources-container">
                    <h2>Resource Library for {selectedStudent ? selectedStudent.name : ''}</h2>
                    {selectedStudent ? (
                      <ResourceLibrary
                        studentId={selectedStudent.id}
                        diagnosis={selectedStudent.diagnosis}
                        resourceData={selectedStudent.resourceData}
                        onResourceUpdate={handleResourceUpdate}
                      />
                    ) : (
                      <p className="no-data-message">
                        Select a student to view relevant educational resources.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "assessment" && (
                  <div className="assessment-container">
                    <h2>Learning Style Assessment {selectedStudent ? `for ${selectedStudent.name}` : ''}</h2>
                    <LearningStyleAssessment
                      onComplete={handleLearningStyleComplete}
                      studentData={selectedStudent}
                      existingResults={selectedStudent?.learningStyleResults}
                    />
                  </div>
                )}

                {activeTab === "cultural" && (
                  <div className="cultural-container">
                    <h2>Cultural Responsiveness for {selectedStudent ? selectedStudent.name : ''}</h2>
                    {selectedStudent ? (
                      <CulturalResponsiveness
                        studentData={selectedStudent}
                        learningPlan={selectedStudent.latestPlan}
                        onUpdate={handleCulturalUpdate}
                        existingData={selectedStudent.culturalData}
                      />
                    ) : (
                      <p className="no-data-message">
                        Select a student to create culturally responsive
                        adaptations.
                      </p>
                    )}
                  </div>
                )}

                {activeTab === "expert" && (
                  <div className="expert-container">
                    <h2>Expert Consultation for {selectedStudent ? selectedStudent.name : ''}</h2>
                    {selectedStudent ? (
                      <ExpertConsultation
                        studentData={selectedStudent}
                        learningPlan={selectedStudent.latestPlan}
                        consultationData={selectedStudent.consultationData}
                        onConsultationUpdate={handleConsultationUpdate}
                      />
                    ) : (
                      <p className="no-data-message">
                        Select a student to request expert consultation.
                      </p>
                    )}
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
  const handleConsultationUpdate = async (consultationData) => {
    if (!selectedStudent) return;
    
    try {
      const updatedStudent = {
        ...selectedStudent,
        consultationData
      };
      
      // Save the updated student profile
      const savedStudent = await saveStudentProfile(updatedStudent);
      setSelectedStudent(savedStudent);
      
      // Show success message
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      
      // Update the student profiles list
      setStudentProfiles(prevProfiles => 
        prevProfiles.map(profile => 
          profile.id === savedStudent.id ? savedStudent : profile
        )
      );
    } catch (err) {
      console.error("Error saving consultation data:", err);
      setError("Failed to save consultation data. Please try again.");
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
      setIsLoading(true);
      setError(null);
      
      try {
        // Call the API to delete the student
        await deleteStudentProfile(studentId);
        
        // Remove the student from the profiles list
        setStudentProfiles(prevProfiles => 
          prevProfiles.filter(profile => profile.id !== studentId)
        );
        
        // If the deleted student was selected, clear the selection
        if (selectedStudent && selectedStudent.id === studentId) {
          setSelectedStudent(null);
          setIepPlan(null);
          setLearningStyleResults(null);
          setCulturalData(null);
          setProgressData(null);
          setActiveTab("students");
        }
        
        // Show success message
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } catch (err) {
        console.error("Error deleting student profile:", err);
        setError("Failed to delete student profile. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };
