import { query, hashPassword } from '@/lib/db';
import { setSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const hashed = hashPassword(password);
    const user = await query.get('SELECT * FROM users WHERE email = ? AND password = ?', [email, hashed]);

    if (!user) {
      return Response.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (user.status !== 'approved') {
      if (user.status === 'pending') {
        return Response.json({ error: 'Your registration is pending approval by the administrator.' }, { status: 403 });
      } else if (user.status === 'rejected') {
        return Response.json({ error: 'Your registration has been rejected by the administrator.' }, { status: 403 });
      } else {
        return Response.json({ error: 'Your account is not approved.' }, { status: 403 });
      }
    }

    // Set the cookie session
    await setSession(user);

    // Don't return password
    const { password: _, ...safeUser } = user;
    return Response.json({ success: true, user: safeUser });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
