import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const pageData = await query.get('SELECT * FROM pages WHERE id = "main"');
    return Response.json(pageData || { about_text: '', contact_text: '' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { about_text, contact_text } = await request.json();

    if (about_text === undefined || contact_text === undefined) {
      return Response.json({ error: 'about_text and contact_text are required' }, { status: 400 });
    }

    await query.run(`
      UPDATE pages 
      SET about_text = ?, contact_text = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = 'main'
    `, [about_text, contact_text]);

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
