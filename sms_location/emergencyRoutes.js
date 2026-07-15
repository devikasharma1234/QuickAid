const express = require('express');
const router = express.Router();

// db passed in from your main app (Supabase client)
module.exports = (db) => {

  // Serve the page the SMS link points to
  router.get('/emergency/:requestId', async (req, res) => {
    const { requestId } = req.params;

    const { data, error } = await db
      .from('emergency_requests')
      .select('status')
      .eq('id', requestId)
      .single();

    if (error || !data) {
      return res.status(404).send('Invalid or expired link.');
    }
    if (data.status !== 'pending') {
      return res.send('This request has already been submitted. Help is on the way.');
    }

    res.sendFile(__dirname + '/public/location.html');
  });

  // Receive location + emergency details from the page
  router.post('/api/emergency/:requestId', async (req, res) => {
    const { requestId } = req.params;
    const { latitude, longitude, accuracy, cause } = req.body;

    if (latitude == null || longitude == null || !cause) {
      return res.status(400).json({ error: 'Missing location or cause of emergency.' });
    }

    const { error } = await db
      .from('emergency_requests')
      .update({
        latitude,
        longitude,
        accuracy,
        cause,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (error) {
      return res.status(500).json({ error: 'Failed to save emergency details.' });
    }

    // TODO: trigger your dispatch/routing engine here using PostGIS
    // e.g. find nearest available ambulance to (latitude, longitude)

    res.json({ success: true });
  });

  return router;
};