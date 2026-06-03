import { clearSession } from '@/lib/auth';

export async function POST() {
  try {
    await clearSession();
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
