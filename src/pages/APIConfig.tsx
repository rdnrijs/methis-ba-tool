
import Layout from '@/components/Layout';
import APIKeyForm from '@/components/APIKeyForm';
import { useNavigate } from 'react-router-dom';

const APIConfig = () => {
  const navigate = useNavigate();
  
  const handleApiConfigured = () => {
    navigate('/analyze');
  };
  
  return (
    <Layout>
      <div className="container max-w-2xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8">API Configuration</h1>
        <APIKeyForm onConfigured={handleApiConfigured} />
      </div>
    </Layout>
  );
};

export default APIConfig;
