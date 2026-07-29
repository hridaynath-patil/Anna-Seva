import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    let requests;
    if (session.role === 'donor') {
      // Fetch only requests for food listings belonging to this specific donor
      requests = await query.all(`
        SELECT r.*, 
               fl.food_items, fl.contact_person as donor_contact, fl.mobile as donor_mobile, 
               s.name as state_name, c.name as city_name
        FROM requests r
        JOIN food_listings fl ON r.listing_id = fl.id
        JOIN states s ON r.state_id = s.id
        JOIN cities c ON r.city_id = c.id
        WHERE fl.donor_id = ?
        ORDER BY r.created_at DESC
      `, [session.id]);
    } else if (session.role === 'admin') {
      // Admin sees all requests with listing info, donor info, and requester details
      requests = await query.all(`
        SELECT r.*, 
               fl.food_items, fl.contact_person as donor_contact, fl.mobile as donor_mobile, 
               s.name as state_name, c.name as city_name,
               u.name as donor_name, u.email as donor_email
        FROM requests r
        JOIN food_listings fl ON r.listing_id = fl.id
        JOIN states s ON r.state_id = s.id
        JOIN cities c ON r.city_id = c.id
        JOIN users u ON fl.donor_id = u.id
        ORDER BY r.created_at DESC
      `);
    } else {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    return Response.json(requests);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { listing_id, requester_name, requester_mobile, address, state_id, city_id, reason, quantity } = await request.json();

    if (!listing_id || !requester_name || !requester_mobile || !address || !state_id || !city_id || !reason || !quantity) {
      return Response.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Verify the listing is available
    const listing = await query.get('SELECT status FROM food_listings WHERE id = ?', [listing_id]);
    if (!listing) {
      return Response.json({ error: 'Food listing not found' }, { status: 404 });
    }
    if (listing.status !== 'available') {
      return Response.json({ error: 'This food item is no longer available' }, { status: 400 });
    }

    await query.run(`
      INSERT INTO requests (listing_id, requester_name, requester_mobile, address, state_id, city_id, reason, quantity, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new')
    `, [listing_id, requester_name, requester_mobile, address, state_id, city_id, reason, quantity]);

    return Response.json({ success: true });
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

    const { id, status } = await request.json();

    if (!id || !status) {
      return Response.json({ error: 'Request ID and status are required' }, { status: 400 });
    }

    // Validate status value
    const validStatuses = ['new', 'approved', 'rejected', 'completed'];
    if (!validStatuses.includes(status)) {
      return Response.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Fetch the request and associated listing to verify ownership
    const requestItem = await query.get(`
      SELECT r.*, fl.donor_id, fl.id as listing_id
      FROM requests r
      JOIN food_listings fl ON r.listing_id = fl.id
      WHERE r.id = ?
    `, [id]);

    if (!requestItem) {
      return Response.json({ error: 'Request not found' }, { status: 404 });
    }

    // Auth validation: must be admin or the owner (donor) of the food listing
    if (session.role !== 'admin' && requestItem.donor_id !== session.id) {
      return Response.json({ error: 'Unauthorized to manage this request' }, { status: 403 });
    }

    // Update status
    await query.run('UPDATE requests SET status = ? WHERE id = ?', [status, id]);

    // Side effect: if status is 'completed' (food taken away),
    // mark the food listing status as 'claimed'
    if (status === 'completed') {
      await query.run("UPDATE food_listings SET status = 'claimed' WHERE id = ?", [requestItem.listing_id]);
    } else if (status === 'approved') {
      await query.run("UPDATE food_listings SET status = 'approved' WHERE id = ?", [requestItem.listing_id]);
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
