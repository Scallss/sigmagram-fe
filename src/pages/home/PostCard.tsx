// src/components/Home/PostCard.tsx
import React, { useState } from 'react';
import { Post } from '../../types';
import api from '../../api/axiosConfig';
import { useAuth } from '../../hooks/useAuth';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

interface PostCardProps {
  post: Post;
  onDeletePost?: (postId: string) => void;
  onUpdatePost?: (postId: string, content: string, photo?: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDeletePost, onUpdatePost }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedPhoto, setEditedPhoto] = useState(post.photo || '');
  const [isDeleting, setIsDeleting] = useState(false);
  const [commentRefreshCounter, setCommentRefreshCounter] = useState(0);

  

  const handleLike = async () => {
    try {
      if (liked) {
        await api.delete(`/likes/${post.id}`);
        setLikesCount(prev => prev - 1);
      } else {
        await api.post(`/likes/${post.id}`);
        setLikesCount(prev => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleCommentAdded = () => {
    // Increment the counter to trigger a refresh
    setCommentRefreshCounter(prev => prev + 1);
    
    // Also update the comment count in the UI
    post.commentsCount = (post.commentsCount || 0) + 1;
  };

  const handleToggleComments = () => {
    setShowComments(!showComments);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedContent(post.content);
    setEditedPhoto(post.photo || '');
  };

  const isPostEditable = () => {
    const creationTime = new Date(post.createdAt).getTime();
    const currentTime = new Date().getTime();
    const timeDifferenceMinutes = (currentTime - creationTime) / (1000 * 60);
    
    // Return true if less than 30 minutes have passed
    return timeDifferenceMinutes < 30;
  };

  const handleSaveEdit = async () => {
    try {
      await api.patch(`/posts/${post.id}`, { 
        content: editedContent,
        photo: editedPhoto || undefined // Only send if not empty
      });
      setIsEditing(false);
      if (onUpdatePost) onUpdatePost(post.id, editedContent, editedPhoto);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`/posts/${post.id}`);
      if (onDeletePost) onDeletePost(post.id);
    } catch (error) {
      console.error('Error deleting post:', error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
      <div className="post-author">
        <img
          src={post.author.profilePicture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
          alt={`${post.author.username}'s profile`}
          className="author-avatar"
        />
        <span>{post.author.username}</span>
      </div>
        <div className="post-community">
          <span>in {post.community.category}</span>
        </div>
      </div>
      
      {isEditing ? (
        <div className="post-edit">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            rows={4}
            placeholder="Write your post content..."
          />
          <div className="form-group">
            <label htmlFor="photo">Photo URL (optional)</label>
            <input
              type="text"
              id="photo"
              value={editedPhoto}
              onChange={(e) => setEditedPhoto(e.target.value)}
              placeholder="Enter image URL..."
            />
          </div>
          <div className="edit-actions">
            <button onClick={handleCancelEdit}>Cancel</button>
            <button onClick={handleSaveEdit}>Save</button>
          </div>
        </div>
      ) : (
        <>
          <div className="post-content">{post.content}</div>
          
          {post.photo && (
            <div className="post-image">
              <img src={post.photo} alt="Post" />
            </div>
          )}
        </>
      )}

      <div className="post-actions">
        <button className={`like-button ${liked ? 'liked' : ''}`} onClick={handleLike}>
          {liked ? '❤️' : '🤍'} {likesCount}
        </button>
        <button onClick={handleToggleComments}>
          💬 {post.commentsCount}
        </button>
        
        {user && user.id === post.authorId && (
        <div className="owner-actions">
          {isPostEditable() && (
            <button onClick={handleEditClick} disabled={isEditing}>
              Edit
            </button>
          ) }
          <button 
            onClick={handleDeletePost} 
            disabled={isDeleting}
            className="delete-button"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}
      </div>
      
      <div className="post-footer">
        <span className="post-date">
          {new Date(post.createdAt).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
      
      {showComments && (
        <div className="comments-section">
          <CommentForm 
            postId={post.id} 
            onCommentAdded={handleCommentAdded} 
          />
          <CommentList 
            postId={post.id} 
            refreshTrigger={commentRefreshCounter} 
          />
        </div>
      )}
    </div>
  );
};

export default PostCard;