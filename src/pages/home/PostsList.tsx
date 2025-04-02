import React, { useEffect, useState } from 'react';
import api from '../../api/axiosConfig';
import { Post } from '../../types';
import PostCard from './PostCard';

interface PostsListProps {
  communityId?: string;
  title?: string;
  refreshKey?: number;
  emptyMessage?: string;
}

const PostsList: React.FC<PostsListProps> = ({ 
  communityId, 
  title = "Posts from Communities You Follow", 
  refreshKey = 0,
  emptyMessage = "No posts found. Try following some communities!" 
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [skip, setSkip] = useState<number>(0);
  const [hasMorePosts, setHasMorePosts] = useState<boolean>(true);

  const fetchPosts = async (skipValue: number, isInitialLoad: boolean) => {
    try {
      const loadingState = isInitialLoad ? setIsLoading : setIsLoadingMore;
      loadingState(true);

      let queryString = `skip=${skipValue}`;
      if (communityId) queryString += `&communityId=${communityId}`;
      
      const response = await api.get(`/posts?${queryString}`);
      
      if (response.data.length === 0) {
        setHasMorePosts(false);
      } else {
        setPosts((prevPosts) => 
          skipValue === 0 ? response.data : [...prevPosts, ...response.data]
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load posts');
      console.error('Error fetching posts:', err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setSkip(0);
    setHasMorePosts(true);
    fetchPosts(0, true);
  }, [communityId, refreshKey]);

  useEffect(() => {
    if (skip > 0) {
      fetchPosts(skip, false);
    }
  }, [skip]);

  const loadMore = () => {
    setSkip((prevSkip) => prevSkip + 5); 
  };

  const handleDeletePost = (postId: string) => {
    setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
  };

  const handleUpdatePost = (postId: string, content: string, photo?: string) => {
    setPosts(currentPosts => 
      currentPosts.map(post => 
        post.id === postId ? { ...post, content, photo } : post
      )
    );
  };

  if (error && posts.length === 0) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="posts-list">
      {title && <h2>{title}</h2>}
      
      {posts.length === 0 && !isLoading ? (
        <p className="no-posts">{emptyMessage}</p>
      ) : (
        posts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            onDeletePost={handleDeletePost}
            onUpdatePost={handleUpdatePost}
          />
        ))
      )}
      
      {isLoading && <div className="loading">Loading posts...</div>}
      {isLoadingMore && <div className="loading">Loading more posts...</div>}
      
      {!isLoading && !isLoadingMore && hasMorePosts && posts.length > 0 && (
        <button onClick={loadMore} className="load-more-btn">
          Load More
        </button>
      )}
    </div>
  );
};

export default PostsList;