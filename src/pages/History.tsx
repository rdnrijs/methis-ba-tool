import { useAnalyze } from '@/contexts/AnalyzeContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft, Inbox, X } from 'lucide-react';

const formatDate = (timestamp: number) => {
  const d = new Date(timestamp);
  return d.toLocaleString(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const History = () => {
  const { recentResults, activateResult, activateLatestResult, removeResult, setShowInput } = useAnalyze();
  const navigate = useNavigate();

  const handleSelect = (idx: number) => {
    activateResult(idx);
    navigate('/analyze');
  };

  const handleBack = () => {
    if (recentResults.length > 0) {
      activateLatestResult();
      navigate('/analyze');
    } else {
      if (typeof setShowInput === 'function') setShowInput(true);
      navigate('/analyze');
    }
  };

  return (
    <Layout>
      <div className="py-8 max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <h1 className="text-2xl font-bold">History</h1>
        </div>
        {recentResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-16 text-muted-foreground">
            <Inbox className="h-12 w-12 mb-2 opacity-60" />
            <div className="text-lg font-medium mb-1">No history yet</div>
            <div className="text-sm">Your recent analyses will appear here.</div>
          </div>
        ) : (
          <div className="space-y-4">
            {recentResults.map((entry, idx) => (
              <Card
                key={idx}
                className="relative transition-shadow hover:shadow-lg cursor-pointer border-accent/40 focus-within:ring-2 focus-within:ring-accent group"
                tabIndex={0}
                onClick={() => handleSelect(idx)}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleSelect(idx)}
                aria-label={`Open analysis: ${entry.title || 'Untitled'}`}
              >
                <button
                  type="button"
                  className="absolute top-2 right-2 p-1 rounded hover:bg-accent/10 focus:bg-accent/20 text-muted-foreground opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
                  tabIndex={-1}
                  aria-label="Remove from history"
                  onClick={e => { e.stopPropagation(); removeResult(idx); }}
                >
                  <X className="h-4 w-4" />
                </button>
                <CardContent className="flex items-center gap-4 py-4">
                  <FileText className="h-7 w-7 text-accent shrink-0" />
                  <div className="flex-1 min-w-0">
                    {(() => {
                      // Suppress TS error: header is not in the type, but may exist in result
                      const headerArr = (entry.result && (entry.result as any).header && Array.isArray((entry.result as any).header)) ? (entry.result as any).header : null;
                      const header = headerArr ? headerArr[0] : null;
                      const title = header && header.title ? header.title : (entry.title || 'Untitled');
                      const label = header && header.label ? header.label : null;
                      return (
                        <>
                          <div className="font-medium text-lg flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 w-full">
                            <span
                              className="break-words w-full text-base sm:text-lg font-medium"
                              style={{ wordBreak: 'break-word', lineHeight: 1.3 }}
                            >
                              {title}
                            </span>
                            {label && (
                              <span
                                className="text-base sm:text-sm font-medium text-right whitespace-nowrap ml-auto pr-2"
                                style={{ color: '#d44d4d', maxWidth: 300, overflow: 'visible' }}
                              >
                                {label}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-0.5">{formatDate(entry.created)}</div>
                        </>
                      );
                    })()}
                  </div>
                  <span className="ml-2 text-accent/60">&#8594;</span>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default History; 