import { ActivityDay } from "@/types/profile";

/**
 * Generate mock activity data for the last 365 days
 * Similar to GitHub's contribution graph
 */
export function generateActivityData(): ActivityDay[] {
  const activities: ActivityDay[] = [];
  const today = new Date();
  
  // Generate data for the last 365 days
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Random activity count (0-15) with some days having more activity
    let count = 0;
    const random = Math.random();
    
    if (random > 0.7) {
      // 30% chance of having activity
      count = Math.floor(Math.random() * 15) + 1;
    }
    
    // Determine level based on count
    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count >= 10) level = 4;
    else if (count >= 7) level = 3;
    else if (count >= 4) level = 2;
    else if (count >= 1) level = 1;
    
    activities.unshift({
      date: date.toISOString().split('T')[0],
      count,
      level,
    });
  }
  
  return activities;
}

