import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const enquiries = await query.all('SELECT * FROM enquiries ORDER BY created_at DESC');
    return Response.json(enquiries);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, email, mobile, message } = await request.json();

    if (!name || !email || !mobile || !message) {
      return Response.json({ error: 'All fields are required' }, { status: 400 });
    }

    await query.run(`
      INSERT INTO enquiries (name, email, mobile, message, status)
      VALUES (?, ?, ?, ?, 'new')
    `, [name, email, mobile, message]);

    return Response.json({ success: true });
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
      return Response.json({ error: 'ID and status are required' }, { status: 400 });
    }

    await query.run('UPDATE enquiries SET status = ? WHERE id = ?', [status, id]);
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
      return Response.json({ error: 'Enquiry ID is required' }, { status: 400 });
    }

    await query.run('DELETE FROM enquiries WHERE id = ?', [id]);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
