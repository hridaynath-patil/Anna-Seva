import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const donors = query.all(`
      SELECT u.id, u.name, u.email, u.mobile, u.address, s.name as state_name, c.name as city_name, u.status, u.created_at
      FROM users u
      LEFT JOIN states s ON u.state_id = s.id
      LEFT JOIN cities c ON u.city_id = c.id
      WHERE u.role = 'donor'
      ORDER BY u.created_at DESC
    `);

    return Response.json(donors);
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

    const { id, status } = await request.json();

    if (!id || !status) {
      return Response.json({ error: 'Donor ID and status are required' }, { status: 400 });
    }

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return Response.json({ error: 'Invalid status' }, { status: 400 });
    }

    const result = query.run("UPDATE users SET status = ? WHERE id = ? AND role = 'donor'", [status, id]);

    if (result.changes === 0) {
      return Response.json({ error: 'Donor not found' }, { status: 404 });
    }

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
      return Response.json({ error: 'Donor ID is required' }, { status: 400 });
    }

    // SQLite will cascade delete listings and requests if configured,
    // which our tables are!
    query.run("DELETE FROM users WHERE id = ? AND role = 'donor'", [id]);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
