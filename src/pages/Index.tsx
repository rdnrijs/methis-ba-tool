
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApiKey } from '@/utils/storageUtils';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import InfoCard from '@/components/ui/InfoCard';
import APIKeyForm from '@/components/APIKeyForm';
import { Key, MessageSquare, Brain, ArrowRight, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const navigate = useNavigate();
  const [showApiConfig, setShowApiConfig] = useState(!getApiKey());
  
  const handleApiConfigured = () => {
    setShowApiConfig(false);
  };
  
  const handleStartAnalyzing = () => {
    if (getApiKey()) {
      navigate('/analyze');
    } else {
      setShowApiConfig(true);
    }
  };
  
  return <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter xl:text-6xl/none animate-slide-down animate-once sm:text-4xl">Transform Client Requests into AI-powered Requirements</h1>
                <p className="max-w-[750px] text-muted-foreground animate-slide-down animate-once animate-delay-100 text-left font-normal md:text-xl px-0">Accelerate business analysis with Methis's AI-powered requirements tool—built by consultants, for consultants. At Methis, we understand the unique challenges and language of your industry. This BA tool rapidly transforms complex client requests into clear, structured requirements, significantly shortening analysis cycles and enabling faster, more accurate project execution.</p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4 animate-slide-down animate-once animate-delay-200">
                <Button size="lg" className="group" onClick={handleStartAnalyzing}>
                  Start Analyzing
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center lg:justify-end animate-blur-in animate-once">
              {showApiConfig ? (
                <APIKeyForm onConfigured={handleApiConfigured} />
              ) : (
                <div className="relative w-full">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl opacity-50" />
                  <div className="relative aspect-video overflow-hidden rounded-3xl border border-border/50 bg-background shadow-xl">
                    <div className="p-6 md:p-10 space-y-4">
                      <div className="space-y-2">
                        <div className="h-2.5 w-24 bg-primary/30 rounded-full" />
                        <div className="h-5 w-48 bg-primary/20 rounded-lg" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-24 w-full bg-muted rounded-lg" />
                        <div className="h-4 w-32 bg-muted rounded-full" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="h-20 w-full bg-muted rounded-lg" />
                          <div className="h-4 w-20 bg-muted rounded-full" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-20 w-full bg-muted rounded-lg" />
                          <div className="h-4 w-28 bg-muted rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 md:py-24 bg-primary/5 border-y border-border/50">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Streamline Your Process?</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Start analyzing client requests and generating structured requirements in minutes.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4">
              <Button size="lg" className="group" onClick={handleStartAnalyzing}>
                Get Started
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>;
};
export default Index;
