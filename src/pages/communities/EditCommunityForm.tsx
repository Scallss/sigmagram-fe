// src/components/Communities/EditCommunityForm.tsx
import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { Community } from '../../types';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const EditCommunityForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    category: '',
    homePhoto: '',
    description: '',
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notAuthorized, setNotAuthorized] = useState(false);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const response = await api.get<Community>(`/communities/${id}`);
        const community = response.data;
        
        // Check if user is the creator of the community
        if (user?.id !== community.creatorId) {
          setNotAuthorized(true);
          return;
        }
        
        setFormData({
          category: community.category || '',
          homePhoto: community.homePhoto || '',
          description: community.description || '',
        });
      } catch (error) {
        console.error('Error fetching community:', error);
        setError('Failed to fetch community details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchCommunity();
  }, [id, user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await api.patch(`/communities/${id}`, formData);
      navigate(`/communities/${id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update community');
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this community? This action cannot be undone.')) {
      try {
        await api.delete(`/communities/${id}`);
        navigate('/communities');
      } catch (error) {
        console.error('Error deleting community:', error);
        setError('Failed to delete community');
      }
    }
  };

  if (isLoading) return <div className="loading">Loading community details...</div>;
  if (notAuthorized) return <div className="error">You are not authorized to edit this community</div>;
  if (error && !formData.category) return <div className="error">{error}</div>;

  return (
    <div className="edit-community-container">
      <h2>Edit Community</h2>
      
      <form onSubmit={handleSubmit} className="edit-community-form">
        {error && <div className="error">{error}</div>}
        
        <div className="form-group">
          <label htmlFor="category">Category Name</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="homePhoto">Banner Image URL</label>
          <input
            type="text"
            id="homePhoto"
            name="homePhoto"
            value={formData.homePhoto}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-actions">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
          
          <button 
            type="button" 
            className="delete-button"
            onClick={handleDelete}
          >
            Delete Community
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCommunityForm;