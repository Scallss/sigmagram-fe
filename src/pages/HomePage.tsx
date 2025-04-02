// src/pages/HomePage.tsx
import React, { useState } from 'react';
import PostsList from '../pages/home/PostsList';
import CreatePostForm from '../pages/posts/CreatePostForm';

const HomePage: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePostCreated = () => {
    setRefreshKey(prev => prev + 1);
    setShowCreateForm(false);
  };

  return (
    <div className="home-page">
      <div className="page-header">
        <h1>Your Feed</h1>
        <button 
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="create-post-button"
        >
          {showCreateForm ? 'Cancel' : 'Create Post'}
        </button>
      </div>

      {showCreateForm && (
        <div className="create-post-section">
          <CreatePostForm onPostCreated={handlePostCreated} />
        </div>
      )}

      <div className="container">
        <PostsList refreshKey={refreshKey} />
      </div>
    </div>
  );
};

export default HomePage;