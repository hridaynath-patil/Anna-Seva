import { query } from '@/lib/db';
import { getSession } from '@/lib/auth';

export async function GET(request) {
  try {
    const session = await getSession();
    if (!session || session.role !== 'admin') {
      return Response.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const fromDate = searchParams.get('from_date'); // Format: YYYY-MM-DD
    const toDate = searchParams.get('to_date');     // Format: YYYY-MM-DD

    if (!fromDate || !toDate) {
      return Response.json({ error: 'Both from_date and to_date are required' }, { status: 400 });
    }

    // Standardize dates to start/end of day
    const startStr = `${fromDate} 00:00:00`;
    const endStr = `${toDate} 23:59:59`;

    // Fetch listings created in range
    const listings = query.all(`
      SELECT f.id, f.contact_person, f.food_items, f.status, f.created_at,
             s.name as state_name, c.name as city_name, u.name as donor_name
      FROM food_listings f
      JOIN states s ON f.state_id = s.id
      JOIN cities c ON f.city_id = c.id
      JOIN users u ON f.donor_id = u.id
      WHERE f.created_at >= ? AND f.created_at <= ?
      ORDER BY f.created_at DESC
    `, [startStr, endStr]);

    // Fetch requests created in range
    const requests = query.all(`
      SELECT r.id, r.requester_name, r.quantity, r.status, r.created_at,
             fl.food_items, s.name as state_name, c.name as city_name
      FROM requests r
      JOIN food_listings fl ON r.listing_id = fl.id
      JOIN states s ON r.state_id = s.id
      JOIN cities c ON r.city_id = c.id
      WHERE r.created_at >= ? AND r.created_at <= ?
      ORDER BY r.created_at DESC
    `, [startStr, endStr]);

    // Aggregate statistics
    const stats = {
      total_listings: listings.length,
      available_listings: listings.filter(l => l.status === 'available').length,
      claimed_listings: listings.filter(l => l.status === 'claimed').length,
      total_requests: requests.length,
      new_requests: requests.filter(r => r.status === 'new').length,
      approved_requests: requests.filter(r => r.status === 'approved').length,
      rejected_requests: requests.filter(r => r.status === 'rejected').length,
      completed_requests: requests.filter(r => r.status === 'completed').length
    };

    return Response.json({ stats, listings, requests });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
