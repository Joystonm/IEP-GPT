import React, { useState, useEffect } from 'react';
import { FaSearch, FaBookOpen, FaVideo, FaFileAlt, FaGamepad, FaStar, FaExternalLinkAlt, FaBookmark, FaFilter } from 'react-icons/fa';
import { getResourcesForStudent, getTeachingStrategies } from '../services/api';

const ResourceLibrary = ({ studentId, diagnosis }) => {
  const [resources, setResources] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('resources');
  const [filters, setFilters] = useState({
    type: 'all',
    ageGroup: 'all',
    difficulty: 'all'
  });
  const [savedResources, setSavedResources] = useState([]);
  
  // Fetch resources and strategies when component mounts
  useEffect(() => {
    if (studentId && diagnosis) {
      fetchResources();
      fetchStrategies();
    }
  }, [studentId, diagnosis]);
  
  const fetchResources = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getResourcesForStudent(studentId, diagnosis);
      
      // Add additional metadata to resources for filtering
      const enhancedResources = data.map(resource => ({
        ...resource,
        type: getResourceType(resource.title, resource.description),
        ageGroup: getAgeGroup(resource.description),
        difficulty: getDifficulty(resource.description)
      }));
      
      setResources(enhancedResources);
    } catch (err) {
      console.error('Error fetching resources:', err);
      setError('Failed to load educational resources. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchStrategies = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getTeachingStrategies(diagnosis);
      setStrategies(data);
    } catch (err) {
      console.error('Error fetching strategies:', err);
      setError('Failed to load teaching strategies. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to determine resource type based on title and description
  const getResourceType = (title, description) => {
    const text = (title + ' ' + description).toLowerCase();
    
    if (text.includes('video') || text.includes('watch') || text.includes('youtube')) {
      return 'video';
    } else if (text.includes('game') || text.includes('interactive') || text.includes('activity')) {
      return 'interactive';
    } else if (text.includes('worksheet') || text.includes('printable') || text.includes('pdf')) {
      return 'worksheet';
    } else {
      return 'article';
    }
  };
  
  // Helper function to determine age group based on description
  const getAgeGroup = (description) => {
    const text = description.toLowerCase();
    
    if (text.includes('elementary') || text.includes('young') || text.includes('k-5') || text.includes('ages 5-10')) {
      return 'elementary';
    } else if (text.includes('middle school') || text.includes('adolescent') || text.includes('ages 11-13')) {
      return 'middle';
    } else if (text.includes('high school') || text.includes('teen') || text.includes('ages 14-18')) {
      return 'high';
    } else {
      return 'all';
    }
  };
  
  // Helper function to determine difficulty level based on description
  const getDifficulty = (description) => {
    const text = description.toLowerCase();
    
    if (text.includes('beginner') || text.includes('basic') || text.includes('simple')) {
      return 'beginner';
    } else if (text.includes('advanced') || text.includes('complex') || text.includes('challenging')) {
      return 'advanced';
    } else {
      return 'intermediate';
    }
  };
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };
  
  const toggleSaveResource = (resource) => {
    const isAlreadySaved = savedResources.some(item => item.url === resource.url);
    
    if (isAlreadySaved) {
      setSavedResources(savedResources.filter(item => item.url !== resource.url));
    } else {
      setSavedResources([...savedResources, resource]);
    }
  };
  
  // Filter resources based on search query and filters
  const filteredResources = resources.filter(resource => {
    // Search filter
    const matchesSearch = searchQuery === '' || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Type filter
    const matchesType = filters.type === 'all' || resource.type === filters.type;
    
    // Age group filter
    const matchesAge = filters.ageGroup === 'all' || resource.ageGroup === filters.ageGroup;
    
    // Difficulty filter
    const matchesDifficulty = filters.difficulty === 'all' || resource.difficulty === filters.difficulty;
    
    return matchesSearch && matchesType && matchesAge && matchesDifficulty;
  });
  
  // Filter strategies based on search query
  const filteredStrategies = strategies.filter(strategy => 
    searchQuery === '' || 
    strategy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    strategy.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Get icon based on resource type
  const getResourceIcon = (type) => {
    switch (type) {
      case 'video':
        return <FaVideo />;
      case 'interactive':
        return <FaGamepad />;
      case 'worksheet':
        return <FaFileAlt />;
      default:
        return <FaBookOpen />;
    }
  };
  
  // Get difficulty stars
  const getDifficultyStars = (difficulty) => {
    switch (difficulty) {
      case 'beginner':
        return <div className="difficulty-stars"><FaStar /><FaStar className="inactive" /><FaStar className="inactive" /></div>;
      case 'intermediate':
        return <div className="difficulty-stars"><FaStar /><FaStar /><FaStar className="inactive" /></div>;
      case 'advanced':
        return <div className="difficulty-stars"><FaStar /><FaStar /><FaStar /></div>;
      default:
        return <div className="difficulty-stars"><FaStar /><FaStar /><FaStar className="inactive" /></div>;
    }
  };
  
  return (
    <div className="resource-library">
      <div className="library-header">
        <h2>Educational Resources</h2>
        <p className="library-description">
          Discover evidence-based resources and teaching strategies for students with {diagnosis}.
        </p>
        
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search resources and strategies..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="library-tabs">
          <button 
            className={`tab-button ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            <FaBookOpen /> Learning Resources
          </button>
          <button 
            className={`tab-button ${activeTab === 'strategies' ? 'active' : ''}`}
            onClick={() => setActiveTab('strategies')}
          >
            <FaFileAlt /> Teaching Strategies
          </button>
          <button 
            className={`tab-button ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <FaBookmark /> Saved ({savedResources.length})
          </button>
        </div>
      </div>
      
      {activeTab === 'resources' && (
        <div className="resources-section">
          <div className="filters-bar">
            <div className="filter-label">
              <FaFilter /> Filters:
            </div>
            
            <div className="filter-group">
              <label>Type:</label>
              <select 
                value={filters.type} 
                onChange={(e) => handleFilterChange('type', e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="article">Articles</option>
                <option value="video">Videos</option>
                <option value="interactive">Interactive</option>
                <option value="worksheet">Worksheets</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Age Group:</label>
              <select 
                value={filters.ageGroup} 
                onChange={(e) => handleFilterChange('ageGroup', e.target.value)}
              >
                <option value="all">All Ages</option>
                <option value="elementary">Elementary (5-10)</option>
                <option value="middle">Middle School (11-13)</option>
                <option value="high">High School (14-18)</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Difficulty:</label>
              <select 
                value={filters.difficulty} 
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="loading-resources">Loading resources...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="resources-grid">
              {filteredResources.length > 0 ? (
                filteredResources.map((resource, index) => (
                  <div key={index} className={`resource-card ${resource.type}`}>
                    <div className="resource-type-icon">
                      {getResourceIcon(resource.type)}
                    </div>
                    <h3 className="resource-title">{resource.title}</h3>
                    <p className="resource-description">{resource.description}</p>
                    <div className="resource-meta">
                      <span className="resource-source">{resource.source}</span>
                      {getDifficultyStars(resource.difficulty)}
                    </div>
                    <div className="resource-actions">
                      <a 
                        href={resource.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="resource-link"
                      >
                        View Resource <FaExternalLinkAlt />
                      </a>
                      <button 
                        className={`save-button ${savedResources.some(item => item.url === resource.url) ? 'saved' : ''}`}
                        onClick={() => toggleSaveResource(resource)}
                      >
                        <FaBookmark />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">No resources match your search criteria.</div>
              )}
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'strategies' && (
        <div className="strategies-section">
          {isLoading ? (
            <div className="loading-resources">Loading strategies...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="strategies-list">
              {filteredStrategies.length > 0 ? (
                filteredStrategies.map((strategy, index) => (
                  <div key={index} className="strategy-card">
                    <h3 className="strategy-title">{strategy.title}</h3>
                    <p className="strategy-description">{strategy.description}</p>
                    <div className="strategy-meta">
                      <span className="strategy-source">{strategy.source}</span>
                    </div>
                    <div className="strategy-actions">
                      <a 
                        href={strategy.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="strategy-link"
                      >
                        Read More <FaExternalLinkAlt />
                      </a>
                      <button 
                        className={`save-button ${savedResources.some(item => item.url === strategy.url) ? 'saved' : ''}`}
                        onClick={() => toggleSaveResource(strategy)}
                      >
                        <FaBookmark />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">No strategies match your search criteria.</div>
              )}
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'saved' && (
        <div className="saved-resources-section">
          {savedResources.length > 0 ? (
            <div className="resources-grid">
              {savedResources.map((resource, index) => (
                <div key={index} className={`resource-card ${resource.type || 'article'}`}>
                  <div className="resource-type-icon">
                    {getResourceIcon(resource.type || 'article')}
                  </div>
                  <h3 className="resource-title">{resource.title}</h3>
                  <p className="resource-description">{resource.description}</p>
                  <div className="resource-meta">
                    <span className="resource-source">{resource.source}</span>
                  </div>
                  <div className="resource-actions">
                    <a 
                      href={resource.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="resource-link"
                    >
                      View Resource <FaExternalLinkAlt />
                    </a>
                    <button 
                      className="save-button saved"
                      onClick={() => toggleSaveResource(resource)}
                    >
                      <FaBookmark />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-saved-resources">
              <FaBookmark className="bookmark-icon" />
              <p>You haven't saved any resources yet.</p>
              <p>Click the bookmark icon on any resource to save it for later.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResourceLibrary;
