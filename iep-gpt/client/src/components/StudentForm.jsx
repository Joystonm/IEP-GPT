import React, { useState } from 'react';

const StudentForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: '',
    diagnosis: '',
    strengths: '',
    struggles: '',
    learningStyle: '',
    attentionSpan: '',
    triggers: '',
    interests: '',
    currentAccommodations: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Learning style options
  const learningStyles = [
    { value: 'visual', label: 'Visual (learns best through seeing)' },
    { value: 'auditory', label: 'Auditory (learns best through hearing)' },
    { value: 'kinesthetic', label: 'Kinesthetic (learns best through hands-on activities)' },
    { value: 'reading/writing', label: 'Reading/Writing (learns best through text)' },
    { value: 'multimodal', label: 'Multimodal (combination of styles)' }
  ];

  // Common neurodiversity diagnoses
  const diagnosisOptions = [
    { value: 'adhd', label: 'ADHD' },
    { value: 'autism', label: 'Autism Spectrum' },
    { value: 'dyslexia', label: 'Dyslexia' },
    { value: 'dyscalculia', label: 'Dyscalculia' },
    { value: 'dysgraphia', label: 'Dysgraphia' },
    { value: 'processing', label: 'Processing Disorder' },
    { value: 'executive', label: 'Executive Function Challenges' },
    { value: 'other', label: 'Other (please specify)' },
    { value: 'undiagnosed', label: 'Undiagnosed/Exploring' }
  ];

  return (
    <form className="student-form" onSubmit={handleSubmit}>
      <h2>Student Information</h2>
      
      <div className="form-section">
        <h3>Basic Information</h3>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Student Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              name="age"
              min="3"
              max="22"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="grade">Grade Level</label>
            <input
              type="text"
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="diagnosis">Diagnosis/Condition</label>
            <select
              id="diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              required
            >
              <option value="">Select a diagnosis</option>
              {diagnosisOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {formData.diagnosis === 'other' && (
              <input
                type="text"
                name="diagnosisOther"
                placeholder="Please specify diagnosis"
                value={formData.diagnosisOther || ''}
                onChange={handleChange}
                className="mt-2"
              />
            )}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Learning Profile</h3>
        <div className="form-group">
          <label htmlFor="strengths">Strengths</label>
          <textarea
            id="strengths"
            name="strengths"
            value={formData.strengths}
            onChange={handleChange}
            placeholder="What does the student excel at? (e.g., math concepts, creative thinking, verbal communication)"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="struggles">Struggles</label>
          <textarea
            id="struggles"
            name="struggles"
            value={formData.struggles}
            onChange={handleChange}
            placeholder="What areas does the student find challenging? (e.g., reading comprehension, staying focused, handwriting)"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="learningStyle">Primary Learning Style</label>
          <select
            id="learningStyle"
            name="learningStyle"
            value={formData.learningStyle}
            onChange={handleChange}
            required
          >
            <option value="">Select learning style</option>
            {learningStyles.map(style => (
              <option key={style.value} value={style.value}>
                {style.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-section">
        <h3>Attention & Engagement</h3>
        <div className="form-group">
          <label htmlFor="attentionSpan">Typical Attention Span</label>
          <select
            id="attentionSpan"
            name="attentionSpan"
            value={formData.attentionSpan}
            onChange={handleChange}
            required
          >
            <option value="">Select attention span</option>
            <option value="very-short">Very short (5-10 minutes)</option>
            <option value="short">Short (10-20 minutes)</option>
            <option value="moderate">Moderate (20-30 minutes)</option>
            <option value="long">Long (30+ minutes)</option>
            <option value="variable">Highly variable (depends on interest)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="triggers">Known Triggers or Challenges</label>
          <textarea
            id="triggers"
            name="triggers"
            value={formData.triggers}
            onChange={handleChange}
            placeholder="What situations, environments, or activities tend to cause distress or disengagement? (e.g., loud noises, transitions, writing tasks)"
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Additional Information</h3>
        <div className="form-group">
          <label htmlFor="interests">Interests & Motivators</label>
          <textarea
            id="interests"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            placeholder="What topics, activities, or rewards motivate this student? (e.g., dinosaurs, technology, earning points/stars)"
          />
        </div>

        <div className="form-group">
          <label htmlFor="currentAccommodations">Current Accommodations</label>
          <textarea
            id="currentAccommodations"
            name="currentAccommodations"
            value={formData.currentAccommodations}
            onChange={handleChange}
            placeholder="What strategies or accommodations have been helpful so far? (e.g., extra time, fidget tools, visual schedules)"
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="primary-button" disabled={isLoading}>
          {isLoading ? 'Generating 7-Day Plan...' : 'Generate 7-Day Learning Plan'}
        </button>
      </div>
    </form>
  );
};

export default StudentForm;
