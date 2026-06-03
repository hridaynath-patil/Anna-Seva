import { query, hashPassword } from '@/lib/db';
import { setSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const { name, email, password, mobile, address, state_id, city_id } = await request.json();

    if (!name || !email || !password) {
      return Response.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    // Check if user already exists
    const existing = query.get('SELECT id FROM users WHERE email = ?', [email]);
    if (existing) {
      return Response.json({ error: 'Email is already registered' }, { status: 400 });
    }

    const hashed = hashPassword(password);
    
    // Insert into users
    const result = query.run(`
      INSERT INTO users (name, email, password, role, mobile, address, state_id, city_id, status)
      VALUES (?, ?, ?, 'donor', ?, ?, ?, ?, 'pending')
    `, [name, email, hashed, mobile || null, address || null, state_id || null, city_id || null]);

    const newUser = query.get('SELECT * FROM users WHERE id = ?', [result.lastInsertRowid]);
    
    const { password: _, ...safeUser } = newUser;
    return Response.json({ success: true, user: safeUser, pendingApproval: true }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
