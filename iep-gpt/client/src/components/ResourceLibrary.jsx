import React, { useState, useEffect } from 'react';
import { 
  FaBook, 
  FaSearch, 
  FaVideo, 
  FaFileAlt, 
  FaGamepad, 
  FaStar, 
  FaRegStar, 
  FaBookmark, 
  FaRegBookmark,
  FaExternalLinkAlt,
  FaFilter,
  FaCheck
} from 'react-icons/fa';
import { getResourcesForStudent, getTeachingStrategies } from '../services/api';

const ResourceLibrary = ({ studentId, diagnosis, resourceData, onResourceUpdate }) => {
  const [activeTab, setActiveTab] = useState('resources');
  const [searchQuery, setSearchQuery] = useState('');
  const [resources, setResources] = useState([]);
  const [strategies, setStrategies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [savedResources, setSavedResources] = useState([]);
  const [typeFilter, setTypeFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Load resources and strategies
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      try {
        // If we have existing resource data, use it
        if (resourceData) {
          setResources(resourceData.resources || []);
          setStrategies(resourceData.strategies || []);
          setSavedResources(resourceData.savedResources || []);
        } else {
          // Otherwise fetch new data
          const [resourcesData, strategiesData] = await Promise.all([
            getResourcesForStudent(studentId, diagnosis),
            getTeachingStrategies(diagnosis)
          ]);
          
          setResources(resourcesData);
          setStrategies(strategiesData);
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (studentId && diagnosis) {
      fetchData();
    }
  }, [studentId, diagnosis, resourceData]);
  
  // Filter resources based on search query and filters
  const filteredResources = resources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = 
      typeFilter === 'all' || 
      resource.type === typeFilter;
    
    const matchesDifficulty = 
      difficultyFilter === 'all' || 
      resource.difficulty === difficultyFilter;
    
    return matchesSearch && matchesType && matchesDifficulty;
  });
  
  // Filter strategies based on search query
  const filteredStrategies = strategies.filter(strategy => 
    strategy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    strategy.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Toggle saving a resource
  const toggleSaveResource = (resourceId) => {
    if (savedResources.includes(resourceId)) {
      // Remove from saved resources
      const updatedSaved = savedResources.filter(id => id !== resourceId);
      setSavedResources(updatedSaved);
      
      // Update parent component
      if (onResourceUpdate) {
        onResourceUpdate({
          resources,
          strategies,
          savedResources: updatedSaved,
          lastUpdated: new Date().toISOString()
        });
        
        // Show success message
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } else {
      // Add to saved resources
      const updatedSaved = [...savedResources, resourceId];
      setSavedResources(updatedSaved);
      
      // Update parent component
      if (onResourceUpdate) {
        onResourceUpdate({
          resources,
          strategies,
          savedResources: updatedSaved,
          lastUpdated: new Date().toISOString()
        });
        
        // Show success message
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    }
  };
  
  // Render difficulty stars
  const renderDifficultyStars = (difficulty) => {
    let stars = 0;
    
    if (difficulty === 'beginner') {
      stars = 1;
    } else if (difficulty === 'intermediate') {
      stars = 2;
    } else if (difficulty === 'advanced') {
      stars = 3;
    }
    
    return (
      <div className="difficulty-stars">
        {[...Array(3)].map((_, index) => (
          <span key={index} className={index < stars ? '' : 'inactive'}>
            <FaStar />
          </span>
        ))}
      </div>
    );
  };
  
  // Get icon for resource type
  const getResourceTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <FaVideo />;
      case 'interactive':
        return <FaGamepad />;
      case 'worksheet':
        return <FaFileAlt />;
      default:
        return <FaBook />;
    }
  };
  
  // Filter saved resources
  const savedResourcesList = resources.filter(resource => 
    savedResources.includes(resource.id || resource.title)
  );

  return (
    <div className="resource-library">
      <div className="library-header">
        <p className="library-description">
          Access educational resources and teaching strategies specifically selected for 
          {diagnosis ? ` students with ${diagnosis}` : ' your student'}.
        </p>
        
        {saveSuccess && (
          <div className="success-message">
            <FaCheck /> Resource library updated successfully!
          </div>
        )}
        
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search resources and strategies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="library-tabs">
        <button 
          className={`tab-button ${activeTab === 'resources' ? 'active' : ''}`}
          onClick={() => setActiveTab('resources')}
        >
          <FaBook /> Educational Resources
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
          <FaBookmark /> Saved Resources
        </button>
      </div>
      
      {activeTab === 'resources' && (
        <>
          <div className="filters-bar">
            <span className="filter-label">
              <FaFilter /> Filters:
            </span>
            
            <div className="filter-group">
              <label>Type:</label>
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="article">Articles</option>
                <option value="video">Videos</option>
                <option value="interactive">Interactive</option>
                <option value="worksheet">Worksheets</option>
              </select>
            </div>
            
            <div className="filter-group">
              <label>Difficulty:</label>
              <select 
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="loading-resources">
              <p>Loading resources...</p>
            </div>
          ) : filteredResources.length > 0 ? (
            <div className="resources-grid">
              {filteredResources.map((resource, index) => (
                <div key={index} className={`resource-card ${resource.type}`}>
                  <div className="resource-type-icon">
                    {getResourceTypeIcon(resource.type)}
                  </div>
                  
                  <h3 className="resource-title">{resource.title}</h3>
                  <p className="resource-description">{resource.description}</p>
                  
                  <div className="resource-meta">
                    <span className="resource-source">Source: {resource.source}</span>
                    {renderDifficultyStars(resource.difficulty)}
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
                      className={`save-button ${savedResources.includes(resource.id || resource.title) ? 'saved' : ''}`}
                      onClick={() => toggleSaveResource(resource.id || resource.title)}
                    >
                      {savedResources.includes(resource.id || resource.title) ? (
                        <FaBookmark />
                      ) : (
                        <FaRegBookmark />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No resources match your search criteria. Try adjusting your filters or search terms.</p>
            </div>
          )}
        </>
      )}
      
      {activeTab === 'strategies' && (
        <>
          {isLoading ? (
            <div className="loading-resources">
              <p>Loading strategies...</p>
            </div>
          ) : filteredStrategies.length > 0 ? (
            <div className="strategies-list">
              {filteredStrategies.map((strategy, index) => (
                <div key={index} className="strategy-card">
                  <h3 className="strategy-title">{strategy.title}</h3>
                  <p className="strategy-description">{strategy.description}</p>
                  
                  {strategy.implementation && (
                    <div className="strategy-implementation">
                      <strong>Implementation:</strong> {strategy.implementation}
                    </div>
                  )}
                  
                  {strategy.source && (
                    <div className="strategy-meta">
                      Source: {strategy.source}
                    </div>
                  )}
                  
                  {strategy.url && (
                    <div className="strategy-actions">
                      <a 
                        href={strategy.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="strategy-link"
                      >
                        Learn More <FaExternalLinkAlt />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <p>No strategies match your search criteria. Try adjusting your search terms.</p>
            </div>
          )}
        </>
      )}
      
      {activeTab === 'saved' && (
        <>
          {savedResourcesList.length > 0 ? (
            <div className="resources-grid">
              {savedResourcesList.map((resource, index) => (
                <div key={index} className={`resource-card ${resource.type}`}>
                  <div className="resource-type-icon">
                    {getResourceTypeIcon(resource.type)}
                  </div>
                  
                  <h3 className="resource-title">{resource.title}</h3>
                  <p className="resource-description">{resource.description}</p>
                  
                  <div className="resource-meta">
                    <span className="resource-source">Source: {resource.source}</span>
                    {renderDifficultyStars(resource.difficulty)}
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
                      onClick={() => toggleSaveResource(resource.id || resource.title)}
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
              <p>Click the bookmark icon on any resource to save it for quick access.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ResourceLibrary;
