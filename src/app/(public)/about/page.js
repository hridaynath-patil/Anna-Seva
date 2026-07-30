import { query } from '@/lib/db';
import AboutClient from './AboutClient';

export const revalidate = 0; // Disable cache for admin edits

export default async function AboutPage() {
  let aboutText = '';
  try {
    const page = await query.get("SELECT about_text FROM pages WHERE id = 'main'");
    aboutText = page ? page.about_text : 'Loading...';
  } catch (e) {
    aboutText = 'Failed to load page content.';
  }

  return <AboutClient dbAboutText={aboutText} />;
}
