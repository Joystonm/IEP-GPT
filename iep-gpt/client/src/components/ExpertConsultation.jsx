import React, { useState, useEffect } from 'react';
import { 
  FaUserMd, 
  FaPaperPlane, 
  FaComments, 
  FaFileAlt, 
  FaUserCircle, 
  FaCalendarAlt, 
  FaClock,
  FaCheckCircle,
  FaExclamationCircle,
  FaSearch,
  FaStar,
  FaFilter,
  FaVideo,
  FaCheck
} from 'react-icons/fa';

/**
 * Expert Consultation Component
 * 
 * A feature to request feedback from special education experts
 * on learning plans and specific challenges.
 */
const ExpertConsultation = ({ studentData, learningPlan, consultationData, onConsultationUpdate }) => {
  const [activeTab, setActiveTab] = useState('experts');
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [consultationRequest, setConsultationRequest] = useState({
    type: 'plan-review',
    urgency: 'normal',
    specificQuestions: '',
    attachPlan: true,
    attachProfile: true,
    preferredTime: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [expertFilter, setExpertFilter] = useState('all');
  const [consultations, setConsultations] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Load existing consultation data if available
  useEffect(() => {
    if (consultationData) {
      if (consultationData.consultations) {
        setConsultations(consultationData.consultations);
      }
    }
  }, [consultationData]);
  
  // Mock experts data
  const experts = [
    {
      id: 'exp-1',
      name: 'Dr. Sarah Johnson',
      title: 'Special Education Specialist',
      expertise: ['ADHD', 'Executive Function', 'Behavior Management'],
      experience: '15+ years',
      rating: 4.9,
      reviews: 124,
      availability: 'Available within 24 hours',
      bio: 'Dr. Johnson specializes in ADHD and executive function challenges. She has worked with hundreds of students to develop personalized learning strategies that leverage strengths and address specific challenges.',
      photo: 'https://randomuser.me/api/portraits/women/45.jpg'
    },
    {
      id: 'exp-2',
      name: 'Michael Rodriguez, M.Ed.',
      title: 'Reading Specialist & Dyslexia Expert',
      expertise: ['Dyslexia', 'Reading Interventions', 'Literacy'],
      experience: '12 years',
      rating: 4.8,
      reviews: 98,
      availability: 'Available within 48 hours',
      bio: 'Michael is a certified reading specialist with extensive experience developing interventions for students with dyslexia and other reading challenges. He focuses on evidence-based, multisensory approaches.',
      photo: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 'exp-3',
      name: 'Dr. Aisha Patel',
      title: 'Autism Education Consultant',
      expertise: ['Autism Spectrum', 'Sensory Processing', 'Social Skills'],
      experience: '18 years',
      rating: 5.0,
      reviews: 156,
      availability: 'Limited availability (1-2 weeks)',
      bio: 'Dr. Patel specializes in educational strategies for students with autism spectrum disorders. Her approach emphasizes sensory-friendly environments, visual supports, and building on special interests.',
      photo: 'https://randomuser.me/api/portraits/women/65.jpg'
    },
    {
      id: 'exp-4',
      name: 'James Wilson, Ed.S.',
      title: 'Behavioral Intervention Specialist',
      expertise: ['Behavior Management', 'ADHD', 'Emotional Regulation'],
      experience: '10 years',
      rating: 4.7,
      reviews: 87,
      availability: 'Available within 24 hours',
      bio: 'James specializes in positive behavioral interventions and supports (PBIS). He helps develop practical strategies for managing challenging behaviors and building self-regulation skills.',
      photo: 'https://randomuser.me/api/portraits/men/22.jpg'
    },
    {
      id: 'exp-5',
      name: 'Dr. Elena Gonzalez',
      title: 'Bilingual Education & Cultural Specialist',
      expertise: ['Bilingual Education', 'Cultural Responsiveness', 'ELL'],
      experience: '14 years',
      rating: 4.9,
      reviews: 112,
      availability: 'Available within 48 hours',
      bio: 'Dr. Gonzalez specializes in supporting culturally and linguistically diverse students. She provides guidance on creating inclusive, culturally responsive learning environments and bilingual education strategies.',
      photo: 'https://randomuser.me/api/portraits/women/28.jpg'
    }
  ];
  
  // Filter experts based on search query and filter
  const filteredExperts = experts.filter(expert => {
    const matchesSearch = 
      expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.expertise.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
      expert.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = 
      expertFilter === 'all' || 
      (expertFilter === 'available-24h' && expert.availability.includes('24 hours')) ||
      (expertFilter === 'adhd' && expert.expertise.includes('ADHD')) ||
      (expertFilter === 'autism' && expert.expertise.includes('Autism Spectrum')) ||
      (expertFilter === 'dyslexia' && expert.expertise.includes('Dyslexia'));
    
    return matchesSearch && matchesFilter;
  });
  
  // Handle consultation request form changes
  const handleRequestChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConsultationRequest(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  // Submit consultation request
  const handleSubmitRequest = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);
    
    // In a real implementation, this would call an API
    // For now, we'll simulate an API call with setTimeout
    setTimeout(() => {
      try {
        // Create a new consultation
        const newConsultation = {
          id: `cons-${Date.now()}`,
          expertId: selectedExpert.id,
          expertName: selectedExpert.name,
          expertPhoto: selectedExpert.photo,
          type: consultationRequest.type,
          status: 'pending',
          requestDate: new Date().toISOString(),
          completedDate: null,
          summary: consultationRequest.specificQuestions || `Requested a ${consultationRequest.type} consultation`,
          feedback: null,
          attachments: []
        };
        
        // Add to consultations list
        const updatedConsultations = [newConsultation, ...consultations];
        setConsultations(updatedConsultations);
        
        // Update parent component
        if (onConsultationUpdate) {
          onConsultationUpdate({
            consultations: updatedConsultations,
            lastUpdated: new Date().toISOString()
          });
          
          // Show success message
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 3000);
        }
        
        // Reset form
        setConsultationRequest({
          type: 'plan-review',
          urgency: 'normal',
          specificQuestions: '',
          attachPlan: true,
          attachProfile: true,
          preferredTime: ''
        });
        
        setSelectedExpert(null);
        setSubmitSuccess(true);
        setActiveTab('consultations');
      } catch (error) {
        setSubmitError('There was an error submitting your consultation request. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }, 1500);
  };
  
  // Render expert card
  const renderExpertCard = (expert) => {
    return (
      <div 
        key={expert.id} 
        className={`expert-card ${selectedExpert?.id === expert.id ? 'selected' : ''}`}
        onClick={() => setSelectedExpert(expert)}
      >
        <div className="expert-photo">
          <img src={expert.photo} alt={expert.name} />
        </div>
        
        <div className="expert-info">
          <h3 className="expert-name">{expert.name}</h3>
          <p className="expert-title">{expert.title}</p>
          
          <div className="expert-expertise">
            {expert.expertise.map((skill, index) => (
              <span key={index} className="expertise-tag">{skill}</span>
            ))}
          </div>
          
          <div className="expert-meta">
            <div className="expert-experience">
              <span className="meta-label">Experience:</span> {expert.experience}
            </div>
            <div className="expert-rating">
              <span className="meta-label">Rating:</span>
              <span className="rating-stars">
                <FaStar className="star-icon" />
                {expert.rating}
              </span>
              <span className="review-count">({expert.reviews} reviews)</span>
            </div>
          </div>
          
          <div className="expert-availability">
            <FaCalendarAlt className="availability-icon" />
            {expert.availability}
          </div>
        </div>
        
        {selectedExpert?.id === expert.id && (
          <div className="expert-selected-indicator">
            <FaCheckCircle />
          </div>
        )}
      </div>
    );
  };
  
  // Render consultation card
  const renderConsultationCard = (consultation) => {
    return (
      <div 
        key={consultation.id} 
        className={`consultation-card ${consultation.status}`}
      >
        <div className="consultation-header">
          <div className="consultation-expert">
            <img 
              src={consultation.expertPhoto} 
              alt={consultation.expertName} 
              className="expert-thumbnail"
            />
            <div className="expert-details">
              <h3 className="expert-name">{consultation.expertName}</h3>
              <p className="consultation-type">
                {consultation.type === 'plan-review' ? 'Learning Plan Review' : 'Specific Question'}
              </p>
            </div>
          </div>
          
          <div className="consultation-status">
            {consultation.status === 'completed' && (
              <span className="status-badge completed">
                <FaCheckCircle /> Completed
              </span>
            )}
            {consultation.status === 'in-progress' && (
              <span className="status-badge in-progress">
                <FaClock /> In Progress
              </span>
            )}
            {consultation.status === 'pending' && (
              <span className="status-badge pending">
                <FaExclamationCircle /> Pending
              </span>
            )}
          </div>
        </div>
        
        <div className="consultation-dates">
          <div className="request-date">
            <FaCalendarAlt className="date-icon" />
            Requested: {new Date(consultation.requestDate).toLocaleDateString()}
          </div>
          {consultation.completedDate && (
            <div className="completed-date">
              <FaCheckCircle className="date-icon" />
              Completed: {new Date(consultation.completedDate).toLocaleDateString()}
            </div>
          )}
        </div>
        
        <div className="consultation-content">
          <div className="consultation-summary">
            <h4>Summary</h4>
            <p>{consultation.summary}</p>
          </div>
          
          {consultation.feedback && (
            <div className="consultation-feedback">
              <h4>Expert Feedback</h4>
              <p>{consultation.feedback}</p>
            </div>
          )}
          
          {consultation.attachments.length > 0 && (
            <div className="consultation-attachments">
              <h4>Attachments</h4>
              <ul className="attachment-list">
                {consultation.attachments.map((attachment, index) => (
                  <li key={index} className="attachment-item">
                    <FaFileAlt className="attachment-icon" />
                    {attachment}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="consultation-actions">
          {consultation.status === 'completed' && (
            <button className="secondary-button">
              <FaFileAlt /> View Full Report
            </button>
          )}
          {consultation.status !== 'completed' && (
            <button className="primary-button">
              <FaComments /> Send Message
            </button>
          )}
          {consultation.status === 'in-progress' && (
            <button className="accent-button">
              <FaVideo /> Schedule Video Call
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="expert-consultation">
      <div className="consultation-header">
        <h2><FaUserMd /> Expert Consultation</h2>
        <p className="consultation-description">
          Get personalized feedback and recommendations from special education experts 
          to enhance your learning plans and address specific challenges.
        </p>
        
        {saveSuccess && (
          <div className="success-message">
            <FaCheck /> Consultation request saved successfully!
          </div>
        )}
      </div>
      
      <div className="consultation-tabs">
        <button 
          className={`tab-button ${activeTab === 'experts' ? 'active' : ''}`}
          onClick={() => setActiveTab('experts')}
        >
          <FaUserMd /> Find Experts
        </button>
        <button 
          className={`tab-button ${activeTab === 'request' ? 'active' : ''}`}
          onClick={() => setActiveTab('request')}
          disabled={!selectedExpert}
        >
          <FaPaperPlane /> Request Consultation
        </button>
        <button 
          className={`tab-button ${activeTab === 'consultations' ? 'active' : ''}`}
          onClick={() => setActiveTab('consultations')}
        >
          <FaComments /> My Consultations
        </button>
      </div>
      
      {activeTab === 'experts' && (
        <div className="experts-section">
          <div className="experts-search-bar">
            <div className="search-input">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by name, expertise, or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="filter-dropdown">
              <FaFilter className="filter-icon" />
              <select
                value={expertFilter}
                onChange={(e) => setExpertFilter(e.target.value)}
              >
                <option value="all">All Specialties</option>
                <option value="available-24h">Available within 24h</option>
                <option value="adhd">ADHD Specialists</option>
                <option value="autism">Autism Specialists</option>
                <option value="dyslexia">Dyslexia Specialists</option>
              </select>
            </div>
          </div>
          
          <div className="experts-list">
            {filteredExperts.length > 0 ? (
              filteredExperts.map(expert => renderExpertCard(expert))
            ) : (
              <div className="no-experts-found">
                <p>No experts match your search criteria. Try adjusting your filters.</p>
              </div>
            )}
          </div>
          
          {selectedExpert && (
            <div className="expert-detail">
              <h3>Expert Profile</h3>
              
              <div className="expert-bio">
                <h4>About {selectedExpert.name}</h4>
                <p>{selectedExpert.bio}</p>
              </div>
              
              <div className="expert-actions">
                <button 
                  className="primary-button"
                  onClick={() => setActiveTab('request')}
                >
                  <FaPaperPlane /> Request Consultation
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'request' && selectedExpert && (
        <div className="request-section">
          <div className="selected-expert-summary">
            <img 
              src={selectedExpert.photo} 
              alt={selectedExpert.name} 
              className="expert-photo-small"
            />
            <div className="expert-summary-details">
              <h3>Consultation with {selectedExpert.name}</h3>
              <p className="expert-title">{selectedExpert.title}</p>
            </div>
          </div>
          
          <form className="consultation-form" onSubmit={handleSubmitRequest}>
            <div className="form-group">
              <label htmlFor="type">Consultation Type</label>
              <select
                id="type"
                name="type"
                value={consultationRequest.type}
                onChange={handleRequestChange}
                required
              >
                <option value="plan-review">Learning Plan Review</option>
                <option value="specific-question">Specific Question or Challenge</option>
                <option value="strategy-development">Strategy Development</option>
                <option value="progress-review">Progress Review</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="urgency">Urgency</label>
              <select
                id="urgency"
                name="urgency"
                value={consultationRequest.urgency}
                onChange={handleRequestChange}
              >
                <option value="normal">Normal (Response within 48 hours)</option>
                <option value="urgent">Urgent (Response within 24 hours)</option>
                <option value="immediate">Immediate (Response ASAP)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="specificQuestions">Specific Questions or Concerns</label>
              <textarea
                id="specificQuestions"
                name="specificQuestions"
                value={consultationRequest.specificQuestions}
                onChange={handleRequestChange}
                placeholder="Describe what you'd like the expert to focus on. Be as specific as possible to get the most helpful feedback."
                rows={5}
                required
              />
            </div>
            
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="attachPlan"
                  checked={consultationRequest.attachPlan}
                  onChange={handleRequestChange}
                />
                Attach current learning plan
              </label>
            </div>
            
            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="attachProfile"
                  checked={consultationRequest.attachProfile}
                  onChange={handleRequestChange}
                />
                Attach student profile
              </label>
            </div>
            
            <div className="form-group">
              <label htmlFor="preferredTime">Preferred Time for Video Consultation (Optional)</label>
              <input
                type="datetime-local"
                id="preferredTime"
                name="preferredTime"
                value={consultationRequest.preferredTime}
                onChange={handleRequestChange}
              />
            </div>
            
            {submitError && (
              <div className="error-message">
                <FaExclamationCircle /> {submitError}
              </div>
            )}
            
            <div className="form-actions">
              <button 
                type="submit" 
                className="primary-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Consultation Request'}
              </button>
              <button 
                type="button" 
                className="secondary-button"
                onClick={() => setActiveTab('experts')}
                disabled={isSubmitting}
              >
                Back to Experts
              </button>
            </div>
          </form>
        </div>
      )}
      
      {activeTab === 'consultations' && (
        <div className="consultations-section">
          {submitSuccess && (
            <div className="success-message">
              <FaCheckCircle /> Your consultation request has been submitted successfully!
            </div>
          )}
          
          <h3>My Consultations</h3>
          
          {consultations.length > 0 ? (
            <div className="consultations-list">
              {consultations.map(consultation => renderConsultationCard(consultation))}
            </div>
          ) : (
            <div className="no-consultations">
              <p>You haven't requested any consultations yet.</p>
              <button 
                className="primary-button"
                onClick={() => setActiveTab('experts')}
              >
                Find an Expert
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ExpertConsultation;
