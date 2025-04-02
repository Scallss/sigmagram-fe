// src/components/Posts/CreatePostForm.tsx
import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { Community, CreatePostData } from '../../types';

interface CreatePostFormProps {
  onPostCreated: () => void;
  communityId?: string;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostCreated }) => {
  const [formData, setFormData] = useState<CreatePostData>({
    content: '',
    photo: '',
    communityId: '',
  });
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await api.get('/communities');
        setCommunities(response.data);
        // Set default community if available
        if (response.data.length > 0) {
          setFormData(prev => ({ ...prev, communityId: response.data[0].id }));
        }
      } catch (error) {
        console.error('Error fetching communities:', error);
      }
    };

    fetchCommunities();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      await api.post('/posts', formData);
      setFormData({
        content: '',
        photo: '',
        communityId: formData.communityId, // Keep the selected community
      });
      setSuccess(true);
      if (onPostCreated) onPostCreated();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-post-form">
      <h2>Create a New Post</h2>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Post created successfully!</div>}
      
      <div className="form-group">
        <label htmlFor="communityId">Select Community</label>
        <select
          id="communityId"
          name="communityId"
          value={formData.communityId}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select a community</option>
          {communities.map(community => (
            <option key={community.id} value={community.id}>
              {community.category}
            </option>
          ))}
        </select>
      </div>
      
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={5}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="photo">Photo URL (optional)</label>
        <input
          type="text"
          id="photo"
          name="photo"
          value={formData.photo}
          onChange={handleChange}
          placeholder="https://example.com/image.jpg"
        />
      </div>
      
      <button type="submit" disabled={isSubmitting || !formData.content || !formData.communityId}>
        {isSubmitting ? 'Creating...' : 'Create Post'}
      </button>
    </form>
  );
};

export default CreatePostForm;