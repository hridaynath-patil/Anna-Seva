import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const states = query.all('SELECT * FROM states ORDER BY name ASC');
    return Response.json(states);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { name } = await request.json();
    if (!name) {
      return Response.json({ error: 'State name is required' }, { status: 400 });
    }

    // Check duplicate
    const existing = query.get('SELECT id FROM states WHERE name = ?', [name]);
    if (existing) {
      return Response.json({ error: 'State already exists' }, { status: 400 });
    }

    query.run('INSERT INTO states (name) VALUES (?)', [name]);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'State ID is required' }, { status: 400 });
    }

    query.run('DELETE FROM states WHERE id = ?', [id]);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
