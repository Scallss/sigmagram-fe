// src/pages/CommunitiesPage.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { Community } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import CreateCommunityForm from './CreateCommunitiesForm';

const CommunitiesPage: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCommunities = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await api.get('/communities');
        setCommunities(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load communities');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunities();
  }, []);

  const handleCommunityCreated = async () => {
    setShowCreateForm(false);
    
    try {
      const response = await api.get('/communities');
      setCommunities(response.data);
    } catch (error) {
      console.error('Error refreshing communities:', error);
    }
  };

  if (isLoading) return <div className="loading">Loading communities...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="communities-page">
      <div className="page-header">
        <h1>Communities</h1>
        {user && (
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="create-community-button"
          >
            {showCreateForm ? 'Cancel' : 'Create Community'}
          </button>
        )}
      </div>
      
      {showCreateForm && (
        <div className="create-community-section">
          <CreateCommunityForm onCommunityCreated={handleCommunityCreated} />
        </div>
      )}
      
      <div className="communities-grid">
        {communities.length === 0 ? (
          <p className="no-communities">No communities found.</p>
        ) : (
          communities.map(community => (
            <div key={community.id} className="community-card">
              {community.homePhoto && (
                <img 
                  src={community.homePhoto} 
                  alt={community.category} 
                  className="community-thumbnail" 
                />
              )}
              
              <div className="community-card-content">
                <h3>{community.category}</h3>
                <p className="followers-count">{community.followersCount} Followers</p>
                {community.description && (
                  <p className="description-preview">
                    {community.description.length > 100 
                      ? `${community.description.slice(0, 100)}...` 
                      : community.description}
                  </p>
                )}
                <Link to={`/communities/${community.id}`} className="view-button">
                  View Community
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunitiesPage;