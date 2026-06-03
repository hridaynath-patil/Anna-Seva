import { cookies } from 'next/headers';

export async function getSession() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('fs_session');
  if (!sessionCookie) return null;
  try {
    const raw = Buffer.from(sessionCookie.value, 'base64').toString('utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export async function setSession(user) {
  const cookieStore = await cookies();
  const sessionData = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  };
  const value = Buffer.from(JSON.stringify(sessionData)).toString('base64');
  cookieStore.set('fs_session', value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/'
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set('fs_session', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });
}
