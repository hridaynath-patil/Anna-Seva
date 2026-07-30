import { query } from '@/lib/db';
import HomePageClient from './HomePageClient';

export const revalidate = 0; // Live statistics on render

export default async function HomePage() {
  let donorCount = 0;
  let foodCount = 0;
  let completedCount = 0;

  try {
    donorCount = (await query.get("SELECT COUNT(*) as count FROM users WHERE role = 'donor'"))?.count || 0;
    foodCount = (await query.get("SELECT COUNT(*) as count FROM food_listings"))?.count || 0;
    completedCount = (await query.get("SELECT COUNT(*) as count FROM requests WHERE status = 'completed'"))?.count || 0;
  } catch (e) {
    console.error('Error fetching home stats:', e);
  }

  return (
    <HomePageClient 
      donorCount={donorCount}
      foodCount={foodCount}
      completedCount={completedCount}
    />
  );
}
