import { getSession } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ user: null });
    }

    // Fetch fresh user data from DB to reflect any edits (mobile, state, city)
    const user = query.get('SELECT id, name, email, role, mobile, address, state_id, city_id, created_at FROM users WHERE id = ?', [session.id]);
    
    if (!user) {
      return Response.json({ user: null });
    }

    return Response.json({ user });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { name, mobile, address, state_id, city_id } = await request.json();

    if (!name || !mobile || !address || !state_id || !city_id) {
      return Response.json({ error: 'All fields are required' }, { status: 400 });
    }

    query.run(`
      UPDATE users
      SET name = ?, mobile = ?, address = ?, state_id = ?, city_id = ?
      WHERE id = ?
    `, [name, mobile, address, state_id, city_id, session.id]);

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
