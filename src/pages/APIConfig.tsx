
import Layout from '@/components/Layout';
import APIKeyForm from '@/components/APIKeyForm';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const APIConfig = () => {
  const navigate = useNavigate();
  
  const handleApiConfigured = () => {
    navigate('/analyze');
  };
  
  return (
    <Layout>
      <div className="container max-w-2xl mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8">AI Provider Configuration</h1>
        
        <Tabs defaultValue="openai" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
            <TabsTrigger value="google">Google Gemini</TabsTrigger>
          </TabsList>
          
          <TabsContent value="openai">
            <APIKeyForm 
              provider="openai" 
              onConfigured={handleApiConfigured} 
            />
          </TabsContent>
          
          <TabsContent value="google">
            <APIKeyForm 
              provider="google" 
              onConfigured={handleApiConfigured} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default APIConfig;
