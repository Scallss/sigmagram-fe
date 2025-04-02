// src/pages/CommunityDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { Community } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import CreatePostForm from '../posts/CreatePostForm';
import PostsList from '../home/PostsList';

const CommunityDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [community, setCommunity] = useState<Community | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch community details only
  useEffect(() => {
    const fetchCommunity = async () => {
      if (!id) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await api.get(`/communities/${id}`);
        setCommunity(response.data);
        setFollowersCount(response.data.followersCount);
        setIsFollowing(response.data.isFollowed);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load community');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCommunity();
  }, [id]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await api.delete(`/communities/${id}/unfollow`);
        setIsFollowing(false);
        setFollowersCount(prev => prev - 1);
      } else {
        await api.post(`/communities/${id}/follow`);
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling follow status:', error);
    }
  };

  const handlePostCreated = () => {
    setShowCreateForm(false);
    // Increment refreshKey to trigger a re-fetch in PostsList
    setRefreshKey(prev => prev + 1);
  };

  if (isLoading) return <div className="loading">Loading community...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!community) return <div className="not-found">Community not found</div>;

  return (
    <div className="community-detail-page">
      <div className="community-header">
        {community.homePhoto && (
          <img 
            src={community.homePhoto} 
            alt={community.category} 
            className="community-banner" 
          />
        )}
        
        <div className="community-info">
          <h1>{community.category}</h1>
          <p className="followers-count">{followersCount} Followers</p>
          <p className="community-description">{community.description}</p>
          
          <div className="community-actions">
            {user && (
              <>
                <button onClick={handleFollow} className={isFollowing ? 'following' : ''}>
                  {isFollowing ? 'Unfollow' : 'Follow'}
                </button>
                
                {community.creatorId === user.id && (
                  <Link to={`/communities/${id}/edit`} className="edit-button">
                    Edit Community
                  </Link>
                )}
                {isFollowing && (
                  <button 
                  onClick={() => setShowCreateForm(!showCreateForm)}
                  className="create-post-button"
                >
                  {showCreateForm ? 'Cancel' : 'Create Post'}
                </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {showCreateForm && (
        <div className="create-post-section">
          <CreatePostForm 
            communityId={id} 
            onPostCreated={handlePostCreated} 
          />
        </div>
      )}
      
      <div className="community-posts">
        <PostsList 
          communityId={id}
          title="Posts" 
          refreshKey={refreshKey}
          emptyMessage="No posts in this community yet."
        />
      </div>
    </div>
  );
};

export default CommunityDetailPage;