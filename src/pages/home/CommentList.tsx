import React, { useEffect, useState, useCallback } from 'react';
import api from '../../api/axiosConfig';
import { Comment } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface CommentListProps {
  postId: string;
  refreshTrigger?: number;
}

const CommentList: React.FC<CommentListProps> = ({ postId, refreshTrigger = 0 }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const { user } = useAuth();

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/comments/post/${postId}`);
      setComments(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments, refreshTrigger]);

  const handleEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleSaveEdit = async (commentId: string) => {
    if (!editContent.trim()) {
      return;
    }
    
    try {
      await api.patch(`/comments/${commentId}`, { content: editContent });
      setComments(comments.map(comment => 
        comment.id === commentId ? { ...comment, content: editContent } : comment
      ));
      setEditingId(null);
      setEditContent('');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await api.delete(`/comments/${commentId}`);
        setComments(comments.filter(comment => comment.id !== commentId));
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };

  if (isLoading) return <div className="loading">Loading comments...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="comments-list">
      <h4>Comments ({comments.length})</h4>
      {comments.length === 0 ? (
        <p>No comments yet. Be the first to comment!</p>
      ) : (
        comments.map(comment => (
          <div key={comment.id} className="comment-item">
            <div className="comment-header">
              <div className="comment-author">
                <img 
                  src={comment.author.profilePicture || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} 
                  alt={comment.author.username} 
                  className="comment-avatar" 
                />
                <span>{comment.author.username}</span>
              </div>
              <span className="comment-date">
                {new Date(comment.createdAt).toLocaleString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            
            {editingId === comment.id ? (
              <div className="edit-comment-form">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={2}
                />
                <div className="edit-actions">
                  <button onClick={handleCancelEdit}>Cancel</button>
                  <button onClick={() => handleSaveEdit(comment.id)} disabled={!editContent.trim()}>
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <div className="comment-content">{comment.content}</div>
            )}
            
            {user && user.id === comment.authorId && editingId !== comment.id && (
              <div className="comment-actions">
                <button onClick={() => handleEdit(comment)}>
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(comment.id)}>
                  🗑️ Delete
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default CommentList;