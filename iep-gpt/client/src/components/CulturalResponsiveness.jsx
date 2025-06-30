import React, { useState, useEffect } from 'react';
import { FaGlobe, FaCheck, FaEdit, FaSave, FaPlus, FaTrash, FaInfoCircle } from 'react-icons/fa';

/**
 * Cultural Responsiveness Component
 * 
 * A tool to adapt learning plans to be culturally relevant to each student
 * by incorporating cultural background, interests, and community values.
 */
const CulturalResponsiveness = ({ studentData, learningPlan, onUpdate, existingData }) => {
  const [culturalProfile, setCulturalProfile] = useState({
    culturalBackground: '',
    language: '',
    traditions: '',
    values: '',
    communityContext: '',
    culturalStrengths: ''
  });
  
  const [adaptations, setAdaptations] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [editingAdaptation, setEditingAdaptation] = useState(null);
  const [newAdaptation, setNewAdaptation] = useState({
    category: 'content',
    description: '',
    implementation: ''
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load existing data if available
  useEffect(() => {
    if (existingData) {
      setCulturalProfile(existingData.culturalProfile || culturalProfile);
      setAdaptations(existingData.adaptations || []);
    }
  }, [existingData]);
  
  // Handle profile field changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setCulturalProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle saving the cultural profile
  const handleSaveProfile = () => {
    if (onUpdate) {
      onUpdate({
        culturalProfile,
        adaptations
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };
  
  // Handle new adaptation field changes
  const handleNewAdaptationChange = (e) => {
    const { name, value } = e.target;
    setNewAdaptation(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Add a new adaptation
  const handleAddAdaptation = () => {
    if (newAdaptation.description.trim() === '') return;
    
    const adaptation = {
      ...newAdaptation,
      id: Date.now().toString()
    };
    
    setAdaptations([...adaptations, adaptation]);
    setNewAdaptation({
      category: 'content',
      description: '',
      implementation: ''
    });
    
    // Save changes
    if (onUpdate) {
      onUpdate({
        culturalProfile,
        adaptations: [...adaptations, adaptation]
      });
    }
  };
  
  // Start editing an adaptation
  const handleEditAdaptation = (adaptation) => {
    setEditingAdaptation(adaptation);
  };
  
  // Save edited adaptation
  const handleSaveAdaptation = (id, updatedData) => {
    const updatedAdaptations = adaptations.map(adaptation => 
      adaptation.id === id ? { ...adaptation, ...updatedData } : adaptation
    );
    
    setAdaptations(updatedAdaptations);
    setEditingAdaptation(null);
    
    // Save changes
    if (onUpdate) {
      onUpdate({
        culturalProfile,
        adaptations: updatedAdaptations
      });
    }
  };
  
  // Delete an adaptation
  const handleDeleteAdaptation = (id) => {
    const updatedAdaptations = adaptations.filter(adaptation => adaptation.id !== id);
    setAdaptations(updatedAdaptations);
    
    // Save changes
    if (onUpdate) {
      onUpdate({
        culturalProfile,
        adaptations: updatedAdaptations
      });
    }
  };
  
  // Generate adaptation suggestions based on cultural profile
  const generateSuggestions = () => {
    // In a real implementation, this would call an API to generate suggestions
    // For now, we'll return some sample suggestions based on the profile
    
    const suggestions = [
      {
        category: 'content',
        description: `Incorporate stories, examples, and materials that reflect ${studentData?.name || "the student"}'s cultural background`,
        implementation: 'Select reading materials with diverse characters and cultural contexts'
      },
      {
        category: 'instruction',
        description: 'Use teaching methods that align with cultural learning styles',
        implementation: 'Incorporate collaborative learning and storytelling approaches'
      },
      {
        category: 'environment',
        description: 'Create a classroom environment that celebrates cultural diversity',
        implementation: 'Display multilingual labels and culturally diverse images'
      },
      {
        category: 'assessment',
        description: 'Use culturally responsive assessment methods',
        implementation: 'Offer multiple ways to demonstrate knowledge, including oral presentations and visual projects'
      }
    ];
    
    return suggestions;
  };
  
  // Render adaptation item
  const renderAdaptationItem = (adaptation) => {
    const isEditing = editingAdaptation && editingAdaptation.id === adaptation.id;
    
    if (isEditing) {
      return (
        <div key={adaptation.id} className={`adaptation-item ${adaptation.category}`}>
          <div className="adaptation-edit-form">
            <div className="form-group">
              <label>Category</label>
              <select 
                value={editingAdaptation.category}
                onChange={(e) => setEditingAdaptation({...editingAdaptation, category: e.target.value})}
              >
                <option value="content">Content</option>
                <option value="instruction">Instruction</option>
                <option value="environment">Environment</option>
                <option value="assessment">Assessment</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={editingAdaptation.description}
                onChange={(e) => setEditingAdaptation({...editingAdaptation, description: e.target.value})}
                rows={3}
              />
            </div>
            
            <div className="form-group">
              <label>Implementation</label>
              <textarea
                value={editingAdaptation.implementation}
                onChange={(e) => setEditingAdaptation({...editingAdaptation, implementation: e.target.value})}
                rows={3}
              />
            </div>
            
            <div className="adaptation-actions">
              <button 
                className="save-button"
                onClick={() => handleSaveAdaptation(adaptation.id, editingAdaptation)}
              >
                <FaSave /> Save
              </button>
              <button 
                className="cancel-button"
                onClick={() => setEditingAdaptation(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div key={adaptation.id} className={`adaptation-item ${adaptation.category}`}>
        <div className="adaptation-category">
          {adaptation.category === 'content' && 'Content Adaptation'}
          {adaptation.category === 'instruction' && 'Instructional Adaptation'}
          {adaptation.category === 'environment' && 'Environmental Adaptation'}
          {adaptation.category === 'assessment' && 'Assessment Adaptation'}
        </div>
        
        <div className="adaptation-description">
          {adaptation.description}
        </div>
        
        <div className="adaptation-implementation">
          <strong>Implementation:</strong> {adaptation.implementation}
        </div>
        
        <div className="adaptation-actions">
          <button 
            className="edit-button"
            onClick={() => handleEditAdaptation(adaptation)}
          >
            <FaEdit />
          </button>
          <button 
            className="delete-button"
            onClick={() => handleDeleteAdaptation(adaptation.id)}
          >
            <FaTrash />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="cultural-responsiveness">
      <div className="cultural-tabs">
        <button 
          className={`tab-button ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Cultural Profile
        </button>
        <button 
          className={`tab-button ${activeTab === 'adaptations' ? 'active' : ''}`}
          onClick={() => setActiveTab('adaptations')}
        >
          Adaptations
        </button>
        <button 
          className={`tab-button ${activeTab === 'suggestions' ? 'active' : ''}`}
          onClick={() => setActiveTab('suggestions')}
        >
          Suggestions
        </button>
      </div>
      
      {saveSuccess && (
        <div className="success-message">
          <FaCheck /> Cultural information saved successfully!
        </div>
      )}
      
      {activeTab === 'profile' && (
        <div className="cultural-profile-section">
          <div className="section-description">
            <p>
              Create a cultural profile for {studentData?.name || "the student"} to help develop 
              culturally responsive learning experiences. This information will be used to adapt 
              learning content, instructional approaches, and assessments.
            </p>
          </div>
          
          <div className="profile-form">
            <div className="form-group">
              <label htmlFor="culturalBackground">Cultural Background</label>
              <textarea
                id="culturalBackground"
                name="culturalBackground"
                value={culturalProfile.culturalBackground}
                onChange={handleProfileChange}
                placeholder="Describe the student's cultural background and heritage"
                rows={3}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="language">Language</label>
              <textarea
                id="language"
                name="language"
                value={culturalProfile.language}
                onChange={handleProfileChange}
                placeholder="Languages spoken at home and language proficiency"
                rows={2}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="traditions">Cultural Traditions & Practices</label>
              <textarea
                id="traditions"
                name="traditions"
                value={culturalProfile.traditions}
                onChange={handleProfileChange}
                placeholder="Important cultural traditions, celebrations, or practices"
                rows={3}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="values">Cultural Values</label>
              <textarea
                id="values"
                name="values"
                value={culturalProfile.values}
                onChange={handleProfileChange}
                placeholder="Values emphasized in the student's culture (e.g., collectivism, respect for elders)"
                rows={3}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="communityContext">Community Context</label>
              <textarea
                id="communityContext"
                name="communityContext"
                value={culturalProfile.communityContext}
                onChange={handleProfileChange}
                placeholder="Relevant information about the student's community"
                rows={3}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="culturalStrengths">Cultural Strengths & Resources</label>
              <textarea
                id="culturalStrengths"
                name="culturalStrengths"
                value={culturalProfile.culturalStrengths}
                onChange={handleProfileChange}
                placeholder="Cultural strengths that can support learning"
                rows={3}
              />
            </div>
            
            <div className="form-actions">
              <button 
                className="primary-button"
                onClick={handleSaveProfile}
              >
                <FaSave /> Save Cultural Profile
              </button>
            </div>
          </div>
          
          <div className="info-box">
            <FaInfoCircle className="info-icon" />
            <p>
              Cultural responsiveness in education recognizes and values students' cultural 
              backgrounds as assets for learning. By incorporating cultural knowledge, prior 
              experiences, and performance styles, educators can make learning more relevant 
              and effective.
            </p>
          </div>
        </div>
      )}
      
      {activeTab === 'adaptations' && (
        <div className="adaptations-section">
          <div className="section-description">
            <p>
              Create specific adaptations to make learning culturally responsive for 
              {studentData?.name ? ` ${studentData.name}` : " the student"}. These adaptations 
              will be incorporated into the learning plan.
            </p>
          </div>
          
          <div className="add-adaptation-form">
            <h3>Add New Adaptation</h3>
            
            <div className="form-group">
              <label>Category</label>
              <select 
                name="category"
                value={newAdaptation.category}
                onChange={handleNewAdaptationChange}
              >
                <option value="content">Content Adaptation</option>
                <option value="instruction">Instructional Adaptation</option>
                <option value="environment">Environmental Adaptation</option>
                <option value="assessment">Assessment Adaptation</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={newAdaptation.description}
                onChange={handleNewAdaptationChange}
                placeholder="Describe the cultural adaptation"
                rows={3}
              />
            </div>
            
            <div className="form-group">
              <label>Implementation</label>
              <textarea
                name="implementation"
                value={newAdaptation.implementation}
                onChange={handleNewAdaptationChange}
                placeholder="How will this adaptation be implemented?"
                rows={3}
              />
            </div>
            
            <button 
              className="add-button"
              onClick={handleAddAdaptation}
              disabled={!newAdaptation.description.trim()}
            >
              <FaPlus /> Add Adaptation
            </button>
          </div>
          
          <div className="adaptations-list">
            <h3>Current Adaptations</h3>
            
            {adaptations.length > 0 ? (
              adaptations.map(adaptation => renderAdaptationItem(adaptation))
            ) : (
              <p className="no-adaptations-message">
                No adaptations added yet. Add adaptations above or use the Suggestions tab for ideas.
              </p>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'suggestions' && (
        <div className="suggestions-section">
          <div className="section-description">
            <p>
              Based on the cultural profile, here are suggested adaptations to make learning 
              more culturally responsive. Click "Add to Adaptations" to include any suggestion 
              in your plan.
            </p>
          </div>
          
          <div className="suggestions-list">
            {generateSuggestions().map((suggestion, index) => (
              <div key={index} className={`suggestion-item ${suggestion.category}`}>
                <div className="suggestion-category">
                  {suggestion.category === 'content' && 'Content Adaptation'}
                  {suggestion.category === 'instruction' && 'Instructional Adaptation'}
                  {suggestion.category === 'environment' && 'Environmental Adaptation'}
                  {suggestion.category === 'assessment' && 'Assessment Adaptation'}
                </div>
                
                <div className="suggestion-description">
                  {suggestion.description}
                </div>
                
                <div className="suggestion-implementation">
                  <strong>Implementation:</strong> {suggestion.implementation}
                </div>
                
                <button 
                  className="add-suggestion-button"
                  onClick={() => {
                    setAdaptations([...adaptations, {
                      ...suggestion,
                      id: Date.now().toString()
                    }]);
                    
                    // Save changes
                    if (onUpdate) {
                      onUpdate({
                        culturalProfile,
                        adaptations: [...adaptations, {
                          ...suggestion,
                          id: Date.now().toString()
                        }]
                      });
                    }
                  }}
                >
                  <FaPlus /> Add to Adaptations
                </button>
              </div>
            ))}
          </div>
          
          <div className="info-box">
            <FaInfoCircle className="info-icon" />
            <p>
              These suggestions are starting points for cultural responsiveness. The most effective 
              adaptations are developed through ongoing dialogue with students, families, and 
              community members.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CulturalResponsiveness;
