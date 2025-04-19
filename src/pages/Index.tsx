import { useNavigate } from 'react-router-dom';
import { getApiKey, getSelectedProvider } from '@/utils/storageUtils';
import Layout from '@/components/Layout';
import APIKeyForm from '@/components/APIKeyForm';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  
  const handleApiConfigured = () => {
    navigate('/analyze');
  };
  
  const handleStartClick = () => {
    // Scroll to API form or navigate to analyze if key exists
    if (getApiKey()) {
      navigate('/analyze');
    } else {
      // Scroll to API form
      document.getElementById('api-form-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <Layout>
      <div className="flex flex-col min-h-[80vh]">
        {/* Hero Section */}
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between py-10 gap-8">
          {/* Left column - Hero text */}
          <div className="flex-1 max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6">
              Transform Client Requests into AI-powered Requirements
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Accelerate business analysis with Methis's AI-powered requirements 
              tool—built by consultants, for consultants. At Methis, we understand 
              the unique challenges and language of your industry. This BA tool 
              rapidly transforms complex client requests into clear, structured 
              requirements, significantly shortening analysis cycles and enabling 
              faster, more accurate project execution.
            </p>
            <Button size="lg" onClick={handleStartClick} className="gap-2 px-8 py-6 text-lg bg-red-600 hover:bg-red-700">
              Start Analyzing
              <ArrowRight className="ml-1" />
            </Button>
          </div>

          {/* Right column - API form */}
          <div id="api-form-section" className="flex-1 w-full max-w-md">
            <APIKeyForm 
              onConfigured={handleApiConfigured} 
              provider={getSelectedProvider() as 'openai' | 'google'}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
