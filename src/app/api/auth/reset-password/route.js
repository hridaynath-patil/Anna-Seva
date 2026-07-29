import { query, hashPassword } from '@/lib/db';

export async function POST(request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return Response.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return Response.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    // Retrieve user by reset token
    const user = await query.get('SELECT * FROM users WHERE reset_token = ?', [token]);
    if (!user) {
      return Response.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    // Verify expiry
    const expiryDate = new Date(user.reset_token_expiry);
    if (isNaN(expiryDate.getTime()) || expiryDate < new Date()) {
      return Response.json({ error: 'Reset token has expired' }, { status: 400 });
    }

    // Hash new password and update user record
    const hashed = hashPassword(newPassword);
    await query.run(
      'UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?',
      [hashed, user.id]
    );

    return Response.json({ 
      success: true, 
      message: 'Your password has been successfully updated.' 
    });
  } catch (error) {
    console.error('[Anna Seva Auth] Error in reset-password API:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
