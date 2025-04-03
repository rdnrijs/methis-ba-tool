
import type { UserStoryItem } from '../UserStoryToggle';

export const formatDisplayText = (text: string | UserStoryItem): string => {
  if (typeof text === 'object' && text !== null && 'story' in text) {
    return text.story.replace(/\\n/g, '\n');
  }
  return String(text).replace(/\\n/g, '\n');
};
