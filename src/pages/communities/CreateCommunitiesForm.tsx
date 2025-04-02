// src/components/Communities/CreateCommunityForm.tsx
import React, { useState } from 'react';
import api from '../../api/axiosConfig';
import { CreateCommunityData } from '../../types';

interface CreateCommunityFormProps {
  onCommunityCreated?: () => void;
}

const CreateCommunityForm: React.FC<CreateCommunityFormProps> = ({ onCommunityCreated }) => {
  const [formData, setFormData] = useState<CreateCommunityData>({
    category: '',
    homePhoto: '',
    description: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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
    setSuccess(false);

    try {
      await api.post('/communities', formData);
      setFormData({
        category: '',
        homePhoto: '',
        description: '',
      });
      setSuccess(true);
      if (onCommunityCreated) onCommunityCreated();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create community');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-community-form">
      <h2>Create a New Community</h2>
      
      {error && <div className="error">{error}</div>}
      {success && <div className="success">Community created successfully!</div>}
      
      <div className="form-group">
        <label htmlFor="category">Category Name</label>
        <input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          placeholder="Technology, Gaming, Sports, etc."
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
          placeholder="Describe what this community is about..."
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="homePhoto">Banner Image URL (optional)</label>
        <input
          type="text"
          id="homePhoto"
          name="homePhoto"
          value={formData.homePhoto}
          onChange={handleChange}
          placeholder="https://example.com/banner.jpg"
        />
      </div>
      
      <button type="submit" disabled={isSubmitting || !formData.category.trim()}>
        {isSubmitting ? 'Creating...' : 'Create Community'}
      </button>
    </form>
  );
};

export default CreateCommunityForm;