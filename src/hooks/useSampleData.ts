
import { useState } from 'react';
import { toast } from "sonner";
import { getSampleData, getAllSampleData } from '@/utils/supabaseService';
import { convertSampleDataToAppFormat } from '../components/request/templates';

interface SampleData {
  clientRequest: string;
  stakeholders: string;
  systems: string;
  companyContext: string;
}

interface UseSampleDataReturn {
  isLoadingSample: boolean;
  loadSampleData: () => Promise<void>;
}

export const useSampleData = (
  onDataLoaded: (data: SampleData) => void
): UseSampleDataReturn => {
  const [isLoadingSample, setIsLoadingSample] = useState(false);
  
  const loadSampleData = async () => {
    setIsLoadingSample(true);
    try {
      console.log('Attempting to load sample data...');
      
      // Get all samples first to check what's available
      const allSamples = await getAllSampleData();
      console.log('Available samples:', allSamples);
      
      if (allSamples.length === 0) {
        toast.error("No sample data found in database.");
        console.error("No sample data found in database.");
        return;
      }
      
      // Try to find a utility sample through different methods
      let dbSampleData = allSamples.find(sample => 
        sample.name.toLowerCase() === 'utility_sample'
      );
      
      if (!dbSampleData) {
        dbSampleData = allSamples.find(sample => 
          sample.name.toLowerCase() === 'utility sample'
        );
      }
      
      if (!dbSampleData) {
        dbSampleData = allSamples.find(sample => 
          sample.name.toLowerCase().includes('utility')
        );
      }
      
      // If still no sample found, just take the first one
      if (!dbSampleData && allSamples.length > 0) {
        dbSampleData = allSamples[0];
        console.log('No utility sample found, using first available sample:', dbSampleData.name);
      }
      
      if (dbSampleData) {
        console.log('Sample data found:', dbSampleData);
        const formattedData = convertSampleDataToAppFormat(dbSampleData);
        console.log('Formatted data:', formattedData);
        onDataLoaded(formattedData);
        toast(`Sample data "${dbSampleData.name}" has been loaded`);
      } else {
        toast.error("Sample data not found. Please check database configuration.");
        console.error("No sample data found in database after multiple search attempts.");
      }
    } catch (error) {
      console.error('Error loading sample data:', error);
      toast.error("Failed to load sample data. See console for details.");
    } finally {
      setIsLoadingSample(false);
    }
  };
  
  return {
    isLoadingSample,
    loadSampleData
  };
};
