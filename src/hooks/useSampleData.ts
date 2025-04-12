
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { getSampleData, getAllSampleData, getSampleDataById } from '@/utils/supabaseService';
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
      
      // Load the specific sample by ID
      const specificSampleId = "68062195-5335-4e40-9ae5-ba15a20867ff";
      console.log(`Attempting to load sample with ID: ${specificSampleId}`);
      
      const dbSampleData = await getSampleDataById(specificSampleId);
      
      if (dbSampleData) {
        console.log('Sample data found:', dbSampleData);
        
        // Convert database fields to frontend format
        const formattedData = convertSampleDataToAppFormat(dbSampleData);
        console.log('Formatted data for UI:', formattedData);
        
        // Notify the component to update its state with the sample data
        onDataLoaded(formattedData);
        toast.success(`Sample "${dbSampleData.name}" loaded successfully`);
      } else {
        // Fallback to get all samples if the specific one is not found
        const allSamples = await getAllSampleData();
        console.log('Available samples:', allSamples);
        
        if (allSamples.length === 0) {
          toast.error("No sample data found in database.");
          console.error("No sample data found in database.");
          return;
        }
        
        // Use the first sample as fallback
        const fallbackSample = allSamples[0];
        console.log('Using fallback sample:', fallbackSample);
        
        const formattedData = convertSampleDataToAppFormat(fallbackSample);
        onDataLoaded(formattedData);
        toast.success(`Sample "${fallbackSample.name}" loaded successfully (fallback)`);
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
