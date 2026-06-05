import { query } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    // Retrieve user
    const user = await query.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      // For security, return success even if user not found to prevent email enumeration
      console.log(`[Anna Seva Auth] Password reset requested for unregistered email: ${email}`);
      return Response.json({ 
        success: true, 
        message: 'If the email is registered, a password reset link has been logged to the console.' 
      });
    }

    // Generate token and 1-hour expiry
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Update user in database
    await query.run(
      'UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?', 
      [token, expiry, user.id]
    );

    // Print the reset link to the console
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    console.log('\n======================================================');
    console.log(`[Anna Seva Auth] PASSWORD RESET LINK FOR ${email}:`);
    console.log(resetLink);
    console.log('======================================================\n');

    return Response.json({ 
      success: true, 
      message: 'If the email is registered, a password reset link has been logged to the console.' 
    });
  } catch (error) {
    console.error('[Anna Seva Auth] Error in forgot-password API:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
