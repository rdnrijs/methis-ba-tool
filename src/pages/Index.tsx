
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiKey } from '@/utils/storageUtils';
import Layout from '@/components/Layout';
import APIKeyForm from '@/components/APIKeyForm';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // If API key is already configured, redirect to analyze
    if (getApiKey()) {
      navigate('/analyze');
    }
  }, [navigate]);
  
  const handleApiConfigured = () => {
    navigate('/analyze');
  };
  
  return (
    <Layout>
      <div className="flex items-center justify-center h-full min-h-[80vh] px-4">
        <APIKeyForm onConfigured={handleApiConfigured} />
      </div>
    </Layout>
  );
};

export default Index;
