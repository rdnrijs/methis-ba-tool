
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import InfoCard from '@/components/ui/InfoCard';
import { 
  Key, 
  MessageSquare, 
  Brain, 
  ArrowRight, 
  Lightbulb, 
  Clock, 
  LineChart, 
  CheckCircle, 
  ChevronRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const FeatureCard = ({ 
  icon, 
  title, 
  description, 
  className 
}: { 
  icon: React.ReactNode, 
  title: string, 
  description: string,
  className?: string
}) => (
  <div className={cn(
    "bg-white dark:bg-black/20 p-6 rounded-xl border border-border/50 shadow-subtle hover-lift", 
    className
  )}>
    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-medium mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none animate-slide-down animate-once">
                  Transform Client Requests into Structured Requirements
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl animate-slide-down animate-once animate-delay-100">
                  Streamline your business analysis process with AI-powered requirements decomposition.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row pt-4 animate-slide-down animate-once animate-delay-200">
                <Button 
                  size="lg" 
                  className="group"
                  onClick={() => navigate('/analyze')}
                >
                  Start Analyzing
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center lg:justify-end animate-blur-in animate-once">
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
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 md:py-24 bg-accent/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2 animate-slide-up animate-once">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our AI-powered business analyst automates the conversion of client requests into structured requirement documents.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <InfoCard 
              title="1. Enter API Key" 
              description="Securely configure your OpenAI API key to power the analysis"
              icon={<Key className="h-6 w-6 text-primary" />}
              glassmorphism 
              animateIn
              delay="none"
              hoverEffect
            >
              <ul className="space-y-2 mt-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Secure local storage option</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Choose your preferred model</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Cost estimation and control</span>
                </li>
              </ul>
            </InfoCard>
            
            <InfoCard 
              title="2. Input Client Request" 
              description="Enter the client's requirements in natural language"
              icon={<MessageSquare className="h-6 w-6 text-primary" />}
              glassmorphism 
              animateIn
              delay="medium"
              hoverEffect
            >
              <ul className="space-y-2 mt-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Template suggestions available</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Additional context field</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Token usage estimation</span>
                </li>
              </ul>
            </InfoCard>
            
            <InfoCard 
              title="3. Review Analysis" 
              description="Get a structured breakdown of all requirements"
              icon={<Brain className="h-6 w-6 text-primary" />}
              glassmorphism 
              animateIn
              delay="long"
              hoverEffect
            >
              <ul className="space-y-2 mt-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Functional & non-functional requirements</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>User stories & acceptance criteria</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-4 w-4 mr-2 text-green-500 mt-0.5" />
                  <span>Follow-up questions for clarification</span>
                </li>
              </ul>
            </InfoCard>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Benefits</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Transform your requirements gathering process with AI assistance
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Clock className="h-5 w-5 text-primary" />}
              title="Save Time"
              description="Reduce the time spent on requirements documentation by up to 70%"
              className="animate-fade-in animate-once"
            />
            <FeatureCard
              icon={<Lightbulb className="h-5 w-5 text-primary" />}
              title="Improve Clarity"
              description="Get structured, well-organized requirements that reduce ambiguity"
              className="animate-fade-in animate-once animate-delay-100"
            />
            <FeatureCard
              icon={<LineChart className="h-5 w-5 text-primary" />}
              title="Increase Efficiency"
              description="Streamline your workflow from client request to development"
              className="animate-fade-in animate-once animate-delay-200"
            />
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
              <Button 
                size="lg" 
                className="group"
                onClick={() => navigate('/analyze')}
              >
                Get Started
                <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
