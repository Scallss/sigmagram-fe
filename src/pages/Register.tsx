import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from './auth/RegisterForm';
import { useAuth } from '../hooks/useAuth';

const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <RegisterForm />
        <div className="auth-redirect">
          Already have an account? <a href="/login">Login</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;