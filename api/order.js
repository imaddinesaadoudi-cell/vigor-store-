// VIGOR Calisthenics Gear - Serverless Order API v1.0.1 (Live Production Sync)
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error("Missing GOOGLE_SHEETS_WEBHOOK_URL environment variable");
      return res.status(500).json({ error: "Server configuration error: missing webhook url" });
    }

    const orderData = req.body;

    // Forward order payload to Google Apps Script Webhook securely from the server
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: typeof orderData === 'string' ? orderData : JSON.stringify(orderData),
    });

    const result = await response.text();

    return res.status(200).json({
      success: true,
      message: "Order successfully synced to Google Sheets"
    });
  } catch (error) {
    console.error("Order processing error:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  }
}
