
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
      // Try to load using the exact name first
      let dbSampleData = await getSampleData("utility_sample");
      
      if (!dbSampleData) {
        // If not found, try to get all samples and find the one that contains "utility"
        const allSamples = await getAllSampleData();
        const utilitySample = allSamples.find(sample => 
          sample.name.toLowerCase().includes('utility')
        );
        
        if (utilitySample) {
          dbSampleData = utilitySample;
          console.log(`Found sample with name: ${utilitySample.name}`);
        }
      }
      
      if (dbSampleData) {
        const formattedData = convertSampleDataToAppFormat(dbSampleData);
        onDataLoaded(formattedData);
        toast("Utility sector sample data has been loaded");
      } else {
        toast.error("Sample data not found. Please check database configuration.");
        console.error("No utility sample data found in database. Please ensure a record with 'utility' in the name exists.");
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
