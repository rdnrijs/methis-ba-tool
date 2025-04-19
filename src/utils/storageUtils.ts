// Basic secure storage utils (client-side only)
// For a production app, consider more secure options

// Get stored item with expiration check
export const getStoredItem = (key: string): string | null => {
  const storedData = localStorage.getItem(key);
  
  if (!storedData) return null;
  
  try {
    const { value, expires } = JSON.parse(storedData);
    
    // Check if data is expired
    if (expires && new Date().getTime() > expires) {
      localStorage.removeItem(key);
      return null;
    }
    
    return value;
  } catch (e) {
    console.error('Error parsing stored data:', e);
    return null;
  }
};

// Store item with optional expiration (in milliseconds)
export const storeItem = (key: string, value: string, expiresIn?: number): void => {
  try {
    const data = {
      value,
      expires: expiresIn ? new Date().getTime() + expiresIn : null,
    };
    
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Error storing data:', e);
  }
};

// Remove stored item
export const removeStoredItem = (key: string): void => {
  localStorage.removeItem(key);
};

// Check if an item exists in storage
export const hasStoredItem = (key: string): boolean => {
  return getStoredItem(key) !== null;
};

// Store selected AI provider
export const storeSelectedProvider = (provider: string): void => {
  localStorage.setItem('ai_provider', provider);
};

// Get selected AI provider
export const getSelectedProvider = (): string => {
  return localStorage.getItem('ai_provider') || 'openai';
};

// Securely store OpenAI API key (30 day expiration by default)
export const storeApiKey = (apiKey: string, remember: boolean = false): void => {
  // If remember is true, store for 30 days, otherwise use session storage
  if (remember) {
    // 30 days in milliseconds
    storeItem('openai_api_key', apiKey, 30 * 24 * 60 * 60 * 1000); 
  } else {
    // For session only, use sessionStorage instead
    sessionStorage.setItem('openai_api_key', apiKey);
  }
};

// Securely store Google API key (30 day expiration by default)
export const storeGoogleApiKey = (apiKey: string, remember: boolean = false): void => {
  // If remember is true, store for 30 days, otherwise use session storage
  if (remember) {
    // 30 days in milliseconds
    storeItem('google_api_key', apiKey, 30 * 24 * 60 * 60 * 1000); 
  } else {
    // For session only, use sessionStorage instead
    sessionStorage.setItem('google_api_key', apiKey);
  }
};

// Get stored OpenAI API key
export const getApiKey = (): string | null => {
  // First check session storage
  const sessionKey = sessionStorage.getItem('openai_api_key');
  if (sessionKey) return sessionKey;
  
  // Then check local storage with expiration
  return getStoredItem('openai_api_key');
};

// Get stored Google API key
export const getGoogleApiKey = (): string | null => {
  // First check session storage
  const sessionKey = sessionStorage.getItem('google_api_key');
  if (sessionKey) return sessionKey;
  
  // Then check local storage with expiration
  return getStoredItem('google_api_key');
};

// Get the current active API key based on selected provider
export const getCurrentApiKey = (): string | null => {
  const provider = getSelectedProvider();
  return provider === 'openai' ? getApiKey() : getGoogleApiKey();
};

// Clear the stored API keys
export const clearApiKeys = (): void => {
  sessionStorage.removeItem('openai_api_key');
  removeStoredItem('openai_api_key');
  sessionStorage.removeItem('google_api_key');
  removeStoredItem('google_api_key');
};

// Store the selected OpenAI model
export const storeSelectedModel = (model: string): void => {
  localStorage.setItem('openai_model', model);
};

// Get the selected OpenAI model
export const getSelectedModel = (): string => {
  return localStorage.getItem('openai_model') || 'gpt-4o';
};

// Custom prompt storage
export const getCustomPrompt = () => {
  return localStorage.getItem('openai-custom-prompt');
};

export const saveCustomPrompt = (prompt: string) => {
  localStorage.setItem('openai-custom-prompt', prompt);
};
