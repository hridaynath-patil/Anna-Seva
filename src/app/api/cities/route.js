import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const stateId = searchParams.get('state_id');

    let cities;
    if (stateId) {
      cities = query.all(`
        SELECT c.*, s.name as state_name 
        FROM cities c 
        JOIN states s ON c.state_id = s.id 
        WHERE c.state_id = ? 
        ORDER BY c.name ASC
      `, [stateId]);
    } else {
      cities = query.all(`
        SELECT c.*, s.name as state_name 
        FROM cities c 
        JOIN states s ON c.state_id = s.id 
        ORDER BY c.name ASC
      `);
    }

    return Response.json(cities);
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

    const { state_id, name } = await request.json();
    if (!state_id || !name) {
      return Response.json({ error: 'State ID and City name are required' }, { status: 400 });
    }

    // Check duplicate in same state
    const existing = query.get('SELECT id FROM cities WHERE state_id = ? AND name = ?', [state_id, name]);
    if (existing) {
      return Response.json({ error: 'City already exists in this state' }, { status: 400 });
    }

    query.run('INSERT INTO cities (state_id, name) VALUES (?, ?)', [state_id, name]);
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
      return Response.json({ error: 'City ID is required' }, { status: 400 });
    }

    query.run('DELETE FROM cities WHERE id = ?', [id]);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
