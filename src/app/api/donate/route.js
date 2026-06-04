export async function POST(request) {
  try {
    const { amount, name, email, mobile, pan } = await request.json();

    if (!amount || amount < 1) {
      return Response.json({ error: 'Minimum donation amount is ₹1' }, { status: 400 });
    }

    // Razorpay keys from environment variables
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      // Return a test/mock order for development
      return Response.json({
        id: 'order_dev_' + Date.now(),
        amount: amount * 100,
        currency: 'INR',
        status: 'created',
        key: 'rzp_test_placeholder',
        dev_mode: true
      });
    }

    // Create Razorpay order via their REST API
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const razorpayRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        amount: amount * 100, // Razorpay expects paisa
        currency: 'INR',
        receipt: `donation_${Date.now()}`,
        notes: {
          donor_name: name || '',
          donor_email: email || '',
          donor_mobile: mobile || '',
          donor_pan: pan || '',
          purpose: 'Anna Seva Charitable Donation'
        }
      })
    });

    if (!razorpayRes.ok) {
      const errorData = await razorpayRes.json();
      console.error('Razorpay order error:', errorData);
      return Response.json({ error: 'Failed to create payment order' }, { status: 500 });
    }

    const order = await razorpayRes.json();
    return Response.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      key: keyId
    });
  } catch (err) {
    console.error('Donate API error:', err);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
